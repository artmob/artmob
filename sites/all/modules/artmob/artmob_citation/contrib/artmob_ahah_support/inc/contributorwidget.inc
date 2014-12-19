<?php

define('CONTRIBUTOR_WIDGET_UNKNOWN_ROLE', -1);


//****************************/
//* EXPAND WIDGET FUNCTIONS
//****************************/

/**
 * Called by #process for widget emements
 *
 */
function artmob_contributor_widget_expand($element, $arg2, $node) {
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
//  drupal_set_message( "count(arg2) = ". count($arg2) );
  if ( count($arg2) == 1 ) {
    $element[$name] = array();
    return $element;
  }

  $name = $element['#name']; // name of this widget, set in the containing form
  $edit = $element['#post']; // get the posted parameters

  // set flag so nodeapi can find the widget
  if ($node->type) {
    variable_set('artmob_contributor_widget_'. $node->type, TRUE );
  }

  // create a tree of the names of all widgets in the form -- needed for formapi:insert
  $element['contributor_widget_names'] = array(
    '#type' => 'item',
    '#tree' => TRUE,
  );
  $element['contributor_widget_names'][$name] = array(
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
          'path' => 'artmob_contributor/widget_update_js',
          'params' => array( 'widget_name_js' => $name ),
        ),
     ),
  );

  // actually build the widget and put it in the wrapper
  $element[$name] += _artmob_contributor_build_widget( $name, $edit[$name], $node );
  return $element;
}


function _artmob_contributor_build_widget($name, $edit, $node=NULL) {
  // get the preexisting subwidgets - can be in either $edit or $node
  $subwidgets = _artmob_contributor_widget_extract_subwidgets($name, $edit, $node);
  // process add and remove commands - modifies $subwidgets
  $subwidgets = _artmob_contributor_widget_process_subwidget_commands( $name, $edit, $subwidgets );
  // expand the $subwidgets array into form elements - modifies $element
  $widget = _artmob_contributor_widget_expand_subwidgets( $name, $subwidgets );
  // add a control block for adding new subwidgets - modifies $element
  $widget += _artmob_contributor_widget_add_new_subwidget_control( $name, $edit );

  return $widget;
}

/**
 * Extract the widget description from the post array
 * If post is empty, we may be doing an edit -> load into node
 * Or fresh add with no widgets
 */
function _artmob_contributor_widget_extract_subwidgets($name, $edit, $node) {
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
function _artmob_contributor_widget_process_subwidget_commands( $name, &$edit, $subwidgets ) {
  if ( is_array($edit) && count($edit) > 0 ) {
    // process the potention addition...what is potention???
    $new_subwidget = $edit['new_subwidget'];
    if ( $new_subwidget['firstname'] || $new_subwidget['lastname'] || $new_subwidget['contributor_nid'] ) {
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
function _artmob_contributor_widget_expand_subwidgets( $name, $subwidgets ) {
  $element['subwidgets'] = array(
      '#tree' => TRUE,
      '#attributes' => array( 'id' => 'widget_subwidgets_'. $name ),
      '#theme' => 'artmob_contributor_widget_subwidgets',
  );

  foreach ( $subwidgets as $subwidget_id => $subwidget ) {
    $contributor_roles[$subwidget_id] = artmob_contributor_BuildRolesList();
    $contributor_name[$subwidget_id] = artmob_contributor_BuildContributorList(TRUE, FALSE, TRUE);
    $contributor_type[$subwidget_id] = artmob_contributor_make_type_list();

    $element['subwidgets'][$subwidget_id] = array(
      '#tree' => TRUE,
    );

    $element['subwidgets'][$subwidget_id]['contributor_nid'] = array(
      '#type'     => 'select',
      '#options'    => $contributor_name[$subwidget_id],
      '#default_value' => $subwidget['contributor_nid'],
    );

    $default = artmob_citation_get_role_default( $subwidget['contributor_role'] );

    $element['subwidgets'][$subwidget_id]['contributor_role'] = array(
      '#type'     => 'select',
      '#options'    => $contributor_roles[$subwidget_id],
      '#default_value' => $default,
      '#multiple' => True,
      '#size' => 10
    );

    $element['subwidgets'][$subwidget_id]['firstname'] = array(
      '#type'          => 'textfield',
      '#size'          => 10,
      '#default_value' => $subwidget['firstname'],
      '#required'      => FALSE,
    );
    /*
    $element['subwidgets'][$subwidget_id]['middlenames'] = array(
      '#type'          => 'textfield',
      '#title'         => t(''),
      '#size'          => 10,
      '#default_value' => $subwidget['middlenames'],
      '#required'      => false,
    );
    */
    $element['subwidgets'][$subwidget_id]['lastname'] = array(
      '#type'          => 'textfield',
      '#size'          => 10,
      '#default_value' => $subwidget['lastname'],
      '#required'      => FALSE,
    );

    $element['subwidgets'][$subwidget_id]['contributor_type'] = array(
      '#type'     => 'select',
      '#options'    => $contributor_type[$subwidget_id],
      '#default_value' => $subwidget['contributor_type'],
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
function _artmob_contributor_widget_add_new_subwidget_control($name, $edit) {
  $element['new_subwidget'] = array(
      '#type' => 'fieldset',
      '#title' => t( 'Add contributor from profiles' ),
      '#theme' => 'artmob_contributor_widget_new_subwidget',
      '#tree' => TRUE,
  );

  $contributor_name = artmob_contributor_BuildContributorList(TRUE, FALSE, TRUE);
  $contributor_roles = artmob_contributor_BuildRolesList();
  $contributor_type = artmob_contributor_make_type_list();


  $element['new_subwidget']['contributor_nid'] = array(
    '#type'     => 'select',
    '#title'    => 'Profile',
    '#options'    => $contributor_name,
    '#value' => $edit['new_subwidget']['contributor_nid'],
  );

  $default = artmob_citation_get_role_default( $contributor_roles[$subwidget_id] );

  $element['new_subwidget']['contributor_role'] = array(
    '#type'     => 'select',
    '#title'    => 'Role',
    '#options'    => $contributor_roles,
    //'#value' => $edit['new_subwidget']['contributor_role'],
    '#default_value' => $edit['new_subwidget']['contributor_role'],
    '#multiple' => True,
    '#size' => 10
  );

  $element['new_subwidget']['firstname'] = array(
      '#type'          => 'textfield',
      '#title'         => t('First Name'),
      '#size'          => 10,
      '#value' => $edit['new_subwidget']['firstname'] ? $edit['new_subwidget']['firstname'] : '',
      '#required'      => FALSE,
  );

  $element['new_subwidget']['lastname'] = array(
      '#type'          => 'textfield',
      '#title'         => t('Last Name'),
      '#size'          => 10,
      '#value' => $edit['new_subwidget']['lastname'] ? $edit['new_subwidget']['lastname'] : '',
      '#required'      => FALSE,
  );

  $element['new_subwidget']['contributor_type'] = array(
    '#type'     => 'select',
    '#title'    => 'Type',
    '#options'    => $contributor_type,
    '#value' => $edit['new_subwidget']['contributor_type'],
  );

  $element['new_subwidget']['add_subwidget_button'] = array(
    '#type' => 'button',
    '#value' => t( 'Add New Contributor' ),
    '#id' => 'widget_add_subwidget_button_'. $name,
    '#ahah_bindings' => array(
      array(
        'wrapper' => 'widget_wrapper_'. $name,
        'event' => 'click',
        'path' => 'artmob_contributor/widget_update_js',
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
function artmob_contributor_widget_menu($may_cache) {
  $items = array();
  if ($may_cache) {
  }
  else {
    $items[] = array(
        'path' => 'artmob_contributor/widget_update_js',
        'callback' => '_artmob_contributor_update_js',
        'access' => TRUE,
        'type' => MENU_CALLBACK,
    );
    $items[] = array(
      'path' => 'admin/artmob/contributor_convert',
      'title' => t('convert contributor entries'),
      'callback' => 'drupal_get_form',
      'callback arguments' => array('artmob_contributor_widget_convert_form', NULL),
      'description' => t('Allows the conversion of contributor entries'),
      'access' => user_access('administer site configuration'),
      'type' => MENU_NORMAL_ITEM,
    );
  }
  return $items;
}

/**
 * Creates the artmob contributor convert page
 * It is one big button and a short description of the button. What could be simpler?
 */
function artmob_contributor_widget_convert_form() {
  $form = array();
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Convert the contributor fields'),
    '#prefix' => t('This will convert the contributor fields from the old format to the new format.'),
  );

  return $form;
}

function artmob_contributor_widget_convert_form_submit($form_id, $form_values) {
  if ( $form_values['op'] == 'Convert the contributor fields' ) {
    $result = db_query("SELECT * FROM {PC_NodeLink} where ToNode > 0 and FromNode > 0 and is_merged = 0 and ToType = 'Contributor' ORDER BY FromNode, LinkIndex" );
    while ($row = db_fetch_object($result)) {
      $citation = db_query("SELECT link_nid FROM {am_citation} where nid = %d", $row->FromNode );
      $citation_row = db_fetch_object($citation);
      if ( $citation_row->link_nid ) {
        $nid = $citation_row->link_nid;
      }
      else {
        $nid = $row->FromNode;
      }

      db_query( "INSERT INTO {am_contributor_widget}
                 SET nid = %d, widget_name = 'widgetcontributor1', subwidget_id = %d,
                 contributor_nid = %d, contributor_role = '%s'",
                 $nid, db_next_id('subwidget'), $row->ToNode,
                 $row->LinkBlob );
    }
    $result = db_query("UPDATE {PC_NodeLink} SET is_merged = 1 where is_merged = 0 and ToType = 'Contributor'" );

    drupal_set_message( 'The contributors have been converted' );
  }
}

/**
 * Called by javascript to do AJAH based form updating
 */
function _artmob_contributor_update_js() {
  $name = $_POST['widget_name_js'];
  print _artmob_contributor_build_widget_js( $name, $_POST );
}

// Pulled out of widget_update_js for easier testing
function _artmob_contributor_build_widget_js( $name, $edit ) {
  $widget[$name] = array( '#tree' => TRUE );
  $widget[$name] += _artmob_contributor_build_widget( $name, $edit[$name] );

  $form = form_builder( 'ahah_widget', $widget );
  return theme('status_messages') . drupal_render($form);
}

// ********************************************************************************
// WIDGET_NODEAPI - handle the database interactions
// ********************************************************************************

function artmob_contributor_widget_load_widgets( $node, &$widget_name ) {
  $additions = array();
  $result = db_query( "SELECT r.widget_name, r.sequence, r.contributor_id, c.nid as contributor_nid, c.contributor_type from {am_citation_roles} r
                       left join {am_contributor} c on r.contributor_id = c.contributor_id
                       where r.citation_id = %d
                       group by widget_name, sequence, contributor_id
                       order by sequence", $node->citation_id );
  while ($row = db_fetch_array($result)) {
    $widget_name = $row['widget_name'];
    $subwidget_id = $row['sequence'];
    if ( !is_array( $additions[$widget_name] ) ) {
      $additions[$widget_name] = array();
      $additions[$widget_name]['subwidgets'] = array();
    }

    $additions[$widget_name]['subwidgets'][$subwidget_id] = array(
        'contributor_nid' => $row['contributor_nid'],
        'contributor_type' => $row['contributor_type'],
    );

    $widget_names[$widget_name] = $widget_name; // rebuild widget name list

    /* contributor by name */
    $contributor_node = node_load($row['contributor_nid']);
    $roles = array();
    $contributor_roles = array();

    $role_query = db_query( "select c.*, r.* from {am_citation_roles} c
                             left join {am_roles} r on c.role_id = r.role_id
                             where citation_id = %d
                             and widget_name = '%s'
                             and sequence = %d", $node->citation_id, $widget_name, $subwidget_id );
    while ($role_row = db_fetch_object($role_query)) {
      $role = $role_row->role_id;
      $contributor_roles[$role] = $role;
      $roles[$role] = $role_row->role_description;
    }
    $additions[$widget_name]['subwidgets'][$subwidget_id]['contributor_role'] = $contributor_roles;
    $additions['contributors_by_name'][$contributor_node->nid] = array(
      'nid' => $contributor_node->nid,
      'name' => trim($contributor_node->first_name .' '. $contributor_node->last_name),
      'last_name' => $contributor_node->last_name,
      'first_name' => $contributor_node->first_name,
      'roles' => $roles
    );

    /* contributor by role */
    $contributors_by_role = array();

    foreach ($additions['contributors_by_name'] as $cnid => $contributor) {
      if (is_array($contributor['roles'])) {
        foreach ($contributor['roles'] as $role_id => $role_name) {
          $contributors_by_role[$role_name][$contributor['nid']] = $contributor['name'];
        }
      }
    }

    $additions['contributors_by_role'] = $contributors_by_role;

    /* contributor verbatim */
    $additions['contributors_verbatim'] = theme('artmob_contributor_widget_build_contributors_verbatim', $contributors_by_role);

    $additions['contributor_widget_names'] = $widget_names;
  }


  //LOAD UNKNOWNS?
  $result = db_query( "SELECT r.widget_name, r.sequence, r.contributor_id from {am_citation_roles_unknown} r
                       where r.citation_id = %d
                       group by widget_name, sequence, contributor_id
                       order by sequence", $node->citation_id );
  while ($row = db_fetch_array($result)) {
    $widget_name = $row['widget_name'];
    $subwidget_id = $row['sequence'];
    if ( !is_array( $additions[$widget_name] ) ) {
      $additions[$widget_name] = array();
      $additions[$widget_name]['subwidgets'] = array();
    }

    $additions[$widget_name]['subwidgets'][$subwidget_id] = array(
        'contributor_nid' => $row['contributor_id'],
        'contributor_type' => '',
    );

    $widget_names[$widget_name] = $widget_name; // rebuild widget name list

    $roles = array();
    $contributor_roles = array();

    $role_query = db_query( "select c.*, r.* from {am_citation_roles_unknown} c
                             left join {am_roles} r on c.role_id = r.role_id
                             where citation_id = %d
                             and widget_name = '%s'
                             and sequence = %d", $node->citation_id, $widget_name, $subwidget_id );
    while ($role_row = db_fetch_object($role_query)) {
      $role = $role_row->role_id;
      $contributor_roles[$role] = $role;
      $roles[$role] = $role_row->role_description;
    }
    $additions[$widget_name]['subwidgets'][$subwidget_id]['contributor_role'] = $contributor_roles;

    $additions['contributor_widget_names'] = $widget_names;
  }

  return $additions;
}

/**
 * hook_nodeapi
 */
function artmob_contributor_widget_nodeapi( &$node, $op ) {
  if ( variable_get( 'artmob_contributor_widget_'. $node->type, FALSE ) ) {
    switch ($op) {
      // info flow db -> node -> form -> node -> db
      case load: // Load Widgets in from db
        return artmob_contributor_widget_load_widgets( $node, &$widget_name );
        break;
      case view:
         /* handled by theme */
        break;

      case update:
        // keep life simple and do update by just deleting and then inserting
        //db_query("DELETE FROM {am_contributor_widget} WHERE nid = '%d'", $node->nid );
        db_query("DELETE FROM {am_citation_roles} WHERE citation_id = '%d'", $node->citation_id );
        db_query("DELETE FROM {am_citation_roles_unknown} WHERE citation_id = '%d'", $node->citation_id );
      case insert:
        if ( count( $node->contributor_widget_names ) ) {
          foreach ( $node->contributor_widget_names as $widget_name ) {
  //          if ( $widget_name == 'widgetprice1' ) {
            $widget = $node->$widget_name;
            if (count( $widget['subwidgets'] ) != 0 ) {
              foreach ( $widget['subwidgets'] as $subwidget_id => $subwidget ) {
                if ($subwidget['contributor_nid'] == CONTRIBUTOR_WIDGET_UNKNOWN_ROLE ) {
                  $nid = CONTRIBUTOR_WIDGET_UNKNOWN_ROLE;
                  $contributor_id = CONTRIBUTOR_WIDGET_UNKNOWN_ROLE;
                }
                else if ( $subwidget['contributor_nid'] == 0 ) {
                  $nid = 0;
                  $result = db_query( "SELECT nid from {am_contributor} where first_name = '%s' and last_name = '%s'", $subwidget['firstname'], $subwidget['lastname'] );
                  while ($row = db_fetch_object($result)) {
                    $nid = $row->nid;
                    break;
                  }
                  if ( $nid == 0 ) {
                    //if it is a corporate contibutor then both names don't need to be filled
                    if ((( $subwidget['firstname'] != '' ) && ( $subwidget['lastname'] != '' ))
                       || (( $subwidget['contributor_type'] == CONTRIBUTOR_TYPE_CORPORATION ) &&
                        (( $subwidget['firstname'] != '' ) || ( $subwidget['lastname'] != '' )) ) ) {
                      //add this person as a contributor
                      global $user;
                      $contributor_node->nid = '';
                      $contributor_node->uid = $user->uid;
                      $contributor_node->type = 'Contributor';
                      $contributor_node->status = 1;
                      $contributor_node->first_name = $subwidget['firstname'];
                      $contributor_node->last_name = $subwidget['lastname'];
                      $contributor_node->title = $subwidget['firstname'] .' '. $subwidget['lastname'];
                      $contributor_node->contributor_type = $subwidget['contributor_type'];
                      node_save( $contributor_node);
                      $nid = $contributor_node->nid;
                      //$contributor_id = $contributor_node->contributor_id;
                      $contributor_id = artmob_contributor_get_id_from_nid( $nid );
                      //drupal_set_message( 'saved nid = '.$nid );
                      //drupal_set_message( 'saved id = '.$contributor_id );
                    }
                  }
                }
                else {
                  $nid = $subwidget['contributor_nid'];
                  $contributor_id = artmob_contributor_get_id_from_nid( $nid );
                }
                if ( $nid == CONTRIBUTOR_WIDGET_UNKNOWN_ROLE ){
                  foreach ( $subwidget['contributor_role'] as $role_id => $role_value ) {
                    db_query( "INSERT INTO {am_citation_roles_unknown}
                               set contributor_id = %d,
                               widget_name = '%s',
                               sequence = %d,
                               citation_id = %d,
                               role_id = '%s'",
                               $contributor_id,
                               $widget_name,
                               $subwidget_id,
                               $node->citation_id,
                               $role_id);
                  }
                }
                else if ( $nid <> 0 ) {
                  foreach ( $subwidget['contributor_role'] as $role_id => $role_value ) {
                    db_query( "INSERT INTO {am_citation_roles}
                               set contributor_id = %d,
                               widget_name = '%s',
                               sequence = %d,
                               citation_id = %d,
                               role_id = '%s'",
                               $contributor_id,
                               $widget_name,
                               $subwidget_id,
                               $node->citation_id,
                               $role_id);
                  }
                }
              }
  //          }
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
function theme_artmob_contributor_widget($element) {
  $output .= theme('form_element', $element, $element['#children']);
  return $output;
}

/**
 * Theme the subwidgets as a table, one subwidget per row
 */
function theme_artmob_contributor_widget_new_subwidget(&$form) {
  $rows = array();
  $row = array();
  $row[] = drupal_render($form['contributor_nid']);
  $row[] = drupal_render($form['contributor_role']);
  $row[] = drupal_render($form['firstname']);
  $row[] = drupal_render($form['lastname']);
  $row[] = drupal_render($form['contributor_type']);
  $rows[] = $row;
  $output = theme('table', array('class' => ''), $rows);
  $output .= drupal_render($form);
  return $output;
}

function artmob_contributor_widget_sort_by_subwidget_id($a, $b) {
  if ($a['subwidget_id'] == $b['subwidget_id']) {
    return 0;
  }
  return ($a['subwidget_id'] < $b['subwidget_id']) ? -1 : 1;
}

/**
 * Theme the add new subwidget subform as a single row.
 */
function theme_artmob_contributor_widget_subwidgets(&$form) {
  foreach (element_children($form) as $key) {
    $row = array();
    $row[] = drupal_render($form[$key]['remove']);
    $row[] = drupal_render($form[$key]['contributor_nid']);
    $row[] = drupal_render($form[$key]['contributor_role']);
    $row[] = drupal_render($form[$key]['firstname']);
    $row[] = drupal_render($form[$key]['lastname']);
    $row[] = drupal_render($form[$key]['contributor_type']);
    //sort by the key (subwidget_id)
    $rows[] = array( 'data' => $row, 'class' => 'sortableitem', 'subwidget_id' => $key );
  }
  if ( count($rows) > 0 ) {
    usort( $rows, artmob_contributor_widget_sort_by_subwidget_id ); // sort the subwidgets by subwidget_id
    $header = array(t('Remove'), t('Profile'), t('Role'), t('First Name'), t('Last Name'), t('Type'));
    $output = theme('table', $header, $rows, array( 'class' => 'sortable', 'id' => $form['#attributes']['id'] ) );
  }
  $output .= drupal_render($form);
  return $output;
}

function theme_artmob_contributor_widget_build_contributors_verbatim($contributors_by_role) {
  if (!is_array($contributors_by_role)) {
    return;
  }

  $contributors_verbatim = '';

  foreach ($contributors_by_role as $role_name => $contributors) {
    if (is_array($contributors)) {
      if (strlen($contributors_verbatim) > 0) {
        $contributors_verbatim .= "; ";
      }
      $contributors_verbatim .= $role_name ." ";
      $contributors_verbatim .= theme('display_serial_list_connectors', $contributors);
    }
  }

  if (strlen($contributors_verbatim) > 0) {
    $contributors_verbatim .= ".";
  }

  return $contributors_verbatim;
}

function theme_artmob_contributor_widget_build_contributors_as_list(&$node, $header_tag='h4', $truncate=NULL) {
  if (!is_array($node->contributors_by_role)) {
    return;
  }

  $output .= "<div class='am_contributors-contributors-by-role'>\n";

  foreach ($node->contributors_by_role as $role_name => $contributors) {
      if (is_array($truncate) && !in_array($role_name, $truncate)) {
        continue;
      }

    if (is_array($contributors)) {
      $output .= '<'. $header_tag .'>'. $role_name .'</'. $header_tag .">\n";
      $output .= "<ul>\n";

      foreach ($contributors as $nid => $contributor) {
        $output .= "<li>". l($contributor, "node/$nid") ."</li>\n";
      }

      $output .= "</ul>\n";
    }
  }

  $output .= "</div>\n";

  return $output;
}


