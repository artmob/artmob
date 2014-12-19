
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
	// FIRST LEVEL PROTOTYPING
	// Set first-level prototypes for work types. 
	// Note: Javascript objects can't be copied, especially complex ones with deep recursions.
	// Thus the prototypes below are for reference only.  They must be copied in code as part of any menu object.
	
	
	
	function fairdealing_create_work_prototype() {
	
		var menugenerator = new menuproto;
	
		// A – Literary works
		
		menugenerator.setOptions("Aa",["Ca","Da","Db","Dc","Dd","De","Df","Dg","Dh","Di"]); // Literary Works
		menugenerator.setOptions("Ab",["Aa","Bb","Ca","Da","Db","Dc","Dd","De","Df","Dg","Dh","Di"]); // literary compilations
		
		
		// B – Dramatic works
		
		menugenerator.setOptions("Ba",["Ab","Ca","Ea"]); // choreographed work
		menugenerator.setOptions("Bb",["Ab","Ca","Cb","Cc"]); // play, script, screenplay
		menugenerator.setOptions("Bc",["Aa","Ab","Ba","Bb","Bd","Cb","Cc","Da","Db","Dc","Dd","De","Df","Dg","Dh","Di","Ea"]); // film
		menugenerator.setOptions("Bd",["Ba","Bb","Bc","Cb","Cc","Da","Db","Dc","Dh","Di"]); // dramatic compilation
		
		
		// C – Musical Works
		
		menugenerator.setOptions("Ca",["Ab"]); // musical composition
		menugenerator.setOptions("Cb",["Ca","Cc","Ea"]); // musical recording
		menugenerator.setOptions("Cc",["Ab","Ca","Cb","Da","Db","Dc","Di","Ea"]); // musical compilation
		
		
		// D – Visual Artistic Works
		
		menugenerator.setOptions("Da",["Db","Dc","Dd","De","Df","Dg","Di","Ea"]); // photographs
		menugenerator.setOptions("Db",["Da","De","Df"]); // painting
		menugenerator.setOptions("Dc",["De","Df"]); // drawing
		menugenerator.setOptions("Dd",["Df","Dg"]); // engraving
		menugenerator.setOptions("De",["Da","Df"]); // sculpture
		menugenerator.setOptions("Df",["Dg"]); // architectural work
		menugenerator.setOptions("Dg",["Df"]); // map, plan or chart
		menugenerator.setOptions("Dh",["Da","Db","Dc","Dd","De","Df","Dg","Di"]); // artistic compilation
		menugenerator.setOptions("Di",[])  // design, terminal option?
		
		
		// E - Performance Works 
		
		menugenerator.setOptions("Ea",["Aa","Ab","Ba","Bb","Bc","Ca","Cb","Cc"]); // performance work	
	
		return menugenerator;
	}
	
	var menugenerator = fairdealing_create_work_prototype();
	
	// audio file type

	var audiomenu = new menu('audiomenu');
	audiomenu.setOptions("Bc,Cb,Cc,Ea"); // options for audio

	var audioBc = menugenerator.makeMenu('Bc','audioBc'); // options for Film
	audiomenu.addBranch('Bc',audioBc);
	
	var audioCb = menugenerator.makeMenu('Cb','audioCb',4); //options for musical recording
	audiomenu.addBranch('Cb',audioCb);
	
	var audioCc = menugenerator.makeMenu('Cc','audioCc',4); // options for musical compilation
	audiomenu.addBranch('Cc',audioCc);
	
	var audioEa = menugenerator.makeMenu('Ea','audioEa'); // options for performance
	audiomenu.addBranch('Ea',audioEa);
	
	//console.log(audiomenu);
	

	// document file type
	
	var documentmenu = new menu('documentmenu');
	documentmenu.setOptions("Aa,Ab,Ba,Bb,Bd,Ca,Cc,Da,Db,Dc,Dd,Df,Dg,Dh,Di"); // options for documents
	
	var documentAa = menugenerator.makeMenu('Aa','documentAa'); // options for literary works
	documentmenu.addBranch('Aa',documentAa);

	var documentAb = menugenerator.makeMenu('Ab','documentAb',4); // options for literary compilations
	documentmenu.addBranch("Ab",documentAb);

	var documentBa = menugenerator.makeMenu('Ba','documentBa'); // options for choreographed works
	documentmenu.addBranch("Ba",documentBa);

	var documentBb = menugenerator.makeMenu('Bb','documentBb');
	documentmenu.addBranch("Bb",documentBb);
	
	var documentBd = menugenerator.makeMenu('Bd','documentBd');
	documentmenu.addBranch("Bd",documentBd);
	
	var documentCa = menugenerator.makeMenu('Ca','documentCa');
	documentmenu.addBranch("Ca",documentCa);
	
	var documentCc = menugenerator.makeMenu('Cc','documentCc');
	documentmenu.addBranch("Cc",documentCc);
	
	var documentDa = menugenerator.makeMenu('Da','documentDa');
	documentmenu.addBranch("Da",documentDa);

	var documentDb = menugenerator.makeMenu('Db','documentDb');
	documentmenu.addBranch("Db",documentDb);
	
	var documentDc = menugenerator.makeMenu('Dc','documentDc');
	documentmenu.addBranch("Dc",documentDc);
	
	var documentDd = menugenerator.makeMenu('Dd','documentDd');
	documentmenu.addBranch("Dd",documentDd);

	var documentDe = menugenerator.makeMenu('De','documentDe');
	documentmenu.addBranch("De",documentDe);
	
	var documentDf = menugenerator.makeMenu('Df','documentDf');
	documentmenu.addBranch("Df",documentDf);

	var documentDg = menugenerator.makeMenu('Dg','documentDg');
	documentmenu.addBranch("Dg",documentDg);
	
	var documentDh = menugenerator.makeMenu('Dh','documentDh');
	documentmenu.addBranch("Dh",documentDh);
	
	var documentDi = menugenerator.makeMenu('Di','documentDi');
	documentmenu.addBranch("Di",documentDi);

	// video file type

	var videomenu = new menu('videomenu');
	videomenu.setOptions("Bc,Cb,Cc,Ea"); // options for videos
	
	var videoBc = menugenerator.makeMenu('Bc','videoBc');
	videomenu.addBranch('Bc',videoBc);
	
	var videoCb = menugenerator.makeMenu('Cb','videoCb');
	videomenu.addBranch('Cb',videoCb);
	
	var videoCc = menugenerator.makeMenu('Cc','videoCc');
	videomenu.addBranch('Cc',videoCc);
	
	var videoEa = menugenerator.makeMenu('Ea','videoEa');
	videomenu.addBranch('Ea',videoEa);
	
	
	// still image file type

	var imagemenu = new menu('imagemenu');
	imagemenu.setOptions("Da,Db,Dc,Dd,De,Df,Dg,Dh,Di"); // options for images
	
	var imageDa = menugenerator.makeMenu('Da','imageDa');
	imagemenu.addBranch("Da",imageDa);

	var imageDb = menugenerator.makeMenu('Db','imageDb');
	imagemenu.addBranch("Db",imageDb);
	
	var imageDc = menugenerator.makeMenu('Dc','imageDc');
	imagemenu.addBranch("Dc",imageDc);
	
	var imageDd = menugenerator.makeMenu('Dd','imageDd');
	imagemenu.addBranch("Dd",imageDd);

	var imageDe = menugenerator.makeMenu('De','imageDe');
	imagemenu.addBranch("De",imageDe);
	
	var imageDf = menugenerator.makeMenu('Df','imageDf');
	imagemenu.addBranch("Df",imageDf);

	var imageDg = menugenerator.makeMenu('Dg','imageDg');
	imagemenu.addBranch("Dg",imageDg);
	
	var imageDh = menugenerator.makeMenu('Dh','imageDh');
	imagemenu.addBranch("Dh",imageDh);
	
	var imageDi = menugenerator.makeMenu('Di','imageDi');
	imagemenu.addBranch("Di",imageDi);


jQ14(document).ajaxError(function(e, xhr, settings, exception) {
  if (debug==true) {
    alert('Troubleshooting info: ' + settings.url + ' \n'+'error:\n' + exception);
  }
});
	
jQ14('document').ready(function() {	
	
	// Initialize.
	
	if (typeof Drupal.settings.afd != 'undefined') {	
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
			ffaddnewcontributor = Drupal.settings.afd.ffaddnewcontributor;
			emptytitleplaceholder = Drupal.settings.afd.artmob_empty_title_placeholder
			
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
	}	
});