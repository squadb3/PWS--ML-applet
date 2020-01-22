let targetLoss = 0.001;


let A = Math.random()+1;
let B = 1-Math.random()*2;
let D = Math.random()*0.2;
let L = 10;

let f=(a,b)=>x=>a+b*x;

let fa=(x,b)=>a=>1

let fb=(x,a)=>b=>x

let e=(a,b)=>y=>x=>(y-f(a,b)(x))**2;

let ea=(x,b)=>
    y=>a=>2*fa(x,b)(a)*(y-f(a,b)(x))

let eb=(x,a)=>
    y=>b=>2*fb(x,a)(b)*(y-f(a,b)(x))

let input = [];

let output = [];

for (let i=0; i < L; i++){
    let x = Math.random();
    let y = f(A,B)(x)+D-Math.random()*D*2;
    input.push(x);
    output.push(y);
}
console.log(input, output);

let trainSpeed=5;
trainSpeed /= L;
let minTrainSpeed = trainSpeed*0.01;
let trainMult = 0.9;

let a = Math.random()+1;
let b = 1-Math.random()*2;
let F = f(a,b);
let tries = 0;
let maxTries = 100;
function draw(){
    tries++;
    trainSpeed = Math.max(minTrainSpeed, trainSpeed*trainMult);
    let ctx = canvas.getContext('2d');
    ctx.strokeStyle = 'blue';
    let w=canvas.width;
    let h=canvas.height;
    let I = Math.max(...input);
    let O = Math.max(...output);
    let M = 40;
    let s = 10;

    ctx.clearRect(0,0,w,h);
    for (let i in input){
        let x = input[i] /I*(w-2*M)+M-0.5*s;
        let y = (O-output[i])/O*(h-2*M)+M-0.5*s;
        ctx.fillRect(x,y, s,s);
    }
    ctx.beginPath();
    for (let i = 0; i <= I; i+=0.01){
        let x = i/I*(w-2*M)+M;
        let y = (O-F(i))/O*(h-2*M)+M;
        ctx.lineTo(x, y);
    }
    ctx.stroke();
    let totalA = 0;
    let totalB = 0;
    let x;
    let y;
    for(let i = 0 ; i < L; i++){
    F = f(a,b);
    let r = Math.floor(Math.random()*input.length);
    x = input[r];
    y = output[r];
    let errorA = ea(x,b)(y)(a);
    let errorB = eb(x,a)(y)(b);
    totalA += errorA;
    totalB += errorB;
    a += errorA*trainSpeed;
    b += errorB*trainSpeed;
    }
    let avgA = totalA/L;
    let avgB = totalB/L;
    let total = Math.sqrt(avgA*avgA+avgB*avgB);
    document.title = `${total.toFixed(5)} ${(trainSpeed*L).toFixed(5)}`;

    logElement.innerHTML += `
        <p>f(x) = ${a.toFixed(5)} + ${b.toFixed(5)}x</p>
        <p>ea:${totalA.toFixed(5)} eb:${totalB.toFixed(5)} </p>
        <p>x:${x.toFixed(5)}</p>
        <p>y:${y.toFixed(5)}</p>
        <p>y:${F(x).toFixed(5)}</p>
        <p>loss: ${total.toFixed(5)}</p>
        <hr>
    `;


    
    if (total <= targetLoss){
        document.title = `done: ${total.toFixed(5)} ${(trainSpeed*L).toFixed(5)}`;
    }else if (tries > maxTries){
        document.title = `time out: ${total.toFixed(5)} ${(trainSpeed*L).toFixed(5)}`;
    }else {
        requestAnimationFrame(draw)
    }
}
onload=()=>requestAnimationFrame(draw)