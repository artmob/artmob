$('document').ready(function() {
	// will superimpose a download file attachment button on any content box classed as "image-thumbnail"
	var dwcontent = $('.dd-full'); // this class indicates that we're viewing a digitized document basic view
	if (dwcontent.length > 0 && Drupal.settings.ddsettings.filepath != null) {
			var img = "<img alt='download icon' src='" + Drupal.settings.ddsettings.downloadup + "' />";
			var anchor = "<a title='Download " + Drupal.settings.ddsettings.filename + " (" + Drupal.settings.ddsettings.filesize + ")' href='" + Drupal.settings.ddsettings.filepath + "'>" + img + "</a>";
			var div = "<div id='am-download'>" + anchor + "</div>";
			var fielditems = $('.node').find('.field-items');
			
			fielditems
				.prepend(div)
				.css('position','relative');
				
			// NOTE ON METHOD
			// This method is intended to get the true width of the thumbnail image, which
			// normally returns '0' if not set explicitly.
			// A copy of the thumbnail is made then loaded into memory via $("<img/?");
			// A load-event method is then fired ( http://api.jquery.com/load-event/ )
			// which calls a handler function   Note that the css changes occur within
			// the handler function to avoid issues with asynchronicity, as the load
			// event is fired late, meaning that subsequent code will be executed beforehand
				
			var img = fielditems.find('.field-item a img'); // [0]; // Get my img elem
			if (typeof img.attr("src") != 'undefined') {
			$("<img/>")  // Make in memory copy of image to avoid css issues
					.attr("src", $(img).attr("src"))
					.load(function() {
							var width = this.width;   // Note: $(this).width() will not work
							var amd = $('#am-download');
							amd
								.css('position','absolute')
								.css('height','150px')
								.css('width',width + 'px')
								.css('float','left');
								
							var a = amd.find('a');
							
							a.css('float','right')
							 .css('position','relative')
							 .css('top','25px')
							 .css('right','25px');
							
					});
            }
	}
	
	if (Drupal.settings.ddsettings.movefield == true) {
		var nodeform = $('.node-form');
		var filefield = nodeform.find('.attachments')
		
		filefield
			.removeClass('collapsed')		
			.find('legend').html('Attach Digitized Document');
			
		var clone = filefield.clone(true);
		filefield.remove();
		
		nodeform.find('.standard').prepend(clone);
		
	}
});