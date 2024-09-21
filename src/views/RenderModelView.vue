<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import * as THREE from 'three';
  import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
  
  // Referencia al div donde se montará el renderizador
  const modelo = ref(null);
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
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('rgb(178,201,158)');
  
    const camera = new THREE.PerspectiveCamera(50, modelo.value.clientWidth/ modelo.value.clientHeight, 1, 1000);
    const renderer = new THREE.WebGLRenderer();
    
    // Ajustar el tamaño del renderizador al tamaño del div
    const setRendererSize = () => {
      if (modelo.value) {
        const width = modelo.value.clientWidth;
        const height = modelo.value.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
      }
    };
    
    setRendererSize(); // Inicialmente ajustar el tamaño del renderizador
    
    // Añadir el renderizador al elemento con el ID 'modelo'
    if (modelo.value) {
      modelo.value.appendChild(renderer.domElement);
    }
  
    // Luz ambiental
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
  
    // Luz direccional
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);
  
    const loader = new GLTFLoader();
  
    // Cargar modelo GLTF
    const nameCubes = ["cube000","cube100","cube200","cube010", "cube210","cube220", "cube110","cube020","cube120","cube001","cube011","cube021","cube022","cube012","cube002","cube101","cube102","cube112","cube122","cube222","cube212","cube202","cube201","cube211","cube221","cube121"];
    nameCubes.forEach(name => {
      loader.load(`/models/${name}.glb`, function (gltf) {
        const model = gltf.scene;
        model.position.set(-1, -4, 1);
        // Aplicar el material a cada malla del modelo
        model.traverse((node) => {
          console.log(node)
          if (node.isMesh) { // Verificar si el nodo es una malla
              if (colorMaterials.value[node.name]) {  // Verificar si el nombre del nodo tiene un color asociado
                  node.material = colorMaterials.value[node.name]; // Asignar el material correspondiente
              }
          }
      });
        scene.add(model);
        // console.log('Modelo cargado y añadido a la escena:', model); // Mensaje de consola para depuración
      }, undefined, function (error) {
        console.error(error);
      });
    });
    
    const controls = new OrbitControls( camera, renderer.domElement );
    camera.position.set( 0, 0, 12 );
    controls.update();
    function animate() {

      requestAnimationFrame( animate );

      // required if controls.enableDamping or controls.autoRotate are set to true
      controls.update();

      renderer.render( scene, camera );
    }
    animate()
    // Ajustar el tamaño del renderizador al cambiar el tamaño de la ventana
    const handleResize = () => {
      setRendererSize();
      renderer.render( scene, camera );
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