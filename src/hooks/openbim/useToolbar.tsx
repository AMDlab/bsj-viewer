import * as OBC from 'openbim-components';
import { useRef } from 'react';

export const useToolbar = () => {
  const toolbarRef = useRef<OBC.Toolbar>();

  const setToolbar = async (
    components: OBC.Components,
    options: {
      name: string;
      position: 'top' | 'bottom';
    }
  ) => {
    toolbarRef.current = new OBC.Toolbar(components, options);
    components.ui.addToolbar(toolbarRef.current);

    return toolbarRef.current;
  };

  return { toolbarRef, setToolbar };
};
