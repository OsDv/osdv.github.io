// https://dl.acm.org/doi/10.1145/1073204.1073251
//consts
const auxinsRate = 10;
const VEIN_COLOR = "green";
const AUXIN_COLOR = "red";
const BIRTH_DISTANCE = 30;
const AUXIN_RADIUS = 10;
const VEIN_RADIUS = 5;
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
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
	this.color=color;
	this.direction;
	this.watchers = [];
    }
    // Method
    draw(ctx) {
	//ctx.fillRect(this.x,this.y, AUXIN_RADIUS, AUXIN_RADIUS);
	ctx.beginPath();

	ctx.arc(this.x,this.y,VEIN_RADIUS,0,2*Math.PI);
	ctx.fillStyle= this.color;
	ctx.fill();
    }
}
//colonies = [{auxins:[],veins=[new Vein(300,300,VEIN_COLOR)]}]
let auxins = [];
let veins = [new Vein(300,300,VEIN_COLOR)];
function sprayAuxins()
{
    for (let i = 0; i < auxinsRate; i++) {
	x = Math.random()*c.width;
	y = Math.random()*c.height;
	auxins.push(new Auxin(x,y,AUXIN_COLOR));
    }
}
function removeCloseAuxins(){
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
function setGrowDirections()
{
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
function growNewVeins()
{
    newVeins = [];
    veins.forEach((v)=>{
	if (v.direction.x!=0 || v.direction.y!=0)newVeins.push(new Vein(v.x+v.direction.x*VEIN_RADIUS*2,v.y+v.direction.y*VEIN_RADIUS*2,VEIN_COLOR));
    })
    veins = [...veins,...newVeins];
}
sprayAuxins();
removeCloseAuxins();
auxins.forEach((auxin)=>{auxin.draw(ctx);});
veins.forEach((auxin)=>{auxin.draw(ctx);});

window.addEventListener('keydown', (event) => {
  //console.log(`Key pressed: ${event.key} | Physical code: ${event.code}`);
  
  // Example: Check for specific keys
  if (event.key === ' ') {
      setGrowDirections();
      growNewVeins();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, c.width, c.height);
      sprayAuxins();
      removeCloseAuxins();
      //auxins.forEach((auxin)=>{auxin.draw(ctx);});
      veins.forEach((vein)=>{vein.draw(ctx);});
  }
});
