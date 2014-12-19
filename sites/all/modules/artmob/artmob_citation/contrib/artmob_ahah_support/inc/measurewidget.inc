<?php

// ***************************************************************************
// EXPAND WIDGET FUNCTIONS
// ***************************************************************************

/**
 * Called by #process for widget emements
 *
 */
function artmob_measurement_expand($element, $arg2, $node) {
  //I had to do a work-around because
  //when the last element was deleted
  //(so there were no more of this element type left
  //on the form <except for the template one>)
  //for some reason the last deleted one gets
  //added back when this function is called.
  //I found out that the count($arg2) is always
  //0 when loading and greater than 1 if there
  //are any of this element on this form.
  //If there never were elements on the form then
  //it is 0.
  //BUT!!!!
  // if there were elements and they were deleted
  //then the count($arg2) is 1.  So the workaround in this
  //case is to blank out the widgets by setting
  //$element[$name] to a blank array
  if ( count($arg2) == 1 ) {
    $element[$name] = array();
    return $element;
  }

  $name = $element['#name']; // name of this widget, set in the containing form
  $edit = $element['#post']; // get the posted parameters

  // set flag so nodeapi can find the widget
  if ($node->type) {
          variable_set('artmob_measurement_'. $node->type, TRUE );
  }

  // create a tree of the names of all widgets in the form -- needed for formapi:insert
  $element['measure_widget_names'] = array(
          '#type' => 'item',
          '#tree' => TRUE,
  );
  $element['measure_widget_names'][$name] = array(
          '#type' => 'hidden',
          '#value' => $name,
  );

  // put in wrapper that will allow contents to be swapped out by the js update
  // also create bindings for the dynamic elements that will be added
  $element[$name] = array(
    '#tree' => TRUE,
    '#prefix' => '<div id="widget_wrapper_'. $name .'">',
    '#suffix' => '</div>',
    '#ahah_bindings' => array(
      array(
        'selector' => 'input.widget_remove_'. $name,
        'wrapper' => 'widget_wrapper_'. $name,
        'event' => 'click',
        'path' => 'artmob_measurement/widget_update_js',
        'params' => array( 'widget_name_js' => $name ),
      ),
    ),
  );

  // actually build the widget and put it in the wrapper
  $element[$name] += _artmob_measurement_build_widget( $name, $edit[$name], $node );
  return $element;
}


function _artmob_measurement_build_widget($name, $edit, $node=NULL) {
  // get the preexisting subwidgets - can be in either $edit or $node
  $subwidgets = _artmob_measurement_extract_subwidgets($name, $edit, $node);
  // process add and remove commands - modifies $subwidgets
  $subwidgets = _artmob_measurement_process_subwidget_commands( $name, $edit, $subwidgets );
  // expand the $subwidgets array into form elements - modifies $element
  $widget = _artmob_measurement_expand_subwidgets( $name, $subwidgets );
  // add a control block for adding new subwidgets - modifies $element
  $widget += _artmob_measurement_add_new_subwidget_control( $name, $edit );

  return $widget;
}

/**
 * Extract the widget description from the post array
 * If post is empty, we may be doing an edit -> load into node
 * Or fresh add with no widgets
 */
function _artmob_measurement_extract_subwidgets($name, $edit, $node) {
  //This can cause a problem when you remove the last widget
  //because it would then take what was loaded
  //which was the previous settings before the edit.
  //See the work-around above in the _expand function
  $subwidgets = array();

  if ( is_array( $edit['subwidgets'] ) ) {
    $subwidgets = $edit['subwidgets'];
  }
  elseif ( is_array($node->$name) ) {
    // widgets have been loaded into node (by apinode:load)
    $widget = $node->$name;
    $subwidgets = $widget['subwidgets'];
  }
  return $subwidgets;
}

/**
 * Modify the subwidgets array based on commands in the $edit
 * Side effect: if subwidget is successfully added, remove entry from $edit
 */
function _artmob_measurement_process_subwidget_commands( $name, &$edit, $subwidgets ) {
  if ( is_array($edit) && count($edit) > 0 ) {
    // process the potention addition...what is potention???
    $new_subwidget = $edit['new_subwidget'];
    if ( $new_subwidget['measurement_value'] ) {
      $subwidget_id = db_next_id('subwidget'); // get distinct id for subwidget (overkill but easy)
      $subwidgets[$subwidget_id] = $new_subwidget;
      // remove from params, so it doesn't show up on the form (consume), but only on successful add
      unset( $edit['new_subwidget'] );
    }

    // now process the removes
    foreach ( $subwidgets as $subwidget_id => $subwidget ) {
      if ( isset( $subwidget['remove'] ) )  {
              unset( $subwidgets[$subwidget_id] );
      }
    }
  }
  return $subwidgets;
}

/**
 * Expand the subwidgets into form elements
 */
function _artmob_measurement_expand_subwidgets( $name, $subwidgets ) {
  $element['subwidgets'] = array(
    '#tree' => TRUE,
    '#attributes' => array( 'id' => 'widget_subwidgets_'. $name ),
    '#theme' => 'artmob_measurement_subwidgets',
  );
  foreach ( $subwidgets as $subwidget_id => $subwidget ) {
    $type_code[$subwidget_id] = artmob_measurement_BuildCode48List();
    $unit_code[$subwidget_id] = artmob_measurement_BuildCode50List();

    $element['subwidgets'][$subwidget_id] = array(
      '#tree' => TRUE,
    );
    $element['subwidgets'][$subwidget_id]['measurement_type_code'] = array(
      '#type'                 => 'select',
      '#options'              => $type_code[$subwidget_id],
      '#default_value' => $subwidget['measurement_type_code'],
    );
    $element['subwidgets'][$subwidget_id]['measurement_unit_code'] = array(
      '#type'                 => 'select',
      '#options'              => $unit_code[$subwidget_id],
      '#default_value' => $subwidget['measurement_unit_code'],
    );
    $element['subwidgets'][$subwidget_id]['measurement_value'] = array(
      '#type'          => 'textfield',
      '#size'          => 10,
      '#default_value' => $subwidget['measurement_value'],
      '#required'      => FALSE,
    );
    $element['subwidgets'][$subwidget_id]['remove'] = array(
      '#type' => 'checkbox',
      '#default_value' => $subwidget['remove'],
      '#attributes' => array( 'class' => 'widget_remove_'. $name ),
    );
  }
  return $element;
}

/**
 * control to add subwidget to widget
 */
function _artmob_measurement_add_new_subwidget_control($name, $edit) {
  $element['new_subwidget'] = array(
    '#type' => 'fieldset',
    '#title' => t( 'Add Dimensions' ),
    '#theme' => 'artmob_measurement_new_subwidget',
    '#tree' => TRUE,
  );

  $type_code = array();
  $type_code = artmob_measurement_BuildCode48List();
  $element['new_subwidget']['measurement_type_code'] = array(
    '#type'                 => 'select',
    '#title'                => t( 'Measurement Type Code' ),
    '#options'              => $type_code,
    '#value' => $edit['new_subwidget']['measurement_type_code'] ? $edit['new_subwidget']['measurement_type_code'] : '01',
  );

  $unit_code = array();
  $unit_code = artmob_measurement_BuildCode50List();
  $element['new_subwidget']['measurement_unit_code'] = array(
                  '#type'                 => 'select',
                  '#title'                => t( 'Units' ),
                  '#options'              => $unit_code,
      '#value' => $edit['new_subwidget']['measurement_unit_code'] ? $edit['new_subwidget']['measurement_unit_code'] : 'cm',
  );

  $element['new_subwidget']['measurement_value'] = array(
    '#type'          => 'textfield',
    '#title'         => t('Value'),
    '#size'          => 10,
    '#value' => $edit['new_subwidget']['measurement_value'] ? $edit['new_subwidget']['measurement_value'] : '',
    '#required'      => FALSE,
  );
  $element['new_subwidget']['add_subwidget_button'] = array(
    '#type' => 'button',
    '#value' => t( 'Add New Dimension' ),
    '#id' => 'widget_add_subwidget_button_'. $name,
    '#ahah_bindings' => array(
      array(
        'wrapper' => 'widget_wrapper_'. $name,
        'event' => 'click',
        'path' => 'artmob_measurement/widget_update_js',
        'params' => array( 'widget_name_js' => $name ),
      ),
    ),
  );
  return $element;
}

// ****************************************************************
// JAVASCRIPT FUNCTIONS
// ****************************************************************

/**
 * hook_menu - incremental update needs its own entry point
 */
function artmob_measurement_menu($may_cache) {
  $items = array();
  if (!$may_cache) {
    $items[] = array(
      'path' => 'artmob_measurement/widget_update_js',
      'callback' => '_artmob_measurement_update_js',
      'access' => TRUE,
      'type' => MENU_CALLBACK,
    );
  }
  return $items;
}
/**
 * Called by javascript to do AJAH based form updating
 */
function _artmob_measurement_update_js() {
  $name = $_POST['widget_name_js'];
  print _artmob_measurement_build_widget_js( $name, $_POST );
}

// Pulled out of widget_update_js for easier testing
function _artmob_measurement_build_widget_js( $name, $edit ) {
  $widget[$name] = array( '#tree' => TRUE, );
  $widget[$name] += _artmob_measurement_build_widget( $name, $edit[$name] );

  $form = form_builder( 'ahah_widget', $widget );
  return theme('status_messages') . drupal_render($form);
}

// ********************************************************************************
// WIDGET_NODEAPI - handle the database interactions
// ********************************************************************************

function artmob_measurement_load_widgets( $node, &$widget_name ) {
  $additions = array();
  $result = db_query('SELECT widget_name, subwidget_id, measurement_type_code, measurement_unit_code, measurement_value '.
                      'FROM {am_citation_measurement} '.
                      'WHERE nid = %d '.
                      'ORDER BY subwidget_id', $node->nid);
  while ($row = db_fetch_array($result)) {
    $widget_name = $row['widget_name'];
    $subwidget_id = $row['subwidget_id'];
    if ( !is_array( $additions[$widget_name] ) ) {
      $additions[$widget_name] = array();
      $additions[$widget_name]['subwidgets'] = array();
    }
    $additions[$widget_name]['subwidgets'][$subwidget_id] = array(
    'measurement_type_code' => $row['measurement_type_code'],
    'measurement_unit_code' => $row['measurement_unit_code'],
    'measurement_value' => $row['measurement_value'],
    );
    $widget_names[$widget_name] = $widget_name; // rebuild widget name list
    $additions['measure_widget_names'][$widget_name] = $widget_name;
  }
  return $additions;
}
/**
 * hook_nodeapi
 */
function artmob_measurement_nodeapi( &$node, $op ) {
  if ( variable_get( 'artmob_measurement_'. $node->type, FALSE ) ) {
    switch($op) {
      // info flow db -> node -> form -> node -> db
      case load: // Load Widgets in from db
        return artmob_measurement_load_widgets( $node, $widget_name );
        break;
      case view:
        break;
      case update:
        // keep life simple and do update by just deleting and then inserting
        db_query("DELETE FROM {am_citation_measurement} WHERE nid = '%d'", $node->nid );
      case insert:
        if ( count( $node->measure_widget_names ) ) {
          foreach ( $node->measure_widget_names as $widget_name ) {
            $widget = $node->$widget_name;
            if (count( $widget['subwidgets'] ) != 0 ) {
              foreach ( $widget['subwidgets'] as $subwidget_id => $subwidget ) {
                db_query("INSERT INTO {am_citation_measurement} ".
                         "(nid, widget_name, subwidget_id, measurement_type_code, measurement_unit_code, measurement_value) ".
                         " VALUES (%d, '%s', %d, '%s', '%s', '%s')",
                         $node->nid, $widget_name, $subwidget_id,
                         $subwidget['measurement_type_code'], $subwidget['measurement_unit_code'], $subwidget['measurement_value']
                );
              }
            }
          }
        }
        break;
    }
  } else {
    switch ($op) {
      // info flow db -> node -> form -> node -> db
      case load: // Load Widgets in from db
        return array();
    }
  }
}

// ************************************************************************************
// THEMING FUNCTIONS
// ************************************************************************************

/**
 * Make sure the widget acutally shows up on the form
 */
function theme_artmob_measurement($element) {
  $output .= theme('form_element', $element, $element['#children']);
  return $output;
}

/**
 * Theme the subwidgets as a table, one subwidget per row
 */
function theme_artmob_measurement_new_subwidget(&$form) {
  $rows = array();
  $row = array();
  $row[] = drupal_render($form['measurement_type_code']);
  $row[] = drupal_render($form['measurement_unit_code']);
  $row[] = drupal_render($form['measurement_value']);
  $rows[] = $row;
  $output = theme('table', array('class' => ''), $rows);
  $output .= drupal_render($form);
  return $output;
}

function artmob_measurement_sort_by_subwidget_id($a, $b) {
  if ($a['subwidget_id'] == $b['subwidget_id']) {
    return 0;
  }
  return ($a['subwidget_id'] < $b['subwidget_id']) ? -1 : 1;
}

/**
 * Theme the add new subwidget subform as a single row.
 */
function theme_artmob_measurement_subwidgets(&$form) {
  foreach (element_children($form) as $key) {
    $row = array();
    $row[] = drupal_render($form[$key]['remove']);
    $row[] = drupal_render($form[$key]['measurement_type_code']);
    $row[] = drupal_render($form[$key]['measurement_unit_code']);
    $row[] = drupal_render($form[$key]['measurement_value']);
    //sort by the key (subwidget_id)
    $rows[] = array( 'data' => $row, 'class' => 'sortableitem', 'subwidget_id' => $key );
  }
  if ( count($rows) > 0 ) {
    usort( $rows, artmob_measurement_sort_by_subwidget_id ); // sort the subwidgets by weight
    $header = array( t('Remove'), t('Measurement Type Code'), t('Units'), t('Value'));
    $output = theme('table', $header, $rows, array( 'class' => 'sortable', 'id' => $form['#attributes']['id'] ) );
  }
  $output .= drupal_render($form);
  return $output;
}

function artmob_measurement_BuildCode48List() {
  $return = array();
  $result = db_query("SELECT * FROM {am_citation_measurement_type}
                      ORDER BY product_id");

  while ( $data = db_fetch_object($result)) {
    $return[$data->product_id] = $data->description;
  }
  return $return;
}

function artmob_measurement_BuildCode50List() {
  $return = array();
  $result = db_query("SELECT * FROM {am_citation_measurement_unit}
                      ORDER BY product_id");

  while ( $data = db_fetch_object($result)) {
    $return[$data->product_id] = $data->description;
  }
  return $return;
}

