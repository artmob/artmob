  /* menuproto creates a new menu object with a given set of options. options are keyed to work types. */
  
  var menuproto = function() {
  	this.options = new Object;
  }
	
	menuproto.prototype.makeMenu = function(key,name) { // depth is optional 3rd argument
		var o = new menu(name);
		
		var depth = arguments.length > 2 ? arguments[2] : 4;  // default depth.  pass in a depth of 0 to prevent options being set.
		
		if (typeof this.options[key] != "undefined") {
			var options = this.options[key]
			
			if (depth > 0) {
				o.setOptions(options);
			}
									
			if (depth > 1) {  // add branches recursively
					for (opt in options) {
						var newname = name + options[opt];
						var ro = fairdealing_create_work_prototype(); // ro is a loaded menuproto object
						o.addBranch(options[opt],ro.makeMenu(options[opt],newname,(depth-1)));
					}
			}
			
		}
		
		return (o);
	}
	
	menuproto.prototype.setOptions = function(key,options) {
		this.options[key] = options;
	}


  var menu = function(name) {   // object to create nested attribution menus
    this.name = name;
    this.id = '';
  };
  
  menu.fields = fields;

  menu.prototype.setOptions = function( optionstr ) {
    var menuoptions;
    var oparray;
    var options = new Array();

    // create option array;  form: options.A = array("a","c","e") 
    
    if (typeof(optionstr) == 'string') {
      oparray = optionstr.split(',');  //seems to be returning a string, so that oparray = optionstr.  weird.
      
    } else if (typeof (optionstr) == 'object') { // presume array
    	oparray = optionstr;
    }
    
    for(var i=0;i<oparray.length;i++) {
			worktype = oparray[i].substr(0,1);
 
			if (!options[worktype]) {
				options[worktype] = new Array();
			}
							
			var key = oparray[i].substr(1,2);
			var value = works[worktype].values[key];
			options[worktype][key] = value;
    } 
          
    this.options = options;
  }
  
  menu.prototype.newName = function(name) {
    this.name = name;
  	//  this.id = '';
  
  	// currently only renames one level deep.  make recursive.
  	
    if (typeof this.tree != "undefined") {
    	for (branch in this.tree) {
    		var branchname = name + 'Branch' + branch;
    		this.tree[branch].name = branchname;    	
    	}
    }
  }   
  
  menu.prototype.setAllOptions = function() {
      
    var options = '';
    
    for (menu in works) {
      for (menukey in works[menu].values) {
        options += menu + menukey + ",";
      }
    }
    
    options = options.substring(0,options.length-1); // remove final comma;
    
    this.setOptions(options);   
  }
  
  menu.prototype.addBranch = function(branch,menuobj) {
  
    if (this.tree == undefined) {
      this.tree = new Object
    }
    
    if (this.tree[branch]) {
    //	console.log('no thanks i already got one ' + branch);
    }
    
    //eval("this.tree." + branch + "= menuobj");
    
    this.tree[branch] = menuobj;
    
  }
  
  menu.prototype.getBranch = function (branch) {
    
    if (this.tree == undefined || this.tree[branch] == undefined || this.tree[branch].options == undefined) {
      //alert ("DEBUG: " + this.name + " branch " + branch + " has no value.  Check source code.");
      return undefined;
    } else {
      return this.tree[branch];
    }
  }
  
  
  menu.prototype.buildBranch = function(branch,displayall) {
    if (this.tree && this.tree[branch]) {
      var submenu = this.tree[branch];
      return submenu.buildMenu(displayall);
    }
  }
  
  menu.prototype.buildMenu = function(displayall) {
  
    var element = '';
    var name = this.name;// + '-' + this.id;
    var opts = menuBuildNestedWorksOptions(this.options,displayall);
    
    element += "<form class='form-" + name +"'>";
    element += "<div class='" + name + " worksmenu'>";
    element += "<select class='worksmenuoption'>";
    element += opts;
    element += "</select>";
    element += "</div>";
    element += "</form>";

    return(element);
  }  
  
  menu.prototype.buildContributorFields = function(worktype,key,idcounter,parent,sequence,iteration) {  // DEPRECATED.
  //  return menuBuildRoles(worktype,key,idcounter,parent,sequence,iteration) ;
  }
  
  menu.prototype.buildKeyFields = function(worktype,key,idcounter,parent,sequence,iteration) {  // DEPRECATED
  //  return menuBuildKeyFields(worktype,key,idcounter,parent,sequence,iteration);
  }
  
function menuBuildNestedWorksOptions(options,displayall) {
		var output;
    var i = 0;
    
    for (property in works) {
      
        if (works[property]) {
          if (options[property] || displayall == true) {
            var optionshtml = '';
            
          	if (i == 0) {
            	optionshtml += "<option label = 'Select a type of Work' value='NULL'><strong>Select a type of work</strong></option>";
            	optionshtml += "<option label = ' ' value='NULL'>&nbsp;</option>";
            	i++;
          	} else {
            	optionshtml = "<option label = ' ' value='NULL'>&nbsp;</option>";
          	}
            optionshtml    += "<option label = '" + works[property].type + "' value='NULL'><em>" + works[property].type + " (Select from options below)</em></option>";
          }
          
          for (op in works[property].values) {
  
            if (options[property] && options[property][op]) {
              optionshtml += "<option label = '" + works[property].values[op] + "' value='" + property + op + "'>&nbsp;&nbsp;" + works[property].values[op] + "</option>";
            } else if (displayall == true) {
              optionshtml += "<option disabled='true' label = '   " + works[property].values[op] + "' value='" + op + "'>&nbsp;&nbsp;" + works[property].values[op] + "</option>";
            }
          }
          
          if (options[property] || displayall == true) {
            output += optionshtml;
          }
          
          
          
        }
    }
    
    if (i == 0) {
	    return null; // no nested work options
    } else {
    	return output;
    }

}
  

function menuDestroyCollection (parent,sequence) {  
  // deprecated
  // doesn't work as expected. removes collection when user makes another selection, but doesn't replace with new option.  investigate.
  // collections must have a unique parent-sequence combination. 
  
  var id = parent.toString() + '-' + sequence.toString();
  
  jQ14('.identifier').each(function() {
    if (jQ14(this).html() == id) {
      //jQ14(this).parent().wrap("<div class='collection' />"); // need container for subsequent population.  no?
      //jQ14(this).parent().remove();  // commented for now.
    }
  });
}

/* menuBuildWorkShellWithIdentifiers
	 Function creates a new work in a hidden processing container,
	 and adds identifiers
	 
	 Return values are:
	 		workid:  the ID of the placed DOM object
	 		html: the corresponding html
	 		ids: the associated identifiers object (id, parent, sequence) 		
*/

function menuBuildWorkShellWithIdentifiers(locationid) {
	var workid;
	var processing_container = jQ14('#processing');
	processing_container.html(worksmodel);
	var ids = menuGetIds(locationid);
	var parent = ids.parent;
	if (isNaN(ids.id))
		ids.id = 1;
	workid = 'work-' + ids.id;
	processing_container.find('> .work').attr('id',workid);
	var html = processing_container.html();
	processing_container.html(''); 
	
	var addworks = jQ14("#" + locationid + ' > .additional-work');
	if (addworks.length > 0) {
		addworks.before(html);
	} else {
		jQ14('#' + locationid).append(html);
	}
  jQ14('#' + workid + " .identifiers").html(menuBuildIdentifiers(ids));  
	
	return ({
		workid : workid,
		html : html,
		ids : ids
	});
	
}

function menuChangeCollection(menuobj,workid,branch) {	
  
  errormsgs = [];
  //alert(dump(branch));
  var thiswork = jQ14('#' + workid);
  var worktype = menuobj.val();
  var workmaintype = worktype.slice(0,1);
	var worksubtype = worktype.slice(1,2);
	
	var validkeyroles = works[workmaintype].keyroles[worksubtype];
	var validotherroles = works[workmaintype].otherroles[worksubtype];
	var validroles = validkeyroles.concat(validotherroles);
	
	var validkeyfields = works[workmaintype].keyfields[worksubtype];
	var validotherfields = works[workmaintype].otherfields[worksubtype];
	var validfields = validkeyfields.concat(validotherfields);
		
	var typelabel = works[workmaintype].values[worksubtype];
	var titlelabel = thiswork.find('> .banner .banner-title').html();
  
  var infosection = thiswork.find('> .innerwork > .info');
  
  var contributors = infosection.find('.keyroles .cvalues');
  var historicalinfo = infosection.find('.keyfields .cvalues');
  
  var nestedworks = thiswork.find('> .innerwork > .nested-works > .work');
  var thismenu = thiswork.find('> .innerwork > .menu');
  var hasnested = false;
  var nestedbranch;
  if (typeof branch.tree != "undefined") {
  	 if (typeof branch.tree[worktype] != "undefined") {
			 nestedbranch = branch.tree[worktype];
			 hasnested = true;
			 var nestedoptions = nestedbranch.options;
			 var validoptions = new Array;
		 
			 for (option in nestedoptions) {
				 for (subtype in nestedoptions[option]) {
					 validoptions.push(option + subtype);
				 }
			 } 
		 } 	
  }
  
  
        
	menuBuildNested(menuobj,workid,branch);
	
	
	// rebuild existing role menus with new values and validate contributors section
		
	contributors.each(function() {
	  var select = jQ14(this).find('.select-crole');		
  	//var cid = select.attr('id');
  	
  	// store original role value
  	var originalvalue = select.val();
  	  	
  	// rebuild contributor options
  	select.html(menuBuildContributorRoleOptions(worktype));
  	
		if (jQ14.inArray(originalvalue, validroles) == -1 && originalvalue != '') { // validation failure
			select.addClass('invalid');
			errormsgs.push(titlelabel + ': ' + contributor_roles[originalvalue] + ' is not a valid contributor type for a ' + typelabel);
			
			// append value and select
			select
				.append("<option value=''>  </option>\n")
				.append("<option value=''>Invalid Option</option>\n")
				.append("<option value= '' ><em>-------------------</em></option>\n")
				.append('<option value="' + originalvalue + '">' + contributor_roles[originalvalue] +'</option>');
		} else {
			select.removeClass('invalid');
		}
		
		select.bind('change',function() {   // unflag field after user changes to valid entry
				var thisselect = jQ14(this);
				if (jQ14.inArray(thisselect.val(), validroles) == -1 ) {
					thisselect.addClass('invalid');
				} else {
					thisselect.removeClass('invalid');
				}
		});
		
		if (originalvalue != '')
			select.val(originalvalue);
	});
	
	historicalinfo.each(function() {
	  var select = jQ14(this).find('.select-cfield');		
  	//var cid = select.attr('id');
  	
  	// store original info value
  	var originalvalue = select.val();
  	
  	// rebuild contributor options
  	select.html(menuBuildInfoFieldOptions(worktype));
  	
		if (jQ14.inArray(originalvalue, validfields) == -1 && originalvalue != "" ) { // validation failure
			select.addClass('invalid');
			errormsgs.push(titlelabel + ': ' + fields[originalvalue].label + ' is not a valid information type for a ' + typelabel);
			
			// append value and select
			select
				.append("<option value=''>  </option>\n")
				.append("<option value=''>Invalid Option</option>\n")
				.append("<option value= '' ><em>-------------------</em></option>\n")
				.append('<option value="' + originalvalue + '">' + fields[originalvalue].label +'</option>');
		} else {
			select.removeClass('invalid');
		}
		
		select.bind('change',function() {   // unflag field after user changes to valid entry
				var thisselect = jQ14(this);
				if (jQ14.inArray(thisselect.val(), validfields) == -1) {
					thisselect.addClass('invalid');
				} else {
					thisselect.removeClass('invalid');
				}
		});
		if (originalvalue != '')
			select.val(originalvalue);
		
	});
		
	var entries = new Array;
	
	nestedworks.each(function() {
		var thisnestedwork = jQ14(this);
		
		//			var menu_prev = '#menu-' + parent + '-' + sequence + ' select';

		
		var parent = thisnestedwork.find('> .identifiers .parent').html();
		var sequence = thisnestedwork.find('> .identifiers .sequence').html();
		var worksmenu = jQ14('#menu-' + parent + '-' + sequence);
		var thisform = worksmenu.find('form');
		var select = worksmenu.find('select');
		var originalvalue = select.val();
		var thistitlelabel = thisnestedwork.find('> .banner .banner-title').html();

		if (hasnested) {
			var nestopt = menuBuildNestedWorksOptions(nestedbranch.options,false);

			if (jQ14.inArray(originalvalue,validoptions) == -1 && originalvalue != null) {  // current option is invalid
				var thisworkmain = originalvalue.slice(0,1);
				var thisworksub = originalvalue.slice(1,2);
				var label = works[thisworkmain].values[thisworksub];
								
				thisnestedwork.addClass('invalid');
				errormsgs.push(titlelabel + ': ' + label + " is not a valid type of contained work for your selection.");
				select
					.addClass('invalid')
					.append("<option value=''>  </option>\n")
					.append("<option value=''>Invalid Option</option>\n")
					.append("<option value= '' ><em>-------------------</em></option>\n")
					.append('<option value="' + originalvalue + '">' + label + '</option>');
			} else {
					select.removeClass('invalid').removeAttr('disabled');
					thisnestedwork.removeClass('invalid');
			}
										
		select.val(originalvalue);
		
		} else {  // all options are invalid
				entries.push(thistitlelabel);
				select
					.addClass('invalid')
					.attr('disabled','disabled');
				thisnestedwork.addClass('invalid');

		}	
		
		select.bind('change',function() {   // unflag field after user changes to valid entry
				var thisselect = jQ14(this);
				if (jQ14.inArray(thisselect.val(), validoptions) == -1) {
					thisselect.addClass('invalid');
				} else {
					thisselect.removeClass('invalid').removeAttr('disabled');
				}
		});	
	});
	
	if (nestedworks.length == 0) { // no existing works that need validation.   must still change the nested work selection to reflect new branch
			
			// add nonested class if new selection is a terminal branch
			if (nestedbranch.tree != undefined) {
				thismenu
					.removeClass('nonested')
					.addClass('hasnested');
			} else {
				thismenu
					.removeClass('hasnested')
					.addClass('nonested');
			}

			var firstselect = thiswork.find('> .innerwork > .menu select');
			var firstnestopt = menuBuildNestedWorksOptions(nestedbranch.options,false);
			firstselect
			.html(firstnestopt)
			.unbind('change')
			.bind('change',function() {
				var value = jQ14(this).val();
				if (jQ14(this).val() == "NULL")
					return;
				var target = workid + ' > .innerwork > .nested-works';
				var newid = menuBuildCollection(branch.getBranch(value),target,'nest');
				jQ14(this)
					.unbind('change')
					.bind('change',function() {
						if (jQ14(this).val() == "NULL")
							return;
							//store_report(true,false);	
							menuChangeCollection(jQ14(this),newid,branch);
							// checkNestedValues();
				});
			});
	}
	
	
	if (hasnested == false && nestedworks.length > 0) { // only trigger this error once.
		errormsgs.push(titlelabel + ': This selection has no options to contain other works.  Please select another, or lose the information contained in the following entries when you press save: ' + entries.join(', '));
	}
	
	
	menuTriggerInvalidAlert();
}

function menuTriggerInvalidAlert() {
	if (jQ14('.invalid').length > 0 && errormsgs.length > 0) {
		// trigger better alert, e.g. like glossary
		
		var output = 
		"Modify your selection by choosing a different option from the dropdown menu(s) framed in red. For clarification, please see the contextual help that accompanies the available options for adding nested works.\n\nError messages:\n\n";
		for (var i=0; i<errormsgs.length; i++) {
			output += errormsgs[i] + "\n\n";
		}
		
		alert (output);
	}
}

function  menuBuildFirstCollection(filetype) {
  var ft = filetypes[filetype];
  var menuname = ft["menu"];
  var branch = eval(menuname);
  

  //jQ14('#work-collection-model .parenttypename').html(ft["label"]);
  //jQ14('.worksmenu-model .parenttypename').html(ft["label"]);
  menuBuildCollection(branch,'work-collection-init','first');
  jQ14('#work-collection-init').addClass('filetype-' + ft.type); /* add filetype class to init wrapper */

}

function  menuBuildCollection(branch,locationid,action) {
  
  var shell = menuBuildWorkShellWithIdentifiers(locationid);
  var workid = shell.workid;
  var ids = shell.ids;
  var parent = ids.parent;
  var sequence = ids.sequence;
  var thismenu = jQ14('#' + workid + " .menu");
  
  thismenu.html(worksmenumodel);  // build works menus
  
	var menuid = 'menu-' + ids.id + '-1';
	thismenu.attr('id',menuid);
	
  //if (branch != undefined){
    
  if (branch.tree != undefined) {
    thismenu
    	.append(branch.buildMenu())
    	.removeClass('nonested')
    	.addClass('hasnested');
  } else if (workid == "work-1") {
    jQ14("#"+locationid).html(nonestedworks);      
    jQ14("#"+locationid).show();
	  var start = parseInt(ids.id);
	  var end = start+3;      
	  for (var j=start; j < end; j++)
	    jQ14("#work-"+j).hide();
      return;	
  } else{	  
	  var nextid = parseInt(ids.id)+1;
	  var previd = parseInt(ids.id)-1;
	  thismenu
    	.append(branch.buildMenu())
    	.removeClass('hasnested')
    	.addClass('nonested');
    	
	  //alert("#work-"+ids.parent+" > .innerwork > .nested-works > .additional-work");	 
	  //jQ14(".additional-work").hide();
	  //jQ14("#work-"+ids.parent+" > .innerwork > .nested-works > .additional-work").hide();

	  //var cook = get_cookie("initial_report");
	 // var r = jQ14.parseJSON(cook);
	 // if (r["works"][nextid] != null && r["works"][nextid] != undefined) {
	  //	nonestederror += "<li>This work has no option for nested works. Please press revert to go back to your previous information</li>";
  	//}
  }     
  
  // BIND NESTED WORK TO MENU
   
  if (action == "nest") {
		if (workid != "work-1"){
			var startindex = workid.length-1;
			var endindex = workid.length;
			 //var previd = parseInt(workid.slice(startindex,endindex))-1;
		  //var previd = jQ14('#' + workid + " .identifiers .parent").html();
			//alert("real parent is " + previd);
			//var menu_prev = "#work-"+previd+" .menu .worksmenu select";
			
			var menu_prev = '#menu-' + parent + '-' + sequence + ' select';
 
			jQ14("#"+locationid+" h3").html('');
			menuBuildNested(menu_prev,workid,branch);
			addwork_flag = false;
			jQ14("#"+locationid).show();       
		} else {
			var menu_prev = "#work-" + previd + " .menu .worksmenu select";
		}
  }

	// bind creation of new work to works menu change event
  
  if (workid != "work-1"){
		jQ14('#' + workid + " > .innerwork > .menu .worksmenu select").unbind('change');
		jQ14('#' + workid + " > .innerwork > .menu .worksmenu select").bind('change',function() { 
			if (jQ14(this).val() == "NULL")
				return;
		
			var menuobj = this;
			var value = jQ14(menuobj).val();
			jQ14("#errortext").hide();
			var startindex = workid.length-1;
			var endindex = workid.length;
			var previd = parseInt(workid.slice(startindex,endindex))-1;
			var target = workid + ' > .innerwork > .nested-works';
			//	store_report(true,false);
			var newid = menuBuildCollection(branch.getBranch(value),target,'nest');
						
			// rebind this menu to tie it to the newly created work
			
			jQ14('#' + workid + " > .innerwork > .menu .worksmenu select")
				.unbind('change')
				.bind('change',function() {
					var newvalue = jQ14(this).val();
					if (newvalue == "NULL")
						return;
					//store_report(true,false);	
					//alert(dump(branch));
					menuChangeCollection(jQ14(this),newid,branch);
  			//    checkNestedValues();
			});
			
  //	checkNestedValues();

    });
    
    // create additional works button if it doesn't exist
  
  	var addworksenabled = true;
  	// uncomment line below to disable top-level additional works as per specification
  	// addworksenabled = parent == 0 ? false : true;
    
    var addworks = jQ14("#" + workid).closest('.nested-works').find('.additional-work');
    
    if (addworks.length == 0 && addworksenabled == true) {
        menuCreateAdditionalWork(workid,ids,action);
    }
  }
  
  // store branch information as data in work selection menu
  // branch info can then be retrieved to create sibling works
  jQ14('#' + workid + " .menu").data({branch : branch});

	jQ14('#' + workid + ' > .innerwork .parenttypename').each( function() {
		if (parent == 0) {
			var filetype = Drupal.settings.afd.filetype;
			jQ14(this).html(filetypes[filetype]["label"]);
		} 
		
	});
	
	afd_ui_bindings()
	
	return workid; // returns id of newly created work
}

function menuCreateAdditionalWork(workid,ids,action) {

	// create additional works button

  if (action != 'first') {
     jQ14('#' + workid).after(addworkmodel);
     var wt = "";
     if (parseInt(ids.parent) == 1) {
     	wt = parent_ft["label"];
     } else {
     	var value = jQ14("#work-"+ids.parent+" .identifiers .worktype").html();
     	if (isNaN(value)){
				var worktype = value.substr(0,1);
				var key = value.substr(1,2);
				wt = works[worktype]["values"][key];
     	}
     }
     if (wt != "")
	    jQ14("#"+workid+" ~ .additional-work .parenttypename").html(wt);
	} 

	// bind creation of works menu to click event
	
  jQ14('#' + workid + " ~ .additional-work .add-works-button").bind('click',function() { 
    // need the parent's workid
		var parentid = jQ14('#' + workid + " .identifiers .parent").html();
		var menuname = parent_ft["menu"];
		var parentwork = "work-" + parentid;
		var nested_container = 'work-' + parentid + ' > .innerwork > .nested-works';
	
		
		// if (parseInt(parentid) != 1) {
		//	 prev_branch = prev_branch.getBranch(value); // deprecated.  remove?
		// }
				
		var existing_siblings = jQ14('#work-' + parentid + ' > .innerwork > .nested-works > .work').length;
		var this_sibling = existing_siblings + 1;
		var menuid = 'menu-' + parentid + '-' + this_sibling.toString();
		var selectid  = menuid + ' select';
		
		var topsibling = jQ14('#menu-' + parentid + '-1');
		var nestclass = topsibling.hasClass('hasnested') ? 'hasnested' : 'nonested'; // copy nested work class from first sibling
		
		// get branch information from parent menu
		
		var parentmenu = jQ14('#' + parentwork + " > .innerwork > .menu");
		
		var menudata = parentmenu.data();
		
		// create a copy of the parent menu in the .nested-works container with a sequenced id
		// note that it's id-ed as the next menu of its parent, even though it's in a different location
		
		var menuhtml = parentmenu.html();
		//store_report(true,false);
		
		jQ14('#' + workid + " ~ .additional-work").before("<div class='menu' id='" + menuid + "'>"+ menuhtml + "</div>");
		jQ14('#' + menuid).addClass(nestclass);
		
		jQ14('#' + selectid) 
			.unbind('change')
			.bind('change', function() {
				var value = jQ14(this).val();
				if (value != "NULL") {
					var addnewid = menuBuildCollection(menudata.branch.getBranch(value),nested_container,'nest');
					jQ14('#' + selectid) 
						.unbind('change')
						.bind('change',function() {
						var changedval = jQ14(this).val();
						if ( changedval == "NULL")
							return;	
						//store_report(true,false);	
						menuChangeCollection(jQ14(this),addnewid,menudata.branch.getBranch(changedval));
						//checkNestedValues();
					});
				} else {
					alert('You have selected a group label.  Please select a type of work');
				}
			//checkNestedValues();
		});
		
		//jQ14(this).closest('.additional-work').remove();

		jQ14('#' + workid + " ~ .additional-work .parenttypename").html(wt);
			
			//jQ14('#' + workid + " ~ .additional-work").remove();
			afd_ui_bindings();
		});
}


function menuDisable(locationid) {
	jQ14(locationid + " select").each( function(){
		jQ14(this).addClass("invalid");
	});
}

function menuBuildNested(menuobj,workid,branch) {
  var status =   jQ14('#' + workid + " .menu .worksmenu select").data('changed');
	var value = "";
	
	//if (addwork_flag)
		//value = addwork_worktype;
	 //else
	  value = jQ14(menuobj).val();
	  
    var worktype = value.substr(0,1);
    var key = value.substr(1,2);
    
    var label = works[worktype].values[key];
    var helptext = works[worktype].help[key];
    
//    if (jQ14(menuobj).data('removeinfo') == false) { return false; }
    
    // destroy previous information    
	
    jQ14('#' + workid + " .identifiers .worktype").remove();
    jQ14('#' + workid + " .identifiers .worktype-label").remove();
    jQ14('#' + workid).attr('class',  
           function(i, c){
              return c.replace(/\worktype-\S+/g, '');
           });

	// jQ14('#' + workid + " > .innerwork > .info .keyroles").empty();
	 //jQ14('#' + workid + " > .innerwork > .info .keyfields").empty();
	 
	    jQ14('#' + workid + " > .innerwork  > .title").show();
	    jQ14("#work-1 > .innerwork  > .title").toggle(false);

	
	// add identifiers
    if (workid != "work-1")        
    jQ14('#' + workid + " > .innerwork > .info .parenttypename").html(label);
    jQ14('#' + workid + " > .innerwork > .info").show();
    jQ14('#' + workid + " .identifiers").append("<div class='worktype'>" + value + "</div>");
    jQ14('#' + workid + " .identifiers").append("<div class='worktype-label'>" + label + "</div>");
	
	// add worktype to main work collection
	
	jQ14('#' + workid).addClass('worktype-' + worktype);
	
	//if (workid != "work-1" && jQ14("#"+workid).html() != null){
	//alert("adding menus for workid " + workid +" and id is somehow " + jQ14("#"+workid).html());
	
	// check to see if roles and fields have been built, and add one if they haven't
		
	  if (jQ14('#' + workid + " > .innerwork .keyroles .cvalues").length == 0) {
    	menuAddContributor(jQ14('#' + workid + " > .innerwork > .info"),false); // add first contributor field;
    }
    
	  if (jQ14('#' + workid + " > .innerwork .keyfields .cvalues").length == 0) {
    	menuAddKeyFields(jQ14('#' + workid + " > .innerwork  .info")); // add first info field
    }
	//}
	
	jQ14('#' + workid + " > .innerwork > .info .add-contributor").unbind('click').bind('click',function() {
      var menuobj2 = this;    
      menuAddContributor(jQ14(menuobj2),false);
      afd_ui_bindings();
    });
    
	jQ14('#' + workid + " > .innerwork > .info .add-info").unbind('click').bind('click',function() {
    //  alert('clicking add-f');
      var menuobj2 = this;    
      menuAddKeyFields(jQ14(menuobj2));
      afd_ui_bindings()
    });
    
    
    //jQ14('#' + workid + " > .innerwork > .nested-works .additional-work .parenttypename").html(label);
    if (workid != "work-1")
    jQ14('#' + workid + " .menu .parenttypename").html(label);
    jQ14('#' + workid + " > .innerwork > .nested-works").show()  
    jQ14('#' + workid + " > .innerwork > .nested-works-title").show()  
    
    // add helptext;
    
    jQ14('#' + workid + " > .innerwork > .menu .work-help-text").html(helptext);
    
    afd_ui_bindings()
  /*if (workid != "work-1"){ 
  		var startindex = workid.length-1;
  		var endindex = workid.length;
    	var wid = parseInt(workid.slice(startindex,endindex))+1;
  	    wid = "work-"+wid;
  	   // alert("wid is now " + wid);
        var nestmenu = jQ14("#"+wid+" .menu .worksmenu select").html();
   		//alert("nested menu : " +nestmenu);
   		if (nestbranch != undefined)
          jQ14("#"+workid+" .menu .worksmenu select").html(nestmenu);
  		else{
          jQ14("#"+workid+" .menu .worksmenu select").hide();  		 
  		  jQ14("#"+workid+" .menu .worksmenu-model").hide();
  		}
  }*/

}

function menuGetIds(locationid) {  //fixed  /bk
 // if (locationid != "work-1 > .innerwork > .nested-works"){
  	/*var loc_part = locationid.slice(0,6);
  	var startindex = loc_part.length-1;
  	var endindex = loc_part.length;
    idcounter = parseInt(loc_part.slice(startindex,endindex))+1;*/
 //   idcounter = jQ14(".work").length;
    //alert(idcounter);
 // } else
 // 	idcounter = 2;
  	
  	idcounter = jQ14(".work").length;

  	
  	var parentid = jQ14('#' + locationid).closest('.nested-works').closest('.work').attr('id');
  	parent = jQ14('#' + parentid + " > .identifiers .id").html();
  	if (isNaN(parent))
  	parent = 1;  
  	var sequence = jQ14('#' + locationid).closest('.nested-works').children('.work').length + 1; 
  
  var ids = {
    'id' : idcounter,
    'parent' : (parent != null) ? parent : 0,
    'sequence' : sequence,
  }
  
  //alert (dump(ids));

  return ids; 
}

function menuBuildIdentifiers(ids) {
  var out = 
  "<div class='id' style='display:none'>" + ids.id + "</div>" +
  "<div class='parent' style='display:none'>" + ids.parent + "</div>" +
  "<div class='sequence' style='display:none'>" + ids.sequence + "</div>";
  
  return out;
}

function menuAddKeyFields (o) {
    var id = jQ14(o).closest('.work').attr('id');
  	var startindex = id.length-1;
  	var endindex = id.length;
    var id_index = parseInt(id.slice(startindex,endindex));
		var previd = jQ14('#' + id + " .identifiers .parent").html();
	//alert("previd is " + previd);	
	
		var	value = jQ14("#work-"+ previd +" .menu .worksmenu select option:selected").val();
    
    var workid = jQ14("#" + id + ' > .identifiers .id').html();
    var worktype = null;
    var key = null;
    var parent = jQ14("#" + id + ' > .innerwork > .info .keyfields');
    var sequence = jQ14(parent).children('.cvalues').length + 1;

		var keyfields = fields;
    var otherfields = new Array();
    var hideallfields = false;  // suppresses the addition of all fields after key and other key fields

    if (id != "work-1"){
      worktype = value.substr(0,1);
      key = value.substr(1,1);      
      keyfields = works[worktype].keyfields[key];
      otherfields = works[worktype].otherfields[key];
    } else {
      hideallfields = true;
    }
    
    var pid = '#processing';
    jQ14(pid).html(ffinfofields);  // Add to DOM
    
    var iterationid = workid.toString() + '-' + sequence.toString();
        
    jQ14(pid + ' .cvalues').attr('id',"cvalues-"+ iterationid);
    jQ14(pid + ' .select-cfield')
    	.attr('name',"crole-" + iterationid)
    	.append(menuBuildInfoFieldOptions(value,hideallfields));
    
  	
    jQ14(pid + ' .select-cfield').data('pid',pid); // add DOM id as data in select box for later manipulation.
    jQ14(pid + " .infoval-container").html("<input class='infoval infoval-text' type='text' value='Enter Information' name='info-" + iterationid + "'/>");
            
    jQ14(parent).append(jQ14(pid).html());
        
    jQ14(pid).html(''); // clear processing box
}


function menuBuildInfoFieldOptions(worktype) {
		var keyfields = new Array;
		var otherfields = new Array;
		var allfields = new Array;
		
		for (var field in fields) {
			allfields.push(field);
		}
		
		var hideallfields = arguments[1] == null ? false : arguments[1];

		
		allfields.sort();
		
		if (worktype != null) {
		  var workmaintype = worktype.slice(0,1);
		  var worksubtype = worktype.slice(1,2);
		  keyfields = works[workmaintype].keyfields[worksubtype];
		  otherfields = works[workmaintype].otherfields[worksubtype];
		} else { // work-1:  TO DO, have a filetype-based lookup here
			var fttype = Drupal.settings.afd.filetype;
			keyfields = filetypes[fttype].keyfields;
			otherfields = filetypes[fttype].otherfields;
		}
		
		keyfields.sort(menuInfoFieldSort);
		otherfields.sort(menuInfoFieldSort);
		var output = '';
		
    output += "<option value= '' ><em>Select Info Type</em></option>\n";
    output += "<option value= '' > </option>\n";
    output += "<option value= '' ><em>Key Information</em></option>\n";
    output += "<option value= '' ><em>-------------------</em></option>\n";
    
    for (var field in keyfields) {
      
      var fieldtype = keyfields[field];
      
      if (typeof fields[fieldtype] != "undefined") {
		  	var fieldlabel = fields[fieldtype].label;
		  	output += "<option value= '" + fieldtype + "' >" + fieldlabel + "</option>\n";
		  	
		  	 //remove from allfields Array
		     var index = allfields.indexOf(fieldtype);
		     if (index != -1) allfields.splice(index,1);
      }
    }
    
    if (otherfields.length > 0) {
			output += "<option value=''>  </option>";
			output += "<option value= '' ><em>Additional Information</em></option>\n";
			output += "<option value= '' ><em>-------------------</em></option>\n";
  	}
   
   
    for (var field in otherfields) {

      var fieldtype = otherfields[field];
      var fieldlabel = fields[fieldtype].label;
      
      var showfield = true;
      
      for (var i=0; i<keyfields.length;i++) { // may not be necessary if data is clean
        if (field == keyfields[i]) {
          showfield = false;
        }
      }

      if (showfield == true) {
        output += "<option value= '" + fieldtype + "' >" + fieldlabel + "</option>\n";
      }
      
		  	var index = allfields.indexOf(fieldtype);
		  	if (index != -1) allfields.splice(index,1);
    }
        
    if (allfields.length > 0 && hideallfields == false) {
			output += "<option value=''>  </option>";
			output += "<option value= '' ><em>Other Options</em></option>\n";
			output += "<option value= '' ><em>-------------------</em></option>\n";
			
			for (var field in allfields) {			
				
				var fieldtype = allfields[field];
												
				if (typeof fields[fieldtype] != "undefined") {
					var fieldlabel = fields[fieldtype].label;
					output += "<option value= '" + fieldtype + "' >" + fieldlabel + "</option>\n";
				}
			}
  	}
    
    return output;
		
}

function menuInfoFieldSort(a,b) {
	 var fa = fields[a].label.toLowerCase();
	 var fb = fields[b].label.toLowerCase();			 
	 if (fa < fb) {
		return -1;
	 } else {
		return 1
	 }
	 return 0;
}


  

function menuAddContributor(o,changed) {
    var id = jQ14(o).closest('.work').attr('id');
  	var startindex = id.length-1;
  	var endindex = id.length;
		var previd = jQ14('#' + id + "> .identifiers .parent").html();
		var value = jQ14('#' + id + "> .identifiers .worktype").html(); 			
		var workid = jQ14("#" + id + ' > .identifiers .id').html();
		var worktype = "";
		var key = "";
		var parent = jQ14("#" + id + ' > .innerwork > .info .keyroles');
		var sequence = jQ14(parent).children('.cvalues').length + 1;
		if (changed == true)
			var sequence = jQ14(parent).children('.cvalues').length;
	
		//alert('ID: ' + id);
		
			//alert("sequence is " + sequence + " for workid " + workid);
		if (jQ14(parent).children('#cvalues-'+workid+"-"+sequence).length > 0)
			sequence++;
		//var keyroles = contributor_roles;
		var keyroles = new Array();
		var otherroles = new Array();
		var hideallroles = false;  // suppresses the addition of all roles after key and other key roles
			
			if (id != "work-1"){
				worktype = value.substr(0,1);
				key = value.substr(1,1);      
				keyroles = works[worktype].keyroles[key];
				otherroles = works[worktype].otherroles[key];
			} else { // use filetype
					hideallroles = true;
					var ft = Drupal.settings.afd.filetype;
					keyroles = filetypes[ft].keyroles;
					otherroles = filetypes[ft].otherroles;
			}
    
	 parent.find('.delete-contributor').show();
	 // parent.find('.new-contributor').hide();
	 //parent.find('.add-new-contributor').show();
		
    var pid = '#processing';
    
    jQ14(pid).html(ffcontributors);
    
    
    var iterationid = workid.toString() + '-' + sequence.toString();
        
    jQ14(pid + ' .cvalues').attr('id',"cvalues-"+ iterationid);
    jQ14(pid + ' .select-crole').attr('name',"crole-" + iterationid);
    jQ14(pid + ' .select-cname').attr('name',"cname-" + iterationid);
    jQ14(pid + ' .fname-cname').attr('name',"newcnamefirst-" + iterationid);
    jQ14(pid + ' .lname-cname').attr('name',"newcnamelast-" + iterationid);

    jQ14(pid + ' .select-crole').append(menuBuildContributorRoleOptions(value,hideallroles));
    
    parent.append(jQ14(pid).html());
    menuUpdateContributors('.select-cname',false);
    
    jQ14(pid).html(''); 
}

function menuBuildContributorRoleOptions(worktype) {
		var keyroles = new Array;
		var otherroles = new Array;
		var allroles = new Array;
		
		var hideallroles = arguments[1] == null ? false : arguments[1];
		
	 for (var role in contributor_roles) {
			allroles.push(role);
		}
		
		allroles.sort(menuContributorRoleSort);


		if (worktype != null) {
		  var workmaintype = worktype.slice(0,1);
		  var worksubtype = worktype.slice(1,2);
		  keyroles = works[workmaintype].keyroles[worksubtype];
		  otherroles = works[workmaintype].otherroles[worksubtype];
		} else { // work-1:  TO DO, have a filetype-based lookup here
			var fttype = Drupal.settings.afd.filetype;
			keyroles = filetypes[fttype].keyroles;
			otherroles = filetypes[fttype].otherroles;
		}
		
		keyroles.sort(menuContributorRoleSort);
		otherroles.sort(menuContributorRoleSort);
		
		var output = '';
				
		//output += '<option value="">Select Role</option>';
			output += "<option value= '' ><em>Select Role</em></option>\n";
			output += "<option value= '' ><em> </em></option>\n";
			output += "<option value= '' ><em>Key Roles</em></option>\n";
			output += "<option value= '' ><em>-------------------</em></option>\n";
		
    for (var role in keyroles) {
      var roletype = keyroles[role];
      var rolelabel = contributor_roles[roletype];
      
      output += "<option value= '" + roletype + "' >" + rolelabel + "</option>\n";
      
			var index = allroles.indexOf(roletype);
			if (index != -1) allroles.splice(index,1);
    }
    
    if (otherroles.length > 0) {
			output += "<option value=''>  </option>";
			output += "<option value= '' ><em>Other Key Roles</em></option>\n";
			output += "<option value= '' ><em>-------------------</em></option>\n";
		
			for (var role in otherroles) {
				var roletype = otherroles[role];
				var rolelabel = contributor_roles[roletype];
				output += "<option value= '" + roletype + "' >" + rolelabel + "</option>\n";
				var index = allroles.indexOf(roletype);
				if (index != -1) allroles.splice(index,1);
			}
    }
    
    if (allroles.length > 0 && hideallroles == false) {
    
			output += "<option value=''>  </option>";
			output += "<option value= '' ><em>Other Roles</em></option>\n";
			output += "<option value= '' ><em>-------------------</em></option>\n";

			for (var role in allroles) {
				var roletype = allroles[role];
				var rolelabel = contributor_roles[roletype];
				
				output += "<option value= '" + roletype + "' >" + rolelabel + "</option>\n";
    	}
    }
    
    return output;

}

function menuContributorRoleSort(a,b) {
	 var ra = contributor_roles[a].toLowerCase();
	 var rb = contributor_roles[b].toLowerCase();			 
	 
	 if (ra < rb) {
		return -1;
	 } else {
		return 1
	 }
	 return 0;
}

function menuUpdateContributors(id,fromcache) {  //id is the selector for the <select> tag

	// all caching is disabled for now.
	
	
  //if ((fromcache == true || globalcontribfromcache == true) && contributorscache != null) { // globalcontribfromcache is a global variable to override bound caching variables at call time
  //		menuContributorsUpdateAll(id,contributorscache);
  //} else {
  	  // get contributors from server
	  jQ14.ajax({
		  async: false, // forces the script to stop until ajax is complete. important when performing auto-selections
		  url: Drupal.settings.afd.contribpath,
		  dataType: 'json',
		  success: function(data) {
			  var html = '';
			  //var contributors = jQ14.parseJSON(data);
			  var contributors = data;
			  
			  html += "<option value=''><em>Select Name</em></option>";
		
			  
			  for (var key in contributors) {
				if (key != undefined) {
				  var is_selected = "";
				  /*if (cookie != "")
				  	alert(cookie);*/
				  html += "<option value='" + key + "'>" + contributors[key] + "</option>";
				}
			  }
			  
			  contributorscache = menuContributorsUpdateAll(id,html); // update cache.
		  
		  }
	  });
 // }
    
  //alert("contribs: " + dump(contributors));

}

function menuContributorsUpdateAll(id,optionhtml) {
	  var html = optionhtml;
	  
      jQ14(id).each(function() {
        var selected = new Array(); // preserve existing info
        jQ14(this).find("option:selected").each(function() {
          selected.push(jQ14(this).attr('value'));
        });
        
        jQ14(this).html(html); // replace with new contribs
        
        for (i=0;i<selected.length;i++) {
           jQ14(this).find('option').each(function() {
            if (jQ14(this).attr('value') == selected[i]) {
              jQ14(this).attr('selected','selected');
            }
          });
        }
      });
        
      return html;
}

