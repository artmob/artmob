<?php
// $Id: weblinks_views.inc,v 1.1.2.6 2009/02/14 23:35:00 nancyw Exp $
/**
 * @file
 *   Views tables for Web Links module.
 * @status: very ALPHA - needs handlers, filters, etc.
 */

function weblinks_views_tables() {
  $tables['weblinks'] = array(
    'name' => 'weblinks',
    'provider' => 'weblinks',
    'join' => array(
      'type' => 'inner',
      'left' => array(
        'table' => 'node',
        'field' => 'nid',
      ),
      'right' => array(
        'field' => 'nid AND node.vid = weblinks.vid',
      )
    ),
    'fields' => array(
      'url' => array(
        'name' => t('Weblinks: URL'),
        'help' => t('The URL for the link.'),
        'sortable' => TRUE,
        'query_handler' => 'weblinks_qhandler_title',
        'handler' => array(
           'weblinks_handler_url' => t('Show as clickable url'),
           'weblinks_handler_url_text' => t('Show as text'),
           'weblinks_handler_url_title' => t('Show as clickable title'),
           'weblinks_handler_url_visit' => t('Show using "Link displays as" setting'),
         ), 
        ),
      'weight' => array(
        'name' => t('Weblinks: weight'),
        'help' => t('The weight for the link.'),
        ),
      'last_status' => array(
        'name' => t('Weblinks: link status'),
        'help' => t('The last status returned from vailidity checking.'),
        'sortable' => TRUE,
        ),
      'last_checked' => array(
        'name' => t('Weblinks: last checked'),
        'help' => t('The date/time of the last vailidity checking.'),
        'handler' => views_handler_field_dates(),
        'option' => 'string',
        'sortable' => TRUE,
        ),
      'click_count' => array(
        'name' => t('Weblinks: click count'),
        'help' => t('The number of times a user has clicked on the link.'),
        'sortable' => TRUE,
        ),
      'last_click' => array(
        'name' => t('Weblinks: last click'),
        'help' => t('The date/time the link was last clicked.'),
        'handler' => 'views_handler_field_dates()',
        'option' => 'string',
        'sortable' => TRUE,
        ),
    ),
  );

  return $tables;
}

/**
 * 'weblinks_handler_url' => 'Show as clickable url',
 */
function weblinks_handler_url($fieldinfo, $fielddata, $value, $data) {
  return l($value, $value, array('target' => '_blank'));
}
// variable_get('weblinks_urlnode', 'url') ??

/**
 * 'weblinks_handler_url_text' => 'Show as text',
 */
function weblinks_handler_url_text($fieldinfo, $fielddata, $value, $data) {
  return check_plain($value);
}

/**
 * 'weblinks_handler_url_title' => 'Show as clickable title',
 */
function weblinks_handler_url_title($fieldinfo, $fielddata, $value, $data) {
  $data->title = isset($data->node_title) ? $data->node_title : $data->title;
  $options = array('rel' => 'tag');
  if (variable_get('weblinks_external', TRUE)) {
    $options['target'] = '_blank';
  }

  if (variable_get('weblinks_nofollow', FALSE)) {
    $options['rel'] = 'nofollow, tag';
  }
  return l($data->title, $value, $options);
}

/**
 * 'weblinks_handler_url_visit' => 'Show using "Link displays as" setting',
 */
function weblinks_handler_url_visit($fieldinfo, $fielddata, $value, $data) {
  // Hijack $data in place of a node object. (nid is already there)
  $data->url = $data->weblinks_url;
  $data->title = isset($data->node_title) ? $data->node_title : $data->title;
  
  $options = array('rel' => 'tag');
  if (variable_get('weblinks_external', TRUE)) {
    $options['target'] = '_blank';
  }

  if (variable_get('weblinks_nofollow', FALSE)) {
    $options['rel'] = 'nofollow, tag';
  }
  return theme('weblinks_url_view', $data, $options, NULL);
}

function weblinks_qhandler_title($field, $fieldinfo, &$query) {
  $query->add_field('title', 'node');
}
