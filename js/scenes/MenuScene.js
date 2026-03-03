class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MenuScene" });
  }

  create() {
    // Show menu overlay
    const menuOverlay = document.getElementById("menu-overlay");
    if (menuOverlay) {
      menuOverlay.classList.remove("hidden");
    }

    // Hide other overlays
    document.getElementById("gameover-overlay")?.classList.add("hidden");
    document.getElementById("pause-overlay")?.classList.add("hidden");

    // Hide pause button
    const pauseBtn = document.getElementById("pauseBtn");
    if (pauseBtn) {
      pauseBtn.classList.add("hidden");
    }

    // Update high score display
    this.updateHighScore();

    // Set up button handlers
    this.setupMenuButtons();
    document.getElementById("hud")?.classList.add("hidden");
    this.sound.stopAll();
  }

  updateHighScore() {
    const highScoreElement = document.getElementById("high-score-menu");
    const highScore = localStorage.getItem("endlessRunnerHighScore") || 0;

    if (highScore > 0 && highScoreElement) {
      highScoreElement.textContent = `Best Distance: ${highScore}m`;
      highScoreElement.style.display = "block";
    } else if (highScoreElement) {
      highScoreElement.style.display = "none";
    }
  }

  setupMenuButtons() {
    const startBtn = document.getElementById("start-btn");
    if (startBtn) {
      // Remove existing listeners by cloning
      const newStartBtn = startBtn.cloneNode(true);
      startBtn.parentNode.replaceChild(newStartBtn, startBtn);

      newStartBtn.addEventListener("click", () => {
        // 1️⃣ Hide menu overlay immediately for instant feedback
        const menuOverlay = document.getElementById("menu-overlay");
        if (menuOverlay) {
          menuOverlay.classList.add("hidden");
        }

        // 2️⃣ Fullscreen (Skip on iPhone as it's not supported) - Fire and forget
        const isIPhone = /iPhone/i.test(navigator.userAgent);
        if (!isIPhone && this.scale && !this.scale.isFullscreen) {
          this.scale.startFullscreen().catch(e => console.warn("Fullscreen failed:", e));
        }

        // 3️⃣ Lock landscape (mobile) - Fire and forget
        if (screen.orientation && screen.orientation.lock) {
          screen.orientation.lock("landscape").catch(e => console.warn("Orientation lock failed:", e));
        }

        // 4️⃣ Start scene IMMEDIATELY
        this.scene.start("GameScene");
      });
    }
  }
}
