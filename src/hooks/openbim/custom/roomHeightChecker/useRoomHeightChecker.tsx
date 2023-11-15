import * as OBC from 'openbim-components';
import { FragmentsGroup } from 'bim-fragment';
import { useRef } from 'react';
import { RoomHeightChecker } from './component';

export const useRoomHeightChecker = () => {
  const roomHeightCheckerRef = useRef<RoomHeightChecker>();
  const fragmentsGroup = useRef<FragmentsGroup>();

  const setRoomHeightChecker = (
    components: OBC.Components,
    options: {
      toolbar: OBC.Toolbar;
      highlighter: OBC.FragmentHighlighter;
      size?: { width?: number; height?: number };
    }
  ) => {
    roomHeightCheckerRef.current = new RoomHeightChecker(components);
    options.toolbar.addChild(roomHeightCheckerRef.current.uiElement.get('main'));

    const treeWindow = roomHeightCheckerRef.current.uiElement.get('window');
    if (options.size) {
      if (options.size.width) treeWindow.domElement.style.width = `${options.size.width}px`;
      if (options.size.height) treeWindow.domElement.style.height = `${options.size.height}px`;
    }

    roomHeightCheckerRef.current.onClickTreeItem = (fragmentIdMap) => {
      options.highlighter.highlightByID('select', fragmentIdMap, true, false);
    };

    return roomHeightCheckerRef.current;
  };

  const setFragmentGroup = (group: FragmentsGroup) => {
    roomHeightCheckerRef.current?.setFragmentGroup(group);
    fragmentsGroup.current = group;
  };

  return { roomHeightCheckerRef, setRoomHeightChecker, setFragmentGroup };
};
