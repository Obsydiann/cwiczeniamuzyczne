function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


//thanks https://stackoverflow.com/a/2450976
function shuffle(array) {

  let new_array = array;

  if (Math.floor(Math.random() * 2)){
    new_array.reverse();
  };

  return new_array;
}

function stop_audio(audio_to_stop){
  audio_to_stop.pause();
  audio_to_stop.currentTime = 0;
}

function stop_sounds(sounds){
  sounds.forEach(sound => {
    stop_audio(sound);
  });
}

let started = false;

let audios = [new Audio("../sounds/C-dolne.wav"), new Audio("../sounds/C-dolne.wav")];
audios[0].preservesPitch = false;
audios[1].preservesPitch = false;

let interval;
let start_sound;


//heat up audios
audios[0].play(); audios[1].play();
stop_sounds(audios);

let sound_seperation_input = document.getElementById("between_time");
let sound_seperation_label = document.getElementById("between_time_label");
sound_seperation_label.textContent = sound_seperation_input.value;

sound_seperation_input.addEventListener("input", (event) => {
  sound_seperation_label.textContent = sound_seperation_input.value;
});

let info_label = document.getElementById("info");

let mel_button = document.getElementById("mel");
let har_button = document.getElementById("har");

let is_mel = true;
let is_har = true;

function update_har_mel_buttons(){
  if (is_mel){
    mel_button.style.backgroundColor = "#d0e1ea";
  }else{
    mel_button.style.backgroundColor = "#c0c0c0";
  }
  if (is_har){
    har_button.style.backgroundColor = "#d0e1ea";
  }else{
    har_button.style.backgroundColor = "#c0c0c0";
  }
}

update_har_mel_buttons();

mel_button.onclick = function(){
  is_mel = !is_mel;
  if (!is_mel){
    is_har = true;
  }

  update_har_mel_buttons();
}

har_button.onclick = function(){
  is_har = !is_har;
  if (!is_mel){
    is_mel = true;
  }

  update_har_mel_buttons();
}

let up_button = document.getElementById("goup");
let down_button = document.getElementById("godown");
let random_button = document.getElementById("gorandom");

let goup = true;
let godown = false;
let gorandom = false;

function update_go_buttons(){
  if (!goup){
    up_button.style.backgroundColor = "#c0c0c0";
  }else{
    up_button.style.backgroundColor = "#d0e1ea";
  };
  if (!godown){
    down_button.style.backgroundColor = "#c0c0c0";
  }else{
    down_button.style.backgroundColor = "#d0e1ea";
  };
  if (!gorandom){
    random_button.style.backgroundColor = "#c0c0c0";
  }else{
    random_button.style.backgroundColor = "#d0e1ea";
  };
}

up_button.onclick = function(){
  goup = true;
  godown = false;
  gorandom = false;
  update_go_buttons();
}

down_button.onclick = function(){
  goup = false;
  godown = true;
  gorandom = false;
  update_go_buttons();
}

random_button.onclick = function(){
  goup = false;
  godown = false;
  gorandom = true;
  update_go_buttons();
}

update_go_buttons();

function set_info_label(text, color = "black", bold = false, italics = false){
  info_label.textContent = text;
  info_label.style.color = color;
  info_label.style.bold = bold;
  info_label.style.italics = italics;
}


async function play_notes_apart(sounds, seperation_time) {
  sounds[0].play();
  let i = 1;
  for (let i = 1; i < sounds.length; i++){
    await sleep(seperation_time);
    sounds[i].play();
  };
}

async function guess_interval(guessed_interval){
  if (guessed_interval == interval){
    set_info_label("Dobra odpowiedź", "green");
    stop_sounds(audios);

    await sleep(1000);

    generate_new_interval();
    play_intervals
    play_intervals();

  } else{
    set_info_label("Zła odpowiedź", "red");
  }
}

console.log()
function get_avaliable_intervals(){
  let avaliable_intervals = [];
  for (let i = 0; i <= 12; i++){
    if (document.getElementById(i + "s").checked){
      avaliable_intervals.push(i);
    };
  };

  return avaliable_intervals;
}


function generate_new_interval(){
  let avaliable_intervals = get_avaliable_intervals();
  let interval_idx = Math.floor(Math.random() * avaliable_intervals.length);
  interval = avaliable_intervals[interval_idx];

  
  start_sound = Math.floor(Math.random() * (24 + 24 - interval) - 24);


  audios[0].playbackRate = 2 ** (start_sound / 12);
  audios[1].playbackRate = 2 ** ((start_sound + interval) / 12);
}


async function play_intervals(){
  stop_sounds(audios);

  if (is_mel){

    if (goup){
      await play_notes_apart(audios, sound_seperation_input.value * 1000);
    }else if (godown){
      await play_notes_apart(audios.reverse(), sound_seperation_input.value * 1000);
      audios.reverse();
    } else if (gorandom){
      await play_notes_apart(shuffle(audios), sound_seperation_input.value * 1000);
    }
    

    await sleep(sound_seperation_input.value * 1000);
    stop_sounds(audios);
  }

  if (is_har){
    audios[0].play(); audios[1].play();
  }
}

function start(){
  if (!started){
    generate_new_interval();
    play_intervals();
  }
}

let columns_of_buttons = 2;

function window_resized(){
  if (38 * 7 > document.querySelector(".answer_container").clientHeight && columns_of_buttons == 2){
    document.querySelector(".answer_container").style.gridTemplateColumns = "repeat(4, 25vh)";
    columns_of_buttons = 4;
  }else if (200 < document.querySelector(".answer_container").clientHeight && columns_of_buttons == 4){
    document.querySelector(".answer_container").style.gridTemplateColumns = "repeat(2, 25vh)";
    columns_of_buttons = 2;
  };
}

window.addEventListener("resize", window_resized);

window_resized();
  

console.log(document.querySelector(".answer_container_item > button").clientHeight * 7);
console.log(document.querySelector(".answer_container").clientHeight);