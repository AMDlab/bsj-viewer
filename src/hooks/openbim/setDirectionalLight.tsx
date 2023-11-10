import * as THREE from 'three';
import * as OBC from 'openbim-components';

export const setDirectionalLight = (
  components: OBC.Components,
  options: { position: { x: number; y: number; z: number }; intensity: number }
) => {
  const directionalLight = new THREE.DirectionalLight();
  directionalLight.position.set(options.position.x, options.position.y, options.position.z);
  directionalLight.intensity = options.intensity;
  components.scene.get().add(directionalLight);
};
