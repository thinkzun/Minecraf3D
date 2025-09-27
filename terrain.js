import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';

export function createTerrain(scene){
  const blocks = [];
  const chunkSize = 20;
  const geometry = new THREE.BoxGeometry(1,1,1);

  for(let x=0;x<chunkSize;x++){
    for(let z=0;z<chunkSize;z++){
      const height = Math.floor(Math.random()*3)+1;
      for(let y=0;y<height;y++){
        const material = new THREE.MeshStandardMaterial({color:0x228B22});
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(x, y, z);
        scene.add(cube);
        blocks.push(new THREE.Box3().setFromObject(cube));
      }
    }
  }

  // Floor plane
  const planeGeometry = new THREE.PlaneGeometry(50,50);
  const planeMaterial = new THREE.MeshStandardMaterial({color:0x006400});
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI/2;
  plane.position.y = -0.5;
  scene.add(plane);
  blocks.push(new THREE.Box3().setFromObject(plane));

  return blocks;
}
