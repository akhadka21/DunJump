// let cursors
// var my = {sprite: {}, text: {}, vfx: {}};

class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
        
        this.highScore = 0;  

    }
    init(data) {
        
        this.VELOCITY = 250;
        this.DRAG = 4000;    
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -600;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.0;

        this.health = 10;
        this.maxBullets = 4;
        this.aimAngle = 0;
        this.powerUp = false;
        this.myScore = 0;


        this.ebullets = [];
        this.bullets = [];
        this.enemies = [];
        this.coins = []
        this.hearts = [];
        this.springs = [];
        this.portals = [];
        this.powers = [];
        
        this.uiText = null;

        this.lastStep = 0;

        this.levelIndex = data.level ?? 0;
        this.levelData = LEVELS[this.levelIndex];

                
        cursors = this.input.keyboard.createCursorKeys();
        this.rKey = this.input.keyboard.addKey('R');
        this.spaceKey = this.input.keyboard.addKey('Space');

    }   

    preload() {
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }


    create() {

        this.setupTilemap();
        this.setupObjects();
        this.setupPlayer();
        this.setupUI();
        this.setupSfx();
        this.setupCollisions();
        this.setupCamera();
        this.setupEnemyShooting();

        this.animatedTiles.init(this.level1);

        this.input.keyboard.on('keydown-P', () => {
            this.health = -10; 
        });

        this.input.on('pointerdown', (pointer) => {
            const worldX = Math.floor(pointer.worldX / 16) * 16;
            const worldY = Math.floor(pointer.worldY / 16) * 16;
            console.log(`x: ${worldX}, y: ${worldY}`);
                my.sprite.player.setPosition(worldX, worldY);
                my.sprite.player.body.setVelocity(0, 0);
        });
    }

    update() {

        this.uiText.setText(
            `Level: ${this.levelIndex + 1}\nHigh Score: ${this.highScore}\nScore: ${this.myScore}\nCoins left: ${this.coins.length}\nEnemies left: ${this.enemies.length}\nHealth: ${this.health}`
        );

        this.updateInputs();
        this.updateEnemy();
        this.updateBullets();
        this.updateScore();
        this.endCondition();
                

        if (!(this.coins.length || this.enemies.length)){
            this.Texturelayer.setVisible(false);
            this.Texturelayer.setCollisionByExclusion([-1], false);
        }

        
    }

    createEnemy(x, y) {
        let enemy = this.physics.add.sprite(x, y, 'enemy1_0');

        enemy.body.setAllowGravity(false);
        enemy.setDepth(50);
        enemy.setCollideWorldBounds(true);
        enemy.body.setVelocityX(80);
        
        this.physics.add.collider(enemy, this.Groundlayer);
        this.physics.add.collider(enemy, this.Platformlayer);
        
        return enemy;
    }

    createCoin(x, y) {
        let coin = this.physics.add.sprite(x + 8, y + 8, 'coin_1');
        coin.body.setAllowGravity(false);
        coin.setDepth(50);
        coin.play('coin_spin');
        return coin;
    }

    createHeart(x, y) {
        let heart = this.physics.add.sprite(x + 8, y + 8, 'heart_0');
        heart.body.setAllowGravity(true);
        heart.setDepth(50);
        heart.play('heart_beat');

        
        this.physics.add.collider(heart, this.Groundlayer);
        this.physics.add.collider(heart, this.Platformlayer);
        return heart;

    }

    createSpring(x, y) {
        let spring = this.physics.add.sprite(x + 8, y + 8, 'spring_3');
        spring.body.setAllowGravity(true);
        spring.setDepth(50);

        this.physics.add.collider(spring, this.Groundlayer);
        this.physics.add.collider(spring, this.Platformlayer);
        return spring;
    }

    
    createPortal(x, y) {
        let portal = this.physics.add.sprite(x + 8, y + 8, 'portal_1');
        portal.body.setAllowGravity(false);
        portal.setDepth(50);
        portal.play('portal_anim');

        this.physics.add.collider(portal, this.Groundlayer);
        this.physics.add.collider(portal, this.Platformlayer);
        return portal;
    }

    createPower(x, y) {
        let power = this.physics.add.sprite(x + 8, y + 8, 'power_0');
        power.body.setAllowGravity(false);
        power.setDepth(50);
        power.play('power_anim');
        this.physics.add.collider(power, this.Groundlayer);
        this.physics.add.collider(power, this.Platformlayer);
        return power;
    }


    hitShake() {
        this.tweens.add({
            targets: my.sprite.player,
            x: { from: my.sprite.player.x - 3, to: my.sprite.player.x + 3 },
            duration: 50,
            yoyo: true,
            repeat: 3,
            ease: 'Sine.easeInOut'
        });
    }
    
    setupTilemap() {
        // this.level1 = this.add.tilemap(this.levelData.tilemap, 16, 16, 130, 25);
        this.level1 = this.make.tilemap({ key: this.levelData.tilemap });

        const tilesetMono = this.level1.addTilesetImage("monochrome", "monochrome");
        const tilesetSpr = this.level1.addTilesetImage("spritesheet_1", "spritesheet_1");
        const tilesetTrans = this.level1.addTilesetImage("trans_monochrome", "trans_monochrome");
        const tilesets = [tilesetMono, tilesetSpr, tilesetTrans];

        this.Deeperbg = this.level1.createLayer("Deeperbg", tilesets, 100, 200);
        this.Deepestbg = this.level1.createLayer("Deepestbg", tilesets, 300, 200);
        this.Background = this.level1.createLayer("Background", tilesets, 200, 130);
        this.Groundlayer = this.level1.createLayer("Ground", tilesets, 0, 0);
        this.Platformlayer = this.level1.createLayer("Platform", tilesets, 0, 0);
        this.Foregroundlayer = this.level1.createLayer("Foreground", tilesets, 0, 0);
        this.Texturelayer = this.level1.createLayer("Texture", tilesets, 0, 0);

        const layers = [ this.Deeperbg, this.Deepestbg,  this.Background, this.Groundlayer, this.Platformlayer, this.Foregroundlayer, this.Texturelayer];

        layers.forEach((layer, i) => {
            if (layer) {
                layer.setDepth(5 + i * 5);
                layer.setScale(1);
            }
        });

        this.Background.setScrollFactor(0.4).setAlpha(0.6);
        this.Deeperbg.setScrollFactor(0.15).setAlpha(0.4);
        this.Deepestbg.setScrollFactor(0.25).setAlpha(0.5);

        this.Groundlayer.setCollisionByProperty({
             collides: true 
        });
        this.Platformlayer.setCollisionByProperty({ 
            collides: true 
        });
        this.Texturelayer.setCollisionByProperty({ 
            collides: true 
        });
    }

    setupObjects() {
        const d = this.levelData;

        d.enemies.forEach(e => this.enemies.push(this.createEnemy(e.x, e.y)));
        d.coins.forEach(c => this.coins.push(this.createCoin(c.x, c.y)));
        d.springs.forEach(s => this.springs.push(this.createSpring(s.x, s.y)));
        d.portals.forEach(p => this.portals.push(this.createPortal(p.x, p.y)));
        d.powers.forEach(p => this.powers.push(this.createPower(p.x, p.y)));
        d.hearts.forEach(h => this.hearts.push(this.createHeart(h.x, h.y)));
    }

    setupPlayer() {
        my.sprite.player = this.physics.add.sprite(30, 200, 'char_0');
        
        my.sprite.player.setCollideWorldBounds(true);
        
        this.physics.add.collider(my.sprite.player, this.Groundlayer);
        this.physics.add.collider(my.sprite.player, this.Platformlayer);
        this.physics.add.collider(my.sprite.player, this.Texturelayer);

        my.sprite.player.body.setSize(my.sprite.player.width * 0.6, my.sprite.player.height * 0.7);

        my.sprite.player.setDepth(50);
    }

    setupUI(){
        this.uiText = this.add.text(400, 250,
            `Level: ${this.levelIndex + 1}\nHigh Score: ${this.highScore}\nScore: ${this.myScore}\nCoins left: ${this.coins.length}\nEnemies left: ${this.enemies.length}\nHealth: ${this.health}`, {
            fontFamily: 'Times, serif',
            fontSize: '20px'
        });

        this.uiText.setScrollFactor(0);
        this.uiText.setDepth(100); 
    }

    setupSfx(){
        this.coins.forEach(coin => {
            coin.play('coin_spin');
        });

        this.hearts.forEach(heart => {
            heart.play('heart_beat');
        });

        my.vfx.coinCol = this.add.particles(0, 0, "kenny-particles", {
            frame: ['star_04.png', 'star_02.png', 'star_09.png', 'star_08.png'],
            scale: {start: 0.03, end: 0.1},
            lifespan: 350,
            alpha: {start: 1, end: 0.1}, 
            emitting: false
        });

        my.vfx.coinCol.setDepth(45);
        my.vfx.coinCol.stop();

        my.vfx.dashEff = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_04.png', 'smoke_01.png', 'smoke_02.png', 'smoke_03.png'],
            scale: {start: 0.01, end: 0.03},
            lifespan: 2000,
            alpha: {start: 1, end: 0.1},
            gravityY: -12, 
            emitting: false
        });

        my.vfx.dashEff.setDepth(45);
        my.vfx.dashEff.stop();

        
        my.vfx.sparkEff = this.add.particles(0, 0, "kenny-particles", {
            frame: ['spark_04.png', 'spark_03.png', 'spark_01.png', 'spark_02.png'],
            scale: {start: 0.05, end: 0.15},
            lifespan: 1500,
            alpha: {start: 1, end: 0.1},
            gravityY: -12, 
            emitting: false
        });

        my.vfx.sparkEff.setDepth(45);
        my.vfx.sparkEff.stop();
    }

    setupCollisions() {
                
        this.physics.add.overlap(my.sprite.player, this.coins, (obj1, obj2) => {
            my.vfx.coinCol.emitParticleAt(obj2.x, obj2.y, 5); 
            obj2.destroy(); 
            this.myScore += 10;
            this.coins = this.coins.filter(c => c.active);
            this.sound.play("coinC");
            if (this.pauseParticles) {
                this.time.delayedCall(500, () => {   
                    this.scene.pause();
                    setTimeout(() => this.scene.resume(), 3000); 
                    this.pauseParticles = false;
                });

            }
        });

        this.physics.add.overlap(my.sprite.player, this.powers, (obj1, obj2) => {
            if (!this.powerUp){
                this.sound.play("powerup",{
                    volume: 0.1
                });
                this.powerUp = true
            }
        
            if (this.pauseParticles) {
                this.time.delayedCall(500, () => {   
                    this.scene.pause();
                    setTimeout(() => this.scene.resume(), 3000); 
                    this.pauseParticles = false;
                });
            }
        });

        this.physics.add.overlap(my.sprite.player, this.hearts, (obj1, obj2) => {
            this.myScore += 5;
            obj2.destroy(); 
            this.sound.play("pheal",{
                seek: 0.2
            });
            this.health++;

            if (this.pauseParticles) {
                this.time.delayedCall(500, () => {   
                    this.scene.pause();
                    setTimeout(() => this.scene.resume(), 3000); 
                    this.pauseParticles = false;
                });
            }
        });

        this.physics.add.overlap(my.sprite.player, this.springs, (obj1, obj2) => {

            this.sound.play("boing");
            obj2.play('spring_anim');

            obj1.body.setVelocityY(this.JUMP_VELOCITY * 1.5);

            if (this.pauseParticles) {
                this.time.delayedCall(500, () => {   
                    this.scene.pause();
                    setTimeout(() => this.scene.resume(), 3000); 
                    this.pauseParticles = false;
                });
            }
        });

        
        this.physics.add.overlap(my.sprite.player, this.portals, (obj1, obj2) => {

            this.sound.play("portalS");

            const nextLevel = this.levelIndex + 1;
            if (nextLevel < LEVELS.length) {
                this.scene.start("platformerScene", { level: nextLevel });
            } else {
                this.scene.start("VictoryScene", {
                    Score: this.myScore,
                    HighScore: this.highScore
                });
            }
            if (this.pauseParticles) {
                this.time.delayedCall(500, () => {   
                    this.scene.pause();
                    setTimeout(() => this.scene.resume(), 3000); 
                    this.pauseParticles = false;
                });
            }
        });
    }
    
    setupCamera() {
         this.cameras.main.setBounds(
            0, -10, 
            this.level1.widthInPixels, 
            this.level1.heightInPixels,
            true
        );
        
        this.physics.world.setBounds(
            0, 0, 
            this.level1.widthInPixels, 
            this.level1.heightInPixels
        );

        
        this.cameras.main.startFollow(my.sprite.player, true, 1, 1);
        this.cameras.main.setDeadzone(100, 0);
        // this.cameras.main.setFollowOffset(0, 100);
        this.cameras.main.setZoom(this.SCALE * 1.1);

    }

    setupEnemyShooting() {
         this.time.addEvent({
            delay: 1500,
            loop: true,  
            callback: () => {
                this.nearbyEnemies = this.enemies.filter(enemy => {
                    return Phaser.Math.Distance.Between(
                        my.sprite.player.x, my.sprite.player.y,
                        enemy.x, enemy.y
                    ) < 400;
                });
    
                // console.log(this.health);
                if (this.nearbyEnemies.length) {
                    const shooter = Phaser.Utils.Array.GetRandom(this.nearbyEnemies);
                    if (shooter && shooter.active) {
                        let eb = this.physics.add.sprite(shooter.x, shooter.y, 'eBullet1');
                        this.physics.add.collider(eb, this.Groundlayer, () => {
                            eb.destroy();
                        });
                        this.physics.add.collider(eb, this.Platformlayer, () => {
                            eb.destroy();
                        });
                        eb.body.setAllowGravity(false);
                        eb.setDepth(50);
                        eb.setScale(0.5);
                        const angle = Phaser.Math.Angle.Between(
                            shooter.x, shooter.y,
                            my.sprite.player.x, my.sprite.player.y
                        );
                        eb.body.setVelocity(
                            Math.cos(angle) * 150,
                            Math.sin(angle) * 150
                        );
                        eb.setRotation(angle + Math.PI / 2);
                        this.ebullets.push(eb);
                        this.sound.play("eshot",{
                            volume: 0.01
                        });
                    }
                }
            }
        });
    }

    updateInputs() {
        if(cursors.left.isDown) {
            // my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.setVelocityX(-this.VELOCITY);
            
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);

            my.vfx.dashEff.emitParticleAt(my.sprite.player.x, my.sprite.player.y + 5, 5); 

            if (this.time.now - this.lastStep > 300 && !this.wasInAir) {
                this.lastStep = this.time.now;
                this.sound.play("pstep", {
                    volume: 0.3,
                    // repeat: 2,
                    pitch: 0.8 + Math.random() * 0.4
                });
            }

            if (this.pauseParticles) {
                this.time.delayedCall(1000, () => {   
                    this.scene.pause();
                    setTimeout(() => this.scene.resume(), 3000); 
                    this.pauseParticles = false;
                });

            }
            
        } else if(cursors.right.isDown) {
            //my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setVelocityX(this.VELOCITY);
            
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);

         
            my.vfx.dashEff.emitParticleAt(my.sprite.player.x, my.sprite.player.y + 5, 5); 

            if (this.time.now - this.lastStep > 300 && !this.wasInAir) {
                this.lastStep = this.time.now;
                this.sound.play("pstep", {
                    volume: 0.3, 
                    pitch: 0.8 + Math.random() * 0.4


                });
            }

            if (this.pauseParticles) {
                this.time.delayedCall(1000, () => {   
                    this.scene.pause();
                    setTimeout(() => this.scene.resume(), 3000); 
                    this.pauseParticles = false;
                });

            }
            
        } else {
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            
        }
        
        
        if(!my.sprite.player.body.blocked.down) {
            this.wasInAir = true; 
            my.sprite.player.anims.play('jump');
        }

        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            console.log(my.sprite.player.x);
            console.log(my.sprite.player.y);
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            this.sound.play("pjump",{
                volume: 0.05
            });
        }

        if(this.powerUp && Phaser.Input.Keyboard.JustDown(cursors.up) && this.wasInAir){
            this.powerUp = false;
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            this.sound.play("pjump",{
                volume: 0.05
            });
        }        

        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.wasInAir = true;
            this.scene.restart();
        }

        const left = cursors.left.isDown;
        const right = cursors.right.isDown;
        const up = cursors.up.isDown;
        const down = cursors.down.isDown;

        const dirKey = (left ? 'L' : '') + (right ? 'R' : '') + (up ? 'U' : '') + (down ? 'D' : '');

        switch(dirKey) {
            case 'R':   this.aimAngle = 0;              break;  
            case 'D':   this.aimAngle = Math.PI * 0.5;  break;  
            case 'L':   this.aimAngle = Math.PI;        break; 
            case 'U':   this.aimAngle = Math.PI * 1.5;  break;  
            case 'RD':  this.aimAngle = Math.PI * 0.25; break;  
            case 'LD':  this.aimAngle = Math.PI * 0.75; break;  
            case 'LU':  this.aimAngle = Math.PI * 1.25; break;  
            case 'RU':  this.aimAngle = Math.PI * 1.75; break;  
        }
        
        if(Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            if (this.bullets.length < this.maxBullets) {
                let bullet = this.physics.add.sprite(
                    my.sprite.player.x, my.sprite.player.y, "bullet"
                );
                bullet.body.setAllowGravity(false);
                bullet.setDepth(50);
                bullet.setScale(0.5);

                console.log(my.sprite.player.body.velocity);
                bullet.setRotation(this.aimAngle + Math.PI / 2);

                bullet.body.setVelocity(
                    Math.cos(this.aimAngle) * 350 + 0 * my.sprite.player.body.velocity.x / 2,
                    Math.sin(this.aimAngle) * 350 + 0 *  my.sprite.player.body.velocity.y / 2
                );

                this.sound.play("pshot",{
                    volume: 0.1
                });

                this.physics.add.collider(bullet, this.Groundlayer, () => {
                    bullet.destroy();
                });
                this.physics.add.collider(bullet, this.Platformlayer, () => {
                    bullet.destroy();
                });
                this.bullets.push(bullet);
            }
        }

        if (my.sprite.player.body.blocked.down) {
            if (this.wasInAir) {
                this.sound.play('pland', {
                    volume: 0.4
                });  
                this.wasInAir = false;
            }
        }
    }

    updateEnemy() {
        this.enemies.forEach(enemy => {
            enemy.anims.play('enemy1_idle', true);
            if (this.time.now % 10 == 0) {
                let rval = Phaser.Math.Between(0, 2 * Math.PI);
                enemy.body.setVelocityX(Math.sin(rval)* 100);
                enemy.body.setVelocityY(Math.cos(rval)* 50);

            }
        });

        this.ebullets = this.ebullets.filter(eb => {
                    

            if (!eb.active) return false;

            if (Phaser.Geom.Intersects.RectangleToRectangle(
                my.sprite.player.getBounds(), eb.getBounds()
            )) {
                this.health--;
                this.hitShake(); 
                console.log("Health:", this.health);
                eb.destroy();
                this.sound.play("phit", {
                    seek: 0.2
                });
                return false;
            }

            return true;
        });
    }

    updateBullets() {
        this.bullets = this.bullets.filter(bullet => {
                    
            if (!bullet.active) return false;

            this.enemies = this.enemies.filter(enemy => {
                if (enemy.active && Phaser.Geom.Intersects.RectangleToRectangle(
                    enemy.getBounds(), bullet.getBounds()
                )) {
                    if (Math.random() < 0.3) {
                        this.hearts.push(this.createHeart(enemy.x, enemy.y));
                    }
                    my.vfx.sparkEff.emitParticleAt(enemy.x, enemy.y, 5); 
                    enemy.destroy();
                    bullet.destroy();
                    this.myScore += 20;
                    this.sound.play("edead", {
                        volume: 0.1
                    });
                    return false; 
                }
                return true;
            });

            if(bullet.active){ 
                if (bullet.x < 0 || bullet.x > this.level1.widthInPixels ||
                    bullet.y < 0 || bullet.y > this.level1.heightInPixels ||
                    bullet.body.blocked.left || bullet.body.blocked.right ||
                    bullet.body.blocked.up || bullet.body.blocked.down) {
                    bullet.destroy();
                    return false;
                }
            }

            return true;
        });
    }

    endCondition() {
        if (this.health <= 0){
            this.scene.start("EndScene",{
                Score: this.myScore,
                HighScore: this.highScore
            }); 
        }
    }

    updateScore(){
        if (this.myScore > this.highScore) {
            this.highScore = this.myScore;
        }
    }
}