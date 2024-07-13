import { ref, onMounted } from 'vue'
import { defineStore } from 'pinia'
import { useOrbStore } from './orbs';
import { useMathStore } from './maths';

export const useCanvaStore = defineStore('canva', () => {

  const orbStore = useOrbStore();
  const mathStore = useMathStore()
  const canvas = ref(null);
  const ctx = ref(null)
  const pi =  Math.PI;
  const radiusOrbita = 410; // Radio de la órbita

  const isDragging = ref(false)
  const xMouse = ref(0)
  const yMouse = ref(0)
  const indexPointDragging = ref(null)
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
    dibujarOrbesAllStart()

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
    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
    dibujaOrbitas()
        orbStore.orbs.forEach((punto, puntoIndex) => {
          dibujarOrbe(punto.x, punto.y, punto.color);
        });

  }
  function dibujarOrbesAllStart(){
    const colors = ["red","orange","white","yellow", "blue","green"]
    let i = 0
    Object.entries(orbStore.locationsDefines).forEach(([caraName, cara]) => {
      let color = colors[i]
      cara.forEach((columna, columnaIndex) => {
        columna.forEach((punto, puntoIndex) => {
          const path = `${caraName}[${columnaIndex}][${puntoIndex}]`;
          orbStore.addPoint({x: punto.x, y: punto.y, path, color});
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
    
    //define pivots can be use
    let alejado = mathStore.findNumberFar(distancias)
    centros.splice(alejado, 1);
    pivots.value.push({x:centerX.value[centros[0]],y:centerY.value[centros[0]]})
    pivots.value.push({x:centerX.value[centros[1]],y:centerY.value[centros[1]]})
  }

  function findPivot(xOriginal,yOriginal){

    let distanceToRadio1 = mathStore.calculateDistance(xOriginal,yOriginal, pivots.value[0].x,pivots.value[0].y)
    let distanceToRadio2 = mathStore.calculateDistance(xOriginal,yOriginal, pivots.value[1].x, pivots.value[1].y)
    
    let distanceToMouse1 = mathStore.calculateDistance(xMouse.value,yMouse.value, pivots.value[0].x,pivots.value[0].y)
    let distanceToMouse2 = mathStore.calculateDistance(xMouse.value,yMouse.value, pivots.value[1].x, pivots.value[1].y)
    
    let distance1 = Math.abs(distanceToMouse1 - distanceToRadio1);
    let distance2 = Math.abs(distanceToMouse2 - distanceToRadio2);

    if(distance1 < distance2){
      return {
        x: pivots.value[0].x,
        y: pivots.value[0].y,
        distance:distanceToRadio1 
      }
    }else{
      return {
        x: pivots.value[1].x,
        y: pivots.value[1].y,
        distance:distanceToRadio2 
      }
    }
  }

  // FUNCIONES DE EVENTOS
  function iniciarArrastre(event) {
    setLocationMouse(event);

    // Buscar si hay algún punto dentro del rango que el usuario está arrastrando
    const index = orbStore.inRange(xMouse.value, yMouse.value)

    if (index >= 0) {
      isDragging.value = true;
      indexPointDragging.value = index;
      // Obtener la información del punto de referencia en el cubo
      let pointData = orbStore.getLocationOriginal(indexPointDragging.value)
      
      setPivotes(pointData);
    }
  }

  // Función para manejar el movimiento durante el arrastre
  function moverCirculo(event) {
      if (isDragging.value) {
        setLocationMouse(event)

        let location = orbStore.getLocationOriginal(indexPointDragging.value)
        let x = orbStore.orbs[indexPointDragging.value].x 
        let y = orbStore.orbs[indexPointDragging.value].y


        //define pivote
        let pivot = findPivot(location.x,location.y)

        console.log(pivot)


        //get initial angule regard to pivote
        let angle = mathStore.calculateAngle(pivot.x, pivot.y,x,y);
        angle -= 3
        
        let coordinates = mathStore.calculateCoordinates(pivot.x, pivot.y, pivot.distance , angle)
        //define new coordinates of pointMoving
        orbStore.orbs[indexPointDragging.value].y = coordinates.y;
        orbStore.orbs[indexPointDragging.value].x = coordinates.x;

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
