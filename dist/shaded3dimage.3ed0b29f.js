// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"assets/js/shaded3dimage.js":[function(require,module,exports) {


/*import * as THREE from "three";  
import images from "./images";  
const loader = new THREE.TextureLoader();  
import vertex from "../shaders/shaders/vertex.glsl";  
import fragment from "../shaders/shaders/fragment.glsl";  
  
const texture1 = loader.load(images.me1);  
const texture2 = loader.load(images.me2);  
const texture3 = loader.load(images.me3);  
  
function lerp(start, end, t) {  
  return start * (1 - t) + end * t;  
}  
  
class Shaded {  
  constructor() {  
    this.container = document.querySelector(".landing");  
    this.inner = document.querySelector(".intro");  
    this.links = [...document.querySelectorAll("#shadedimg")];  
    this.targetX = 0;  
    this.targetY = 0;  
    this.scene = new THREE.Scene();  
    this.perspective = 1000;  
    this.sizes = new THREE.Vector2(0, 0);  
    this.offset = new THREE.Vector2(0, 0);  
    this.uniforms = {  
      uTexture: { value: texture1 },  
      uAlpha: { value: 0.0 },  
      uOffset: { value: new THREE.Vector2(0.0, 0.0) },  
      transparent: true,  
    };  
  
    this.links.map((link, i) => {  
      link.addEventListener("mouseenter", () => {  
        switch (i) {  
          case 0:  
            this.uniforms.uTexture.value = texture1;  
            break;  
          case 1:  
            this.uniforms.uTexture.value = texture2;  
            break;  
          case 2:  
            this.uniforms.uTexture.value = texture3;  
            break;  
        }  
      });  
      link.addEventListener("mouseleave", () => {  
        this.uniforms.uAlpha.value = lerp(this.uniforms.uAlpha.value, 0.0, 0.1);  
      });  
    });  
  
    this.checkHovered();  
    this.setupCamera();  
    this.followMouseMove();  
    this.createMesh();  
    this.render();  
  }  
  
  get viewport() {  
    let width = window.innerWidth;  
    let height = window.innerHeight;  
    let aspectRatio = width / height;  
    let pixelRatio = window.devicePixelRatio;  
    return { width, height, aspectRatio, pixelRatio };  
  }  
  
  checkHovered() {  
    this.inner.addEventListener("mouseenter", () => {  
      this.hovered = true;  
    });  
    this.inner.addEventListener("mouseleave", () => {  
      this.hovered = false;  
      this.uniforms.uTexture = { value: texture1 };  
    });  
  }  
  
  setupCamera() {  
    window.addEventListener("resize", this.onResize.bind(this));  
    let fov = (180 * (2 * Math.atan(this.viewport.height / 2 / this.perspective))) / Math.PI;  
    this.camera = new THREE.PerspectiveCamera(fov, this.viewport.aspectRatio, 0.1, 1000);  
    this.camera.position.set(0, 0, this.perspective);  
    // renderer  
    this.renderer = new THREE.WebGLRenderer({  
      antialias: true,  
      alpha: true,  
    });  
    this.renderer.setSize(this.viewport.width, this.viewport.height);  
    this.renderer.setPixelRatio(this.viewport.pixelRatio);  
    this.container.appendChild(this.renderer.domElement);  
  }  
  
  createMesh() {  
    this.geometry = new THREE.PlaneGeometry(0.7, 0.7, 20, 20);  
    this.material = new THREE.ShaderMaterial({  
      uniforms: this.uniforms,  
      vertexShader: vertex,  
      fragmentShader: fragment,  
      transparent: true,  
    });  
    this.mesh = new THREE.Mesh(this.geometry, this.material);  
    this.sizes.set(370, 470, 1);  
    this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);  
    this.mesh.position.set(this.offset.x, this.offset.y, 0);  
    this.scene.add(this.mesh);  
  }  
  
  followMouseMove() {  
    window.addEventListener("mousemove", (e) => {  
      this.targetX = e.clientX;  
      this.targetY = e.clientY;  
    });  
  }  
  
  onResize() {  
    this.camera.aspect = this.viewport.aspectRatio;  
    this.camera.fov = (180 * (2 * Math.atan(this.viewport.height / 2 / this.perspective))) / Math.PI;  
    this.renderer.setSize(this.viewport.width, this.viewport.height);  
    this.camera.updateProjectionMatrix();  
  }  
  
  render() {  
    this.offset.x = lerp(this.offset.x, this.targetX, 0.1);  
    this.offset.y = lerp(this.offset.y, this.targetY, 0.1);  
    this.uniforms.uOffset.value.set((this.targetX - window.innerWidth / 2) * 0.0003, -(this.targetY - window.innerHeight / 2) * 0.0003);  
    this.mesh.position.set(this.offset.x - window.innerWidth / 2, -this.offset.y + window.innerHeight / 2);  
    this.hovered  
     ? (this.uniforms.uAlpha.value = lerp(this.uniforms.uAlpha.value, 1.0, 0.1))  
      : (this.uniforms.uAlpha.value = lerp(this.uniforms.uAlpha.value, 0.0, 0.1));  
    this.renderer.render(this.scene, this.camera);  
    window.requestAnimationFrame(this.render.bind(this)); // Add this line to create an animation loop  
  }  
}  
  
new Shaded();  



/*import * as THREE from "three";
import images from "./images";
const loader = new THREE.TextureLoader()


import vertex from "../shaders/shaders/vertex.glsl";
import fragment from "../shaders/shaders/fragment.glsl";

const texture1 = loader.load(images.me1);
const texture2 = loader.load(images.me2);
const texture3 = loader.load(images.me3);
function lerp(start, end, t){
    return start * (1-t) + end * t;
}

class Shaded{
    constructor() {
        this.container = document.querySelector(".landing");
        this.inner = document.querySelector(".intro");
        this.links = [...document.querySelectorAll("#shadedimg")];
        this.targetX = 0;
        this.targetY = 0;

        this.scene = new THREE.Scene();
        this.perspective = 1000;
        this.sizes = new THREE.Vector2(0, 0);
        this.offset = new THREE.Vector2(0, 0);
        this.uniforms = {
            uTexture:{value: texture1},
            uAlpha: {value: 0.0},
            uOffset: {
                value: new THREE.Vector2(0.0, 0.0)
            },
            transparent: true,
        };
        this.links.map((link,i)=>{
            link.addEventListener('mouseenter', ()=>{
                switch(i){
                    case 0:
                        this.uniforms.uTexture.value = texture1;
                        break;
                    case 1:
                        this.uniforms.uTexture.value = texture2;
                        break;
                    case 2:
                        this.uniforms.uTexture.value = texture3;
                        break;
                }
            });
            link.addEventListener('mouseleave', ()=>{
                this.uniforms.uAlpha.value = lerp(this.uniforms.uAlpha.value, 0.0, 0.1);
            });
        });
        this.checkHovered();
        this.setupCamera();
        this.followMouseMove();
        this.createMesh();
        this.render();
    }

    get viewport(){
        let width = window.innerWidth;
        let height = window.innerHeight;
        let aspectRatio = width / height;
        let pixelRatio = window.devicePixelRatio;

        return{

            width,
            height,
            aspectRatio,
            pixelRatio,

        };
    }
    checkHovered(){
        this.inner.addEventListener('mouseenter' ,()=>{
            this.hovered = true;

        });
        this.inner.addEventListener('mouseleave' ,()=>{
            this.hovered = false;
            this.uniforms.uTexture = {value: texture1 };

        });

    }


    setupCamera(){
        window = addEventListener("resize", this.onResize.bind(this));
        let fov =
        (180 * (2 * Math.atan(this.viewport.height / 2 / this.perspective))) / Math.PI;

        this.camera = new THREE.PerspectiveCamera(
            fov,
            this.viewport.aspectRatio,
            0.1,
            1000
        );
        this.camera.position.set(0,0, this.perspective);

        //renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,

        });
        this.renderer.setSize(this.viewport.width, this.viewport.height);

        this.renderer.setPixelRatio(this.viewport.pixelRatio);

        this.container.appendChild(this.renderer.domElement);


    }
    createMesh(){
        this.geometry = new THREE.PlaneGeometry(1, 1, 20, 20);
        this.material = new THREE.ShaderMaterial( {

            uniforms: this.uniforms,
            vertexShader : vertex,
            fragmentShader : fragment,
            transparent: true,

        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.sizes.set(370, 470, 1);
        this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);
        this.mesh.position.set(this.offset.x, this.offset.y, 0);
        this.scene.add(this.mesh);
    }
    followMouseMove() {
        window.addEventListener('mousemove', (e)=>{
            this.targetX= e.clientX;
            this.targetY= e.clientY;

        })
    }
    onResize(){
        this.camera.aspect = this.viewport.aspectRatio;
        this.camera.fov =
        (180 * (2 * Math.atan(this.viewport.height / 2 / this.perspective))) / Math.PI;

        this.renderer.setSize(this.viewport.width, this.viewport.height);
        this.camera.updateProjectionMatrix();

    }
    render(){
        this.offset.x = lerp(this.offset.x, this.targetX, 0.1);
        this.offset.y = lerp(this.offset.y, this.targetY, 0.1);
        this.uniforms.uOffset.value.set((this.targetX-this.offset.x)*0.003, -(this.targetY-this.offset.y)* 0.003);
        this.mesh.position.set(this.offset.x-window.innerWidth/2, -this.offset.y+window.innerHeight/2);

        this.hovered ? (this.uniforms.uAlpha.value=lerp(this.uniforms.uAlpha.value, 1.0, .1)) :
        (this.uniforms.uAlpha.value=lerp(this.uniforms.uAlpha.value, 
            0.0,
            0.1

        ));
       this.renderer.render(this.scene, this.camera);
       window.requestAnimationFrame(this.render.bind(this));
    }
}

new Shaded();

*/
},{}]