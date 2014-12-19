/* $Id: README.txt,v 1.3.2.2.4.2 2008/03/16 21:14:35 douggreen Exp $ */

Developer Module that assists with code review and version upgrade that
supports a plug-in extensible hook system so contributed modules can
define additional review standards.

Built-in support for:
 - Drupal Coding Standards - http://drupal.org/node/318
 - Handle text in a secure fashion - http://drupal.org/node/28984
 - Converting 4.6.x modules to 4.7.x - http://drupal.org/node/22218
 - Converting 4.7.x modules to 5.x - http://drupal.org/node/64279

Installation
------------

Copy coder.module to your module directory and then enable on the admin
modules page.  Enable the modules that admin/settings/coder works on,
then view the coder results page at coder.
