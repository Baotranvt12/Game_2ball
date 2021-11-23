/** @type {Phaser.Physics.Arcade.StaticGroup} */
// var music;
var sound;
var sound_off;
// var player;
// var ball1;
// var bg2;
var bullets;
var gun;

var keys = "abcdefghijklmnopqrstuvwxyz"
var spacebar;

var k = "asdf"

class scene2 extends Phaser.Scene{
	constructor(){
		super('playGame');
	}

	preload(){
        this.load.image('bg2','assets/background2.png');
		this.load.image('beecute','assets/beecute.png', 35, 35);
		this.load.image('gun','assets/cross-bow.png');
		this.load.image('bullet', 'assets/ball.png');
        this.load.audio('bgmusic', 'assets/game.mp3');
		this.load.audio('pop', 'assets/pop.mp3');
		this.load.image('ball1','assets/ball1.png');
		this.load.image('ball2','assets/ball2.png');
		this.load.image('ball3','assets/ball3.png');
		this.load.image('ball4','assets/ball4.png');
		this.load.image('pause', 'assets/pause.png');
		this.load.image('resume', 'assets/resume.png');
		this.load.image('sound', 'assets/sound.png');
        this.load.image('sound-off', 'assets/sound-off.png')

		this.load.image('ball-a','assets/ball-a.png');
		this.load.image('ball-s','assets/ball-s.png');
		this.load.image('ball-d','assets/ball-d.png');
		this.load.image('ball-f','assets/ball-f.png');
		this.load.image('table', 'assets/table.png');
		this.load.image('heart', 'assets/heart.png');
		// for (var i = 0; i < 26; i++) {
		// 	this.load.image('ball-' + keys[i],'assets/ball' + keys[i] + '.png');
		// }
	}

	create(){
        this.add.image(600, 350, "bg2");
		this.add.image(300,120, "table");
		this.bee = this.add.sprite(450,600, "beecute");
		var hear1 = this.add.sprite(230, 190, 'heart').setInteractive(); 
		var hear2 = this.add.sprite(280, 190, 'heart').setInteractive(); 
		var hear3 = this.add.sprite(330, 190, 'heart').setInteractive(); 
		var pause = this.add.sprite(1020,50, 'pause').setInteractive();
		var resume = this.add.sprite(1130,50, 'resume').setInteractive();
		resume.visible = false;
        gun = this.add.image(600, 600, 'gun').setDepth(1000);


		// pause.on('pointerdown', function(){
		// 	this.scene.pause();
		// 	resume.visible = true;

		// }, this);
		
		// resume.on('pointerdown', function(){
		// 	//game.scene.pause(scene2);
		// 	//this.balloons.body.moves = false;
		// 	this.scene.resume();
		// }, this);

		music = this.sound.add('bgmusic');
		music.setLoop(true);
		music.play();

		sound = this.add.sprite(900, 50, 'sound').setInteractive();
        sound_off = this.add.sprite(900, 50, 'sound-off').setInteractive();
        sound_off.visible = false

        sound.on('pointerdown', function() {soundOff(sound, sound_off, music, this) }, this);
        sound_off.on('pointerdown', function() {soundOn(sound, sound_off, music, this) }, this);
		
		this.popSound = this.sound.add('pop');
		
		this.score = 0;
		this.scoreText = this.add.text(340,80, this.score, {fontFamily:'Arial Black', fontSize:74, color:'#c51b7d'});
		this.scoreText.setStroke('#de77ae', 5);
		this.scoreText.setShadow(2, 2, '#333333', 2, true, false);

		this.life = 3;
		this.lifeText = this.add.text(50,300, this.life, {fontFamily:'Arial Black', fontSize:74, color:'#c51b7d'});
		this.lifeText.setStroke('#de77ae', 5);
		this.lifeText.setShadow(2, 2, '#333333', 2, true, false);

		// var keys_1 = this.input.keyboard.addKeys('Q,W,E,R,T,Y,U,I,O,P,A,S,D,F,G,H,J,K,L,Z,X,C,V,B,N,M', enableCapture, emitOnRepeat);

		this.balls={};
		for (var i = 0; i < 15; i++) {
			this.balls[keys[i]] = 'ball-' + keys[i];
		}
	

		this.balloons = [];

		this.startGame();	
		
		this.b = {'ba':'ba'}

		this.chars = [];
		for(var i=0;i<4;i++) {
			this.chars.push(this.randomChar());
			this.b[i] = this.balloons[i]
		}

		// for (var i in this.balloons)
			// console.log(i,this.balloons[i], this.balloons[i].texture.key)
			// this.balloons[i].texture.key

        spacebar  = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        var Bullet = new Phaser.Class({
			Extends: Phaser.GameObjects.Image,
			initialize:
			function Bullet (scene)
			{
				Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
	
				this.speed = Phaser.Math.GetSpeed(600, 1);
			},
		
			fire: function (x, y)
			{
				this.setPosition(x, y);
	
				this.setActive(true);
				this.setVisible(true);
			},
	
			update: function (time, delta)
			{
				this.x += this.speed * delta;
	
				if (this.x > 1200)
				{
					this.setActive(false);
					this.setVisible(false);
				}
			}
		
		});

        bullets = this.add.group({
			classType: Bullet,
			maxSize: 30,
			runChildUpdate: true
		});

        // 120 seconds
		this.initialTime = 120;

		var text = this.add.text(20, 32, formatTime(this.initialTime), { font: '80px Arial Black',  color: '#ff0000' });

		// Each 1000 ms call onEvent
		var timedEvent = this.time.addEvent({ delay: 1000, callback: onEvent, callbackScope: this, loop: true });

		function formatTime(seconds){
			// Minutes
			var minutes = Math.floor(seconds/60);
			// Seconds
			var partInSeconds = seconds%60;
			// Adds left zeros to seconds
			partInSeconds = partInSeconds.toString().padStart(2,'0');
			// Returns formated time
			return `${minutes}:${partInSeconds}`;
		}		
		
		function onEvent ()
		{
			if (this.initialTime > 0) {
				this.initialTime -= 1; // One second
				text.setText(formatTime(this.initialTime));
			}
			else
				this.scene.start('gameOver'); 
		}	
		
		this.input.on('pointerup', function (pointer) {console.log(pointer.x, pointer.y)})
	}

	update(time,delta){
		if (Phaser.Input.Keyboard.JustDown(spacebar))
		{
			var bullet = bullets.get();	
			if (bullet)
			{
				bullet.fire(gun.x, gun.y);
			}
		} 
		this.balloons.forEach(b => b.update(time,delta));

		this.input.keyboard.on('keydown', function (event) {
			var ball = 'ball-'
            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.SPACE)
            {
				console.log('space')
				// this.balloons[0].destroy()
            }
			if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.A)
            {
				ball += 'a'

				
				this.ballons[0].visible = false
            }
			if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.S)
            {
				ball += 's'
				console.log(ball)
            }
			if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.D)
            {
				ball += 'd'
				// console.log(ball)
            }
			if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.F)
            {
				ball += 'f'
				// console.log(ball)
            }
        });

		this.scoreText.setText(this.score);
	//	this.lifeText.setText(this.life);
		
		// console.log(this.balloons[0].key)
	}

	startGame() {
		var sx = (this.sys.game.config.width)/3;
		for(var i=0;i<5;i++) {
			this.addBalloon(sx*i + sx*0.5);
		}
		// this.score = 0;
		this.score -= 5;
	}

	addBalloon(x) {
		if(!x) x = Math.floor(Math.random()*(this.sys.game.config.width-128)) + 64;
		// var balloon = new Balloon(this, x, this.sys.game.config.height+128, this.randomColor());

		var balloon = new Balloon(this, x, this.sys.game.config.height+128, this.randomBalloon());

		balloon.speed = 0.25 + Math.random() + (this.score/10);
		this.balloons.push(balloon);
		this.score++;
	}

	killBalloon(balloon) {
		this.popSound.play();
		this.balloons = this.balloons.filter(b => b!==balloon);
		var tween1 = this.tweens.add({
			targets: balloon,
			scaleX: 1.5,
			scaleY: 1.5,
			duration: 50
		});
		var tween2 = this.tweens.add({
			targets: balloon,
			scaleX: 0,
			scaleY: 0,
			duration: 50,
			delay: 50,
			onComplete: () => balloon.destroy()
		});
	}

	

	gameOver() {
		this.life--;
		this.cameras.main.shake(500);
		this.balloons.forEach(b => this.killBalloon(b));
		// this.score = 0;
		if (this.life < 0)
			this.scene.start('gameOver');
		else
			this.startGame() 
	}

	randomBalloon() {
		var random = Math.floor(Math.random()*k.length);
		console.log('ball-' + k[random])
		return 'ball-' + k[random]
	}

	randomColor() {
		// var colors = ['balloon-red','balloon-blue','balloon-yellow','balloon-green','balloon-purple'];
		// var colors = ['ball1', 'ball2', 'ball3', 'ball4']
		var colors = ['ball-a', 'ball-s', 'ball-d', 'ball-f']
		// for (var k in this.balls) {
		// 	colors.push(this.balls[k]);
		// }
		var random = Math.floor(Math.random()*colors.length);
		return colors[random];
	}

	randomChar() {
		// var colors = ['balloon-red','balloon-blue','balloon-yellow','balloon-green','balloon-purple'];
		var chars = "abcdefghijklmnopqrstuvwxyz"
		var random = Math.floor(Math.random()*chars.length);
		return chars[random];
	}
}