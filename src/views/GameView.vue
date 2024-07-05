<script setup>
    import { ref, onMounted } from 'vue';
    import UpperCicles from '../components/UpperCicles.vue';
    import RightCicles from '../components/RightCicles.vue';
    import LeftCicles from '../components/LeftCicles.vue';
    import { useCanvaStore } from '@/stores/canva';

    const canvaStore = useCanvaStore()
  

    onMounted(() => {
      const canvasElement = document.getElementById('canvasField');
      canvaStore.setCanvas(canvasElement);
    });
    

</script>

<template>
    <div class="flex flex-col justify-center bg-gray-300">
        <canvas id="canvasField" width="1200" height="1200"></canvas>
        <!-- <UpperCicles /> 
        <RightCicles />
        <LeftCicles /> -->
    </div>
</template>
  
<style scoped>

</style>
  