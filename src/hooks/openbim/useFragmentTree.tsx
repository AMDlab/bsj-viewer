import * as OBC from 'openbim-components';
import { useRef } from 'react';

export const useFragmentTree = () => {
  const fragmentTreeRef = useRef<OBC.FragmentTree>();

  const setFragmentTree = async (
    components: OBC.Components,
    options: {
      toolbar: OBC.Toolbar;
      highlighter: OBC.FragmentHighlighter;
      position?: { left?: number; top?: number };
      size?: { width?: number; height?: number };
      visible?: boolean;
    }
  ) => {
    fragmentTreeRef.current = new OBC.FragmentTree(components);
    await fragmentTreeRef.current.init();
    fragmentTreeRef.current.uiElement.get('window').visible = !!options.visible;

    fragmentTreeRef.current.onSelected.add((filter) => {
      options.highlighter.highlightByID('select', filter, true, true);
    });
    fragmentTreeRef.current.onHovered.add((filter) => {
      options.highlighter.highlightByID('hover', filter);
    });

    const treeWindow = fragmentTreeRef.current.uiElement.get('window');
    if (options.position) {
      if (options.position.left) treeWindow.domElement.style.left = `${options.position.left}px`;
      if (options.position.top) treeWindow.domElement.style.top = `${options.position.top}px`;
    }

    if (options.size) {
      if (options.size.width) treeWindow.domElement.style.width = `${options.size.width}px`;
      if (options.size.height) treeWindow.domElement.style.height = `${options.size.height}px`;
    }

    options.toolbar.addChild(fragmentTreeRef.current.uiElement.get('main'));

    return fragmentTreeRef.current;
  };

  const updateFragmentTree = async (groupSystems: string[] = ['storeys', 'entities']) => {
    await fragmentTreeRef.current?.update(groupSystems);
  };

  return { fragmentTreeRef, setFragmentTree, updateFragmentTree };
};
