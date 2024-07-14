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
    function getCircle(pivot){
    
      let distance = pivot.distance
      let x = pivot.x
      let y = pivot.y
      
      if(x == 420 && y == 760){ //izquierda
        if(distance < 300){
          return 4
        }else if(distance < 360){
          return 5
        }else{
          return 6
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
  }
})
