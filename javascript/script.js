
var config = {
    type: Phaser.AUTO,
    width: 1520,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var shieldFeedback;
var dgts;
var uiP;
var uiS;
var back;
var barre;
var enemies;
var ennemismove = false;
var ennemiscount = 0;
var vulnerability = true;
var ennemisvol;
var potions;
var potionCount = 0;
var arrow;
var cadence = 0;
var platforms;
var cursors;
var turn = false;
var fall = false;
var score = 0;
var scoreFinal = 0;
var gameOver = false;
var scoreText;
let keys = {};
var scene;
var timerVal = 0;
var timerText;
var zeTimer;
var pause = false;
var spawnX = 0;
var spawnY = 0;


//------------------------------------------------------------------------------
//Variables liées auxpoints de santé / potions / points / etc.
var vie = 10;
var points = 0;
var temps = 0;

//------------------------------------------------------------------------------

var game = new Phaser.Game(config);

//------------------------------------------------------------------------------
function preload()
{
  //Chargement des sprites
  this.load.image('background', 'asset/forest_background_x4.png');
  this.load.image('ground', 'asset/Huntress/platform.png');
  this.load.image('forestGround', 'asset/ForestGround3.png');
  this.load.image('corniche', 'asset/cornicheMod.png');
  this.load.image('arrow', 'asset/Huntress/arrow.png');
  this.load.image('arrowL', 'asset/Huntress/arrowL.png');
  this.load.image('shield', 'asset/wooden_shield.png');

  //Chargement des sons
  this.load.audio('hurt', ['asset/audio/damaged1.wav']);
  this.load.audio('combat', ['asset/audio/DavidKBD_GodOfDarkness.ogg']);

  //chargement des spritesheet d'animation
  this.load.spritesheet('fall', 'asset/Huntress/FallSheet.png', { frameWidth: 32, frameHeight: 47 });
  this.load.spritesheet('fallL', 'asset/Huntress/FallSheetLeft.png', { frameWidth: 32, frameHeight: 47 });
  this.load.spritesheet('get-hit', 'asset/Huntress/GetHitSheet.png', { frameWidth: 28.3, frameHeight: 47 });
  this.load.spritesheet('get-hitL', 'asset/Huntress/GetHitSheetLeft.png', { frameWidth: 28.3, frameHeight: 47 });
  this.load.spritesheet('idle', 'asset/Huntress/IdleSheet.png', { frameWidth: 32, frameHeight: 35 });
  this.load.spritesheet('idleL', 'asset/Huntress/IdleSheetLeft.png', { frameWidth: 32, frameHeight: 35 });
  this.load.spritesheet('jump', 'asset/Huntress/Jumpsheet.png', { frameWidth: 28, frameHeight: 37 });
  this.load.spritesheet('jumpL', 'asset/Huntress/JumpsheetLeft.png', { frameWidth: 28, frameHeight: 37 });
  this.load.spritesheet('run', 'asset/Huntress/RunSheet.png', { frameWidth: 30.125, frameHeight: 41 });
  this.load.spritesheet('runL', 'asset/Huntress/RunSheetLeft.png', { frameWidth: 30.125, frameHeight: 41 });
  this.load.spritesheet('portrait', 'asset/Huntress/portrait001.png', { frameWidth: 96, frameHeight: 96 });
  this.load.spritesheet('skullicon', 'asset/skull_icon.png', { frameWidth: 51, frameHeight: 55 });

  //chargement des sprites squelette
  this.load.spritesheet('skelyidle', 'asset/Skeleton/skeletonIdle.png', { frameWidth: 24, frameHeight: 32 });
  this.load.spritesheet('skelyattack', 'asset/Skeleton/skeletonAttack.png', { frameWidth: 43, frameHeight: 37 });
  this.load.spritesheet('skelyhit', 'asset/Skeleton/skeletonHit.png', { frameWidth: 24, frameHeight: 32 });
  this.load.spritesheet('skelywalk', 'asset/Skeleton/skeletonWalk.png', { frameWidth: 22, frameHeight: 33 });
  this.load.spritesheet('skelywalkL', 'asset/Skeleton/skeletonWalkL.png', { frameWidth: 22, frameHeight: 33 });

  //chargement des sprites monstres volants
  this.load.spritesheet('flySheet', 'asset/FlyingMonster/flySheet.png', { frameWidth: 40.42, frameHeight: 32 });
  this.load.spritesheet('flySheetL', 'asset/FlyingMonster/flySheetL.png', { frameWidth: 40.42, frameHeight: 32 });

  //chargement sprite de potion
  this.load.spritesheet('healthPotion', 'asset/Potion/healthPotion.png', { frameWidth: 38, frameHeight: 38 });
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function create()
{
  scene = this;

  //Implantation de la musique
  var combatMusic = this.sound.add('combat', {volume: 0.25});
  combatMusic.loop = true;
  combatMusic.play();

  //Implantation des commandes utilisées
  keys.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  keys.q = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
  keys.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  keys.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

  //Création des groupes de plateformes  et de flèches
  platforms = this.physics.add.staticGroup();

  arrow = this.physics.add.staticGroup();

  //----------------------------------------------------------------------------
  //Ajout du background
  back = this.physics.add.staticGroup();
  back.create(0, 100, 'background');
  back.create(1920, 100, 'background');

  //this.physics.add.collider(platforms, arrow, test);
  //----------------------------------------------------------------------------
  // Mise en place du sol
  platforms.create(0, 570, 'forestGround');
  platforms.create(640, 570, 'forestGround');
  platforms.create(1280, 570, 'forestGround');
  platforms.create(0, 506, 'forestGround');
  platforms.create(480, 522, 'forestGround').setScale(0.5).refreshBody();
  platforms.create(1520, 506, 'forestGround');
  platforms.create(1041, 522, 'forestGround').setScale(0.5).refreshBody();

  //----------------------------------------------------------------------------
  // Mise en place plateforme
  platforms.create(160, 264, 'forestGround').setScale(0.5).refreshBody();
  platforms.create(1360, 264, 'forestGround').setScale(0.5).refreshBody();

  platforms.create(506, 300, 'corniche').setScale(0.5).refreshBody();
  platforms.create(1012, 300, 'corniche').setScale(0.5).refreshBody();
  platforms.create(760, 406, 'corniche').setScale(0.5).refreshBody();

//------------------------------------------------------------------------------
// Mise en place personnage
  player = this.physics.add.sprite(100, 230, 'idle');
  player.setBounce(0.1);
  player.setCollideWorldBounds(true);
  this.physics.add.collider(player, platforms);

  //Mise en place du portrait de personnage et de l'icone de frags
  uiP = this.add.sprite(50, 50, 'portrait');
  uiS = this.add.sprite(170, 50, 'skullicon');

  dgts = this.sound.add('hurt'); //Son de prise de dégât


//------------------------------------------------------------------------------
//Mise en place squelette test
  //Test phase 2
  enemies = this.physics.add.group();

  function generateEnemy () { //Apparition des squelettes
    if(pause == false)
    {
      const randomSpawnX = Phaser.Math.Between(0, 1); //Sélection random des X et Y pour apparition des squelettes
      switch(randomSpawnX)
      {
        case 0: spawnX = 10;
        break;
        case 1: spawnX = 1510;
        break;
      }
      const randomSpawnY = Phaser.Math.Between(0, 1);
      switch(randomSpawnY)
      {
        case 0: spawnY = 230;
        break;
        case 1: spawnY = 460;
        break;
      }

      let new_enemie = enemies.create(spawnX, spawnY, 'skelyidle');
      new_enemie.anims.play('skelyidle', true);
      new_enemie.setCollideWorldBounds(true);
      scene.physics.add.collider(enemies, platforms);
      ennemiscount = ennemiscount +1;
    }
  }

  //generateEnemy();

    var timer = scene.time.addEvent({ //Intervalle d'apparitions des squelettesz
    delay: 1200,
    callback: generateEnemy,
    callbackScope: scene,
    loop: true
  });

  ennemisvol = this.physics.add.group();

  function generateFlying() //Creation des monstres volants
  {
    if (pause == false)
    {
      const xCoordinate = Math.random() * 1520;   //Apparition aléatoire sur l'axe X
      let new_flying = ennemisvol.create(xCoordinate, 10, '');
      //let new_flying = ennemisvol.create(10, 220, 'skelyidle');
      new_flying.anims.play('skelyidle', true);
      new_flying.setCollideWorldBounds(true);
      ennemiscount = ennemiscount +1;
    }

  }

  var timer = scene.time.addEvent({ //Intervalle entre les apparition des monstres volants
  delay: 1500,
  callback: generateFlying,
  callbackScope: scene,
  loop: true
});

  potions = this.physics.add.group(); //Creation du groupe des potions

//------------------------------------------------------------------------------
//Animations du personnage
  this.anims.create({
  key: 'idle',
  frames: this.anims.generateFrameNumbers('idle', { start: 0, end: 9 }),
  frameRate: 10,
  repeat: -1
  });

  this.anims.create({
  key: 'idleL',
  frames: this.anims.generateFrameNumbers('idleL', { start: 9, end: 0 }),
  frameRate: 10,
  repeat: -1
  });

  this.anims.create({
  key: 'run',
  frames: this.anims.generateFrameNumbers('run', { start: 0, end: 7 }),
  frameRate: 10,
  repeat: -1
  });

  this.anims.create({
  key: 'runL',
  frames: this.anims.generateFrameNumbers('runL', { start: 7, end: 0 }),
  frameRate: 10,
  repeat: -1
  });

  this.anims.create({
  key: 'fall',
  frames: this.anims.generateFrameNumbers('fall', { start: 0, end: 1 }),
  frameRate: 10,
  });

  this.anims.create({
  key: 'fallL',
  frames: this.anims.generateFrameNumbers('fallL', { start: 1, end: 0 }),
  frameRate: 10,
  repeat: -1
  });

  this.anims.create({
  key: 'get-hit',
  frames: this.anims.generateFrameNumbers('get-hit', { start: 0, end: 2 }),
  frameRate: 10,
  repeat: -1
  });

  this.anims.create({
  key: 'get-hitL',
  frames: this.anims.generateFrameNumbers('get-hitL', { start: 2, end: 0 }),
  frameRate: 10,
  repeat: -1
  });

  //Animation squelette
  this.anims.create({
  key: 'skelyidle',
  frames: this.anims.generateFrameNumbers('skelyidle', { start: 0, end: 10 }),
  frameRate: 10,
  repeat: -1
  });

  this.anims.create({
  key: 'skelywalk',
  frames: this.anims.generateFrameNumbers('skelywalk', { start: 0, end: 10 }),
  frameRate: 10,
  repeat: -1
  });

  this.anims.create({
  key: 'skelywalkL',
  frames: this.anims.generateFrameNumbers('skelywalkL', { start: 0, end: 10 }),
  frameRate: 10,
  repeat: -1
  });

  this.anims.create({
  key: 'flySheet',
  frames: this.anims.generateFrameNumbers('flySheet', { start: 0, end: 10 }),
  frameRate: 10,
  repeat: -1
  });

  this.anims.create({
  key: 'flySheetL',
  frames: this.anims.generateFrameNumbers('flySheetL', { start: 0, end: 10 }),
  frameRate: 10,
  repeat: -1
  });

  cursors = this.input.keyboard.createCursorKeys();

//------------------------------------------------------------------------------
//Implantation de barre de vie
    this.barre = this.add.graphics();

//------------------------------------------------------------------------------
//Timer Implantation
      zeTimer = this.time.addEvent({  //Incrément du timer
      delay: 1000,
      callback: plusUn,
      callbackScope: this,
      loop: true
    });

    //Affichage du timer
    timerText = this.add.text(760, 30, "0", {
    fontSize: "24px",
    fill: "#FFFFFF"
    });

    //Affichage des frags
    scoreText = this.add.text(200, 40, "0", {
    fontSize: "24px",
    fill: "#CC0000"
    });
}

//------------------------------------------------------------------------------
//incrément de temps en compte en seconde
function plusUn () {
  timerVal = timerVal +1;
  timerText.setText(timerVal);
}

//------------------------------------------------------------------------------
//Gestion de collision des flèches

function test(arrow, platforms)
{
  //console.log("test");

  arrow.destroy(true);
}

//------------------------------------------------------------------------------
//Collision ennemis et dégats et génération de potion
function generatePotions () {
  const xCoordinate = Math.random() * 1520;
  let new_potions = potions.create(xCoordinate, 10, 'healthPotion');
  //new_potions.anims.play('healthPotion', true);
  new_potions.setCollideWorldBounds(true);
  scene.physics.add.collider(potions, platforms);
}

//Application de dégâts aux adverssaires
function skelydamage(arrow, enemies)
{
  console.log("+1");
  arrow.destroy(true);
  ennemiscount = ennemiscount -1;
  potionCount = potionCount +1;
  score = score +1;
  scoreText.setText(score);
  potionTrigger(potionCount);
  enemies.destroy(true);
}

//------------------------------------------------------------------------------
//Apparition d'une potion tout les 10 points engrangés
function potionTrigger()
{
  if(potionCount >= 10)
  {
    generatePotions();
    potionCount = 0;
  }
}

//Application des dégats
function huntressdamage(player, enemies)
{
  if (vulnerability == true)
  {
    vie = vie -1;
    console.log("false");
    console.log(vie);

    if(enemies.x > player.x)  //Projection du personnage en fonction de la direction de l'attaquant
    {
      player.setBounceX(-100);
      console.log("-YEET");
    }else if(enemies.x < player.x)
    {
      player.setBounceX(100);
      console.log("YEET");
    }

    var bumpTemps = scene.time.addEvent({ //Fenêtre permettant au personnage d'être projeter après une touche
        delay: 250,
        callback: bump,
        callbackScope: scene,
        loop: false
    });

    dgts.play();

    shieldFeedback = this.physics.add.sprite(player.x, player.y -5, 'shield');

    if(vie <= 0)
    {
      vie = 0;
      pause = true;
      scoreCalculation();
      console.log(scoreFinal);
    }

    vulnerability = false; //Modification du statut de vulnérabilité

    vulnerabilityInit();
  }else if (vulnerability == false)
  {
  }
}

//------------------------------------------------------------------------------
//Periode d'invicibilité au bout de laquelle la vulnérabilité est rétablit
function vulnerabilityInit()
{
  var timer = scene.time.addEvent({
      delay: 1500,
      callback: invicibility,
      callbackScope: scene,
      loop: false
  });
}

//------------------------------------------------------------------------------
//Projection au contacte
function bump()
{
  player.setBounceX(0);
}


//------------------------------------------------------------------------------
//Frame d'invincibilité
function invicibility(/*player*/)
{
  vulnerability = true;
  console.log("true");
  shieldFeedback.destroy(true);
}

//------------------------------------------------------------------------------
//Perte de santé
function applyDamage()
{
  vie = vie - 1;
}

//------------------------------------------------------------------------------
//Recuperation de vie
function applyPotion(player, potions)
{
  if(vie < 10)
  {
    vie = vie + 2;
    potions.destroy(true); //Destruction de la potion au contacte
  }
  if(vie >10)
  {
    vie = 10;
  }
}

//------------------------------------------------------------------------------
//Calcul de score
function scoreCalculation()
{
  pause = true;
  scoreFinal = timerVal * 10;
  scoreFinal += score;
  console.log(scoreFinal);

  var timer = scene.time.addEvent({ //Perdiode de temps avant l'apaprition du score à l'écran
      delay: 1500,
      callback: displayScore,
      callbackScope: scene,
      loop: false
  });
}

//Affichage des scores et modification des zones de textes de base
function displayScore()
{
  timerText.destroy(true);

  scoreText.destroy(true);

  timerText = this.add.text(720, 50, "Temps:" + timerVal, {
  fontSize: "24px",
  fill: "#FFFFFF"
  });

  scoreText = this.add.text(730, 100, "Frags:" + score, {
  fontSize: "24px",
  fill: "#CC0000"
  });

  scoreTotal = this.add.text(720, 150, "Total:" + scoreFinal, {
  fontSize: "24px",
  fill: "#FFFFFF"
  });

  var restartMessage = this.add.text(500, 200, "Appuyer sur ENTER pour relancer le niveau", {
  fontSize: "24px",
  fill: "#008000"
  });
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function update()
{
  //Gestion des déplacement du personnage
  if (keys.d.isDown && pause == false)
  {
    player.setVelocityX(160);

    if(player.body.touching.down)
    {
      player.anims.play('run', true); //Animation de marche
    }
    else
    {
      player.anims.play('fall', true); //Animation de chute
    }
    turn = false;
  }
  else if (keys.q.isDown && pause == false)
  {
    player.setVelocityX(-160);

    if(player.body.touching.down)
    {
      player.anims.play('runL', true);
    }
    else
    {
      player.anims.play('fallL', true);
    }

    turn = true;
  }
  else
  {
    player.setVelocityX(0);

    if (turn == false)
    {
      player.anims.play('idle', true);
    }
    else if (turn == true)
    {
      player.anims.play('idleL', true);
    }

  }


//------------------------------------------------------------------------------
//Apparition / tir de flèche
  while (game.input.activePointer.isDown && cadence==0 && pause == false)
    {
        console.log("Pew pew");
        if(turn == false)
        {
          arrow = this.physics.add.sprite(player.x, player.y, 'arrow');
          arrow.body.setVelocityX(3000);
          arrow.body.setVelocityY(-80); //Compensation de la gravité pour une meilleure portée de tir
          arrow.setCollideWorldBounds(true);
          cadence = 1;
        }else if(turn == true)
        {
          arrow = this.physics.add.sprite(player.x, player.y, 'arrowL');
          arrow.body.setVelocityX(-3000);
          arrow.body.setVelocityY(-80);
          arrow.setCollideWorldBounds(true);
          cadence = 1;
        }

    }

//Regulation de la cadence de tir / recharge
  if(game.input.activePointer.leftButtonReleased() && cadence == 1)
  {
    cadence = 0;
  }

//Mouvement symbole de shieldFeedback
  if(vulnerability == false)
  {
    shieldFeedback.x = player.x;
    shieldFeedback.y = player.y -35;
  }


//------------------------------------------------------------------------------
//Gestion du saut
  if (keys.space.isDown && player.body.touching.down)
  {
    player.setVelocityY(-320);

  }
//------------------------------------------------------------------------------
//Application des évènements de collision
  this.physics.add.collider(arrow, platforms, test, null, this);
  this.physics.add.overlap(arrow, enemies, skelydamage, null, this);
  this.physics.add.collider(player, enemies, huntressdamage, null, this);
  this.physics.add.collider(player, ennemisvol, huntressdamage, null, this);
  this.physics.add.overlap(arrow, ennemisvol, skelydamage, null, this);
  this.physics.add.overlap(player, potions, applyPotion, null, this);

  if(pause == true)
  {
    //Evènement de fin de partie
    //Destruction de tout les assets, remise à 0 des variables pour un nouveau lancement
    zeTimer.remove();

    this.game.sound.stopAll();

    back.getChildren().forEach(function (back)
    {
      back.destroy(true);
    });

    enemies.getChildren().forEach(function (enemies)
    {
      enemies.destroy(true);
    });

    ennemisvol.getChildren().forEach(function (ennemisvol)
    {
      ennemisvol.destroy(true);
    });

    platforms.getChildren().forEach(function (  platforms)
    {
        platforms.destroy(true);
    });

    potions.getChildren().forEach(function (  potions)
    {
        potions.destroy(true);
    });

    uiP.x = -100;   //Déplacmeent de icônes et portrait hors cadre
    uiS.x = -100;

    this.barre.destroy(true);

    scene.physics.pause();

    shieldFeedback.destroy(true);

    if (keys.enter.isDown)
    {
      //Reinitialisation pour une nouvelle run
      pause = false;
      vie = 10;
      score = 0;
      potionCount = 0;
      timerVal = 0;
      this.scene.restart();
    }

  }

//------------------------------------------------------------------------------
//Déplacement des enemies
  enemies.getChildren().forEach(function (enemies) {
    if (player.x < enemies.x && enemies.body.touching.down)
    {
      enemies.setVelocityX(-120);
      enemies.anims.play('skelywalkL', true);
    }else if (player.x > enemies.x && enemies.body.touching.down)
    {
      enemies.setVelocityX(120);
      enemies.anims.play('skelywalk', true);
    }

  });

  /*enemies.getChildren().forEach(function (enemies) {
    if (player.y < enemies.y && player.body.touching.down)
    {
      enemies.setBounceY(-120);
      //enemies.anims.play('skelywalkL', true);
    }else if (player.y > enemies.y && player.body.touching.down)
    {
      enemies.setBounceY(120);
      //enemies.anims.play('skelywalk', true);
    }

  });*/
  //Déplacment horizontale des ennemis volants
  ennemisvol.getChildren().forEach(function (ennemisvol) {
    if (player.x < ennemisvol.x)
    {
      ennemisvol.setVelocityX(-80);
      ennemisvol.anims.play('flySheetL', true);
    }else if (player.x > ennemisvol.x)
    {
      ennemisvol.setVelocityX(80);
      ennemisvol.anims.play('flySheet', true);
    }

  });
  //Déplacment verticale des ennemis volants
  ennemisvol.getChildren().forEach(function (ennemisvol) {
    if (player.y < ennemisvol.y)
    {
      ennemisvol.setVelocityY(-80);
    }else if (player.y > ennemisvol.y)
    {
      ennemisvol.setVelocityY(80);
    }

  });

//------------------------------------------------------------------------------
//Gestion barre de vie

    this.barre.clear();

    const size = -100;

    this.barre.fillStyle(0x2d2d2d); //Barre noir de fond
    this.barre.fillRect(100, 100, 25, size);

    this.barre.fillStyle(0xcc0000);
    this.barre.fillRect(100, 100, 25, vie*-10); //Barre rouge des PVs


}
