/* $Id: README.txt,v 1.1.4.2 2008/05/30 21:41:14 sun Exp $ */

This module facilitates the upgrade of jQuery in Drupal 5.  jQuery 1.0.1 is
included with Drupal 5, however it is not very well supported in the jQuery
community. In order to use most current and advanced jQuery functionality
you will want to build off a newer version of jQuery. This module includes
John Resig's compat-1.0.js and compat-1.1js plugins compiled into a compat.js
file that provides backwards compatiblity for newer versions of jQuery to work
with JavaScript code in Drupal 5.

The main issue with this module is that you will need to *copy* all *.js files
from the jquery_update/misc folder and place them in Drupal core's misc/ folder,
replacing each file with these updated JavaScript files.

If you fail to do this, the jQuery Update module will warn you about this
problem.

INSTALLATION:

1) Place this module directory in your modules folder (this will usually be
   "sites/all/modules/").

2) Enable the module.

3) Copy all *.js files from the jquery_update/misc folder and place them in
   Drupal core's misc/ folder, replacing the files that already exist.

   Note: You will receive a warning message in Drupal's administration area if
   you do not perform this step correctly.

You will need to repeat step #3 whenever you update your Drupal installation.

