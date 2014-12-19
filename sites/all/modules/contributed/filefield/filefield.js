// $Id: filefield.js,v 1.1.2.5 2008/12/03 22:03:54 drewish Exp $

/**
 *  Auto Attach standard client side file input validation
 */
Drupal.filefieldValidateAutoAttach = function() {
  $("input[@type='file']").change( function() {
    // Remove any previous errors.
    $('.file-upload-js-error').remove();

    /**
     * Add client side validation for the input[@file] accept attribute.
     */
    var accept = this.accept.replace(/,\s*/g, '|');
    if (accept.length > 1) {
      var v = new RegExp('\\.(' + accept + ')$', 'gi');
      if (!v.test(this.value)) {
        var error = 'The selected file ' + this.value + ' cannot not be uploaded. Only files with the following extensions are allowed: ' + accept.replace(/\|/g, ', ');

        // What do I prepend this to?
        $(this).before('<div class="messages error file-upload-js-error">' + error + '</div>');
        this.value = '';
        return false;
      }
    }

    /**
     * Add filesize validation where possible.
     */
    /* @todo */
  });
}

// Global killswitch
if (Drupal.jsEnabled) {
  $(document).ready(Drupal.filefieldValidateAutoAttach);
}

