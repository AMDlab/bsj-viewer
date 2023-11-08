'use client';

import { useRef } from 'react';
import useOBC, { setIFCLoader, setDirectionalLight } from '@/hooks/useOBC';
import * as OBC from 'openbim-components';

export default function Viewer() {
  const ref = useRef<HTMLDivElement>(null);
  const onInitialized = (components: OBC.Components) => {
    setDirectionalLight(components, { position: { x: 5, y: 10, z: 3 }, intensity: 1 });
    setIFCLoader(components);
  };
  useOBC(ref, { onInitialized, withGrid: true });

  return <div id="container" style={{ width: '100vw', height: '100vh' }} ref={ref} />;
}
