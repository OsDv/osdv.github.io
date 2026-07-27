// https://dl.acm.org/doi/10.1145/1073204.1073251
function cssVar(name) {
    return getComputedStyle(document.body)
        .getPropertyValue(name)
        .trim();
}
//consts

const auxinsRate = 10;
let VEIN_COLOR = cssVar("--leaf-venation-color");
const AUXIN_COLOR = "red";
const BIRTH_DISTANCE = 20;
const AUXIN_RADIUS = 10;
const VEIN_RADIUS = 5;
const COLONIE_LIFESPAN = 1500; // ms
const VEIN_WIDTH = 5;

// 
function cssVar(name) {
    return getComputedStyle(document.body)
        .getPropertyValue(name)
        .trim();
}
const mouse = {
    x: 0,
    y: 0
};
var c = document.getElementById("bg-canvas");
var ctx = c.getContext("2d");
document.addEventListener("mousemove", (e) => {
    const pos = getMousePos(c, e);
    mouse.x = pos.x;
    mouse.y = pos.y;
});
function resizeCanvas() {
    c.width = window.innerWidth;
    c.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// 
class Auxin{
    constructor(x, y,color) {
	this.x= x;
	this.y= y;
	this.color=color;
    }
    // Method
    draw(ctx) {
	//ctx.fillRect(this.x,this.y, AUXIN_RADIUS, AUXIN_RADIUS);
	ctx.beginPath();

	ctx.arc(this.x,this.y,AUXIN_RADIUS,0,2*Math.PI);
	ctx.fillStyle= this.color;
	ctx.fill();

	ctx.closePath();
    }
}
class Vein{
    constructor(x, y,color) {
	this.x= x;
	this.y= y;
	this.children = [];
	this.color=color;
	this.direction;
	this.watchers = [];
    }
    // Method
    draw(ctx,width=VEIN_WIDTH) {
	//ctx.fillRect(this.x,this.y, AUXIN_RADIUS, AUXIN_RADIUS);
	ctx.beginPath();

	ctx.moveTo(this.x,this.y);
	this.children.forEach((c)=>{
	    ctx.lineTo(c.x,c.y);
	    ctx.strokeStyle = VEIN_COLOR; // Red color
	    ctx.lineWidth = width;           // 5 pixels thick
	    ctx.stroke();

	    c.draw(ctx,width*0.95);
	});

    }

    getArray()
    {
	let arr = [this];
	this.children.forEach((c)=>{
	    arr = [...arr,...c.getArray()];
	})
	return arr;
    }
}
colonies = [{auxins:[],root:new Vein(300,300,VEIN_COLOR),birth:Date.now()}]
//let auxins = [];
//let veins = [new Vein(300,300,VEIN_COLOR)];
function sprayAuxins(colonie)
{
    let auxins = colonie.auxins;
    for (let i = 0; i < auxinsRate; i++) {
	x = Math.random()*c.width;
	y = Math.random()*c.height;
	auxins.push(new Auxin(x,y,AUXIN_COLOR));
    }
}
function removeCloseAuxins(colonie){
    let auxins = colonie.auxins;
    let veins = colonie.root.getArray();
    let indices =[];
    auxins.forEach((a,i)=>{
	veins.forEach((v)=>{
	    distance = Math.sqrt((a.x-v.x)*(a.x-v.x)+(a.y-v.y)*(a.y-v.y));
	    if (distance<BIRTH_DISTANCE){
		indices.push(i);
	    } 
	})
    })
    indices.forEach((i)=>{auxins.splice(i,1)});
}
function setGrowDirections(colonie)
{
    let auxins = colonie.auxins;
    let veins = colonie.root.getArray();
    auxins.forEach((a,i)=>{
	target = veins[0];
	targetDistance = Math.sqrt((a.x-veins[0].x)*(a.x-veins[0].x)+(a.y-veins[0].y)*(a.y-veins[0].y));
	veins.forEach((v)=>{
	    if ((distance=Math.sqrt((a.x-v.x)*(a.x-v.x)+(a.y-v.y)*(a.y-v.y)))<targetDistance){
		target = v;
		targetDistance = distance;
	    }
	})
	target.watchers.push(a);
    })
    veins.forEach((v)=>{
	v.direction = {x:0,y:0};
	if (w=v.watchers.pop())minDistance = Math.sqrt((w.x-v.x)*(w.x-v.x)+(w.y-v.y)*(w.y-v.y));
	v.watchers.forEach((w)=>{
	    distance=Math.sqrt((w.x-v.x)*(w.x-v.x)+(w.y-v.y)*(w.y-v.y));

	    if (distance<minDistance){
		v.direction = {x:(w.x-v.x)/distance,y:(w.y-v.y)/distance};
		minDistance = distance;
	    }
	})
    })
}
function growNewVeins(colonie)
{
    let veins = colonie.root.getArray();
    veins.forEach((v)=>{
	if (v.direction.x!=0 || v.direction.y!=0)v.children.push(new Vein(v.x+v.direction.x*VEIN_RADIUS,v.y+v.direction.y*VEIN_RADIUS,VEIN_COLOR));
    })
}

sprayAuxins(colonies[0])
removeCloseAuxins(colonies[0]);

// <https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas>
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}
function drawFrame()
{
    VEIN_COLOR = cssVar("--leaf-venation-color");
    let newColonie = {auxins:[],root:new Vein(mouse.x,mouse.y,VEIN_COLOR),birth:Date.now()};
    sprayAuxins(newColonie)
    removeCloseAuxins(newColonie);
    colonies.push(newColonie);
    let dead = [];
    ctx.fillStyle = cssVar("--background-color");
    ctx.fillRect(0, 0, c.width, c.height);
    colonies.forEach((c,i)=>{
	let age = Date.now() - c.birth;
	if (age>COLONIE_LIFESPAN) dead.push(i);
	setGrowDirections(c);
	growNewVeins(c);
	sprayAuxins(c);
	removeCloseAuxins(c);
	c.root.draw(ctx);
    })
    dead.forEach((i)=>{
	colonies.splice(i,1);
	console.log("Diesd");
    })
    requestAnimationFrame(drawFrame);
}
drawFrame();

// window.addEventListener('keydown', (event) => {
//   //console.log(`Key pressed: ${event.key} | Physical code: ${event.code}`);
//   // Example: Check for specific keys
//   if (event.key === ' ') {
//       drawFrame();
//   }
// });
