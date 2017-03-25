<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="author" content="Michael Dryburgh">
<title>Audio Player</title>
<link href="styles/main.css" rel="stylesheet" type="text/css">
</head>

<body>
	<div class="audio-player">
		<div id="audio-controls">
			<button id="prevbtn" title="Previous Track"></button>
			<button id="playpausebtn" title="Play Current Track"></button>
			<button id="nextbtn" title="Next Track"></button>
			<button id="mutebtn" title="Mute"></button>
			<input id="volumeslider" type="range" min="0" max="100" value="100" step="1" title="Volume">
			<div id="currTrack">
				<p>Current Track: <span id="currTrackName"></span></p>
			</div>
			<div id="timebox">
				<span id="currtime">00:00</span> / <span id="durationtime">00:00</span>
			</div>
			<input id="seekslider" type="range" min="0" max="481" value="0" step="1" title="Seek">
			<canvas id="oscilloscope"></canvas>
		</div>		
	</div>		

<?php
//Get all audio files from the Audio directory.
$dir    = './audio';
$playListFiles1 = array_slice(scandir($dir), 2);
?>
<script type="text/javascript">
//Use json_encode to convert php array to a javascript array.
var playlist = <?php echo json_encode($playListFiles1); ?>;
</script>
<script type="text/javascript" src="scripts/main.js"></script>
</body>
</html>