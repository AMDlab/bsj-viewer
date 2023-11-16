import * as OBC from 'openbim-components';
import { FragmentsGroup } from 'bim-fragment';
import {
  IFC2X3,
  IFCPROPERTYSET,
  IFCELEMENTQUANTITY,
  IFCRELDEFINESBYPROPERTIES,
  IFCRELDEFINESBYTYPE,
  IFCRELASSOCIATESMATERIAL,
  IFCRELCONTAINEDINSPATIALSTRUCTURE,
  IFCRELASSOCIATESCLASSIFICATION,
  IFCRELASSIGNSTOGROUP,
} from 'web-ifc';

interface IndexMap {
  [modelID: string]: { [expressID: string]: Set<number> };
}

type Room = {
  expressID: number;
  name: string;
  height: number;
  uiElement: OBC.SimpleUIComponent;
};

export class RoomHeightChecker extends OBC.Component<string> implements OBC.UI {
  enabled = true;
  uiElement = new OBC.UIElement<{
    main: OBC.Button;
    window: OBC.FloatingWindow;
    tree: OBC.TreeView;
    check: OBC.CheckboxInput;
  }>();

  private _fragmentsGroup: FragmentsGroup | undefined;
  private _indexMap: IndexMap;
  private _rooms: Room[] = [];
  private _unResidentialsRooms: Room[] = [];
  private _selected: OBC.SimpleUIComponent | null = null;
  private _onClickTreeItem: (ids: OBC.FragmentIdMap) => void = () => {};

  public set onClickTreeItem(value: (ids: OBC.FragmentIdMap) => void) {
    this._onClickTreeItem = value;
  }

  relationsToProcess = [
    IFCRELDEFINESBYPROPERTIES,
    IFCRELDEFINESBYTYPE,
    IFCRELASSOCIATESMATERIAL,
    IFCRELCONTAINEDINSPATIALSTRUCTURE,
    IFCRELASSOCIATESCLASSIFICATION,
    IFCRELASSIGNSTOGROUP,
  ];

  constructor(components: OBC.Components) {
    super(components);

    const main = new OBC.Button(components);
    main.materialIcon = 'height';
    main.tooltip = '居室の高さ判定します。';
    main.onClick.add(() => (mainwindow.visible = !mainwindow.visible));

    const mainwindow = new OBC.FloatingWindow(components);
    components.ui.add(mainwindow);
    mainwindow.title = '部屋一覧';
    mainwindow.visible = true;
    mainwindow.domElement.style.width = '700px';
    mainwindow.children[0].domElement.style.height = '100%';

    const check = new OBC.CheckboxInput(components);
    check.label = '非居室も表示';
    check.domElement.style.marginLeft = '10px';
    check.onChange.add((data) => {
      if (data) {
        this._unResidentialsRooms.forEach((room) => {
          room.uiElement.visible = true;
        });
        return;
      }
      this._unResidentialsRooms.forEach((room) => {
        room.uiElement.visible = false;
      });
    });
    mainwindow.addChild(check);

    const tree = new OBC.TreeView(components);
    tree.domElement.style.height = '100%';
    tree.title = 'モデルがありません。';
    mainwindow.addChild(tree);

    const button = new OBC.Button(components);
    button.label = '居室高さ判定';
    button.domElement.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
    button.domElement.style.borderRadius = '4px';
    button.domElement.style.cursor = 'pointer';
    button.domElement.style.marginLeft = 'auto';
    button.onClick.add(() => this.checkRoomHeight());
    mainwindow.addChild(button);

    this.uiElement.set({ main, window: mainwindow, tree, check });
    this._indexMap = {};
  }

  get() {
    return 'room-height-checker';
  }

  checkRoomHeight() {
    if (!this._fragmentsGroup) {
      alert('モデルがロードされていません。');
      return;
    }
    alert('居室高さ判定を実行します。');
    fetch(`${process.env.NEXT_PUBLIC_NODE_RED_URL}/room-height-check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rooms: this._rooms.map((room) => {
          return { name: room.name, height: room.height };
        }),
      }),
    })
      .then((res) => res.json())
      .then((results) => {
        results.forEach((result: any) => {
          const room = this._rooms.find((room) => room.name === result.name);
          if (room) {
            room.uiElement.domElement.innerText = `${room?.name}: ${result.result}`;
            room.uiElement.domElement.style.color = result.result === 'OK' ? 'green' : 'red';
          }
        });
      })
      .catch(console.error);
  }

  setFragmentGroup(fragmentsGroup: FragmentsGroup) {
    (this.uiElement.get('tree') as OBC.TreeView).title = fragmentsGroup.name;
    this._fragmentsGroup = fragmentsGroup;
    const properties = fragmentsGroup.properties;
    if (!properties) throw new Error('FragmentsGroup properties not found');
    this._indexMap[fragmentsGroup.uuid] = {};

    const setEntities = [IFCPROPERTYSET, IFCELEMENTQUANTITY];
    for (const relation of this.relationsToProcess) {
      OBC.IfcPropertiesUtils.getRelationMap(properties, relation, (relationID, relatedIDs) => {
        const relationEntity = properties[relationID];
        if (!setEntities.includes(relationEntity.type))
          this.setEntityIndex(fragmentsGroup, relationID);
        for (const expressID of relatedIDs) {
          this.setEntityIndex(fragmentsGroup, expressID).add(relationID);
        }
      });
    }
    this.setRoom();
  }

  private setRoom() {
    if (!this._fragmentsGroup) {
      alert('モデルがロードされていません。');
      return;
    }
    if (!this._fragmentsGroup!.properties) {
      console.log('No properties');
    }
    const map = this._indexMap[this._fragmentsGroup!.uuid];
    if (!map) return null;
    const tree = this.uiElement.get('tree') as OBC.TreeView;
    const check = this.uiElement.get('check') as OBC.CheckboxInput;
    Object.values(this._fragmentsGroup!.properties as any).forEach((property: any) => {
      if (property.constructor.name == 'IfcSpace') {
        const space = property as IFC2X3.IfcSpace;
        const indices = map[space.expressID];
        if ((space.InteriorOrExteriorSpace as any).value == 'INTERNAL') {
          const name = space.LongName?.value || '';
          if (indices) {
            indices.forEach((index) => {
              if (!this._fragmentsGroup!.properties) return;

              const pset = this.cloneProperty(this._fragmentsGroup!.properties[index]);
              if (!pset) return;

              this.getPsetProperties(pset, this._fragmentsGroup!.properties);
              this.getNestedPsets(pset, this._fragmentsGroup!.properties);

              if (pset.Name.value === 'BSJ_Pset_BCC_Space') {
                const ceilingHight = pset.HasProperties.find(
                  (prop: any) => prop.value.Name.value === 'CeilingHight'
                );
                const habitable = pset.HasProperties.find(
                  (prop: any) => prop.value.Name.value === 'Habitable'
                );
                const item = new OBC.SimpleUIComponent(
                  this.components,
                  `<div class='my-1 hover:cursor-pointer hover:text-black transition-all'>${name}</div>`,
                  space.expressID.toString()
                );
                const fragmentMap: OBC.FragmentIdMap = {};
                const data = this._fragmentsGroup!.data[space.expressID];
                for (const key of data[0]) {
                  const fragmentID = this._fragmentsGroup!.keyFragments[key];
                  if (!fragmentMap[fragmentID]) {
                    fragmentMap[fragmentID] = new Set();
                  }
                  fragmentMap[fragmentID].add(String(space.expressID));
                }
                item.domElement.onclick = () => {
                  if (this._selected) {
                    this._selected.domElement.style.fontWeight = 'normal';
                  }
                  this._onClickTreeItem(fragmentMap);
                  item.domElement.style.fontWeight = 'bold';
                  this._selected = item;
                };
                item.domElement.style.paddingLeft = '35px';
                tree.addChild(item);
                if (habitable.value.NominalValue.value) {
                  this._rooms.push({
                    expressID: space.expressID,
                    name,
                    height: ceilingHight.value.NominalValue.value,
                    uiElement: item,
                  });
                } else {
                  item.visible = check.value;
                  item.domElement.style.color = 'cadetblue';
                  this._unResidentialsRooms.push({
                    expressID: space.expressID,
                    name,
                    height: ceilingHight.value.NominalValue.value,
                    uiElement: item,
                  });
                }
              }
            });
          }
        }
      }
    });
    tree.expand();
  }

  private setEntityIndex(model: FragmentsGroup, expressID: number) {
    if (!this._indexMap[model.uuid][expressID]) this._indexMap[model.uuid][expressID] = new Set();
    return this._indexMap[model.uuid][expressID];
  }

  private getPsetProperties(pset: { [p: string]: any }, props: any) {
    if (pset.HasProperties) {
      for (const property of pset.HasProperties) {
        const psetID = property.value;
        const result = this.cloneProperty(props[psetID]);
        property.value = { ...result };
      }
    }
  }

  private getNestedPsets(pset: { [p: string]: any }, props: any) {
    if (pset.HasPropertySets) {
      for (const subPSet of pset.HasPropertySets) {
        const psetID = subPSet.value;
        subPSet.value = this.cloneProperty(props[psetID]);
        this.getPsetProperties(subPSet.value, props);
      }
    }
  }

  private cloneProperty(item: { [name: string]: any }, result: { [name: string]: any } = {}) {
    if (!item) {
      return result;
    }
    for (const key in item) {
      const value = item[key];

      const isArray = Array.isArray(value);
      const isObject = typeof value === 'object' && !isArray && value !== null;

      if (isArray) {
        result[key] = [];
        const subResult = result[key] as any[];
        this.clonePropertyArray(value, subResult);
      } else if (isObject) {
        result[key] = {};
        const subResult = result[key];
        this.cloneProperty(value, subResult);
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  private clonePropertyArray(item: any[], result: any[]) {
    for (const value of item) {
      const isArray = Array.isArray(value);
      const isObject = typeof value === 'object' && !isArray && value !== null;

      if (isArray) {
        const subResult = [] as any[];
        result.push(subResult);
        this.clonePropertyArray(value, subResult);
      } else if (isObject) {
        const subResult = {} as any;
        result.push(subResult);
        this.cloneProperty(value, subResult);
      } else {
        result.push(value);
      }
    }
  }
}
