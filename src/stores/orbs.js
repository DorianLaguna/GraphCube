import { ref } from 'vue'
import { defineStore } from 'pinia'
import dataJson from "@/intersection.json"
import { useCanvaStore } from './canva';
import { useMathStore } from './maths';

export const useOrbStore = defineStore('orbs', () => {

  const canvaStore = useCanvaStore()
  const mathStore = useMathStore();
    
  const locationsDefines = ref(null)
  locationsDefines.value = {
    frontal: [
      [{ x: 600, y: 390,   }, { x: 665, y: 428,   }, { x: 720, y: 476,   }],
      [{ x: 535, y: 428,   }, { x: 600, y: 458,   }, { x: 655, y: 497,   }],
      [{ x: 480, y: 476,   }, { x: 545, y: 497,   }, { x: 600, y: 530,   }]
    ],
    trasera: [
      [{ x: 480, y: 1043,   }, { x: 545, y: 1022,   }, { x: 600, y: 990,   }],
      [{ x: 535, y: 1091,   }, { x: 600, y: 1061,   }, { x: 655, y: 1022,   }],
      [{ x: 600, y: 1129,   }, { x: 665, y: 1091,   }, { x: 720, y: 1043,   }]
    ],
    superior: [
      [{ x: 1008, y:419,   }, { x: 1007, y: 494,   }, { x: 994, y: 566,   }],
      [{ x: 942, y: 382,   }, { x: 949, y: 453,   }, { x: 943, y: 520,   }],
      [{ x: 874, y: 358,   }, { x: 888, y: 425,   }, { x: 887, y: 489,   }]
    ],
    inferior: [
      [{ x: 386, y: 642,   }, { x: 436, y: 687,   }, { x: 492, y: 719,   }],
      [{ x: 372, y: 713,   }, { x: 430, y: 755,   }, { x: 491, y: 783,   }],
      [{ x: 371, y: 788,   }, { x: 437, y: 825,   }, { x: 505, y: 850,   }]
    ],
    izquierda: [
      [{ x: 191, y: 419,   }, { x: 257, y: 382,   }, { x: 325, y: 358,   }],
      [{ x: 192, y: 494,   }, { x: 249, y: 453,   }, { x: 311, y: 425,   }],
      [{ x: 205, y: 566,   }, { x: 256, y: 520,   }, { x: 312, y: 489,   }]
    ],
    derecha: [
      [{ x: 814, y: 642,   }, { x: 827, y: 713,   }, { x: 828, y: 788,   }],
      [{ x: 763, y: 687,   }, { x: 770, y: 755,   }, { x: 762, y: 825,   }],
      [{ x: 707, y: 719,   }, { x: 708, y: 783,   }, { x: 694, y: 850,   }]
    ]
  };

  const orbs = ref([]);

  const addPoint = point => {
    orbs.value.push(point)
  }

  const inRange = (x, y) => {
    const ran = 20;
    return orbs.value.findIndex(point => {
      return (
        x >= point.x - ran && x <= point.x + ran &&
        y >= point.y - ran && y <= point.y + ran
      );
    });
  };

  function setBackLocations(circle) {
    orbs.value.forEach(orb => {
      if (orb.cir1 === circle || orb.cir2 === circle) {
        orb.x = orb.xOrig;
        orb.y = orb.yOrig;
      }
    });
  }

  function OrderOrbs(indexDragging, indexOrbs, cicle, mouseX, mouseY){
    let values = []
    let locations = []
    
    indexOrbs.forEach(index => {
      locations.push({
        x: orbs.value[index].xOrig,
        y: orbs.value[index].yOrig,
        index: index,
        distante: mathStore.calculateDistance(orbs.value[index].xOrig,orbs.value[index].yOrig, mouseX,mouseY)
      })
      values.push({
        index:index,
        x: orbs.value[index].xOrig,
        y: orbs.value[index].yOrig,
        cir1: orbs.value[index].cir1,
        cir2: orbs.value[index].cir2,
      })
    });
    // Función para ordenar por distancia
    locations.sort((a, b) => a.distante - b.distante);

    let datos = mathStore.groupPointsInTriplets(values)

    //obtener angulo promedio y crear arreglo respecto a eso
    let pivot = mathStore.getPivotFromCicle(cicle)
    let valores = reorderArray(datos, indexDragging, pivot)
    console.log(datos)

    
    let IndexNearest = mathStore.findClosestIndex(valores,{x:mouseX, y:mouseY})

    //cambiar las ubicaciones originales
    let newCoordinates = rotateCoordinates(valores, IndexNearest)

    newCoordinates.forEach(subArray => {
      subArray.forEach(orb => {
        const indice = orb.index
        console.log(orbs.value[indice])
        orbs.value[indice].x = orb.x;
        orbs.value[indice].y = orb.y;
        orbs.value[indice].xOrig = orb.x;
        orbs.value[indice].yOrig = orb.y;
        orbs.value[indice].cir1 = orb.cir1;
        orbs.value[indice].cir2 = orb.cir2;
      })
    })

    
    // let i = 0
    // newCoordinates.forEach(s => {
    //   let colores = ['purple', 'red', 'green', 'black']
    //   canvaStore.dibujarOrbe(s.average.x, s.average.y, colores[i])
    //   i++
    // })

    let direction = getLocationMovement(indexDragging, valores[IndexNearest], pivot)

    //girarlos mientras se pintan
    // while(){

    // }
  
  }

  function rotateCoordinates(arr, targetIndex) {
    if(targetIndex == 0) return arr;
    // Extraer las ubicaciones x, y de todos los subíndices excepto el último (average)
    let allCoordinates = []

    for(let i = 0; i < 4; i++){
      for(let j = 0; j<3; j++){
        allCoordinates.push({x: arr[i][j].x, y: arr[i][j].y, cir1: arr[i][j].cir1, cir2: arr[i][j].cir2})
      }
    }

    // console.log(arr)
    console.log(allCoordinates)

    let split = (targetIndex*3)
    // console.log(split)
    
    const part1 = allCoordinates.slice(split);
    const part2 = allCoordinates.slice(0, split);

    const rotatedCoordinates = part1.concat(part2);

    let k = 0
    for(let i = 0; i < 4; i++){
      for(let j = 0; j<3; j++){
        // console.log(arr[i][j])
        arr[i][j].x = rotatedCoordinates[k].x
        arr[i][j].y = rotatedCoordinates[k].y
        arr[i][j].cir1 = rotatedCoordinates[k].cir1
        arr[i][j].cir2 = rotatedCoordinates[k].cir2
        // console.log(arr[i][j])
        // allCoordinates.push({x: arr[i][j].x, y: arr[i][j].y})
        k++
      }
    }

    return arr;
}

  function getLocationMovement(indexDragging, IndexNearest, pivot){
    const x1 = orbs.value[indexDragging].x
    const y1 = orbs.value[indexDragging].y

    const x2 = IndexNearest.average.x
    const y2 = IndexNearest.average.y

    let angle1 = mathStore.calculateAngle(pivot.x,pivot.y,x1,y1)
    let angle2 = mathStore.calculateAngle(pivot.x,pivot.y,x2,y2)
    
    if(angle1 < 0) angle1 = angle1 + 360
    if(angle2 < 0) angle2 = angle2 + 360

    return (angle1 > angle2) ? 'left' : 'right'
    //si el angulo arrastrado es mayor, el numero esta girando a la izquierda
    //si el angulo arrastrado es menor, el numero esta a la derecha
    
  }
  function reorderArray(arr, targetIndex, pivot) {
    // Calcula el promedio para cada subarreglo y lo asigna
    arr.forEach(subArray => {
        subArray.average = mathStore.calculateAveragePoint(subArray);
    });

    // Ordena los subarreglos por el ángulo respecto al pivot
    const sortedArr = arr.sort((a, b) => {
        const angleA = calculateAngle(pivot, a.average);
        const angleB = calculateAngle(pivot, b.average);
        return angleA - angleB;
    });

    // Encuentra el índice del subarreglo que contiene el targetIndex
    const foundIndex = sortedArr.findIndex(subArray => 
      subArray.some(item => item.index === targetIndex)
    );

    // Reordena para que el primer subarreglo sea el que contiene el targetIndex
    const part1 = sortedArr.slice(foundIndex);
    const part2 = sortedArr.slice(0, foundIndex);
    const reorderedArr = part1.concat(part2);

    // Reordenar los tres puntos dentro de su subarreglo respectivo según su ángulo
    reorderedArr.forEach(subArray => {
        subArray.sort((a, b) => {
            const angleA = calculateAngle(pivot, a);
            const angleB = calculateAngle(pivot, b);
            return angleA - angleB;
        });
    });

    return reorderedArr;
  }


  // Función para calcular el ángulo de un punto respecto al pivot
  function calculateAngle(pivot, point) {
      return Math.atan2(point.y - pivot.y, point.x - pivot.x);
  }

  function setLocationsIfCicleChange(cicle){
    if(canvaStore.cicleActual == null){
      canvaStore.setCicleActual(cicle)
      return;
    }
    if(canvaStore.cicleActual != cicle){
      setBackLocations(canvaStore.cicleActual)
      canvaStore.setCicleActual(cicle)
    }
  }

  function getLocationOriginal(index){
    return {x:orbs.value[index].xOrig, y: orbs.value[index].yOrig}
  }

  function setIntersection(){
    for(let i = 0; i < dataJson.length; i++){
      orbs.value[i].cir1 = dataJson[i].cir1
      orbs.value[i].cir2 = dataJson[i].cir2
    }
  }
  

    return { 
      locationsDefines,
      orbs,
      addPoint,
      inRange,
      getLocationOriginal,
      setIntersection,
      setBackLocations,
      setLocationsIfCicleChange,
      OrderOrbs,
    }
})