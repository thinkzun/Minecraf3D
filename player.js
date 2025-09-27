export class Player {
  constructor(camera, blocks){
    this.camera = camera;
    this.blocks = blocks;
    this.keys = {};
    this.pitch = 0;
    this.yaw = 0;
    this.velocityY = 0;
    this.gravity = -9.8;
    this.jumpStrength = 5;
    this.playerHeight = 1.6;
    this.playerRadius = 0.25;
    this.onGround = false;

    document.addEventListener('keydown', e => this.keys[e.code]=true);
    document.addEventListener('keyup', e => this.keys[e.code]=false);

    // Pointer lock
    const rendererCanvas = document.querySelector('canvas');
    rendererCanvas.addEventListener('click', () => rendererCanvas.requestPointerLock());
    document.addEventListener('mousemove', e => {
      if(document.pointerLockElement === rendererCanvas){
        this.yaw -= e.movementX * 0.002;
        this.pitch -= e.movementY * 0.002;
        this.pitch = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.pitch));
      }
    });
  }

  update(delta){
    const speed = 5 * delta;
    const direction = new THREE.Vector3();
    this.camera.getWorldDirection(direction);

    const forward = new THREE.Vector3(direction.x,0,direction.z).normalize();
    const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0,1,0)).normalize();

    let move = new THREE.Vector3();
    if(this.keys['KeyW']) move.add(forward.clone().multiplyScalar(speed));
    if(this.keys['KeyS']) move.add(forward.clone().multiplyScalar(-speed));
    if(this.keys['KeyA']) move.add(right.clone().multiplyScalar(-speed));
    if(this.keys['KeyD']) move.add(right.clone().multiplyScalar(speed));

    // Jump
    if(this.keys['Space'] && this.onGround){
      this.velocityY = this.jumpStrength;
      this.onGround = false;
    }

    // Gravity
    this.velocityY += this.gravity * delta;
    move.y = this.velocityY * delta;

    // Collision bounding box
    const playerBox = new THREE.Box3(
      new THREE.Vector3(this.camera.position.x - this.playerRadius, this.camera.position.y - this.playerHeight, this.camera.position.z - this.playerRadius),
      new THREE.Vector3(this.camera.position.x + this.playerRadius, this.camera.position.y, this.camera.position.z + this.playerRadius)
    );

    // X movement
    let testBox = playerBox.clone();
    testBox.translate(new THREE.Vector3(move.x, 0, 0));
    if(!this.blocks.some(b => b.intersectsBox(testBox))) this.camera.position.x += move.x;

    // Z movement
    testBox = playerBox.clone();
    testBox.translate(new THREE.Vector3(0, 0, move.z));
    if(!this.blocks.some(b => b.intersectsBox(testBox))) this.camera.position.z += move.z;

    // Y movement
    testBox = playerBox.clone();
    testBox.translate(new THREE.Vector3(0, move.y, 0));
    if(!this.blocks.some(b => b.intersectsBox(testBox))){
      this.camera.position.y += move.y;
      this.onGround = false;
    } else {
      this.velocityY = 0;
      this.onGround = true;
    }

    this.camera.rotation.set(this.pitch, this.yaw, 0);
  }
}
