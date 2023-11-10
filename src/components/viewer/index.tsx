'use client';

import { useRef } from 'react';
import useOBC, {
  setDirectionalLight,
  useIFCLoader,
  useHighlighter,
  useToolbar,
  useFragmentTree,
  useFragmentClassifier,
  useIFCPropertiesProcessor,
} from '@/hooks/openbim';
import * as OBC from 'openbim-components';
import { remToPx } from '@/utils/styles';

const defaultWindowVisibleMaxWidth = 600;
export default function Viewer() {
  const ref = useRef<HTMLDivElement>(null);
  const { setHighlighter } = useHighlighter();
  const { setToolbar } = useToolbar();
  const { setFragmentIFCLoader } = useIFCLoader();
  const { setFragmentTree, updateFragmentTree } = useFragmentTree();
  const { setFragmentClassifier } = useFragmentClassifier();
  const { setIFCPropertiesProcessor, processFragmentGroup } = useIFCPropertiesProcessor();

  const onInitialized = async (components: OBC.Components) => {
    setDirectionalLight(components, { position: { x: 5, y: 10, z: 3 }, intensity: 1 });
    const toolbar = await setToolbar(components, { name: 'main', position: 'bottom' });

    const fragmentClassifier = setFragmentClassifier(components);
    const fragmentIFCLoader = await setFragmentIFCLoader(components, { toolbar });
    fragmentIFCLoader.onIfcLoaded.add((data) => {
      fragmentClassifier.byStorey(data);
      fragmentClassifier.byEntity(data);
      updateFragmentTree(['storeys', 'entities']);
      processFragmentGroup(data);
    });

    const isWindowVisible = ref.current!.clientWidth > defaultWindowVisibleMaxWidth;
    const highlighter = await setHighlighter(components);
    const windowSize = {
      height: isWindowVisible ? ref.current!.clientHeight - remToPx(ref.current!, 2.4) : undefined,
    };
    const propertiesWindowPosition = isWindowVisible
      ? { left: ref.current!.clientWidth - 400 - remToPx(ref.current!, 1.25) }
      : { top: 280 };

    await setFragmentTree(components, {
      toolbar,
      highlighter,
      size: windowSize,
      visible: isWindowVisible,
    });
    await setIFCPropertiesProcessor(components, {
      toolbar,
      highlighter,
      position: propertiesWindowPosition,
      size: windowSize,
      visible: isWindowVisible,
    });
  };
  useOBC(ref, { onInitialized, withGrid: true });

  return <div id="container" style={{ width: '100vw', height: '100vh' }} ref={ref} />;
}
