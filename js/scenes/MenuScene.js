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
        const menuOverlay = document.getElementById("menu-overlay");
        if (menuOverlay) {
          menuOverlay.classList.add("hidden");
        }

        // Start game first so fullscreen/orientation never block desktop play
        this.scene.start("GameScene");

        try {
          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
          const isIPhone = /iPhone/i.test(navigator.userAgent);

          if (isMobile && !isIPhone && this.scale && typeof this.scale.startFullscreen === "function" && !this.scale.isFullscreen) {
            const fullscreenResult = this.scale.startFullscreen();
            if (fullscreenResult && typeof fullscreenResult.catch === "function") {
              fullscreenResult.catch(e => console.warn("Fullscreen failed:", e));
            }
          }

          if (isMobile && screen.orientation && typeof screen.orientation.lock === "function") {
            const lockResult = screen.orientation.lock("landscape");
            if (lockResult && typeof lockResult.catch === "function") {
              lockResult.catch(e => console.warn("Orientation lock failed:", e));
            }
          }
        } catch (e) {
          console.warn("Mobile setup failed:", e);
        }
      });
    }
  }
}
