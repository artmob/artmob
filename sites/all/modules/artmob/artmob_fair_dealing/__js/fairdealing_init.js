
// POPULATE MENUS

/* Basic Syntax for building menu branches. 

	- var testmenu = new menu('testmenu');  // creates a menu.  the menu should be provided with a unique name.
	- testmenu.setOptions("Aa,Ab,Bb,Ca"); // setOptions selects the options as outlined in the "works" object above
	- testmenu.setAllOptions(); // sets all options
	- testmenu.buildMenu();  // builds out the menu with set options;
	- testmenu.buildMenu(true);  // includes disabled options for reference;
	
	Branching Syntax.  Added the ability to attach a series of submenu branches to any menu. Note that this structure allows for infinite nesting.
	
	- var parentmenu = new menu('parentmenu'); // create parent menu
	- var submenu = new menu('submenu'); // create submenu
	- parentmenu.setOptions("Aa,Ab,Bb,Ca"); // set parent options
	- submenu.setOptions("Bb,Cb"); // set submenu options
	- parentmenu.addBranch("Aa",submenu); // attach as branch of one parent option.  menus should be attached for all parent options, if applicable.
	- parentmenu.buildBranch("Aa"); // Will build the submenu.  Soon to be attached to dynamic functionality.


	Additional Notes:

	// notation for submenus: e.g. 12Aa indicates 1=document; 2=second tier (i.e. child menu); A=Literary Works category; a=literary work
	
	// first digit indicates file type because submenu options will not necessarily be the same every time, it will depend on the cascading of works
	
*/
	// document file type
	
	var documentmenu = new menu('documentmenu');
	documentmenu.setOptions("Aa,Ab,Ba,Bb,Ca,Df,Dg,Dh,Di"); // options for documents
	
	var tier12Aa = new menu('tier12Aa'); // options for literary works
	tier12Aa.setOptions("Da,Db,Dc,Dd,Dg");

	var tier12Ab = new menu('tier12Ab'); // options for literary compilations
	tier12Ab.setOptions("Aa,Bb,Da,Db,Dc,Dd,Dg");

	var tier12Ba = new menu('tier12Ba'); // options for choreographed works
	tier12Ba.setOptions("Da,Dc,Dg");

	var tier12Bb = new menu('tier12Bb'); // options for play/script/screenplay
	tier12Bb.setOptions("Aa,Da,Dc,Dg");

	var tier12Ca = new menu('tier12Ca'); // no options needed for musical composition
	//tier12Ca.setOptions(""); // leave empty or remove altogether?

	var tier12Df = new menu('tier12Df'); // no options needed for document of architectural work
	//tier12Df.setOptions(""); // leave empty or remove altogether?

	var tier12Dg = new menu('tier12Dg'); // no options needed for map/plan/chart
	//tier12Dg.setOptions(""); // leave empty or remove altogether?

	var tier12Dh = new menu('tier12Dh'); // options for artistic compilation
	tier12Dh.setOptions("Aa,Da,Db,Dc,Dd,De,Df");

	var tier12Di = new menu('tier12Di'); // no options needed for design
	//tier12Di.setOptions(""); // leave empty or remove altogether?
	
	// if a specific option is selected, display appropriate tier and show user likely options for nested works
	
	documentmenu.addBranch('Aa',tier12Aa);
	documentmenu.addBranch('Ab',tier12Ab);
	documentmenu.addBranch('Ba',tier12Ba);
	documentmenu.addBranch('Bb',tier12Bb);
//	documentmenu.addBranch('Ca',tier12Ca);
//	documentmenu.addBranch('Df',tier12Df);
//	documentmenu.addBranch('Dg',tier12Dg);
	documentmenu.addBranch('Dh',tier12Dh);
	//documentmenu.addBranch('Di',tier12Di);

	tier12Ab.addBranch('Aa',tier12Aa);  // add same branches as literary works to literary compilations > literary works

	// video file type

	var videomenu = new menu('videomenu');
	videomenu.setOptions("Bc,Cb,Cc,Ea"); // options for videos
	
	var tier22Bc = new menu('tier22Bc'); // options for film
	tier22Bc.setOptions("Cb,Cc,Da,Db,Dc,Dd,De,Df,Di,Ea");
	
	var tier22Cb = new menu('tier22Cb'); //options for musical recording
	tier22Cb.setOptions("Ea");
	
	var tier22Cc = new menu('tier22Cc');
	tier22Cc.setOptions("Ea"); //options for musical broadcast
	
	var tier22Ea = new menu('tier22Ea');
	tier22Ea.setOptions("Aa,Ba,Bb,Ca"); //options for performance
	
	videomenu.addBranch('Bc',tier22Bc);
	videomenu.addBranch('Cb',tier22Cb);
	videomenu.addBranch('Cc',tier22Cc);
	videomenu.addBranch('Ea',tier22Ea);
	
	
	// still image file type

	var imagemenu = new menu('imagemenu');
	imagemenu.setOptions("Da,Db,Dc,Dd,De,Df,Dg,Di"); // options for images
	// don't believe any nesting is needed for images, based on discussion, but will test
	
	var tier32Da = new menu('tier32Da');
	tier32Da.setOptions("Db,Dc,Dd,De,Df");
	imagemenu.addBranch('Da',tier32Da);
	
	// audio file type

	var audiomenu = new menu('audiomenu');
	audiomenu.setOptions("Cb,Cc,Ea"); // options for audio
	
	var tier42Cb = new menu('tier42Cb'); //options for musical recording
	tier42Cb.setOptions("Ea");
	
	var tier42Cc = new menu('tier42Cc');
	tier42Cc.setOptions("Ea"); //options for musical broadcast
	
	var tier42Ea = new menu('tier42Ea');
	tier42Ea.setOptions("Aa,Bb,Ca"); //options for performance
	
	audiomenu.addBranch('Cb',tier42Cb);
	audiomenu.addBranch('Cc',tier42Cc);
	audiomenu.addBranch('Ea',tier42Ea);

jQ14(document).ajaxError(function(e, xhr, settings, exception) {
  if (debug==true) {
    alert('Troubleshooting info: ' + settings.url + ' \n'+'error:\n' + exception);
  }
});
	
jQ14('document').ready(function() {	
	
	// Initialize.
	
	//jQ14(wrapping_box).html("<h3>Choose a file type</h3>");
	if (Drupal.settings.afd.filetype != null) {
			
		// load settings and themes into global variables
		
		cid = Drupal.settings.afd.cid;
		worksmodel = Drupal.settings.afd.worksmodel;
		worksmenumodel = Drupal.settings.afd.worksmenumodel;
		addworkmodel = Drupal.settings.afd.addworkmodel;
		nonestedworks = Drupal.settings.afd.nonestedworks;
		ffcontributors = Drupal.settings.afd.ffcontributors;
		ffinfofields = Drupal.settings.afd.ffinfofields;
		datewidget = Drupal.settings.afd.datewidget;
		
		existingreport = jQ14.parseJSON(Drupal.settings.afd.existingreport);
		var reverted = get_cookie("revert_clicked");
  		if (reverted == "true")
		{
			var cook = get_cookie("initial_report");
			eraseCookie("revert_clicked");
			existingreport = jQ14.parseJSON(cook);
			jQ14("#errorinfo").html("Your changes have been reverted to the last valid state");
  			jQ14("#errortext").show();
		}
		//var contributors = menuGetContributors();
		
		menuBuildFirstCollection(Drupal.settings.afd.filetype);
		
		var has_levels = false;
		if (existingreport.works[1] != undefined){
			has_levels = true;
			existing_report = true;
		}
		
		if (existingreport != null) {
			//alert(dump(existingreport));
			afd_build_attributions(existingreport,has_levels);
		} 			

		jQ14('.nested-works .close a').each(function() { // set "closed" as the intiial state for nested works
			jQ14(this).trigger('click');
		});
	}
});