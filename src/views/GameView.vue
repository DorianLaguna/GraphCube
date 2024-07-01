<script setup>
    import { ref, onMounted } from 'vue';
    import UpperCicles from '../components/UpperCicles.vue';

    const ctx = ref(null)
    const canvas = ref(null);
    let isDragging = false
    let offsetX = 0
    let offsetY = 0
    onMounted(() => {
        ctx.value = canvas.value.getContext('2d');
        dibujarCirculo(50,50);
        // Event listeners para el arrastre
        canvas.value.addEventListener('mousedown', iniciarArrastre);
        canvas.value.addEventListener('mousemove', moverCirculo);
        canvas.value.addEventListener('mouseup', finalizarArrastre);
        canvas.value.addEventListener('mouseleave', finalizarArrastre);
    });
  

    let angle = ref(0);
    const centerX = 300;
    const centerY = 300;
    const radius = 290;

    const dibujarCirculo = (xs,ys) => {
        // console.log(canvas)
        ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);

        // const x = centerX + radius * Math.cos(angle.value);
        // const y = centerY + radius * Math.sin(angle.value);
        const x = xs ;
        const y = ys ;

        ctx.value.beginPath();
        ctx.value.arc(x, y, 10, 0, 5 * Math.PI, false);
        ctx.value.lineWidth = 1;
        ctx.value.strokeStyle = 'black';
        ctx.value.stroke();

        angle.value += 0.03;
        // requestAnimationFrame(dibujarCirculo);
    };

    // Función para manejar el inicio del arrastre
    function iniciarArrastre(event) {
        const rect = canvas.value.getBoundingClientRect();
        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;
        isDragging = true;
        console.log(`Arrastre iniciado en (${offsetX}, ${offsetY})`);
    }

    // Función para manejar el movimiento durante el arrastre
    function moverCirculo(event) {
        if (isDragging) {
            const rect = canvas.value.getBoundingClientRect();
            const x = event.clientX - rect.left - offsetX;
            const y = event.clientY - rect.top - offsetY;
            dibujarCirculo(x, y);
            console.log(`Moviendo círculo a (${x}, ${y})`);
        }
    }

    // Función para manejar el fin del arrastre
    function finalizarArrastre() {
        isDragging = false;
        console.log("Fin del arrastre");
    }

    
</script>

<template>
    <div class="flex flex-col justify-center bg-indigo-400">
        <canvas ref="canvas" width="600" height="600"></canvas>
        <!-- <UpperCicles v-if="canvas != null" :canvas="canvas" /> -->
    </div>
</template>
  
<style scoped>
canvas {
    border: 1px solid black;
}
</style>
  