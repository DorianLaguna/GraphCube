import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useMathStore = defineStore('math', () => {

    const pi =  Math.PI;

    function degreesToRadians(degrees) {
        return degrees * (pi / 180);
    }
    function radiansToDegrees(radians) {
        return radians * (180 / Math.PI);
    }

    function calculateDistance(x1,y1, x2,y2){
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    function findClosestIndex(arr, targetPoint) {
      // Calcula la distancia entre el promedio y el punto objetivo para cada subarreglo
      let minDistance = Infinity;
      let closestIndex = -1;
      arr.forEach((subArray, index) => {
          const average = subArray.average;

          const distance = calculateDistance(average.x, average.y, targetPoint.x, targetPoint.y);
  
          if (distance < minDistance) {
              minDistance = distance;
              closestIndex = index;
          }
      });
  
      return closestIndex;
  }
    
    function findNumberFar(distancias){
        // Calculate the absolute distances between each pair of numbers
        const distance1 = Math.abs(distancias[0] - distancias[1]);
        const distance2 = Math.abs(distancias[1] - distancias[2]);
        const distance3 = Math.abs(distancias[2] - distancias[0]);
    
        // Sum the distances for each number
        const sumDistancesNum1 = distance1 + distance3; // Distance of num1 to num2 and num3
        const sumDistancesNum2 = distance1 + distance2; // Distance of num2 to num1 and num3
        const sumDistancesNum3 = distance2 + distance3; // Distance of num3 to num1 and num2
    
        // Determine which of the numbers has the highest sum of distances
        const maxDistance = Math.max(sumDistancesNum1, sumDistancesNum2, sumDistancesNum3);
    
        if (maxDistance === sumDistancesNum1) {
          return 0;
        } else if (maxDistance === sumDistancesNum2) {
          return 1;
        } else {
          return 2;
        }
    }
    function calculateAngle(centerX, centerY, pointX, pointY) {
        const deltaX = pointX - centerX;
        const deltaY = pointY - centerY;
        let angle = radiansToDegrees(Math.atan2(deltaY, deltaX));
    
        return angle;
    }
    function calculateAngleRelative(centerX, centerY, point1X, point1Y, point2X, point2Y) {
        const delta1X = point1X - centerX;
        const delta1Y = point1Y - centerY;
        let angle1 = radiansToDegrees(Math.atan2(delta1Y, delta1X));

        const delta2X = point2X - centerX;
        const delta2Y = point2Y - centerY;
        let angle2 = radiansToDegrees(Math.atan2(delta2Y, delta2X));
    
        return angle1 - angle2;
    }
    function calculateCoordinates(centerX, centerY, radius, angle) {
      const radians = degreesToRadians(angle);
      const pointX = centerX + radius * Math.cos(radians);
      const pointY = centerY + radius * Math.sin(radians);
      return { x: pointX, y: pointY };
    }
    function groupAndSortByAngle(data) {
      // Dividir en conjuntos de 3
      let groups = [];
      for (let i = 0; i < data.length; i += 3) {
        let group = data.slice(i, i + 3);
        // Ordenar cada conjunto por ángulo
        group.sort((a, b) => a.angule - b.angule);
        groups.push(group);
      }
      // Combinar los conjuntos ordenados en una sola lista
      return groups.flat();
    }
    // Función para encontrar el par más cercano a un punto dado
    function findClosestPair(points, index) {
      let closestPair = [];
      let minDistance1 = Infinity, minDistance2 = Infinity;
      let closestIndex1, closestIndex2;
  
      for (let i = 0; i < points.length; i++) {
          if (i !== index) {
              let distance = calculateDistance(points[index].x, points[index].y, points[i].x, points[i].y);
              if (distance < minDistance1) {
                  minDistance2 = minDistance1;
                  closestIndex2 = closestIndex1;
                  minDistance1 = distance;
                  closestIndex1 = i;
              } else if (distance < minDistance2) {
                  minDistance2 = distance;
                  closestIndex2 = i;
              }
          }
      }
      closestPair.push(points[closestIndex1], points[closestIndex2]);
      return closestPair;
  }

    // Función para agrupar los puntos en conjuntos de tres
    function groupPointsInTriplets(points) {
      let triplets = [];
      let usedIndices = new Set();

      while (usedIndices.size < points.length) {
          let currentIndex = 0;
          while (usedIndices.has(currentIndex)) {
              currentIndex++;
          }
          
          let currentPoint = points[currentIndex];
          let closestPair = findClosestPair(points, currentIndex);
          let triplet = [currentPoint, ...closestPair];
          
          triplets.push(triplet);
          usedIndices.add(currentIndex);
          usedIndices.add(points.indexOf(closestPair[0]));
          usedIndices.add(points.indexOf(closestPair[1]));
      }

      return triplets;
    }
    function calculateAveragePoint(triplet) {
      let x = 0;
      let y = 0;
      triplet.forEach(point => {
        x += point.x;
        y += point.y;
      });
      
      let averageX = x / 3
      let averageY = y / 3

      return {x:averageX, y: averageY};
    }

    function getCircle(pivot){
    
      let distance = pivot.distance
      let x = pivot.x
      let y = pivot.y
      
      if(x == 420 && y == 760){ //izquierda
        if(distance < 300){
          return 6
        }else if(distance < 360){
          return 5
        }else{
          return 4
        }
      }else if( x == 600 && y == 448){ //top
        if(distance < 300){
          return 9
        }else if(distance < 360){
          return 8
        }else{
          return 7
        }
      }else{   //right
        if(distance < 300){
          return 3
        }else if(distance < 360){
          return 2
        }else{
          return 1
        }
      }
    }
    function getPivotFromCicle(circle){
      let pivot = { x: 0, y: 0, distance: 0 };

      if ([6, 5, 4].includes(circle)) {
        pivot.x = 420;
        pivot.y = 760;
      } else if ([9, 8, 7].includes(circle)) {
        pivot.x = 600;
        pivot.y = 448;
      } else if ([3, 2, 1].includes(circle)) {
        pivot.x = 780;
        pivot.y = 760;
      } else {
        console.error("Círculo no reconocido");
        return pivot;
      }

      return pivot;
    }
    function sumAngleToLocation(x, y, angleRelative, pivot){
      let angle = calculateAngle(pivot.x, pivot.y, x, y)
      angle += angleRelative;
      let distance = calculateDistance(pivot.x, pivot.y, x, y)
      let newCoordinates = calculateCoordinates(pivot.x, pivot.y, distance, angle)
      return newCoordinates
    }
    function cartesianToPolar(x, y, originX = 0, originY = 0) {
        // Ajustar las coordenadas al nuevo origen
        const adjustedX = x - originX;
        const adjustedY = y - originY;
        
        // Calcular el radio
        const r = Math.sqrt(adjustedX * adjustedX + adjustedY * adjustedY);
        
        // Calcular el ángulo en radianes
        let theta = Math.atan2(adjustedY, adjustedX);
        
        // Convertir el ángulo a grados
        const thetaDegrees = theta * (180 / Math.PI);
        
        return { r: r, theta: thetaDegrees };
    }
    function polarToCartesian(r, thetaDegrees, originX = 0, originY = 0) {
        // Convertir el ángulo de grados a radianes
        const thetaRadians = thetaDegrees * (Math.PI / 180);
        
        // Calcular las coordenadas cartesianas
        const x = originX + r * Math.cos(thetaRadians);
        const y = originY + r * Math.sin(thetaRadians);
        
        return { x: x, y: y };
    }
  return { 
    degreesToRadians,
    radiansToDegrees,
    calculateDistance,
    findNumberFar,
    calculateAngle,
    calculateCoordinates,
    calculateAngleRelative,
    getCircle,
    sumAngleToLocation,
    getPivotFromCicle,
    groupAndSortByAngle,
    groupPointsInTriplets,
    calculateAveragePoint,
    findClosestIndex
  }
})
