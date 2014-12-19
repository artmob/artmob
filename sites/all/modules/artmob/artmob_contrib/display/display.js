function display_setCommonHeight(nodes) {

	var maxheight = display_setCommonHeight.arguments.length > 1 ? display_setCommonHeight.arguments[1] : 900; //corrupted data may cause some nodes to be rendered with an extreme height.
	var factor = display_setCommonHeight.arguments.length > 2 ? display_setCommonHeight.arguments[2] : 0;
  var h = 0;
  
	nodes.each(function() {
	  var curheight = $(this).height();
	  		console.log(curheight);

		  if (curheight > h) {
			  h = curheight;   
		  }
	});

  if (h>maxheight) { 
  	h = maxheight; 
  }
	
	//$(this).css('border','1px dotted red');
  nodes.height(h + factor); 
  
  return (h + factor);
}


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