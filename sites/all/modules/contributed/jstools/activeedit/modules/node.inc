<?php
// $Id: node.inc,v 1.1 2007/01/26 22:15:18 nedjo Exp $

/**
 * Implementation of hook_nodeapi().
 */
function activeedit_nodeapi(&$node, $op, $teaser = NULL, $page = NULL) {

  switch ($op) {
    case 'view':
      if (node_access('update', $node)) {
        $node->content['activeedit_data'] = array(
          '#value' => activeedit_node_data_form($node),
          '#weight' => 10,
        );
      }
      break;
  }
}

/**
 * Encode data on nodes for reference by Javascript.
 */
function activeedit_node_data_form($node) {
  static $fields;
  static $requires;
  if ($fields == NULL) {
    $fields = array('nid', 'type');
    // Add fields for all registered targets.
    if (user_access('administer nodes')) {
      $bars = activeedit_get_targets('bars');
      foreach (element_children($bars['node']) as $key) {
        foreach($bars['node'][$key]['#form']['node_form'] as $element) {
          $fields[] = end($element);
        }
      }
    }
  }
  if ($requires == NULL) {
    $requires = array();
    // Add fields for all registered targets.
    $elements = activeedit_get_targets('elements');
    foreach (element_children($elements['node']) as $key) {
      if ($elements['node'][$key]['#require']) {
        foreach($elements['node'][$key]['#form']['node_form'] as $element) {
          $requires[] = end($element);
        }
      }
    }
  }
  // Forms API is not worth the overhead here. In any case, these forms should not be
  // submitted, so don't want/need Forms API handling.
  $form = '<form id="activeedit_node_data_'. $node->nid .'" class="activeedit-data">';
  foreach ($fields as $field) {
    if ($node->$field) {
      $form .= '<input name="'. $field .'" type ="hidden" value="'. $node->$field .'" />';
    }
  }

  // Load the available fields for this content type.
  $require_fields = variable_get('activeedit_fields_'. $node->type, array());
  // If this node type has not been registered as a variable, register it.
  // Detect if the node type supports given fields. For example, not all
  // node types have a 'title' field. We want to attach editing to the node
  // title only if the field exists.
  if ($require_fields == array()) {
    $type_form = node_invoke($node, 'form');
    foreach (element_children($elements['node']) as $key) {
      if ($elements['node'][$key]['#require']) {
        foreach($elements['node'][$key]['#form']['node_form'] as $element) {
          $require_fields[end($element)] = $type_form[implode('][', $element)] ? 1 : 0;
        }
      }
    }
    variable_set('activeedit_fields_'. $node->type, $require_fields);
  }
  foreach ($requires as $require) {
    $form .= '<input name="'. $require .'" type ="hidden" value="'. $require_fields[$require] .'" />';
  }
  $form .= '</form>';

  return $form;
}

/**
 * Change the form id to 'node_form' if this is a node form.
 */
function activeedit_node_form_id(&$form_id, $key) {
  // Node form is a special case.
  $targets = activeedit_get_targets($_REQUEST['activeedit_type']);
  if (in_array($key, element_children($targets['node'])) && strpos($form_id, '_node_form')) {
    $form_id = 'node_form';
  }
}

/**
 * Implementation of hook_activeedit_elements().
 */
function node_activeedit_elements($object = NULL) {
  $elements = array();
  $elements['node'] = array(
    '#selector' => 'div.node',
    '#target' => 'node/*/edit',
    '#id_field' => 'nid',
  );
  $elements['node']['node_title'] = array(
    '#title' => t('post title'),
    '#selector' => 'h2.title > a',
    '#submit_text' => t('Submit'),
    '#form' => array(
      'node_form' => array(
        array(
          'title',
        ),
      ),
    ),
    '#require' => 'title',
  );
  $elements['node']['node_body'] = array(
    '#title' => t('post body'),
    '#selector' => 'div.content',
    '#submit_text' => t('Submit'),
    '#form' => array(
      'node_form' => array(
        array(
          'body_filter',
        ),
      ),
    ),
    '#require' => 'body_filter',
  );
  // We generate content separately, on demand, to avoid unneeded processing.
  // Otherwise these calls would all be run on every page load.
  if (isset($_POST) && $_POST['activeedit_submit'] && $key = $_REQUEST['activeedit_id']) {
    $content = FALSE;
    switch ($key) {
      case 'node_title':
        $elements['node'][$key]['#content'] = $object->title;
        break;
      case 'node_body':
        $elements['node'][$key]['#content'] = $object->body;
        break;
    }
  }

  return $elements;
}

function node_activeedit_bars() {
  $bars = array();
  $bars['node'] = array(
    '#selector' => 'div.node',
    '#form_function' => 'node_form_array',
    '#target' => 'node/*/edit',
    '#id_field' => 'nid',
  );
  $bars['node']['options'] = array(
    '#title' => t('publishing options'),
    '#submit_text' => t('Submit'),
    '#access' => user_access('administer nodes'),
    '#form' => array(
      'node_form' => array(
        array(
          'options', 'status',
        ),
        array(
          'options', 'promote',
        ),
        array(
          'options', 'sticky',
        ),
      ),
    ),
  );
  return $bars;
}