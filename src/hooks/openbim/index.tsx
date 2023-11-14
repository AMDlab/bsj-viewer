import { RefObject, useEffect, useRef } from 'react';
import * as OBC from 'openbim-components';
export * from './setDirectionalLight';
export * from './useIFCLoader';
export * from './useFragmentTree';
export * from './useHighlighter';
export * from './useToolbar';
export * from './useFragmentClassifier';
export * from './useIFCPropertiesProcessor';
export * from './custom/roomHeightChecker/useRoomHeightChecker';
export * from './custom/programGenerator/useProgramGenerator';

const initComponents = async (container: HTMLElement) => {
  const components = new OBC.Components();
  components.scene = new OBC.SimpleScene(components);
  components.renderer = new OBC.PostproductionRenderer(components, container);
  components.camera = new OBC.SimpleCamera(components);
  components.raycaster = new OBC.SimpleRaycaster(components);

  await components.init();
  return components;
};

export type Options = {
  withGrid?: boolean;
  onInitialized?: (components: OBC.Components) => void | Promise<void>;
};

export default function useOBC(containerRed: RefObject<HTMLDivElement>, options: Options) {
  const componentsRef = useRef<OBC.Components>();
  const initializedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!containerRed.current) return;
    if (initializedRef.current) return;
    initializedRef.current = true;

    initComponents(containerRed.current).then(async (components) => {
      componentsRef.current = components;

      if (options.withGrid) new OBC.SimpleGrid(componentsRef.current);
      await options.onInitialized?.(componentsRef.current);
    });
  }, [containerRed, options]);

  return { componentsRef };
}
