function log(values='', ...args){
    if (args.length > 0){
        let div = document.createElement('div');
        let html = '';
        for (let arg of args){
            if(typeof arg =='function'){
                let src = arg.toString()+' ';
                for (let i in values){
                    re = new RegExp(`([>\\(\\,\\*\\/\\+\\-\\=]+)${i}([ \\)\\,\\*\\/\\+\\-\\=]+)`, 'g');
                    src = src.replace(re, `$1${values[i].toPrecision(2)}$2`);
                }
                const parts = src.split('=>');
                let body = parts.pop();
                body = body.replace(/([\w]*)(\([\w,]*\))(\([\w,]*\))/g, '$1<sub>$2</sub>$3');
                let target = parts.pop();
                let consts = parts.pop();
                if (values){
                    const constsAr = consts.replace(/(\(|\))/g, '').split(',').map(v=>parseFloat(v));
                    let result = arg(...constsAr)(parseFloat(target.replace(/(\(|\))/g, '')) );
                    html+=`<p class='func'>${arg.name}<sub>${consts}</sub>${target} = ${body} = ${result.toPrecision(2) }</p>`;
                } else {
                    html+=`<p class='func'>${arg.name}<sub>${consts}</sub>${target} = ${body}</p>`;
                }
            }
            if (typeof arg == 'string'){
                html+=`<p class=text>${arg}</p>`
            }
            if (typeof arg == 'object'){
                html+=`<p class=text>${JSON.stringify(arg)}</p>`
            }
        }
        div.innerHTML = html;
        logElement.insertBefore(div, logElement.firstChild);
    } else {
        let text = document.createElement('p');
        text.innerHTML = `${values}<br>`;
        logElement.insertBefore(text, logElement.firstChild);
        logElement.insertBefore(document.createElement('hr'), logElement.firstChild);
    }
}

function draw(func, minX=0, maxX=1, dx=0.01, width=200, height=200, xs=[], ys=[], rSize=10, padding=40,header=func.name){
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height= height;
    const ctx = canvas.getContext('2d');
    // ctx.scale(1,-1);
    // ctx.translate(0,-height);
    ctx.strokeStyle = "green";
    ctx.lineWidth = 5;
    let minY = Infinity;
    let maxY = -Infinity;
    for (let x = minX; x <= maxX; x+=dx){
        let y = func(x);
        if (y < minY)minY=y;
        if (y > maxY)maxY=y;
    }
    for (let i in xs){
        let x = xs[i];
        let y = ys[i];
        if (y < minY)minY=y;
        if (y > maxY)maxY=y;
    }
    const sx = (width-padding*2)/(maxX-minX);
    const sy = (height-padding*2)/(maxY-minY);

    for (let i in xs){
        const x = xs[i];
        const y = ys[i];
        ctx.fillRect((x-minX)*sx-0.5*rSize+padding,(y-minY)*sy-0.5*rSize+padding, rSize,rSize);
    }
    ctx.fillStyle = 'red';

    ctx.beginPath();
    for (let x = minX; x <= maxX; x+=dx){
        let y = func(x);
        ctx.lineTo((x-minX)*sx+padding, (y-minY)*sy+padding);
    }
    ctx.stroke();
    // ctx.scale(1,-1);
    // ctx.translate(0,-height);

    ctx.font = '30px Arial';
    ctx.fillText(header, 100,30);
    ctx.font = '10px Arial';

    ctx.fillText(`(${minX.toPrecision(1)}, ${minY.toPrecision(1)})`, 10,10);
    ctx.fillText(`(${maxX.toPrecision(1)}, ${minY.toPrecision(1)})`, width-60,10);
    ctx.fillText(`(${minX.toPrecision(1)}, ${maxY.toPrecision(1)})`, 10,height-10);
    ctx.fillText(`(${maxX.toPrecision(1)}, ${maxY.toPrecision(1)})`, width-60,height-10);
    logElement.insertBefore(canvas, logElement.firstChild);
}

