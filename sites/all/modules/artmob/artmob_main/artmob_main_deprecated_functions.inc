<?php 
  
function artmob_main_deprecated_functions_views_style_plugins() {
  $plugins = array();

  $plugins['am_teaser'] = array(
    'name' => t('Artmob Browser: Teaser List'),
    'theme' => 'artmob_main_display');
  $plugins['am_teaser_no_tab'] = array(
    'name' => t('Artmob Browser: Teaser List without Tabs'), // added. /bk
    'theme' => 'artmob_main_display',
  );  
  $plugins['am_node'] = array(
    'name' => t('Artmob Browser: Full Nodes'),
    'theme' => 'artmob_main_display',
  );

  return $plugins;
}

function artmob_main_goto_browse_all(){
  $view = views_get_view('artmob_browse_all');
  drupal_goto( $view->url.'/all/all' );
}


function artmob_main_goto_audio(){
  $view = views_get_view('artmob_audio');
  drupal_goto( $view->url );
}

function artmob_main_goto_digitized_works (){
  $view = views_get_view('artmob_digitized_works');
  drupal_goto( $view->url );
}

function artmob_main_goto_images (){
  $view = views_get_view('artmob_images');
  drupal_goto( $view->url );
}

function artmob_main_goto_video (){
  $view = views_get_view('artmob_video');
  drupal_goto( $view->url );
}

function artmob_main_goto_articles(){
  $view = views_get_view('artmob_articles');
  drupal_goto( $view->url );
}

function artmob_main_goto_links(){
  $view = views_get_view('artmob_links');
  drupal_goto( $view->url );
}

function artmob_main_goto_contributors(){
  $view = views_get_view('artmob_contributors');
  drupal_goto( $view->url );
}


?>