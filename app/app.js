// remote: 192.168.1.38:52222 
var ws = null;
var stations = {};
var playlist = [];
var audio;
var rdv = null;

var activRadio = null;
var sellId = -1;

window.addEventListener("load", function () {
	//console.log("init");

	rdv = document.getElementById("radio-lists");

	audio = document.createElement("audio"); // that needs insert to html document or not plays :/
	audio.autoplay = true;
	audio.volume = 0.20;
  
  	document.body.appendChild(audio);

	reconnect();
});

window.addEventListener("keyup", function (e) {
	switch (e.keyCode) {
		case 13: //ok
			playlist[sellId].click();
			break;
		case 38: //up
			if (playlist[sellId]) {
				playlist[sellId].className = "radio";
				if (--sellId < 0) { sellId = 0; }
				playlist[sellId].className = "radio selected";
			}
			break;
		case 40: //down
			if (playlist[sellId]) {
				playlist[sellId].className = "radio";
				if (++sellId >= playlist.length) { sellId = playlist.length - 1; }
				playlist[sellId].className = "radio selected";
			}
			break;
	}
});

function reconnect() {
	//console.log("reconnect");
	
	ws = new WebSocket("ws://188.165.224.82:9002");
	ws.onmessage = function (e) { parsePlaylist(JSON.parse(e.data)) };
	ws.onclose = function () { setTimeout(reconnect(), 10 * 1000); };
}

function parsePlaylist(data) {
	//console.log("config parsing");
	
	var new_stations = {};
	var new_playlist = [];
	var old_sell_id = sellId;
	var old_station_name = "";
	var found = false;

	for (var n in data.stations) {
		var st =  data.stations[n]

		var div = createElement("div", { "className": "radio", "radioId": n, "radioName": st.name, "streamSource": st.stream });
		new_stations[st.name] = div;
		new_playlist.push(div);

		if (sellId >= 0 && !found && st.name === playlist[sellId]) {
			console.log("found id: " + n + " old id: " + sellId);
			sellId = n;
			found = true;
		}
		
		if (stations[st.name])
			delete stations[st.name];

		var play = createElement("div", { "className": "play" });
		var title = createElement("div", { "className": "title", "innerHTML": st.name });

		div.appendChild(play);
		div.appendChild(title);

		div.addEventListener("click", onClick);
	}

	rdv.innerHTML = "";
	for (var n in new_playlist) {
		rdv.appendChild(new_playlist[n]);
	}

	if (!found) {
		sellId = 0;
	} else {
		console.log("setting active element after load config");
		new_playlist[sellId].id = "active";
	}

	new_playlist[0].className = "radio selected";

	playlist = new_playlist;
	stations = new_stations;
}

function playStation(div) {
	//console.log("play station!", div);
	
	audio.pause();
	//audio.currentTime = 0;
	audio.src = "";

	//console.log("start playing: " + div.streamSource);
	audio.src = div.streamSource; //.replace(".aac", ".mp3");
	audio.play();
}

function onClick() {
	//console.log("cliecked radio" + this.radioId + " => " + this.streamSource);

	playlist[sellId].className = "radio";
	playlist[sellId].className = "radio selected";

	var active = document.getElementById("active");
	if(active) active.id = undefined;
	this.id = "active";

	sellId = this.radioId;

	playStation(this);
}

function createElement(type, options) {
	if (!type) return;
	var el = document.createElement(type);

	if (options && typeof options === "object") {
		for (id in options) {
			el[id] = options[id];
		}
	}

	return el;
}