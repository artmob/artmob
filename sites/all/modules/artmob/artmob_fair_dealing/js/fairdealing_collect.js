function bindReport() {
  jQ14('input').each(function() {
    jQ14(this).change(function() {
      report();
    });
  });
  
  jQ14('select').each(function() {
    jQ14(this).change(function() {
      report();
    });
  });

}

function findSibling(workobj, parent) {
   //alert(dump(workobj));
   for (var i=1; i < workobj.length; i++) {
     if (workobj[i][0].identifiers[0].parent == parent){
		  //alert("returning id " + i + " for parent " + parent);
     	return i;
     }
   }
   return false;
}

var report = {
    works : [{}]
};
var existing_report = false;
var parent_ft = "";
var parent_branch = "";
var nonestederror = "";
var state_checking = false;

function afd_build_attributions(report, has_levels) {
  if (debug == true) {
   jQ14('#info-summary').append("<h3>Number of works: " + report['works'].length + "</h3>");
   jQ14('#info-summary').append(dump(report));
  }
//  alert(dump(report));
  var filetype = Drupal.settings.afd.filetype;
  var ft = filetypes[filetype];
  var label = ft["label"];

  for (var i=0;i<report['works'].length;i++) {
  
    if (typeof report['works'][i][0] != "undefined") {   
      globalcontribfromcache = false;
      
      var work = report['works'][i][0];
      var id = work.identifiers[0].id;
      var parent = work.identifiers[0].parent;
      var sequence = work.identifiers[0].sequence;
      var worktype = work.identifiers[0].worktype;
      var target;
      if (parent == 0) {
        var target = '#work-1';
      } else {
				 var parentid;
				 // because work container ids are generated automatically, independent of parent/child relationships
				 // outlined in the JSON data, we can't rely on a direct correspondences (e.g. just because a work
				 // has an id of "2" in the JSON data doesn't mean that its container will be <div class='work' id='work-2'>
				 // this finds the correct work container based on embedded identifiers, and simulates the creation of new 
				 // nested works.
				 
				 var nestedid;
				 
				 jQ14('.work > .identifiers .id').each(function() {
					 if (jQ14(this).html() == parent) {
					 parentid = jQ14(this).closest('.work').attr('id');
					 nestedid = '#' + parentid + " > .innerwork > .nested-works"; // first nested works container
					 }
				 });
		 
				 var target = '#' + jQ14(nestedid + " div.work:nth-child(" + sequence + ")").attr('id');
					 
				 // additional work, must trigger add work     
				 if (sequence > 1) { 
					 jQ14("#work-" + parent + " > .innerwork > .nested-works > .additional-work .add-works-button").trigger('click');
										
					//alert ("#menu-" + parent + "-" + sequence + " WT: " + worktype);
					 jQ14("#menu-" + parent + "-" + sequence + " select")
					 	.val(worktype)
					 	.trigger('change');
					// jQ14("#work-" + parent + " > .innerwork > .nested-works > .additional-work .menu .worksmenu select").val(worktype);
					// jQ14("#work-" + parent + " > .innerwork > .nested-works > .additional-work .menu .worksmenu select").trigger('change');
					 //target = "#work-" + parent + " > .innerwork > .nested-works > .additional-work";
					 
					 jQ14("#work-" + parent).find('.work').each(function() {
							target = '#' + jQ14(this).attr('id');
					 });
				 }
				 
		 
				 //alert("target is " + target + " for report " + dump(report["works"][i]));
      }
      
      //if the target cannot be found at this point, it is a nested worked in an additional work
      if (target == "#undefined") {
				nestedid = '#work-' + id + " > .innerwork > .nested-works"; // first nested works container
				//alert("in here now");
				target = '#' + jQ14(nestedid + " div.work:nth-child(" + sequence + ")").attr('id');
      }
      
      // alert("target is " + target + " for id " + id);
      //  alert(dump(work));
      //jQ14(target + " > .innerwork >  .menu option[value='" + worktype + "']").parent('select').val(worktype); // select worktype
      //jQ14(target + " > .innerwork > .menu option[value='" + worktype + "']").parent('select').trigger('change'); // create work container by triggering click event
	  	
	  	var errortext = "";
	  	
	  	// build contributors for a work
	  	
      if (work.contributors.length > 0) {
        var ctarget = target + "> .innerwork > .info .keyroles";
        jQ14(ctarget).html('');
        
        // iterate over the number of contributors for a work.
        for (var j=0;j<work.contributors.length;j++) {
          var nchild = j + 1;
          jQ14(target + " > .innerwork > .info .add-contributor").trigger('click'); // add new contributor
          globalcontribfromcache = true // only access server for contrib info on first pass
          
          var childtarget = ctarget + " .cvalues:nth-child(" + nchild + ")";
          
          // Validate role fields
         
 
          jQ14(childtarget + " .select-crole option").each(function() {
	          if (jQ14(this).attr('value') == work.contributors[j][0].role && jQ14(this).attr('value') != "") {
							
							// Q: What are we indexing here?
			     		var startindex = target.length-1;
	  					var endindex = target.length;
	  					
	    				//var next_sequence = parseInt(target.slice(startindex,endindex))+1;
	         		var parent_worktype = jQ14("#work-1 > .identifiers .worktype").html();
	         		if (has_levels != true)
	         				parent_worktype = jQ14("#work-"+id+" > .identifiers .worktype").html();
				 			var next_sequence = findSibling(report['works'],id);		
	                   
	            var nexttarget = "#work-"+ next_sequence +" > .innerwork > .info .keyroles .cvalues:nth-child(" + nchild + ")";
	            
	            if (jQ14(childtarget + " .select-crole option[value='"+work.contributors[j][0].role+"']").length > 0 ) {
	                jQ14(this).attr('selected','selected');
	            }
	            
	            // set corporate contributor as a contributor type
	                        
	            if (typeof work.contributors[j][0].contributor_type != 'undefined') {
	            	jQ14(childtarget + " .contributor-type").attr('value',work.contributors[j][0].contributor_type);
	            }
	            
	            /*
	            else if (isNaN(parent_worktype)) {
	            
	               //need to check the works variable
				
								 var workval = parent_worktype.slice(0,1);
								 var roleval = parent_worktype.slice(1,2);
								 
								 //alert("workval is " + workval + " and roleval is " + roleval + " and role is " + work.contributors[j][0].role);
								 // check to see if role value is acceptable.  Select it if it is, or append a validation error
								 
								 if (jQ14.inArray(work.contributors[j][0].role, works[workval]['keyroles'][roleval]) == -1 && jQ14.inArray(work.contributors[j][0].role, works[workval]['otherroles'][roleval]) == -1) {
									 errortext += "<li>The role "+contributor_roles[work.contributors[j][0].role]+" does not exist for this work type</li>";                  
								 } else {
										jQ14(this).attr('selected','selected'); 
								 }                  
	             } else if (jQ14(nexttarget + " .select-crole option").size() != 0)
	               errortext += "<li>The role " + contributor_roles[work.contributors[j][0].role] + " does not exist for this work type</li>";*/
            } 
          });


          
          jQ14(childtarget + " .select-cname option").each(function() {
            if (jQ14(this).attr('value') == work.contributors[j][0].existing) {
              jQ14(this).attr('selected','selected');
            } 
          });          
        }
         // jQ14(target + " > .innerwork > .info .add-contributor").trigger('click'); // prep for additional contributor
      } 
      //else {
      	//	jQ14(target + " >.innerwork > .info .add-contributor").trigger('click'); // add new contributor field
			//}
      
			
			// add a work’s historical information fields 
			
      if (work.info.length > 0) {
        var ctarget = target + " > .innerwork > .info .keyfields";
        jQ14(ctarget).html('');
        
        var nchildinfo = 0;
        
        for (var k=0;k<work.info.length;k++) {
        
          var field = work.info[k][0].field;
		  		var value = work.info[k][0].value;
		  		var type = work.info[k][0].type;
  		  
		  
					if (field == 'title' && parent != 0) { // special case
						jQ14(target + "> .banner .banner-title").html(value);
						jQ14(target + " > .innerwork > .title .work-title").val(value);
						//alert ('Target: ' + target + ', Title: ' + value);
					} 
					else if (field != "title") {
					
						nchildinfo++;
							
						jQ14(target + " >.innerwork > .info .add-info").trigger('click'); // add new info field
						
						var childtarget = ctarget + " .cvalues:nth-child(" + nchildinfo.toString() + ")";
 											
						// validate individual information fields

						jQ14(childtarget + " .select-cfield option").each(function() {
							if (jQ14(this).attr('value') == field && jQ14(this).attr('value') != "") {
									var startindex = target.length-1;
									var endindex = target.length;
									//var next_sequence = parseInt(target.slice(startindex,endindex))+1;
									var next_sequence = findSibling(report['works'],id);		
									var parent_worktype = jQ14("#work-1 > .identifiers .worktype").html();
							
				//        var next_sequence = parseInt(sequence) + 1;
									var nexttarget = "#work-"+ next_sequence +" > .innerwork > .info .keyfields .cvalues:nth-child(" + nchild + ")";
									if (jQ14(childtarget + " .select-cfield option[value='"+field+"']").length > 0 ) {
										 jQ14(this).attr('selected','selected');
									} else if (isNaN(parent_worktype))
									{
											//need to check the works variable
											var workval = parent_worktype.slice(0,1);
											var roleval = parent_worktype.slice(1,2);
											if (jQ14.inArray(field, works[workval]['keyfields'][roleval]) == -1 && jQ14.inArray(field, works[workval]['otherfields'][roleval]) == -1)
												errortext += "<li>The field "+fields[field]["label"]+" does not exist for this work type</li>";                  
											else
												 jQ14(this).attr('selected','selected');                   
									}
									else if (jQ14(nexttarget + " .select-cfield option").size() != 0) {
										 errortext += "<li>The field "+fields[field]["label"]+" does not exist for this work type</li>";
								 }
							}
						});

						// update field value. dates must be handled differently than text fields
												
						if (type == 'date') {
							 jQ14(childtarget + " .infoval-container").html(datewidget);
							 var delems = value.split('/');
							 jQ14(childtarget + ' .date-day-select').val(delems[0]);
							 jQ14(childtarget + ' .date-month-select').val(delems[1]);
							 jQ14(childtarget + ' .date-year-field').val(delems[2]);
			
						} else {
							jQ14(childtarget + " .infoval").val(value);
						}
					}
			}
			
			

		var startindex = target.length-1;
  	var endindex = target.length;
    	//var next_sequence = parseInt(target.slice(startindex,endindex))+1;
 		var next_sequence = findSibling(report['works'],id);
 		
 	   // alert("work info " + dump(work));
       if (errortext != ""){
      	jQ14("#errorinfo").html(errortext);
      	jQ14("#errortext").show();
      	//jQ14(".work").hide();
      	//jQ14(target).show();
      	jQ14(target + " .menu .worksmenu select").val("");
      	return;
      } else{
       	jQ14("#work-"+next_sequence).show();
      	jQ14("#errortext").hide();
      }
      
      var nextindex = parseInt(next_sequence);
	  //alert("next index is " + nextindex + " for id " + id);
	  
	  
	  // checks to see if a new menu is required.
	  
      if (report["works"][nextindex] != undefined && typeof jQ14("#work-"+ id +" .menu .worksmenu select") != undefined && next_sequence != false){
      	//alert("next sequence is " + next_sequence + " for id " + id);
      	//get the DOM workid
      	//alert("target is " +target+ " for id " + id);
      	
      	// set menu type for upcoming sibling, creating next work

      	jQ14(target +" .menu .worksmenu select").val(report["works"][nextindex][0].identifiers[0].worktype);
        jQ14(target +" .menu .worksmenu select").trigger('change');
      }
        //jQ14(target + " > .innerwork > .info .add-info").trigger('click'); // prep for additional info
      } 
            
      // Q: Why is this here?
      if (work.info.length == 1 && work.info[0][0].field == "title") {
      		jQ14(target + " >.innerwork > .info .add-info").trigger('click'); // add new info field
      }
      
		} else if (report["works"].length == 1 || has_levels == true) {
		
			// initial work
			//SET DEFAULTS FOR PRELIMINARY INFO
			//alert("setting defaults");
			menuSetupInitial(label);
			menuCreateInitialWorkTypes(ft);
		
			jQ14("#work-1 > .innerwork > .info .add-contributor").bind('click',function() {
				 menuAddContributor(jQ14(this),false);
				 afd_ui_bindings();
			});
			
			jQ14("#work-1 > .innerwork > .info .add-info").bind('click',function() {
				menuAddKeyFields(jQ14(this));
				afd_ui_bindings();
			});
			 
			afd_ui_bindings();
		} 
  }
}


function menuSetupInitial(label) {
    var target = '#work-1'; 
	  jQ14(target + "> .banner .banner-title").html(label);
	  jQ14(target + " > .innerwork > .title .work-title").toggle(false);
	  jQ14(target + " > .innerwork > .title").toggle(false);
    var ctarget = target + "> .innerwork > .info .keyroles";
    var ftarget = target + "> .innerwork > .info .keyfields";
      
      createTier0Menu(ctarget,"roles");
	  //jQ14('.add-new-contributor-container').toggle(true);
      createTier0Menu(ftarget,"fields");
}

function createTier0Menu(ctarget,type) {
	  var rolename = "crole-1-1";
	  var classname = "crole";
	  var divcounter = "1";
	  var textlabel = "Role";
	  var cnamelabel = "cname-1-1";

		if (type == "fields"){
			rolename = "crole-1-2";
			classname = "cfield";
			cname = "cname-1-2";
			divcounter = "2";
			textlabel = "Info Type";
		}	
	  
	  var cmodel = jQ14("<div>" + Drupal.settings.afd.ffcontributors + "</div>"); // create a DOM object in memory

	  var imodel = jQ14("<div>" + Drupal.settings.afd.ffinfofields + "</div>"); // create a DOM object in memory
	  var crole = cmodel.find('.select-crole');
	  var cname = cmodel.find('.select-cname');
	  var cvalues = cmodel.find('.cvalues');
	  var html;
	  
	  
	  cvalues.attr('id','cvalues-1-' + divcounter);
	  crole.attr('name',rolename).addClass('select-' + classname);
	  	        
      if (type == "roles"){
      	crole.append(menuBuildContributorRoleOptions(null,true));
				cname.attr('name',cnamelabel);

      
				jQ14.ajax({
					async: false, // forces the script to stop until ajax is complete. important when performing auto-selections
					url: Drupal.settings.afd.contribpath,
					dataType: 'json',
					success: function(data) {
						var contributors = data;
						var opts;				
						
						for (var key in contributors) {
							if (key != undefined) {
								var is_selected = "";
								/*if (cookie != "")
									alert(cookie);*/
								opts += "<option value='" + key + "'>" + contributors[key] + "</option>";
							}
						}		
						
						cname.append(opts);  
					}
				});
				html = cmodel.html();
	  }
	  else {
	  	imodel.find(".infoval-container").html('<input type="text" value="Enter Information" name="info-1-1" class="infoval infoval-text" />');
	    imodel.find(".select-cfield").append(menuBuildInfoFieldOptions(null,true));
	  	html = imodel.html()
	  }
	  
	  jQ14(ctarget).html(html);
}

function menuCreateInitialWorkTypes(ft) {
  //SPECIAL EXCEPTION FOR WORK1 - HAVE TO DO OTHER CHECKS ON CHANGE TO PRESERVE DATA
  parent_ft = ft;
  var work1 = jQ14("#work-1 .innerwork > .menu .worksmenu select");
   work1
   	.unbind('change')
  	.bind('change',function() { 
		 // alert(jQ14('#cvalues-0-1 > .select-crole option:selected').val());  
			if (jQ14(this).val() == "NULL")
				return;
				
			var menuobj = this;
			var value = jQ14(menuobj).val();
			var menuname = parent_ft["menu"];
			jQ14("#errortext").hide();
			var branch = eval(menuname);
			parent_branch = branch;
		//	store_report(true,true);
			var add_works = "";
			//GRAB ANY ADDITIONAL WORKS AND APPEND IT AFTER THE COLLECTION IS BUILT
			jQ14('.work > .identifiers .sequence').each(function() {
					if (parseInt(jQ14(this).html()) > 1) {
						var pid = jQ14(this).closest('.work').attr('id');
						add_works += '<div class="work" id="#'+pid+'">'+jQ14("#"+pid).html()+'</div>';
					}
		});
			var newid = menuBuildCollection(branch.getBranch(value),'work-1 > .innerwork > .nested-works','nest');	
			
			
			if (add_works != ""){
				nonestederror += '<li>Your additional works are not valid for this worktype. Please press revert to go back to your previous state</li>';
			}  
			
 
			work1
				.unbind('change')
				.bind('change',function() {
				newvalue = jQ14(this).val();
				if (jQ14(this).val() == "NULL")
					return;
			//	store_report(true,true);	
				menuChangeCollection(jQ14(this),newid,branch);
			//	checkNestedValues();
			});
		
			//checkNestedValues();

	//jQ14("#work-1 > .innerwork > .nested-works > .additional-work").hide();
  });
  
}

function checkNestedValues() {
  var cook = get_cookie("initial_report");
  var r = jQ14.parseJSON(cook);
  var errortext = "";

  for (var i=0;i<r['works'].length;i++) {
    if (r['works'][i] != null && typeof r['works'][i][0] != "undefined") {       
      var work = r['works'][i][0];

      var id = work.identifiers[0].id;
      var parent = work.identifiers[0].parent;
      if (id == 1)
      	continue;
      
      var sequence = work.identifiers[0].sequence;
      var worktype = work.identifiers[0].worktype;
      var target;
	  var nestedid;
	  var parentid;
	  
	  jQ14('.work > .identifiers .id').each(function() {
		  if (jQ14(this).html() == parent) {
		  parentid = jQ14(this).closest('.work').attr('id');
		  nestedid = '#' + parentid + " > .innerwork > .nested-works"; // first nested works container
		  }
		});
				  
		target = '#' + jQ14(nestedid + " div.work:nth-child(" + sequence + ")").attr('id');
	    if (jQ14(nestedid + " div.work:nth-child(" + sequence + ")").attr('id') == undefined)
	    	target = "#work-2";		
	    	
	  var wt = jQ14("#"+parentid+" > .innerwork > .menu .worksmenu select").val();
	  //alert("worktype is " + wt + " for parent " + parent);
	  if (wt == undefined || wt == null)
	  	continue;
	  var nchild = 0;
	  //alert("target is " + target + ", parent is " + parent + " checking against worktype " + wt + " with values " + dump(work));
      if (work.contributors.length > 0) {
        var ctarget = target + " > .innerwork > .info .keyroles";
        jQ14(ctarget).html('');
        
        for (var j=0;j<work.contributors.length;j++) {      
          var nchild = j + 1;
                    
          var childtarget = ctarget + " .cvalues:nth-child(" + nchild + ")";
          if (work.contributors[j][0].role == "")
             	continue;
             if (jQ14(childtarget + " .select-crole").length == 0){
             	jQ14(target+" > .innerwork > .info .add-contributor").trigger('click'); // add new contributor
			 	//alert("adding a new contributor?");
			 }
                       var workval = wt.slice(0,1);
                       var roleval = wt.slice(1,2);
                       var roleparts = work.contributors[j][0].role.split("-invalid");
                       work.contributors[j][0].role = roleparts[0];
                      // alert("role is " + work.contributors[j][0].role);

                       if (jQ14.inArray(work.contributors[j][0].role, works[workval]['keyroles'][roleval]) == -1 && jQ14.inArray(work.contributors[j][0].role, works[workval]['otherroles'][roleval]) == -1){
	                       errortext += "<li>The role "+contributor_roles[work.contributors[j][0].role]+" does not exist for this work type</li>";                  
                           if (jQ14(childtarget + " .select-crole option[value='"+work.contributors[j][0].role+"-invalid']").length == 0) {                           
                             jQ14(childtarget + " .select-crole").append('<option value="'+work.contributors[j][0].role+'-invalid">'+contributor_roles[work.contributors[j][0].role]+'</option>');
                       	     jQ14(childtarget + " .select-crole").addClass("invalid");                                                                                 
                       	   }
                       	   jQ14(childtarget + " .select-crole").val(work.contributors[j][0].role+"-invalid");
                       } else
                       		jQ14(childtarget + " .select-crole").val(work.contributors[j][0].role);
          
          jQ14(childtarget + " .select-cname option").each(function() {
            if (jQ14(this).attr('value') == work.contributors[j][0].existing) {
              jQ14(this).attr('selected','selected');
            } else if ((work.contributors[j][0].newfirstname != "First Name" && work.contributors[j][0].newlastname != "Last Name") || work.contributors[j][0].corporatecontributor == 1) {
            	jQ14(childtarget + " .add-new-contributor").trigger('click');
            	if (work.contributors[j][0].corporatecontributor == 0)
            	  jQ14(childtarget + " .add-new-contributor-container .fname-cname").val(work.contributors[j][0].newfirstname);
            	else{
            	  jQ14(childtarget + " .add-new-contributor-container .fname-cname").val('');
            	  jQ14(childtarget + " .add-new-contributor-container .fname-cname").hide();
            	  jQ14(childtarget + " .add-new-contributor-container .cc-cname").attr('checked','checked');            	  
            	}
            	jQ14(childtarget + " .add-new-contributor-container .lname-cname").val(work.contributors[j][0].newlastname);
            }
          });

	   nchild++;
	   var childtarget = ctarget + " .cvalues:nth-child(" + nchild + ")";
      //PERFORM CLEANUP OF UNUSED DROPDOWNS
	  if (jQ14(childtarget + " .select-crole").val() == "")
         		jQ14(childtarget).remove();
         }       
      } 

      if (work.info.length > 0) {
        var ctarget = target + " > .innerwork > .info .keyfields";
        jQ14(ctarget).html('');
        var nchildinfo = 0;
        
        for (var k=0;k<work.info.length;k++) {
        
          var field = work.info[k][0].field;
		  var value = work.info[k][0].value;
		  var type = work.info[k][0].type;
  		  
		  
		  if (field == 'title') { // special case
				jQ14(target + "> .banner .banner-title").html(value);
				jQ14(target + " > .innerwork > .title .work-title").val(value);
		  } 
		  else {
		  			   nchildinfo++;
			           var childtarget = ctarget + " .cvalues:nth-child(" + nchildinfo.toString() + ")";
					   if (field == "")
					   	  continue;
					   	  
                       if (jQ14(childtarget + " .select-cfield").length == 0)
            		       jQ14(target + " >.innerwork > .info .add-info").trigger('click');
                       var fieldparts = field.split("-invalid");
                       field = fieldparts[0];
		  			   
                       //need to check the works variable
                       var workval = wt.slice(0,1);
                       var roleval = wt.slice(1,2);
                       //alert("workval is " + workval + " and roleval is " + roleval + " and field is " + field);
                       if (jQ14.inArray(field, works[workval]['keyfields'][roleval]) == -1 && jQ14.inArray(field, works[workval]['otherfields'][roleval]) == -1) {
	                       errortext += "<li>The field "+fields[field]["label"]+" does not exist for this work type</li>";    
                           if (jQ14(childtarget + " .select-cfield option[value='"+field+"-invalid']").length == 0) {
                              jQ14(childtarget + " .select-cfield").append('<option value="'+field+'-invalid">'+fields[field]["label"]+'</option>');
                       	      jQ14(childtarget + " .select-cfield").addClass("invalid");                                                      
                       	   }
                       	   jQ14(childtarget + " .select-cfield").val(field+"-invalid");                       	   
                       } else
                       		jQ14(childtarget + " .select-cfield").val(field);
			 if (type == 'date') {
			   jQ14(childtarget + " .infoval-container").html(datewidget);
			   var delems = value.split('/');
			   jQ14(childtarget + ' .date-day-select').val(delems[0]);
			   jQ14(childtarget + ' .date-month-select').val(delems[1]);
			   jQ14(childtarget + ' .date-year-field').val(delems[2]);

			 } else {
			  jQ14(childtarget + " .infoval").val(value);
			 }
	                       
			} 
			
		  }
	   nchildinfo++;
	   var childtarget = ctarget + " .cvalues:nth-child(" + nchildinfo.toString() + ")";

       if (jQ14(childtarget + " .select-cfield").val() == "")
         	jQ14(childtarget).remove();
		  
		}

 	   if (nonestederror != "" && errortext != nonestederror){
 	   		errortext += nonestederror;
       		nonestederror = "";
       }
      
       if (state_checking == false){
       var nextid = findSibling(report["works"],id);
       if (r["works"][nextid] != null && r["works"][nextid] != undefined && jQ14(target +" .menu .worksmenu select").val() == "NULL") { 
	       var wt2 = r["works"][nextid][0].identifiers[0].worktype;

           if (jQ14(target +" .menu .worksmenu select option[value='"+wt2+"']").length > 0){   
            //alert("value was found");
       	    jQ14(target +" .menu .worksmenu select").val(wt2);
       	    nonestederror = errortext;
       	    state_checking = true;
       	    jQ14(target +" .menu .worksmenu select").trigger('change');
       	    return;
       	   } else {
	  	      errortext += "<li>This work can contain nested works, however your chosen type of work does not exist. Please choose a different nested work type first to see your previous values</li>";
       	   }
       } /*else {
	         jQ14(target+" > .innerwork > .nested-works > .additional-work").hide();       
       }*/
       } else
          state_checking = false;
       if (errortext != ""){
      	  jQ14("#errorinfo").html(errortext);
      	  jQ14("#errortext").show();
       } 
    }
   }
   if (errortext != ""){
      	jQ14("#errorinfo").html(errortext);
      	jQ14("#errortext").show();
   } 
  jQ14('select.invalid').unbind('change');
  jQ14('select.invalid').bind('change',function() {

  if (jQ14(this).val().indexOf("invalid") == -1) {
		jQ14(this).children("option").each(function(){
		  if (jQ14(this).val().indexOf("invalid") != -1)
		     jQ14(this).remove();
		});
		jQ14(this).removeClass("invalid");
		jQ14("#errortext").hide();
                                  
   } 
		var val = jQ14(this).val();
		var ftype = fields[val].fieldtype;
		var flabel = fields[val].label;
		var spid = jQ14(this).closest(".cvalues").attr('id');
		
		var container = jQ14('#' + spid + ' .infoval-container')
		
		var idindex = spid.indexOf('-');
		var iterationid = spid.slice(idindex+1);
			
		if (ftype == 'date') {
			//replace textfield with date widget
			container.html(datewidget);
		}
		else if (ftype == 'textfield') {
			container.html("<input class='infoval infoval-text' type='text' value='Enter Information' name='info-" + iterationid + "'/>");
		}
		else if (ftype == 'textarea') {
			container.html("<textarea class='infoval infoval-textarea' rows='6' cols='40' name='info-" + iterationid + "'>Enter Information</textarea>");
		}
                              
  });
  
}   

function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function get_cookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}

function revertClicked() {
  //createCookie("revert_clicked","true",null);
	window.location.reload(true);
}

function store_report(in_memory,first_time)
{
    var html = '';
    var count = 0;
	  if (state_checking){
	  	return;
	  }
      jQ14("#work-collection-init .work").each(function() {
         var id = jQ14(this).children('.identifiers').find('.id').html();
         var parent = jQ14(this).children('.identifiers').find('.parent').html();
         var sequence = jQ14(this).children('.identifiers').find('.sequence').html();
         var worktype = jQ14(this).children('.identifiers').find('.worktype').html();
         var worktypelabel = jQ14(this).children('.identifiers').find('.worktype-label').html();
		 
         if (worktype != null || id == "1" || parseInt(sequence) > 1) {
			if (id == "1")
			{
			  var filetype = Drupal.settings.afd.filetype;
  	          var ft = filetypes[filetype];
              worktypelabel = ft["label"];
			  worktype = filetype;
			}
          // collect contributors
			//alert("id is now " + id);
            var contributors = new Array();
            var info = new Array();

            var cvalues = jQ14(this).children('.innerwork').children('.info').find('.keyroles .cvalues');
            if (cvalues.length == 0) {
            	cvalues = jQ14("#work-1").children('.innerwork').children('.info').find('.keyroles .cvalues');
            }
            
           //alert("id is now " + id + " and there are " + cvalues.length + " contributors to be saved");

            
            var title = jQ14(this).children('.innerwork').children('.title').find('.fd-title').val();
                        
            if (title != '' || title != null || title != 'Enter a Title for this work' || id != "1") {
        info.push([{
          "field" : 'title',
          "value" : title,
          "type" : 'textfield'
        }]);
            }

          //  if (cvalues.length > 0 && sequence == 1) {  // Q: Why prevent interation if work sequence is equal to 1? 
          if (cvalues.length > 0) {
              cvalues.each(function() {
                 var cid = "#"+jQ14(this).attr('id');
                 //alert(jQ14('#cvalues-1-1 > .select-crole option:selected').val());
                 //alert(jQ14('#cvalues-1-1 > .select-cname option:selected').val());	
                 
                 if (jQ14(cid).find('.select-crole option:selected').val() != null) {
                   contributors.push([{
                       "role" : jQ14(this).find('.select-crole option:selected').val(),
                       "existing" : jQ14(this).find('.select-cname option:selected').val(),
                       "newfirstname" : jQ14(this).find('.fname-cname').val(),
                       "newlastname" : jQ14(this).find('.lname-cname').val(),
                       "corporatecontributor" : jQ14(this).find('.cc-cname').attr('checked') ? 1 : 0,
                       "isunknown" : jQ14(this).find('.cc-unknown').attr('checked') ? -1 : 0
                     }]);
                 } 
             });
            } 
            
            var cvalues = jQ14(this).children('.innerwork').children('.info').find('.keyfields .cvalues');
            if (cvalues.length == 0) {
            	cvalues = jQ14("#work-1").children('.innerwork').children('.info').find('.keyfields .cvalues');
            }            	

            cvalues.each(function() {
        var iid = jQ14(this).attr('id');
        /*if (first_time)
           iid = iid.replace("1-","0-");*/
        var field = jQ14('#' + iid + ' .select-cfield').val();
        
        if (jQ14('#' + iid + ' .infoval-date-widget').length > 0) {
        	var value = jQ14('#' + iid + ' .date-day-select').val() + '/' + jQ14('#' + iid + ' .date-month-select').val() + '/' + jQ14('#' + iid + ' .date-year-field').val();
        } else {
        	var value = jQ14('#' + iid + ' .infoval').val();
        }
        
        var fieldtype = null;
        if (typeof fields[field] != "undefined") {
        fieldtype = fields[field].fieldtype;
        }
        
        if (field != null) {
        info.push([{
          "field" : field,
          "value" : value,
          "type" : fieldtype
        }]);
        }

            });
           

       report.works[id] = [{
            "identifiers" : [{
              "id" : id,
              "parent" : parent,
              "sequence" : sequence,
              "worktype" : worktype,
              "worktype label" : worktypelabel
              }],
            "contributors" : contributors,
            "info" : info,
            "nid": Drupal.settings.afd.nid
          }];          
        }
      });

    if (in_memory){
    	createCookie("initial_report",JSON.stringify(report),null);
		  return;
	  }
    
    ///!!! send report to artmob_fair_dealing.module
  jQ14.post(Drupal.settings.afd.savepath,
    {report: JSON.stringify(report) },
     function (data) {
       var result = Drupal.parseJson(data);
        alert('Your information has been successfully saved');
        if (debug == true) {
          jQ14('#info-summary').append("report: " + JSON.stringify(report));
        }
       return false;
  });
}

jQ14(document).ready(function() {
  jQ14('#revertbtn').bind('click',function() {
  	var answer = confirm("This will delete any changes you've made since the last save.  Do you want to continue?")
		if (answer){
			revertClicked();
		}
  });
    
  jQ14('#savebtn').bind('click',function() {
      // reporting
      
    if (jQ14('.invalid').length > 0) {
  		var answer = confirm("Some entries are invalid, and may cause irregularities if saved. If you would like to review, click No and look for entries marked in red. Would you like to proceed?");
  		
  		if (answer) {
	  		store_report(false,false);
  		} else {
	  		alert('Your entries have NOT been saved.');
  		}
  	} else {
	  	store_report(false,false);
  	}
    
  });
  
  /*if (typeof report['works'][0][0] == "undefined") {
       var filetype = Drupal.settings.afd.filetype;
       var ft = filetypes[filetype];
       var label = ft["type"];
  
    	menuSetupInitial(label);
        menuCreateInitialWorkTypes(ft);
    	jQ14("#work-1 .menu .worksmenu select").trigger('change');
    }*/
});


/*function report() {
    jQ14('.work').each (function() {
      var workid = jQ14(this).data('worktypeid');
      this.workid = workid;
      //alert(workid);
    });
}*/

//});
