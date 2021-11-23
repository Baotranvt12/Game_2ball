config = {
	type: Phaser.CANVAS,
	width: 1200,
	height: 700,
	physics: {
        default: 'arcade',
	        arcade: {
	            gravity: { y: 0 },
	            debug: false
	        }
    },
	backgroundColor: '#FFF7AD',

    audio: {
        disableWebAudio: true
    },
	scene: [scene1, scene2, scene3]
}

var game = new Phaser.Game(config);

function soundOff (sound, sound_off, music, scene) {
    sound.visible = false
    sound_off.visible = true
    music.mute = true;
}

function soundOn (sound, sound_off, music, scene) {
    sound_off.visible = false
    sound.visible = true
    music.mute = false;
}


function twirl(image, speed){
	var circle = new Phaser.Geom.Circle(400, 300, 200);
	image.rotation += speed;
	Phaser.Geom.Circle.CircumferencePoint(circle, image.rotation - (Math.PI / 2));
}

function moveUpDowntoXY(image, setx, sety, setloop, settime, setyoyo, scene){
	if (sety == -1){
		var timeline = scene.tweens.timeline({
	        targets: image,
	        loop: setloop,
	        tweens: [
		        {
		            x: setx, 
		            ease: 'Sine.easeInOut',
		            duration: settime,
		            yoyo: setyoyo
		        },
	        ]
    	});
	}
	else if (setx == -1){
		var timeline = scene.tweens.timeline({
	        targets: image,
	        loop: setloop,
	        tweens: [
		        {
		            y: sety, 
		            ease: 'Sine.easeInOut',
		            duration: settime,
		            yoyo: setyoyo
		        },
	        ]
    	});
	}
	else {
		var timeline = scene.tweens.timeline({
	        targets: image,
	        loop: setloop,
	        tweens: [
		        {
		        	x: setx,
		            y: sety, 
		            ease: 'Sine.easeInOut',
		            duration: settime,
		            yoyo: setyoyo,
		        },
	        ]
    	});
	}
}

function zoomOut(image, numScale, maxScale, addScale, settime, scene){
	var timedEvent = scene.time.addEvent({ delay: settime, callback: loops, callbackScope: scene, loop: true });
	var numScale;
	function loops(){
		numScale = numScale + addScale;
		if (numScale <= maxScale){
			image.setScale(numScale);
		}
	}
}

function zoomIn(image, numScale, minScale, addScale, settime, scene){
	var timedEvent = scene.time.addEvent({ delay: settime, callback: loops, callbackScope: scene, loop: true });
	var numScale;
	function loops(){
		numScale = numScale - addScale;
		if (numScale >= minScale){
			image.setScale(numScale);
		}
	}
}

class point{
	x = 0;
	y = 0;
};

function pointerToSprite(sprite, sprite2)
	{
		var orx = sprite.x;
		var ory = 0;
		var A = new point();
		var B = new point();
		var C = new point();

		var AB = new point();
		var BC = new point();

		A.x = orx;
		A.y = ory;

		B.x = sprite.x;
		B.y = sprite.y;

		C.x = sprite2.x;
		C.y = sprite2.y;

		var AB = Math.sqrt(Math.pow(B.x-A.x,2)+ Math.pow(B.y-A.y,2));    
    	var BC = Math.sqrt(Math.pow(B.x-C.x,2)+ Math.pow(B.y-C.y,2)); 
    	var AC = Math.sqrt(Math.pow(C.x-A.x,2)+ Math.pow(C.y-A.y,2));
    	var radi = Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB));
    	var angle = (radi*180)/Math.PI;
    	if (sprite.x < sprite2.x){
    		sprite.angle = angle
    	}
    	else 
    	{
    		sprite.angle = - angle;
    	}
	}

function ABpointerToSprite(spinsprite, scene){
	var mypointer = new point();
	scene.input.on('pointermove', function(pointer){
			mypointer.x = pointer.x;
			mypointer.y = pointer.y;
	}, scene);
	var timedEvent = scene.time.addEvent({ delay: 10, callback: loops, callbackScope: scene, loop: true });
	function loops()
	{
		pointerToSprite(spinsprite, mypointer);
	}
}

function getangle(sprite, sprite2, scene)
	{
		// get angle
		var orx = sprite.x;
		var ory = 0;
		var A = new point();
		var B = new point();
		var C = new point();

		var AB = new point();
		var BC = new point();

		A.x = orx;
		A.y = ory;

		B.x = sprite.x;
		B.y = sprite.y;

		C.x = sprite2.x;
		C.y = sprite2.y;

		var AB = Math.sqrt(Math.pow(B.x-A.x,2)+ Math.pow(B.y-A.y,2));    
    	var BC = Math.sqrt(Math.pow(B.x-C.x,2)+ Math.pow(B.y-C.y,2)); 
    	var AC = Math.sqrt(Math.pow(C.x-A.x,2)+ Math.pow(C.y-A.y,2));
    	var radi = Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB));
    	var angle = (radi*180)/Math.PI;

    	if (sprite.x < sprite2.x){
    		angle = angle
    	}
    	else 
    	{
    		angle = -angle;
    	}

    	// end getangle
    	return angle;
	}

function spinyoyo(sprite, start, des, speed, scene)
		{
			sprite.angle = start ;
			var timedEvent = scene.time.addEvent({ delay: 10, callback: loops, callbackScope: scene, loop: 1 });
			function loops()
			{
				sprite.angle += speed;
				
				if ((sprite.angle < start) || (sprite.angle > des))
				{ 

					speed = -speed
				}

			}

		}	

function movenorontate(sprite, distance, angle){
		var angle = angle - 90;
		var posX = Math.round(Math.cos(angle * Math.PI / 180) * distance + sprite.x);
		var posY = Math.round(Math.sin(angle * Math.PI / 180) * distance + sprite.y);
		sprite.x = posX;
		sprite.y =  posY;
	}

function colliderImage(image1, image2, image3, scene){
	scene.physics.add.collider(image1, image2, functiona, null, scene);
	function functiona(image1, image2){
		image1.destroy(); image2.destroy(); image3.visible = false;
		var timedEventt = scene.time.delayedCall(1000, onStartt, [], scene);
		function onStartt(){
			win = win + 1;
		}
	}
}

function click5(image, scene){
	image.on('pointerover', function(){
		image.setScale(1.1);
	}, this);
	image.on('pointerout', function(){
		image.setScale(1);
	}, this);
	image.on('pointerdown', function(){
		position = 1;
		image.destroy();
		scene.sound.play('right');
		// var timedEventt = scene.time.delayedCall(1000, onStartt, [], scene);
		// function onStartt(){
		// 	win = 1;
		// }
	}, this);
}
function click6(image, scene){
	image.on('pointerover', function(){
		image.setScale(1.1);
	}, this);
	image.on('pointerout', function(){
		image.setScale(1);
	}, this);
	image.on('pointerdown', function(){
		position = 2;
		image.destroy();
		scene.sound.play('right');
		// var timedEventt = scene.time.delayedCall(1000, onStartt, [], scene);
		// function onStartt(){
		// 	win = 2;
		// }
	}, this);
}

function clickFalse(image, image2, scene){
	image.on('pointerover', function(){
		image.setScale(1.1);
	}, this);
	image.on('pointerout', function(){
		image.setScale(1);
	}, this);
	image.on('pointerdown', function(){
		image.destroy();
		image2.visible = true;
		scene.sound.play('wrong');
		var timedEventt = scene.time.delayedCall(1000, onStartt, [], scene);
		function onStartt(){
			win = -1;
		}
	}, this);
}