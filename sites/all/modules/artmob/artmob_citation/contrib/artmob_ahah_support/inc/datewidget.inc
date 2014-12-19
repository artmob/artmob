<?php

// ***************************************************************************


// EXPAND WIDGET FUNCTIONS
// ***************************************************************************

/**
 * Called by #process for widget emements
 *
 */
function artmob_date_widget_expand($element, $arg2, $node) {
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
    variable_set('artmob_date_widget_'. $node->type, TRUE );
  }

  // create a tree of the names of all widgets in the form -- needed for formapi:insert
  $element['date_widget_names'] = array(
    '#type' => 'item',
    '#tree' => TRUE,
  );
  $element['date_widget_names'][$name] = array(
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
          'path' => 'artmob_date/widget_update_js',
          'params' => array( 'widget_name_js' => $name ),
        ),
     ),
  );

  // actually build the widget and put it in the wrapper
  $element[$name] += _artmob_date_build_widget( $name, $edit[$name], $node );
  return $element;
}


function _artmob_date_build_widget($name, $edit, $node=NULL) {
  // get the preexisting subwidgets - can be in either $edit or $node
  $subwidgets = _artmob_date_widget_extract_subwidgets($name, $edit, $node);
  // process add and remove commands - modifies $subwidgets
  $subwidgets = _artmob_date_widget_process_subwidget_commands( $name, $edit, $subwidgets );
  // expand the $subwidgets array into form elements - modifies $element
  $widget = _artmob_date_widget_expand_subwidgets( $name, $subwidgets );
  // add a control block for adding new subwidgets - modifies $element
  $widget += _artmob_date_widget_add_new_subwidget_control( $name, $edit );

  return $widget;
}

/**
 * Extract the widget description from the post array
 * If post is empty, we may be doing an edit -> load into node
 * Or fresh add with no widgets
 */
function _artmob_date_widget_extract_subwidgets($name, $edit, $node) {
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
function _artmob_date_widget_process_subwidget_commands( $name, &$edit, $subwidgets ) {
  if ( is_array($edit) && count($edit) > 0 ) {
    // process the potention addition...what is potention???
    $new_subwidget = $edit['new_subwidget'];
    if ( $new_subwidget['date_type_id']  ) {
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
function _artmob_date_widget_expand_subwidgets( $name, $subwidgets ) {
  $element['subwidgets'] = array(
      '#tree' => TRUE,
      '#attributes' => array( 'id' => 'widget_subwidgets_'. $name ),
      '#theme' => 'artmob_date_widget_subwidgets',
  );

  foreach ( $subwidgets as $subwidget_id => $subwidget ) {
    $date_types[$subwidget_id] = artmob_date_widget_build_date_list( True );
    $date_months[$subwidget_id] = artmob_date_widget_build_month_list( True, '' );
    $date_days[$subwidget_id] = artmob_date_widget_build_day_list( True, '' );

    $element['subwidgets'][$subwidget_id] = array(
      '#tree' => TRUE,
    );

    $element['subwidgets'][$subwidget_id]['date_type_id'] = array(
      '#type'     => 'select',
      '#options'    => $date_types[$subwidget_id],
      '#default_value' => $subwidget['date_type_id'],
    );

    $element['subwidgets'][$subwidget_id]['date_month'] = array(
      '#type'     => 'select',
      '#options'    => $date_months[$subwidget_id],
      '#default_value' => $subwidget['date_month'],
    );

    $element['subwidgets'][$subwidget_id]['date_day'] = array(
      '#type'     => 'select',
      '#options'    => $date_days[$subwidget_id],
      '#default_value' => $subwidget['date_day'],
    );

    $element['subwidgets'][$subwidget_id]['date_year'] = array(
      '#type'          => 'textfield',
      '#maxlength'     => 4,
      '#size'          => 4,
      '#default_value' => $subwidget['date_year'],
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
function _artmob_date_widget_add_new_subwidget_control($name, $edit) {
  $element['new_subwidget'] = array(
      '#type' => 'fieldset',
      '#title' => t( 'Add Date' ),
      '#theme' => 'artmob_date_widget_new_subwidget',
      '#tree' => TRUE,
  );

  $date_types = artmob_date_widget_build_date_list( True );
  $date_months = artmob_date_widget_build_month_list( True, '' );
  $date_days = artmob_date_widget_build_day_list( True, '' );

  $element['new_subwidget']['date_type_id'] = array(
    '#type'     => 'select',
    '#title'    => 'Date Type',
    '#options'    => $date_types,
    '#value' => $edit['new_subwidget']['date_type_id'],
  );

  $element['new_subwidget']['date_month'] = array(
    '#type'     => 'select',
    '#title'         => t('Month'),
    '#options'    => $date_months,
    '#value' => $edit['new_subwidget']['date_month'],
  );

  $element['new_subwidget']['date_day'] = array(
    '#type'     => 'select',
    '#title'         => t('Day'),
    '#options'    => $date_days,
    '#value' => $edit['new_subwidget']['date_day'],
  );

  $element['new_subwidget']['date_year'] = array(
    '#type'          => 'textfield',
    '#title'         => t('Year'),
    '#maxlength'     => 4,
    '#size'          => 4,
    '#value' => $edit['new_subwidget']['date_year'] ? $edit['new_subwidget']['date_year'] : '',
    '#required'      => FALSE,
  );

  $element['new_subwidget']['add_subwidget_button'] = array(
    '#type' => 'button',
    '#value' => t( 'Add New Date' ),
    '#id' => 'widget_add_subwidget_button_'. $name,
    '#ahah_bindings' => array(
      array(
        'wrapper' => 'widget_wrapper_'. $name,
        'event' => 'click',
        'path' => 'artmob_date/widget_update_js',
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
function artmob_date_widget_menu($may_cache) {
  $items = array();
  if ($may_cache) {
  }
  else {
    $items[] = array(
        'path' => 'artmob_date/widget_update_js',
        'callback' => '_artmob_date_update_js',
        'access' => TRUE,
        'type' => MENU_CALLBACK,
    );
  }
  return $items;
}

/**
 * Called by javascript to do AJAH based form updating
 */
function _artmob_date_update_js() {
  $name = $_POST['widget_name_js'];
  print _artmob_date_build_widget_js( $name, $_POST );
}

// Pulled out of widget_update_js for easier testing
function _artmob_date_build_widget_js( $name, $edit ) {
  $widget[$name] = array( '#tree' => TRUE );
  $widget[$name] += _artmob_date_build_widget( $name, $edit[$name] );

  $form = form_builder( 'ahah_widget', $widget );
  return theme('status_messages') . drupal_render($form);
}

// ********************************************************************************
// WIDGET_NODEAPI - handle the database interactions
// ********************************************************************************

function artmob_date_widget_load_widgets( $node, &$widget_name ) {
  $additions = array();
  $citation_id = artmob_citation_get_citation_id( $node->nid );
  $result = db_query( "SELECT r.citation_id, r.date_type_id, r.date_timestamp,
                       r.widget_name, r.sequence, r.date_day, r.date_month,
                       r.date_year
                       from {am_citation_dates} r
                       where citation_id = %d
                       order by sequence", $citation_id );

  while ($row = db_fetch_array($result)) {
    $widget_name = $row['widget_name'];
    $subwidget_id = $row['sequence'];
    if ( !is_array( $additions[$widget_name] ) ) {
      $additions[$widget_name] = array();
      $additions[$widget_name]['subwidgets'] = array();
    }

    $additions[$widget_name]['subwidgets'][$subwidget_id] = array(
        'date_type_id' => $row['date_type_id'],
        'date_day' => $row['date_day'],
        'date_month' => $row['date_month'],
        'date_year' => $row['date_year'],
    );

    $widget_names[$widget_name] = $widget_name; // rebuild widget name list

    $additions['date_widget_names'] = $widget_names;
  }
  return $additions;
}

/**
 * hook_nodeapi
 */
function artmob_date_widget_nodeapi( &$node, $op ) {
  if ( variable_get( 'artmob_date_widget_'. $node->type, FALSE ) ) {
    switch ($op) {
      // info flow db -> node -> form -> node -> db
      case load: // Load Widgets in from db
        return artmob_date_widget_load_widgets( $node, &$widget_name );
        break;
      case view:
         /* handled by theme */
        break;
      case update:
        $citation_id = artmob_citation_get_citation_id( $node->nid );
        db_query("DELETE FROM {am_citation_dates} WHERE citation_id = '%d'", $citation_id );
      case insert:
        if ( count( $node->date_widget_names ) ) {
          foreach ( $node->date_widget_names as $widget_name ) {
            $widget = $node->$widget_name;
            if (count( $widget['subwidgets'] ) != 0 ) {
              foreach ( $widget['subwidgets'] as $subwidget_id => $subwidget ) {
                if ( $citation_id <> 0 ) {
                  $date_order = artmob_date_widget_build_date_order( $subwidget['date_day'], $subwidget['date_month'], $subwidget['date_year'] );
                  $date_timestamp = $subwidget['date_day'] .'/'. $subwidget['date_month'] .'/'. $subwidget['date_year'];
                  db_query("INSERT INTO {am_citation_dates} ".
                      "(citation_id, date_type_id, date_day, date_month,
                        date_year, date_order, widget_name, sequence, date_timestamp) ".
                      " VALUES (%d, %d, %d, %d, '%s', %d, '%s', %d, '%s')",
                      $citation_id, $subwidget['date_type_id'], $subwidget['date_day'],
                      $subwidget['date_month'], $subwidget['date_year'],
                      $date_order, $widget_name, $subwidget_id, $date_timestamp
                  );
                }
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
function theme_artmob_date_widget($element) {
  $output .= theme('form_element', $element, $element['#children']);
  return $output;
}

/**
 * Theme the subwidgets as a table, one subwidget per row
 */
function theme_artmob_date_widget_new_subwidget(&$form) {
  $rows = array();
  $row = array();
  $row[] = drupal_render($form['date_type_id']);
  $row[] = drupal_render($form['date_month']);
  $row[] = drupal_render($form['date_day']);
  $row[] = drupal_render($form['date_year']);
  $rows[] = $row;
  $output = theme('table', array('class' => ''), $rows);
  $output .= drupal_render($form);
  return $output;
}

function artmob_date_widget_sort_by_subwidget_id($a, $b) {
  if ($a['subwidget_id'] == $b['subwidget_id']) {
    return 0;
  }
  return ($a['subwidget_id'] < $b['subwidget_id']) ? -1 : 1;
}

/**
 * Theme the add new subwidget subform as a single row.
 */
function theme_artmob_date_widget_subwidgets(&$form) {
  foreach (element_children($form) as $key) {
    $row = array();
    $row[] = drupal_render($form[$key]['remove']);
    $row[] = drupal_render($form[$key]['date_type_id']);
    $row[] = drupal_render($form[$key]['date_month']);
    $row[] = drupal_render($form[$key]['date_day']);
    $row[] = drupal_render($form[$key]['date_year']);
    $rows[] = array( 'data' => $row, 'class' => 'sortableitem', 'subwidget_id' => $key );
  }
  if ( count($rows) > 0 ) {
    usort( $rows, artmob_date_widget_sort_by_subwidget_id ); // sort the subwidgets by subwidget_id
    $header = array(t('Remove'), t('Date Type'), t('Month'), t('Day'), t('Year'));
    $output = theme('table', $header, $rows, array( 'class' => 'sortable', 'id' => $form['#attributes']['id'] ) );
  }
  $output .= drupal_render($form);
  return $output;
}

function artmob_date_widget_build_date_list( $use_none = False, $none_text = 'None' ) {
  $list = array();
  if ( $use_none ) {
    $list[0] = $none_text;
  }
  $result = db_query( "SELECT * FROM {am_date_type}" );
  while ($row = db_fetch_object($result)) {
    $list[$row->date_type_id] = $row->display_name;
  }
  return $list;
}

function artmob_date_widget_build_month_list( $use_none = False, $none_text = 'None' ) {
  $list = array();
  if ( $use_none ) {
    $list[0] = $none_text;
  }

  $list[1] = 'Jan';
  $list[2] = 'Feb';
  $list[3] = 'Mar';
  $list[4] = 'Apr';
  $list[5] = 'May';
  $list[6] = 'June';
  $list[7] = 'July';
  $list[8] = 'Aug';
  $list[9] = 'Sept';
  $list[10] = 'Oct';
  $list[11] = 'Nov';
  $list[12] = 'Dec';
  return $list;
}

function artmob_date_widget_build_day_list( $use_none = False, $none_text = 'None' ) {
  $list = array();
  if ( $use_none ) {
    $list[0] = $none_text;
  }

  for ( $i = 1; $i <= 31; $i++ ) {
    $list[$i] = $i;
  }
  return $list;
}

function artmob_date_widget_build_date_order( $day, $month, $year ) {
 $temp_day = $day==0 ? 1:$day;
 $temp_month = $month==0 ? 1:$month;
 if ($year) {
   if ( is_numeric( $year ) ) {
     $temp_year = $year;
   }
   else {
     $temp_year = 1900;
   }
 }
 else {
   $temp_year = 1900;
 }
 return mktime(0, 0, 0, $temp_month, $temp_day, $temp_year);

}

function artmob_date_widget_format_date( $day, $month, $year ) {
  //This function will take the $day, $month and $year
  //any of which can be blank or 0 and format them to match.

  $month_list = artmob_date_widget_build_month_list( );

  if ( ( $day == 0 ) && ( $month == 0 ) && ( $year == '' ) ) {
    return '';
  }

  if ( $day == 0 ) {
    if ( $month <> 0 ) {
      $result = $month_list[ $month ];
    }

    if ( $year != '' ) {
      $result .= ' '. $year;
    }

    $result = trim( $result );
    return $result;
  }

  if ( $month == 0 ) {
    //having a day without month doesn't make sense so we will ignore it
    if ( $year != '' ) {
      $result = $year;
    }

    return $result;
  }

  //if it makes it this far then day and month are not 0
  $result = $month_list[ $month ];
  $result .= ' '. $day;

  if ( $year != '' ) {
    $result .= ', '. $year;
  }

  return $result;
}

