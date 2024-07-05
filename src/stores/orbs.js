import { ref, onMounted } from 'vue'
import { defineStore } from 'pinia'

export const useOrbStore = defineStore('orbs', () => {
    
  const cube = ref(null)
  cube.value = {
    frontal: [
      [{ x: 600, y: 390, valor_original: null, valor_actual: null }, { x: 665, y: 428, valor_original: null, valor_actual: null }, { x: 720, y: 476, valor_original: null, valor_actual: null }],
      [{ x: 535, y: 428, valor_original: null, valor_actual: null }, { x: 600, y: 458, valor_original: null, valor_actual: null }, { x: 655, y: 497, valor_original: null, valor_actual: null }],
      [{ x: 480, y: 476, valor_original: null, valor_actual: null }, { x: 545, y: 497, valor_original: null, valor_actual: null }, { x: 600, y: 530, valor_original: null, valor_actual: null }]
    ],
    trasera: [
      [{ x: 480, y: 1043, valor_original: null, valor_actual: null }, { x: 545, y: 1022, valor_original: null, valor_actual: null }, { x: 600, y: 990, valor_original: null, valor_actual: null }],
      [{ x: 535, y: 1091, valor_original: null, valor_actual: null }, { x: 600, y: 1061, valor_original: null, valor_actual: null }, { x: 655, y: 1022, valor_original: null, valor_actual: null }],
      [{ x: 600, y: 1129, valor_original: null, valor_actual: null }, { x: 665, y: 1091, valor_original: null, valor_actual: null }, { x: 720, y: 1043, valor_original: null, valor_actual: null }]
    ],
    superior: [
      [{ x: 1008, y:419, valor_original: null, valor_actual: null }, { x: 1007, y: 494, valor_original: null, valor_actual: null }, { x: 994, y: 566, valor_original: null, valor_actual: null }],
      [{ x: 942, y: 382, valor_original: null, valor_actual: null }, { x: 949, y: 453, valor_original: null, valor_actual: null }, { x: 943, y: 520, valor_original: null, valor_actual: null }],
      [{ x: 874, y: 358, valor_original: null, valor_actual: null }, { x: 888, y: 425, valor_original: null, valor_actual: null }, { x: 887, y: 489, valor_original: null, valor_actual: null }]
    ],
    inferior: [
      [{ x: 386, y: 642, valor_original: null, valor_actual: null }, { x: 436, y: 687, valor_original: null, valor_actual: null }, { x: 492, y: 719, valor_original: null, valor_actual: null }],
      [{ x: 372, y: 713, valor_original: null, valor_actual: null }, { x: 430, y: 755, valor_original: null, valor_actual: null }, { x: 491, y: 783, valor_original: null, valor_actual: null }],
      [{ x: 371, y: 788, valor_original: null, valor_actual: null }, { x: 437, y: 825, valor_original: null, valor_actual: null }, { x: 505, y: 850, valor_original: null, valor_actual: null }]
    ],
    izquierda: [
      [{ x: 191, y: 419, valor_original: null, valor_actual: null }, { x: 257, y: 382, valor_original: null, valor_actual: null }, { x: 325, y: 358, valor_original: null, valor_actual: null }],
      [{ x: 192, y: 494, valor_original: null, valor_actual: null }, { x: 249, y: 453, valor_original: null, valor_actual: null }, { x: 311, y: 425, valor_original: null, valor_actual: null }],
      [{ x: 205, y: 566, valor_original: null, valor_actual: null }, { x: 256, y: 520, valor_original: null, valor_actual: null }, { x: 312, y: 489, valor_original: null, valor_actual: null }]
    ],
    derecha: [
      [{ x: 814, y: 642, valor_original: null, valor_actual: null }, { x: 827, y: 713, valor_original: null, valor_actual: null }, { x: 828, y: 788, valor_original: null, valor_actual: null }],
      [{ x: 763, y: 687, valor_original: null, valor_actual: null }, { x: 770, y: 755, valor_original: null, valor_actual: null }, { x: 762, y: 825, valor_original: null, valor_actual: null }],
      [{ x: 707, y: 719, valor_original: null, valor_actual: null }, { x: 708, y: 783, valor_original: null, valor_actual: null }, { x: 694, y: 850, valor_original: null, valor_actual: null }]
    ]
  };
  
  // console.log(cube);
  

    return { 
      cube
    }
})    