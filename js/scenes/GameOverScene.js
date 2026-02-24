class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameOverScene" });
  }

  init(data) {
    // Receive score from GameScene
    this.finalScore = data.score || 0;
  }

  create() {
    // Show game over overlay
    const gameOverOverlay = document.getElementById("gameover-overlay");
    if (gameOverOverlay) {
      gameOverOverlay.classList.remove("hidden");
    }

    // Hide other overlays
    document.getElementById("menu-overlay")?.classList.add("hidden");
    document.getElementById("pause-overlay")?.classList.add("hidden");

    // Hide pause button
    const pauseBtn = document.getElementById("pauseBtn");
    if (pauseBtn) {
      pauseBtn.classList.add("hidden");
    }

    // Update score display
    this.updateScoreDisplay();

    // Set up button handlers
    this.setupGameOverButtons();
    document.getElementById("hud")?.classList.add("hidden");
  }

  updateScoreDisplay() {
    // Update final score
    const finalScoreElement = document.getElementById("final-score");
    if (finalScoreElement) {
      finalScoreElement.textContent = `Distance: ${this.finalScore}m`;
    }

    // Check and update high score
    const highScore = parseInt(
      localStorage.getItem("endlessRunnerHighScore") || 0
    );
    let newHighScore = false;

    if (this.finalScore > highScore) {
      localStorage.setItem("endlessRunnerHighScore", this.finalScore);
      newHighScore = true;
    }

    // Update high score display
    const highScoreElement = document.getElementById("high-score-display");
    if (highScoreElement) {
      const displayScore = newHighScore ? this.finalScore : highScore;
      highScoreElement.textContent = `Best Distance: ${displayScore}m${newHighScore ? " 🎉 NEW!" : ""
        }`;
      highScoreElement.className = newHighScore
        ? "high-score new"
        : "high-score";
    }
  }

  setupGameOverButtons() {
    // Restart button
    const restartBtn = document.getElementById("restart-btn");
    if (restartBtn) {
      const newRestartBtn = restartBtn.cloneNode(true);
      restartBtn.parentNode.replaceChild(newRestartBtn, restartBtn);

      newRestartBtn.addEventListener("click", () => {
        // Hide game over overlay
        const gameOverOverlay = document.getElementById("gameover-overlay");
        if (gameOverOverlay) {
          gameOverOverlay.classList.add("hidden");
        }
        // Start game scene
        this.scene.start("GameScene");
      });
    }

    // Menu button
    const menuBtn = document.getElementById("menu-btn");
    if (menuBtn) {
      const newMenuBtn = menuBtn.cloneNode(true);
      menuBtn.parentNode.replaceChild(newMenuBtn, menuBtn);

      newMenuBtn.addEventListener('click', () => {
        document.getElementById('gameover-overlay')?.classList.add('hidden');
        this.scene.start('MenuScene');
      });
    }
  }
}
