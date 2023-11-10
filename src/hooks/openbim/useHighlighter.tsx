import { useRef } from 'react';
import * as OBC from 'openbim-components';

export const useHighlighter = () => {
  const highlighterRef = useRef<OBC.FragmentHighlighter>();

  const setHighlighter = async (components: OBC.Components) => {
    const highlighter = new OBC.FragmentHighlighter(components);
    highlighterRef.current = highlighter;
    await highlighter.setup();

    const renderer = components.renderer as OBC.PostproductionRenderer;
    renderer.postproduction.enabled = true;
    renderer.postproduction.customEffects.outlineEnabled = true;

    highlighter.outlineEnabled = true;
    await highlighter.update();

    return highlighter;
  };

  return { highlighterRef, setHighlighter };
};
