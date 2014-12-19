var contexts;  // make contexts a global variable;
var matched = [];

$('document').ready(function() {
	contexts = Drupal.parseJson(Drupal.settings.amglossary.contexts);
	//console.log(contexts);
	artmob_glossary_create_overlay();
	artmob_glossary_render_links();
});

function artmob_glossary_sub() {
		i=0;
		
		for (e in contexts) {
			var elem = $(e);
			if (elem.length > 0) {
				var tid = "tempid-" + i;
				i++;
				
				if (elem.attr("id") == '') { // provide a temporary ID if element doesn't have one.
					elem.attr("id",tid);
				} else {
					tid = elem.attr("id");
				}
			
				for (t in contexts[e]) {
					var rendered = contexts[e][t];
					//console.log(rendered);
					
					var treg = new RegExp ("(" + t + "[es\?\.\,]?[s\?\.\,]?[\?\.\,]?)(?![a-zA-Z0-9])","im"); // looks for plurals and trailing punctuation
					//var treg = new RegExp ("(" + t + ")(?![a-zA-Z0-9])","im"); // looks for plurals and trailing punctuation
					surroundInElement(document.getElementById(tid),treg,createSpan,rendered);
				}
			}
		}		
		
}


function artmob_glossary_create_overlay() {
   $('body').append("<div id='artmob-glossary-overlay'></div><div id='textframe-glossary' class='textframe'><div class='textframe-topcap'></div><div class='textframe-content'></div><div class='textframe-bottomcap'></div></div>");	
   var textframe = $('#textframe-glossary');
   var overlay = $('#artmob-glossary-overlay');
   textframe
   	.hide()
   	.bind('click',function() {
				textframe.animate({ opacity: 0}, 300).hide();
   	  	overlay.animate({ opacity : 0}, 300).hide();
   		 });
   		 
   overlay
		.hide()
		.css('background-color','black')
		.css('background-repeat','repeat')
		.css('width','100%')
		.css('height','5000px')
		.css('z-index',200)
		.css('position','absolute')
		.css('top','0')
		.css('opacity',0)
		.bind('click',function() {
				textframe.animate({ opacity: 0}, 300).hide();
   	  	$(this).animate({ opacity : 0}, 300).hide();
   		 });
   
   $('body').append("<div id='artmob-glossary-entries' style='display:none'></div>");
}

function artmob_glossary_render_links() {
		$('.glossary-inline').remove(); // remove existing glosses to avoid duplicates
		$('.glosspan').each(function() {
			var contents = $(this).html();
			$(this).replaceWith(contents);
		});
		artmob_glossary_sub();
		$('.glossary-item').each(function() {
			var p = $(this).parent('.glossary-inline');	
			if (p.find('.gloss-link').length == 0) {		
				p.prepend(Drupal.settings.amglossary.imagelink);
				p.find('.gloss-link').bind('click', function(e) {
						var text = p.find('.glossary-item').html();
						
						// add text to textframe and position;
						
						$('#textframe-glossary .textframe-content').html(text);
						$('#textframe-glossary')
							.positionToMouse(e)
							.show()
							.animate({ opacity : 1}, 300);
						$('#artmob-glossary-overlay')
							.show()
							.animate({ opacity : .8}, 300);
							
						//$('#artmob-glossary-overlay .textframe-content').css('opacity',1);
				});
		}
			
		});
};

jQuery.fn.positionToMouse = function(e) {
  
  var st =  $(window).scrollTop();
  var sl =  $(window).scrollLeft();
  
	var wh = $(window).height();
  var ww = $(window).width();
  
  var oh = this.outerHeight();
  var ow = this.outerWidth();

	var itop = e.pageY - (oh / 2);  // initial position vertically centres object with cursor
	var ileft = e.pageX + 10; // initial position is to the right of the cursor
	
	var ftop,fleft; // final position
	
	if (itop < (st - 10)) {  // top of object is cut off or cramped 
		ftop = st + 10;
	} else if ((itop + oh) > (wh + st)) { // bottom of object is cut off
		ftop = st + (wh - oh - 10);
	} else {
		ftop = itop; // just right
	}
	
	if ((ileft + ow + sl) > ww) { // right of object is cut off
		fleft = sl + (e.pageX - ow - 20);  // position to left of cursor
	} else {
		fleft = ileft + sl;
	}

	this.css("position","absolute");
  this.css("top", (ftop + "px"));
  this.css("left", (fleft +  "px"));
  return this;
}

jQuery.fn.centre = function () {
  this.css("position","absolute");  
  this.css("top", (($(window).height() - this.outerHeight()) / 2) + $(window).scrollTop() - 200 + "px");
  this.css("left", (($(window).width() - this.outerWidth()) / 2) + $(window).scrollLeft() - 250 + "px");
  return this;
}



/* This function courtesy of meouw http://stackoverflow.com/users/12161/meouw */

function getOffset( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}
//var x = getOffset( document.getElementById('yourElId') ).left; 


/* The functions below are thanks to Tim Down: http://stackoverflow.com/users/96100/tim-down */


// Reusable generic function
function surroundInElement(el, regex, surrounderCreateFunc,append) {
    // script, style and option elements are left alone
    var prohibclass = new RegExp('\\b' + 'gtext' + '\\b');
    if (!/^(script|style|option|select)$/.test(el.tagName)) {
    		if (!prohibclass.test(el.className)) {
					var child = el.lastChild;
					while (child) {
							if (child.nodeType == 1) {
									surroundInElement(child, regex, surrounderCreateFunc,append);
							} else if (child.nodeType == 3) {
									surroundMatchingText(child, regex, surrounderCreateFunc,append);
							}
							child = child.previousSibling;
					}
        }
    }
}

// Reusable generic function
function surroundMatchingText(textNode, regex, surrounderCreateFunc,append) {
    var parent = textNode.parentNode;
    //console.log('textnode: ' + textNode.data);
    var result, surroundingNode, matchedTextNode, matchLength, matchedText;
    
    while ( textNode && (result = regex.exec(textNode.data)) && (!/(<script|<style|<option|<select)/.test(parent.outerHTML))) {  // for some reason the surroundInElement function is letting some prohibited tags go.  this is an extra level of check.   
    
        matchedTextNode = textNode.splitText(result.index);
        matchedText = result[0];
        //matchedText = result[1];
        //console.log('prespan: ' + matchedText);
        matchLength = matchedText.length;
        textNode = (matchedTextNode.length > matchLength) ?
            matchedTextNode.splitText(matchLength) : null;
        surroundingNode = surrounderCreateFunc(matchedTextNode.cloneNode(true),append);
        parent.insertBefore(surroundingNode, matchedTextNode);
        parent.removeChild(matchedTextNode);
        
        matched.push(matchedText);
    }
}

// This function does the surrounding for every matched piece of text
// and can be customized  to do what you like
function createSpan(matchedTextNode,append) {
		//console.log('spanning');
    var el = document.createElement("span");
    el.className = "glosspan";
    el.appendChild(matchedTextNode);
    $(el).append(append);
    return el;
}

// The main function
function wrapWords(container, words) {
    // Replace the words one at a time to ensure "test2" gets matched
    for (var i = 0, len = words.length; i < len; ++i) {
        surroundInElement(container, new RegExp(words[i], "g"), createSpan);
    }
}

function glossaryPlaceInlineEntry(term,text,target) {
		var inlinehtml = Drupal.settings.amglossary.inlinehtml;
		var output = inlinehtml.replace('%term%',term);
		var output = output.replace('%text%',text);
		
		if (target != null)  {
			$('#' + target).html(output);
		} else {
			return output;
		}
		//<div class='gejsframe'><script type='text/javascript'>glossaryPlaceInlineEntry('Term','Text.')</script></div>
		
		//document.write(output);

		
}

//wrapWords(document.getElementById("container"), ["test2", "test"]);

/*
 function decode_base64(s) {
    var e={},i,k,v=[],r='',w=String.fromCharCode;
    var n=[[65,91],[97,123],[48,58],[47,48],[43,44]];

    for(z in n){for(i=n[z][0];i<n[z][1];i++){v.push(w(i));}}
    for(i=0;i<64;i++){e[v[i]]=i;}

    for(i=0;i<s.length;i+=72){
    var b=0,c,x,l=0,o=s.substring(i,i+72);
         for(x=0;x<o.length;x++){
                c=e[o.charAt(x)];b=(b<<6)+c;l+=6;
                while(l>=8){r+=w((b>>>(l-=8))%256);}
         }
    }
    return r;
    }*/