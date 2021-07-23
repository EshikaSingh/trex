var PLAY = 1;

var END = 0;

var gameState = PLAY;

var trex, trex_running, trex_collided;

var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;

var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOverImg,restartImg

var jumpSound , checkPointSound, dieSound;

var sun;

function preload(){
  trex_running = loadAnimation("trex (1).png","trex (2).png", "trex (3).png", "trex (4).png", "trex (5).png", "trex (6).png", "trex (7).png", "trex (8).png", "trex (9).png", "trex (10).png", "trex (11).png", "trex (12).png");
  
  trex_collided = loadAnimation("trex (1).png");
  
  groundImage = loadImage("grond..png");
  
  cloudImage = loadImage("cloud.2.png");
  
  obstacle1 = loadImage("cactus.1.png");
  
  obstacle2 = loadImage("cactus.1-1.png");
  
  restartImg = loadImage("restart-1.png");
  
  gameOverImg = loadImage("gameOver1.png");
  
  jumpSound = loadSound("jump.mp3");
  
  dieSound = loadSound("die.mp3");
  
  checkPointSound = loadSound("checkPoint.mp3");
  
  sunImage = loadImage("sun.png");
}

function setup() {
  
  createCanvas(windowWidth, windowHeight);
  
  ground = createSprite(200,770,400,50);
  ground.addImage(groundImage);
  ground.scale = 4
  ground.x = ground.width /2;
  
  trex = createSprite(85 ,770,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  
  gameOver = createSprite(450,500);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(450,450);
  restart.addImage(restartImg);
  
  sun = createSprite(860, 70, 10, 10);
  sun.addImage(sunImage);
  sun.scale = 0.3;       
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,780,400,10);
  invisibleGround.visible = false;

  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  ground.depth = 0.5;
  
  score = 0;
  
}

function draw() {
  
  background(500, 500, 0);
  
  trex.scale = 1.3;
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 100) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    
    if((touches.length > 0 || keyDown("SPACE")) && trex.y  >= height-120) {
      jumpSound.play( )
      trex.velocityY = -10;
       touches = [];
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.5;
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
  
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     trex.changeAnimation("collided", trex_collided);
     
     if(mousePressedOver(restart)) {
      reset();
    } 
      ground.velocityX = 0;
      trex.velocityY = 0
      
     //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  drawSprites();
  
  //displaying score
  fill("black");
  textSize(20);
  text("Score: "+ score, 10,25);
}

function reset(){
  
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  trex.changeAnimation("running", trex_running);
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
}


function spawnObstacles(){
 if (frameCount % 80 === 0){
   var obstacle = createSprite(850,height-65,20,30);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1, 2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;

      case 2: obstacle.addImage(obstacle2);
              break;
              default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.2; 
    obstacle.lifetime = 300;
   
    obstacle.setCollider('circle',0,0,20)
    //obstacle.debug = true
   
   obstacle.depth = trex.depth;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 100 === 0) {
    
    var cloud = createSprite(900,120,40,10);
    cloud.y = Math.round(random(60,100));
    cloud.addImage(cloudImage);
    cloud.scale = 0.2;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 500;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    fill("white")
      
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

