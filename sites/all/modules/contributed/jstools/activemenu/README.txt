Drupal activemenu.module README.txt
==============================================================================

Makes standard Drupal menus into AJAX-based tree menus. Can also be used for
custom AJAX menus.


Requirements
------------------------------------------------------------------------------
This module is written for Drupal 5.0+ and requires the jstools.module to be
enabled.


Installation
------------------------------------------------------------------------------
Create a directory modules/activemenu (or, for easy updating, 
modules/jstools/activemenu) and copy all the module's files into it. Enable the
module via the administer > modules page.


Developer Usage
-----------------------------------------------------------------------------
Activemenu.module by default handles the standard navigation menu and all
menus generated as blocks by the Menu module.

To create your own activemenus:

1. Write a handler function in a module to accept a path argument (passed as
   a POST variable, 'href') and return an array of sub-items. For an example,
   see activemenu_js(). The sub-items are in the format based on that returned
   by menu_get_item() and have three array keys: children (boolean), path
   (the url of the item), and title (this will be rendered as the text of the
   menu item link).

Example:

function examplemodule_js() {
  if (isset($_POST['href'])) {
    $items = array();
    $path = $_POST['href'];
    switch ($path) {
      case 'examplemodule/parent1':
        $items[] = array(
          'path' => 'examplemodule/parent1/child1',
          'title' => t('First child option'),
          'children' => TRUE
        );
        $items[] = array(
          'path' => 'examplemodule/parent1/child2',
          'title' => t('Second child option'),
          'children' => FALSE
        );
        break;
      case 'examplemodule/parent1/child1':
        $items[] = array(
          'path' => 'examplemodule/parent1/child1/grandchild1',
          'title' => t('First grandchild option'),
          'children' => FALSE
        );
        break;
    }
    print drupal_to_js($items);
  }
  exit();
}

2. Make your handler accessible to the menu system.

Example:

/**
 * Implementation of hook_menu().
 */
function examplemodule_menu($may_cache) {
  $items = array();
  if ($may_cache) {
    $items[] = array(
      'path' => 'examplemodule/js',
      'title' => t('examplemodule'),
      'access' => user_access('access content'),
      'type' => MENU_CALLBACK,
      'callback' => 'examplemodule_js'
     );
  }
  return $items;
}

3. Implement hook_activemenu().

This hook returns an array of page elements to attach the activemenu behaviour to.

Array keys are valid jQuery selectors, while values are the path to load data from.

For example:

function user_activemenu() {
  $items = array();
  $items['#examplemodule-activemenu'] = 'examplemodule/js';
  return $items;
}