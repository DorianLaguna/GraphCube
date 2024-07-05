<script setup>
  import { ref, onMounted } from 'vue';
  import { useCanvaStore } from '@/stores/canva';
  import { useOrbStore } from '@/stores/orbs'

  const canvaStore = useCanvaStore()
  const orbsStore = useOrbStore()

  const angle = ref(canvaStore.degreesToRadians(75));
  const initialAngle = ref(0);
  
  const radiusOrbita = 410; // Radio de la órbita
  const stopAngle = ref(0);
  
  const dibujaOrbes = () => {


    // Actualizar el ángulo y detener la animación si ha recorrido 60 grados
    // angle.value += canvaStore.degreesToRadians(1)
    if (angle.value >= stopAngle.value) {
      return; // Detener la animación
    }

    // requestAnimationFrame(dibujaOrbes);
  };

  function setEjes(){
    xOrb = centerX + radiusOrbita * Math.cos(angle.value);
    yOrb = centerY + radiusOrbita * Math.sin(angle.value);
  }

  onMounted(() => {
    // Guardar el ángulo inicial y calcular el ángulo de detención
    setTimeout(()=>{

      // initialAngle.value = angle.value;
      // stopAngle.value = initialAngle.value + (270 * Math.PI / 180); // 60 grados en radianes
  
      // drawOrbits(); // Dibujar la órbita inicialmente
      dibujaOrbes(); // Iniciar la animación del orbe
    },1000)
  });
</script>

<template>
  
</template>
