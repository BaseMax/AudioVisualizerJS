// Elements
const elm_audio = document.querySelector('.audio');
const elm_canvas = document.querySelector('.canvas');
const elm_container = document.querySelector('.container');

// Variables
let analyser;
let audioSource;
let audioContext;

// Const Variables
const ctx = elm_canvas.getContext('2d');

// Functions
const drawVisualiser = (bufferLength, dataArray) => {
    console.log(bufferLength, dataArray);
    for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] * 2.5;
        ctx.save();
        ctx.translate(elm_canvas.width / 2, elm_canvas.height / 2);
        ctx.rotate(i * 4.0001);

        const hueColor = (Math.random() * 255) + i * 0.05;
        ctx.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
        ctx.beginPath();
        ctx.arc(10, barHeight / 2, barHeight / 2, 0, Math.PI / 4);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
};

const startVisualizer = () => {
    if (audioSource === undefined) {
        audioContext = new AudioContext();

        audioSource = audioContext.createMediaElementSource(elm_audio);
        analyser = audioContext.createAnalyser();

        audioSource.connect(analyser);
        analyser.connect(audioContext.destination);

        // https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/fftSize
        // Must be a power of 2 between 2^5 and 2^15, so one of: 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, and 32768. Defaults to 2048.
        analyser.fftSize = 1024;
    }

    elm_audio.play();
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const animate = () => {
        ctx.clearRect(0, 0, elm_canvas.width, elm_canvas.height);
        analyser.getByteFrequencyData(dataArray);
        drawVisualiser(bufferLength, dataArray);
        requestAnimationFrame(animate);
    };

    animate();
};

const init = () => {
    elm_canvas.width = window.innerWidth;
    elm_canvas.height = window.innerHeight;
};

// Evenets
document.addEventListener('keydown', (e) => {
    if (e.keyCode === 32) startVisualizer();
});

window.addEventListener('load', init);

window.addEventListener('resize', init);

elm_container.addEventListener('click', startVisualizer);
