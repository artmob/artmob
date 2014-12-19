// self-contained user interface widgets. 

jQ14(document).ready(function() {
// 	jQ14.bind('globalbinding',function() {
// 			alert('binding!');
// 
// 		jQ14('.add-new-contributor').bind('click',function() {
// 			alert('hola');
// 			jQ14(this).closest('.new-contributor').find('.add-new-contributor-container').show();
// 		});
// 	});

});

function afd_ui_bindings() {
		jQ14('.add-new-contributor').unbind('click');
		jQ14('.add-new-contributor').bind('click',function() {
			var cvalues = jQ14(this).closest('.cvalues');
			cvalues.find('.select-cname').fadeOut(600, function() {
				jQ14(this).remove();
			});
			jQ14(this).fadeOut(200, function() {
				// jQ14(this).remove();
			});
			cvalues.find('.add-new-contributor-container').fadeIn(600,function() {
				jQ14(this).show();
			});;
		});
		
		jQ14('.cc-cname').unbind('change');
		jQ14('.cc-cname').bind('change',function() {
			var val = jQ14(this).val();
			var cvalues = jQ14(this).closest('.cvalues');
			
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

		jQ14('.delete-contributor-btn').unbind('click');
		jQ14('.delete-contributor-btn').bind('click',function() {
			var ans = confirm("Are you sure?");
			if (ans)
			   jQ14(this).closest('.cvalues').remove();
		});

		jQ14('.delete-info-btn').unbind('click');
		jQ14('.delete-info-btn').bind('click',function() {
			var ans = confirm("Are you sure?");
			if (ans)		
			   jQ14(this).closest('.cvalues').remove();
		});
		
    	jQ14('.fd-title').bind('keyup',function(e) { // intercepts return character which would otherwise "submit" the form
    		var val = jQ14(this).val();
    		var parent = jQ14(this).closest('.work').attr('id');
			jQ14('#' + parent + ' .work-title').not('#' + parent + ' .nested-works .work-title').html(val)			
        });
        
        jQ14('.work > .banner .close a').each(function() {
            var anchor = this;
            var container = jQ14(this).closest('.work').find('> .innerwork');
            afd_ui_close(anchor,container);
            
            
        // Change input widgets
        jQ14('.select-cfield').unbind('change');
        jQ14('.select-cfield').bind('change',function() {
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
           
//         	jQ14(this).css('cursor','pointer');
//         	jQ14(this).unbind('click');
//         	jQ14(this).bind('click',function() {
//         		jQ14(this).closest('.work').find('> .innerwork').slideToggle('slow',function() {
//         			if (jQ14(anchor).hasClass('inactive')) {
//         				jQ14(anchor).removeClass('inactive').addClass('active');
//         				jQ14(anchor).html("Open");
//         			} else {
//         				jQ14(anchor).removeClass('active').addClass('inactive');
//         				jQ14(anchor).html("Close");
//         			}
//         		}) ;
//         	});
        });
        
        afd_ui_toggle();
        
        
}

function afd_ui_close(anchor,container) {
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

function afd_ui_toggle() {
        jQ14('.fd-remove-btn').each(function() {
        	  var button = this;	
        		
        	  jQ14(button).bind('click',function() {
        	  		jQ14(button).fastConfirm({ // only bind after first change!
					  position: 'bottom',
					  questionText: 'This will remove this work and its nested works.  Do you want to proceed?',
					  proceedText: 'Remove works',
					  cancelText: 'Cancel',
					  onProceed: function(trigger) { 
						  jQ14(button).closest('.work').animate({opacity: 0},'slow');
						  jQ14(button).closest('.work').remove();
					  },
					  onCancel: function(trigger) {}
					});
			  });
		});
		

}