class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "player_idle");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.scene = scene;

    // VISUAL SCALE (CHANGE THIS VALUE)
    this.playerScale = 0.75;
    this.setScale(this.playerScale);

    // Bottom-center origin
    this.setOrigin(0.5, 1);

    this.groundY =
      scene.groundY !== undefined
        ? scene.groundY
        : GameConfig.Ground.Y_Position;

    // State
    this.isJumping = false;
    this.isOnGround = true;
    this.canJump = true;
    this.hasDoubleJumped = false;

    this.setupPhysics();
    this.setupAnimations();

    if (this.scene.anims.exists("player_run")) {
      this.play("player_run");
    }

    this.x = x;
    this.snapFeetToGround();
  }

  setupPhysics() {
    if (!this.body) return;

    const scale = this.playerScale;

    // IMPORTANT: body size must consider scale
    this.body.setSize(
      this.width * 0.7 * scale,
      this.height * 0.9 * scale,
      false
    );

    this.body.setOffset(
      this.width * 0.15 * scale,
      this.height * 1.25 * scale
    );

    this.setBounce(0);
    this.body.setDragX(0);
    this.body.setCollideWorldBounds(false);
  }

  setupAnimations() {
    if (this.scene.anims.exists("player_run")) {
      this.play("player_run");
    }
  }

  snapFeetToGround() {
    if (!this.body) return;

    const delta = this.groundY - this.body.bottom;
    this.y += delta;
    this.body.updateFromGameObject();
  }

  jump() {
    const jumpForce = GameConfig.Player.Jump_Force;

    if (this.isOnGround) {
      this.body.setVelocityY(jumpForce);
      this.isOnGround = false;
      this.isJumping = true;
      this.hasDoubleJumped = false;

      this.scene.sound?.play("jump", { volume: 0.7 });
      return;
    }

    if (!this.hasDoubleJumped && this.scene.extraJumps > 0) {
      this.body.setVelocityY(jumpForce);
      this.hasDoubleJumped = true;
      this.isJumping = true;

      this.scene.consumeDoubleJump?.();
      this.scene.sound?.play("double_jump", { volume: 0.8 });
    }
  }

  update() {
    this.checkGroundCollision();
    this.updateAnimation();
  }

  checkGroundCollision() {
    if (!this.body) return;

    if (this.scene.groundY !== undefined) {
      this.groundY = this.scene.groundY;
    }

    const tolerance = 2;
    const feet = this.body.bottom;
    const isAtGround = feet >= this.groundY - tolerance;
    const isMovingDown = this.body.velocity.y >= 0;

    if (isAtGround && isMovingDown) {
      if (!this.isOnGround) {
        this.isOnGround = true;
        this.isJumping = false;
        this.canJump = true;
        this.hasDoubleJumped = false;

        this.play("player_run");
      }

      this.body.velocity.y = 0;
      this.snapFeetToGround();
    } else {
      this.isOnGround = false;
      this.isJumping = true;
    }
  }

  updateAnimation() {
    if (!this.isOnGround && this.scene.textures.exists("player_jump")) {
      if (this.texture.key !== "player_jump") {
        this.setTexture("player_jump");
      }
      return;
    }

    if (this.isOnGround && this.anims.currentAnim?.key !== "player_run") {
      this.play("player_run");
    }
  }

  reset() {
    this.x = GameConfig.Player.Start_X;
    this.body.setVelocity(0, 0);

    this.isJumping = false;
    this.isOnGround = true;
    this.canJump = true;
    this.hasDoubleJumped = false;

    this.snapFeetToGround();
    this.play("player_run");
  }
}
