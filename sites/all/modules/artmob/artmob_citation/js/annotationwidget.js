var AnnotationWidget = AnnotationWidget || {};

/**
 * Do an Asynchronous call back to Drupal to regenerate the widget and swap out the old one.
 */
AnnotationWidget.update_widget_annotation = function( widget_name ) {
//	console.log( "Updating " + widget_name );
	$(this).attr("style", "cursor:wait");
	
	// build the params to post back to drupal
    var params = $('#node-form').formToArray( true ); // collect the form's parameters
    params.push( {name:'widget_name_js', value: widget_name} ); // add widget_name to params
    
    // figure out the basePath - might be String or Array
    basePath = Drupal.settings.widget.basePath[0];
//	console.log( "BasePath " + basePath );
//    if( basePath.constructor.toString().indexOf("Array") > -1 ) { // is array
//    	basePath = basePath[0];
//   	}
    uri = basePath + "artmob_annotation/widget_update_js";
	
	$.post( uri, params, function(data) {
		$('#widget_wrapper_' + widget_name).html( data ); // replace the old widget with the new one
//		$('#widget_subwidgets_' + widget_name).highlightFade( {start:[128,255,255], speed:4000} );
		$('#widget_wrapper_' + widget_name).highlightFade();
		AnnotationWidget.attach_widget_annotation( widget_name ); // re-attach event listeners to newly generated html
		$(this).attr("style", "cursor:auto");
	} );
}

//Redirect "enter" keypress inside widget textfields to do a submit of correct widget
// (Default it to just click the first button on the page!)
AnnotationWidget.redirect_enter_annotation = function( e, widget_name ) {
	if( e.keyCode == 13 ) { 
//		console.log( e ); 
		if( e.type == 'keyup' ) {
			AnnotationWidget.update_widget_annotation( widget_name );
		}
		return false;
	}
	return true;
}

/**
 *  Attach listeners to widget's events
 */
AnnotationWidget.attach_widget_annotation = function( widget_name ) {
//  		console.log( "Attaching: " + widget_name );
		// Add New Subwidget Button -- need to return false, so page is not submitted
	  	$('input.widget_add_subwidget_button_' + widget_name).click( function(){AnnotationWidget.update_widget_annotation( widget_name ); return false;} );
		// Remove existing subwidget checkbox
	  	$('input.widget_remove_' + widget_name).click( function(){AnnotationWidget.update_widget_annotation( widget_name )} );
		// Select new weight for existing subwidget
	  	//$('select.widget_weight_' + widget_name).change( function(){AnnotationWidget.update_widget_annotation( widget_name )} );

		//Redirect "enter" keypress inside widgets to the widget submit button
		$('#edit-' + widget_name + '-new-subwidget-annotator-nid').keydown( function(e){ return AnnotationWidget.redirect_enter_annotation(e, widget_name); } );
		$('#edit-' + widget_name + '-new-subwidget-annotator-nid').keyup( function(e){ return AnnotationWidget.redirect_enter_annotation(e, widget_name); } );
		$('#edit-' + widget_name + '-new-subwidget-annotation').keydown( function(e){ return AnnotationWidget.redirect_enter_annotation(e, widget_name); } );
		$('#edit-' + widget_name + '-new-subwidget-annotation').keyup( function(e){ return AnnotationWidget.redirect_enter_annotation(e, widget_name); } );
}

/**
 *  Attach listeners to all widgets
 */
AnnotationWidget.attach_all_annotation = function() {
	for (var index in Drupal.settings.widget.annotationnames ) {
  		widget_name = Drupal.settings.widget.annotationnames[index];
  		AnnotationWidget.attach_widget_annotation( widget_name );
  	}
}

if( Drupal.jsEnabled ) {
	$(document).ready(AnnotationWidget.attach_all_annotation);
}
