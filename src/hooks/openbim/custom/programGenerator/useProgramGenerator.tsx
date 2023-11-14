import * as OBC from 'openbim-components';
import { useRef } from 'react';
import { ProgramGenerator } from './component';

export const useProgramGenerator = () => {
  const programGeneratorRef = useRef<ProgramGenerator>();

  const setProgramGenerator = (components: OBC.Components, options: { toolbar: OBC.Toolbar }) => {
    programGeneratorRef.current = new ProgramGenerator(components);

    options.toolbar.addChild(programGeneratorRef.current.uiElement.get('main'));

    return programGeneratorRef.current;
  };

  return { programGeneratorRef, setProgramGenerator };
};
