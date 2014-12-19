/* $Id: README.txt,v 1.12.2.16 2009/01/16 20:39:34 sun Exp $ */

-- SUMMARY --

The Drupal administration menu module displays the entire administrative
menu tree (and most local tasks) in a drop-down menu, providing administrators
one- or two-click access to most pages. Other modules may also add menu
links to administration menu using hook_admin_menu().

For a full description of the module, visit the project page:
  http://drupal.org/project/admin_menu

To submit bug reports and feature suggestions, or to track changes:
  http://drupal.org/project/issues/admin_menu


-- REQUIREMENTS --

None.


-- INSTALLATION --

* Install as usual, see http://drupal.org/node/70151 for further information.


-- CONFIGURATION --

* Configure user permissions in Administer >> User management >> Access control
  >> admin_menu module:

  - access administration menu

    Users in roles with the "access administration menu" permission will see
    the administration menu at the top of each page.

  - display drupal links

    Users in roles with the "display drupal links" permission will receive
    links to Drupal.org issue queues for all enabled contributed modules. The
    issue queue links appear under the administration menu icon.)

  Note that the menu items displayed in the administration Menu depend on the
  actual permissions of the viewing user. For example, the "User management"
  menu item is not displayed to a user who is not a member of a role with the
  "administer access control" and "administer users" permissions.

* Customize the menu settings in Administer >> Site configuration >>
  Administration menu.

* To prevent administrative menu items from appearing twice, you may hide the
  "Navigation" menu block, or move the "Administer" menu items into a separate
  menu.


-- CUSTOMIZATION --

* To override the default administration menu icon, you may:

  1) Disable it via CSS in your theme:

     body #admin-menu-icon { display: none; }

  2) Alter the image by overriding the theme function:

     Copy the entire theme_admin_menu_icon() function into your template.php,
     rename it to phptemplate_admin_menu_icon() or THEMENAME_admin_menu_icon(),
     and customize the output according to your needs.

  Please bear in mind that admin_menu's output is cached. You need to clear your
  site's cache (probably best using Devel module, or by manually truncating the
  cache_menu database table) to see any changes of your theme override function.

* To override the font size, add the following line to your theme's stylesheet:

  body #admin-menu { font-size: 10px; }


-- TROUBLESHOOTING --

* If the menu does not display, check the following:

  - Are the "access administration menu" and "access administration pages"
    permissions enabled for the appropriate roles?

  - Does your theme output the $closure variable?

* If the menu is rendered behind a Flash movie object, add this property to your
  Flash object(s):

  <param name="wmode" value="transparent" />

  See http://drupal.org/node/195386 for further information.


-- FAQ --

Q: Content management >> Create content items are not displayed, although the
   user has been granted access to create content. Why?

A: This issue is caused by the circumstance that no other administrative menu
   item below Content management is visible for the user. Because of that,
   Drupal does not render this menu grouping item at all, and admin_menu is
   therefore not able to add the items below Create content.

   If you grant just one other permission for that user role, for example
   'administer taxonomy', the whole Content management item should show up.

Q: When the administration menu module is enabled, blank space is added to the
   bottom of my theme. Why?

A: This is caused by a long list of links to module issue queues at Drupal.org.
   Just go to Administer >> User management >> Access control >> admin_menu and
   disable the permission "display drupal links" for your or all roles.
   Since uid 1 always has all permissions, this link list cannot be disabled
   for uid 1.


Q: After upgrading to 5.x-2.x, admin_menu disappeared. Why?

A: This should not happen. If it did, visit
   http://<yoursitename>/admin/build/menu to re-generate your menu.


Q: Can I configure the administration menu module to display another menu (like
   the Navigation menu, for instance)?

A: No. As the name implies, administration menu module is for administrative
   menu links only. However, you can copy and paste the contents of
   admin_menu.css into your theme's stylesheet and replace #admin-menu with any
   other menu block id (#block-menu-1, for example).


Q: Sometimes, the user counter displays a lot of anonymous users, but no spike
   of users or requests appear in Google Analytics or other tracking tools.

A: If your site was concurrently spidered by search-engine robots, it may have
   a significant number of anonymous users for a short time. Most web tracking
   tools like Google Analytics automatically filter out these requests.

Q: After upgrading, admin_menu disappeared. Why?

A: Prior to release 5.x-1.2, Drupal Administration Menu was output in a block.
   Since 5.x-1.2, it is output via hook_footer(). Some custom themes may not
   (yet) output $closure, so admin_menu could no longer be displayed. If you
   decided to move the 'administer' tree into a new menu and disabled that menu
   block, a site could become (temporarily) unmaintainable. Either way, you
   should fix your theme by adding the following code in front of the closing
   HTML (</html>) tag:
<code>
   <?php echo $closure; ?>
</code>

Q: After upgrading, the menu item 'administer' is no longer removed. Why?

A: Prior to release 5.x-1.2, Drupal Administration Menu was output via
   hook_block(), which allowed to alter the global menu array. Since 5.x-1.2, it
   is output via hook_footer() and thus no longer able to alter the menu. As
   long as there will be no built-in solution in an upcoming release, you may
   perform the following steps as a workaround:
   - Create a new menu.
   - Edit the menu item 'administer' and select the new menu as parent.

Q: I enabled "Aggregate and compress CSS files", but I found admin_menu.css is
   still there, is it normal?

A: Yes, this is the intended behavior. Since admin_menu is only visible for
   logged-on administrative users, it would not make sense to load its
   stylesheet for all, including anonymous users.

Q: Why are sub-menus not visible in Opera?

A: In the Opera browser preferences under "web pages" there is an option to fit
   to width. By disabling this option, sub-menus in the administration menu
   should appear.


Q: How can the administration menu be hidden on certain pages?

A: You can suppress it by simply calling the following function in PHP:

     module_invoke('admin_menu', 'suppress');

   However, this needs to happen as early as possible in the page request, so
   placing it in the theming layer (resp. a page template file) is too late.
   Ideally, the function is called in hook_init() in a custom module.  If you do
   not have a custom module, placing it into some conditional code at the top of
   template.php may work out, too.


-- CONTACT --

Current maintainers:
* Daniel F. Kudwien (sun) - dev@unleashedmind.com
* Stefan M. Kudwien (smk-ka) - dev@unleashedmind.com

This project has been sponsored by:
* UNLEASHED MIND
  Specialized in consulting and planning of Drupal powered sites, UNLEASHED
  MIND offers installation, development, theming, customization, and hosting
  to get you started. Visit http://www.unleashedmind.com for more information.

* Lullabot
  Friendly Drupal experts providing professional consulting & education
  services. Visit http://www.lullabot.com for more information.

* Acquia
  Commercially Supported Drupal. Visit http://acquia.com for more information.

