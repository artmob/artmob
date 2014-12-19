<?php
// $Id: book.inc,v 1.1.2.6 2008/03/29 13:37:28 nedjo Exp $

/**
 * Implementation of hook_activemenu().
 */
function book_activemenu() {
  $items = array();
  $items['#block-book-0'] = 'activemenu/book';
  return $items;
}

/**
 * Implementation of hook_activemenu().
 *
 * Note that this menu is only for .inc files in activemenu's directory.
 * Other modules should implement hook_menu() directly.
 */
function book_activemenu_menu($may_cache) {
  $items = array();
  if ($may_cache) {
    $items[] = array(
      'path' => 'activemenu/book',
      'title' => t('activemenu book'),
      'access' => user_access('access content'),
      'type' => MENU_CALLBACK,
      'callback' => 'activemenu_js_book',
    );
  }
  return $items;
}

/**
 * Menu callback. Handle the activemenu for book menus.
 *
 * This callback is registered in activemenu_menu().
 */
function activemenu_js_book() {
  if ($path = activemenu_get_request_path()) {
    // The book menu will use the nid as the key, so we take the second part of the path which will be the nid.
    $arg = explode('/', $path);
    $nid = $arg[1];
    print drupal_to_js(array('status' => TRUE, 'content' => book_tree($nid, 5, array($nid))));
  }
  exit();
}