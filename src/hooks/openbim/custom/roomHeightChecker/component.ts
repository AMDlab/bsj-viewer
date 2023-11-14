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

export class RoomHeightChecker extends OBC.Component<string> implements OBC.UI {
  enabled = true;
  uiElement = new OBC.UIElement<{ main: OBC.Button }>();

  private _fragmentsGroup: FragmentsGroup | undefined;
  private _indexMap: IndexMap;

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

    const button = new OBC.Button(components);
    button.materialIcon = 'height';
    button.tooltip = '居室の高さを確認します。';
    button.onClick.add(() => this.checkRoomHeight());
    this.uiElement.set({ main: button });
    this._indexMap = {};
  }

  get() {
    return 'room-height-checker';
  }

  setFragmentGroup(fragmentsGroup: FragmentsGroup) {
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
  }

  private checkRoomHeight() {
    if (!this._fragmentsGroup!.properties) {
      console.log('No properties');
    }
    const map = this._indexMap[this._fragmentsGroup!.uuid];
    if (!map) return null;

    const rooms: { name: string; height: number }[] = [];
    Object.values(this._fragmentsGroup!.properties as any).forEach((property: any) => {
      if (property.constructor.name == 'IfcSite') console.log(property);
      if (property.constructor.name == 'IfcSpace') {
        const space = property as IFC2X3.IfcSpace;
        const indices = map[space.expressID];
        if ((space.InteriorOrExteriorSpace as any).value == 'INTERNAL') {
          const name = space.LongName?.value || '';
          const height = space.ElevationWithFlooring?.value || 0;
          if (indices) {
            indices.forEach((index) => {
              if (!this._fragmentsGroup!.properties) return;

              const pset = this.cloneProperty(this._fragmentsGroup!.properties[index]);
              if (!pset) return;

              this.getPsetProperties(pset, this._fragmentsGroup!.properties);
              this.getNestedPsets(pset, this._fragmentsGroup!.properties);
            });
          }
          rooms.push({ name, height });
        }
      }
    });
    // FIXME: 高さ情報がIFCに入っていないため、仮の値を入力しています。
    alert(
      `これらの居室の確認を行います。\n\n${rooms
        .map((room) => `${room.name}: ${room.height}`)
        .join('\n')}`
    );
    fetch(`${process.env.NEXT_PUBLIC_NODE_RED_URL}/room-height-check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rooms }),
    })
      .then((res) => res.json())
      .then((results) =>
        alert(`${results.map((result: any) => `${result.name}: ${result.result}`).join('\n')}`)
      )
      .catch(console.error);
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
