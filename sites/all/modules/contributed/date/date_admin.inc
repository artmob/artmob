<?php
//$Id: date_admin.inc,v 1.1.2.5 2007/12/27 13:50:53 karens Exp $
/**
 * @file
 * Date administration code.
 * Moved to separate file since there is a lot of code here that is not needed often.
 */
include_once('./'. drupal_get_path('module', 'date_api') .'/date_timezones.inc');
include_once('./'. drupal_get_path('module', 'date_api') .'/date.inc');

/**
 * Implementation of hook_widget_info().
 */
function _date_widget_info() {
  $info = array(
    'date_select' => array('label' => t('Select List'),
      'field types' => array('date', 'datestamp'),
    ),
    'date_text' => array('label' => t('Text Field with strtotime validation'),
      'field types' => array('date', 'datestamp'),
    ),
  );
  if (module_exists('jscalendar')) {
    $info['date_js'] = array('label' => t('Text Field with javascript pop-up calendar'),
       'field types' => array('date', 'datestamp'),
     );
  }
  return $info;
}

/**
 * Implementation of hook_widget_settings().
 */
function _date_widget_settings($op, &$field) {
  switch ($op) {
    case 'callbacks':
      return array('default value' => CONTENT_CALLBACK_CUSTOM);

    case 'form':
      return date_widget_settings_form($field);

    case 'save':
      cache_clear_all('date_formats:'. $widget['field_name'] .':'. $widget['type_name'], 'cache');
      return array('default_value', 'default_value_custom', 'default_value2', 'default_value_custom2', 'input_format', 'input_format_custom', 'increment', 'text_parts', 'year_range');

    case 'validate':
      if ($field['default_value'] == 'custom') {
        $is_strtotime = @strtotime($field['default_value_custom']);
        if (!$is_strtotime) {
          form_set_error('default_value_custom', t('The custom default value is invalid.'));
        }
      }
      if ($field['widget']['type'] == 'date_select' && !preg_match('@\-[0-9]*:\+[0-9]*@', $field['year_range'])) {
        form_set_error('year_range', t('Years back and forward must be in the format -9:+9.'));
      }
      // Munge the table display for text parts back into an array of text parts.
      if (is_array($field['text_parts'])) {
        form_set_value(array('#parents' => array('text_parts')), array_keys(array_filter($field['text_parts'])));
      }
      break;

  }
}

function date_widget_settings_form($widget) {
  $form = array();

  // These settings are just placeholders. These values are not implemented until version 5.2
  // since it requires the PHP 5 code changes to make them work.
  $form['default_value'] = array('#type' => 'hidden', '#value' => 'blank');
  $form['default_value_custom'] = array('#type' => 'hidden', '#value' => '');
  $form['default_value2'] = array('#type' => 'hidden', '#value' => 'blank');
  $form['default_value_custom2'] = array('#type' => 'hidden', '#value' => '');

  $options = array();
  $formats = drupal_map_assoc(date_short_formats());
  $options['site-wide'] = t('Site default');
  foreach ($formats as $f) {
    $options[$f] = format_date(time(), 'custom', $f);
  }
  $form['input']['input_format'] = array(
    '#type' => 'select', '#title' => t('Input format'),
    '#default_value' => $widget['input_format'],
    '#options' => $options,
    '#description' => t('Set the order and format for the date parts in the input form. The format will be adapted to remove values not in the granularity for this field.'),
  );

  $form['input']['format']['input_format_custom'] = array(
    '#type' => 'textfield',  '#title' => t('*Custom input format'),
    '#default_value' => $widget['input_format_custom'] ? $widget['input_format_custom'] : '',
    '#description' => t('The custom format, if provided, will override the input format selected above. See more about custom date formats below.'),
  );
  if ($widget['type'] == 'date_select') {
    $form['input']['advanced']['year_range'] = array(
      '#type' => 'textfield',
      '#title' => t('Years back and forward'),
      '#default_value' => isset($widget['year_range']) ? $widget['year_range'] : '-3:+3',
      '#size' => 10,
      '#maxsize' => 10,
      '#description' => t('Number of years to go back and forward when using a year selection list, default is -3:+3.'),
      );
    $form['input']['advanced']['increment'] = array(
      '#type' => 'select', '#title' => t('Time increment'),
      '#default_value' => isset($widget['increment']) ? $widget['increment'] : 1,
      '#options' => array(1 => 1, 5 => 5, 10 => 10, 15 => 15, 30 => 30),
      '#description' => t('Increment the minute and second fields by this amount.'),
    );
    $form['input']['advanced']['text_parts'] = array(
      '#tree' => TRUE,
      '#theme' => 'date_text_parts_theme',
      );
    $options = array(
      'year' => t('Year'),
      'mon' => t('Month'),
      'mday' => t('Day'),
      //'hours' => t('Hour'),
      //'minutes' => t('Minute'),
      //'seconds' => t('Second'),
      );
    foreach ($options as $key => $value) {
      $form['input']['advanced']['text_parts'][$key] = array(
        '#type' => 'radios',
        '#default_value' => in_array($key, (array) $widget['text_parts']) ? 1 : 0,
        '#options' => array(0 => '', 1 => ''),
        );
    }
  }
  return $form;
}

/**
 * Display the text/select options for date parts in a table
 * for easier readability.
 */
function theme_date_text_parts_theme($element) {
  $rows[] = array(t('Year'), drupal_render($element['year'][0]), drupal_render($element['year'][1]));
  $rows[] = array(t('Month'), drupal_render($element['mon'][0]), drupal_render($element['mon'][1]));
  $rows[] = array(t('Day'), drupal_render($element['mday'][0]), drupal_render($element['mday'][1]));

  // Additional options will only be supported in Version 5.2 where the new use of FAPI will make this easy to do.
  //$rows[] = array(t('Hours'), drupal_render($element['hours'][0]), drupal_render($element['hours'][1]));
  //$rows[] = array(t('Minutes'), drupal_render($element['minutes'][0]), drupal_render($element['minutes'][1]));
  //$rows[] = array(t('Seconds'), drupal_render($element['seconds'][0]), drupal_render($element['seconds'][1]));
  $header = array(t('Input Type'), t('Select list'), t('Text field'));
  return theme('table', $header, $rows);
}

/**
 * Implementation of hook_field_info().
 */
function _date_field_info() {
  return array(
    'date' => array('label' => 'Date'),
    'datestamp' => array('label' => 'Datestamp'),
  );
}

/**
 * Implementation of hook_field_settings().
 */
function _date_field_settings($op, $field) {
  switch ($op) {
    case 'form':
      return date_field_settings_form($field);

    case 'validate':
      date_set_site_timezone($field['field_timezone']);
      if (!in_array('Y', $field['granularity'])) {
        form_set_error('granularity', t('Input granularity must include a year.'));
      }
      if ($field['tz_handling'] != 'none' && !in_array('H', array_filter($field['granularity']))) {
        form_set_error('tz_handling', t('Dates without hours granularity must not use any timezone handling.'));
      }
      break;

    case 'save':

      $options = array('granularity', 'field_timezone', 'timezone_db', 'tz_handling', 'todate');
      for ($i = 0; $i <= 3; $i++) {
        switch ($i) {
        case(1):
          $name = 'long';
          break;
        case(2):
          $name = 'medium';
          break;
        case(3):
          $name = 'short';
          break;
        default:
          $name = 'default';
        }
        $append = ($i > 0 ? '_'. $name : '');
        $options[] = 'output_format_date'. $append;
        $options[] = 'output_format_custom'. $append;
      }
      return $options;

    case 'database columns':
      return date_columns($field);

    case 'arguments':
      include_once('./'. drupal_get_path('module', 'date') .'/date_views.inc');
      return _date_views_arguments($field);

    case 'filters':
      return date_views_filters($field);
      break;
  }
}

/**
 *  Callback for field columns.
 */
function date_columns($field) {
  if ($field['type'] == 'date') {
    $db_columns['value'] = array('type' => 'varchar', 'length' => 20, 'not null' => FALSE, 'default' => NULL, 'sortable' => TRUE);
  }
  elseif ($field['type'] == 'datestamp') {
    $db_columns['value'] = array('type' => 'integer', 'length' => 11, 'not null' => FALSE, 'default' => NULL, 'sortable' => TRUE);
  }
  // If a second date is needed for 'To date', just make a copy of the first one.
  if ($field['todate']) {
    $db_columns['value2'] = $db_columns['value'];
  }
  // timezone and offset columns are used only if date-specific dates are chosen.
  if ($field['tz_handling'] == 'date' && ($field['type'] == 'date' || $field['type'] == 'datestamp')) {
    $db_columns['timezone'] = array('type' => 'varchar', 'length' => 50, 'not null' => FALSE, 'default' => NULL, 'sortable' => TRUE);
    $db_columns['offset'] = array('type' => 'integer', 'length' => 10, 'not null' => FALSE, 'default' => NULL, 'sortable' => TRUE);
  }
  return $db_columns;
}

function date_field_settings_form($field) {
  $form = array();
  $tz_handling = $field['tz_handling'] ? $field['tz_handling'] : (date_has_time($field['granularity']) ? 'site' : 'none');
  $form['input']['todate'] = array(
    '#type' => 'select', '#title' => t('To Date'),
    '#options' => array('' => t('Never'), 'optional' => t('Optional'), 'required' => t('Required')),
    '#description' => t("Display a matching second date field as a 'To date'. If marked 'Optional' field will be presented but not required. If marked 'Required' the 'To date' will be required if the 'From date' is required or filled in."),
    '#default_value' => $field['todate'] ? $field['todate'] : '',
    );
  $form['input']['granularity'] = array(
    '#type' => 'checkboxes', '#title' => t('Granularity'),
    '#default_value' => $field['granularity'] ? $field['granularity'] : array('Y', 'M', 'D', 'H', 'N'),
    '#options' => date_granularity_names(),
    '#multiple' => TRUE,
    '#size' => min(count($options), 6),
    '#description' => t('Set the date elements to be stored (at least a year is required).'),
    );

  $form['output']['simple'] = date_formatter_setup_form($field, 0);
  $form['output']['simple']['#title'] = t('Default Display');

  $form['output']['advanced'] = array(
    '#type' => 'fieldset', '#title' => t('Additional Display Settings'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
    '#description' => t('Define alternate formatting for the date display. Options other than the default are made available to views and themes. Possible formats are default, long, medium, and short.'),
  );
  for ($i = 1; $i <= 3; $i++) {
    $form['output']['advanced'][$i] = date_formatter_setup_form($field, $i);
  }
  $form['timezone']['tz_handling'] = array(
    '#type' => 'select',
    '#title' => t('Time zone handling'),
    '#default_value' => $tz_handling,
    '#options' => date_timezone_handling_options(),
    '#description' => t('Select the timezone handling method to be used for this date field.'),
  );
  // Force this value to hidden because we don't want to allow it to be changed right now,
  // but allow it to be a variable if needed.
  $form['timezone']['timezone_db'] = array(
    '#type' => 'hidden',
    '#value' => 'UTC',
    );

  // need a way to identify the correct system timezone from an array of timezones with the same offset
  // save it as a system variable so it will default to the correct value after the first time it is set
  // aligns with system setting 'date_default_timezone'
  $form['timezone']['advanced']['field_timezone'] = array(
    '#type' => 'select',
    '#title' => t('Site timezone'),
    '#default_value' => date_get_site_timezone(),
    '#options' => drupal_map_assoc(date_timezone_options()),
    '#description' => t('Select the timezone to be used as the site\'s timezone for all date fields in every content type in which they appear. List includes GMT and all timezones with the same GMT offset as the site timezone setting.'),
  );

  $form['#suffix'] = t('<div class="form-item"><div class="description">* The custom format, if provided, will override the selected display or input options. Define a php date format string like \'m-d-Y H:i\' (see !link for more details).</div></div>', array('!link' => l('http://php.net/date', 'http://php.net/date')));

  return $form;
}

/**
 *  A form to create a date formatter option
 */
function date_formatter_setup_form($field, $delta) {

  switch ($delta) {
  case(1):
    $name = 'long';
    $label = t('Long');
    $default = variable_get('date_format_long',  'l, F j, Y - H:i');
    break;
  case(2):
    $name = 'medium';
    $label = t('Medium');
    $default = variable_get('date_format_medium',  'D, m/d/Y - H:i');
    break;
  case(3):
    $name = 'short';
    $label = t('Short');
    $default = variable_get('date_format_short', 'm/d/Y - H:i');
    break;
  default:
    $name = 'default';
    $label = t('Default');
    $default = variable_get('date_format_short', 'm/d/Y - H:i');
  }
  $append = ($delta > 0 ? '_'. $name : '');
  $form = array(
    '#type' => 'fieldset', '#title' => $label,
    );
  $formats = array_merge(date_short_formats(), date_medium_formats(), date_long_formats());
  $options = array();

  // Get an example date and make sure the difference between
  // month and day and 12 and 24 hours will be clear.
  $now = time();
  if (date('m', $now) == date('d', $now)) {
    $now += 86400;
  }
  if (date('H', $now) == date('h', $now)) {
    $now += 43200;
  }

  // This allows us to store the timezone preference as a part of the date format string.
  // Full implementation that will get this working correctly will not come until
  // Version 5.2, but this way the information will not get lost until the upgrade.
  $offset = variable_get('date_default_timezone', 0);
  $timezone_name = variable_get('date_default_timezone_name', 'UTC');
  foreach ($formats as $format) {
    // Create an option that shows date only without time, along with the
    // default string which has both date and time.
    $no_time = date_limit_format($format, array('M', 'D', 'Y'));
    $zones = array('', 'O', 'P', 'e');
    foreach ($zones as $zone) {
      $time_format = !empty($zone) ? $format .' '. $zone : $format;
      $options[$no_time] = date_format_date($no_time, $now, $offset, $timezone_name);
      $options[$time_format] = date_format_date($time_format, $now, $offset, $timezone_name);
    }
  }
  asort($options);

  $form['output_format_date'. $append] = array(
    '#type' => 'select', '#title' => t('Date display'),
    '#default_value' => $field['output_format_date'. $append] ? $field['output_format_date'. $append] : $default,
    '#options' => $options,
    '#multiple' => false,
  );
  $form['output_format_custom'. $append] = array(
    '#type' => 'textfield', '#title' => t('*Custom display format'),
    '#default_value' => $field['output_format_custom'. $append] ? $field['output_format_custom'. $append] : '',
  );
  return $form;
}
