// JavaScript Document
window.addEventListener("load", initAudioPlayer);

function initAudioPlayer() {
	var dir = "audio/";
	var ext = ".mp3";
	var playlist_index = 0;
	var playlist = [
			"Alto1_There_Will_Be_Rest", 
			"Alto2_There_Will_Be_Rest", 
			"Bass1_There_Will_Be_Rest", 
			"Bass2_There_Will_Be_Rest",
			"Soprano1_There_Will_Be_Rest", 
			"Soprano2_There_Will_Be_Rest", 
			"Tenor1_There_Will_Be_Rest", 
			"Tenor2_There_Will_Be_Rest"
			];
	var seeking;
	var playing = false;
	
	//Set object references
	var playbtn = document.getElementById("playpausebtn");
	var mutebtn = document.getElementById("mutebtn");
	var prevbtn = document.getElementById("prevbtn");
	var nextbtn = document.getElementById("nextbtn");
	var volumeslider = document.getElementById("volumeslider");
	var seekslider = document.getElementById("seekslider");
	var currtime = document.getElementById("currtime");
	var durationtime = document.getElementById("durationtime");
	var currTrackName = document.getElementById("currTrackName");
	
	//Audio Object
	var audio = new Audio();
	audio.src = dir + playlist[playlist_index] + ext;
	currTrackName.innerHTML = playlist[playlist_index];
	audio.pause();
	
	var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
	var analyser = audioCtx.createAnalyser();
	var source = audioCtx.createMediaElementSource(audio);
	
	analyser.fftSize = 2048;
	var bufferLength = analyser.frequencyBinCount;
	var dataArray = new Uint8Array(bufferLength);	
	analyser.getByteTimeDomainData(dataArray);
	
	// Get a canvas defined with ID "oscilloscope"
	var canvas = document.getElementById("oscilloscope");
	var ctx = canvas.getContext("2d"); 
	
	source.connect(analyser);
	analyser.connect(audioCtx.destination);		
	
	//Add event handlers
	playbtn.addEventListener("click", playPause);
	volumeslider.addEventListener("mousemove", setVolume);
	mutebtn.addEventListener("click", mute);
	seekslider.addEventListener("mousedown", function(event){ seeking = true; seek(event); });
	seekslider.addEventListener("mousemove", function(event){ seek(event); });
	seekslider.addEventListener("mouseup", function(){ seeking = false; });
	audio.addEventListener("timeupdate", function(){ seekTimeUpdate(); });
	prevbtn.addEventListener("click", prevTrack);
	nextbtn.addEventListener("click", function() { nextTrack(); });
	audio.addEventListener("ended", function() { nextTrack(); });
	
	//Draw oscilloscope
	draw();
	
	//Play and pause the audio
	function playPause() {
		if(audio.paused) {
			audio.play();
			playing = true;
			playbtn.style.background = "url(images/PauseButton.png) no-repeat";
			playbtn.style.backgroundSize = "100% 100%";
		} else {
			audio.pause();
			playing = false;
			playbtn.style.background = "url(images/PlayButton.png) no-repeat";
			playbtn.style.backgroundSize = "100% 100%";
		}
	}
	
	//Change the volume level
	function setVolume() {
		audio.volume = volumeslider.value / 100;
	}
	
	// Mute and unmute the audio
	function mute() {
		if(audio.muted) {
			audio.muted = false;
			mutebtn.style.background = "url(images/MuteButton.png) no-repeat";
			mutebtn.style.backgroundSize = "100% 100%";
		} else {
			audio.muted = true;
			mutebtn.style.background = "url(images/UnMuteButton.png) no-repeat";
			mutebtn.style.backgroundSize = "100% 100%";
		}
	}
	
	//Seek - Not working correctly
	function seek(event) {
		if(seeking){
			seekslider.value = event.clientX - seekslider.offsetLeft;
			var seekto = audio.duration * (seekslider.value / 100);
			audio.currentTime = seekto;
		}
	}
	
	// Keep the displayed time current
	function seekTimeUpdate() {
		var nt = audio.currentTime * (100 / audio.duration);
		console.log('nt:', nt);
		seekslider.value = nt;
		var curmins = Math.floor(audio.currentTime / 60);
		var cursecs = Math.floor(audio.currentTime - curmins * 60);
		var durmins = Math.floor(audio.duration / 60);
		var dursecs = Math.floor(audio.duration - durmins * 60);
		if(cursecs < 10) { cursecs = "0" + cursecs; }
		if(dursecs < 10) { dursecs = "0" + dursecs; }
		if(curmins < 10) { curmins = "0" + curmins; }
		if(durmins < 10) { durmins = "0" + durmins; }
		currtime.innerHTML = curmins + ":" + cursecs;
		if(isNaN(audio.duration)){
			durationtime.innerHTML = "00:00";
		} else {
			durationtime.innerHTML = durmins + ":" + dursecs;
		}
	}
	
	//Switch to the previous track
	function prevTrack() {
		if(playlist_index === 0) {
			playlist_index = (playlist.length - 1);
		} else {
			playlist_index--;
		}
		audio.src = dir + playlist[playlist_index] + ext;
		currTrackName.innerHTML = playlist[playlist_index];
		audio.currentTime = 0;		
		
		if(playing === false) {
			audio.pause();
			playbtn.style.background = "url(images/PlayButton.png) no-repeat";
			playbtn.style.backgroundSize = "100% 100%";
		} else {
			audio.play();
			playbtn.style.background = "url(images/PauseButton.png) no-repeat";
			playbtn.style.backgroundSize = "100% 100%";			
		}		
	}
	
	//Switch to the next track
	function nextTrack() {
		if(playlist_index === (playlist.length - 1)) {
			playlist_index = 0;
		} else {
			playlist_index++;
		}
		audio.src = dir + playlist[playlist_index] + ext;
		currTrackName.innerHTML = playlist[playlist_index];
		audio.currentTime = 0;		
				
		if(playing === false) {
			audio.pause();
			playbtn.style.background = "url(images/PlayButton.png) no-repeat";
			playbtn.style.backgroundSize = "100% 100%";
		} else {
			audio.play();			
			playbtn.style.background = "url(images/PauseButton.png) no-repeat";
			playbtn.style.backgroundSize = "100% 100%";	
		}		
	}
	
	function draw() {
		var drawVisual = requestAnimationFrame(draw);
		
		analyser.getByteTimeDomainData(dataArray);
		
		ctx.fillStyle = 'rgb(0, 0, 0)';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.lineWidth = 2;
		ctx.strokeStyle = 'rgb(204, 51, 255)';

		ctx.beginPath();

		var sliceWidth = canvas.width * 1.0 / bufferLength;
		var x = 0;

		for (var i = 0; i < bufferLength; i++) {

			var v = dataArray[i] / 128.0;
			var y = v * canvas.height / 2;

			if (i === 0) {
				ctx.moveTo(x, y);
			} else {
				ctx.lineTo(x, y);
			}

			x += sliceWidth;
		}

		ctx.lineTo(canvas.width, canvas.height / 2);
		ctx.stroke();
	}	
	
}