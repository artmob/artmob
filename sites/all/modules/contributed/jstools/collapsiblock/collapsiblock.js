// $Id: collapsiblock.js,v 1.8.2.11 2008/04/14 16:10:32 nedjo Exp $

Drupal.behaviors.collapsiblock = function (context) {
  $('div.block:not(.collapsiblock-processed)', context).addClass('collapsiblock-processed').each(function () {
    var selector = Drupal.settings.collapsiblock && Drupal.settings.collapsiblock.titleSelector ? Drupal.settings.collapsiblock.titleSelector : 'h2';
    var id = this.id;
    var titleElt = $(selector +':first', this);
    if (titleElt.size()) {
      titleElt = titleElt[0];
      // Status values: 1 = not collapsible, 2 = collapsible and expanded, 3 = collapsible and collapsed
      var status = Drupal.settings.collapsiblock.blocks[this.id] ? Drupal.settings.collapsiblock.blocks[this.id] : Drupal.settings.collapsiblock.default_state;
      if (status == 1) {
        return;
      }
      titleElt.target = $(this).find('div.content');
      $(titleElt)
        .addClass('collapsiblock')
        .click(function () {
          var st = $.cookie('collapsiblock-' + id);
          $.cookie('collapsiblock-' + id, st == 0 ? 1 : 0, {path: Drupal.settings.jstools.basePath});
          if ($(this).is(".collapsiblockCollapsed")) {
            $(this).removeClass('collapsiblockCollapsed');
            $(this.target).slideDown(200);
          } 
          else {
            $(this).addClass('collapsiblockCollapsed');
            $(this.target).slideUp(200);
          }
        });
      if (((status == 3 && (! $.cookie('collapsiblock-' + id))) || $.cookie('collapsiblock-' + id) == 1) && !$(this).find('a.active').size()) {
        $(titleElt).addClass('collapsiblockCollapsed');
        $(titleElt.target).hide();
      }
      else {
        $.cookie('collapsiblock-' + id, 0, {path: Drupal.settings.jstools.basePath});
      }
    }
  });
};

