const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let myColor = 'black';
const colorButton = document.getElementById('colorselect');
const previousColor = document.getElementById('previouscolor');
const bucket = document.getElementById('bucket');
const pencil = document.getElementById('pencil');
const redcolor = document.getElementById('redcolor');
const bluecolor = document.getElementById('bluecolor');
const clear = document.getElementById('clean');
const controlMenu = document.getElementById('control_menu');
const colorArray = [];


function saveToLocal() {
  const dataURL = localStorage.getItem(canvas);
  const img = new Image();
  img.src = dataURL;
  img.onload = () => {
    ctx.drawImage(img, 0, 0);
  };
}

if (performance.navigation.type === 1) {
  saveToLocal();
}

clear.addEventListener('click', () => {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, 512, 512);
});

colorButton.addEventListener('input', () => {
  myColor = colorButton.value;
  colorArray.push(myColor);
});

redcolor.addEventListener('click', () => {
  myColor = 'red';
  colorArray.push(myColor);
});

bluecolor.addEventListener('click', () => {
  myColor = 'blue';
  colorArray.push(myColor);
});

pencil.addEventListener('click', () => {
  pencil.classList.add('active');
});

previousColor.addEventListener('click', () => {
  myColor = colorArray[colorArray.length - 2];
});

bucket.addEventListener('click', () => {
  ctx.fillStyle = myColor;
  ctx.fillRect(0, 0, 512, 512);
});


let isDrawing = false;
let lastX = 0;
let lastY = 0;

let scale = 128;
canvas.width = scale;
canvas.height = scale;

function resize() {
  canvas.width = scale;
  canvas.height = scale;
  scale = 512 / scale;
}

const loadButton = document.getElementById('load');
const bw = document.getElementById('blackandwhite');

const img = new Image();
img.crossOrigin = 'anonymous';

let smallimgurl;

function resizeimage() {
  img.src = smallimgurl;
  img.onload = () => {
    const ratio = Math.min(canvas.width / img.width, canvas.width / img.height);
    const centredX = (canvas.width - img.width * ratio) / 2;
    const centredY = (canvas.width - img.height * ratio) / 2;
    ctx.drawImage(img, 0, 0, img.width, img.height, centredX, centredY, img.width * ratio, img.height * ratio);
    ctx.imageSmoothingEnabled = false;
  };
}

async function getLinkToImage() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, 512, 512);
  const url = 'https://api.unsplash.com/photos/random?query=town,';
  const query = document.getElementById('textArea').value;
  const queryString = `${query}&client_id=6bd74a2334263752dc9172ab46633df29c964660e02d79c0b771d1128fc74572`;
  const finalUrl = url + queryString;
  const res = await fetch(finalUrl);
  const data = await res.json();
  smallimgurl = data.urls.small;
  resizeimage();
}

loadButton.addEventListener('click', () => {
  getLinkToImage();
});


bw.addEventListener('click', () => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  // eslint-disable-next-line prefer-destructuring
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg;
    data[i + 1] = avg;
    data[i + 2] = avg;

    ctx.putImageData(imageData, 0, 0);
  }
});

controlMenu.addEventListener('click', (event) => {
  const targetId = event.target.closest('li').id;
  if (targetId === 'button4x4') {
    scale = 4;
    resize();
    resizeimage();
  }
  if (targetId === 'button32x32') {
    scale = 32;
    resize();
    resizeimage();
  }
  if (targetId === 'button128x128') {
    scale = 128;
    resize();
    resizeimage();
  }
  if (targetId === 'button256x256') {
    scale = 256;
    resize();
    resizeimage();
  }
  if (targetId === 'button512x512') {
    scale = 512;
    resize();
    resizeimage();
  }
});

scale = 512 / scale;

function draw(event) {
  if (!isDrawing) return;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(event.offsetX, event.offsetY);
  ctx.fillStyle = myColor;
  ctx.fillRect(Math.floor(lastX / scale), Math.floor(lastY / scale), 1, 1);
  lastX = event.offsetX;
  lastY = event.offsetY;

  localStorage.setItem(canvas, canvas.toDataURL());
}
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mousedown', (event) => {
  isDrawing = true;
  lastX = event.offsetX;
  lastY = event.offsetY;
});
// eslint-disable-next-line no-return-assign
canvas.addEventListener('mouseup', () => isDrawing = false);
// canvas.addEventListener('mouseout', () => isDrawing = false);
