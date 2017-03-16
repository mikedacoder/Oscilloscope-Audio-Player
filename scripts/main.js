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
	audio.src = dir + playlist[0] + ext;
	audio.play();
	
	//Add event handlers
	playbtn.addEventListener("click", playPause);
	volumeslider.addEventListener("mousemove", setVolume);
	
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
	
	function setVolume() {
		audio.volume = volumeslider.value / 100;
	}
	
}