// VARS

const character = document.getElementById("character");
const CHARACTER_WIDTH = 30;
const CHARACTER_HEIGHT = 75;
const platform1 = document.getElementById("platform1");
const platform2 = document.getElementById("platform2");
const all_platforms = [platform1,platform2];
const beam = document.getElementById("beam");
const score = document.getElementById("score");
const tap = document.getElementById("tap");
const hearts = document.getElementById("hearts");
const game = document.getElementById("game");

let hit = 0;
let score_count = 0;
let beam_count = 0;
let not_started = true;
let Y_Speed = 0;
let is_colission = false;
let second_jump = true;

// FUNCTIONS

function play_again(){
    location.reload();
}

function lost(){
    var high_score = JSON.parse(localStorage.getItem("high_score")) || score_count;
    
    if(high_score<score_count){
        high_score=score_count
    };

    for(var i in interval_list){
        clearInterval(interval_list[i])
    };
    for(var i in all_platforms){
        all_platforms[i].style.left = 500 + "px";
        all_platforms[i].style.animation = "none"
    };
    beam.style.top = -500+"px";
    character.style.top = -500+"px";

    var agg = "<div id='final_screen'>";
    agg += `<p>SCORE: ${score_count}</p>`;
    agg += `<p>RECORD: ${high_score}</p>`;
    agg += `<div id="play_again" onclick="play_again()">Play Again</div>`;
    agg += "</div>"

    score.remove();
    game.innerHTML += agg;
    localStorage.setItem("high_score",JSON.stringify(high_score));
};

function heart_loss(){
    hit++;
    if(hit==1){
        hearts.style.backgroundImage = "url('assets/imgs/2.png')";
    }else if(hit==2){
        hearts.style.backgroundImage = "url('assets/imgs/1.png')";
    }else if(hit==3){
        hearts.style.backgroundImage = "none";
    }else{
        lost();
    }
};

function colission(){
    
    var characterbottom = parseFloat(getComputedStyle(character)
    .getPropertyValue("top"))+CHARACTER_HEIGHT;
    var characterleft = parseFloat(getComputedStyle(character)
    .getPropertyValue("left"));
    var characterright = parseFloat(getComputedStyle(character)
    .getPropertyValue("left")+CHARACTER_WIDTH);
    
    for(var i in all_platforms){
        var platformtop = parseFloat(getComputedStyle(all_platforms[i])
        .getPropertyValue("top"));
        var platformleft = parseFloat(getComputedStyle(all_platforms[i])
        .getPropertyValue("left"));
        var platformright = platformleft+260;

        if(platformtop <= characterbottom && platformtop+15>=characterbottom
            && (characterright>=platformleft-40 && characterleft<platformright+50)){
            Y_Speed = 0;
            is_colission = true;
            character.style.top = platformtop-CHARACTER_HEIGHT+"px";
            second_jump=true;
            character.classList.remove("rotate");
            break;
        }else{
            is_colission=false;
        }
    }
};

function gravity(){
    const charactertop = parseFloat(getComputedStyle(character)
    .getPropertyValue("top"));

    if(!is_colission){
        if(Y_Speed<4){
            Y_Speed += 0.3;
        };

        character.style.top = charactertop+Y_Speed+"px";
    }
    if(charactertop>700){
        lost();
        character.style.top = 700+"px";
    }
};

function jump(){
    
    const charactertop = parseFloat(getComputedStyle(character)
    .getPropertyValue("top"));

    if(not_started){
        not_started=false;
        start()
    };

    if(is_colission){
        
        character.style.top = charactertop-5+"px";
        Y_Speed = -8;

    }else{
        if(second_jump){
            character.style.top = charactertop-5+"px";
            character.classList.add("rotate");
            Y_Speed = -9;
            second_jump = false;
        }
    }
};


function start(){
    platform2.classList.add("animate");
    platform1.classList.add("start");
    setTimeout(function(){
        platform1.classList.remove("start");
        platform1.classList.add("animate");
    },1000);
    beam.classList.add("shooting");
    var score_interval = setInterval(function(){
        score_count++;
        score.textContent = `SCORE: ${score_count}`
    },1000);
    tap.remove();
    interval_list.push(score_interval);
};


// INTERVALS

var gravity_interval = setInterval(gravity,8);
var colission_interval = setInterval(colission,20);
var interval_list = [gravity_interval,colission_interval]

// EVENT LISTENERS

platform1.addEventListener("animationiteration",()=>{
    var spawn = Math.floor((Math.random()*150))+300;
    platform1.style.top = spawn+"px";
});

platform2.addEventListener("animationiteration",()=>{
    var spawn = Math.floor((Math.random())*150)+300;
    platform2.style.top = spawn+"px";
});

beam.addEventListener("animationiteration",()=>{
    if(beam_count>25){

        var beamtop = parseFloat(getComputedStyle(beam)
        .getPropertyValue("top"));
        var beamleft = parseFloat(getComputedStyle(beam)
        .getPropertyValue("left"));
        
        var charactertop = parseFloat(getComputedStyle(character)
        .getPropertyValue("top"));
        var characterbottom = parseFloat(getComputedStyle(character)
        .getPropertyValue("top"))+CHARACTER_HEIGHT;

        beam.style.left=0+"px";
        beam.style.top = Math.floor((Math.random()*560)+20)+"px";

        if(charactertop<beamtop+2.5 && beamtop+2.5<characterbottom && beamleft==0){
            heart_loss();
        }
    }else{
        beam_count++;
    }
});