function setupViews() {
   
   $('.dynamic-teaser').find('a').each(function() {
    var url=this.href.substr(0, this.href.indexOf('#') > 0 ? this.href.indexOf('#') : this.href.length).substr(0, this.href.indexOf('?') > 0 ? this.href.indexOf('?') : this.href.length);
    if (!Drupal.settings['dynamic_views_paths'][url]) return;

    var nid = Drupal.settings['dynamic_views_paths'][url];
    var place = Drupal.settings['list'][nid];
		var hash = '#p=' + place;
		
	  this.href = Drupal.settings['base_path'] + (Drupal.settings['view_front'] ? '' : Drupal.settings['view_url']) + hash;
		$(this).addClass('remote');

	  if ((Drupal.settings['base_path'] + Drupal.settings['view_url']) == location.pathname || (Drupal.settings['view_front'])) {
		 $(this).unbind('click').click(function(e, real) {
	    var vid = $(this).parents('.dynamic-teaser').attr('id').substr(15);
	    var ajaxUrl = Drupal.settings['dynamic_views_url_'+ vid];
	    var search = Drupal.settings['search'] ? Drupal.settings['search'] : location.search;
	    var nid = Drupal.settings['dynamic_views_paths'][url];
	    var place = Drupal.settings['list'][nid];
	    var trueClick = e.clientX || real;

      if (real) {
        location.href = hash;
      }
     
			if (trueClick) {
			  $.ajaxHistory.update(hash);
			}

	    $.ajax({
			  type: "GET",
			  async: true,
			  url: ajaxUrl + 'node/' + nid + '/' + place + search,
			  dataType: "json",
			  success: function(msg) {
			    $('#dynamic-node-'+ msg['updated_view']).html(msg['html']);
			    
			    if (msg['settings']) {
			      delete Drupal.updated_settings;
			      Drupal.extend({ updated_settings: msg['settings'] });
			    }
			    
					if (trueClick) {
					  $.ajaxHistory.update(hash); // setting hash in callback is required to make it work in Safari
					}
			    
			    setupViews();
			  },
			  error: function() { }
			});
		 });
		}
   });

   $('.dynamic-teaser a[@href*=page=]').each(function() {
    if (this.href.match(/#a=/)) return;
    
    var hash = '#a=' + this.href.substr(this.href.indexOf('page=')  + 9, parseInt(this.href.substr(this.href.indexOf('page=') + 9)).toString().length);
    var search = this.href.substr(this.href.indexOf('?'));
		this.href = hash;

		$(this).addClass('remote');
		$(this).unbind('click').click(function(e, real) {
     var vid = $(this).parents('.dynamic-teaser').attr('id').substr(15);
     var ajaxUrl = Drupal.settings['dynamic_views_url_'+ vid];
     var trueClick = e.clientX || real;

     if (real) {
       location.href = hash;
     }
     
		 if (trueClick) {
	 	   $.ajaxHistory.update(hash);
		 }

     $.ajax({
		  type: "GET",
		  async: true,
		  url: ajaxUrl + 'teaser' + search,
		  dataType: "json",
		  success: function(msg) {
		    $('#dynamic-teaser-'+ msg['updated_view']).html(msg['html']);

		    if (msg['settings']) {
		      delete Drupal.updated_settings;
		      Drupal.extend({ updated_settings: msg['settings'] });

		      if (msg['settings']['list']) {
		        Drupal.settings['list'] = msg['settings']['list'];
		      }
		      if (msg['settings']['search']) {
		        Drupal.settings['search'] = msg['settings']['search'];
		      }
		      if (msg['settings']['dynamic_views_paths']) {
		        Drupal.settings['dynamic_views_paths'] = msg['settings']['dynamic_views_paths'];
		      }
		    }

				if (trueClick) {
				  $.ajaxHistory.update(hash); // setting hash in callback is required to make it work in Safari
				}
		    
		    setupViews();
		  },
		  error: function() { }     
     });
    });
   });
  
  $($.merge($('.dynamic-node a[@href*=page=]'), $('.dynamic-node a[@href$='+ Drupal.settings['view_url'] +']'))).each(function() {
    var search = this.href.substr(this.href.indexOf('?'));
		var hash = '#i=' + search.substr(search.indexOf('page=') + 5, parseInt(search.substr(search.indexOf('page=') + 5)).toString().length);
		
		this.href = hash;
		$(this).addClass('remote');
		   
    $(this).unbind('click').click(function(e, real) {
     var vid = $(this).parents('.dynamic-node').attr('id').substr(13);
     var ajaxUrl = Drupal.settings['dynamic_views_url_'+ vid];
     var trueClick = e.clientX || real;
    	    
     if (real) {
       location.href = hash;
     }
     
		 if (trueClick) {
			 $.ajaxHistory.update(hash);
		 }

     $.ajax({
		  type: "GET",
		  async: true,
		  url: ajaxUrl + 'node/' + search,
		  dataType: "json",
		  success: function(msg) {
		    $('#dynamic-node-'+ msg['updated_view']).html(msg['html']);

		    if (msg['settings']) {
		      delete Drupal.updated_settings;
		      Drupal.extend({ updated_settings: msg['settings'] });

		      if (msg['settings']['list']) {
		        Drupal.settings['list'] = msg['settings']['list'];
		      }
		      if (msg['settings']['search']) {
		        Drupal.settings['search'] = msg['settings']['search'];
		      }
		    }
		    
				if (trueClick) {
				  $.ajaxHistory.update(hash); // setting hash in callback is required to make it work in Safari
				}

		    setupViews();
		  },
		  error: function() { }
     });
    });
  });
  
  $('.dynamic-filter #views-filters :submit').hide().parents('#views-filters').find('select').wrap('<ul class="dynamic-select"></ul>').each(function() {
    $(this).parent('.dynamic-select').attr('value', $(this).val());
    $(this).parent('.dynamic-select').attr('selectedIndex', this.selectedIndex);

    var current = $(this).val();
    var name = $(this).name();

    $(this).find('option').each(function() {
      var value = $(this).val();
      var text = $(this).text();
      

      $(this).parents('.dynamic-select'). append('<li class="dynamic-option"></li>').find('li:last').each(function() {
        var hash='#filter-' + value;

        $(this).append('<a></a>').find('a').href(hash).addClass(current == value ? 'active' : '').addClass('remote').append(text.replace('<','').replace('>','')).unbind('click').click(function(e, real) {
			    var vid = $(this).parents('.dynamic-filter').attr('id').substr(15);
	        var ajaxUrl = Drupal.settings['dynamic_views_url_'+ vid];
	        var search = Drupal.settings['search'] ? (Drupal.settings['search'] + '&') : location.search ? (location.search + '&') : '?';
	        search += name + '=' + value;
    	    var trueClick = e.clientX || real;
    	    
    	    if (real) {
    	      location.href = hash;
    	    }

					if (trueClick) {
					  $.ajaxHistory.update(hash);
					}

			    $.ajax({
					  type: "GET",
					  async: true,
					  url: ajaxUrl + 'filter' + search,
					  dataType: "json",
					  success: function(msg) {
					    // Load hidden in the background to create a smoother transition (buggy)
					    //$('body').append('<div class="dynamic-filter"></div>').find('.dynamic-filter:last').hide().html(msg['html']);

							// TODO: Fix bug when preloading DOM before display
							$('#dynamic-filter-'+ msg['updated_view']).html(msg['html']);

					    if (msg['settings']) {
					      delete Drupal.updated_settings;
					      Drupal.extend({ updated_settings: msg['settings'] });
					    }

							if (trueClick) {
							  $.ajaxHistory.update(hash); // setting hash in callback is required to make it work in Safari
							}

					    setupViews();
					    
					    // Update pre-loaded filter (buggy)
 					    //$('#dynamic-filter-'+ msg['updated_view']).html('');
 					    //$('body > .dynamic-filter:last').children().each(function() {$(this).prependTo($('#dynamic-filter-'+ msg['updated_view'])) });
					  },
					  error: function() { }
					});
        });
      });
      $(this).remove();
    });
    $(this).remove();
  });
}

if( document.styleSheets[0].insertRule ) { //Mozilla
	document.styleSheets[0].insertRule('.dynamic-filter select, .dynamic-filter .form-submit { display: none; }', document.styleSheets[0].cssRules.length );
}
else if(document.styleSheets[0].addRule) { //IE
	document.styleSheets[0].addRule( '.dynamic-filter select', "{ display: none; }" );
  document.styleSheets[0].addRule('.dynamic-filter .form-submit', "{ display: none; }");
}

$(document).ready(setupViews);
$(document).ready(function() {
  //Start the history observer to fix the back button
	$.ajaxHistory.initialize();
});  
