const canvas = document.querySelector("canvas"),
ctx = canvas.getContext("2d"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-img");

let isDrawing =false,
widthBrush = 5,
selectedOption,
prevMouseX,prevMouseY, snapshot,selectedColor;

const setCanvasBackground = ()=>{
    ctx.fillStyle = "#fff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = selectedColor;
}

window.addEventListener("load",()=>{
    canvas.width=canvas.offsetWidth;
    canvas.height=canvas.offsetHeight;
    setCanvasBackground();
});

const startDrawing = (e)=>{
    isDrawing=true;
    ctx.beginPath();
    ctx.lineWidth = widthBrush;
    prevMouseX=e.offsetX;
    prevMouseY=e.offsetY;
    snapshot = ctx.getImageData(0,0,canvas.width,canvas.height);
    ctx.strokeStyle=selectedColor;
    ctx.fillStyle=selectedColor;
}


const drawRectangle = (e)=>{
    if(!fillColor.checked){
        return ctx.strokeRect(e.offsetX,e.offsetY,prevMouseX-e.offsetX,prevMouseY-e.offsetY);
    }
    ctx.fillRect(e.offsetX,e.offsetY,prevMouseX-e.offsetX,prevMouseY-e.offsetY);

}
const drawCricle = (e)=>{
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow((prevMouseX-e.offsetX),2)+Math.pow((prevMouseY-e.offsetY),2));
    ctx.arc(prevMouseX,prevMouseY,radius,0,2*Math.PI);
    (!fillColor.checked)?ctx.stroke():ctx.fill();
}
const drawTriangle =(e)=>{
    ctx.beginPath();
    ctx.moveTo(prevMouseX,prevMouseY);
    ctx.lineTo(e.offsetX,e.offsetY);
    ctx.lineTo(2*prevMouseX-e.offsetX , e.offsetY);
    ctx.closePath();
    (!fillColor.checked)?ctx.stroke():ctx.fill();
}

const drawing = (e)=>{    
    if(!isDrawing)return;
    ctx.putImageData(snapshot,0,0);
    if(selectedOption==="brush"||selectedOption==="eraser"){
        ctx.strokeStyle = selectedOption==="eraser"?"#fff":selectedColor;
        ctx.lineTo(e.offsetX,e.offsetY);
        ctx.stroke();
    }
    else if(selectedOption==="rectangle"){
        drawRectangle(e);
    }
    else if(selectedOption==="circle"){
        drawCricle(e);
    }
    else if(selectedOption==="triangle"){
        drawTriangle(e);
    }
}

const stopDrawing = ()=>{
    isDrawing=false;
}
const changeSize=(e)=>{
    widthBrush=sizeSlider.value;
}
toolBtns.forEach((btn)=>{
    btn.addEventListener("click",()=>{
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedOption=btn.id;
    });
});

colorBtns.forEach((btn)=>{
    btn.addEventListener("click", ()=>{
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

colorPicker.addEventListener("change",()=>{
    colorPicker.parentElement.style.background=colorPicker.value;
    colorPicker.parentElement.click();
})
clearCanvas.addEventListener("click",()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    setCanvasBackground();
});

saveImg.addEventListener("click",()=>{
    let link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;

    link.href = canvas.toDataURL();
    link.click();
});

sizeSlider.addEventListener("change",changeSize)
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mousedown",startDrawing);
canvas.addEventListener("mouseup",stopDrawing);
