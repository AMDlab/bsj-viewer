import * as OBC from 'openbim-components';
import { FragmentsGroup } from 'bim-fragment';
import { useRef } from 'react';

export const useIFCPropertiesProcessor = () => {
  const ifcPropertiesProcessorRef = useRef<OBC.IfcPropertiesProcessor>();
  const fragmentsGroup = useRef<FragmentsGroup>();

  const setIFCPropertiesProcessor = async (
    components: OBC.Components,
    options: {
      toolbar: OBC.Toolbar;
      highlighter: OBC.FragmentHighlighter;
      position?: { left?: number; top?: number };
      size?: { width?: number; height?: number };
      visible?: boolean;
    }
  ) => {
    ifcPropertiesProcessorRef.current = new OBC.IfcPropertiesProcessor(components);
    ifcPropertiesProcessorRef.current.uiElement.get('propertiesWindow').visible = !!options.visible;

    const highlighterEvents = options.highlighter.events;
    highlighterEvents.select.onClear.add(() => {
      ifcPropertiesProcessorRef.current!.cleanPropertiesList();
    });
    highlighterEvents.select.onHighlight.add((selection) => {
      if (!fragmentsGroup.current) return;

      const fragmentID = Object.keys(selection)[0];
      const expressID = Number(Array.from(selection[fragmentID])[0]);
      ifcPropertiesProcessorRef.current!.renderProperties(fragmentsGroup.current!, expressID);
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

    options.toolbar.addChild(ifcPropertiesProcessorRef.current.uiElement.get('main'));

    return ifcPropertiesProcessorRef.current;
  };

  const processFragmentGroup = (group: FragmentsGroup) => {
    ifcPropertiesProcessorRef.current?.process(group);
    fragmentsGroup.current = group;
  };

  return { ifcPropertiesProcessorRef, setIFCPropertiesProcessor, processFragmentGroup };
};
