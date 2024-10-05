<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import * as THREE from 'three';
  import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
  import {useSceneStore} from "@/stores/scene"

  // Referencia al div donde se montará el renderizador
  const scene = useSceneStore();
  const modelo = ref(null);
  const renderer = ref(new THREE.WebGLRenderer());

  const colorMaterials = ref({
    'yellow': new THREE.MeshBasicMaterial({ color: 0xffff00 }), // Amarillo
    'green': new THREE.MeshBasicMaterial({ color: 0x00ff00 }),  // Verde
    'blue': new THREE.MeshBasicMaterial({ color: 0x0000ff }),   // Azul Marino
    'white': new THREE.MeshBasicMaterial({ color: 0xffffff }),  // Blanco
    'orange': new THREE.MeshBasicMaterial({ color: 0xffa500 }), // Naranja
    'red': new THREE.MeshBasicMaterial({ color: 0xff0000 }),    // Rojo
    'black': new THREE.MeshBasicMaterial({ color: 0x000000 })   // Negro (para las caras internas)
  });

  onMounted(() => {
    const sceneObject = new THREE.Scene();
    scene.setVal(sceneObject)
    scene.scene.background = new THREE.Color('rgb(178,201,158)');

    const camera = new THREE.PerspectiveCamera(50, modelo.value.clientWidth / modelo.value.clientHeight, 1, 1000);

    // Ajustar el tamaño del renderizador al tamaño del div
    const setRendererSize = () => {
      if (modelo.value) {
        const width = modelo.value.clientWidth;
        const height = modelo.value.clientHeight;
        renderer.value.setSize(width, height);
        camera.aspect = width / height;
      }
    };

    setRendererSize(); // Inicialmente ajustar el tamaño del renderizador

    // Añadir el renderizador al elemento con el ID 'modelo'
    if (modelo.value) {
      modelo.value.appendChild(renderer.value.domElement);
    }

    // Luz ambiental

    // Luz direccional
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1).normalize();

    const loader = new GLTFLoader();

    // Cargar modelo GLTF
    const nameCubes = [

      {name:"cube000", x: 2, y: 2, z: -2}, {name:"cube100", x: 0, y: 2, z: -2}, {name:"cube200", x: -2, y: 2, z: -2},
      {name:"cube010", x: 2, y: 0, z: -2}, {name:"cube110", x: 0, y: 0, z: -2}, {name:"cube210", x: -2, y: 0, z: -2},
      {name:"cube020", x: 2, y: -2, z: -2},{name:"cube120", x: 0, y: -2, z: -2}, {name:"cube220", x: -2, y: -2, z: -2},

      {name:"cube001", x: 2, y: 2, z: 0}, {name:"cube101", x: 0, y: 2, z: 0}, {name:"cube201", x: -2, y: 2, z: 0},
      {name:"cube011", x: 2, y: 0, z: 0},                                      {name:"cube211", x: -2, y: 0, z: 0},
      {name:"cube021", x: 2, y: -2, z: 0},{name:"cube121", x: 0, y: -2, z: 0}, {name:"cube221", x: -2, y: -2, z: 0},

      {name:"cube002", x: 2, y: 2, z: 2}, {name:"cube102", x: 0, y: 2, z: 2}, {name:"cube202", x: -2, y: 2, z: 2},
      {name:"cube012", x: 2, y: 0, z: 2}, {name:"cube112", x: 0, y: 0, z: 2}, {name:"cube212", x: -2, y: 0, z: 2},
      {name:"cube022", x: 2, y: -2, z: 2},{name:"cube122", x: 0, y: -2, z: 2}, {name:"cube222", x: -2, y: -2, z: 2},
      
      // {name:"centro", x:0 , y: 0, z: 0}, 
    
    ];

    nameCubes.forEach(cube => {
      loader.load(`/models/${cube.name}.glb`, function (gltf) {
        const model = gltf.scene;
        scene.cubos.push(model)
        model.position.set(cube.x,cube.y,cube.z);
        // model.matrixAutoUpdate = false;
        // model.updateMatrix();

        // Aplicar el material a cada malla del modelo
        model.traverse((node) => {
          // console.log(node)
          if (node.isMesh) { // Verificar si el nodo es una malla
            if (colorMaterials.value[node.name]) {  // Verificar si el nombre del nodo tiene un color asociado
              node.material = colorMaterials.value[node.name]; // Asignar el material correspondiente
            }
          }
        });
        scene.scene.add(model);
      }, undefined, function (error) {
        console.error(error);
      });
    });

    //setear controles
    const controls = new OrbitControls(camera, renderer.value.domElement);
    camera.position.set(0, 0, 12);

    function animate() {
      requestAnimationFrame(animate);

      // required if controls.enableDamping or controls.autoRotate are set to true
      controls.update();

      const clone = scene.scene.clone()
      renderer.value.render(clone, camera);
      
    }
    animate();

    // Ajustar el tamaño del renderizador al cambiar el tamaño de la ventana
    const handleResize = () => {
      setRendererSize();

      const clone = scene.scene.clone()
      renderer.value.render(clone, camera);
    };
    window.addEventListener('resize', handleResize);

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    });
  });
</script>

<template>
    <div id="modelo" ref="modelo" class=" h-96">
      
    </div>
</template>