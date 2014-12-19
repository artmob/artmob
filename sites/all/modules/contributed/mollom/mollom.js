// $Id: mollom.js,v 1.1.2.4 2009/07/30 23:41:28 davereid Exp $

if (Drupal.jsEnabled) {
  $(function() {
    $('a#audio-captcha').click(getAudioCaptcha);
    $('a#image-captcha').click(getImageCaptcha);
  });
}

function getAudioCaptcha() {
  // Extract the Mollom session ID from the form:
  var mollomSessionId = $("input#edit-session-id").val();

  // Retrieve an audio CAPTCHA:
  var data = $.get(Drupal.settings.mollom_base_url + 'mollom/captcha/audio/' + mollomSessionId,
    function(data) {
     // When data is successfully loaded, empty the captcha-div
     // and replace its content with an audio CAPTCHA:
     $('div#captcha').empty().append(data);

     // Add an onclick-event handler for the new link:
     $('a#image-captcha').click(getImageCaptcha);
   });
   return false;
}

function getImageCaptcha() {
  // Extract the Mollom session ID from the form:
  var mollomSessionId = $('input#edit-session-id').val();

  // Retrieve an audio CAPTCHA:
  var data = $.get(Drupal.settings.mollom_base_url + 'mollom/captcha/image/' + mollomSessionId,
    function(data) {
     // When data is successfully loaded, empty the captcha-div
     // and replace its content with an audio CAPTCHA:
     $('div#captcha').empty().append(data);

     // Add an onclick-event handler for the new link:
     $('a#audio-captcha').click(getAudioCaptcha);
   });
   return false;
}
