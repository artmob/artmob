// $Id: jscalendar.js,v 1.8.2.4 2008/03/29 13:37:28 nedjo Exp $

if (Drupal.jsEnabled) {
  $(document).ready(function() {
    $("input[@type='text'].jscalendar").each(function (){
      var id = $(this).attr('id');
      var form = this.form;
      var div = document.createElement('div');
      $(div)
        .html(' ... ')
        .attr('id', id + '-button')
        .addClass('jscalendar-icon');
      $(this)
        .after(div)
        .parent().addClass('jscalendar');

      var settings = [];
      settings['ifFormat'] = $('#' + id + '-jscalendar-ifFormat', form).size() > 0 ? $('#' + this.id + '-jscalendar-ifFormat', form).val() : '%Y-%m-%d %H:%M:%S';
      // We use eval() because the result is a boolean while our input is a string.
      settings['showsTime'] = $('#' + id + '-jscalendar-showsTime', form).size() > 0 ? eval($('#' + this.id + '-jscalendar-showsTime', form).val()) : true;
      settings['timeFormat'] = $('#' + id + '-jscalendar-timeFormat', form).size() > 0 ? $('#' + this.id + '-jscalendar-timeFormat', form).val() : '12';
      Calendar.setup({
        inputField  : id,
        ifFormat    : settings['ifFormat'],
        button      : id + '-button',
        showsTime   : settings['showsTime'],
        timeFormat  : settings['timeFormat']
      });
    });
  });
};
