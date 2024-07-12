import * as THREE from "three";
import images from "./images";
const container = document.querySelector(".three_bg");

const loader = new THREE.TextureLoader();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    70, 
    window.innerWidth/window.innerHeight,
    0.1, //default value
    1000 //how far we can see

);
//the higher the value the element will be mmore far from us.

const renderer = new THREE.WebGLRenderer({
    antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);


//responsive
window.addEventListener('resize', ()=>{
   camera.aspect = window.innerWidth / window.innerHeight; 
   camera.updateProjectionMatrix();
   renderer.setSize(window.innerWidth, window.innerHeight);
});

const geometry = new THREE.PlaneGeometry(18, 10, 15, 9);
const material = new THREE.MeshBasicMaterial({
    //color: 0x0000FF,
    color: 0xff0000,
    //color: undefined,
    map:loader.load(images.bg4),
    //wireframe: true,

});
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);
camera.position.z = 5;

const count = geometry.attributes.position.count;
//console.log(count);
const clock = new THREE.Clock();


function animate() {
    const time = clock.getElapsedTime();
    console.log(time);

    for(let i=0; i<count; i++){
       const x = geometry.attributes.position.getX(i);
       const y = geometry.attributes.position.getY(i);

       const anim1 = 0.9 * Math.sin(x * time * .4);
       const anim2 = 0.25 * Math.sin(y + time * .4);


       geometry.attributes.position.setZ(i, /*-y * time * 2*/ anim1 + anim2);
       geometry.computeVertexNormals();
       geometry.attributes.position.needsUpdate = true;
    }
    requestAnimationFrame(animate);
    //mesh.rotation.x += 0.01;
    //mesh.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();


