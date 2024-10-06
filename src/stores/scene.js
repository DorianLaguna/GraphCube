import { ref } from 'vue';
import { defineStore } from 'pinia';
import * as THREE from 'three';
import { useMathStore } from './maths';

export const useSceneStore = defineStore('scene', () => {
    const scene = ref(null);
    const cubos = ref([])
    const mathStore = useMathStore();

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
        let rotation
        
        // Aplicar la rotación en el bucle
        for (let i = 0; i < numberOfSteps; i++) {
            if(positionsMoved == 3){
                groupCubes.rotation[locations.eje] -= rotationIncrement
                rotation = -rotationDifference
            }else{
                groupCubes.rotation[locations.eje] += rotationIncrement; // Incrementar la rotación
                rotation = rotationDifference
            }
            await delay(10); // Esperar un poco antes de la siguiente rotación
        }

        // Iteramos sobre los cubos que queremos rotar
        for(let i = 0; i<4; i++){

            groupCubes.children.forEach(cube => {
                scene.value.attach(cube);
            });
        }
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