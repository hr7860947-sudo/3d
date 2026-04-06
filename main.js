const canvas = document.getElementById("frame-canvas");
const ctx = canvas.getContext("2d");
const frameCount = 40;
const images = [];
let loadedCount = 0;
let currentFrameIndex = 0;

const getFrame = (index) => `Public/ezgif-frame-${String(index + 1).padStart(3, "0")}.jpg`;

function resize() {
    // Sahi viewport height lena
    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.clientHeight; 
    drawFrame(currentFrameIndex);
}

function drawFrame(index) {
    const img = images[index];
    if (!img || !img.complete) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Image ko full screen cover karne ka logic
    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const x = (canvas.width - img.width * scale) / 2;
    const y = (canvas.height - img.height * scale) / 2;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
}

function updateScroll() {
    const html = document.documentElement;
    const scrollTop = html.scrollTop;
    const maxScrollTop = html.scrollHeight - window.innerHeight;
    const scrollFraction = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;

    const frameIndex = Math.min(frameCount - 1, Math.max(0, Math.floor(scrollFraction * frameCount)));

    if (frameIndex !== currentFrameIndex) {
        currentFrameIndex = frameIndex;
        drawFrame(currentFrameIndex);
    }

    // Navbar Toggle
    const navbar = document.getElementById('navbar');
    if (scrollTop > 50) navbar.classList.remove('hidden-nav');
    else navbar.classList.add('hidden-nav');

    // Beats Animation Logic
    const beats = document.querySelectorAll('.beat');
    const p = scrollFraction * 100;
    beats.forEach((beat, i) => {
        let active = false;
        if (i === 0) active = p < 15;
        else if (i === 1) active = p >= 15 && p < 40;
        else if (i === 2) active = p >= 40 && p < 65;
        else if (i === 3) active = p >= 65 && p < 85;
        else if (i === 4) active = p >= 85;

        if (active) beat.classList.add('active');
        else beat.classList.remove('active');
    });
}

function preloadImages() {
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = getFrame(i);
        img.onload = () => {
            loadedCount++;
            if (loadedCount === 1) drawFrame(0);
            if (loadedCount === frameCount) setTimeout(updateScroll, 50);
        };
        images.push(img);
    }
}

// Click to Scroll
document.querySelectorAll('[data-scroll]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPercent = parseInt(btn.getAttribute('data-scroll'));
        const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo({ top: (targetPercent / 100) * maxScrollTop, behavior: 'smooth' });
    });
});

window.addEventListener("resize", resize);
window.addEventListener("scroll", () => requestAnimationFrame(updateScroll));

resize();
preloadImages();
