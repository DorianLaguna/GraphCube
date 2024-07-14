import { ref } from 'vue'
import { defineStore } from 'pinia'
import dataJson from "@/intersection.json"

export const useOrbStore = defineStore('orbs', () => {
    
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

  function getLocationOriginal(index, path = null){
    let pathRead = path
    if(!pathRead){
      pathRead = orbs.value[index].path
    }
    const expr = pathRead.replace(/\[(\d+)\]/g, '.$1').split('.');
    let loc = locationsDefines.value;

    for (let i = 0; i < expr.length; i++) {
      loc = loc[expr[i]];
    }
    
    return loc;
    // console.log(locationsDefines.value.frontal[0][0])
  }

  function setIntersection(){
    for(let i = 0; i < dataJson.length; i++){
      orbs.value[i].cir1 = dataJson[i].cir1
      orbs.value[i].cir2 = dataJson[i].cir2
    }
  }

  function spin(circle){
    
  }

  // console.log(locationsDefines);
  

    return { 
      locationsDefines,
      orbs,
      addPoint,
      inRange,
      getLocationOriginal,
      setIntersection,
    }
})