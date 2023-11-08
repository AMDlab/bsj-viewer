import { RefObject, useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as OBC from 'openbim-components';

const initComponents = (container: HTMLElement) => {
  const components = new OBC.Components();
  components.scene = new OBC.SimpleScene(components);
  components.renderer = new OBC.SimpleRenderer(components, container);
  components.camera = new OBC.SimpleCamera(components);
  components.raycaster = new OBC.SimpleRaycaster(components);
  components.init();
  return components;
};

export type Options = {
  withGrid?: boolean;
  onInitialized?: (components: OBC.Components) => void;
};

export default function useOBC(containerRed: RefObject<HTMLDivElement>, options: Options) {
  const componentsRef = useRef<OBC.Components>();

  useEffect(() => {
    if (!containerRed.current) return;
    if (!!componentsRef.current) return;

    componentsRef.current = initComponents(containerRed.current);

    if (options.withGrid) new OBC.SimpleGrid(componentsRef.current);
    options.onInitialized?.(componentsRef.current);
  }, [containerRed, options]);

  return { componentsRef };
}

export const setDirectionalLight = (
  components: OBC.Components,
  options: { position: { x: number; y: number; z: number }; intensity: number }
) => {
  const directionalLight = new THREE.DirectionalLight();
  directionalLight.position.set(options.position.x, options.position.y, options.position.z);
  directionalLight.intensity = options.intensity;
  components.scene.get().add(directionalLight);
};

export const setIFCLoader = (components: OBC.Components) => {
  let fragments = new OBC.FragmentManager(components);
  let fragmentIfcLoader = new OBC.FragmentIfcLoader(components);

  fragmentIfcLoader.settings.wasm = {
    path: '/',
    absolute: true,
  };

  const mainToolbar = new OBC.Toolbar(components, { name: 'Main Toolbar', position: 'bottom' });
  components.ui.addToolbar(mainToolbar);
  const ifcButton = fragmentIfcLoader.uiElement.get('main');
  mainToolbar.addChild(ifcButton as OBC.Button);

  return fragments;
};
