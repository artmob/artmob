<?php
// $Id: date_pathauto.inc,v 1.1.2.9 2007/07/03 11:06:07 karens Exp $

/**
 * @file
 * Interface between date.module and pathauto.module.
 */

/*
 * Implementation of hook_pathauto_node().
 *
 * Allows users to use the textual representation of the parts of a date field
 * as a component of paths.
 */
function _date_pathauto_node($op, $node = NULL) {
  include_once(drupal_get_path('module', 'date_api') .'/date.inc');
  switch ($op) {
    case 'placeholders':
      $placeholders = array();
      foreach (content_fields() as $field) {
        if (($field['type'] == 'date' || $field['type'] == 'datestamp') && is_array($field['granularity'])) {
          if (array_key_exists('Y', $field['granularity'])) {
            $placeholders['['. $field['field_name'] . '_y]'] = t($field['widget']['label'] . ' - year');
          }
          if (array_key_exists('M', $field['granularity'])) {
            $placeholders['['. $field['field_name'] . '_m]'] = t($field['widget']['label'] . ' - month');
          }
          if (array_key_exists('D', $field['granularity'])) {
    	      $placeholders['['. $field['field_name'] . '_d]'] = t($field['widget']['label'] . ' - day');
          }
          if (array_key_exists('H', $field['granularity'])) {
            $placeholders['['. $field['field_name'] . '_h]'] = t($field['widget']['label'] . ' - hours');
          }
          if (array_key_exists('N', $field['granularity'])) {
            $placeholders['['. $field['field_name'] . '_n]'] = t($field['widget']['label'] . ' - minutes');
          }
          if (array_key_exists('S', $field['granularity'])) {
            $placeholders['['. $field['field_name'] . '_s]'] = t($field['widget']['label'] . ' - seconds');
          }
        }
      }
	return $placeholders;
      break;

    case 'values':
      // all this stuff is from content_pathauto.inc
      $results = array();

      // Get node output (filtered and with module-specific fields).
      if (node_hook($node, 'view')) {
        node_invoke($node, 'view', false, false);
      }
      else {
        $node = node_prepare($node, false);
      }
      // Allow modules to change $node->body before viewing.
      node_invoke_nodeapi($node, 'view', false, false);
      // Get node output (filtered and with module-specific fields).
      if (node_hook($node, 'view')) {
        node_invoke($node, 'view', false, false);
      }
      else {
        $node = node_prepare($node, false);
      }
      // Allow modules to change $node->body before viewing.
      node_invoke_nodeapi($node, 'view', false, false);

      foreach (content_fields() as $field) {
        if ($field['type'] == 'date' || $field['type'] == 'datestamp' && is_array($field['granularity'])) {
          // this could probably be done better
          $fieldname = $field['field_name'];
          $datefield = $node->$fieldname;
          $datevalue = $datefield[0]['value'];
          // from date.module
          if ($field['tz_handling'] == 'none') {
            // if no timezone handling was elected, create a date object with the database value
            $date = date_make_date(trim($datevalue), 'none', 'local', $field['type']);
          }
          else {
            // create a date object with a gmt timezone from the database value
            $date = date_make_date(trim($datevalue), 'GMT', 'db', $field['type']);
            // convert the date object to the proper timezone, depending on the field's tz_handling value
            date_convert_timezone($date, 'GMT', date_get_timezone($field['tz_handling'], $item['timezone']), 'local');
          }
          $iso = $date->local->iso;
          if (is_array($field['granularity'])) {
            // we were using the date_iso_field calls, but we'd prefer 01 rather than 1 for january
            if (array_key_exists('Y', $field['granularity'])) {
              $results['['. $field['field_name'] . '_y]'] = pathauto_cleanstring(substr($iso, 0, 4));
            }
            if (array_key_exists('M', $field['granularity'])) {
              $results['['. $field['field_name'] . '_m]'] = pathauto_cleanstring(substr($iso, 5, 2));
            }
            if (array_key_exists('D', $field['granularity'])) {
              $results['['. $field['field_name'] . '_d]'] = pathauto_cleanstring(substr($iso, 8, 2));
            }
            if (array_key_exists('H', $field['granularity'])) {
              $results['['. $field['field_name'] . '_h]'] = pathauto_cleanstring(substr($iso, 11, 2));
            }
            if (array_key_exists('N', $field['granularity'])) {
              $results['['. $field['field_name'] . '_n]'] = pathauto_cleanstring(substr($iso, 14, 2));
            }
            if (array_key_exists('S', $field['granularity'])) {
              $results['['. $field['field_name'] . '_s]'] = pathauto_cleanstring(substr($iso, 17, 2));
            }
          }
        }
      }
      return $results;
	break;

    default:
	break;
  }
}
