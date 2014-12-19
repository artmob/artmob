// $Id: delete_all.js,v 1.1.2.2 2007/12/26 23:20:58 douggreen Exp $

if (Drupal.jsEnabled) {
  $(document).ready(function () {
    function check_buttons() {
      if ($('#delete-all-content .delete-all').is(':checked')) {
        $('#delete-all-content .form-checkboxes input').attr('checked', 'checked').attr('disabled', 'disabled');
      }
      else {
        $('#delete-all-content .form-checkboxes input').removeAttr('checked').removeAttr('disabled');
        if ($('#delete-all-content fieldset').is('.collapsed')) {
          Drupal.toggleFieldset($('#delete-all-content fieldset'));
        }
      }
    }

    $('#delete-all-content .delete-all').click(function () {
      check_buttons();
    });

    check_buttons();
  }); 
}
