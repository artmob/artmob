/* $Id: admin_menu.menu.js,v 1.1.2.1 2008/07/14 12:38:04 sun Exp $ */

if (Drupal.jsEnabled) {
  $(document).ready(function() {
    // Collapse menus on menu administration page.
    $('div.box:not(.admin-menu-processed)').each(function() {
      $(this).addClass('admin-menu-processed')
        .find('.content')
          .wrap('<fieldset class="collapsible collapsed"></fieldset>');
      var menuLegend = document.createElement('legend');
      $(menuLegend).html($('h2', this).text());
      $(this).find('h2').remove().end()
        .find('fieldset').prepend(menuLegend);
    });
  });
}
