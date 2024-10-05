import { ref } from 'vue'
import { defineStore } from 'pinia'
import dataJson from "@/intersection.json"
import { useCanvaStore } from './canva';
import { useMathStore } from './maths';
import { useSceneStore } from './scene';

export const useOrbStore = defineStore('orbs', () => {

  const canvaStore = useCanvaStore()
  const mathStore = useMathStore();
  const sceneStore = useSceneStore();
    
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

  async function OrderOrbs(indexDragging, indexOrbs, cicle, mouseX, mouseY){
    let values = []
    
    indexOrbs.forEach(index => {
      values.push({
        index:index,
        x: orbs.value[index].xOrig,
        y: orbs.value[index].yOrig,
        cir1: orbs.value[index].cir1,
        cir2: orbs.value[index].cir2,
      })
    });
    //agrupar los orbes mediante puntos en trios
    let datos = mathStore.groupPointsInTriplets(values)

    // Obtener ángulo promedio y crear arreglo respecto a eso
    let pivot = mathStore.getPivotFromCicle(cicle)
    let valores = reorderArray(datos, indexDragging, pivot)
    
    // console.log(datos)
    // console.log(indexDragging)

    let IndexNearest = mathStore.findClosestIndex(valores, { x: mouseX, y: mouseY });

    // Cambiar las ubicaciones originales
    let { arr: newCoordinates, positionsMoved } = rotateCoordinates(valores, IndexNearest);
    // console.log('position ',positionsMoved)

    

    // Actualizar orbs con las nuevas coordenadas
    const indexes = [];
    newCoordinates.forEach(subArray => {
        subArray.forEach(orb => {
            const indice = orb.index;
            indexes.push(indice);
            orbs.value[indice].xOrig = orb.x;
            orbs.value[indice].yOrig = orb.y;
            orbs.value[indice].cir1 = orb.cir1;
            orbs.value[indice].cir2 = orb.cir2;
        });
    });

    // Animar orbs mientras se pintan
    animateOrbs(indexes, pivot);

    sceneStore.rotateCube(cicle, positionsMoved)

    if([1,3,4,6,7,9].includes(cicle) && positionsMoved > 0){
      await rotateSecundaryOrbs(positionsMoved, cicle)
    }
}

async function rotateSecundaryOrbs(positionsMoved, circle){
  let orbsSecundary = mathStore.getSecundaryOrbs(circle);
  getInformationOrb(orbsSecundary);
  let orbsRotate = orbsSecundary;
  let split
  if([4,1,7].includes(circle)){
    split = (positionsMoved * 2)
  }else{
    split = 8 - (positionsMoved * 2);
  }
  const part1 = orbsRotate.slice(split);
  const part2 = orbsRotate.slice(0, split);
  const orbsReordered = part1.concat(part2);

  let i = 0;

  orbsReordered.forEach(orb => {
    orbs.value[orb.index].xOrig = orbsSecundary[i].x;
    orbs.value[orb.index].yOrig = orbsSecundary[i].y;
  
    // Usar los valores temporales en lugar de acceder directamente a orbs.value[orbsSecundary[i].index]
    orbs.value[orb.index].cir1 = orbsSecundary[i].cir1;
    orbs.value[orb.index].cir2 = orbsSecundary[i].cir2;
  
    i++;
  });

  const moveStep = 5; // Ajusta este valor según la velocidad deseada

  // Función para verificar si todos los orbes están en su posición original
  const orbsInPlace = () => {
      return orbsReordered.every(orb => {
          return (
              Math.abs(orbs.value[orb.index].x - orbs.value[orb.index].xOrig) <= moveStep &&
              Math.abs(orbs.value[orb.index].y - orbs.value[orb.index].yOrig) <= moveStep
          );
      });
  }

  // Bucle que se ejecuta hasta que todos los orbes alcancen sus posiciones
  while(!orbsInPlace()) {
      orbsReordered.forEach(indice => {
          if(orbs.value[indice.index].x != orbs.value[indice.index].xOrig || orbs.value[indice.index].y != orbs.value[indice.index].yOrig) {
              let diffX = orbs.value[indice.index].xOrig - orbs.value[indice.index].x;
              let diffY = orbs.value[indice.index].yOrig - orbs.value[indice.index].y;

              let stepX = Math.sign(diffX) * Math.min(moveStep, Math.abs(diffX));
              let stepY = Math.sign(diffY) * Math.min(moveStep, Math.abs(diffY));

              orbs.value[indice.index].x += stepX;
              orbs.value[indice.index].y += stepY;
          }
      });

      canvaStore.dibujarOrbesAll();

      await delay(10);
  }
}
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function getInformationOrb(ubications){
    ubications.forEach( ubication => {
      const index = orbs.value.findIndex(item => item.xOrig === ubication.x && item.yOrig === ubication.y);
      ubication.index = index
      ubication.cir1 = orbs.value[index].cir1
      ubication.cir2 = orbs.value[index].cir2
    })
  }
  async function animateOrbs(indexes, pivot) {
    
    while (
      orbs.value[indexes[0]].x != orbs.value[indexes[0]].xOrig ||
      orbs.value[indexes[1]].x != orbs.value[indexes[1]].xOrig ||
      orbs.value[indexes[2]].x != orbs.value[indexes[2]].xOrig ||
      orbs.value[indexes[3]].x != orbs.value[indexes[3]].xOrig ||
      orbs.value[indexes[4]].x != orbs.value[indexes[4]].xOrig ||
      orbs.value[indexes[5]].x != orbs.value[indexes[5]].xOrig ||
      orbs.value[indexes[6]].x != orbs.value[indexes[6]].xOrig ||
      orbs.value[indexes[7]].x != orbs.value[indexes[7]].xOrig ||
      orbs.value[indexes[8]].x != orbs.value[indexes[8]].xOrig ||
      orbs.value[indexes[9]].x != orbs.value[indexes[9]].xOrig ||
      orbs.value[indexes[10]].x != orbs.value[indexes[10]].xOrig ||
      orbs.value[indexes[11]].x != orbs.value[indexes[11]].xOrig
    ) {
      
      indexes.forEach(indice => {
        if(orbs.value[indice].x != orbs.value[indice].xOrig){
          let angleAct = mathStore.calculateAngle(pivot.x, pivot.y, orbs.value[indice].x, orbs.value[indice].y)
          let angleOrig = mathStore.calculateAngle(pivot.x, pivot.y, orbs.value[indice].xOrig, orbs.value[indice].yOrig)

          if (Math.abs(angleOrig - angleAct) <= 5) {
            // Aquí entra si la diferencia entre los ángulos es de 5 grados o menos
            orbs.value[indice].x = orbs.value[indice].xOrig
            orbs.value[indice].y = orbs.value[indice].yOrig
          }else{
            if(angleAct < 0) angleAct = angleAct + 360
            if(angleOrig < 0) angleOrig = angleOrig + 360
  
            let direccion = mathStore.shortestAngleDirection(angleAct, angleOrig);
  
            if(direccion == 'sumar'){
              angleAct += 1
            }else{
              angleAct -= 1
            }
            
            let coordinates = mathStore.calculateCoordinates(pivot.x, pivot.y, pivot.distance, angleAct);
            // console.log(coordinates)
            orbs.value[indice].x = coordinates.x
            orbs.value[indice].y = coordinates.y
          }

        }
      });
      canvaStore.dibujarOrbesAll();
      await delay(2);
    }
    
  }
  

  function rotateCoordinates(arr, targetIndex) {
    if (targetIndex == 0) return { arr, positionsMoved: 0 };; // No hay rotación si el índice objetivo es 0

    // Extraer todas las ubicaciones x, y, cir1 y cir2
    let allCoordinates = [];

    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            allCoordinates.push({
                x: arr[i][j].x,
                y: arr[i][j].y,
                cir1: arr[i][j].cir1,
                cir2: arr[i][j].cir2
            });
        }
    }

    // Determina el punto de división
    let totalItems = allCoordinates.length;
    let split = (targetIndex * 3) % totalItems;
    
    // Divide y rota las coordenadas
    const part1 = allCoordinates.slice(split);
    const part2 = allCoordinates.slice(0, split);
    const rotatedCoordinates = part1.concat(part2);

    // Asigna las coordenadas rotadas a arr
    let k = 0;
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            arr[i][j].x = rotatedCoordinates[k].x;
            arr[i][j].y = rotatedCoordinates[k].y;
            arr[i][j].cir1 = rotatedCoordinates[k].cir1;
            arr[i][j].cir2 = rotatedCoordinates[k].cir2;
            k++;
        }
    }

    return { arr, positionsMoved: split/3 };
}



  function reorderArray(arr, targetIndex, pivot) {
    // Calcula el promedio para cada subarreglo y lo asigna
    arr.forEach(subArray => {
        subArray.average = mathStore.calculateAveragePoint(subArray);
    });

    // Ordena los subarreglos por el ángulo respecto al pivot
    const sortedArr = arr.sort((a, b) => {
        let angleA = calculateAngle(pivot, a.average);
        let angleB = calculateAngle(pivot, b.average);
        angleA = mathStore.normalizeAngle(angleA);
        angleB = mathStore.normalizeAngle(angleB);
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
      // Calcula los ángulos para cada punto en el subArray
      let angles = subArray.map(point => 
          mathStore.calculateAngle(pivot.x, pivot.y, point.x, point.y)
      );
  
      // Ordena los ángulos usando la función sortAngles
      let sortedAngles = mathStore.sortAngles(angles);
      // console.log(sortedAngles)
  
      // Reorganiza subArray basado en el orden de sortedAngles
      subArray.sort((a, b) => {
          let angleA = mathStore.calculateAngle(pivot.x, pivot.y, a.x, a.y);
          let angleB = mathStore.calculateAngle(pivot.x, pivot.y, b.x, b.y);
  
          angleA = mathStore.normalizeAngle(angleA);
          angleB = mathStore.normalizeAngle(angleB);
  
          // Encuentra las posiciones en sortedAngles
          let indexA = sortedAngles.indexOf(angleA);
          let indexB = sortedAngles.indexOf(angleB);
  
          return indexA - indexB;
      });
    });
    // console.log(reorderedArr)
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