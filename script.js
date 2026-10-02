let highestZ = 1;

class Paper {
  holdingPaper = false;

  // Mouse
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  mouseTouchX = 0;
  mouseTouchY = 0;

  // Touch
  touchStartX = 0;
  touchStartY = 0;
  touchMoveX = 0;
  touchMoveY = 0;
  prevTouchX = 0;
  prevTouchY = 0;

  velX = 0;
  velY = 0;

  rotation = Math.random() * 30 - 15;

  currentPaperX = 0;
  currentPaperY = 0;

  rotating = false;

  init(paper) {

    // =========================
    // MOUSE MOVE
    // =========================
    document.addEventListener("mousemove", (e) => {

      if (!this.rotating) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;

        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      const dirX = e.clientX - this.mouseTouchX;
      const dirY = e.clientY - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);

      if (dirLength !== 0) {
        const dirNormalizedX = dirX / dirLength;
        const dirNormalizedY = dirY / dirLength;

        const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
        let degrees = (180 * angle) / Math.PI;
        degrees = (360 + Math.round(degrees)) % 360;

        if (this.rotating) {
          this.rotation = degrees;
        }
      }

      if (this.holdingPaper) {

        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }

        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        paper.style.transform =
          `translateX(${this.currentPaperX}px) ` +
          `translateY(${this.currentPaperY}px) ` +
          `rotateZ(${this.rotation}deg)`;
      }
    });


    // =========================
    // MOUSE DOWN
    // =========================
    paper.addEventListener("mousedown", (e) => {

      if (this.holdingPaper) return;

      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ++;

      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      this.mouseTouchX = this.mouseX;
      this.mouseTouchY = this.mouseY;

      this.prevMouseX = this.mouseX;
      this.prevMouseY = this.mouseY;

      if (e.button === 2) {
        this.rotating = true;
      }
    });


    // =========================
    // MOUSE UP
    // =========================
    window.addEventListener("mouseup", () => {
      this.holdingPaper = false;
      this.rotating = false;
    });


    // =========================
    // TOUCH START
    // =========================
    paper.addEventListener("touchstart", (e) => {

      e.preventDefault();

      if (this.holdingPaper) return;

      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ++;

      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;

      this.touchMoveX = this.touchStartX;
      this.touchMoveY = this.touchStartY;

      this.prevTouchX = this.touchStartX;
      this.prevTouchY = this.touchStartY;
    }, { passive: false });


    // =========================
    // TOUCH MOVE
    // =========================
    paper.addEventListener("touchmove", (e) => {

      e.preventDefault();

      if (!this.holdingPaper) return;

      const touch = e.touches[0];

      this.touchMoveX = touch.clientX;
      this.touchMoveY = touch.clientY;

      this.velX = this.touchMoveX - this.prevTouchX;
      this.velY = this.touchMoveY - this.prevTouchY;

      if (!this.rotating) {
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
      }

      this.prevTouchX = this.touchMoveX;
      this.prevTouchY = this.touchMoveY;

      paper.style.transform =
        `translateX(${this.currentPaperX}px) ` +
        `translateY(${this.currentPaperY}px) ` +
        `rotateZ(${this.rotation}deg)`;
    }, { passive: false });


    // =========================
    // TOUCH END
    // =========================
    paper.addEventListener("touchend", () => {
      this.holdingPaper = false;
      this.rotating = false;
    });


    // =========================
    // TOUCH CANCEL
    // =========================
    paper.addEventListener("touchcancel", () => {
      this.holdingPaper = false;
      this.rotating = false;
    });
  }
}


// =========================
// INITIALIZE ALL PAPERS
// =========================

const papers = Array.from(document.querySelectorAll(".paper"));

papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});


// Prevent right-click menu because
// right click is used for rotation
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});