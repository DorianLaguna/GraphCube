<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import * as THREE from 'three';
  import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
  
  // Referencia al div donde se montará el renderizador
  const modelo = ref(null);
  
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
    directionalLight.position.set(5, 5, 5).normalize();
    scene.add(directionalLight);
  
    const loader = new GLTFLoader();
  
    // Cargar modelo GLTF
    loader.load('/models/cube.glb', function (gltf) {
      const model = gltf.scene;
      model.position.set(-1, -3, 0);
      scene.add(model);
      // console.log('Modelo cargado y añadido a la escena:', model); // Mensaje de consola para depuración
    }, undefined, function (error) {
      console.error(error);
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