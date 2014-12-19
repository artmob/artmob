$('document').ready(function() {

	// Dynamic formatting for 1 and 2 column presentations
	
	$('.license-table tr').each(function () {
	var colcount = 1;
		$(this).find('td').each(function () {
			$(this).addClass('col-'+colcount);
			colcount++;
		});
	});
		
	artmob_license_bind_ui();
          
});

function artmob_license_close(anchor,container) { // a clone of afd_ui_close();
  jQ14(anchor).css('cursor','pointer');
  jQ14(anchor).unbind('click');
  jQ14(anchor).bind('click',function() {
    jQ14(container).slideToggle('slow',function() {
      if (jQ14(anchor).hasClass('inactive')) {
        jQ14(anchor).removeClass('inactive').addClass('active');
        jQ14(anchor).html("Open");
      } else {
        jQ14(anchor).removeClass('active').addClass('inactive');
        jQ14(anchor).html("Close");
      }
    }) ;
  });
}

function artmob_license_bind_ui() {   
   /* add license panelling */
    $('.add-license-block').each (function() {
      var id = $(this).attr('id');
      $('#' + id + ' a.panel-nav').each(function() {
        $(this).bind('click', function() {
          var panelid = $(this).attr('tabindex');
          $('#' + id + ' .license-panel').hide();
          $('#' + id + ' .panel-' + panelid).removeClass('inactive').addClass('active').show();
          $('#' + id + ' .license-help-panel').hide();
          $('#' + id + ' .license-help-panel-' + panelid).show();
          $(this).siblings('a').removeClass('active').addClass('inactive');
          $(this).addClass('active').removeClass('inactive');
       });
      });
    });
    $('.fd-button')
    	.unbind('click')
	    .bind('click', function() {
        var cid = $(this).parents('.add-license-block').find('.add-license-form-cid').attr('value');
        var linfo = $('#add-license-info-'+cid);
        
        if (linfo.css('display') == 'none') {
            linfo.show();
        } else {
            linfo.hide();
        }
        
        $(this).hide();
      });
    
    var counter = 1;
    
    jQ14('.work > .banner .close a').each(function() {
            var anchor = this;
            var container = jQ14(this).closest('.work').find('> .innerwork');
            artmob_license_close(anchor,container);
            
            if (counter > 1) {
              jQ14(this).trigger('click');
            }
            
            counter++;
        });

    jQ14('.banner-title').each(function() {
      var banner = jQ14(this).html();
	    var newbanner = banner.substr(0,60);
    	jQ14(this).html((newbanner.length < banner.length ? newbanner + ' ... ' : banner));
    	
    });

    $('.submit-license-btn').each( function() {
            $(this).unbind('click');
                $(this).bind('click', function() {
                  var license = $(this).parents('.licenses');
                  var parent = $(this).parents('.add-license-block');
                  var cid = parent.find('.add-license-form-cid').attr('value');
                  var nid = parent.find('.add-license-form-nid')  .attr('value');
                  var contributorsid = $('#known-contributors-' +  cid);
                  var existingid = $('#existing-license-info-' +  cid);
                  var modifiedid = $('#modified-license-info-' +  cid);
                  var conditionsid = $('#additional-conditions-info-' + cid);
                  var newid = $('#new-license-info-' +  cid);
                  var name = $(this).attr('name');
                  var action = name.substr(name.lastIndexOf('-')+1);  
                  var message = parent.find('.message');
                  
                  var existingcontval = contributorsid.find('select').val() ;
                  var existinglicval = existingid.find('select').val();
                  
                  var modifiedlicenseval = modifiedid.find('select').val();
                  var modifiedtitle = modifiedid.find('[name="license-title-modify"]').val();
                  var modifiedconditions = conditionsid.find('[name="license-conditions-modify"]').val();
                  
                  var newtitle = newid.find('[name="license-title"]').val();
                  var newcond = newid.find('[name="new-license-conditions"]').val();
                  
                  message.hide();
                  
                  var licenseinfo = {
                    'cid' : cid,
                    'nid' : nid,
                    'existing-contributors' : existingcontval,
                    'new-licensee-first' : contributorsid.find('.fname-cname').val(),
                    'new-licensee-last' : contributorsid.find('.lname-cname').val(),
                    'new-licensee-cc' : contributorsid.find('.cc-cname:checked') ? true : false,
                    'existing-license' : existinglicval,
                    'modified-license-title' : modifiedtitle,
                    'modified-existing-license' : modifiedlicenseval,
                    'license-conditions-modify' : modifiedconditions,
                    'new-license-title' : newtitle,
                    'new-license-conditions' : newcond,
                    'new-license-source' : newid.find('[name="new-license-source"]').val(),
                    'action' : action
                  }
                  
                  //console.log(licenseinfo);

                   // input validation;
                   
                  $post = true;
                  
                  message.html('<p>Please provide the following information and resubmit:</p>');

                  var listelem = ''
                  
                  // contributor validation - all buttons
                  
                  var lastname = contributorsid.find('.lname-cname').val();

                 if ((existingcontval == '0'|| existingcontval == null) && ( lastname == Drupal.settings.artmoblicense.defaultlastname || lastname == '' || lastname == null)) {
                   message.show();
                   listelem += '<li>Select an existing licensee or provide a new one.</li>';
                   contributorsid.find('select').css('border','1px solid red');
                   contributorsid.find('input').css('border','1px solid red');
                   $post = false;
                 }

                                    
                // existing license validation
                                     
                if ($(this).attr('name') == 'license-submit-existing') {
                   if (existinglicval == 0 || existinglicval == null) {
                     message.show();
                     listelem += '<li>Select an existing license to attach.</li>';
                     existingid.find('select').css('border','1px solid red');
                     $post = false;
                   }
                }
                
                // modified license validation
                                    
                if ($(this).attr('name') == 'license-submit-modified') {
                   if (modifiedlicenseval == 0 || modifiedlicenseval == null) {
                     message.show();
                     listelem += '<li>Select a license to modify.</li>';
                     modifiedid.find('select').css('border','1px solid red');
                     $post = false;
                   }
                   
                   if (modifiedtitle == Drupal.settings.artmoblicense.defaultlicensetitle || modifiedtitle == '' || modifiedtitle == null) {
                     message.show();
                     listelem += '<li>Provide a name for your modified license.</li>';
                     modifiedid.find('input').css('border','1px solid red');
                     $post = false;
                   }
                   
                   if (modifiedconditions == Drupal.settings.artmoblicense.defaultconditions|| modifiedconditions == '' || modifiedconditions == null) {
                     message.show();
                     listelem += '<li>Add additional conditions to your modified license.</li>';
                     modifiedid.find('textarea').css('border','1px solid red');
                     $post = false;
                   }
                }
                
                // new license validation
                
                if ($(this).attr('name') == 'license-submit-new') {
                  if (newtitle == Drupal.settings.artmoblicense.defaultlicensetitle || newtitle == '' || newtitle == null) {
                     message.show();
                     listelem += '<li>Provide a name for your new license.</li>';
                     newid.find('input').css('border','1px solid red');
                     $post = false;
                  }
                  
                  if (newcond == Drupal.settings.artmoblicense.defaultnewconditions || newcond == null) {
                     message.show();
                     listelem += '<li>Provide terms and conditions for your new license.</li>';
                     newid.find('textarea').css('border','1px solid red');
                     $post = false;
                  }
                }
                
                message.append('<ul>' + listelem + '</ul>');
                
                 
                if ($post == true) {
                	 //console.log('Posting');
                   $.post('/artmob_license/licenses/update',
                   { licenseinfo: JSON.stringify(licenseinfo) },
                    function (data) {
                          var result = Drupal.parseJson(data);
                          //console.log(result);
                          license.replaceWith(result['html']);
                          artmob_license_bind_ui();  // rebinds click event for newly inserted element
                          return false;
                   });
                 }

            });
        });

    $('.remove-license-btn').each(function() {
	    $(this)
	    	.unbind('click')
        .bind('click', function() {
	          var license = $(this).parents('.licenses');
	          var id = license.find('[name="license-remove-nid"]').val();
	          var ntype = license.find('[name="license-remove-nid-type"]').val()
	          $.post('/artmob_license/licenses/delete',{ 'id': id, 'ntype' : ntype },
            function(data) {
              var result = Drupal.parseJson(data);
              license.replaceWith(result['html']);
              artmob_license_bind_ui();  // rebinds click event for newly inserted element
              return false;
            }
	          );
          });
        });
        
    artmob_license_add_corporate_contributor_ui();        
        
}

function artmob_license_add_corporate_contributor_ui() {

		$('.cc-cname').unbind('change').bind('change',function() {
			var val = jQ14(this).val();
			var cvalues = jQ14(this).closest('.new-contributor');
			
			if (jQ14(this).is(':checked')) {
			  jQ14(this).val(1);
			  cvalues.find('.fname-cname').fadeOut(600,function() {});
			  cvalues.find('.lname-cname').each(function() {
			  	if (jQ14(this).val() == 'Last Name') {
			  		jQ14(this).val('Corporation Name');
			  	}
			  });
			  
			} else {
			  jQ14(this).val(0);
			  cvalues.find('.fname-cname').fadeIn(600,function() {});
			  cvalues.find('.lname-cname').each(function() {
			  	if (jQ14(this).val() == 'Corporation Name') {
			  		jQ14(this).val('Last Name');
			  	}
			  });
			}
		});
}