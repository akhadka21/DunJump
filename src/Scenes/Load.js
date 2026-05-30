class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    

    preload() {
        this.load.setPath("./assets/");


        // this.load.image("tilemap_tiles", "tilemap_packed.png");    

        this.load.image("monochrome", "monochrome.png");
        this.load.image("spritesheet_1", "spritesheet_1.png");
        this.load.image("trans_monochrome", "trans_monochrome.png");
              
        this.load.tilemapTiledJSON("platformer-level-1", "platformer-level-1.tmj");   
        
        this.load.tilemapTiledJSON("dunjump1", "dunjump1.tmj");   
        this.load.tilemapTiledJSON("dunjump2", "dunjump2.tmj");   
        this.load.tilemapTiledJSON("dunjump3", "dunjump3.tmj");   

        this.load.audio("pjump", "audio/pjump.mp3");
        this.load.audio("pland", "audio/pland.mp3");
        this.load.audio("pshot", "audio/edead.mp3");
        this.load.audio("eshot", "audio/eshot.mp3");
        this.load.audio("edead", "audio/pshot.mp3");
        this.load.audio("coinC", "audio/coinC.mp3");
        this.load.audio("phit", "audio/phit.mp3");
        this.load.audio("pstep", "audio/pstep.mp3");
        this.load.audio("pheal", "audio/pheal.mp3");
        this.load.audio("boing", "audio/boing.mp3");
        this.load.audio("powerup", "audio/powerup.mp3");
        this.load.audio("portalS", "audio/portalS.mp3");
        
        

        this.load.spritesheet("tilemap_sheet", "tilemap_packed.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.multiatlas("kenny-particles", "kenny-particles.json");

        for (let i = 0; i <= 6; i++) {
            this.load.image(`char_${i}`, `psprite/tile_026${i}.png`);
        }

        this.load.image("bullet", `tile_0037.png` );

        
        for (let i = 0; i <= 2; i++) {
            this.load.image(`enemy1_${i}`, `esprite1/tile_038${i}.png`);
        }

        this.load.image("eBullet1", "tile_0325.png");

        for (let i = 1; i <= 2; i++) {
            this.load.image(`coin_${i}`, `dcoins/tile_000${i}.png`);
        }

        for (let i =0; i<=2; i++) {
            this.load.image(`heart_${i}`, `heart/tile_004${i}.png`);
        }

        for (let i = 3; i<=5; i++) {
            this.load.image(`spring_${i}`, `spring/tile_016${i}.png`);
        }

        for (let i = 0; i <= 2; i++) {
            this.load.image(`power_${i}`, `power/tile_002${i}.png`);
        }

        this.load.image(`portal_1`, `portal/tile_0291.png`);
        this.load.image(`portal_2`, `portal/tile_0296.png`);
        this.load.image(`portal_3`, `portal/tile_0216.png`);

    }

    create() {

        this.anims.create({
            key: 'idle',
            frames: [{ key: 'char_0' }],
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: 'walk',
            frames: [
                { key: 'char_1' },
                { key: 'char_2' },
                { key: 'char_3' },
                { key: 'char_4' }
            ],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: [
                { key: 'char_5' }       
            ],
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: "enemy1_idle",
            frames: [
                { key: 'enemy1_0' },
                { key: 'enemy1_1' },
            ],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "enemy1_death",
            frames: [
                { key: 'enemy1_2' },
            ],
            frameRate: 1,
            repeat: 0
        });

        this.anims.create({
            key: 'coin_spin',
            frames: [
                { key: 'coin_1' },
                { key: 'coin_2' }
            ],
            frameRate: 2,
            repeat: -1
        });

        this.anims.create({
            key: 'heart_beat',
            frames: [
                { key: 'heart_0' },
                { key: 'heart_1' },
                { key: 'heart_2' },
            ],
            frameRate: 5,
            repeat: -1                
        })

        this.anims.create({
            key: 'spring_anim',
            frames: [
                { key: 'spring_3' },
                { key: 'spring_4' },
                { key: 'spring_5' },
                { key: 'spring_3' }

            ],
            frameRate: 10,
            repeat: 0
        })

        this.anims.create({
            key: 'portal_anim',
            frames: [
                { key: 'portal_1' },
                { key: 'portal_2' },
                { key: 'portal_3' },
            ],
            frameRate: 5,
            repeat: -1
        })

        this.anims.create({
            key: 'power_anim',
            frames: [
                { key: 'power_0' },
                { key: 'power_1' },
                { key: 'power_2' },
            ],
            frameRate: 5,
            repeat: -1
        })

         this.scene.start("platformerScene");
    }

    update() {
    }
}

class EndScene extends Phaser.Scene {
    constructor() { super("EndScene"); }
    create(data) {
        const finalScore = data.Score;
        const highScore = data.HighScore;
        const HsText= highScore <= finalScore ? ` NEW PERSONAL HIGH SCORE ` : ``
        this.add.text(50, 50, 
            `GAME OVER\n${HsText}\n\nFinal Score:${finalScore}\nHigh Score: ${highScore}\n\nPress R to Retry\nPress M for Menu`, { 
            fontFamily: 'Times, serif',
            fontSize: '48px',
            align: 'center'
        });
        this.input.keyboard.on('keydown-R', () => {
            this.scene.start("platformerScene"); 
        });
        this.input.keyboard.on('keydown-M', () => {
            this.scene.start("MainMenu"); 
        });     
    }
}

class MainMenu extends Phaser.Scene {
    constructor() { super("MainMenu"); }
    create() {
        this.add.text(50, 100, 
            "Dunjump \n\n Press R to Start", { 
            fontFamily: 'Times, serif',
            fontSize: '48px' 
        });
        this.input.keyboard.on('keydown-R', () => {
            this.scene.start("platformerScene"); 
        });

    }
}


class VictoryScene extends Phaser.Scene {
    constructor() { super("VictoryScene"); }
    create(data) {
        const finalScore = data.Score;
        const highScore = data.HighScore;
        this.add.text(100, 100, 
            `Victory!\n\nFinal Score: ${finalScore}\nHigh Score: ${highScore}\n\nPress R to Replay\nPress M for Menu\nPress C for Credits`, { 
            fontFamily: 'Times, serif',
            fontSize: '48px',
            align: 'center'
        });
        this.input.keyboard.on('keydown-R', () => {
            this.scene.start("GalleryShooter"); 
        });
        this.input.keyboard.on('keydown-M', () => {
            this.scene.start("MainMenu"); 
        });

               
    }
}