const canvas = document.getElementById("frame-canvas");
const ctx = canvas.getContext("2d");
const frameCount = 40;

const getFrame = (index) =>
    `Public/ezgif-frame-${String(index + 1).padStart(3, "0")}.jpg`;

const images = [];
let loadedCount = 0;
let currentFrameIndex = 0;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.clientHeight; // Mobile Fix
    drawFrame(currentFrameIndex);
}

function drawFrame(index) {
    const img = images[index];
    if (!img || !img.complete) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Ye logic image ko stretch nahi karega, zoom karke fit karega (Black bars khatam)
    const scale = Math.max(
        canvas.width / img.width,
        canvas.height / img.height
    );
    const x = (canvas.width - img.width * scale) / 2;
    const y = (canvas.height - img.height * scale) / 2;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
}

const html = document.documentElement;

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

    // Navbar Logic
    const navbar = document.getElementById('navbar');
    if (scrollTop > 50) {
        navbar.classList.remove('hidden-nav');
    } else {
        navbar.classList.add('hidden-nav');
    }

    // Beats Animation Logic (Aapka Original Logic)
    const beats = document.querySelectorAll('.beat');
    const p = scrollFraction * 100;

    beats.forEach((beat, index) => {
        let isActive = false;
        if (index === 0) isActive = p >= 0 && p < 15;
        else if (index === 1) isActive = p >= 15 && p < 40;
        else if (index === 2) isActive = p >= 40 && p < 65;
        else if (index === 3) isActive = p >= 65 && p < 85;
        else if (index === 4) isActive = p >= 85;

        if (isActive) {
            beat.classList.add('active');
        } else {
            beat.classList.remove('active');
        }
    });
}

function preloadImages() {
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = getFrame(i);
        img.onload = () => {
            loadedCount++;
            if (loadedCount === 1) drawFrame(0);
            if (loadedCount === frameCount) {
                updateScroll();
            }
        };
        images.push(img);
    }
}

// Click to scroll buttons
document.querySelectorAll('[data-scroll]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPercent = parseInt(btn.getAttribute('data-scroll'), 10);
        const maxScrollTop = html.scrollHeight - window.innerHeight;
        window.scrollTo({
            top: (targetPercent / 100) * maxScrollTop,
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
