<script setup>
    import { ref, onMounted } from 'vue';
    import { useCanvaStore } from '@/stores/canva';

    const canvaStore = useCanvaStore()
  

    onMounted(() => {
      const canvasElement = document.getElementById('canvasField');
      canvaStore.setCanvas(canvasElement);
    });
    

</script>

<template>
    <div class="flex flex-col justify-center bg-gray-300 2xl:w-10/12">
        <canvas id="canvasField" width="1200" height="1200" class="w-full"></canvas>
    </div>
</template>
  
<style scoped>
    canvas {
        touch-action: none; /* Deshabilita el desplazamiento en dispositivos táctiles */
    }

</style>
  