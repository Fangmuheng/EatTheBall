/* 设定画布 */
const canvas = document.querySelector('canvas');//使用变量代指了 <canvas> 元素,
const ctx = canvas.getContext('2d');//指画布上的一块允许我们绘制 2D 图形的区域
var count = 0; //计数器
var p = document.querySelector('p');//更改剩多少个球

/* 设定画布长宽 */
//让画布元素的宽和高等于浏览器的宽和高
//网页显示的区域 — 可以从 Window.innerWidth  Window.innerHeight。
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

/* 生成随机数的函数 */
function random(min,max) {
  return Math.floor(Math.random()*(max-min)) + min;
}

/* 生成随机颜色的函数 */
function randomColor() {
  return 'rgb(' +
         random(0, 255) + ', ' +
         random(0, 255) + ', ' +
         random(0, 255) + ')';
}

function Shape(x,y,velX,velY,exists){ //exists用来判断球是否被恶魔圈吃掉了，是一个布尔型属性
	this.exists = exists;
	this.x = x;
	this.y = y;
	this.velX = velX;
	this.velY = velY;
}


/* 创建对象实例化小球 */
function Ball(x,y,velX,velY,exists,color,size){
	//继承Shape()对象里的属性
	Shape.call(this,x,y,velX,velY,exists);
	//新增添的属性
  	this.color = color; //小球颜色
  	this.size = size;  //小球半径
}
//方法继承
Ball.prototype = Object.create(Shape.prototype);
//原本Shape()构造器的prototype的constructor属性指向的是Shape()，现在我们需要指向Ball()
Ball.prototype.constructor = Ball;

/* 画小球 */
//给对象原型上定义draw()方法
//ctx的内容区域就像是一张白纸，我们现在在白纸上开始画东西
Ball.prototype.draw = function(){
	ctx.beginPath();  //该函数用来声明：我们要开始画一个图形了
	ctx.fillStyle = this.color;  //用color来定义图形颜色
	//arc()方法用来在纸上画圆弧
	//x,y是圆弧中心的坐标-小球中心坐标
	//圆弧的半径 -小球半径
	//最后两个参数指的是：开始和结束的角度，即圆弧对应的夹角  -小球从0到2π（360°）
	ctx.arc(this.x,this.y,this.size,0,2*Math.PI); 
	ctx.fill();  //该函数用来声明：我们结束了以beginPath()开始的绘画，并且用我们之前设置的颜色进行填充
}

/* 更新小球数据 */
Ball.prototype.update = function(){
//判断是否会碰到边缘，碰到画布边缘就改变运动方向
	if((this.x+this.size)>=width){
		this.velX = -(this.velX);
	}
	if ((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  	if ((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

 	if ((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }
  //每次调用该方法，小球就会移动这么多
  
  this.y += this.velY;
}
//碰撞变色 -检查其他小球是否和当前小球碰撞了
Ball.prototype.collisionDetect = function(){
	for(var j = 0;j<balls.length;j++){
		if(!(this === balls[j])){

			var dx = this.x - balls[j].x;
			var dy = this.y - balls[j].y;
			var distance = Math.sqrt(dx*dx + dy*dy);

			//判断两个小球中心的距离是否小于两个小球的半径之和
			if(distance < this.size + balls[j].size){
				balls[j].color = this.color = randomColor();
			}
		}
	}
}

/*新功能：定义恶魔圈，进入恶魔圈的小球都会被吃掉*/
function EvilCircle(x,y,exists){
	Shape.call(this,x,y,20,20,exists);
	this.color = 'white';
	this.size = 10;
}
EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

EvilCircle.prototype.draw = function (){
	ctx.beginPath();  //该函数用来声明：我们要开始画一个图形了
	ctx.lineWidth = 3; //恶魔圈的厚度
	ctx.strokeStyle = this.color; 
	//arc()方法用来在纸上画圆弧
	//x,y是圆弧中心的坐标-小球中心坐标
	//圆弧的半径 -小球半径
	//最后两个参数指的是：开始和结束的角度，即圆弧对应的夹角  -小球从0到2π（360°）
	ctx.arc(this.x,this.y,this.size,0,2*Math.PI); 
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

//当特定的键盘按下时会移动恶魔圈
//这里是awds上下左右移动
EvilCircle.prototype.setControls = function(){
	window.onkeydown = e => { //箭头代替匿名函数，无需指定this了（即：var_this = this
    if (e.key === 'a') {
      this.x -= this.velX;
    } else if (e.key === 'd') {
      this.x += this.velX;
    } 
  };
}
EvilCircle.prototype.collisionDetect = function(){
	for(var j = 0;j<balls.length;j++){
		if(balls[j].exists){

			var dx = this.x - balls[j].x;
			var dy = this.y - balls[j].y;
			var distance = Math.sqrt(dx*dx + dy*dy);

			if(distance < this.size + balls[j].size){
				balls[j].exists = false;
				count++;
				p.textContent = '吃掉几个球：'+ count;
			}
		}
	}
}

//数组用来存储小球
var balls = [];

var evilCircle = new EvilCircle(random(0,width),height-10,true);
evilCircle.setControls();

function loop(){
	ctx.fillStyle = 'rgba(0,0,0,0.25)'; //将画布的颜色设置为半透明黑，如果是全黑1，就看不到小球运动的轨迹了
/*该fillRect函数用来画出一个填充整个画布的矩形，四个参数分别分起始坐标、矩形宽高
每次画下一个图，都需要拿这个矩形来遮住以前的图，不然就不是动起来的小球，而像一条蛇一样了*/
	ctx.fillRect(0,0,width,height);  
//屏幕上一直有25个小球
	while(balls.length<25){
		var ball = new Ball(
			random(0,width),
			random(0,height),
			random(2,7),
			random(2,7),
			true,
			randomColor(),
			random(10,20)
			);
		balls.push(ball);
		p.textContent = '吃掉：'+ count;
	}

	
//遍历数组中的所有小球
	for(var i = 0;i<balls.length;i++){
		if(balls[i].exists){
		balls[i].draw();
		balls[i].update();
		balls[i].collisionDetect();
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