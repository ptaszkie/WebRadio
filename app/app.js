// remote: ip:52222 

console.log("script loaded!!");

var radios;
var activRadio = null;
var sellId;
var player;
var isPlaying = false;

window.addEventListener("load", function() {
  radios = [];
  createPlayer();
  createGrid();
});

window.addEventListener("keyup", function(e){
  switch(e.keyCode)
  {
    case 13: //ok
      radios[sellId].click();
      break;
    case 38: //up
      if(radios[sellId]){
        radios[sellId].className = "radio"; 
        if(--sellId < 0){sellId = 0;}
        radios[sellId].className = "radio selected";
      }
      break;
    case 40: //down
      if(radios[sellId]){
        radios[sellId].className = "radio"; 
        if(++sellId >= radios.length){sellId = radios.length-1;}
        radios[sellId].className = "radio selected";
      }
      break;
  }
});

function createGrid(){
  var radio_list = [
    {
      name: "Vox Fm",
      img: "voxfm.png",
      src: "http://waw03.ic1.scdn.smcloud.net/t049-1.mp3"
    },
    {
      name: "Rmf Fm",
      img: "rmffm.png",
      src: "http://31.192.216.10/RMFFM48"
    },
    {
      name: "Radio Złote Przeboje",
      img: "zloteprzeboje.png",
      src: "http://poznan5-6.radio.pionier.net.pl:8000/tuba9-1.mp3"
    },
    {
      name: "Radio Eska",
      img: "eska.png",
      src: "http://publish.acdn.smcloud.net:8000/t042-1.mp3"
    },
    {
      name: "Antyradio",
      img: "antyradio.png",
      src: "http://dcs-188-64-85-35.atmcdn.pl/sc/o2/Eurozet/live/antyradio.livx?audio=5/;stream.nsv?seed=119.60711795836687"
    }
  ];
  
  var rdv = document.getElementById("radio-lists");
  
  for (id in radio_list){
    var rd = radio_list[id]; // aktualnei przetwarzane radio
    
    var div = createElement("div", {"className": "radio", "radioId": id, "streamSource": rd.src})

    var play  = createElement("div", {"className": "play"});
    
    var logo  = createElement("div", {"className": "logo"});
    logo.style.backgroundImage = "url(img/" + rd.img+")";
    
    var title = createElement("div", {"className": "title", "innerHTML": rd.name});
    
    div.appendChild(play);
    div.appendChild(logo);
    div.appendChild(title);

    div.addEventListener("click", onClick);
    
    radios.push(div);
    rdv.appendChild(div); // dom el with radio list
  }
  
  if(radios.length > 0)
  {
    sellId = 0;
    radios[0].id = "active";
    radios[sellId].className = "radio selected";
    radios[sellId].click();
  }
}

function createPlayer(){
  console.log("player created!");
  
  player = document.createElement("audio");
  player.autoplay = false;
  player.volume = 0.25;
  
  document.body.appendChild(player);
}

function onClick(){
  console.log("radio clicked!");
  
  radios[sellId].className = "radio"; 
  radios[sellId].className = "radio selected";
  
  var active = document.getElementById("active");
  active.id = undefined;
  activRadio = this;
  this.id = "active";

  if(this.radioId != sellId){
    player.pause();
  }
  player.src = activRadio.streamSource;
  player.play();
}

function createElement(type, options){
  if(!type) return;
  var el = document.createElement(type);
  
  if(options && typeof options === "object"){
    for(id in options){
      el[id] = options[id];
    }
  }
  
  return el;
}