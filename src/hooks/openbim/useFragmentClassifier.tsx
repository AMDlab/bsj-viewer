import * as OBC from 'openbim-components';
import { useRef } from 'react';

export const useFragmentClassifier = () => {
  const fragmentClassifierRef = useRef<OBC.FragmentClassifier>();

  const setFragmentClassifier = (components: OBC.Components) => {
    fragmentClassifierRef.current = new OBC.FragmentClassifier(components);

    return fragmentClassifierRef.current;
  };

  return { fragmentClassifierRef, setFragmentClassifier };
};
