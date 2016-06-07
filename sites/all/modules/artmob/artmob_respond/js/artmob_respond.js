$(document).ready(function() {

   $('body').append("<div id='artmob-overlay'></div>");	
   $('#artmob-overlay').hide();
   $('#artmob-overlay').css('background-color','black');
   $('#artmob-overlay').css('background-color','black');
   $('#artmob-overlay').css('background-repeat','repeat');
   $('#artmob-overlay').css('width','100%');
   $('#artmob-overlay').css('height','4000px');
   $('#artmob-overlay').css('z-index',199);
   $('#artmob-overlay').css('position','absolute');
   $('#artmob-overlay').css('top','0');
   $('#artmob-overlay').css('opacity',0);

   $('.afd-panel').hide();
   $('.afd-panel').addClass('inactive');
   $('.afd-panel').css('opacity',0);
   $('.afd-panel').css('position','relative');
   $('.afd-panel').css('z-index',200);
   
   artmob_respond_ui();


	var a = (window.location.href.split('#')) ;
	
	var fragment = null;
	
	var i=0;
	
	$('#tabs-tabbed_content ul.anchors li').each(function() {  // quick hack to add ids to tabs on license tab
		i++;
		$(this).attr('id','tc-' + i.toString());
	});

	
	var tc1 = $('#tc-1');
	var tc2 = $('#tc-2');
	
	switch (a[1]) {
		case Drupal.settings.artmobrespond.knowmorefr:
			fragment = Drupal.settings.artmobrespond.knowmorefr;
			tc1.find('a').trigger('click');
			break;
			
		case Drupal.settings.artmobrespond.domorefr:
			fragment = Drupal.settings.artmobrespond.domorefr;
			tc2.find('a').trigger('click');
			break;
			
		case Drupal.settings.artmobrespond.learnmorefr:
			fragment = Drupal.settings.artmobrespond.learnmorefr;
			break;
			
		default:
			fragment = null;
	}
		
	
});

function artmob_respond_ui() {
   $('#artmob-overlay').bind('click',function() {
   	  	$(this).animate({ opacity : 0}, 300).hide();
		$('.afd-panel').animate({ opacity : 0}, 300).hide();
   });
   
   $('.afd-panel').not('a').bind('click',function() {
   				$(this).css('z-index',0);
   			    $('#artmob-overlay').animate({ opacity : 0}, 300).hide();
   				$(this).animate({ opacity : 0},300).removeClass('active').addClass('inactive').hide();
   });
   
   $('.afd-icon a').not('.afd-panel a').each(function() {
   		var id = $(this).parent('.afd-icon').attr('id');
   		var panel = id + '-panel';
   		$(this).css('cursor','pointer');
   		$(this).bind('click',function() {
   			if ($('#' + panel).hasClass('active')) { // hide
   				$('#' + id).css('z-index',0);
   			    $('#artmob-overlay').animate({ opacity : 0}, 300).hide();
   				$('#' + panel).animate({ opacity : 0},300).removeClass('active').addClass('inactive').hide();
   			} else { //show
   				$('#' + id).css('position','relative').css('z-index',201);
   			    $('#artmob-overlay').show().animate({ opacity : .8}, 300);
   				$('#' + panel).show().removeClass('inactive').addClass('active').animate({ opacity : .8}, 300);
   			}
   			
   		});
   });
}