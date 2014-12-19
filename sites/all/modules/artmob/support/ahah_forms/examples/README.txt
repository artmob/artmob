Examples that show how to use the AHAH Forms Framework

poll.module-example
	To use this module: 
		Copy it to drupal/modules/poll directory 
		Make a backup of poll.module
		Rename poll.module-example to poll.module
		(Note: converted to secure get_*_dynamic_subform)

views_ui.module-example	
	To use this module: 
		Copy it to drupal/sites/all/modules/views directory (or where ever you saved views to)
		Make a backup of views-ui.module
		Rename views_ui.module-example to views_ui.module

todo
	Clean example of how to create a dynamic list of elements, using secure subform generators: 
	ahah_forms_embedded_dynamic_subform & ahah_forms_prepped_dynamic_subform

widget
	The widget module is an example of a field element created using the AHAH Forms Framework. 
	You can add it multiple times to the same form.  test.module is an example node type that uses it.
	Just enable both modules, and then create a new test content type.
	(Note: still uses old, insecure $_POST access)
	
simple
	this may be the simplest possible example of how ahah_views can work.