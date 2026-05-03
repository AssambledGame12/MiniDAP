const canciones = [
    "freak", "cradles", "bimbodoll", "lucky", "lida", "crazyforyou", "fuckedup",
    "trilium", "yandere", "aftermath", "ihateyou", "psycodreams", "deadby30",
    "cryaboutit", "abandoned", "pretty", "enemy", "buttercup", "pumpedup",
    "overrated", "soyrusso", "goosebumps", "exitmusic", "nosurprises", "creep",
    "rimodozelda", "staywithme", "testtorecognize", "stressedout", "bombplanted",
    "darpahn", "djplaythissong", "betteroffalone", "haveyoueverveenmello",
    "fever", "lifegoeson", "missyou", "sicknsick", "inmymind", "cancion"
];

let indiceActual = 0;
let esAleatorio = false;
let estaReproduciendo = false;
let yaContada = false; // Para la regla del 60%

// Visualizador
let audioCtx, analyser, dataArray;
const canvas = document.getElementById('visualizador');
const ctx = canvas.getContext('2d');

const audio = document.getElementById('miAudio');
const tituloCancion = document.getElementById('tituloCancion');
const btnPlayPausa = document.getElementById('btnPlayPausa');
const iconoPlay = document.getElementById('iconoPlay');
const luzAleatorio = document.getElementById('luzAleatorio');
const barraProgreso = document.getElementById('barraProgreso');
const tiempoActualTxt = document.getElementById('tiempoActual');
const tiempoTotalTxt = document.getElementById('tiempoTotal');
const listaCancionesUI = document.getElementById('listaCanciones');

// Estadísticas
let stats = JSON.parse(localStorage.getItem('minidapStats')) || {
    cancionesEscuchadas: 0,
    tiempoTotalSegundos: 0,
    tiempoHoySegundos: 0,
    fechaUltima: new Date().toLocaleDateString()
};

function cargarCancion(indice) {
    indiceActual = indice;
    yaContada = false; // Resetear contador de 60%
    const nombre = canciones[indiceActual];
    audio.src = `musica/${nombre}.mp3`;
    tituloCancion.innerText = nombre.charAt(0).toUpperCase() + nombre.slice(1);
    actualizarPlaylistUI();
}

function inicializarVisualizador() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 128; // Más barras (64 barras visibles)
    analyser.smoothingTimeConstant = 0.8; // Suavidad
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    dibujar();
}

function dibujar() {
    requestAnimationFrame(dibujar);
    analyser.getByteFrequencyData(dataArray);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / dataArray.length) * 2.5;
    let x = 0;

    for (let i = 0; i < dataArray.length; i++) {
        // Reducimos sensibilidad: si el valor es bajo, lo ignoramos un poco
        let valor = dataArray[i];
        let h = (valor / 255) * canvas.height * 0.8; 
        
        if (h < 5) h = 2; // Evita que vibre demasiado en silencio

        // Degradado dinámico
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#4CAF50'); // Verde
        gradient.addColorStop(1, '#81C784'); // Verde claro

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - h, barWidth - 1, h);
        x += barWidth;
    }
}

audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const progreso = (audio.currentTime / audio.duration) * 100;
        barraProgreso.value = progreso;
        tiempoActualTxt.innerText = formatearTiempo(audio.currentTime);

        // REGLA DEL 60%
        if (!yaContada && (audio.currentTime / audio.duration) >= 0.6) {
            yaContada = true;
            stats.cancionesEscuchadas++;
            guardarStats();
        }
        
        stats.tiempoTotalSegundos++;
        stats.tiempoHoySegundos++;
    }
});

// El resto de funciones (siguiente, anterior, play, stats) siguen igual
// pero asegúrate de usar guardarStats() para actualizar la UI.

function alternarPlayPausa() {
    inicializarVisualizador();
    if (estaReproduciendo) {
        audio.pause();
        iconoPlay.innerText = "play_arrow";
    } else {
        audio.play();
        iconoPlay.innerText = "pause";
    }
    estaReproduciendo = !estaReproduciendo;
}

function guardarStats() {
    localStorage.setItem('minidapStats', JSON.stringify(stats));
    document.getElementById('statCanciones').innerText = stats.cancionesEscuchadas;
    document.getElementById('statTotal').innerText = formatearHorasMinutos(stats.tiempoTotalSegundos);
    document.getElementById('statHoy').innerText = formatearHorasMinutos(stats.tiempoHoySegundos);
}

function formatearTiempo(s) {
    const m = Math.floor(s / 60);
    const seg = Math.floor(s % 60);
    return `${m}:${seg < 10 ? '0' : ''}${seg}`;
}

function formatearHorasMinutos(s) {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return `${h}h ${m}m`;
}

function actualizarPlaylistUI() {
    const items = listaCancionesUI.getElementsByTagName('li');
    for (let i = 0; i < items.length; i++) {
        items[i].className = (i === indiceActual) ? 'sonando' : '';
    }
}

// Eventos de botones
btnPlayPausa.addEventListener('click', alternarPlayPausa);
btnSiguiente.addEventListener('click', () => { cargarCancion((indiceActual + 1) % canciones.length); audio.play(); estaReproduciendo = true; iconoPlay.innerText = "pause"; });
btnAnterior.addEventListener('click', () => { cargarCancion((indiceActual - 1 + canciones.length) % canciones.length); audio.play(); estaReproduciendo = true; iconoPlay.innerText = "pause"; });
btnAleatorio.addEventListener('click', () => { 
    esAleatorio = !esAleatorio; 
    luzAleatorio.className = esAleatorio ? 'foquito verde' : 'foquito rojo';
});

// Inicializar lista
canciones.forEach((c, i) => {
    const li = document.createElement('li');
    li.innerText = `${i+1}. ${c}`;
    li.onclick = () => { cargarCancion(i); alternarPlayPausa(); };
    listaCancionesUI.appendChild(li);
});

audio.addEventListener('loadedmetadata', () => { tiempoTotalTxt.innerText = formatearTiempo(audio.duration); });
audio.addEventListener('ended', () => { cargarCancion((indiceActual + 1) % canciones.length); audio.play(); });
cargarCancion(0);
guardarStats();