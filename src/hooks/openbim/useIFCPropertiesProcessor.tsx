import * as OBC from 'openbim-components';
import { FragmentsGroup } from 'bim-fragment';
import { useRef } from 'react';

export const useIFCPropertiesProcessor = () => {
  const ifcPropertiesProcessorRef = useRef<OBC.IfcPropertiesProcessor>();
  const fragmentsGroup = useRef<FragmentsGroup>();

  const setIFCPropertiesProcessor = async (
    components: OBC.Components,
    options: {
      title?: string;
      toolbar: OBC.Toolbar;
      highlighter: OBC.FragmentHighlighter;
      position?: { left?: number; top?: number };
      size?: { width?: number; height?: number };
      visible?: boolean;
    }
  ) => {
    ifcPropertiesProcessorRef.current = new OBC.IfcPropertiesProcessor(components);
    const propertyWindow = ifcPropertiesProcessorRef.current.uiElement.get(
      'propertiesWindow'
    ) as OBC.FloatingWindow;
    propertyWindow.visible = !!options.visible;
    if (options.title) propertyWindow.title = options.title;

    const highlighterEvents = options.highlighter.events;
    highlighterEvents.select.onClear.add(() => {
      ifcPropertiesProcessorRef.current!.cleanPropertiesList();
    });
    highlighterEvents.select.onHighlight.add((selection) => {
      if (!fragmentsGroup.current) return;

      const fragmentID = Object.keys(selection)[0];
      const expressID = Number(Array.from(selection[fragmentID])[0]);
      ifcPropertiesProcessorRef
        .current!.renderProperties(fragmentsGroup.current!, expressID)
        .then(() => {
          const tree = ifcPropertiesProcessorRef.current!.uiElement.get('propsList')
            .children[0] as OBC.TreeView;
          tree?.expand(true);
        });
    });

    const propertiesWindow = ifcPropertiesProcessorRef.current.uiElement.get('propertiesWindow');
    if (options.position) {
      if (options.position.left)
        propertiesWindow.domElement.style.left = `${options.position.left}px`;
      if (options.position.top) propertiesWindow.domElement.style.top = `${options.position.top}px`;
    }

    if (options.size) {
      if (options.size.width) propertiesWindow.domElement.style.width = `${options.size.width}px`;
      if (options.size.height)
        propertiesWindow.domElement.style.height = `${options.size.height}px`;
    }

    const mainButton = ifcPropertiesProcessorRef.current.uiElement.get('main') as OBC.Button;
    mainButton.tooltip = 'プロパティ';
    options.toolbar.addChild(mainButton);

    return ifcPropertiesProcessorRef.current;
  };

  const processFragmentGroup = (group: FragmentsGroup) => {
    ifcPropertiesProcessorRef.current?.process(group);
    fragmentsGroup.current = group;
  };

  return { ifcPropertiesProcessorRef, setIFCPropertiesProcessor, processFragmentGroup };
};
