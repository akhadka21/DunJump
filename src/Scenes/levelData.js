const LEVELS = [
    {
        key: "level1",
        tilemap: "dunjump1",
        playerStart: { x: 30, y: 200 },
        enemies: [
            { x: 1600, y: 200 },
            { x: 1650, y: 200 },
        ],
        coins: [
            { x: 224, y: 416 },
            { x: 256, y: 256 },

        ],
        springs: [
            { x: 1392, y: 400 }
        ],
        portals: [
            { x: 208, y: 384 },
            { x: 2048, y: 384 }

        ],
        powers: [
            { x: 150, y: 400 },
            { x: 1456, y: 400 }
        ],
        hearts: [],
        nextLevel: "level2",
    }, {
        key: "level2",
        tilemap: "dunjump2",
        playerStart: { x: 30, y: 200 },
                playerStart: { x: 30, y: 200 },
        enemies: [
            { x: 128, y: 200 },
            { x: 912, y: 64 },
            { x: 1600, y: 96 },
            { x: 1600, y: 96 },
            { x: 1600, y: 96 },
        ],
        coins: [
            
            { x: 736, y: 192 },
            { X: 1008, y:256},
            { x: 176, y: 192 },
            { x: 1600, y: 126 },

        ],
        springs: [

            { x: 784, y: 400 },
            { x: 1280, y: 400 }
        ],
        portals: [
            { x: 2048, y: 384 }
        ],
        powers: [
            { x: 304, y: 128 },
            { x: 560, y: 144 },
            { x: 1008, y: 256 }
        ],
        hearts: [],
        nextLevel: "level3",
    }, {
        key: "level3",
        tilemap: "dunjump3",
        playerStart: { x: 30, y: 200 },
                playerStart: { x: 30, y: 200 },
        enemies: [
            { x: 128, y: 200 },
            { x: 912, y: 64 },
            { x: 1600, y: 96 },
            { x: 1600, y: 96 },
        ],
        coins: [
            
            { x: 368, y: 80 },
            { X: 1328, y: 272},
            
            { x: 1664, y: 272},


        ],
        springs: [

            { x: 864, y: 400 },
            { x: 1456, y: 400 }
        ],
        portals: [
            { x: 2048, y: 384 }
        ],
        powers: [
            { x: 960, y: 224 },
            { x: 1104, y: 224 },
            { x: 1248, y: 224 },
            { x: 1328, y: 224 }
        ],
        hearts: [],

    
    }
]