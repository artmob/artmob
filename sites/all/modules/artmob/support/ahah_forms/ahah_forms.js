var Ahah = Ahah || {};

/**
 *  element binding - object definition
 *  id: id attribute of the element
 *  selector: type.class attribute for collection of elements (optional)
 *  event: the type of event being bound to (click, change, etc)
 *  form_id: encapslating form
 *  path: the Drupal uri to call to get the updating html
 *  wrapper: the id of the container to insert the updated html into
 *  params: hash of params to be send back to the uri (overwrites form values)
 */
 
/**
 * Do an Asynchronous call back to Drupal to regenerate the wrapper and swap out the old content.
 */
Ahah.update = function( element, element_id ) {
  element_id = '#' + element_id;
  var wrapper_id = '#' + element.wrapper;
  var basePath = Drupal.settings.ahah.basePaths['base'];
  var modulePath = basePath + Drupal.settings.ahah.basePaths['module'];
	
  // let the user know something is going on
  $(element_id).attr( 'disabled', 'disabled' ); // disable the element that trigger the update
  $('body').css( "cursor", "wait");
  $(wrapper_id).css( 'opacity', '0.3' ); 
  // spinning graphic overlay
  var wait_image_size = 64;
  var left = ( $(wrapper_id).width() / 2 ) - ( wait_image_size / 2 );
  var top = ( $(wrapper_id).height() / 2 ) - ( wait_image_size / 2 );
  $(wrapper_id).prepend('<div style="position:relative"><div style="position:absolute; left:' + left +'px; top:' + top +'px; "><img src="' + modulePath + '/lib/loading.gif" /></div></div>');
	
  // build the params to post back to drupal as array of objects
  var params = $( '#' + element.form_id ).formToArray( true ); // collect the form's parameters
  for( var key in element.params ) {
    params.push( {name: key, value: element.params[key]} );
  } 
  // push the name/value of the activated element into the params
  params.push( {name: $(element_id).name(), value: $(element_id).val()} );
        
  var uri = basePath + element.path;
		
  $.post( uri, params, function(data) {
    $(wrapper_id).html( data ); // replace the old content
    // re-attach event listeners to newly generated html
    Ahah.attach_all_bindings( element.wrapper );
		
		// undo the visual changes
		$(wrapper_id).css( 'opacity', '1' ); 
		$('body').css("cursor", "auto");
		$(element_id).attr( 'disabled', '' );
	} );
};

Ahah.attach_to_element = function(element, wrapper) {
	var key;
	if( element.selector ) {
		key = element.selector;
	}
	else {
		key = '#' + element.id;
	}

	
	// only effect elements inside of wrapper, if wrapper is set (if not, applies to entire page)
	if( wrapper ) {
		key = '#' + wrapper + ' ' + key;
	}		
//	console.log( "Attach_to_element:  " + key + " : " + wrapper );
	
	$(key).each( function() {
//		console.log( "Attaching:  " + el.id + " : " + el.event + " (" + el.wrapper +")" );
		if( element.event === 'click' ) {
			$(this).click( function() {Ahah.update( element, this.id ); return false;} );
		}
		else if( element.event === 'change' ) {
			$(this).change( function() {Ahah.update( element, this.id ); return false;} );
		}
  	} );
}; 

/**
 *  Attach listeners to all elements
 */
Ahah.attach_all_bindings = function( wrapper ) {
  var element;
	// Drupal.ahah.elements is an array of arrays of elements
  for (var i in Drupal.settings.ahah.bindings ) {
    for (var j in Drupal.settings.ahah.bindings[i] ) {
      element = Drupal.settings.ahah.bindings[i][j];
      Ahah.attach_to_element( element, wrapper );
    }
  }
};

if( Drupal.jsEnabled ) {
	$(document).ready( 
		function(){
			Ahah.attach_all_bindings();
		} 
	);
}