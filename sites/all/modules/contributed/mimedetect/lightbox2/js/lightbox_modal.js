// $Id: lightbox_modal.js,v 1.1.4.3 2009/01/05 15:58:35 snpower Exp $

function lightbox2_login() {
  $("a[@href*='/user/login'], a[@href*='?q=user/login']").each(function() {
    $(this).attr({
      href: this.href.replace(/user\/login?/,"user/login/lightbox2"),
      rel: 'lightmodal[|width:250px; height:210px;]'
    });
  });
}

function lightbox2_contact() {
  $("a[@href*='/contact'], a[@href*='?q=contact']").each(function() {
    $(this).attr({
      href: this.href.replace(/contact?/,"contact/lightbox2"),
      rel: 'lightmodal[|width:450px; height:450px;]'
    });
  });
}

// Initialize the lightbox.
if (Drupal.jsEnabled) {
  $(document).ready(function(){
    if (Drupal.settings.lightbox2.enable_login) {
      lightbox2_login();
    }
    if (Drupal.settings.lightbox2.enable_contact) {
      lightbox2_contact();
    }
  });
}

