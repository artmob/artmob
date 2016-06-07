<?php

// ***************************************************************************
// EXPAND WIDGET FUNCTIONS
// ***************************************************************************

/**
 * Called by #process for widget emements
 *
 */

function artmob_identifier_expand($element, $arg2, $node) {
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
    variable_set('artmob_identifier_'. $node->type, TRUE );
  }

  // create a tree of the names of all widgets in the form -- needed for formapi:insert
  $element['identifier_widget_names'] = array(
    '#type' => 'item',
    '#tree' => TRUE,
  );
  $element['identifier_widget_names'][$name] = array(
    '#type' => 'hidden',
    '#value' => $name,
  );

  // put in wrapper that will allow contents to be swapped out by the js update
  $element[$name] = array(
    '#tree' => TRUE,
      '#prefix' => '<div id="widget_wrapper_'. $name .'">',
      '#suffix' => '</div>',
      '#ahah_bindings' => array(
        array(
          'selector' => 'input.widget_remove_'. $name,
          'wrapper' => 'widget_wrapper_'. $name,
          'event' => 'click',
          'path' => 'artmob_identifier/widget_update_js',
          'params' => array( 'widget_name_js' => $name ),
        ),
      ),
  );

  // actually build the widget and put it in the wrapper
  $element[$name] += _artmob_identifier_build_widget( $name, $edit[$name], $node );
  return $element;
}


function _artmob_identifier_build_widget($name, $edit, $node=NULL) {
  // get the preexisting subwidgets - can be in either $edit or $node
  $subwidgets = _artmob_identifier_extract_subwidgets($name, $edit, $node);
  // process add and remove commands - modifies $subwidgets
  $subwidgets = _artmob_identifier_process_subwidget_commands( $name, $edit, $subwidgets );
  // expand the $subwidgets array into form elements - modifies $element
  $widget = _artmob_identifier_expand_subwidgets( $name, $subwidgets );
  // add a control block for adding new subwidgets - modifies $element
  $widget += _artmob_identifier_add_new_subwidget_control( $name, $edit );

  return $widget;
}

function _artmob_identifier_extract_subwidgets($name, $edit, $node) {
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

//
// Modify the subwidgets array based on commands in the $edit
// Side effect: if subwidget is successfully added, remove entry from $edit
//
function _artmob_identifier_process_subwidget_commands( $name, &$edit, $subwidgets ) {
  if ( is_array($edit) && count($edit) > 0 ) {
    // process the potention addition...what is potention???
    $new_subwidget = $edit['new_subwidget'];
    if ( $new_subwidget['identifier_type_name'] || $new_subwidget['identifier_type_value'] ) { // there was something typed into new_file fields
      // validate that we have enough info to add a subwidget - can't do this in nodeapi:validate, b/c by then the form is already built
      if ( !$new_subwidget['identifier_type_name'] ) {
        form_set_error( "widgets][$name][new_subwidget][identifier_type_name", 'Need to include identifier type name to add new identifier' );
      }
      else if ( !$new_subwidget['identifier_type_value'] ) {
        form_set_error( "widgets][$name][new_subwidget][identifier_type_value", 'Need to include identifier type value to add new identifier' );
      }
      else { // we are good to do add
        $subwidget_id = db_next_id('subwidget'); // get distinct id for subwidget (overkill but easy)
        $subwidgets[$subwidget_id] = $new_subwidget;
        // remove from params, so it doesn't show up on the form (consume), but only on successful add
        unset( $edit['new_subwidget'] );
      }
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

//
// Expand the subwidgets into form elements
//
function _artmob_identifier_expand_subwidgets( $name, $subwidgets ) {
  $element['subwidgets'] = array(
      '#tree' => TRUE,
      '#attributes' => array( 'id' => 'widget_subwidgets_'. $name ),
      '#theme' => 'artmob_identifier_subwidgets',
  );

  foreach ( $subwidgets as $subwidget_id => $subwidget ) {
    $type_code[$subwidget_id] = artmob_identifier_BuildCode5List();

    $element['subwidgets'][$subwidget_id] = array(
      '#tree' => TRUE,
    );

    $element['subwidgets'][$subwidget_id]['identifier_type_code'] = array(
      '#type'     => 'select',
      '#options'    => $type_code[$subwidget_id],
      '#default_value' => $subwidget['identifier_type_code'],
    );

    $element['subwidgets'][$subwidget_id]['identifier_type_name'] = array(
      '#type'          => 'textfield',
      '#default_value' => $subwidget['identifier_type_name'],
      '#required'      => FALSE,
      '#autocomplete_path' => 'js/artmob_identifier_name/autocomplete',
    );

    $element['subwidgets'][$subwidget_id]['identifier_type_value'] = array(
      '#type'          => 'textfield',
      '#default_value' => $subwidget['identifier_type_value'],
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

//
// control to add subwidget to widget
//
function _artmob_identifier_add_new_subwidget_control($name, $edit) {
  $element['new_subwidget'] = array(
      '#type' => 'fieldset',
      '#title' => t( 'Add Identifiers' ),
      '#theme' => 'artmob_identifier_new_subwidget',
      '#tree' => TRUE,
  );

  $type_code = artmob_identifier_BuildCode5List();

  $element['new_subwidget']['identifier_type_code'] = array(
    '#type'     => 'select',
    '#title'    => 'Identifier Type',
    '#options'    => $type_code,
    '#value' => $edit['new_subwidget']['identifier_type_code'],
  );

  $element['new_subwidget']['identifier_type_name'] = array(
    '#type'          => 'textfield',
    '#title'         => t('Name'),
    '#value' => $edit['new_subwidget']['identifier_type_name'],
    '#description'   => t('Enter the identifier type name.'),
    '#required'      => FALSE,
    '#autocomplete_path' => 'js/artmob_identifier_name/autocomplete',
  );

  $element['new_subwidget']['identifier_type_value'] = array(
    '#type'          => 'textfield',
    '#title'         => t('Value'),
    '#value' => $edit['new_subwidget']['identifier_type_value'],
    '#description'   => t('Enter the identifier type value.'),
    '#required'      => FALSE,
  );

  $element['new_subwidget']['add_subwidget_button'] = array(
    '#type' => 'button',
    '#value' => t( 'Add New Identifier' ),
    '#id' => 'widget_add_subwidget_button_'. $name,
    '#ahah_bindings' => array(
      array(
        'wrapper' => 'widget_wrapper_'. $name,
        'event' => 'click',
        'path' => 'artmob_identifier/widget_update_js',
        'params' => array( 'widget_name_js' => $name ),
      ),
    ),
  );
  return $element;
}

// ****************************************************************
// JAVASCRIPT FUNCTIONS
// ****************************************************************
//
// Creates the artmob identifier convert page
// It is one big button and a short description of the button. What could be simpler?
//
function artmob_identifier_convert_form() {
  $form = array();
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Convert the identifier fields'),
    '#prefix' => t('This will convert the identifier fields from the old format to the new format.'),
  );

  return $form;
}

function artmob_identifier_convert_form_submit($form_id, $form_values) {
  if ( $form_values['op'] == 'Convert the identifier fields' ) {
    $result = db_query("SELECT * FROM {am_citation} WHERE identifier_type_name_1 <> ''
                                                    or identifier_type_name_2 <> ''
                                                    or identifier_type_value_1 or
                                                    identifier_type_value_2" );
    while ($row = db_fetch_object($result)) {
      if ( $row-> identifier_type_name_1 <> '' or $row-> identifier_type_value_1 <> '' ) {
        if ( $row->link_nid ) {
          $nid = $row->link_nid;
        }
        else {
          $nid = $row->nid;
        }

        db_query( "INSERT INTO {am_citation_identifier}
                 SET nid = %d, widget_name = 'widgetidentifier1', subwidget_id = %d,
                 identifier_type_code = '%s', identifier_type_name = '%s',
                 identifier_type_value = '%s'",
                 $nid, db_next_id('subwidget'), $row->identifier_type_code_1,
                 $row->identifier_type_name_1, $row->identifier_type_value_1 );
      }


      if ( $row-> identifier_type_name_2 <> '' or $row-> identifier_type_value_2 <> '' ) {
        if ( $row->link_nid ) {
          $nid = $row->link_nid;
        }
        else {
          $nid = $row->nid;
        }

        db_query( "INSERT INTO {am_citation_identifier}
                 SET nid = %d, widget_name = 'widgetidentifier1', subwidget_id = %d,
                 identifier_type_code = '%s', identifier_type_name = '%s',
                 identifier_type_value = '%s'",
                 $nid, db_next_id('subwidget'), $row->identifier_type_code_2,
                 $row->identifier_type_name_2, $row->identifier_type_value_2 );
      }
    }
    $result = db_query("UPDATE {am_citation} SET is_merged = 1 WHERE identifier_type_name_1 <> ''
                                                    or identifier_type_name_2 <> ''
                                                    or identifier_type_value_1 or
                                                    identifier_type_value_2" );

    drupal_set_message( 'The identifiers have been converted' );
  }
}



//
// Called by javascript to do AJAH based form updating
//
function _artmob_identifier_update_js() {
  $name = $_POST['widget_name_js'];
  print _artmob_identifier_build_widget_js( $name, $_POST );
}

// Pulled out of widget_update_js for easier testing
function _artmob_identifier_build_widget_js( $name, $edit ) {
  $widget[$name] = array( '#tree' => TRUE, );
  $widget[$name] += _artmob_identifier_build_widget( $name, $edit[$name] );

  $form = form_builder( 'ahah_widget', $widget );
  return theme('status_messages') . drupal_render($form);
}

// ********************************************************************************
// WIDGET_NODEAPI - handle the database interactions
// ********************************************************************************

function artmob_identifier_load_widgets( $node, &$widget_name ) {
  $additions = array();
  $result = db_query('SELECT widget_name, subwidget_id, identifier_type_code, identifier_type_name, identifier_type_value '.
                        'FROM {am_citation_identifier} '.
                        'WHERE nid = %d '.
              'ORDER BY subwidget_id', $node->nid);

  $identifiers = array();
  $identifiers_by_type = array();

  while ($row = db_fetch_array($result)) {
    $widget_name = $row['widget_name'];
    $subwidget_id = $row['subwidget_id'];
    if ( !is_array( $additions[$widget_name] ) ) {
      $additions[$widget_name] = array();
      $additions[$widget_name]['subwidgets'] = array();
    }
    $additions[$widget_name]['subwidgets'][$subwidget_id] = array(
        'identifier_type_code' => $row['identifier_type_code'],
        'identifier_type_name' => $row['identifier_type_name'],
        'identifier_type_value' => $row['identifier_type_value'],
    );

    $widget_names[$widget_name] = $widget_name; // rebuild widget name list
      $additions['identifier_widget_names'] = $widget_names;

    $identifiers=array();
    $itc_result = db_query('SELECT DISTINCT(description) FROM {am_citation_identifier_type} WHERE product_id="%s"', $row['identifier_type_code']);
    if (db_num_rows($itc_result) > 0) {
      $identifier_type_code = db_fetch_object($itc_result);
      $identifiers[$row['identifier_type_value']] = array(
        'identifier_type_code' => $identifier_type_code->description,
        'identifier_type_name' => $row['identifier_type_name'],
        'identifier_type_value' => $row['identifier_type_value'],
      );
    }

    $additions['identifiers'] = $identifiers;

    // identifiers by type
    $identifiers_by_type = array();

    foreach ($identifiers as $id => $identifier) {
      $identifiers_by_type[$identifier['identifier_type_code']] = array('name' => $identifier['identifier_type_name'], 'value' => $identifier['identifier_type_value']);
    }

    $additions['identifiers_by_type'] = $identifiers_by_type;
  }
  return $additions;

}

//
// hook_nodeapi
//
function artmob_identifier_nodeapi( &$node, $op ) {
  if ( variable_get( 'artmob_identifier_'. $node->type, FALSE ) ) {
    switch ($op) {
      // info flow db -> node -> form -> node -> db
      case load: // Load Widgets in from db
        return artmob_identifier_load_widgets( $node, $widget_name );
        break;
      case view:
      // handled by theme.
        break;
      case update:
        // keep life simple and do update by just deleting and then inserting
        db_query("DELETE FROM {am_citation_identifier} WHERE nid = '%d'", $node->nid );
      case insert:
        //watchdog( 'identifier', print_r( $node, True ) );
        if ( count( $node->identifier_widget_names ) ) {
          foreach ( $node->identifier_widget_names as $widget_name ) {
            $widget = $node->$widget_name;
            if (count( $widget['subwidgets'] ) != 0 ) {
              foreach ( $widget['subwidgets'] as $subwidget_id => $subwidget ) {
                db_query("INSERT INTO {am_citation_identifier} ".
                    "(nid, widget_name, subwidget_id, identifier_type_code, identifier_type_name, identifier_type_value) ".
                    " VALUES (%d, '%s', %d, '%s', '%s', '%s')",
                    $node->nid, $widget_name, $subwidget_id,
                    $subwidget['identifier_type_code'], $subwidget['identifier_type_name'], $subwidget['identifier_type_value']
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

//
// Make sure the widget acutally shows up on the form
//
function theme_artmob_identifier($element) {
  $output .= theme('form_element', $element, $element['#children']);
  return $output;
}

//
// Theme the subwidgets as a table, one subwidget per row
//
function theme_artmob_identifier_new_subwidget(&$form) {
  $rows = array();
  $row = array();
  $row[] = drupal_render($form['identifier_type_code']);
  $row[] = drupal_render($form['identifier_type_name']);
  $row[] = drupal_render($form['identifier_type_value']);
  $rows[] = $row;
  $output = theme('table', array('class' => ''), $rows);
  $output .= drupal_render($form);
  return $output;
}

function artmob_identifier_sort_by_subwidget_id($a, $b) {
  if ($a['subwidget_id'] == $b['subwidget_id']) {
    return 0;
  }
  return ($a['subwidget_id'] < $b['subwidget_id']) ? -1 : 1;
}

//
// Theme the add new subwidget subform as a single row.
//
function theme_artmob_identifier_subwidgets(&$form) {
  foreach (element_children($form) as $key) {
    $row = array();
    $row[] = drupal_render($form[$key]['remove']);
    $row[] = drupal_render($form[$key]['identifier_type_code']);
    $row[] = drupal_render($form[$key]['identifier_type_name']);
    $row[] = drupal_render($form[$key]['identifier_type_value']);
    //sort by the key (subwidget_id)
    $rows[] = array( 'data' => $row, 'class' => 'sortableitem', 'subwidget_id' => $key );
  }
  if ( count($rows) > 0 ) {
    usort( $rows, artmob_identifier_sort_by_subwidget_id ); // sort the subwidgets by subwidget_id
    $header = array(t('Remove'), t('Identifier Type'), t('Name'), t('Value') );
    $output = theme('table', $header, $rows, array( 'class' => 'sortable', 'id' => $form['#attributes']['id'] ) );
  }
  $output .= drupal_render($form);
  return $output;
}

function artmob_identifier_BuildCode5List() {
  $return = array();
  $result = db_query("SELECT * FROM {am_citation_identifier_type}
                      ORDER BY product_id");

  while ( $data = db_fetch_object($result)) {
    $return[$data->product_id] = $data->description;
  }
  return $return;

}

function artmob_identifier_autocomplete_identifier_name($string = '') {
  $matches = array();
  if ($string) {
    $result = db_query_range("SELECT identifier_type_name FROM {am_citation_identifier} WHERE LOWER(identifier_type_name) LIKE LOWER('%s%%')", $string, 0, 10);
    while ($data = db_fetch_object($result)) {
      $matches[$data->identifier_type_name] = check_plain($data->identifier_type_name);
    }
  }
  print drupal_to_js($matches);
  exit();
}

function theme_artmob_identifier_get_identifiers(&$node, $suppress_label=FALSE) {
  if (!is_array($node->identifiers_by_type)) {
    return;
  }

  $output .= "<div class='am-identifiers'>\n";


  foreach ($node->identifiers_by_type as $type => $identifier) {

    $label = strtolower($type) == 'proprietary' ? $identifier['name'] : $type;
    if ($suppress_label) {
      $output .= $identifier['value'];
    }
    else {
      $output .= theme('display_info_listing', $label, $identifier['value']);
    }

  }

  $output .= "</div>";

  return $output;

}

