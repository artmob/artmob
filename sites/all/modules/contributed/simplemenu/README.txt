# $Id: README.txt,v 1.4.2.11 2007/11/22 19:34:55 m3avrck Exp $


--- README  -------------------------------------------------------------

SimpleMenu, Version 4.0

Written by Ted Serbinski, aka, m3avrck
  hello@tedserbinski.com
  http://tedserbinski.com

Requirements: Drupal 5.0

Icons from: http://www.famfamfam.com/
jQuery Superfish: http://users.tpg.com.au/j_birch/plugins/superfish/



--- INSTALLATION --------------------------------------------------------

1. Place simplemenu folder in your modules directory

2. Enable "SimpleMenu" under administer > site building > modules

3. Enable access to "view simplemenu" under administer > user management > access control

4. Configure menu to use under administer > site configuration > simplemenu



--- CHANGELOG --------------------------------------------------------

4.0, 2007-Nov-22
----------------------
- new CHANGELOG to keep track of changes
- #156256 upgrade to SuperFish 1.3
- upgrade to bgIframe 2.1.1 (for IE6 compatibility with forms)
- #136478 - fix Opera compatibility
- remove RTL option; this conflicts with other changes and is properly implemented in Drupal 6
- new option to select which theme to style SimpleMenu with, or provide a custom one
- #184051 - don't hardcode CSS, add class to body
- #180106 - fix missing translatable strings
- #144742 - don't show annoying anchor titles
- remove dependency on menu module, now works with menu module off
- new black & blue theme, design by Jeremy Caldwell (http://nerdliness.com/article/2007/11/01/simplemenu-module-customizations)
- alter height of menu and rollover to fix gaps
