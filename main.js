const canvas = document.getElementById("frame-canvas");
const ctx = canvas.getContext("2d");

const frameCount = 40;

const getFrame = (index) =>
    `Public/ezgif-frame-${String(index + 1).padStart(3, "0")}.jpg`;

// Preload all images
const images = [];
let loadedCount = 0;
let currentFrameIndex = 0; 

// Canvas resize
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawFrame(currentFrameIndex);
}

// Frame draw karna
function drawFrame(index) {
    const img = images[index];
    if (!img || !img.complete) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const scale = Math.min(
        canvas.width / img.width,
        canvas.height / img.height
    );
    const x = (canvas.width - img.width * scale) / 2;
    const y = (canvas.height - img.height * scale) / 2;

    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
}

// Scroll interaction logic
const html = document.documentElement;
const beats = document.querySelectorAll('.beat');
const navbar = document.getElementById('navbar');

function updateScroll() {
    const scrollTop = html.scrollTop;
    const maxScrollTop = html.scrollHeight - window.innerHeight;
    const scrollFraction = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0; 

    const frameIndex = Math.min(
        frameCount - 1,
        Math.max(0, Math.floor(scrollFraction * frameCount))
    );
    
    if (frameIndex !== currentFrameIndex) {
        currentFrameIndex = frameIndex;
        drawFrame(currentFrameIndex);
    }

    if (scrollTop > 50) {
        navbar.classList.remove('hidden-nav');
    } else {
        navbar.classList.add('hidden-nav');
    }

    const p = scrollFraction * 100;
    
    beats.forEach((beat, index) => {
        let isActive = false;
        let isPast = false;

        if (index === 0) {
            isActive = p >= 0 && p < 15;
            isPast = p >= 15;
        } else if (index === 1) {
            isActive = p >= 15 && p < 40;
            isPast = p >= 40;
        } else if (index === 2) {
            isActive = p >= 40 && p < 65;
            isPast = p >= 65;
        } else if (index === 3) {
            isActive = p >= 65 && p < 85;
            isPast = p >= 85;
        } else if (index === 4) {
            isActive = p >= 85;
            isPast = false;
        }

        if (isActive) {
            beat.classList.add('active');
            beat.classList.remove('past', 'future');
        } else if (isPast) {
            beat.classList.add('past');
            beat.classList.remove('active', 'future');
        } else {
            beat.classList.add('future');
            beat.classList.remove('active', 'past');
        }
    });
}

function preloadImages() {
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = getFrame(i);
        img.onload = () => {
            loadedCount++;
            if (loadedCount === frameCount) {
                drawFrame(0);
                setTimeout(updateScroll, 50);
            }
        };
        images.push(img);
    }
}

document.querySelectorAll('[data-scroll]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPercent = parseInt(btn.getAttribute('data-scroll'), 10);
        const maxScrollTop = html.scrollHeight - window.innerHeight;
        const targetScroll = (targetPercent / 100) * maxScrollTop;
        
        window.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
        });
    });
});

window.addEventListener("resize", resize);
window.addEventListener("scroll", () => {
    requestAnimationFrame(updateScroll);
});

resize();
preloadImages();
