import * as OBC from 'openbim-components';
import { FragmentsGroup } from 'bim-fragment';
import { useRef } from 'react';
import { RoomHeightChecker } from './component';

export const useRoomHeightChecker = () => {
  const roomHeightCheckerRef = useRef<RoomHeightChecker>();
  const fragmentsGroup = useRef<FragmentsGroup>();

  const setRoomHeightChecker = (components: OBC.Components, options: { toolbar: OBC.Toolbar }) => {
    roomHeightCheckerRef.current = new RoomHeightChecker(components);

    options.toolbar.addChild(roomHeightCheckerRef.current.uiElement.get('main'));

    return roomHeightCheckerRef.current;
  };

  const setFragmentGroup = (group: FragmentsGroup) => {
    roomHeightCheckerRef.current?.setFragmentGroup(group);
    fragmentsGroup.current = group;
  };

  return { roomHeightCheckerRef, setRoomHeightChecker, setFragmentGroup };
};
