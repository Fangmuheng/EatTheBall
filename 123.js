/* 设定画布 */
const canvas = document.querySelector('canvas');
//2d画布
const ctx = canvas.getContext('2d');
//计数变量
var count = 0;
//用于计数
var p = document.querySelector('p');

/* 设定画布长 */
//让画布元素的宽和高和浏览器相同
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

/* 函数：生成随机数 */
function random(min,max){
	return Math.floor(Math.random()*(max-min))+min;
}

/* 函数：生成随机颜色 */
function randomColor(){
	return 'rgb(' + 
			random(0,255) + ',' +
			random(0,255) + ',' +
			random(0.255) + ')';
}

/* Shape构造器 */
//小球从上往下掉落，其中x,y是坐标，velY是小球掉落的速度，exists是判断小球是否被吃掉
function Shape(x,y,velY,exists){
	this.exists = exists;
	this.x = x;
	this.y = y;
	this.velY = velY;
}

/* 创建对象实例化小球 */
function Ball(x,y,velY,exists,color,size) {
	//继承Shape()对象里的属性
	Shape.call(this,x,y,velY,exists)
	//新属性
	this.color = color;
	this.size = size;
}
//方法继承
Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

/* 画小球 */
Ball.prototype.draw = function(){
	ctx.beginPath();
	ctx.fillStyle = this.color;
	ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
	ctx.fill();
}

/* 判断小球状态 */
Ball.prototype.ifExists = function(){
	for(var j = 0;j<balls.length;j++){
		if(balls[j].exists){
			//当小球掉到水平面以下时，小球消失。
			var dy = this.y - balls[j].y;
			if(this.y<0){
				balls[j].exists = false;
			}
}

/* 小球移动 */
Ball.prototype.update = function(){
	//每调用一次，小球就会往下掉落这么多
	this.y -= this.velY;
}

/* 定义恶魔圈 */
function EvilCircle(x,exists){
	Shape.call(this,x,20,exists);
	this.color = 'white';
	this.size = 10;
}
EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

EvilCircle.prototype.draw = function (){
	ctx.beginPath();  
	ctx.lineWidth = 3; //恶魔圈的厚度
	ctx.strokeStyle = this.color; 
	ctx.arc(this.x,this.size,this.size,0,2*Math.PI); 
	ctx.stroke(); 
};

EvilCircle.prototype.checkBounds = function(){
	//判断恶魔圈是否会碰到画布边缘
	if((this.x+this.size)>=width){
		this.x -= this.size;
	}
	if ((this.x - this.size) <= 0) {
    this.x += this.size;
  }

  	if ((this.y + this.size) >= height) {
    this.y -= this.size;
  }

 	if ((this.y - this.size) <= 0) {
    this.y += this.size;
  }
}

/* 恶魔圈移动 */
EvilCircle.prototype.setControls = function(){
	window.onkeydown = e => { 
    if (e.key === 'a') {
      this.x -= this.velX;
    } else if (e.key === 'd') {
      this.x += this.velX;
    } 
  };
}

/* 吃掉小球 */
EvilCircle.prototype.collisionDetect = function(){
	for(var j = 0;j<balls.length;j++){
		if(balls[j].exists){

			var dx = this.x - balls[j].x;
			var dy = this.y - balls[j].y;
			var distance = Math.sqrt(dx*dx + dy*dy);

			if(distance < this.size + balls[j].size){
				balls[j].exists = false;
				count++;
				p.textContent = 'You already ate so many balls：'+ count;
			}
		}
	}
}

var balls = [];

var evilcircle = new EvilCircle(random(0,width),10,true);
evilcircle.setControls();

function loop(){
	ctx.fillStyle = 'rgba(0,0,0,0.25)'; //将画布的颜色设置为半透明黑，如果是全黑1，就看不到小球运动的轨迹了
/*该fillRect函数用来画出一个填充整个画布的矩形，四个参数分别分起始坐标、矩形宽高
每次画下一个图，都需要拿这个矩形来遮住以前的图，不然就不是动起来的小球，而像一条蛇一样了*/
	ctx.fillRect(0,0,width,height);  
//屏幕上一直有25个小球
	while(balls.length<25){
		var ball = new Ball(
			random(0,width),
			height,
			random(-7,7),
			true,
			randomColor(),
			random(10,20)
			);
		balls.push(ball);
	}

	
//遍历数组中的所有小球
	for(var i = 0;i<balls.length;i++){
		if(balls[i].exists){
		balls[i].draw();
		balls[i].update();
		balls[i].collisionDetect();
		balls[i].ifExists();
		}
	}

	evilCircle.draw();
	evilCircle.checkBounds();
	evilCircle.collisionDetect();
//当一个函数正在运行时传递相同的函数名，从而每隔一小段时间都会运行一次这个函数
//原理是 递归 ，每次函数运行都会调用自己
	requestAnimationFrame(loop);
}
//让动画开始，我们需要调用这个函数
loop();