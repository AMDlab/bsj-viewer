import * as OBC from 'openbim-components';
import { useRef } from 'react';

export const useIFCLoader = () => {
  const fragmentManagerRef = useRef<OBC.FragmentManager>();
  const fragmentIfcLoaderRef = useRef<OBC.FragmentIfcLoader>();

  const setFragmentIFCLoader = async (
    components: OBC.Components,
    options: { toolbar: OBC.Toolbar }
  ) => {
    fragmentManagerRef.current = new OBC.FragmentManager(components);
    fragmentIfcLoaderRef.current = new OBC.FragmentIfcLoader(components);
    fragmentIfcLoaderRef.current.settings.wasm = {
      path: '/',
      absolute: true,
    };

    const ifcButton = fragmentIfcLoaderRef.current.uiElement.get('main');
    options.toolbar.addChild(ifcButton as OBC.Button);

    return fragmentIfcLoaderRef.current;
  };

  return { fragmentManagerRef, fragmentIfcLoaderRef, setFragmentIFCLoader };
};
