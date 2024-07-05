import { ref, onMounted } from 'vue'
import { defineStore } from 'pinia'
import { useOrbStore } from './orbs';

export const useCanvaStore = defineStore('canva', () => {

  const orbStore = useOrbStore();
  const canvas = ref(null);
  const ctx = ref(null)
  const locationOrbs = ref([])
  const pi =  Math.PI;
  const radiusOrbita = 410; // Radio de la órbita

  const isDragging = ref(false)
  const xMouse = ref(0)
  const yMouse = ref(0)

  const centerX = ref({
    left:420,
    top: 600,
    right:780
  })

  const centerY = ref({
    left: 760,
    top:448,
    right:760
  })
  
  // INICIA A MOSTRAR TODO
  const setCanvas = (element) => {
    canvas.value = element;
    ctx.value = element.getContext('2d');
        // Event listeners para el arrastre
    iniciarEventos()
    dibujaOrbitas()
    dibujarOrbesAll()

  }

  function iniciarEventos(){
    canvas.value.addEventListener('mousedown', iniciarArrastre);
    canvas.value.addEventListener('mousemove', moverCirculo);
    canvas.value.addEventListener('mouseup', finalizarArrastre);
  }

  function dibujarOrbita(x, y, radio) {
      ctx.value.beginPath();
      ctx.value.arc(x, y, radio, 0, 2 * pi);
      ctx.value.lineWidth = 7;
      ctx.value.strokeStyle = 'gray';
      ctx.value.stroke();
  };

  function dibujaOrbitas(){
    let radio = radiusOrbita
    for (let i = 0; i < 3; i++) {
      dibujarOrbita(centerX.value.left, centerY.value.left, radio);
      dibujarOrbita(centerX.value.top, centerY.value.top, radio);
      dibujarOrbita(centerX.value.right, centerY.value.right, radio);
      radio -= 60
    }
  }

  function dibujarOrbesAll(){
    const colors = ["red","orange","white","yellow", "blue","green"]
    let i = 0
    Object.values(orbStore.cube).forEach(cara => {
      let color = colors[i]
      cara.forEach(columna => {
        columna.forEach(punto => {
          locationOrbs.value.push({x:punto.x,y:punto.y})
          dibujarOrbe(punto.x, punto.y, color)
        });
      });
      i++
    });
  }

  function degreesToRadians(degrees) {
    return degrees * (pi / 180);
  }

  function dibujarOrbe(x, y, color){
    ctx.value.beginPath();
    ctx.value.arc(x, y, 5, 0, 2 * pi);
    ctx.value.lineWidth = 7;
    ctx.value.strokeStyle = color;
    ctx.value.fillStyle = color;
    ctx.value.fill();
    ctx.value.stroke();
  };

  function getLocationMouse(e){
    const rect = canvas.value.getBoundingClientRect();
    // Calcula el factor de escala entre el tamaño visual y el tamaño real del canvas.value
    const scaleX = canvas.value.width / rect.width;
    const scaleY = canvas.value.height / rect.height;            

    // Calcula las coordenadas del mouse ajustadas por la escala
    xMouse.value = (e.clientX - rect.left) * scaleX;
    yMouse.value = (e.clientY - rect.top) * scaleY;
  }

  // FUNCIONES DE EVENTOS
  function iniciarArrastre(event) {
    getLocationMouse(event)
    const range = 15;
    const withinRange = locationOrbs.value.some(point => {
      return (
          xMouse.value >= point.x - range && xMouse.value <= point.x + range &&
          yMouse.value >= point.y - range && yMouse.value <= point.y + range
      );
    });
    if (withinRange) {
        isDragging.value = true;
    }
  }

  // Función para manejar el movimiento durante el arrastre
  function moverCirculo(event) {
      if (isDragging.value) {
          getLocationMouse(event)
          // dibujarCirculo(x, y);
          // console.log(`Moviendo círculo a (${xMouse.value}, ${yMouse.value})`);
      }
  }

  // Función para manejar el fin del arrastre
  function finalizarArrastre() {
      isDragging.value = false;
      console.log("Fin del arrastre");
  }

  
  return { 
    canvas,
    setCanvas,
    ctx,
    degreesToRadians,
    dibujarOrbita,
    dibujarOrbe,
  }
})
