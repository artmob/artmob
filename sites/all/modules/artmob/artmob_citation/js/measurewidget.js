var WidgetMeasure = WidgetMeasure || {};

/**
 * Do an Asynchronous call back to Drupal to regenerate the widget and swap out the old one.
 */
WidgetMeasure.update_widget_measure = function( widget_name ) {
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
    uri = basePath + "artmob_measurement/widget_update_js";
	
	$.post( uri, params, function(data) {
		$('#widget_wrapper_' + widget_name).html( data ); // replace the old widget with the new one
//		$('#widget_subwidgets_' + widget_name).highlightFade( {start:[128,255,255], speed:4000} );
		$('#widget_wrapper_' + widget_name).highlightFade();
		WidgetMeasure.attach_widget_measure( widget_name ); // re-attach event listeners to newly generated html
		$(this).attr("style", "cursor:auto");
	} );
}

//Redirect "enter" keypress inside widget textfields to do a submit of correct widget
// (Default it to just click the first button on the page!)
WidgetMeasure.redirect_enter_measure = function( e, widget_name ) {
	if( e.keyCode == 13 ) { 
//		console.log( e ); 
		if( e.type == 'keyup' ) {
			WidgetMeasure.update_widget_measure( widget_name );
		}
		return false;
	}
	return true;
}

/**
 *  Attach listeners to widget's events
 */
WidgetMeasure.attach_widget_measure = function( widget_name ) {
 // 		console.log( "Attaching: " + widget_name );
		// Add New Subwidget Button -- need to return false, so page is not submitted
	  	$('input.widget_add_subwidget_button_' + widget_name).click( function(){WidgetMeasure.update_widget_measure( widget_name ); return false;} );
		// Remove existing subwidget checkbox
	  	$('input.widget_remove_' + widget_name).click( function(){WidgetMeasure.update_widget_measure( widget_name )} );
		// Select new weight for existing subwidget
	  	//$('select.widget_weight_' + widget_name).change( function(){WidgetMeasure.update_widget_measure( widget_name )} );

		//Redirect "enter" keypress inside widgets to the widget submit button
		$('#edit-' + widget_name + '-new-subwidget-measurement-type-code').keydown( function(e){ return WidgetMeasure.redirect_enter_measure(e, widget_name); } );
		$('#edit-' + widget_name + '-new-subwidget-measurement-type-code').keyup( function(e){ return WidgetMeasure.redirect_enter_measure(e, widget_name); } );
		$('#edit-' + widget_name + '-new-subwidget-measurement-unit-code').keydown( function(e){ return WidgetMeasure.redirect_enter_measure(e, widget_name); } );
		$('#edit-' + widget_name + '-new-subwidget-measurement-unit-code').keyup( function(e){ return WidgetMeasure.redirect_enter_measure(e, widget_name); } );
}

/**
 *  Attach listeners to all widgets
 */
WidgetMeasure.attach_all_measure = function() {
	for (var index in Drupal.settings.widget.measurenames ) {
  		widget_name = Drupal.settings.widget.measurenames[index];
//  		if ( widget_name == 'widgetam1' ){
    		  WidgetMeasure.attach_widget_measure( widget_name );
//    		}
  	}
}

if( Drupal.jsEnabled ) {
	$(document).ready(WidgetMeasure.attach_all_measure);
}
