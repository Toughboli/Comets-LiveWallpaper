var params = {
     speed: 20,
     fadeStrength: 0.05,
     sparkleCount: 100,
     sparkleSpeed: 100,
     cometCount: 100,
    
     color:{
        get: function(t){
            var r = 0.5+0.5*Math.cos(6.28318*(1.0*t+0.0));
            var g =  0.5+0.5*Math.cos(6.28318*(1.0*t+0.333));
            var b = 0.5+0.5*Math.cos(6.28318*(1.0*t+0.667));

            r *= 255;
            g *= 255;
            b *= 255;

            return {r,g,b};
        }
     },

     canvas: document.getElementById("canvas"),

    velocity: {
        x: -3,
        y: 3
    },
    accel: {
        x:0.5,
        y:-0.1
    }
}

//main
//
var canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let mainDraw = setInterval(draw,50-params.speed,ctx);
let sparkleDraw = setInterval(drawSparkles,100-(params.sparkleSpeed*25),params.sparkleCount);
//
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

//definitions
//
function draw(ctx){
    //used for fade out effect
    ctx.fillStyle = `rgba(0,0,0, ${params.fadeStrength})`;
    ctx.fillRect(0, 0, params.canvas.width, params.canvas.height);

    
    //drawSparkles(params.sparkleCount);
    

    drawComet();
}
function drawSparkles(n){
    if(n == 0){
        return;
    }
    let t = 0;
    for(let i = 0; i < n; i++){
        c = params.color.get(t);
        ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},1)`;
        ctx.beginPath();
        ctx.arc(Math.random()*canvas.width,Math.random()*canvas.height,Math.random()*1,0,2*Math.PI);
        ctx.fill();
        t += 0.1;
    }
    
}
function drawComet(){
    //determine starting corner
    //uv = v/|v|
    var mv = Math.sqrt(params.velocity.x**2 + params.velocity.y**2);
    var uv = [params.velocity.x / mv, params.velocity.y / mv];


     var rx = Math.random()*canvas.width;
    var ry = Math.random()*canvas.height;
    if(comet.cometCount >= params.cometCount){
        return;
    }
    var c = new comet(rx,ry,params.velocity.x,params.velocity.y,params);  
}

class comet {
    constructor(x,y,vx,vy,params){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = 5;
        this.t = 0;
        this.params = params;
        this.interval = null;
        this.startInterval();
        comet.cometCount++;
    };

    startInterval() {
        this.interval = setInterval(() => {
        this.draw(); 
        }, this.params.speed);
    };

    stopInterval() {
        comet.cometCount--;
        clearInterval(this.interval);
    };

    draw(){
        var ctx = this.params.canvas.getContext("2d");
        //drawing
        this.t += 0.1;
        var c = this.params.color.get(this.t);
        //ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},1)`;
        ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},1)`;
        ctx.lineWidth = this.radius;
        //ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
        //ctx.fill();
        ctx.beginPath();
        ctx.moveTo(this.x,this.y);
        ctx.lineTo(this.x+this.vx,this.y+this.vy);
        ctx.stroke();

        //updating position
        this.x += this.vx;
        this.y += this.vy;
        this.vx += this.params.accel.x;
        this.vy += this.params.accel.y;

        //determine when to kill the comet
        if(this.t > 1000){
            this.stopInterval();
        }
        if(this.x < 0 || this.x > this.params.canvas.width || this.y < 0 || this.y > this.params.canvas.height){
            this.stopInterval();
        }
    };

}
comet.cometCount = 0;

window.onresize=()=>{
    location.reload();
}

//TODO check for null/invalid val cases
function livelyPropertyListener(name, val)
{
    switch(name) {
        case "speed":
            params.speed = val;
            clearInterval(mainDraw);
            mainDraw = setInterval(draw, 50-params.speed, ctx);
            break;
        case "fadeStrength":
            params.fadeStrength = val;
            break;
        case "sparkleCount":
            params.sparkleCount = val;
            clearInterval(sparkleDraw);
            sparkleDraw = setInterval(drawSparkles,100-(params.sparkleSpeed*25), params.sparkleCount);
            break;
        case "sparkleSpeed":
            params.sparkleSpeed = val;
            clearInterval(sparkleDraw);
            sparkleDraw = setInterval(drawSparkles,100-(params.sparkleSpeed*25), params.sparkleCount);
            break;
        case "cometCount":
            params.cometCount = val;
            break;
        case "velocityX":
            params.velocity.x = Number(String(val).trim());
            break;
        case "velocityY":
            params.velocity.y = Number(String(val).trim());
            break;
        case "accelX":
            params.accel.x = Number(String(val).trim());
            break;
        case "accelY":
            params.accel.y = Number(String(val).trim());
            break;
    }
}



