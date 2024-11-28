document.addEventListener("DOMContentLoaded", () => {
  const messageContainer = document.getElementById("message-container");
  const message = document.getElementById("message");
  const envelopeContainer = document.getElementById("envelope-container");
  const heartsCanvas = document.getElementById("heartsCanvas");
  const ctx = heartsCanvas.getContext("2d");
  const letterPaper = document.querySelector(".letter-paper");

  let hearts = [];
  let animationFrame;


  class Heart {
    constructor(x, y, scale, velocity, amplitude, period, rotation, alpha) {
      this.x = x;
      this.y = y;
      this.scale = scale;
      this.velocity = velocity;
      this.amplitude = amplitude;
      this.period = period;
      this.rotation = rotation;
      this.alpha = alpha;
      this.baseX = x;

      const hue = 4; // red hue
      const lightness = 50 + Math.random() * 30; // random lightness
      this.color = `hsl(${hue}, 100%, ${lightness}%)`;
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.scale(this.scale, this.scale);
      ctx.globalAlpha = this.alpha;

      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.bezierCurveTo(-12, -24, -24, 0, 0, 12);
      ctx.bezierCurveTo(24, 0, 12, -24, 0, -12);
      ctx.closePath();

      ctx.fillStyle = this.color;
      ctx.fill();

      ctx.restore();
    }

    update(canvasHeight) {
      this.y += this.velocity;
      const t = (this.y % this.period) / this.period * Math.PI * 2;
      this.x = this.baseX + Math.sin(t) * this.amplitude;
      this.rotation += Math.sin(t) * 2;

      if (this.y < -50) {
        this.y = canvasHeight + 50;
        this.x = Math.random() * window.innerWidth;
        this.scale = Math.random() * 2 + 0.25;
        this.velocity = -Math.random() * 1.4 - 1;
        this.amplitude = Math.random() * 40 + 20;
        this.period = Math.random() * 500 + 300;
        this.rotation = Math.random() * 40 - 20;
        this.alpha = Math.random() * 0.75 + 0.05;
      }
    }
  }


  function createHearts(count) {
    for (let i = 0; i < count; i++) {
      const heart = new Heart(
        Math.random() * heartsCanvas.width,
        Math.random() * heartsCanvas.height,
        Math.random() * 2 + 1,
        -Math.random() * 1.4 - 1,
        Math.random() * 40 + 20,
        Math.random() * 500 + 300,
        Math.random() * 40 - 20,
        Math.random() * 0.75 + 0.05
      );
      hearts.push(heart);
    }
  }


  function addHeartsWithTransition(count) {
    const newHearts = [];
    for (let i = 0; i < count; i++) {
      const heart = new Heart(
        Math.random() * heartsCanvas.width,
        Math.random() * heartsCanvas.height,
        Math.random() * 2 + 1,
        -Math.random() * 1.4 - 1,
        Math.random() * 40 + 20,
        Math.random() * 500 + 300,
        Math.random() * 40 - 20,
        0 
      );
      newHearts.push(heart);
    }

    const fadeDuration = 1500; 
    let elapsed = 0;

    function fadeIn() {
      elapsed += 16; // time per frame
      const alpha = Math.min(elapsed / fadeDuration, 1); 
      newHearts.forEach((heart) => (heart.alpha = alpha));
      if (alpha < 1) requestAnimationFrame(fadeIn);
    }

    hearts.push(...newHearts);
    fadeIn();
  }


  function animateHearts() {
    ctx.clearRect(0, 0, heartsCanvas.width, heartsCanvas.height);
    hearts.forEach((heart) => {
      heart.update(heartsCanvas.height);
      heart.draw(ctx);
    });
    animationFrame = requestAnimationFrame(animateHearts);
  }


  function resizeCanvas() {
    heartsCanvas.width = window.innerWidth;
    heartsCanvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resizeCanvas);


  setTimeout(() => {
    message.textContent = "I made you this letter!";
  }, 2000);

  setTimeout(() => {
    messageContainer.classList.add("hidden");
    envelopeContainer.classList.remove("hidden");
    envelopeContainer.classList.add("show");
  }, 4000);


  const envelope = document.getElementById("envelope");
  envelope.addEventListener("click", () => {
    if (envelope.classList.contains("open")) {
      envelope.classList.add("close");
      envelope.classList.remove("open");
  
  
      hearts = [];
      createHearts(12);// heart value at start

    } else {
      envelope.classList.add("open");
      envelope.classList.remove("close");
      setTimeout(showLetterPaper, 600);
  
 
      addHeartsWithTransition(143 - hearts.length);// on envelope open
    }
  });
  document.addEventListener("click", (e) => {
    if (!letterPaper.contains(e.target) && !envelope.contains(e.target)) {
      if (letterPaper.style.visibility === "visible") {
        hideLetterPaper();
      }
    }
  });
  function showLetterPaper() {

    heartsCanvas.classList.add("blur-background");
    envelope.classList.add("blur-background");
  
   
    letterPaper.style.visibility = "visible";
    letterPaper.style.opacity = "1";
    letterPaper.style.transform = "translate(-50%, -50%) scale(1)";
  }
  function hideLetterPaper() {

    heartsCanvas.classList.remove("blur-background");
    envelope.classList.remove("blur-background");
  
 
    letterPaper.style.visibility = "hidden";
    letterPaper.style.opacity = "0";
    letterPaper.style.transform = "translate(-50%, -50%) scale(0.8)";
  }
  


  resizeCanvas();
  createHearts(12); 
  animateHearts();
});
