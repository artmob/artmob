/* allows Artmob modules to use jQuery 1.4 without interfering with existing jQuery functionality. */

var jQ14 = jQuery; // creates new jQuery 1.4 object
jQuery.noConflict(true); // restores to drupal standard