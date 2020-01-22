const Fx = (a,b)=>(x)=>a+b*x;
const fa = (b,x)=>(a)=>1;
const fb = (b,x)=>(b)=>x;

const Ex = (a,b,y)=>(x)=>(y-Fx(a,b)(x))**2

const Ea = (b,x,y)=>(a)=>(y-Fx(a,b)(x))**2
const Eb = (a,x,y)=>(b)=>(y-Fx(a,b)(x))**2


const ea = (b,x,y)=>(a)=>2 * fa(b,x)(a) * (y-Fx(a,b)(x))
const eb = (a,x,y)=>(b)=>2 * fb(a,x)(b) * (y-Fx(a,b)(x))


const dataFunc=Fx(Math.random(),1-2*Math.random());
const dataNoise =0.1;
const targetLoss= dataNoise**2*0.25;

const DataLength = 50;

var a = Math.random();
var b = 1-2*Math.random();
var x = 0;
var y = 0;

var t = 0;
var trainSpeedFunc=t=>Math.max(0.1, 1*0.99**t)/DataLength;
var trainSpeed = trainSpeedFunc(t);

var passesPerStep = 1;




let input = [];
let output = [];
for (let i=0; i < DataLength; i++){
    let x = Math.random();
    let y = dataFunc(x)+dataNoise-Math.random()*dataNoise*2;
    input.push(x);
    output.push(y);
}

const Ealla=b=>a=>input.map((x,i)=>{
    let y = output[i];
    return Ea(b,x,y)(a)
}).reduce((p,c)=>p+c)/DataLength
const Eallb=a=>b=>input.map((x,i)=>{
    let y = output[i];
    return Eb(a,x,y)(b)
}).reduce((p,c)=>p+c)/DataLength


var loss = 1;

function xy(i=Math.floor(Math.random()*DataLength)){
    let x = input[i];
    let y = Fx(a,b)(x);
    return {x,y}
}

function getVars(i=Math.floor(Math.random()*DataLength)){
    return {a,b,...xy(i)}
}


onload=e=>{
    log(null, Fx, fa , fb, Ex, ea, eb);
    log("formula's");
    displayStep();
}

var playing = false;
function togglePlay(button){
    if (playing){
        button.innerText = 'play';
        playing = false;
    } else {
        button.innerText = 'pauze';
        requestAnimationFrame(frame);
        playing = true;
    }
}

function frame(){
    step();
    if (loss < targetLoss)playing=false;
    if (playing){
        requestAnimationFrame(frame);
    }
}
function step(repeat=1){
    loss = 0;
    for (let k = 0; k < repeat; k++){
        for (let j = 0; j < passesPerStep; j++){
            trainSpeed = trainSpeedFunc(t)
            lossA = 0;
            lossB = 0;
            for (let i = 0; i < DataLength; i++){
                let j = Math.floor(Math.random()*DataLength);
                let pos = xy(j);
                x = pos.x;
                y = output[j];
                a+= ea(b,x,y)(a)*trainSpeed
                b+= eb(a,x,y)(b)*trainSpeed
                loss+=Ex(a,b,y)(x);
            }
            t++
        }
        loss /= DataLength;
        displayStep();
    }
}

function displayStep(){
    draw(Eallb(a), b-0.1, b+0.1, 0.001, 400, 400, [b], [Eallb(a)(b)],10,10, 'loss b' );
    draw(Ealla(b), a-0.1, a+0.1, 0.001, 400, 400, [a], [Ealla(b)(a)],10,10, 'loss a');
    draw(Fx(a,b), 0, 1, 0.01, 400, 400, input, output, 10, 10, 'data');
    log()
    log(getVars(), Fx, fa , fb, Ex, ea, eb);
    log(`taget loss: ${targetLoss.toPrecision(2)} loss: ${loss.toPrecision(2)}, speed: ${(trainSpeed*DataLength).toPrecision(2)}<br>
    a:${a}<br>
    b:${b}`);
}