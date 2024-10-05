import { ref } from 'vue';
import { defineStore } from 'pinia';
import * as THREE from 'three';
import { useMathStore } from './maths';

export const useSceneStore = defineStore('scene', () => {
    const scene = ref(null);
    const cubos = ref([])
    const mathStore = useMathStore();

    const nameCubes = ref([

        {name:"cube000", x: 2, y: 2, z: -2}, {name:"cube100", x: 0, y: 2, z: -2}, {name:"cube200", x: -2, y: 2, z: -2},
        {name:"cube010", x: 2, y: 0, z: -2}, {name:"cube110", x: 0, y: 0, z: -2}, {name:"cube210", x: -2, y: 0, z: -2},
        {name:"cube020", x: 2, y: -2, z: -2},{name:"cube120", x: 0, y: -2, z: -2}, {name:"cube220", x: -2, y: -2, z: -2},
  
        {name:"cube001", x: 2, y: 2, z: 0}, {name:"cube101", x: 0, y: 2, z: 0}, {name:"cube201", x: -2, y: 2, z: 0},
        {name:"cube011", x: 2, y: 0, z: 0},                                      {name:"cube211", x: -2, y: 0, z: 0},
        {name:"cube021", x: 2, y: -2, z: 0},{name:"cube121", x: 0, y: -2, z: 0}, {name:"cube221", x: -2, y: -2, z: 0},
  
        {name:"cube002", x: 2, y: 2, z: 2}, {name:"cube102", x: 0, y: 2, z: 2}, {name:"cube202", x: -2, y: 2, z: 2},
        {name:"cube012", x: 2, y: 0, z: 2}, {name:"cube112", x: 0, y: 0, z: 2}, {name:"cube212", x: -2, y: 0, z: 2},
        {name:"cube022", x: 2, y: -2, z: 2},{name:"cube122", x: 0, y: -2, z: 2}, {name:"cube222", x: -2, y: -2, z: 2},
        
        // {name:"centro", x:0 , y: 0, z: 0}, 
      
    ]);

    function setVal(obj){
        scene.value = obj
    }


    async function rotateCube(circle, positionsMoved){
        const locations = mathStore.getLocationCube(circle);
        const groupCubes = new THREE.Group();
        
        // Iterar sobre los grupos de la escena
        for (let i = 0; i < 4; i++) {
            scene.value.children.forEach(group => {
                locations.locations.forEach(location => {
                    if (
                        Math.abs(group.position.x - location.x) < 0.02 &&
                        Math.abs(group.position.y - location.y) < 0.02 &&
                        Math.abs(group.position.z - location.z) < 0.02
                    ) {
                        // Si coinciden, añadimos el group al grupo groupCubes
                        groupCubes.add(group);
                    }
                });
            });
        }
        
        scene.value.add(groupCubes);
        
        // Definir el objetivo de rotación
    
        const targetRotationX = (positionsMoved == 2 ) ? (Math.PI / 2) * positionsMoved: Math.PI / 2; // Valor de rotación objetivo
        // Obtener la rotación actual
        const currentRotationX = groupCubes.rotation[locations.eje]; 
        // Calcular la diferencia de rotación que necesitamos aplicar
        const rotationDifference = targetRotationX - currentRotationX;
        // Definir el número de pasos (iteraciones)
        const numberOfSteps = 60; 
        // Calcular el incremento por iteración
        const rotationIncrement = rotationDifference / numberOfSteps;
        
        // Aplicar la rotación en el bucle
        for (let i = 0; i < numberOfSteps; i++) {
            if(positionsMoved == 3){
                groupCubes.rotation[locations.eje] -= rotationIncrement
            }else{
                groupCubes.rotation[locations.eje] += rotationIncrement; // Incrementar la rotación
            }
            await delay(10); // Esperar un poco antes de la siguiente rotación
        }
        
        // Asegúrate de que se actualicen las matrices de transformación
        // groupCubes.updateMatrixWorld(true);

        // groupCubes.rotation.x = (Math.PI / 2);

        // Añadir el grupo a la escena principal
        // scene.scene.add(groupCubes);


            for(let i = 0; i<9; i++){
                scene.value.add(groupCubes.children[0])
            }

            // groupCubes.children.forEach(cubito => {
            //   // Remover el cubo del groupCubes
            // //   groupCubes.remove(cubito);
              
            //   // Devolver el cubo a la escena principal (con la nueva posición y rotación)
            //   scene.value.add(cubito);
            // });
          
            // Opcional: Eliminar el grupo si ya no es necesario
            // scene.value.remove(groupCubes);

        // for(let i = 0; i<60; i++){
            
        //     groupCubes.rotation.x += 0.05
            
        //     await delay(10)
        // }
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    return {
        scene,
        setVal,
        cubos,
        rotateCube,
    }
})