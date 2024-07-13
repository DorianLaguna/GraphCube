import { ref, onMounted } from 'vue'
import { defineStore } from 'pinia'
import { useOrbStore } from './orbs';
import { useMathStore } from './maths';

export const useCanvaStore = defineStore('canva', () => {

  const orbStore = useOrbStore();
  const mathStore = useMathStore()
  const canvas = ref(null);
  const ctx = ref(null)
  const locationOrbs = ref([])
  const pi =  Math.PI;
  const radiusOrbita = 410; // Radio de la órbita

  const isDragging = ref(false)
  const xMouse = ref(0)
  const yMouse = ref(0)
  const pointReference = ref(null)
  const pivots = ref([])

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
    Object.entries(orbStore.cube).forEach(([caraName, cara]) => {
      let color = colors[i]
      cara.forEach((columna, columnaIndex) => {
        columna.forEach((punto, puntoIndex) => {
          const path = `${caraName}[${columnaIndex}][${puntoIndex}]`;
          const id = `${caraName}-${columnaIndex}-${puntoIndex}`;
          locationOrbs.value.push({x: punto.x, y: punto.y, path, id});
          dibujarOrbe(punto.x, punto.y, color);
        });
      });
      i++;
    });

  }

  function dibujarOrbe(x, y, color){
    ctx.value.beginPath();
    ctx.value.arc(x, y, 5, 0, 2 * pi);
    ctx.value.lineWidth = 20;
    ctx.value.strokeStyle = color;
    ctx.value.fillStyle = color;
    ctx.value.fill();
    ctx.value.stroke();
  };

  function setLocationMouse(e){
    const rect = canvas.value.getBoundingClientRect();
    // Calcula el factor de escala entre el tamaño visual y el tamaño real del canvas.value
    const scaleX = canvas.value.width / rect.width;
    const scaleY = canvas.value.height / rect.height;            

    // Calcula las coordenadas del mouse ajustadas por la escala
    xMouse.value = (e.clientX - rect.left) * scaleX;
    yMouse.value = (e.clientY - rect.top) * scaleY;
  }

  function setPivotes(pointData){
    let distancias = [];
    const centros = ['left', 'top', 'right'];

    centros.forEach(centro => {
      distancias.push(mathStore.calculateDistance(pointData.x, pointData.y, centerX.value[centro], centerY.value[centro]));
    });
    
    let alejado = mathStore.findNumberFar(distancias)
    centros.splice(alejado, 1);
    pivots.value.push({x:centerX.value[centros[0]],y:centerY.value[centros[0]]})
    pivots.value.push({x:centerX.value[centros[1]],y:centerY.value[centros[1]]})
  }

  // FUNCIONES DE EVENTOS
  function iniciarArrastre(event) {
    setLocationMouse(event);
    const range = 20;

    // Buscar si hay algún punto dentro del rango que el usuario está arrastrando
    const pointWithinRange = locationOrbs.value.find(point => {
      return (
        xMouse.value >= point.x - range && xMouse.value <= point.x + range &&
        yMouse.value >= point.y - range && yMouse.value <= point.y + range
      );
    });

    if (pointWithinRange) {
      isDragging.value = true;
      pointReference.value = pointWithinRange.path;
      // Obtener la información del punto de referencia en el cubo
      const pathParts = pointReference.value.split(/[\[\]\.]+/).filter(Boolean);
      const pointData = pathParts.reduce((acc, part) => acc[part], orbStore.cube);
      // Calcular y establecer los pivotes más cercanos
      pointReference.value = pointData
      setPivotes(pointData);
    }
  }

  // Función para manejar el movimiento durante el arrastre
  function moverCirculo(event) {
      if (isDragging.value) {
        setLocationMouse(event)
        let x = pointReference.value.x
        let y = pointReference.value.y

        //define pivote
        // pivot = 


        //get initial angule regard to pivote
        let angle = mathStore.calculateAngle(centerX.value.right, centerY.value.right,x,y);
        angle -= 3
        
        //define new coordinates of pointMoving
        let coordinates = mathStore.calculateCoordinates(centerX.value.right, centerY.value.right, 410 , angle)
        pointReference.value.x = coordinates.x;
        pointReference.value.y = coordinates.y;

        dibujarOrbesAll()
      }
  }

  // Función para manejar el fin del arrastre
  function finalizarArrastre() {
      isDragging.value = false;
      pivots.value = []
      console.log("Fin del arrastre");
  }

  
  return { 
    canvas,
    setCanvas,
    ctx,
    dibujarOrbita,
    dibujarOrbe,
  }
})
