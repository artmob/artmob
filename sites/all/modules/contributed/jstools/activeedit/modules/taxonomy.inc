<?php
// $Id: taxonomy.inc,v 1.2 2007/01/26 22:17:49 nedjo Exp $

/**
 * Implementation of hook_activeedit_elements().
 */
function taxonomy_activeedit_elements($object = NULL) {
  $elements = array();
  $elements['node'] = array();
  $elements['node']['node_taxonomy'] = array(
    '#title' => t('post categories'),
    '#selector' => 'span.taxonomy',
    '#submit_text' => t('Submit'),
    '#form' => array(
      'node_form' => array(
        array(
          'taxonomy',
        ),
      ),
    ),
  );

  // We generate content separately, on demand, to avoid unneeded processing.
  // Otherwise these calls would all be run on every page load.
  if (isset($_POST) && $_POST['activeedit_submit'] && $key = $_REQUEST['activeedit_id']) {
    $content = FALSE;
    switch ($key) {
      case 'node_taxonomy':
        // Manually reset the node's terms. This is necessary because taxonomy_node_get_terms() caches its data
        // and has no refresh option.
        $result = db_query(db_rewrite_sql('SELECT t.* FROM {term_node} r INNER JOIN {term_data} t ON r.tid = t.tid INNER JOIN {vocabulary} v ON t.vid = v.vid WHERE r.nid = %d ORDER BY v.weight, t.weight, t.name', 't', 'tid'), $object->nid);
        $object->taxonomy = array();
        while ($term = db_fetch_object($result)) {
          $object->taxonomy[$term->$key] = $term;
        }
        $elements['node'][$key]['#content'] = theme('links', taxonomy_link('taxonomy terms', $object));
        break;
    }
  }

  return $elements;
}