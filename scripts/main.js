// JavaScript Document
window.addEventListener("load", initAudioPlayer);

//Create audio player functionality
function initAudioPlayer() {	
	
	var dir = "audio/";	
	var playlist_index = 0;	
	
	// Store original playlistfor use in playlist creation.	
	var originalPlaylist = playlist.slice();
	var seeking;
	var playing = false;
	var createdplaylist = false;
	
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
	audio.src = dir + playlist[playlist_index];	
	currTrackName.innerHTML = playlist[playlist_index].slice(0, -4);
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
	
	//Show playlist
	showPlayList();
	
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
		audio.src = dir + playlist[playlist_index];
		currTrackName.innerHTML = playlist[playlist_index].slice(0, -4);
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
		highlightCurrentPlayingTrack();
	}
	
	//Switch to the next track
	function nextTrack() {
		if(playlist_index === (playlist.length - 1)) {
			playlist_index = 0;
		} else {
			playlist_index++;
		}
		audio.src = dir + playlist[playlist_index];
		currTrackName.innerHTML = playlist[playlist_index].slice(0, -4);
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
		highlightCurrentPlayingTrack();
	}
	
	//Update title attributes to say what the previous and next tracks are/were.
	function nextPrevTitleUpdate() {		
		if(playlist_index === 0) {
			prevbtn.title = "Previous Track: " + (playlist[playlist.length - 1].slice(0, -4));
			nextbtn.title = "Next Track: " + (playlist[playlist_index + 1].slice(0, -4));
		} else if(playlist_index === (playlist.length - 1)) {
			prevbtn.title = "Previous Track: " + (playlist[playlist_index - 1].slice(0, -4));
			nextbtn.title = "Next Track: " + (playlist[0].slice(0, -4));
		} else {		
			prevbtn.title = "Previous Track: " + (playlist[playlist_index - 1].slice(0, -4));
			nextbtn.title = "Next Track: " + (playlist[playlist_index + 1].slice(0, -4));
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
	
	//Show playlist
	function showPlayList() {	
		//Create element to use to attach playlist
		var playListDisplay = document.createElement("div");
		playListDisplay.id = "playlist";
		document.body.appendChild(playListDisplay);
		
		//Add Create Playlist Button
		var createPlaylistbtn = document.createElement("button");
		createPlaylistbtn.type = "submit";
		createPlaylistbtn.id = "createplaylist";
		if(createdplaylist === false) {			
			createPlaylistbtn.innerHTML = "Create Playlist";
			createPlaylistbtn.title = "Click the checkboxes of all the tracks you would like included in the custom playlist and press this button to create it.";
			playListDisplay.appendChild(createPlaylistbtn);
			createPlaylistbtn.removeEventListener("click", resetPlaylist);
			createPlaylistbtn.addEventListener("click", createPlaylist);
		} else {
			createPlaylistbtn.innerHTML = "Reset Playlist";
			createPlaylistbtn.title = "Click this button to return to the complete playlist.";
			playListDisplay.appendChild(createPlaylistbtn);
			createPlaylistbtn.removeEventListener("click", createPlaylist);
			createPlaylistbtn.addEventListener("click", resetPlaylist);			
		}
		
		//Add shuffle button
		var shufflebtn = document.createElement("button");
		shufflebtn.type = "button";
		shufflebtn.id = "shuffle";
		shufflebtn.innerHTML = "Shuffle";
		shufflebtn.title = "Click to to randomize the order of the tracks.";
		playListDisplay.appendChild(shufflebtn);
		shufflebtn.addEventListener("click", shuffle);
		
		//Attach playlist
		var playListTitle = document.createElement("h1");
		playListTitle.id = "playlisttitle";
		playListDisplay.appendChild(playListTitle);
		playListTitle.innerHTML = "Playlist";		
		
		for (var i = 0; i < playlist.length; i++) {	
			//Create div to wrap around playlist content.
			var audioTitle = document.createElement("div");
			audioTitle.id = "tracktitle";
			
			//Create checkboxes to use to create custom playlists.
			if(createdplaylist === false) {
				var checkbox = document.createElement("input");
				checkbox.type = "checkbox";
				checkbox.value = playlist[i];
				checkbox.id = "checkbox" + [i];
				checkbox.className = "checkbox";
			}
			
			//Create <p> element to contain track title.
			var audioTitleText = document.createElement("p");
			audioTitleText.id = playlist[i]; // Make the ID the same as the track title
			audioTitleText.addEventListener("click", switchTrack);
			
			//Create downalod link to download file.
		 	var downloadbtn = document.createElement("a");
			downloadbtn.innerHTML = "Download ";
			downloadbtn.download =  playlist[i];
			downloadbtn.href = dir + playlist[i];
			downloadbtn.title = "Download " + playlist[i];			
			
			//Attach playlist content to playlist area.
			playListDisplay.appendChild(audioTitle);
			if(createdplaylist === false) {
				audioTitle.appendChild(checkbox);
			}
			audioTitle.appendChild(audioTitleText);	
			audioTitle.appendChild(downloadbtn);
			audioTitleText.innerHTML = "Track " + (i + 1) + " " + playlist[i].slice(0, -4);						
		}	
		highlightCurrentPlayingTrack();
	}
	
	// Shuffle tracklist.
	function shuffle() {
		var playListDisplay = document.getElementById("playlist");		
		playlist.sort(function(a, b){return 0.5 - Math.random()});
		document.body.removeChild(playListDisplay);	
		audio.src = dir + playlist[0];
		currTrackName.innerHTML = playlist[0].slice(0, -4);
    showPlayList();
		nextPrevTitleUpdate();
		if(playing === false) {
			audio.pause();
			playbtn.style.background = "url(images/PlayButton.png) no-repeat";
			playbtn.style.backgroundSize = "100% 100%";
		} else {
			audio.play();
			playbtn.style.background = "url(images/PauseButton.png) no-repeat";
			playbtn.style.backgroundSize = "100% 100%";			
		}	
		highlightCurrentPlayingTrack();
	}
	
	// Create the user selected playlist
	function createPlaylist() {
		createdplaylist = true;
		var playListDisplay = document.getElementById("playlist");		
		playlist = [];
		var trackSelections = document.getElementsByClassName("checkbox");		
		for(var i = 0; i < trackSelections.length; i++){
			if(trackSelections[i].checked){
			 	playlist.push(trackSelections[i].value);
      }
		}	
		if(playlist.length < 1) {
			playlist = originalPlaylist.slice();
			createdplaylist = false;
		}
		document.body.removeChild(playListDisplay);
		audio.src = dir + playlist[0];
		currTrackName.innerHTML = playlist[0].slice(0, -4);
		showPlayList();
		nextPrevTitleUpdate();				
	}
	
	//Function to return to the original playlist - Not currently working correctly
	function resetPlaylist() {
		createdplaylist = false;
		playlist = originalPlaylist.slice();
		//originalPlaylist = [];		
		var playListDisplay = document.getElementById("playlist");
		document.body.removeChild(playListDisplay);		
		showPlayList();
		console.log(playlist);
		nextPrevTitleUpdate();
	}
	
	//Make currently playing track obvious in the playlist.
	function highlightCurrentPlayingTrack() {		
		for(var i = 0; i < playlist.length; i++) {
			if(document.getElementById(playlist[i]).id !== playlist[playlist_index]) {
				document.getElementById(playlist[i]).style.background = "none";
				document.getElementById(playlist[i]).style.color = "#000000";
				document.getElementById(playlist[i]).style.textAlign = "left";
				document.getElementById(playlist[i]).style.fontStyle = "normal";
			} else {
				document.getElementById(playlist[i]).style.background = "#000000";
				document.getElementById(playlist[i]).style.color = "rgb(57, 255, 20)";
				document.getElementById(playlist[i]).style.textAlign = "center";
				document.getElementById(playlist[i]).style.fontStyle = "italic";
			}
		}
	}
	
	function switchTrack(event) {
		for(var i = 0; i < playlist.length; i++){			
			if(event.target.id === playlist[i]) {
				playlist_index = i;					
			}
		}
		audio.src = dir + playlist[playlist_index];
		currTrackName.innerHTML = playlist[playlist_index].slice(0, -4);		
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
		highlightCurrentPlayingTrack();		
	}
}