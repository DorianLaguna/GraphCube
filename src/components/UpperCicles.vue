<script setup>
  import { ref, onMounted, defineProps } from 'vue';

  const props = defineProps({
    canvas: {
      type: Object,
      required: true
    }
  });

  let angle = ref(0);
  let initialAngle = ref(0);
  const centerX = 300;
  const centerY = 150;
  const radiusOrbita = 150; // Radio de la órbita
  const stopAngle = ref(0);

  const dibujarOrbita = () => {
    const ctx = props.canvas.getContext('2d');

    // Dibujar la órbita
    ctx.beginPath();
    ctx.arc(centerX, centerY, radiusOrbita, 0, 2 * Math.PI);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'red';
    ctx.stroke();
  };

  const dibujaOrbes = () => {
    const ctx = props.canvas.getContext('2d');
    // ctx.clearRect(0, 0, props.canvas.width, props.canvas.height);

    // Volver a dibujar la órbita
    dibujarOrbita();

    // Calcular la nueva posición del orbe
    const x = centerX + radiusOrbita * Math.cos(angle.value);
    const y = centerY + radiusOrbita * Math.sin(angle.value);

    // Dibujar el orbe
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'blue';
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.stroke();
    // Actualizar el ángulo y detener la animación si ha recorrido 60 grados
    angle.value += 0.05;
    if (angle.value >= stopAngle.value) {
      return; // Detener la animación
    }

    requestAnimationFrame(dibujaOrbes);
  };

  // Eventos de mouse para arrastrar y soltar el orbe
// canvas.addEventListener('mousedown', (event) => {
//   const rect = canvas.getBoundingClientRect();
//   const x = event.clientX - rect.left;
//   const y = event.clientY - rect.top;
//   const distance = Math.sqrt((x - orbeX) ** 2 + (y - orbeY) ** 2);
//   if (distance <= orbeRadius) {
//     isDragging = true;
//   }
// });

// canvas.addEventListener('mousemove', (event) => {
//   if (isDragging) {
//     const rect = canvas.getBoundingClientRect();
//     orbeX = event.clientX - rect.left;
//     orbeY = event.clientY - rect.top;
//     dibujar();
//   }
// });

// canvas.addEventListener('mouseup', () => {
//   if (isDragging) {
//     isDragging = false;
//     orbeX = centerX + radiusOrbita * Math.cos(angle);
//     orbeY = centerY + radiusOrbita * Math.sin(angle);
//     dibujar();
//   }
// });


  onMounted(() => {
    // Guardar el ángulo inicial y calcular el ángulo de detención
    initialAngle.value = angle.value;
    stopAngle.value = initialAngle.value + (180 * Math.PI / 180); // 60 grados en radianes

    dibujarOrbita(); // Dibujar la órbita inicialmente
    dibujaOrbes(); // Iniciar la animación del orbe
  });
</script>

<template>
  <div>Hola desde upper</div>
</template>
