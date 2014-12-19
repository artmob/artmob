  var menu = function(name) {   // object to create nested attribution menus
    this.name = name;
    this.id = '';
  };
  
  menu.fields = fields;

  menu.prototype.setOptions = function( optionstr ) {
    var menuoptions;
    
    // create option array;  form: options.A = array("a","c","e") 
    
    if (optionstr && typeof(optionstr) == 'string') {
      
      options = new Array();
      
      var oparray = optionstr.split(',');  //seems to be returning a string, so that oparray = optionstr.  weird.
      
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
    } else {
       this.options = undefined;
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
    
    element += "<form class='form-" + name +"'>";
    element += "<div class='" + name + " worksmenu'>";
            element += "<select class='worksmenuoption'>";
    
    var i = 0;
    for (property in works) {
      
        if (works[property]) {
          if (this.options[property] || displayall == true) {
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
  
            if (this.options[property] && this.options[property][op]) {
              optionshtml += "<option label = '" + works[property].values[op] + "' value='" + property + op + "'>&nbsp;&nbsp;" + works[property].values[op] + "</option>";
            } else if (displayall == true) {
              optionshtml += "<option disabled='true' label = '   " + works[property].values[op] + "' value='" + op + "'>&nbsp;&nbsp;" + works[property].values[op] + "</option>";
            }
          }
          
          if (this.options[property] || displayall == true) {
            element += optionshtml;
          }
          
          
          
        }
    }
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
  

function menuDestroyCollection (parent,sequence) {  // doesn't work as expected. removes collection when user makes another selection, but doesn't replace with new option.  investigate.
  // collections must have a unique parent-sequence combination. 
  
  var id = parent.toString() + '-' + sequence.toString();
  
  jQ14('.identifier').each(function() {
    if (jQ14(this).html() == id) {
      //jQ14(this).parent().wrap("<div class='collection' />"); // need container for subsequent population.  no?
      //jQ14(this).parent().remove();  // commented for now.
    }
  });
}


function  menuBuildFirstCollection(filetype) {
  var ft = filetypes[filetype];
  var menuname = ft["menu"];
  var branch = eval(menuname);
  

  //jQ14('#work-collection-model .parenttypename').html(ft["label"]);
  //jQ14('#worksmenu-model .parenttypename').html(ft["label"]);
  menuBuildCollection(branch,'work-collection-init','first');
  jQ14('#work-collection-init').addClass('filetype-' + ft.type); /* add filetype class to init wrapper */

}

function  menuBuildCollection(branch,locationid,action) {
  //alert('building collection');
  var workid;
  if (action != "add")
    jQ14('#' + locationid).html('');
  jQ14('#processing').html(worksmodel); // adds works model to the DOM for manipulation.
  
  var ids = menuGetIds(locationid);
  var parent = ids.parent;
  if (isNaN(ids.id))
  	ids.id = 1;
  //alert("ids are " + dump(ids));  
  if (action == 'first')  {
      workid = 'work-1';
  } else {
    workid = 'work-' + ids.id;
  }
  
  jQ14('#processing > .work').attr('id',workid);
      
  var html = jQ14('#processing').html();
  //alert("locationid is " + locationid);
  switch (action) {
    case 'add':
      //alert("workid is assigned as " + workid + " and html is " + html);
      jQ14('#' + locationid).after(html);
      break;
        
    default:
      jQ14('#' + locationid).append(html);
      break;	
  }


  jQ14('#' + workid + " .identifiers").html(menuBuildIdentifiers(ids));  
  jQ14('#processing').html();   // empty processing container
  jQ14('#' + workid + " .menu").html(worksmenumodel);  // build works menus
  
  	
  if (branch != undefined){
    jQ14('#' + workid + " .menu").append(branch.buildMenu());
  }else if (workid == "work-1"){
      jQ14("#"+locationid).html(nonestedworks);      
      jQ14("#"+locationid).show();
	  var start = parseInt(ids.id);
	  var end = start+3;      
	  for (var j=start; j < end; j++)
	     jQ14("#work-"+j).hide();
      return;	
  } else{
	  jQ14("#"+workid+" .menu #worksmenu-model h2").html("There are no nested works available for this work");
      //jQ14('#work-' + ids.parent + " ~ .additional-work").remove();
	  
	  var nextid = parseInt(ids.id)+1;
	  var previd = parseInt(ids.id)-1;
	  //alert("#work-"+ids.parent+" > .innerwork > .nested-works > .additional-work");	 
	  //jQ14(".additional-work").hide();
	  //jQ14("#work-"+ids.parent+" > .innerwork > .nested-works > .additional-work").hide();

	  var cook = get_cookie("initial_report");
	  var r = jQ14.parseJSON(cook);
	  if (r["works"][nextid] != null && r["works"][nextid] != undefined){
	  	nonestederror += "<li>This work has no option for nested works. Please press revert to go back to the last state</li>";
  	  }
  }   
 
  
  if (action != 'first') {
     jQ14('#' + workid).after(addworkmodel);
     var wt = "";
     if (parseInt(ids.parent) == 1)
     	wt = parent_ft["label"];
     else{
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
    
  /*if (action == "add"){
  	jQ14("#"+workid + " .info").hide();
  	    var menuobj = '#work-' + ids.parent + " .menu .worksmenu select";
	 
         var value = jQ14(menuobj).val();
         //alert("value is " + value);
         var worktype = value.substr(0,1);
         var key = value.substr(1,2);
         var wt = works[worktype]["values"][key];
         if (ids.parent == 1) {
  			value = Drupal.settings.afd.filetype;
  			var ft = filetypes[value];
  			wt = ft["type"];         	
         }	
         //alert(dump(ids));
	     jQ14("#"+workid+" .work-title").html(wt + " " + ids.sequence);
	     jQ14("#"+workid+" .title .work-title").val(wt + " " + ids.sequence);
	     jQ14("#"+workid+" .parenttypename").html(wt);
         jQ14('#' + workid + " .identifiers").append("<div class='worktype'>" + value + "</div>");
         jQ14('#' + workid + " .identifiers").append("<div class='worktype-label'>" + wt + "</div>");
	     
  }*/
  
  // BIND NESTED WORK TO MENU
//  	alert("Work id is " + workid + " and branch is " + dump(branch));
  
//  jQ14('#' + workid + " .menu .worksmenu select").data('removeinfo',true);
  if (action == "nest") {
	 //alert("nesting the branch with workid " + workid);

	 if (workid != "work-1"){
  	  var startindex = workid.length-1;
  	  var endindex = workid.length;
      //var previd = parseInt(workid.slice(startindex,endindex))-1;
	   var previd = jQ14('#' + workid + " .identifiers .parent").html();
	   //alert("real parent is " + previd);
	   var menu_prev = "#work-"+previd+" .menu .worksmenu select";

	   jQ14("#"+locationid+" h3").html('');
	   menuBuildNested(menu_prev,workid,branch);
	   addwork_flag = false;
       jQ14("#"+locationid).show();       
	  }
  }
  
  if (workid != "work-1"){
  jQ14('#' + workid + " .menu .worksmenu select").unbind('change');
  jQ14('#' + workid + " .menu .worksmenu select").bind('change',function() { 
    if (jQ14(this).val() == "NULL")
    	return;
  
  	var menuobj = this;
    var value = jQ14(menuobj).val();
    jQ14("#errortext").hide();
  	var startindex = workid.length-1;
  	var endindex = workid.length;
    var previd = parseInt(workid.slice(startindex,endindex))-1;
    var target = workid+' > .innerwork > .nested-works';
   /* if (action == "add"){
    	target = '#' + ids.parent;
    	jQ14("#"+workid).remove();
    }*/	
	store_report(true,false);
	menuBuildCollection(branch.getBranch(value),target,'nest');
  	checkNestedValues();

    });
  }
    
  // ADDITIONAL WORK
  jQ14('#' + workid + " ~ .additional-work .add-works-button").bind('click',function() { 
    // need the parent's workid
	var previd = jQ14('#' + workid + " .identifiers .parent").html();
	var value = jQ14("#work-"+previd+" .menu .worksmenu select").val();
    var menuname = parent_ft["menu"];
    var prev_branch = eval(menuname);      
    if (parseInt(previd) != 1) {
		previd = jQ14('#work-' + previd + " .identifiers .parent").html();    
		value = jQ14("#work-"+previd+" .menu .worksmenu select").val();
    	//alert("value is now " + value);
    	prev_branch = prev_branch.getBranch(value);
    }
   
    //menuBuildCollection(prev_branch,workid,'add');
  	var menuobj = '#work-' + previd + " .menu .worksmenu select";
    var worktype = value.substr(0,1);
    var key = value.substr(1,2);
    var wt = works[worktype]["values"][key];
    if (ids.parent == 1) {
  			value = Drupal.settings.afd.filetype;
  			var ft = filetypes[value];
  			wt = ft["type"];         	
    }	
    jQ14('#' + workid + " ~ .additional-work").html("<div class='menu'>"+worksmenumodel+"</div>");
    jQ14('#' + workid + " ~ .additional-work .menu").append(prev_branch.buildMenu());
    
    jQ14('#' + workid + " ~ .additional-work .menu .worksmenu select").unbind('change');
    jQ14('#' + workid + " ~ .additional-work .menu .worksmenu select").bind('change',function() { 
   	 if (jQ14(this).val() == "NULL")
    	return;
  		var menuobj2 = this;
  	    var value2 = jQ14(menuobj2).val();

  	   jQ14("#errortext").hide();
   	 	var target2 = workid+' ~ .additional-work';
		store_report(true,false);
		addwork_flag = true;
		addwork_worktype = value2;
		menuBuildCollection(branch,target2,'nest');
  		checkNestedValues();

      });
    
	jQ14('#' + workid + " ~ .additional-work .parenttypename").html(wt);
    
    //jQ14('#' + workid + " ~ .additional-work").remove();
    afd_ui_bindings();
  });
  
  
  
 jQ14('#' + workid + ' > .innerwork .parenttypename').each( function() {
	 if (parent == 0) {
		 var filetype = Drupal.settings.afd.filetype;
		 jQ14(this).html(filetypes[filetype]["label"]);
	 } 
	 
 });
  
  afd_ui_bindings()
}


function menuDisable(locationid) {
	jQ14(locationid + " select").each( function(){
		jQ14(this).addClass("invalid");
	});
}

function menuBuildNested(menuobj,workid,branch) {
  	var status =   jQ14('#' + workid + " .menu .worksmenu select").data('changed');
	var value = "";
	
	if (addwork_flag)
		value = addwork_worktype;
	 else
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

	 jQ14('#' + workid + " > .innerwork > .info .keyroles").empty();
	 jQ14('#' + workid + " > .innerwork > .info .keyfields").empty();
	 
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
	
	if (workid != "work-1" && jQ14("#"+workid).html() != null){
	//alert("adding menus for workid " + workid +" and id is somehow " + jQ14("#"+workid).html());
    menuAddContributor(jQ14('#' + workid + " > .innerwork > .info"),false); // add first contributor field;
    menuAddKeyFields(jQ14('#' + workid + " > .innerwork  .info")); // add first info field
	}
	
	jQ14('#' + workid + " > .innerwork > .info .add-contributor").unbind('click'); 
    jQ14('#' + workid + " > .innerwork > .info .add-contributor").bind('click',function() {
      var menuobj2 = this;    
      menuAddContributor(jQ14(menuobj2),false);
      afd_ui_bindings();
    });
    
	jQ14('#' + workid + " > .innerwork > .info .add-info").unbind('click'); // prevent double bindings
    jQ14('#' + workid + " > .innerwork > .info .add-info").bind('click',function() {
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
  		  jQ14("#"+workid+" .menu #worksmenu-model").hide();
  		}
  }*/

}

function menuGetIds(locationid) {  //fixed  /bk
  if (locationid != "work-1 > .innerwork > .nested-works"){
  	/*var loc_part = locationid.slice(0,6);
  	var startindex = loc_part.length-1;
  	var endindex = loc_part.length;
    idcounter = parseInt(loc_part.slice(startindex,endindex))+1;*/
    idcounter = jQ14(".work").length;
    //alert(idcounter);
  }else
  	idcounter = 2;
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
	if (addwork_flag)	
		value = addwork_worktype;

	/*if (id == "work-2"){
		//id = "work-1";
		value = jQ14("#work-1 .menu .worksmenu select option:selected").val();
	} 
	else
       value = jQ14("#" + id + ' > .identifiers .worktype').html();*/
    
    var workid = jQ14("#" + id + ' > .identifiers .id').html();
    var worktype = "";
    var key = "";
    var parent = jQ14("#" + id + ' > .innerwork > .info .keyfields');
    var sequence = jQ14(parent).children('.cvalues').length + 1;

	var keyfields = fields;
    var otherfields = new Array();
    
    if (id != "work-1"){
      worktype = value.substr(0,1);
      key = value.substr(1,1);      
        
      keyfields = works[worktype].keyfields[key];
      otherfields = works[worktype].otherfields[key];
    }
    
    /*var worktype = value.substr(0,1);
    var key = value.substr(1,1);      
        
    var parent = jQ14("#" + id + ' > .innerwork > .info .keyfields');
    var sequence = jQ14(parent).children('.cvalues').length + 1;
    
    var keyfields = works[worktype].keyfields[key];
    var otherfields = fields;*/

    var pid = '#processing';
    jQ14(pid).html(ffinfofields);  // Add to DOM
    
    var iterationid = workid.toString() + '-' + sequence.toString();
        
    jQ14(pid + ' .cvalues').attr('id',"cvalues-"+ iterationid);
    jQ14(pid + ' .select-cfield').attr('name',"crole-" + iterationid);
    
    var exclusions = new Array();
        
    // exclusions to come
    //jQ14('.cfield-' + treeid).each(function() {  // exclude existing values if cardinality is 1.  
    //  var value = jQ14(this).val();
    //  if (value && fields[value].cardinality == 1) {
    //    exclusions.push(jQ14(this).val());
    //  }
    //});
    
    jQ14(pid + ' .select-cfield').append("<option value= '' ><em>Select Info Type</em></option>\n");
    
    for (var field in keyfields) {
      var fieldtype = keyfields[field];
      if (id == "work-1")
         fieldtype = field;
      
      if (typeof fields[fieldtype] != "undefined") {
		  var fieldlabel = fields[fieldtype].label;
		  
		  var showfield = true;
	
		  for (var i=0; i<exclusions.length;i++) {
			if (keyfields[field] == exclusions[i]) {
			  showfield = false;
			}
		  }
	
		  if (showfield == true) { // only display fields not in keyfields
			jQ14(pid + ' .select-cfield').append("<option value= '" + fieldtype + "' >" + fieldlabel + "</option>\n");
		  }
      }
    }
    
    jQ14(pid + ' .select-cfield').append("<option value=''>  </option>");
    jQ14(pid + ' .select-cfield').append("<option value= '' ><em>Other Information</em></option>\n");
    
    for (var field in otherfields) {

      var fieldtype = field;
      var fieldlabel = otherfields[field].label;
      
      var showfield = true;
      
      for (var i=0; i<keyfields.length;i++) {
        if (field == keyfields[i]) {
          showfield = false;
        }
      }
      
      
      for (var i=0; i<exclusions.length;i++) {
        if (field == exclusions[i]) {
          showfield = false;
        }
      }
      
      /*if (showfield == true) {
        jQ14(pid + ' .select-cfield').append("<option value= '" + fieldtype + "' >" + fieldlabel + "</option>\n");
      }*/
    }
     
    jQ14(pid + ' .select-cfield').data('pid',pid); // add DOM id as data in select box for later manipulation.
    jQ14(pid + " .infoval-container").html("<input class='infoval infoval-text' type='text' value='Enter Information' name='info-" + iterationid + "'/>");
            
    jQ14(parent).append(jQ14(pid).html());
        
    jQ14(pid).html(''); // clear processing box
}
  

function menuAddContributor(o,fromcache) {
    var id = jQ14(o).closest('.work').attr('id');
  	var startindex = id.length-1;
  	var endindex = id.length;
    //var previd = parseInt(id.slice(startindex,endindex))-1;
	var previd = jQ14('#' + id + " .identifiers .parent").html();
	//alert("previd is " + previd);	
	var	value = jQ14("#work-"+ previd +" .menu .worksmenu select option:selected").val();
/*	if (id == "work-2"){
		value = jQ14("#work-1 .menu .worksmenu select option:selected").val();
	} 
	else
       value = jQ14("#" + id + ' > .identifiers .worktype').html();*/
    //var value = jQ14("#" + id + ' > .identifiers .worktype').html();
       
    //alert("value is " + value);
	if (addwork_flag)	
		value = addwork_worktype;
    
    var workid = jQ14("#" + id + ' > .identifiers .id').html();
    var worktype = "";
    var key = "";
    var parent = jQ14("#" + id + ' > .innerwork > .info .keyroles');
    var sequence = jQ14(parent).children('.cvalues').length + 1;
    //alert("sequence is " + sequence + " for workid " + workid);
	if (jQ14(parent).children('#cvalues-'+workid+"-"+sequence).length > 0)
		sequence++;
	var keyroles = contributor_roles;
    var otherroles = new Array();
    
    if (id != "work-1"){
      worktype = value.substr(0,1);
      key = value.substr(1,1);      
        
      keyroles = works[worktype].keyroles[key];
      otherroles = works[worktype].otherroles[key];
    }
    
	parent.find('.delete-contributor').show();
	parent.find('.new-contributor').hide();
	parent.find('.add-new-contributor').hide();

    var pid = '#processing';
    jQ14(pid).html(ffcontributors);
    
    
    var iterationid = workid.toString() + '-' + sequence.toString();
        
    jQ14(pid + ' .cvalues').attr('id',"cvalues-"+ iterationid);
    jQ14(pid + ' .select-crole').attr('name',"crole-" + iterationid);
    jQ14(pid + ' .select-cname').attr('name',"cname-" + iterationid);
    jQ14(pid + ' .fname-cname').attr('name',"newcnamefirst-" + iterationid);
    jQ14(pid + ' .lname-cname').attr('name',"newcnamelast-" + iterationid);
        
    for (var role in keyroles) {
      var roletype = keyroles[role];
      var rolelabel = contributor_roles[roletype];
      if (id == "work-1") {
      	roletype = role;
      	rolelabel = contributor_roles[role];
      }
      jQ14(pid + ' .select-crole').append("<option value= '" + roletype + "' >" + rolelabel + "</option>\n");
    }
    
    jQ14(pid + ' .select-crole').append("<option value=''>  </option>");
    jQ14(pid + ' .select-crole').append("<option value= '' ><em>Other Contributors</em></option>\n");
    
    for (var role in otherroles) {
      var roletype = otherroles[role];
      var rolelabel = contributor_roles[roletype];
      
      jQ14(pid + ' .select-crole').append("<option value= '" + roletype + "' >" + rolelabel + "</option>\n");
    }
        
    parent.append(jQ14(pid).html());
    menuUpdateContributors('.select-cname',false);

    
    jQ14(pid).html(''); 
}

function menuUpdateContributors(id,fromcache) {  //id is the selector for the <select> tag
  if ((fromcache == true || globalcontribfromcache == true) && contributorscache != null) { // globalcontribfromcache is a global variable to override bound caching variables at call time
  		menuContributorsUpdateAll(id,contributorscache);
  } else {
  	  // get contributors from server
	  jQ14.ajax({
		  async: false, // forces the script to stop until ajax is complete. important when performing auto-selections
		  url: '/fair_dealing/get_contributors',
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
  }
    
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

