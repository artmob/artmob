jQ14(document).ready(function() {
    console.log(Drupal.settings.artmobaudio.filepath);
    console.log(Drupal.settings.artmobaudio.playerpath);
	 jQ14("#audio-wrapper").jPlayer(
	 	{
		 ready: function () {
			 jQ14(this).jPlayer("setMedia", {
	     		mp3: Drupal.settings.artmobaudio.filepath,
	     });		 
	   },
		 swfPath: Drupal.settings.artmobaudio.playerpath,
	   supplied: "mp3",
	   solution: "flash"
	  }
	 );
});