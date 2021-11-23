class scene3 extends Phaser.Scene{
	constructor(){
		super('gameOver');
	}
	preload(){
		// this.load.image('bee','assets/ong-ham-hoc.png');
		this.load.image('bg-win','assets/bg-win.png');

		this.load.image('stars','assets/3stars.png');
    }
	create(){	
        this.add.image(600, 350, 'bg-win').setScale(0.6);
        this.add.image(600, 350, 'stars');

		// this.add.image(900, 200, 'bee');

		// var t = "Bây giờ các bạn hãy cùng chị tập gõ phím nhé, chúng ta cần mau mau hoàn thành mỗi phím trước 10 giây đó!"
		// this.add.text(100, 32, t, { font: '16px Arial',  color: '#ff0000' });

		// var bt_continue = this.add.sprite(600, 540, 'continue').setScale(0.8).setInteractive();

		// this.input.keyboard.on('keydown-ENTER', function (event) {
		// 	this.scene.start('getAcquaintedA'); 
		// }, this);

		//this.input.on('pointerup', function (pointer) {console.log(pointer.x, pointer.y)})
	}
	update(){	
		
	}

}