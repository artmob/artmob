/*
 * jQuery Fast Confirm
 * version: 1.1.0 (2010-09-28)
 * @requires jQuery v1.3.2 or later
 *
 * Examples and documentation at: http://blog.pierrejeanparra.com/jquery-plugins/fast-confirm/
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
;(function(jQ14) {
	
	jQ14.fn.fastConfirm = function(options) {
		var params;
		
		if (!this.length) {
			return this;
		}
			
		jQ14.fastConfirm = {
			defaults: {
				position: 'bottom',
				offset: {top: 0, left: 0},
				questionText: "Are you sure?",
				proceedText: "Yes",
				cancelText: "No",
				fastConfirmClass: "fast_confirm",
				onProceed: function(trigger) {},
				onCancel: function(trigger) {}
			}
		};
		
		params = jQ14.extend(jQ14.fastConfirm.defaults, options || {});
		
		return this.each(function() {
			var offset,
				topOffset,
				leftOffset,
				trigger = this,
				jQ14confirmYes = jQ14('<button class="' + params.fastConfirmClass + '_proceed">' + params.proceedText + '</button>'),
				jQ14confirmNo = jQ14('<button class="' + params.fastConfirmClass + '_cancel">' + params.cancelText + '</button>'),
				jQ14confirmBox = jQ14('<div class="' + params.fastConfirmClass + '"><div class="' + params.fastConfirmClass + '_arrow_border"></div><div class="' + params.fastConfirmClass + '_arrow"></div>' + params.questionText + '<br/></div>'),
				jQ14arrow = jQ14('div.' + params.fastConfirmClass + '_arrow', jQ14confirmBox),
				jQ14arrowBorder = jQ14('div.' + params.fastConfirmClass + '_arrow_border', jQ14confirmBox),
				confirmBoxArrowClass,
				confirmBoxArrowBorderClass,
				offset = jQ14(trigger).offset();
			
			if (!jQ14(trigger).data('fastconfirm_binded')) {
				// Register actions
				jQ14confirmYes.click(function() {
					params.onProceed(trigger);
					jQ14(trigger).removeData('fastconfirm_binded');
					jQ14(this).closest('div.' + params.fastConfirmClass).remove();
				});
				
				jQ14confirmNo.click(function() {
					params.onCancel(trigger);
					jQ14(trigger).removeData('fastconfirm_binded');
					jQ14(this).closest('div.' + params.fastConfirmClass).remove();
				});
				
				// Append the confirm box to the body. It will not be visible as it is off-screen by default. Positionning will be done at the last time
				jQ14confirmBox.append(jQ14confirmYes).append(jQ14confirmNo);
				jQ14('body').append(jQ14confirmBox);
				
				// Calculate absolute positionning depending on the trigger-relative position 
				switch (params.position) {
					case 'top':
						confirmBoxArrowClass = params.fastConfirmClass + '_bottom';
						confirmBoxArrowBorderClass = params.fastConfirmClass + '_bottom';
						
						jQ14arrow.addClass(confirmBoxArrowClass).css('left', jQ14confirmBox.outerWidth()/2 - jQ14arrow.outerWidth()/2);
						jQ14arrowBorder.addClass(confirmBoxArrowBorderClass).css('left', jQ14confirmBox.outerWidth()/2 - jQ14arrowBorder.outerWidth()/2);
						
						topOffset = offset.top - jQ14confirmBox.outerHeight() - jQ14arrowBorder.outerHeight() + params.offset.top;
						leftOffset = offset.left - jQ14confirmBox.outerWidth()/2 + jQ14(trigger).outerWidth()/2 + params.offset.left;
						break;
					case 'right':
						confirmBoxArrowClass = params.fastConfirmClass + '_left';
						confirmBoxArrowBorderClass = params.fastConfirmClass + '_left';
						
						jQ14arrow.addClass(confirmBoxArrowClass).css('top', jQ14confirmBox.outerHeight()/2 - jQ14arrow.outerHeight()/2);
						jQ14arrowBorder.addClass(confirmBoxArrowBorderClass).css('top', jQ14confirmBox.outerHeight()/2 - jQ14arrowBorder.outerHeight()/2);
						
						topOffset = offset.top + jQ14(trigger).outerHeight()/2 - jQ14confirmBox.outerHeight()/2 + params.offset.top;
						leftOffset = offset.left + jQ14(trigger).outerWidth() + jQ14arrowBorder.outerWidth() + params.offset.left;
						break;
					case 'bottom':
						confirmBoxArrowClass = params.fastConfirmClass + '_top';
						confirmBoxArrowBorderClass = params.fastConfirmClass + '_top';
						
						jQ14arrow.addClass(confirmBoxArrowClass).css('left', jQ14confirmBox.outerWidth()/2 - jQ14arrow.outerWidth()/2);
						jQ14arrowBorder.addClass(confirmBoxArrowBorderClass).css('left', jQ14confirmBox.outerWidth()/2 - jQ14arrowBorder.outerWidth()/2);
						
						topOffset = offset.top + jQ14(trigger).outerHeight() + jQ14arrowBorder.outerHeight() + params.offset.top;
						leftOffset = offset.left - jQ14confirmBox.outerWidth()/2 + jQ14(trigger).outerWidth()/2 + params.offset.left;
						break;
					case 'left':
						confirmBoxArrowClass = params.fastConfirmClass + '_right';
						confirmBoxArrowBorderClass = params.fastConfirmClass + '_right';
						
						jQ14arrow.addClass(confirmBoxArrowClass).css('top', jQ14confirmBox.outerHeight()/2 - jQ14arrow.outerHeight()/2);
						jQ14arrowBorder.addClass(confirmBoxArrowBorderClass).css('top', jQ14confirmBox.outerHeight()/2 - jQ14arrowBorder.outerHeight()/2);
						
						topOffset = offset.top + jQ14(trigger).outerHeight()/2 - jQ14confirmBox.outerHeight()/2 + params.offset.top;
						leftOffset = offset.left - jQ14confirmBox.outerWidth() - jQ14arrowBorder.outerWidth() + params.offset.left;
						break;
				}
				
				// Make the confirm box appear right where it belongs
				jQ14confirmBox.css({
					top: topOffset,
					left: leftOffset
				});
				
				jQ14(trigger).data('fastconfirm_binded', true);
			}
		});
	};

})(jQ14);