// JavaScript Document
window.addEventListener("load", initAudioPlayer);

//Create audio player functionality
function initAudioPlayer() {
	var dir = "audio/";
	var ext = ".mp3";
	var playlist_index = 0;
	var playlist = [
			"Blister in the Sun", 
			"Hard to Handle", 
			"I Love Rock N' Roll",			
			"Sharp Dressed Man", 
			"The Boys Are Back in Town",
			"She Talks to Angels",
			"Legs",
			"You Shook Me All Night Long",
			"Nothing Else Matters", 
			"How Will I Laugh Tomorrow"
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
	
	//Get the width of the seek slider (so math is correct)	
	var seekSliderWidth = seekslider.offsetWidth;	
	
	//Audio Object
	var audio = new Audio();
	audio.src = dir + playlist[playlist_index] + ext;	
	currTrackName.innerHTML = playlist[playlist_index];
	audio.pause(); // Make sure audio does not start automatically
	//Update title attributes to say what the previous and next tracks are/were.
	nextPrevTitleUpdate();
	
	//Create AnalyserNode
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
	
	//Connect AnalyserNode to audio
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
			playbtn.title = "Pause";
		} else {
			audio.pause();
			playing = false;
			playbtn.style.background = "url(images/PlayButton.png) no-repeat";
			playbtn.style.backgroundSize = "100% 100%";
			playbtn.title = "Play current track";
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
			mutebtn.title = "Mute";
		} else {
			audio.muted = true;
			mutebtn.style.background = "url(images/UnMuteButton.png) no-repeat";
			mutebtn.style.backgroundSize = "100% 100%";
			mutebtn.title = "Unmute";
		}
	}	
	
	 //Seek - Not working correctly
	function seek(event) {
		if(seeking){						
			seekslider.value = event.clientX - seekslider.offsetLeft;			
			var seekto = audio.duration * (seekslider.value / seekSliderWidth);
			console.log("Seek to: " + seekto);
			audio.currentTime = seekto;
		}
	} 
	
	// Keep the displayed time current
	function seekTimeUpdate() {
		var newTime = audio.currentTime * (seekSliderWidth / audio.duration);		
		seekslider.value = newTime;
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
		nextPrevTitleUpdate();
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
		nextPrevTitleUpdate();
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
	
	//Update title attributes to say what the previous and next tracks are/were.
	function nextPrevTitleUpdate() {
		if(playlist_index === 0) {
			prevbtn.title = "Previous Track: " + (playlist[playlist.length - 1]);
			nextbtn.title = "Next Track: " + (playlist[playlist_index + 1]);
		} else if(playlist_index === (playlist.length - 1)) {
			prevbtn.title = "Previous Track: " + (playlist[playlist_index - 1]);
			nextbtn.title = "Next Track: " + (playlist[0]);
		} else {
			prevbtn.title = "Next Track: " + (playlist[playlist_index - 1]);
			nextbtn.title = "Next Track: " + (playlist[playlist_index + 1]);
		}
	}
	
	//Draw oscilloscope
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