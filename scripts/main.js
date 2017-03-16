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
	
	//Set object references
	var playbtn = document.getElementById("playpausebtn");
	var mutebtn = document.getElementById("mutebtn");
	var prevbtn = document.getElementById("prevbtn");
	var nextbtn = document.getElementById("nextbtn");
	var volumeslider = document.getElementById("volumeslider");
	var seekslider = document.getElementById("seekslider");
	var currtime = document.getElementById("currtime");
	var durationtime = document.getElementById("durationtime");
	
	//Audio Object
	var audio = new Audio();
	audio.src = dir + playlist[playlist_index] + ext;
	audio.pause();
	
	//Add event handlers
	playbtn.addEventListener("click", playPause);
	volumeslider.addEventListener("mousemove", setVolume);
	mutebtn.addEventListener("click", mute);
	seekslider.addEventListener("mousedown", function(event){ seeking = true; seek(event); });
	seekslider.addEventListener("mousemove", function(event){ seek(event); });
	seekslider.addEventListener("mouseup", function(){ seeking = false; });
	audio.addEventListener("timeupdate", function(){ seekTimeUpdate(); });
	prevbtn.addEventListener("click", prevTrack);
	nextbtn.addEventListener("click", nextTrack);
	
	//Play and pause the audio
	function playPause() {
		if(audio.paused) {
			audio.play();
			playbtn.style.background = "url(images/PauseButton.png) no-repeat";
			playbtn.style.backgroundSize = "100% 100%";
		} else {
			audio.pause();
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
		durationtime.innerHTML = durmins + ":" + dursecs;
	}
	
	//Switch to the previous track
	function prevTrack() {
		if(playlist_index === 0) {
			playlist_index = (playlist.length - 1);
		} else {
			playlist_index--;
		}
		audio.src = dir + playlist[playlist_index] + ext;
		audio.currentTime = 0;
		console.log(playlist[playlist_index]);
		if(audio.paused) {
			audio.pause();
		} else {
			audio.play();
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
		audio.currentTime = 0;
		console.log(playlist[playlist_index]);
		if(audio.paused) {
			audio.pause();
		} else {
			audio.play();
		}		
	}
	
}