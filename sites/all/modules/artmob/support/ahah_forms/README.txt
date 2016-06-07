The Ahah Forms module is a utility framework for adding Ajax/javascript driven incremental page reloading to forms, without actually needing to write javascript.
It uses the FormAPI and a new property, #ahah_binding, to generate the javascript & jQuery bindings for you.

Ahah vs Ajax:
AHAH (Asynchronous HTTP And HTML) not AJAX (Asynchronous Javascript And XML), because there is no XML involved. 

How to use the #ahah_binding property: 
There are two places to use this property.

#1) Attached to an existing form element. ex:
	$subform['new_choice']['add_choice_button'] = array (
	    '#type' => 'button',
	    '#value' => t( 'Add New Choice' ),
	    '#id' => 'poll_add_choice_button', 
	    '#ahah_bindings' => array ( 
    		array( 
		    	'wrapper' => 'poll_choices_wrapper',
	 			'event' => 'click',
	  			'path' => 'poll/poll_update_js',
  			),
  		),
	);

#2) Attached to a wrapper, to bind to a dynamic set of elements, which do not exist when the page is first rendered. ex:
	// establish the choices wrapper
  	$form['choices'] = array (
  		'#type' => 'fieldset',
  		'#title' => 'Choices',
	    '#prefix' => '<div id="poll_choices_wrapper">',
	    '#suffix' => '</div>',
	    '#ahah_bindings' => array( 
	    	array (
	    		'selector' => 'input.poll_choice_remove',
	    		'event' => 'click',
	    		'wrapper' => 'poll_choices_wrapper',
	  			'path' => 'poll/poll_update_js',
	    	),
	    	array (
	    		'selector' => 'select.poll_choice_weight',
	    		'event' => 'change',
	    		'wrapper' => 'poll_choices_wrapper',
	  			'path' => 'poll/poll_update_js',
	    	),
	    ),	    	
	);

In both cases most of the sub-parameters are the same:
	'event' - javascript event - click and change are the only two currently supported
	'wrapper' - the area that will be replaced when the event occurs. It is currently assumed that the element is inside this wrapper.
	'path' - the Drupal system path to call to get the updated html to put into the wrapper
	'selector' (optional) - the class of form elements to bind to.  If this is missing, the element's id is used.
	'params' (optional) - an array of parameters to pass back to the path.
	
Limitations: 
	Currently only works with Clean URL's enabled

New dynamic subform functions:

ahah_forms_get_embedded_dynamic_subform($form_id, $subform_id, ...) is for use inside of the master form declaration and returns a simple form array.
ahah_forms_get_prepped_dynamic_subform($form_id, $subform_id, ...) is for direct access and returns a prepped and validated  form array, ready to be rendered into html by drupal_render.

Both functions emulate the #multistep trick, using the arguments cached in the session to sanitize $_POST values.  The subform function: poll_choices_subform($node, $form_values=null, $pass=null), can rely on the $form_values array having been sanitized before it is handed in to it.

Limitations:
	These functions will not work if the subform is embedded in a form that has #multistep=true.	
