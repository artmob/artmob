// self-contained user interface widgets. 

jQ14(document).ready(function() {

});

function afd_ui_bindings() {
    	
		// attribute tab: delete contributor
		
		var dci = true;
		jQ14('.delete-contributor-btn').each(function() {
		
				var src = jQ14(this).attr('src');
				
				if (typeof src != "undefined") {
					var newsrc = src.replace('delete_row_up.png','delete_row_over.png');
				
					if (dci == true) {
						// preload
						afd_ui_preload_img(newsrc);
						dci = false;
					}
									
					jQ14(this).hover(
							function() { jQ14(this).attr('src',newsrc)},
							function() { jQ14(this).attr('src',src)}
					);
				}
		});
		
		// attribute tab: add new contributor button

		jQ14('.add-new-contributor').unbind('click').bind('click',function() {
			var cvalues = jQ14(this)
				.closest('.cvalues');
				
			cvalues.find('.add-new-contributor-container').slideDown(400);
			cvalues.find('.contrib-newname').stop(400).fadeOut(600);
			cvalues.find('.contrib-delete').stop(600).fadeOut(600);
			var addcont = jQ14(this).closest('.formfields').find('.contrib-additional').fadeOut(600);
			
		});
		
		// attribute tab:  corporate contributor
		
		afd_add_corporate_contributor_ui();
				
		// attribute tab: add new contributor.  includes ajax code to update database.
		
		jQ14('.add-contributor-btn').unbind('click').bind('click',function() { 
			 var cvalues = jQ14(this).closest('.cvalues');
			 var cc = false;
			 var unknown = false; //TO DO
			 var fname = cvalues.find('.fname-cname').val();
			 var lname = cvalues.find('.lname-cname').val();
			 if (cvalues.find('.cc-cname').is(':checked') == true) {
			 		cc = true;
			 }
			 
			 var contribdata = {
				 first_name : fname,
				 last_name : lname,
				 is_corporate_contributor : cc,
				 is_unknown: unknown
			 }

			 jQ14.ajax({
					async: false, // forces the script to stop until ajax is complete. important when performing auto-selections
					url: Drupal.settings.afd.addcontribpath,
					dataType: 'json',
					type: 'POST',
					data:  {contributor: JSON.stringify(contribdata)},
					success: function(data) {
					  var cid;
						for (var key in data) {
							if (key != undefined) {
								cid = data[key];
							}
						}
						
						// TO DO: consider using menuUpdateContributors() ?

						var contributors;
						
						jQ14.ajax({
							async: false,
							url: Drupal.settings.afd.contribpath,
							dataType: 'json',
							success: function(data) {
								contributors = data;
							}
						});
						
						var options = '';
						
						for (var key in contributors) {
							if (key != undefined) {
								options += "<option value='" + key + "'>" + contributors[key] + "</option>\n";
							}
						}		  
						
						jQ14('.cvalues .select-cname').each(function() {
								var cv = jQ14(this);
								var val = cv.val();
								cv.empty();
								cv.html(options);
																
								if (cv.attr('name') != cvalues.find('.select-cname').attr('name')) { // not the current name list
									cv.val(val);
								} else { // current name list
									cv.val(cid);
								}
						});
						
						cvalues.find('.add-new-contributor-container').fadeOut(600);
						cvalues.find('.contrib-newname').stop(600).fadeIn(600);
						cvalues.find('.contrib-delete').stop(600).fadeIn(600);
						var addcont = cvalues.closest('.formfields').find('.contrib-additional').stop(600).fadeIn(600);
					}
				});
		});
		
		// attribute tab: close contributor button
		
		var cci = true;

		jQ14('.close-contributor-btn').each(function()  {
				var src = jQ14(this).attr('src');
				
				if (typeof src != "undefined") {
					var newsrc = src.replace('close_contributor_up.png','close_contributor_over.png');
				
					if (cci == true) {
						// preload
						afd_ui_preload_img(newsrc);
						cci = false;
					}
									
					jQ14(this)
						.hover(
							function() { jQ14(this).attr('src',newsrc)},
							function() { jQ14(this).attr('src',src)}
						);
					jQ14(this)
					 		.unbind()
							.bind('click',function() {
								 var cvalues = jQ14(this).closest('.cvalues');
								 cvalues.find('.add-new-contributor-container').slideUp(400);
								 cvalues.find('.contrib-newname').stop(400).fadeIn(600);
								 cvalues.find('.contrib-delete').stop(600).fadeIn(600);
								 cvalues.closest('.formfields').find('.contrib-additional').stop(600).fadeIn(600);
						});
				}
		});
		
		// attribute tab: delete contributor row button

		jQ14('.delete-contributor-btn').unbind('click').bind('click',function() {
			var ans = confirm("Are you sure you would like to remove this information?");
			if (ans)
			   jQ14(this).closest('.cvalues').remove();
		});
		
		// attribute tab: delete info row button

		jQ14('.delete-info-btn').unbind('click').bind('click',function() {
			var ans = confirm("Are you sure you would like to remove this information?");
			if (ans)		
			   jQ14(this).closest('.cvalues').remove();
		});
		
		// truncate banners
    
    jQ14('.banner-title').each(function() {
    	jQ14(this).html(afd_ui_truncate_banner(jQ14(this).html()));
    	
    });

		
		// attribute tab: title functions
		
		jQ14('.fd-title').bind('keyup',function(e) { // intercepts return character which would otherwise "submit" the form
		  console.log('keyup');
			var val = jQ14(this).val();
			var parent = jQ14(this).closest('.work').attr('id');
			jQ14('#' + parent + ' .work-title').not('#' + parent + ' .nested-works .work-title').html(val);			
		}).bind ('blur',function(e) { // replaces the title with the placeholder 
			var val = jQ14(this).val();
			if (val == '') {
				jQ14(this).val(emptytitleplaceholder);
			//		jQ14('#' + parent + ' .work-title').not('#' + parent + ' .nested-works .work-title').html(val);			
			}
		});
		
		
		// attribute tab: close banners
        
		jQ14('.work > .banner .close a').each(function() {
				var anchor = this;
				var container = jQ14(this).closest('.work').find('> .innerwork');
				afd_ui_close(anchor,container);
		});
            
            
    // attribute tab: swop info input fields
    
    jQ14('.select-cfield').unbind('change').bind('change',function() {
			var val = jQ14(this).val();
			var ftype = fields[val].fieldtype;
			var flabel = fields[val].label;
			var spid = jQ14(this).closest(".cvalues").attr('id');
			
			var container = jQ14('#' + spid + ' .infoval-container')
			
			var idindex = spid.indexOf('-');
			var iterationid = spid.slice(idindex+1);
				
			if (ftype == 'date') {
				//replace textfield with date widget
				container.html(datewidget);
			}
			else if (ftype == 'textfield') {
				container.html("<input class='infoval infoval-text' type='text' value='Enter Information' name='info-" + iterationid + "'/>");
			}
			else if (ftype == 'textarea') {
				container.html("<textarea class='infoval infoval-textarea' rows='6' cols='40' name='info-" + iterationid + "'>Enter Information</textarea>");
			}
			
		});
           
//         	jQ14(this).css('cursor','pointer');
//         	jQ14(this).unbind('click');
//         	jQ14(this).bind('click',function() {
//         		jQ14(this).closest('.work').find('> .innerwork').slideToggle('slow',function() {
//         			if (jQ14(anchor).hasClass('inactive')) {
//         				jQ14(anchor).removeClass('inactive').addClass('active');
//         				jQ14(anchor).html("Open");
//         			} else {
//         				jQ14(anchor).removeClass('active').addClass('inactive');
//         				jQ14(anchor).html("Close");
//         			}
//         		}) ;
//         	});
        
        afd_ui_toggle();
        artmob_glossary_render_links();

        
}

// used by attribute and license tab
function afd_add_corporate_contributor_ui() {

		jQ14('.cc-cname').unbind('change').bind('change',function() {
			var val = jQ14(this).val();
			var cvalues = jQ14(this).closest('.cvalues');
			
			if (jQ14(this).is(':checked')) {
			  jQ14(this).val(1);
			  cvalues.find('.fname-cname').fadeOut(600,function() {});
			  cvalues.find('.lname-cname').each(function() {
			  	if (jQ14(this).val() == 'Last Name') {
			  		jQ14(this).val('Corporation Name');
			  	}
			  });
			  
			} else {
			  jQ14(this).val(0);
			  cvalues.find('.fname-cname').fadeIn(600,function() {});
			  cvalues.find('.lname-cname').each(function() {
			  	if (jQ14(this).val() == 'Corporation Name') {
			  		jQ14(this).val('Last Name');
			  	}
			  });
			}
		});
	
}

function afd_ui_close(anchor,container) {
	jQ14(anchor).css('cursor','pointer');
	jQ14(anchor).unbind('click').bind('click',function() {
		jQ14(container).slideToggle('slow',function() {
			if (jQ14(anchor).hasClass('inactive')) {
				jQ14(anchor).removeClass('inactive').addClass('active');
				jQ14(anchor).html("Open");
			} else {
				jQ14(anchor).removeClass('active').addClass('inactive');
				jQ14(anchor).html("Close");
			}
		}) ;
	});
}

function afd_ui_toggle() {
        jQ14('.fd-remove-btn').each(function() {
        	  var button = this;	
        		
        	  jQ14(button).unbind('click').bind('click',function() {
        	  	var c = window.confirm('This will remove this work and its incorporated works.  Do you want to proceed?');
        	  	if (c) {
        	  	  var work = jQ14(button).closest('.work');
        	  	  var wid = work.find('> .identifiers > .id').html();
        	  	  var parent = work.find('> .identifiers > .parent').html();
        	  	  var sequence = work.find('> .identifiers > .sequence').html();
        	  	  
        	  	  if (parent == '1' && sequence == '1') { // first nested work.  special case.
									/*work
										.animate({opacity: 0},300)
										.stop(300)
										.remove();
									// TO DO: replace neutral version of top-level work
									*/
									alert('You can’t remove the first incorporated work. You may change its work type or values, however.');
									
        	  	  } else {
									var menuid = '#menu-' + parent + '-' + sequence;
									work
										.animate({opacity: 0},300)
										.stop(300)
										.remove();
									jQ14(menuid).remove();
								}
						  }
						});
				});
}


var preloader = new Array;

function afd_ui_preload_img(imgSrc) {
		preloader[preloader.length] = new Image(); 
		preloader[preloader.length-1].src = imgSrc;
}

function afd_ui_truncate_banner(banner) {
	var newbanner = banner.substr(0,60);
	
	return(newbanner.length < banner.length ? newbanner + ' ... ' : banner);
}
