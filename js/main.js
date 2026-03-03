const MAX_DPR = 2; // mobile-safe
const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

const DESIGN_WIDTH = 915;
const DESIGN_HEIGHT = 412;

const config = {
  type: Phaser.WEBGL,
  parent: 'game-container',

  width: DESIGN_WIDTH,
  height: DESIGN_HEIGHT,

  resolution: dpr,
  backgroundColor: GameConfig.Colors.BACKGROUND,

  render: {
    antialias: true,
    pixelArt: false,
    roundPixels: true
  },

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DESIGN_WIDTH,
    height: DESIGN_HEIGHT
  },


  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: GameConfig.Player.Gravity },
      debug: false
    }
  },

  scene: [
    PreloadScene,
    MenuScene,
    GameScene,
    GameOverScene
  ]
};

const game = new Phaser.Game(config);
window.game = game;

function checkOrientation() {
  const orientationOverlay = document.getElementById("orientation-overlay");
  if (!orientationOverlay) return;

  if (isMobileDevice() && window.innerHeight > window.innerWidth) {
    orientationOverlay.classList.remove("hidden");
  } else {
    orientationOverlay.classList.add("hidden");
  }
}

window.addEventListener('resize', () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
  checkOrientation();
});

window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    game.scale.resize(window.innerWidth, window.innerHeight);
    checkOrientation();
  }, 300);
});

// Run initial check
checkOrientation();


function isMobileDevice() {
  const ua = navigator.userAgent;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
}

if (isMobileDevice()) {
  console.log("User is on mobile");
} else {
  console.log("User is on desktop");
}


// Helper function to handle fullscreen changes and ensure UI visibility
function handleFullscreenChange() {
  const hud = document.getElementById("hud");
  const overlays = [
    document.getElementById("menu-overlay"),
    document.getElementById("gameover-overlay"),
    document.getElementById("pause-overlay"),
    document.getElementById("pauseBtn")
  ];

  const fsElement = document.fullscreenElement || document.webkitFullscreenElement;
  const container = fsElement || document.getElementById("game-container");

  if (!container) return;

  if (hud && hud.parentNode !== container) {
    container.appendChild(hud);
  }

  overlays.forEach(overlay => {
    if (overlay && overlay.parentNode !== container) {
      container.appendChild(overlay);
    }
  });
}

document.addEventListener("fullscreenchange", handleFullscreenChange);
document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

// Initial check to ensure UI is in the correct place
handleFullscreenChange();
