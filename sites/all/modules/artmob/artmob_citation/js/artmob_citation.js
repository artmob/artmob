jQ14(document).ajaxError(function(e, xhr, settings, exception) {
  //alert('Troubleshooting info (to be removed at launch): ' + settings.url + ' \n'+'error:\n' + exception);
});



var pa = new Array; // parent array


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

    existingreport = jQ14.parseJSON(Drupal.settings.afd.existingreport);

    
    //var contributors = menuGetContributors();
    

    if (existingreport != null) {
      //jQ14('.citation-module').prepend(dump(existingreport));
      artmob_build_citations(existingreport);
      if (Drupal.settings.afd.edcit == true) {
        artmob_citation_build_parent_options(pa);
        artmob_citation_add_action();
        artmob_citation_disable_edit_first_work();
      }

      //afd_ui_bindings();  // mostly attribution-tab calls.  commented out to improve efficiency.
      //afd_ui_toggle();
      //afd_open_anchor();
     	//afd_ui_jump_to_anchor();
     	
     	var anchors = jQ14('.work > .banner > .close a');
     	     
			anchors.each(function() {
					var anchor = this;
					var thiswork = jQ14(this).closest('.work');
					var container = thiswork.find('> .innerwork');
					afd_ui_close(anchor,container);					
			});
			
			//jQ14('#work-3 > .banner > .close a').trigger('click');
     
   
      anchors.each(function() { // set "closed" as the intiial state for nested works
       		var anchor = jQ14(this);
       		//console.log(anchor);
       		if (anchor.closest('.work').attr('id') != 'work-1') {
       			anchor.trigger('click');
       		}
      });
      
      jQ14('.banner-title').each(function() {
    		jQ14(this).html(afd_ui_truncate_banner(jQ14(this).html()));
    	
    	});

    }
  }
});

function artmob_citation_disable_edit_first_work() {

  var editform = jQ14('#work-1 > .innerwork > .title .citation-edit');
  editform.find('.btndelete')
    .attr('disabled','disabled')
    .css('opacity','.6');
    
  editform.find('.reparent')
    .attr('disabled','disabled')
    .css('opacity','.6');
    
  editform.find('.resequence')
    .attr('disabled','disabled')
    .css('opacity','.6');
    
  editform.find('input[type="submit"]')
    .attr('disabled','disabled')
    .css('opacity','.6');
}

function artmob_get_contributors() {
  var contributors;
    jQ14.ajax({
      async: false, // forces the script to stop until ajax is complete. important when performing auto-selections
      url: Drupal.settings.afd.contribpath,
      dataType: 'json',
      success: function(data) {
        contributors = data;
      }
    });

    return contributors;
}

function artmob_citation_build_parent_options(titles) {
  var test;
  jQ14('.reparent').each(function() {
      var ec = jQ14(this).closest('.citation-edit').attr('id');
      var inputs = jQ14('#' + ec + ' :input');
      var cnid = jQ14('#' + ec).find('> input[name="cnid"]').val();
      var opt = '<option value="0">This work is contained within:</option>' + "\n";
          opt += '<option value="null"> </option>' + "\n";
      for (var i=0; i<titles.length; i++) {
        if (cnid != titles[i].cnid) {
          opt += '<option value="' + titles[i].cnid + '">' + titles[i].title  + '</option>' + "\n";
        }
      }
      
      jQ14(this).append(opt);
            
      var values = {};
      inputs.each(function() {
         values[this.name] = jQ14(this).val();
      });
      
      if (values['parentid'] != null) {
        jQ14(this).val(values['parentid']);
      } else {
      	//jQ14(this).find('option [val=0]').html('No container');
        jQ14(this).val('0');
      }
      
  });
}

function artmob_citation_add_action() {
  jQ14('.citation-edit').each(function() {
    jQ14(this).attr('method','PUT');
    //jQ14(this).attr('action','/node/1503/citation');
    jQ14(this).attr('action','/artmob_citation_order_submit');
  });

  jQ14('.btndelete').each(function() {
    var button = this;

    jQ14(button).bind('click',function() {
      var cnid = jQ14(this).attr('rel') ? jQ14(this).attr('rel') : jQ14(this).attr('id'); // originally used id for form button.  delete link uses rel.
      
      if (confirm('This will remove all information about this citation and cannot be undone.  Would you like to continue?')) {
	      $.ajax({
				  type: 'POST',
				  url: '/artmob_citation_order_delete',
				  data: {cnid: cnid},
				  success: function() {
					  location.reload( true );
				  }
				  //dataType: dataType
				});
			}      
    });
  });
  //jQ14(this).attr('action','/artmob_citation_order_delete');
}

function artmob_citation_build_weight_options( weight ) {
  var opt = '';
  for (var i=-10;i<11;i++) {
    if ( i == weight ){
      opt += '<option selected value="' + i + '">' + i + '</option>' + "\n";
    } else {
      opt += '<option value="' + i + '">' + i + '</option>' + "\n";
    }
  }

  return opt;
}

/*     '0' ...
        'cnid' => "4393"
        'title' => "Enter a Title for this work"
    '1' ...
        'cnid' => "4394"
        'title' => "myperf"
    '2' ...
        'cnid' => "4395"
        'title' => "mylitwork"
        */

function artmob_build_citations(report) {
// jQ14('#info-summary').append(dump(report));

  for (var i=0;i<report['works'].length;i++) {

    var contributors = artmob_get_contributors();

    if (typeof report['works'][i][0] != "undefined" ) {


      var work = report['works'][i][0];
      var id = work.identifiers[0].id;
      var parent = work.identifiers[0].parent;
      var sequence = work.identifiers[0].sequence;
      var weight = work.identifiers[0].weight;
      var worktype = work.identifiers[0].worktype;
      var cnid = work.identifiers[0].cnid;
      var nameid = 'nameid-' + cnid;
      var aid = 'aid-' + cnid;
      var parid = jQ14('#work-' + parent + '> .identifiers .cnid').html();

      if (worktype == null) {
        continue;
      }

    var ids = 
    "<div class='id' style='display:none'>" + id + "</div>" +
    "<div class='parent' style='display:none'>" + parent + "</div>" +
    "<div class='sequence' style='display:none'>" + sequence + "</div>" +
    "<div class='cnid' style='display:none'>" + cnid + "</div>" +
    "<div class='parent-cnid' style='display:none'>" + parid + "</div>";
      var init;

      //var target = "work-" + i.toString();
      var target = "work-" + id;

      jQ14('#processing').html(worksmodel);
      jQ14('#processing .work').attr('id',target);
      jQ14('#' + target + " > .identifiers").append(ids);

      if (parent == 0) {
        init = '#work-collection-init';
      } else {

    var nestedid;

    jQ14('.work > .identifiers .id').each(function() {
      var parentid = jQ14(this).closest('.work').attr('id');

      if (jQ14(this).html() == parent) {
      init = '#' + parentid + " > .innerwork > .nested-works"; // first nested works container
      $(init).show();
      }
    });

      }

      // add work

      jQ14(init).append(jQ14('#processing').html());
      jQ14('#processing').empty();

      var wt = worktype.substr(0,1);
      var key = worktype.substr(1,2);

      jQ14('#' + target).addClass('worktype-' + wt);


      //prep


      jQ14('#' + target + " > .innerwork > .menu h3").empty();
      jQ14('#' + target + " > .innerwork > .info").empty();
      jQ14('#' + target + " > .innerwork > .info").empty();
      jQ14('#' + target + " > .innerwork input").remove();  //strips entry forms

      // add contributor info
       jQ14('#' + target + " > .innerwork > .info").append("<div class='keyroles'></div>");
       var ctarget ='#' + target + "> .innerwork > .info .keyroles";
       jQ14(ctarget).html("<h3 class='fd-label'>Contributors</h3>");
       jQ14(ctarget).append(Drupal.settings.afd.citationtable);

       if (work.contributors.length > 0) {
        for (var j=0;j<work.contributors.length;j++) {
          var roleid = work.contributors[j][0].role;
          var role = contributor_roles[roleid];
          var cid = work.contributors[j][0].existing
          var name = contributors[cid];
          var href = cid != -1 ? '/node/' + cid : '#respond';
          var title = cid != -1 ? name : 'Do you know more? Click here.';
          var link = "<a class='edit-citation' href='" + href + "' title='"+ title + "'>" + name + "</a>";

          var row = "<tr><td>" + (typeof role != "undefined" ? role : '') + "</td><td>" + link + "</td></tr>";
          jQ14(ctarget + " .contributor-table").append(row);
        }
       } else {
         jQ14(ctarget + " .contributor-table").append('<tr><td colspan="2">There are no contributors listed for this work.  <a href="#respond">Do you know more?</a></td></tr>');
       }


       // add key info
       jQ14('#' + target + " > .innerwork > .info").append("<div class='keyinfo'></div>");
       ctarget ='#' + target + "> .innerwork > .info .keyinfo";
       jQ14(ctarget).html("<h3 class='fd-label'>Historical Information</h3>");
       jQ14(ctarget).append(Drupal.settings.afd.infotable);

       var noadditionalinfo = true;

       if (work.info.length > 0) {
        for (var k=0;k<work.info.length;k++) {
           
           var field = work.info[k][0].field;
       var value = work.info[k][0].value;
       var type = work.info[k][0].type;
       if (type == 'date') {
        var themeddate = work.info[k][0].themed;
       }
       
       if (field == 'title') { // special case.  build title area.
       	 var titleset = jQ14('#' + target + " > .innerwork .title");
       	 var tshtml = '';

       	 if (Drupal.settings.afd.edcit == true) { //admin
       	   pa.push({ 'cnid' : cnid, 'title' : value});
       	   var editlink = "/node/" + cnid + "/edit&destination=/node/" +Drupal.settings.afd.nid + "/citation';";

       	   
       	   
	         tshtml += '<form class="citation-edit" id="ce-' + cnid + '" name="edit-' + cnid + '">';
	         tshtml += '<input type="hidden" name="cnid" value="' + cnid + '" />';
	         tshtml += '<input type="hidden" name="parentid" value="' + parid + '" />';
	         tshtml += '<a name="' + nameid + '" + id="' + aid + '"></a>';
	         tshtml += '<h2>' + value + ' ';
	         tshtml += ' [<a href=' + editlink + ' title="Edit this citation">Edit</a>]';
	         tshtml += ' [<a style="cursor:pointer" class="btndelete" rel="' + cnid + '">Delete</a>]';
	         //tshtml += '<input type="button" onclick="'+ editlink + '" name="edit" value="Edit" /> '
	         //tshtml += '<input type="button" id="'+ cnid + '" class="btndelete" name="delete" value="Delete" />';
	         tshtml += '</h2>';
       	   
       	   if (!typeof works[wt] == 'undefined') {  // Retrofit to handle filetypes as well as worktypes.
	          tshtml += "<h3 class='fd-label'>Type of Work</h3>";
	          tshtml += "<div class='fd-worktype'>" + works[wt].values[key] + "</div>";
	         }
	         
           tshtml += '<select class="reparent" name="reparent" id="reparent-'+ cnid +'"></select>';
           tshtml += '<select class="resequence" name="resequence" id="resequence-'+ cnid + '">' + artmob_citation_build_weight_options(weight) + '</select>';
           tshtml += '<input type="submit" name="submit" value="submit" />';
           tshtml += '</form';	         
       	 	       	 
       	 } else {  // non-admin
       	 
         	 tshtml += '<a name="' + nameid + '" + id="' + aid + '"></a<'
         	 tshtml += '<h2>' + value + '</h2>';
         	 
       	   if (!typeof works[wt] == 'undefined') {  // Retrofit to handle filetypes as well as worktypes.
	          tshtml += "<h3 class='fd-label'>Type of Work</h3>";
	          tshtml += "<div class='fd-worktype'>" + works[wt].values[key] + "</div>";
	         }
	         	         
       	 }
       	 
       	 jQ14('#' + target + " > .banner .banner-title").html(value);
	       titleset.append(tshtml).show();

       

       } else {
          var row = "<tr><td>" + (typeof fields[field].label != "undefined" ? fields[field].label : '') + "</td><td>" + (type == 'date' ? themeddate : value) + "</td></tr>";
          jQ14(ctarget + " .info-table").append(row);
          noadditionalinfo = false;
       }

        }
       }

       if (noadditionalinfo == true) {
         jQ14(ctarget + " .info-table").append('<tr><td colspan="2">We have no additional information about this.  <a href="#respond">Do you know more? Let us know.</a></td></tr>');
       }

       jQ14('#' + target + " > .innerwork .info").show();

    }
  }
}
