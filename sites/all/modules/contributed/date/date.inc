<?php
//$Id: date.inc,v 1.27.2.44 2007/12/02 17:36:21 karens Exp $

/**
 * @file
 * Date/time API functions
 *
 * this api uses timezones rather than offsets to avoid dst problems
 * the date_timezone.inc api is used to compute the correct offset for a timezone, taking into account dst
 *
 * Usage examples:
 *  create a new date object:
 *    $date = date_make_date();
 *
 *  set local value of 2006-05-04T10:24:00 US/Eastern
 *    date_set_date($date, '2006-05-04T10:24:00', 'US/Eastern', 'local', DATE_ISO);
 *
 *  display the local value using the format string 'm/d/Y H:i'
 *    print date_show_date($date, 'm/d/Y H:i', 'local');
 *
 *  display the db values of the date object:
 *    print date_show_value($date, 'db', DATE_UNIX); // the unix db value
 *    print date_show_value($date, 'db', DATE_ISO);  // the iso db value
 *
 *  display the date object and all its parts:
 *    print_r($date);
 */
/**
 *  Date wrapper functions
 *
 *  will use external library if available, otherwise native php date functions
 *  currently set up for adodb date library, could be extended to include other date libraries
 *
 *  @param $array - array parameters are in the format created by getdate()
 *  prefix functions with @ to surpress ugly windows error messages for dates outside valid range
 */
function date_load_library() {
  if (DATE_LIBRARY == 'ADODB' && !function_exists('adodb_date_test_date') && file_exists(DATE_LIBRARY_FILE)) {
    include_once(DATE_LIBRARY_FILE);
  }
}
function date_getdate($timestamp) {
  date_load_library();
  switch (DATE_LIBRARY) {
    case('ADODB'):
      return adodb_getdate($timestamp);
    default:
      return getdate($timestamp);
  }
}
/**
 *  We need a gmgetdate function, which does not exist
 *  because the getdate function creates an array where date parts and timestamp don't match
 *  getdate date parts are timezone-adjusted to the server zone and timestamp is not
 *  we need an array where date parts match the timestamp.
 *  Check for empty timestamps to make sure empty values don't display as 1/1/1970.
 */
function date_gmgetdate($timestamp) {
  if ($timestamp === FALSE) return '';
  date_load_library();
  switch (DATE_LIBRARY) {
    case('ADODB'):
      // Must use the private function to force it to GMT.
      $array    = _adodb_getdate($timestamp, FALSE, TRUE);
      $array[0] = $timestamp;
      return $array;
    default:
      // The date_adj_zone function corrects for timezone adjustment getdate will add.
      $array    = getdate(date_adj_zone($timestamp));
      $array[0] = $timestamp;
      return $array;
  }
}
function date_date($format, $timestamp = FALSE) {
  if ($timestamp === FALSE) return '';
  date_load_library();
  switch (DATE_LIBRARY) {
  case('ADODB'):
    return @adodb_date($format, ($timestamp));
  default:
    return date($format, $timestamp);
  }
}
function date_gmdate($format, $timestamp = FALSE) {
  if ($timestamp === FALSE) return '';
  date_load_library();
  switch (DATE_LIBRARY) {
    case('ADODB'):
    return @adodb_gmdate($format, $timestamp);
  default:
    return @gmdate($format, $timestamp);
  }
}
function date_mktime($array) {
  date_load_library();
  switch (DATE_LIBRARY) {
  case('ADODB'):
    $timestamp = @adodb_mktime(intval($array['hours']), intval($array['minutes']), intval($array['seconds']), max(intval($array['mon']), 1), max(intval($array['mday']), 1), intval($array['year']) > 0 ? intval($array['year']) : date('Y'));
    return $timestamp;
  default:
    $timestamp = @mktime(intval($array['hours']), intval($array['minutes']), intval($array['seconds']), max(intval($array['mon']), 1), max(intval($array['mday']), 1), intval($array['year']) > 0 ? intval($array['year']) : date('Y'));
    return $timestamp;
  }
}
function date_gmmktime($array) {
  date_load_library();
  switch (DATE_LIBRARY) {
    case('ADODB'):
    $timestamp = @adodb_gmmktime(intval($array['hours']), intval($array['minutes']), intval($array['seconds']), max(intval($array['mon']), 1), max(intval($array['mday']), 1), intval($array['year']) > 0 ? intval($array['year']) : date('Y'));
    return $timestamp;
  default:
    $timestamp = @gmmktime(intval($array['hours']), intval($array['minutes']), intval($array['seconds']), max(intval($array['mon']), 1), max(intval($array['mday']), 1), intval($array['year']) > 0 ? intval($array['year']) : date('Y'));
    return $timestamp;
  }
}
function date_strftime($format, $timestamp = FALSE) {
  if (!$timestamp) return '';
  date_load_library();
  switch (DATE_LIBRARY) {
    case('ADODB'):
    return @adodb_strftime($format, $timestamp);
  default:
    return @strftime($format, $timestamp);
 }
}
function date_gmstrftime($format, $timestamp = FALSE) {
  if (!$timestamp) return '';
  date_load_library();
  switch (DATE_LIBRARY) {
    case('ADODB'):
    return @adodb_gmstrftime($format, $timestamp);
  default:
    return @gmstrftime($format, $timestamp);
 }
}

/**
 *  These functions will remove server timezone adjustment from timestamps
 *  needed because some php date functions automatically adjust to server zone
 *  but the date object uses raw values for date parts and does manual timezone adj
 *  needed for ability to accomodate timezones other than server zone
 */
function date_adj_zone($timestamp) {
  // No timezone adjustment for very old dates.
  if ($timestamp < 86400) {
    return $timestamp;
  }
  date_load_library();
  switch (DATE_LIBRARY) {
    case('ADODB'):
      return intval($timestamp - adodb_date('Z', $timestamp));
  default:
      return intval($timestamp - date('Z', $timestamp));
  }
}
function date_gmadj_zone($timestamp) {
  // No timezone adjustment for very old dates.
  if ($timestamp < 86400) {
    return $timestamp;
  }
  date_load_library();
  switch (DATE_LIBRARY) {
    case('ADODB'):
      return intval($timestamp + adodb_date('Z', $timestamp));
  default:
      return intval($timestamp + date('Z', $timestamp));
  }
}

/**
 * Implementation of time() adjusted for the current site and user.
 *
 * @param $offset - optional method to force time to a specific offset
 * @return integer timestamp
 */
function date_time($offset = NULL) {
  global $user;

  if ($offset) {
  	return (time() - date("Z")) + offset;
  }
  elseif (variable_get('configurable_timezones', 1) && $user->uid && strlen($user->timezone)) {
    return (time() - date("Z")) + $user->timezone;
  }
  else {
    return (time() - date("Z")) + variable_get('date_default_timezone', 0);
  }
}

/**
 *  Function to create a date object
 *
 *  All creation, manipulation, and display of the date is done using this date object
 *
 *  @param $value - the date/time value to set
 *  @param $timezone - 'GMT', 'none', or timezone name - the timezone of this value
 *  @param $type - db or local, the part of the date object to set
 *  @param $format - DATE_UNIX or DATE_ISO, the format of the provided value
 *  @return - the date object
 */
function date_make_date($value = '', $timezone = 'GMT', $type = 'db', $format = DATE_ISO) {

  $date                   = new StdClass();
  $date->db               = new StdClass();
  $date->db->timestamp    = NULL;
  $date->db->iso          = NULL;
  $date->db->parts        = NULL;
  $date->local            = new StdClass();
  $date->local->timestamp = NULL;
  $date->local->iso       = NULL;
  $date->local->parts     = NULL;
  $date->local->timezone  = NULL;
  $date->local->offset    = NULL;
  if (trim($value) == '') return $date;
  // if initialized with a date, go ahead and set that date up
  date_set_date($date, $value, $timezone, $type, $format);
  return $date;
}

/**
 *  Function to set local and db date parts in the date object
 *
 *  @param $date - the date object
 *  @param $value - the date/time value to set
 *  @param $timezone - 'GMT', 'none', or timezone name - the timezone of this value
 *     - the 'none' option will do no timezone conversions, dates will be stored exactly as entered
 *  @param $type - db or local, the part of the date object to set
 *     - if you supply a local value and timezone, the function will create the related db values
 *  @param $format - DATE_UNIX or DATE_ISO, the format of the provided value
 *     - if you supply a unix timestamp, the date object will also create an iso version of the date, and vice versa
 *  @param $reset - force a reset of the provided value even if it already exists
 */
function date_set_date(&$date, $value, $timezone = 'GMT', $type = 'db', $format = DATE_ISO, $reset = FALSE, $display_errors = FALSE) {
  if (trim($value) == '') {
    // make new blank date
    $date = date_make_date();
    return TRUE;
  }
  // Turn date-only ISO date into complete ISO date,
  // i.e. 2007-10-01 becomes 2007-10-01T00:00:00.
  if ($format == DATE_ISO && strlen($value) < 19) {
    $value = substr($value .'T00:00:00', 0, 19);
  }
  // store the starting value of the date object in case there are errors
  $old_date = $date;
  $error = array();
  if (trim($value) === 'ERROR') {
  	$error[] = 'value';
  }
  if (!$error && $format == DATE_UNIX) {
    $date->$type->timestamp = $value;
    $parts = date_unix2array($value);
    if ($parts === 'ERROR') {
      $error[] = 'unix2array';
    }
    else {
      $date->$type->parts = $parts;
    }
    $iso = date_unix2iso($value);
    if ($iso === 'ERROR') {
      $error[] = 'unix2iso';
    }
    else {
      $date->$type->iso = $iso;
    }
  }
  elseif (!$error && $format == DATE_ISO) {
    $date->$type->iso = $value;
    $parts = date_iso2array($value);
    if ($parts === 'ERROR') {
      $error[] = 'iso2array';
    }
    else {
      $date->$type->parts = $parts;
    }
    $unix = date_iso2unix($value);
    if ($unix === 'ERROR') {
      $error[] = 'iso2unix';
    }
    else {
      $date->$type->timestamp = $unix;
    }
  }
  else {
    $error[] = $format;
  }
  if (!$error && $type == 'local' && (!$date->db->iso || $reset)) {
    if (!date_no_conversion($date) && !empty($timezone)) {
      $date->local->timezone = $timezone;
      // if the local value was submitted, go ahead and compute the db part of the date
      date_convert_timezone($date, $date->local->timezone, 'GMT', 'db');
    }
    else {
      $date->db = $date->local;
    }
  }
  elseif (!$error && $type == 'db' && $date->local->iso && (!$date->local->iso || $reset)) {
    if (!date_no_conversion($date) && !empty($timezone)) {
      // compute local value if the db value was submitted
      // and the local value has not been created and there is a local timezone
      date_convert_timezone($date, 'GMT', $date->local->timezone, 'local');
    }
    else {
      $date->local = $date->db;
    }
  }
  if ($error) {
    // if unable to set date to this value, revert to previous date settings and show error message
    $date = $old_date;
    if ($display_errors) {
      drupal_set_message(t('Unable to set date. ') . implode(', ', $error));
    }
    return FALSE;
  }
  return TRUE;
}

/**
 *  Function to identify dates that must never have timezone conversion.
 *
 * @param object $date
 * @return true or false
 */
function date_no_conversion($date) {
  if (isset($date->local->parts['year']) && $date->local->parts['year'] < 1970) {
    return TRUE;
  }
  elseif (isset($date->db->parts['year']) && $date->db->parts['year'] < 1970) {
    return TRUE;
  }
  return FALSE;
}

/**
 *  Timezone conversion function
 *
 *  @param $date - the date object
 *  @param $timezone_in - 'none', 'GMT', or timezone name in format 'US/Central'
 *  @param $timezone_out - 'none', 'GMT', or timezone name in format 'US/Central'
 *  @param $type - 'db' or 'local', the part of the date object to be created
 *
 */
function date_convert_timezone(&$date, $timezone_in = 'GMT', $timezone_out = 'GMT', $type = 'db') {
  $fromtype = $type == 'db' ? 'local' : 'db';
  // skip timezone conversion if no timezone conversion was desired
  // set the local and db parts of the date object to be the same and return
  if ($timezone_in == 'none' || $timezone_out == 'none' || !isset($date->$fromtype->parts[0])) {
    if (($date->local->iso || $date->local->iso == 0) && !$date->db->iso) {
      date_set_date($date, $date->local->iso, $timezone_out, 'db', DATE_ISO);
    }
    elseif (($date->db->iso || $date->db->iso == 0) && !$date->local->iso) {
      date_set_date($date, $date->db->iso, $timezone_out, 'local', DATE_ISO);
    }
    return;
  }
  if ($type == 'local') {
    $date->local->timezone = $timezone_out;
    // attempt conversion only when there is available data to use
    if (!$date->db->iso && !$date->db->iso == 0) return;
    // see if an offset applies, and adjust date accordingly
    if ($offset = date_offset(date_gmgetdate($date->db->timestamp), $date->local->timezone)) {
      $out_date = $date->db->timestamp + $offset;
      date_set_date($date, $out_date, $timezone_out, $type, DATE_UNIX);
      $date->local->offset = $offset;
    // no offset, just set other part of date object to same value
    }
    else {
      date_set_date($date, $date->db->iso, $timezone_out, $type, DATE_ISO);
      $date->local->offset = 0;
    }
  }
  else {
    // attempt conversion only when there is available data to use
    if ((!$date->local->iso && !$date->local->iso == 0) || !$date->local->timezone) return;
    // see if an offset applies, and adjust date accordingly
    if ($offset = date_offset(date_gmgetdate($date->local->timestamp), $date->local->timezone)) {
      $out_date = $date->local->timestamp - $offset;
      date_set_date($date, $out_date, $timezone_out, $type, DATE_UNIX);
      $date->local->offset = $offset;
    }
    else {
      date_set_date($date, $date->local->iso, $timezone_out, $type, DATE_ISO);
      $date->local->offset = 0;
    }
  }
  return;
}

/**
 *  A function to calculate offset using timezone.inc file
 *
 *  @param  $date_parts - an array of date parts in the format created by getdate()
 *  @param  $timezone - the timezone to use
 *  @return $offset - the offset of $timezone from GMT on the $date_parts date
 */
function date_offset($date_parts, $timezone = 'GMT') {
  include_once('./'. drupal_get_path('module', 'date_api') .'/date_timezones.inc');
  // no adjustment needed for gmt dates
  if ($timezone == 'GMT') return 0;
  // find the timezone info for the input timezone
  $timezones = array_flip(date_zonelist());
  $zid       = $timezones[$timezone];
  // create a timestamp for the date to be evaluated
  if ($date_parts['year'] < 1970) {
    // fudge offset for dates prior to 1970 by finding the offset in 1971
    $date_parts['year'] = 1971;
    $timestamp = date_array2unix($date_parts);
  }
  else {
    $timestamp = $date_parts[0];
  }
  return date_get_offset($zid, $timestamp);
}

/**
 *  A function to display the database value for the date object
 *
 *  @param $date - the date object
 *  @param $format - DATE_UNIX or DATE_ISO, the type of value to display
 *  @param $type - 'db' or 'local', the date value to display
 */
function date_show_value($date, $type = 'db', $format = DATE_ISO) {
  if ($format == DATE_UNIX) {
    return $date->$type->timestamp;
  }
  else {
    return $date->$type->iso;
  }
}

/**
 *  A function to display formatted output for the date object
 *
 *  @param $date - the date object
 *  @param $format_string - the format string to be used for the display
 *  @param $type - 'local' or 'db', the date value to be displayed
 */
function date_show_date($date, $format_string, $type = 'local') {
  if ($type == 'db' || (!$date->local->timestamp && $date->local->timestamp != 0)) {
    return date_format_date($format_string, date_fuzzy_stamp($date->db), $date->local->offset, $date->local->timezone) . $append;
  }
  elseif ($date->local->timestamp || $date->local->timestamp == 0) {
    return date_format_date($format_string, date_fuzzy_stamp($date->local), $date->local->offset, $date->local->timezone) . $append;
  }
}

/**
 * Format date
 *
 * Translate month and day text in date formats.
 * Using gmdate so php won't try to adjust value for server timezone.
 * Needed because date object has already made necessary timezone adjustments.
 *
 * Similar to core format_date function but will work on old, pre-1970 dates
 * if adodb library is available.
 */
function date_format_date($format, $timestamp, $offset = NULL, $timezone_name = NULL) {
  $max = strlen($format);
  if (isset($timezone_name) && !isset($offset)) {
    $offset = date_offset(date_gmgetdate($timestamp), $timezone_name);
  }
  $date = '';
  for ($i = 0; $i < $max; $i++) {
    $c = $format[$i];
    if (strpos('AaDFlM', $c) !== FALSE) {
      $date .= t(date_gmdate($c, $timestamp));
    }
    elseif (strpos('BdgGhHiIjLmnsStUwWYyz', $c) !== FALSE) {
      $date .= date_gmdate($c, $timestamp);
    }
    elseif ($c == 'r') {
      $date .= date_format_date($timestamp, 'D, d M Y H:i:s O', $offset, $timezone_name);
    }
    elseif ($c == '\\') {
      $date .= $format[++$i];
    }
    // PHP's default handling of timezones will give you the server timezone,
    // which may not be right. The 'T' option to show a timezone abbreviation
    // for a specific timezone that may not be the server timezone can't be
    // replicated in PHP4, but there will be a solution for that
    // in the 5.2 version of the Date API.
    elseif ($c == 'O') {
      if (isset($offset)) {
        $hours   = intval($offset / 3600);
        $minutes = intval(($offset / 60) - ($hours * 60));
        $date .= ' '. sprintf('%+05d', $hours * 100);
      }
    }
    elseif ($c == 'P') {
      if (isset($offset)) {
        $hours   = intval($offset / 3600);
        $minutes = intval(($offset / 60) - ($hours * 60));
        $date .= ' '. sprintf('%+03d', $hours) .':'. sprintf('%02d', $minutes);
      }
    }
    elseif ($c == 'e' || $c == 'T') {
      if (isset($timezone_name)) {
        $date .= ' '. $timezone_name;
      }
    }
    else {
      $date .= $c;
    }
  }
  return $date;
}

/**
 *  Create a valid timestamp that can be used for date formatting
 *  even if only partial date info is available,
 *  i.e. for an iso date with month and year only
 */
function date_fuzzy_stamp($datetype) {
  if ($datetype->timestamp) {
    return $datetype->timestamp;
  }
  else {
    return date_gmmktime(array(
      'year'   =>  ($datetype->parts['year']    ? $datetype->parts['year']    : date('Y')),
      'mon'    =>  ($datetype->parts['mon']     ? $datetype->parts['mon']     : 1),
      'mday'   =>  ($datetype->parts['mday']    ? $datetype->parts['mday']    : 1),
      'hours'   => ($datetype->parts['hours']   ? $datetype->parts['hours']   : 0),
      'minutes' => ($datetype->parts['minutes'] ? $datetype->parts['minutes'] : 0),
      'seconds' => ($datetype->parts['seconds'] ? $datetype->parts['seconds'] : 0),
      ));
  }
}

/**
 *  A function to append the zone offset or name to a display
 *
 *  Alternative to timezone identifiers in format string
 *  needed because format string tz identification may display server zone rather than site or date zone
 *  no option for zone abbreviation (i.e. EST) because zone abbreviations
 *  are not unique, nor are they available in the timezone.inc data
 *
 *  @param $type - the type of display desired
 *      - '0000' will display zone offset like -0500
 *      - '00:00' will display zone offset like -05:00
 *      - 'name' will display zone name
 */
function date_append_zone($date, $type = '') {
  if (!$type) return;
  $offset  = intval($date->local->offset);
  $hours   = intval($offset / 3600);
  $minutes = intval(($offset / 60) - ($hours * 60));
  switch (trim($type)) {
  case('0000'):
    return ' '. sprintf('%+05d', $hours * 100);
  case('00:00'):
    return ' '. sprintf('%+03d', $hours) .':'. sprintf('%02d', $minutes);
  case('name'):
    return ' '. $date->local->timezone;
  }
}

function date_append_zone_options() {
  return array(
    '' => '',
    '0000' => '+-0000',
    '00:00' => '+-00:00',
    'name' => t('zone name'),
    );
}

/**
 *  Time zone option list
 *
 *  @return array of timezone ids (i.e. US/Eastern, US/Central)
 *  @param  $limit - an optional offset value, to limit the results to timezones that match that offset
 */
function date_timezone_options($limit = '') {
  include_once('./'. drupal_get_path('module', 'date_api') .'/date_timezones.inc');
  $zonelist = array();
  if (!$limit) {
    $zonelist = drupal_map_assoc(date_zonelist());
  }
  else {
    $zones = date_get_timezones();
    foreach ($zones as $zone) {
      if ($zone['offset'] == $limit || $zone['offset_dst'] == $limit) {
        $zonelist[$zone['timezone']] = $zone['timezone'];
      }
    }
  }
  $zonelist += array('GMT' => 'GMT');
  asort($zonelist);
  return $zonelist;
}

/**
 *  Set system variable for site default timezone
 *  Needed because current system variable tracks offset rather than timezone
 */
function date_set_site_timezone($val) {
  include_once('./'. drupal_get_path('module', 'date_api') .'/date_timezones.inc');
  $timezones = date_zonelist();
  if (!in_array($val, $timezones)) $val = 'GMT';
  variable_set('date_default_timezone_name', $val);
}

/**
 *  Get system variable setting for site default timezone
 */
function date_get_site_timezone() {
  return variable_get('date_default_timezone_name', '');
}

/**
 *  Timezone handling options
 *  omitting user option for now because we only know the user's offset at best, not their timezone
 *  come back later and enable this option if there is a way to collect and save user timezones
 *
 *  the 'none' option will do no timezone conversions and will store and display dates exactly as entered
 *  useful in locales or situations where timezone conversions are not working reliably,
 *  for dates with no times, for historical dates where timezones are irrelevant,
 *  or anytime conversion is unnecessary or undesirable
 */
function date_timezone_handling_options() {
  return array(
    'gmt' => 'GMT',
    'site' => t('Site\'s time zone'),
    'date' => t('Date\'s time zone'),
    //'user' => t('User\'s time zone'),
    'none' => t('No time zone conversion'),
  );
}

/**
 *  Function to figure out which timezone applies to a date and select it
 */
function date_get_timezone($handling, $timezone = '') {
  switch ($handling) {
    case('site'):
      $timezone_out = date_get_site_timezone();
      break;
    case('date'):
      $timezone_out = $timezone > '' ? $timezone : date_get_site_timezone();
      break;
    case('user'):
      // come back here and add appropriate value if user timezones are can be collected and saved
      // until then, user option is not enabled
    case('none'):
      $timezone_out = 'none';
      break;
    default:
      $timezone_out = 'GMT';
  }
  return $timezone_out > '' ? $timezone_out : 'GMT';
}


/**
 *  Flexible Date/Time Drop-Down Selector
 *
 *  $params = an array of values, including
 *    label = the label for the date group, default is 'Date'
 *    value = the date/time to be processed, default is the current date and time
 *    timezone_in  = the timezone of the date/time value to be processed, default is GMT
 *    timezone_out = the timezone to be used when displaying the date, default is date site timezone, if set, or GMT
 *       valid timezones are standard timezone ids like US/Central, America/New_York, GMT
 *    format = the format of the date value, default is DATE_ISO
 *       DATE_UNIX => unix timestamp
 *       DATE_ISO => iso 8601 YYYY-MM-DDThh:mm:ss
 *    am/pm = 0 to display 24 hour format, 1 to display 12 hour format with am/pm selector, default is 0
 *    weight = the weight of the date group, default is 0
 *    delta = a delta value for the group to accomodate multiple date fields, default is 0
 *    granularity = an array of date parts to be selected, like array('Y','M','D'), default is M, D, Y
 *       Y => year, M => month, D => day, H => hours, N => minutes, S => seconds, T => timezone
 *    increment = increment minutes and seconds by increment amount, default is 1
 *    opt_fields = an array of fields that need not be filled out, default is empty array
 *    blank_default = 1 to show an empty date field with blank values, 0 to fill with current date, default is 0
 *    required = 1 if the field must contain a valid date, default is 1
 *    description = text to be used as a description for the fieldset
 */
function date_select_input($params) {
  drupal_add_css('./'. drupal_get_path('module', 'date_api') .'/date.css');
  // set the variables
  $label         = $params['label'] ? $params['label'] : t('Date');
  $delta         = isset($params['delta']) ? $params['delta'] : 0;
  $granularity   = is_array($params['granularity']) ? $params['granularity'] : array('M', 'D', 'Y');
  $increment     = isset($params['increment']) ? $params['increment'] : 1;
  $required      = isset($params['required']) ? $params['required'] : 1;
  $format        = isset($params['format']) ? $params['format'] : DATE_ISO;
  $formats       = $params['formats'];
  $weight        = isset($params['weight']) ? $params['weight'] : 0;
  $opt_fields    = is_array($params['opt_fields']) ? $params['opt_fields'] : array();
  $blank_default = isset($params['blank_default']) ? $params['blank_default'] : 0;
  $timezone_in   = isset($params['timezone_in']) ? $params['timezone_in'] : (!$blank_default || $params['value'] ? 'GMT' : '');
  $timezone_out  = isset($params['timezone_out']) ? $params['timezone_out'] : (!$blank_default || $params['value'] ? date_get_site_timezone() : '');
  $description   = $params['description'];
  $select_month  = !in_array('mon', $params['text_parts']);
  $select_day    = !in_array('mday', $params['text_parts']);
  $select_year   = !in_array('year', $params['text_parts']);
  $year_range    = explode(':', $params['year_range']);
  $years_back    = abs($year_range[0]);
  $years_forward = abs($year_range[1]);

  if ($formats['input']['am_pm']) {
    $hours_format = 'g';
    for ($i = 0; $i <= 12; $i++) $hours_array[$i] = $i < 10 ? "0$i" : $i;
  }
  else {
    $hours_format = 'G';
    for ($i = 0; $i <= 23; $i++) $hours_array[$i] = $i < 10 ? "0$i" : $i;
  }
  // create a date object with the desired date
  $date = date_make_date();
  if ($params['value']) {
    date_set_date($date, $params['value'], $timezone_in, 'db', $format);
    date_convert_timezone($date, $timezone_in, $timezone_out, 'local');
  }
  // find current date
  switch ($format) {
    case(DATE_UNIX):
      $now = date_gmadj_zone(time());
      break;
    default:
      $now = date_unix2iso(date_gmadj_zone(time()));
  }
  if (!$blank_default && $params['value'] == '') {
    date_set_date($date, $now, $timezone_out, 'local', $format);
  }
  if (!$blank_default || $params['value'] > '') {
    $year    = date_show_date($date, 'Y');
    $mon     = date_show_date($date, 'n');
    $mday    = date_show_date($date, 'j');
    $hours   = date_show_date($date, $hours_format);
    $minutes = intval(date_show_date($date, 'i'));
    $seconds = intval(date_show_date($date, 's'));
    $ampm    = strtolower(date_show_date($date, 'a'));
  }
  // create the form values
  $form['#title']  = $label;
  $form['#weight'] = intval($weight);
  $form['#theme']  = 'date_form_select';
  $form['#attributes'] = array('class' => 'container-inline-date');
  if (in_array('D', $granularity)) {
    $form['mday'] = array(
      '#default_value' => $mday,
      '#title' => t('day'),
      '#required' => ($required && !in_array('mday', $opt_fields)) ? $required : 0,
      '#weight' => $formats['input']['select']['D'],
    );
    if ($select_day) {
      $days_array = drupal_map_assoc(range(1, 31));
      if (!$required || in_array('mday', $opt_fields) || $blank_default) array_unshift($days_array, '');
      $form['mday']['#type'] = 'select';
      $form['mday']['#options'] = $days_array;
    }
    else {
      $form['mday']['#type'] = 'textfield';
      $form['mday']['#maxlength'] = 2;
      $form['mday']['#size'] = 2;
    }
  }
  if (in_array('M', $granularity)) {
    $form['mon'] = array(
      '#default_value' => $mon,
      '#title' => t('month'),
      '#required' => ($required && !in_array('mon', $opt_fields)) ? $required : 0,
      '#weight' => $formats['input']['select']['M'],
    );
    if ($select_month) {
      $months_array = drupal_map_assoc(range(1, 12), 'map_month');
      if (!$required || in_array('mon', $opt_fields) || $blank_default) array_unshift($months_array, '');
      $form['mon']['#type'] = 'select';
      $form['mon']['#options'] = $months_array;
    }
    else {
      $form['mon']['#type'] = 'textfield';
      $form['mon']['#maxlength'] = 2;
      $form['mon']['#size'] = 2;
    }
  }
  if (in_array('Y', $granularity)) {
    $form['year'] = array(
      '#default_value' => $year,
      '#title' => t('year'),
      '#required' => ($required && !in_array('year', $opt_fields)) ? $required : 0,
      '#weight' => $formats['input']['select']['Y'],
    );
    if ($select_year) {
      $year = $year > 0 ? $year : date_gmdate('Y', date_gmadj_zone(time()));
      $years_array = drupal_map_assoc(range($year - $years_back, $year + $years_forward));
      // array_unshift converts the assoc array to a numeric one, can't use it here
      if (!$required || in_array('year', $opt_fields) || $blank_default) $years_array = array(0 => '') + $years_array;
      $form['year']['#type'] = 'select';
      $form['year']['#options'] = $years_array;
    }
    else {
      $form['year']['#type'] = 'textfield';
      $form['year']['#maxlength'] = 4;
      $form['year']['#size'] = 4;
    }
  }
  if (in_array('H', $granularity)) {
    $form['hours'] = array(
      '#type' => 'select',
      '#default_value' => $hours,
      '#options' => $hours_array,
      '#required' => ($required && !in_array('hours', $opt_fields)) ? $required : 0,
      '#title' => t('hour'),
      '#weight' => 4,
    );
  }
  if (in_array('N', $granularity)) {
    for ($i = 0; $i <= 59; $i += $increment) $minutes_array[$i] = $i < 10 ? "0$i" : $i;
    $form['minutes'] = array(
      '#type' => 'select',
      '#default_value' => $minutes,
      '#options' => $minutes_array,
      '#required' => ($required && !in_array('minutes', $opt_fields)) ? $required : 0,
      '#title' => t('minute'),
      '#weight' => 5,
    );
  }
  if (in_array('S', $granularity)) {
    for ($i = 0; $i <= 59; $i += $increment) $seconds_array[$i] = $i < 10 ? "0$i" : $i;
    $form['seconds'] = array(
      '#type' => 'select',
      '#default_value' => $seconds,
      '#options' => $seconds_array,
      '#required' => ($required && !in_array('seconds', $opt_fields)) ? $required : 0,
      '#title' => t('second'),
      '#weight' => 6,
    );
  }
  if ($formats['input']['am_pm']) {
    $options = array('am' => t('am'), 'pm' => t('pm'));
    if (!$required || in_array('hours', $opt_fields) || $blank_default) array_unshift($options, '');
    $form['ampm'] = array(
      '#type' => 'select',
      '#default_value' => $ampm,
      '#options' => $options,
      '#required' => ($required && !in_array('hours', $opt_fields)) ? $required : 0,
      '#title' => t('am/pm'),
      '#weight' => 8,
    );
  }
  $form[] = array(
    '#theme' => 'date_form_select_description',
    '#weight' => 11,
    'description' => array(
      '#value' =>  $description,
     ),
  );
  return $form;
}

/**
 *  Text date input form, with optional jscalendar popup
 *
 *  $params = an array of values, including
 *    label = the label for the date group, default is 'Date'
 *    value = the date/time to be processed, default is the current date and time
 *    timezone_in  = the timezone of the date/time value to be processed, default is GMT
 *    timezone_out = the timezone to be used when displaying the date, default is date site timezone, if set, or GMT
 *       valid timezones are standard timezone ids like US/Central, America/New_York, GMT
 *    format = the format of the date value, default is DATE_ISO
 *       DATE_UNIX => unix timestamp
 *       DATE_ISO => iso 8601 YYYY-MM-DDThh:mm:ss
 *    weight = the weight of the date group, default is 0
 *    delta = a delta value for the group to accomodate multiple date fields, default is 0
 *    granularity = an array of date parts to be selected, like array('Y','M','D'), default is M, D, Y
 *       Y => year, M => month, D => day, H => hours, N => minutes, S => seconds, T => timezone
 *    required = 1 if the field must contain a valid date, default is 1
 *    description = text to be used as a description for the fieldset
 *    blank_default = 1 to show an empty date field with blank values, 0 to fill with current date, default is 0
 *    jscalendar = 1 use if available, 0 do not use
 */
function date_text_input($params) {
  // set the variables
  $label         = $params['label'] ? $params['label'] : t('Date');
  $delta         = isset($params['delta']) ? $params['delta'] : 0;
  $granularity   = is_array($params['granularity']) ? $params['granularity'] : array('M', 'D', 'Y');
  $required      = isset($params['required']) ? $params['required'] : 1;
  $blank_default = isset($params['blank_default']) ? $params['blank_default'] : 0;
  $format        = isset($params['format']) ? $params['format'] : DATE_ISO;
  $formats       = $params['formats'];
  $weight        = isset($params['weight']) ? $params['weight'] : 0;
  $timezone_in   = isset($params['timezone_in']) ? $params['timezone_in'] : (!$blank_default || $params['value'] ? 'GMT' : '');
  $timezone_out  = isset($params['timezone_out']) ? $params['timezone_out'] : (!$blank_default || $params['value'] ? date_get_site_timezone() : '');
  $description   = $params['description'];
  $jscalendar    = $params['jscalendar'] ? 1 : 0;
  $opt_fields    = is_array($params['opt_fields']) ? $params['opt_fields'] : array();
  $field_name    = $params['field_name'] ? $params['field_name'] : 'value';

  // create a new date object and convert it to the right timezone

  // create a date object with the desired date
  $date = date_make_date();
  if ($params['value']) {
    date_set_date($date, $params['value'], $timezone_in, 'db', $format);
    date_convert_timezone($date, $timezone_in, $timezone_out, 'local');
  }
  // if required and no date provided, use current date
  if ($required && !$blank_default && $params['value'] == '') {
    switch ($format) {
    case(DATE_UNIX):
      $now = date_gmadj_zone(time());
      break;
    default:
      $now = date_unix2iso(date_gmadj_zone(time()));
    }
    date_set_date($date, $now, $timezone_out, 'local', $format);
  }
  // get the local iso version of the database value
  $value = date_iso2custom(date_show_value($date, 'local'), $formats['input']['text']);
  // date-specific timezone not requested, just get date
  $form[$field_name] = array(
    '#type' => 'textfield',
    '#title' => $label,
    '#default_value' => $value,
    '#required' => ($delta == 0) ? $required : 0,
    '#description' => $description,
    '#weight' => $weight,
  );
  // if the jscalendar is used for input, add some attributes to be passed to the js
  // also need to adjust the date format slightly to accomodate the js capability
  if ($jscalendar && module_exists('jscalendar')) {
    $form[$field_name]['#attributes'] = array('class' => 'jscalendar');
    $form[$field_name]['#jscalendar_ifFormat'] = $formats['input']['jscal'];
    $form[$field_name]['#jscalendar_showsTime'] = date_has_time($granularity) ? 'true' : 'false';
    $form[$field_name]['#jscalendar_timeFormat'] = $formats['input']['am_pm'] ? '12' : '24';
    $form['#theme'] = 'date_form_jscalendar';
  }
  else {
    $form['#theme'] = 'date_form_text';
  }
  return $form;
}

/**
 *  Timezone input form
 *
 *  $params = an array of values, including
 *    timezone_in  = the timezone of the date/time value to be processed, default is GMT
 *    timezone_out = the timezone to be used when displaying the date, default is date site timezone, if set, or GMT
 *       valid timezones are standard timezone ids like US/Central, America/New_York, GMT
 *    granularity = an array of date parts to be selected, like array('Y','M','D'), default is M, D, Y
 *       Y => year, M => month, D => day, H => hours, N => minutes, S => seconds, T => timezone
 *    required = 1 if the field must contain a valid date, default is 1
 *    blank_default = 1 to show an empty date field with blank values, 0 to fill with current date, default is 0
 *    weight = the form weight
 */
function date_timezone_input($params) {
  // set the variables
  $required      = isset($params['required']) ? $params['required'] : 1;
  $blank_default = isset($params['blank_default']) ? $params['blank_default'] : 0;
  $timezone_in   = isset($params['timezone_in']) ? $params['timezone_in'] : (!$blank_default || $params['value'] ? 'GMT' : '');
  $timezone_out  = isset($params['timezone_out']) ? $params['timezone_out'] : (!$blank_default || $params['value'] ? date_get_site_timezone() : '');
  $opt_fields    = is_array($params['opt_fields']) ? $params['opt_fields'] : array();
  $granularity   = is_array($params['granularity']) ? $params['granularity'] : array('M', 'D', 'Y');
  $weight        = $params['weight'];
  $label         = $params['label'] ? $params['label'] .' ' : '';
  if (in_array('T', $granularity)) {
    $form['timezone'] = array(
      '#title' =>  $label . t('timezone'),
      '#type' => 'select',
      '#default_value' => $timezone_out ? $timezone_out : (!$blank_default ? 'GMT' : ''),
      '#options' => $required ? date_timezone_options() : array('' => '') + date_timezone_options(),
      '#required' => ($required && !in_array('timezone', $opt_fields)) ? $required : 0,
      );
  }
  else {
    $form['timezone'] = array(
      '#type' => 'hidden',
      '#value' => $timezone_out,
    );
  }
  $form['#theme'] = 'date_form_timezone';
  $form['#weight'] = $weight;
  return $form;
}

/**
 *  Construct a value to save to the database from the date selector
 *
 *  @param $array - an array of date parts collected by the date selector
 *  @param $type - DATE_UNIX or DATE_ISO
 *  @param $timezone_in - timezone of supplied value
 *  @param $granularity = an array of date parts to be selected, like array('Y','M','D'), default is M, D, Y
 *       Y => year, M => month, D => day, H => hours, N => minutes, S => seconds, T => timezone
 */
function date_selector_make_dbdate($array, $type = DATE_ISO, $timezone_in = 'GMT', $granularity = array('M', 'D', 'Y')) {
  // adjust back to 24 hours time if 12 hours input was collected
  if ($array['ampm'] == 'pm' && $array['hours'] < 12) $array['hours'] += 12;
  // try to construct a date from the submitted values
  $date = date_make_date();
  if ($type == DATE_UNIX) {
    if (date_set_date($date, date_array2unix($array), $timezone_in, 'local', $type)) {
      return $date;
    }
  }
  elseif ($type == DATE_ISO) {
    if (date_set_date($date, date_array2iso($array), $timezone_in, 'local', $type)) {
      return $date;
    }
  }
  return FALSE;
}

/**
 *  Construct a value to save to the database from jscalendar input
 *
 *  @param $value - a text value created by js_calendar
 *  @param $type - DATE_UNIX or DATE_ISO
 *  @param $format - a string containing the format the field is using (date() format)
 *  @param $timezone_in - timezone of supplied value
 *  @param  $granularity = an array of date parts to be selected, like array('Y','M','D'), default is M, D, Y
 *       Y => year, M => month, D => day, H => hours, N => minutes, S => seconds, T => timezone
 */
function date_jscalendar_make_dbdate($value, $type, $format, $timezone_in = 'GMT', $granularity = array('M', 'D', 'Y')) {
  $value = trim($value);
  if ($value == '') return NULL;
  switch($type) {
    case(DATE_UNIX):
      $value = date_custom2unix($value, $format);
      break;
    case(DATE_ISO):
      $value = date_custom2iso($value, $format);
      break;
  }
  if ($value) {
    if ($date = date_make_date($value, $timezone_in, 'local', $type)) {
      return $date;
    }
  }
  return FALSE;
}

/**
 *  Construct a value to save to the database from text input
 *
 *  @param $value - string date value, could be iso format or text for strtotime conversion
 *  @param $type - DATE_UNIX or DATE_ISO
 *  @param $format - a string containing the format the field is using (date() format)
 *  @param $timezone_in - timezone of supplied value
 *  @param  $granularity = an array of date parts to be selected, like array('Y','M','D'), default is M, D, Y
 *       Y => year, M => month, D => day, H => hours, N => minutes, S => seconds, T => timezone
 */
function date_text_make_dbdate($value, $type, $format, $timezone_in = 'GMT', $granularity = array('M', 'D', 'Y')) {
  $value = trim($value);
  if ($value == '') return NULL;
  switch ($type) {
    case(DATE_UNIX):
      $value = date_text2unix($value, $format);
      break;
    case(DATE_ISO):
      $value = date_text2iso($value, $format);
      break;
  }
  if ($value) {
    if ($date = date_make_date($value, $timezone_in, 'local', $type)) {
      return $date;
    }
  }
  return FALSE;
}

/**
 *  Validation function for date selector
 *  $params = an array of values including:
 *    required = is a valid date required, default is true
 *    opt_fields = an array of fields that need not be filled out, default is empty array
 */
function date_selector_validate($value, $fieldname, $params = array()) {
  $type       = $params['type'] > '' ? $params['type'] : DATE_ISO;
  $required   = isset($params['required']) ? $params['required'] : 1;
  $opt_fields = is_array($params['opt_fields']) ? $params['opt_fields'] : array();
  $granularity = $params['granularity'] ? $params['granularity'] : array('M', 'D', 'Y');

  if ($value['ampm'] == 'pm' && $value['hours'] < 12) $value['hours'] += 12;
  // check for invalid numbers in fields that were submitted using textfields
  if (($required || $value['year']) && !in_array($value['year'], $opt_fields)) {
    if (!date_part_is_valid($value['year'], 'year')) form_set_error($fieldname, t('year must be a number between %min and %max.', array('%min' => DATE_MIN_YEAR, '%max' => DATE_MAX_YEAR)));
  }
  if (($required || $value['mon']) && !in_array($value['mon'], $opt_fields)) {
    if (!date_part_is_valid($value['mon'], 'mon')) form_set_error($fieldname, t('month must be a number between 1 and 12.'));
  }
  if (($required || $value['mday']) && !in_array($value['mday'], $opt_fields)) {
    if (!date_part_is_valid($value['mday'], 'day')) form_set_error($fieldname, t('day must be a number between 1 and 31.'));
  }
  // try to construct a date from the submitted values
  if ($required && !date_selector_make_dbdate($value, $type)) {
    form_set_error($fieldname, t('Date cannot be constructed using values %s.', array('%s' => implode(', ', $value))));
    return FALSE;
  }
  else {
    return TRUE;
  }
}

/**
 *  Validation for jscalendar input
 */
function date_jscalendar_validate($value, $fieldname, $type, $format, $required, $granularity = array('M', 'D', 'Y')) {
  $value = trim($value);
  if (!$required && $value == '') return TRUE;
  switch ($type) {
    case(DATE_UNIX):
      if (!date_custom2unix($value, $format)) {
        form_set_error($fieldname, t('The text \'%s\' is not a valid date.', array('%s' => $value)));
        return FALSE;
      }
      break;
    case(DATE_ISO):
      if (!date_custom2iso($value, $format)) {
        form_set_error($fieldname, t('The text \'%s\' is not a valid date.', array('%s' => $value)));
        return FALSE;
      }
      break;
  }
  return TRUE;
}

/**
 *  Validation for text input
 */
function date_text_validate($value, $fieldname, $type, $format, $required, $granularity = array('M', 'D', 'Y')) {
  $value = trim($value);
  if (!$required && $value == '') return TRUE;
  switch ($type) {
    case(DATE_UNIX):
      if (!$value = date_text2unix($value, $format)) {
        form_set_error($fieldname, t('The text \'%s\' is not a valid date.', array('%s' => $value)));
        return FALSE;
      }
    case(DATE_ISO):
      if (!$value = date_text2iso($value, $format)) {
        form_set_error($fieldname, t('The text \'%s\' is not a valid date.', array('%s' => $value)));
        return FALSE;
      }
  }
  return TRUE;
}

/**
 * Date conversion functions
 *
 *  a variety of ways to convert values are provided
 *  arrays are in the format created by getdate()
 *  return false for anything that can't produce a valid year
 *  iso date may have a year only or year and month only
 *  unix dates must have at least a year month and day
 *
 *  these function return 'ERROR' instead of FALSE because of
 *  problems distinguishing between a valid 0 value and a FALSE value
 *
 */
function date_array2iso($array) {
  if (!date_is_valid($array, 'array')) return 'ERROR';
  return  sprintf("%04d", intval($array['year'])) .
    '-'. sprintf("%02d", intval($array['mon'])) .
    '-'. sprintf("%02d", intval($array['mday'])) .
    'T'. sprintf("%02d", intval($array['hours'])) .
    ':'. sprintf("%02d", intval($array['minutes'])) .
    ':'. sprintf("%02d", intval($array['seconds']));
}

function date_array2unix($array) {
  if (!date_is_valid($array, 'array')) return 'ERROR';
  // a date without a month and day cannot be made into a unix timestamp
  if (!$array['mon'] || !$array['mday']) {
    return NULL;
  }
  // using gmmktime instead of mktime so no server timezone adjustment is made
  return date_gmmktime($array);
}

function date_iso2array($iso) {
  if (!date_preg($iso)) return 'ERROR';
  if (!date_is_valid($iso, DATE_ISO)) return 'ERROR';
  // a unix date requires a year, month, and day
  if (date_iso_year($iso) && date_iso_mon($iso) && date_iso_day($iso)) {
    $unix = date_iso2unix($iso);
    if ($unix === 'ERROR') {
      return 'ERROR';
    }
    else {
      return date_unix2array($unix);
    }
  // an iso date is valid even without a month and/or a day
  }
  elseif (date_iso_year($iso)) {
    return array(
      'year' => date_iso_year($iso),
      'mon' => date_iso_mon($iso),
      'mday' => date_iso_day($iso),
      'hours' => date_iso_hours($iso),
      'minutes' => date_iso_minutes($iso),
      'seconds' => date_iso_seconds($iso),
      0 => NULL,
      );
  }
  else {
      return 'ERROR';
  }
}

function date_unix2array($unix) {
  if (!date_is_valid($unix, DATE_UNIX)) return 'ERROR';
  // using gmgetdate instead of getdate so no server timezone adjustment is made
  return date_gmgetdate($unix);
}

function date_unix2iso($unix) {
  if (!date_is_valid($unix, DATE_UNIX)) return 'ERROR';
  // using gmdate instead of date so no server timezone adjustment is made
  return date_gmdate(DATE_STRING_ISO, $unix);
}

function date_iso2unix($iso) {
  if (!date_preg($iso)) return 'ERROR';
  if (!date_is_valid($iso, DATE_ISO)) return 'ERROR';
  // A unix date requires a year, month, and day.
  // Make sure not to set '0' for month or day since that will revert to
  // the previous month or day.
  if (date_iso_year($iso)) {
    $array = array(
      'hours' => date_iso_hours($iso),
      'minutes' => date_iso_minutes($iso),
      'seconds' => date_iso_seconds($iso),
      'mon' => max(1, date_iso_mon($iso)),
      'mday' => max(1, date_iso_day($iso)),
      'year' => date_iso_year($iso)
      );
    // using gmmktime instead of mktime so no server timezone adjustment is made
    $unix = date_gmmktime($array);
    // php versions earlier than 5.1 return -1 for a false response, convert that to 'ERROR'
    if ($unix == -1) return 'ERROR';
    return $unix;
  }
  else {
    return NULL;
  }
}

function date_iso2custom($iso, $format) {
  if ($iso == '') return NULL;
  $array = date_iso2array($iso);
  $month_short = array(
    "January" => t("Jan"), "February" => t("Feb"), "March" => t("Mar"), "April" => t("Apr"),
    "May" => t("May"), "June" => t("Jun"), "July" => t("Jul"), "August" => t("Aug"),
    "September" => t("Sep"), "October" => t("Oct"), "November" => t("Nov"), "December" => t("Dec")
  );
  $day_short = array(
    "Monday" => t("Mon"), "Tuesday" => t("Tue"), "Wednesday" => t("Wed"), "Thursday" => t("Thu"),
    "Friday" => t("Fri"), "Saturday" => t("Sat"), "Sunday" => t("Sun")
  );
  $repl = array(
    "d" => str_pad($array['mday'], 2, "0", STR_PAD_LEFT),
    "D" => $day_short[$array['weekday']],
    "j" => $array['mday'],
    "l" => $array['weekday'],
    "N" => '',
    "S" => '',
    "w" => '',
    "z" => '',
    "W" => '',
    "F" => $array['month'],
    "m" => str_pad($array['mon'], 2, "0", STR_PAD_LEFT),
    "M" => $month_short[$array['month']],
    "n" => $array['mon'],
    "t" => '',
    "L" => '',
    "o" => '',
    "Y" => str_pad($array['year'], 4, "0", STR_PAD_LEFT),
    "y" => substr(str_pad($array['year'], 4, "0", STR_PAD_LEFT), 2, 2),
    "a" => ($array['hours'] >= 12) ? 'pm' : 'am',
    "A" => ($array['hours'] >= 12) ? 'PM' : 'AM',
    "B" => '',
    "g" => ($array['hours'] > 12) ? $array['hours'] - 12 : $array['hours'],
    "G" => $array['hours'],
    "h" => str_pad(($array['hours'] > 12) ? $array['hours'] - 12 : $array['hours'], 2, "0", STR_PAD_LEFT),
    "H" => str_pad($array['hours'], 2, "0", STR_PAD_LEFT),
    "i" => str_pad($array['minutes'], 2, "0", STR_PAD_LEFT),
    "s" => str_pad($array['seconds'], 2, "0", STR_PAD_LEFT),
    "e" => '',
    "I" => '',
    "O" => '',
    "P" => '',
    "T" => '',
    "z" => '',
    "c" => '',
    "r" => '',
    "U" => ''
  );
  $repl["\\\\"] = "\\";
  foreach ($repl as $key => $value) {
    $repl["\\".$key] = $key;
  }
  return strtr($format, $repl);
}

function date_custom2iso($date, $format) {
  $array = array(
    "d" => "\\d{1,2}", // we allow 1 to be tolerant - maybe we shouldn't ?
    "D" => "\\w{3}",
    "j" => "\\d{1,2}",
    "l" => "\\w*",
    "N" => "\\d",
    "S" => "\\w{2}",
    "w" => "\\d",
    "z" => "\\d{1,3}",
    "W" => "\\d{1,2}",
    "F" => "\\w*",
    "m" => "\\d{2}",
    "M" => "\\w{3}",
    "n" => "\\d{1,2}",
    "t" => "\\d{2}",
    "L" => "\\d",
    "o" => "\\d{4}",
    "Y" => "\\d{4}",
    "y" => "\\d{2}",
    "a" => "am|pm",
    "A" => "AM|PM",
    "B" => "\\d{3}",
    "g" => "\\d{1,2}",
    "G" => "\\d{1,2}",
    "h" => "\\d{1,2}", // we allow 1 to be tolerant - maybe we shouldn't ?
    "H" => "\\d{1,2}", // we allow 1 to be tolerant - maybe we shouldn't ?
    "i" => "\\d{2}",
    "s" => "\\d{2}",
    "e" => "\\w*",
    "I" => "\\d",
    "O" => "[+-]?\\d{4}",
    "P" => "[+-]?\\d{2}\\:\\d{2}",
    "T" => "\\w*",
    "z" => "[+-]?\\d*",
    "c" => "*",
    "r" => "*",
    "U" => "\\d*"
  );

  foreach ($array as $key => $value) {
    $patterns[] = "`(^|[^\\\\\\\\])".$key."`"; // the letter with no preceding '\'
    $repl1[] = '${1}(.)';                  // a single character
    $repl2[] = '${1}('. $value .')';       // the
  }
  $patterns[] = "`\\\\\\\\([".implode(array_keys($array))."])`";
  $repl1[] = '${1}';
  $repl2[] = '${1}';

  $format_regexp = preg_quote($format);
  // extract letters
  $regex1 = preg_replace($patterns, $repl1, $format_regexp,1);
  preg_match('`^'.$regex1.'$`', stripslashes($format), $letters);
  array_shift($letters);
  // extract values
  $regex2 = preg_replace($patterns, $repl2, $format_regexp,1);
  preg_match('`^'.$regex2.'$`', $date, $values);
  array_shift($values);
  // if we did not find all the values for the patterns in the format, abort
  if (count($letters) != count($values)) {
    return 'ERROR';
  }
  $final_date['hours']   = "00";
  $final_date['minutes'] = "00";
  $final_date['seconds'] = "00";
  $final_date['mon']     = "00";
  $final_date['mday']    = "00";
  $final_date['year']    = "0000";
  foreach($letters as $i => $letter) {
    $value = $values[$i];
    switch($letter) {
      case 'd':
      case 'j':
        $final_date['mday'] = str_pad($value, 2, "0", STR_PAD_LEFT);
        break;
      case 'n':
      case 'm':
        $final_date['mon'] = str_pad($value, 2, "0", STR_PAD_LEFT);
        break;
      case 'F':
        $array_month_long = array(
          t('January') => 1, t('February') => 2, t('March') => 3, t('April') => 4,
          t('May') => 5, t('June') => 6, t('July') => 7, t('August') => 8,
          t('September') => 9, t('October') => 10,  t('November') => 11, t('December') => 12
        );
        $final_date['mon'] = str_pad($array_month_long[$value], 2, "0", STR_PAD_LEFT);
        break;
      case 'M':
        $array_month = array(
          t('Jan') => 1, t('Feb') => 2, t('Mar') => 3, t('Apr') => 4,
          t('May') => 5, t('Jun') => 6, t('Jul') => 7, t('Aug') => 8,
          t('Sep') => 9, t('Oct') => 10, t('Nov') => 11, t('Dec') => 12
        );
        $final_date['mon'] = str_pad($array_month[$value], 2, "0", STR_PAD_LEFT);;
        break;
      case 'Y':
      case 'y':
        $year = str_pad($value, 2, "0", STR_PAD_LEFT);
        // if no century, we add the current one ("06" => "2006")
        $final_date['year'] = str_pad($year, 4, substr(date("Y"), 0, 2), STR_PAD_LEFT);
        break;
      case 'a':
      case 'A':
        $am_pm = strtolower($value);
        break;
      case 'g':
      case 'h':
      case 'G':
      case 'H':
        $final_date['hours'] = str_pad($value, 2, "0", STR_PAD_LEFT);
        break;
      case 'i':
        $final_date['minutes'] = str_pad($value, 2, "0", STR_PAD_LEFT);
        break;
      case 's':
        $final_date['seconds'] = str_pad($value, 2, "0", STR_PAD_LEFT);
        break;
      case 'U':
        // TODO ?
        break;
    }
  }
  // TODO : add some validation ? day in [1..31], etc...
  switch ($am_pm) {
    case 'am':
      if ($final_date['hours'] == "12") {
        $final_date['hours'] = "00";
      }
      break;
    case 'pm':
      if ($final_date['hours'] != "12") {
        $final_date['hours'] += 12;
      }
      break;
  }
  return date_array2iso($final_date);
}

function date_custom2unix($date, $format) {
  if ($iso = date_custom2iso($date, $format)) {
    if ($unix = date_iso2unix($iso)) {
      return $unix;
    }
  }
  return 'ERROR';
}

/**
 *  Use stringtotime function to create an iso date out of text
 */
function date_text2iso($text, $format) {
  // if date supplied in iso format, use it
  // TODO : there's probably better to do...
  // (do we _want_ to enter ISO formats ? if so we should have it in the input format settings)
  if (date_preg($text) && date_part_is_valid(date_iso_year($text), 'year')) return $text;
  // if not iso date, try to parse in the given format
  $custom = date_custom2iso($text, $format);
  if ($custom !== 'ERROR') {
    return $custom;
  }
  // if custom parsing failed, try strtotime conversion
  $iso = date_gmdate(DATE_STRING_ISO, strtotime($text .' UTC'));
  if (date_part_is_valid(date_iso_year($iso), 'year')) {
    return $iso;
  }
  else {
    return 'ERROR';
  }
}

function date_text2unix($text, $format) {
  if ($iso = date_text2iso($text, $format)) {
    if ($unix = date_iso2unix($iso)) {
      return $unix;
    }
  }
  return 'ERROR';
}

function date_iso_year($iso) {
  return (integer) substr($iso, 0, 4);
}
function date_iso_mon($iso){
  return (integer) substr($iso, 5, 2);
}
function date_iso_day($iso) {
  return (integer) substr($iso, 8, 2);
}
function date_iso_hours($iso) {
  return (integer) substr($iso, 11, 2);
}
function date_iso_minutes($iso) {
  return (integer) substr($iso, 14, 2);
}
function date_iso_seconds($iso) {
  return (integer) substr($iso, 17, 2);
}
// using gmdate instead of date so no server timezone adjustment is made to provided values
function date_unix_year($unix) {
  return (integer) date_gmdate('Y', $unix);
}
function date_unix_mon($unix) {
  return (integer) date_gmdate('m', $unix);
}
function date_unix_day($unix) {
  return (integer) date_gmdate('d', $unix);
}
function date_unix_hours($unix) {
  return (integer) date_gmdate('H', $unix);
}
function date_unix_minutes($unix) {
  return (integer) date_gmdate('i', $unix);
}
function date_unix_seconds($unix) {
  return (integer) date_gmdate('s', $unix);
}

/**
 *  Compute min and max dates for an ISO week
 *
 *  based on ISO weeks, which start counting on the first Monday in a week that
 *  has at least 4 days in the current year
 *
 *  @value - an argument in the format 2006-W20 (year + -W + week number)
 *  @return an array of ISO dates representing the first and last day in the week
 */
function date_iso_week_range($year, $week) {
  // subtract 1 from week number so we don't double-count the final week
  $weeks = intval($week - 1);
  // get a unix value for the first day of the year
  $first_day_of_year = date_iso2unix($year .'-01-01T00:00:00');

  // get to the day of week of the first day of the year, 0 is Sunday
  $dow   = date_gmdate('w', $first_day_of_year);
  // ISO week counts actual first week only if it has at least 4 days in it
  if ($dow > 2) $weeks += 1;
  // calc adjustment from first day of year dow back or forward to Monday
  $shift = intval((1 - $dow) * 86400);
  // the day we want is $weeks away from first day of year, adjusted to the Monday of that week by $shift
  $first_day_of_week = $first_day_of_year + ($weeks * 604800) + $shift;
  $last_day_of_week  = $first_day_of_week + 604800 - 1;
  // convert the unix dates back to iso
  return array($first_day_of_week, $last_day_of_week);
}

/**
 * Find the last day of a month
 *
 * @param mixed $month
 * @param mixed $year
 * @return last day of the specified month and year
 */
function date_last_day_of_month($month, $year) {
  return date_gmdate('t', date_gmmktime(array('year' => intval($year), 'mon' => intval($month), 'mday' => 1)));
}

/**
 *  Functions to test the validity of various date parts
 *
 *  @param $format could be 'array', DATE_UNIX, or DATE_ISO
 */
function date_is_valid($value, $format) {
  switch ($format) {
  case('array'):
    if (!date_part_is_valid($value['year'], 'year') || !date_part_is_valid($value['mon'], 'mon') || !date_part_is_valid($value['mday'], 'mday')) return FALSE;
    return TRUE;
  case(DATE_UNIX):
    if (!date_part_is_valid(date_unix_year($value), 'year') || !date_part_is_valid(date_unix_mon($value), 'mon', 1) || !date_part_is_valid(date_unix_day($value), 'mday', 1)) return FALSE;
    return TRUE;
  default:
    if (!date_part_is_valid(date_iso_year($value), 'year') || !date_part_is_valid(date_iso_mon($value), 'mon') || !date_part_is_valid(date_iso_day($value), 'mday')) return FALSE;
    return TRUE;
  }
}

/**
 *  Function to test validity of specific date part
 *
 *  @param $value - the value to test
 *  @param $part - the type of date part provided, coult be 'year', 'mon', or 'mday'
 *  @parma $min either 0 or 1, use to set min for mon and mday
 *      can be 0 for iso dates, set to 1 for unix timestamps that require a complete date
 */
function date_part_is_valid($value, $part, $min = 0) {
  switch ($part) {
  case('year'):
    if ($value < DATE_MIN_YEAR || $value > DATE_MAX_YEAR) return FALSE;
    break;
  case('mon'):
    if ($value < $min || $value > 12) return FALSE;
    break;
  case('mday'):
    if ($value < $min || $value > 31) return FALSE;
    break;
  case('week'):
    if ($value < 0 || $value > 53) return FALSE;
    break;
  }
  return TRUE;
}

/**
 *  Regex validation for iso date
 */
function date_preg($item) {
  if (preg_match('/([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})/', $item)) {
    return TRUE;
  }
  else {
    return FALSE;
  }
}

/**
 *  a function to figure out if any time data is to be collected or displayed
 */
function date_has_time($granularity) {
  if (!is_array($granularity)) $granularity = array();
  return sizeof(array_intersect($granularity, array('H', 'N', 'S'))) > 0 ? TRUE : FALSE;
}

/**
 *  Function to create an option list for input formats
 *
 *  @return array of date format strings
 *    with a key of the format string and a value of the current date displayed in that format
 *
 */
function date_input_options() {
  $formats = array(
    'Y-m-d H:i' => 'Y-m-d H:i:s',
    'm/d/Y - H:i' => 'm/d/Y - H:i:s',
    'd/m/Y - H:i' => 'd/m/Y - H:i:s',
    'Y/m/d - H:i' => 'Y/m/d - H:i:s',
    'd.m.Y - H:i' => 'd.m.Y - H:i:s',
    'm/d/Y - g:ia' => 'm/d/Y - g:i:sa',
    'd/m/Y - g:ia' => 'd/m/Y - g:i:sa',
    'Y/m/d - g:ia' => 'Y/m/d - g:i:sa',
    'M j Y - H:i' => 'M j Y - H:i:s',
    'j M Y - H:i' => 'j M Y - H:i:s',
    'Y M j - H:i' => 'Y M j - H:i:s',
    'M j Y - g:ia' => 'M j Y - g:i:sa',
    'j M Y - g:ia' => 'j M Y - g:i:sa',
    'Y M j - g:ia' => 'Y M j - g:i:sa'
  );
  $options = array();
  $options['site-wide'] = t('default') .' ('. format_date(time(), 'custom', $formats[variable_get('date_format_short', 'm/d/Y - H:i')]) .')';
  foreach (array_values($formats) as $f) {
    $options[$f] = format_date(time(), 'custom', $f);
  }
  return $options;
}

/**
 *  Function to create an option list that will display various date and time formats
 *
 *  @param $tz_handling - default is 'site'
 *  @param $illustration_date - an iso date to use for illustration of the date options
 *    default date for illustration: August 1 YYYY 2:05:10 PM
 *      - single digit months and days to see leading zeros
 *      - a month number different than the day number to see month and day positions
 *      - an afternoon time to illustrate 24 hours vs am/pm formats
 *
 *  @return array of date format strings for all date_date_options() and/or date_time_options()
 *    with a key of the format string and a value of the illustration date displayed in that format
 *
 */
function date_output_options($tz_handling = 'site', $illustration_date = NULL) {

  $illustration_date = $illustration_date ? $illustration_date : date_gmdate('Y', time()) .'-08-01T14:05:10';
  $date = date_make_date($illustration_date, date_get_timezone($tz_handling), 'local', DATE_ISO);
    // from system module, possible date formats
  $dateshort = array('Y-m-d H:i','m/d/Y - H:i', 'd/m/Y - H:i', 'Y/m/d - H:i',
           'd.m.Y - H:i', 'm/d/Y - g:ia', 'd/m/Y - g:ia', 'Y/m/d - g:ia',
           'M j Y - H:i', 'j M Y - H:i', 'Y M j - H:i',
           'M j Y - g:ia', 'j M Y - g:ia', 'Y M j - g:ia');
  $datemedium = array('D, Y-m-d H:i', 'D, m/d/Y - H:i', 'D, d/m/Y - H:i',
          'D, Y/m/d - H:i', 'F j, Y - H:i', 'j F, Y - H:i', 'Y, F j - H:i',
          'D, m/d/Y - g:ia', 'D, d/m/Y - g:ia', 'D, Y/m/d - g:ia',
          'F j, Y - g:ia', 'j F Y - g:ia', 'Y, F j - g:ia', 'j. F Y - G:i');
  $datelong = array('l, F j, Y - H:i', 'l, j F, Y - H:i', 'l, Y,  F j - H:i',
        'l, F j, Y - g:ia', 'l, j F Y - g:ia', 'l, Y,  F j - g:ia', 'l, j. F Y - G:i');
  $datestrings = array_merge($dateshort, $datemedium, $datelong);
  $view = array();
  foreach ($datestrings as $datestring) {
    $parts = explode(' - ', $datestring);
    // create an option that shows date only without time
    $view[trim($parts[0])] = date_show_date($date, trim($parts[0]));
    $view[$datestring] = date_show_date($date, $datestring);
  }
  asort($view);
  return $view;
}

function date_formats($format, $granularity) {
  //split date part and time part
  preg_match("/([djDlzwWmnFMYy].*[djDlzwWmnFMYy])/", $format, $matches, PREG_OFFSET_CAPTURE);
  $format_date = $matches[1][0];
  $format_date_pos = $matches[1][1];
  preg_match("/([gGhHisaA].*[gGhHisaA])/", $format, $matches, PREG_OFFSET_CAPTURE);
  $format_time = $matches[1][0];
  $format_time_pos = $matches[1][1];
  $format_separator = substr($format, $format_date_pos + strlen($format_date), $format_time_pos - ($format_date_pos + strlen($format_date)));
  $jscal_format_date = $jscal_format_time = array();
  $text_format_date = $text_format_time = array();
  $select_format_date = array();
  $weight_index = 0;
  $desc_date = array();
  $desc_time = array();
  $format_to_jscalendar = array(
    'd' => '%d', 'j' => '%e', 'D' => '%a', 'l' => '%A', 'z' => '%j', 'w' => '%w',
    'W' => '%U',
    'm' => '%m', 'n' => '%m', 'F' => '%B', 'M' => '%b',
    'Y' => '%Y', 'y' => '%y',
    'g' => '%l', 'G' => '%k', 'h' => '%I', 'H' => '%H',
    'i' => '%M',
    's' => '%S',
    'a' => '%P', 'A' => '%p',
  );
  foreach (preg_split('//', $format_date, -1, PREG_SPLIT_NO_EMPTY) as $c) {
    switch ($c) {
      case 'd':
      case 'j':
        if (in_array('D', $granularity)) {
          $jscal_format_date[] = $format_to_jscalendar[$c];
          $text_format_date[] = $c;
          $select_format_date['D'] = $weight_index++;
        }
        if ($c == 'd') $desc_date[] = 'DD';
        if ($c == 'j') $desc_date[] = 'D';
        break;
      case 'F':
      case 'M':
      case 'm':
      case 'n':
        if (in_array('M', $granularity)) {
          $jscal_format_date[] = $format_to_jscalendar[$c];
          $text_format_date[] = $c;
          $select_format_date['M'] = $weight_index++;
        }
        if ($c == 'M') $desc_date[] = t('Jan');
        if ($c == 'm') $desc_date[] = 'MM';
        if ($c == 'n') $desc_date[] = 'M';
        if ($c == 'F') $desc_date[] = t('January');
        break;
      case 'Y':
      case 'y':
        if (in_array('Y', $granularity)) {
          $jscal_format_date[] = $format_to_jscalendar[$c];
          $text_format_date[] = $c;
          $select_format_date['Y'] = $weight_index++;
        }
        if ($c == 'Y') $desc_date[] = 'YYYY';
        if ($c == 'y') $desc_date[] = 'YY';
        break;
      default:
        if (!preg_match('/[a-zA-Z]/', $c) && !isset($date_separator)) {
          $date_separator = $c;
        }
        break;
    }
  }
  if (date_has_time($granularity)) {
    foreach (preg_split('//', $format_time, -1, PREG_SPLIT_NO_EMPTY) as $c) {
      switch ($c) {
        case 'g':
        case 'G':
        case 'h':
        case 'H':
          if (in_array('H', $granularity)) {
            $jscal_format_time[] = $format_to_jscalendar[$c];
            $text_format_time[] = $c;
          }
          if ($c == 'g' || $c == 'h') $desc_time[] = 'H';
          if ($c == 'G' || $c == 'H') $desc_time[] = 'HH';
          break;
        case 'i':
          if (in_array('N', $granularity)) {
            $jscal_format_time[] = $format_to_jscalendar[$c];
            $text_format_time[] = $c;
          }
          $desc_time[] = 'MM';
          break;
        case 's':
          if (in_array('S', $granularity)) {
            $jscal_format_time[] = $format_to_jscalendar[$c];
            $text_format_time[] = $c;
          }
          $desc_time[] = 'SS';
          break;
        case 'a':
        case 'A':
          if (date_has_time($granularity)) {
            $jscal_format_ampm = $format_to_jscalendar[$c];
            $text_format_ampm = $c;
            $am_pm = true;
          }
          if ($c == 'a') $desc_time[] = 'am';
          if ($c == 'A') $desc_time[] = 'AM';
          break;

        default:
          if (!preg_match('/[a-zA-Z]/', $c) & !isset($time_separator)) {
            $time_separator = $c;
          }
          break;
      }
    }
  }
  // we store the current site-wide value, in order to be able to detect its changes
  if ($format == 'site-wide' || $format == variable_get('date_format_short', 'm/d/Y - H:i')) {
    $formats['input']['site-wide'] = $format;
  }
  $formats['input']['jscal'] = implode($date_separator, $jscal_format_date);
  $formats['input']['jscal'] .= date_has_time($granularity) ? $format_separator . implode($time_separator, $jscal_format_time)  . $jscal_format_ampm : '';

  $formats['input']['text'] = implode($date_separator, $text_format_date);
  $formats['input']['text'] .= date_has_time($granularity) ? $format_separator . implode($time_separator, $text_format_time)  . $text_format_ampm : '';

  $formats['input']['select'] = $select_format_date;
  $formats['input']['am_pm'] = $am_pm;

  $formats['input']['desc']  = implode($date_separator, $desc_date);
  $formats['input']['desc'] .= date_has_time($granularity) ? $format_separator . implode($time_separator, $desc_time) : '';

  return $formats;
}

/**
 * An difference array of granularity elements that are NOT in the granularity array.
 */
function date_nongranularity_array($granularity) {
  return array_diff(array('Y', 'M', 'D', 'H', 'N', 'S'), $granularity);
}

/**
 * Unset undesired date part values.
*/
function date_unset_granularity($item, $granularity, $type) {
  if (!$nongranularity = date_nongranularity_array($granularity)) {
   return $item;
  }
  else {
   if ($type == DATE_ISO) {
    $date = date_iso2array($item);
   }
   else {
    $date = date_unix2array($item);
   }
   foreach ($nongranularity as $level) {
     switch ($level) {
       case 'S':
         $date['seconds'] = 0;
         break;
       case 'N':
         $date['minutes'] = 0;
         break;
       case 'H':
         $date['hours'] = 0;
         break;
       case 'M':
         $date['mon'] = $type == DATE_UNIX ? 1 : 0;
         break;
       case 'D':
         $date['mday'] = $type == DATE_UNIX ? 1 : 0;
         break;
      }
    }
    if ($type == DATE_ISO) {
      return date_array2iso($date);
    }
    else {
      return date_array2unix($date);
    }
  }
}

/**
 * Strip date parts that are not in the granularity array out of a date format string.
 */
function date_strip_granularity($format, $granularity) {
  $replace = array();
  foreach (date_nongranularity_array($granularity) as $element) {
    switch ($element) {
      case 'D':
        $replace = array_merge($replace, array('l,', 'l', 'D,', 'D-', 'D/', 'D', 'd,', 'd-', 'd/', 'd', 'j,', 'j-', 'j/', 'j'));
        break;
      case 'M':
        $replace = array_merge($replace, array('F,', 'F-', 'F/', 'F', 'M,', 'M-', 'M/', 'M', 'm,', 'm-', 'm/', 'm', 'n,', 'n-', 'n/', 'n'));
        break;
      case 'H':
        $replace = array_merge($replace, array('H:', 'H', 'h:', 'h', 'G:', 'g:', 'g', 'a', 'A', ' - '));
        break;
      case 'N':
        $replace = array_merge($replace, array('i:', 'i'));
        break;
      case 'S':
        $replace = array_merge($replace, array('s'));
        break;
    }
  }
  return str_replace($replace, '', $format);
}

/**
 *  Convert date() to strftime() format strings
 *
 *  @param $format - a format string for date()
 *  @return corresponding format string for strftime()
 */
function date_date2strftime($format) {
  return strtr($format, date_date2strftime_replace());
}

/**
 *  Date() to strftime() replacement array
 *
 *  Adjusted for differences between unix and windows strftime()
 *
 *  Not all date formats have corresponding strftime formats
 *  Trying for best match or blank for no match
 */
function date_date2strftime_replace() {
  static $replace = array();
  if (empty($replace)) {
    if (stristr(PHP_OS, 'WIN')) {
      $type = 'windows';
    }
    else {
      $type = 'unix';
    }
    $replace = array(
    'd' => '%d', // day of month, leading zero
    'j' => ($type == 'unix' ? '%e' : '%#d'), // day of month, no leading zero
    'F' => '%B', // full month name
    'M' => '%b', // month abbreviation
    'm' => '%m', // month number, leading zero
    'n' => ($type == 'unix' ? '%m' : '%#m'), // month number, no leading zero
    'Y' => '%Y', // year, 4 digit
    'y' => '%y', // year, 2 digit
    'l' => '%A', // full day name
    'D' => '%a', // abbreviated day name
    'w' => '%w', // dow, 0 for sunday
    'N' => '%u', // dow, 7 for sunday
    'H' => '%H', // 24 hour hour, leading zero
    'h' => '%I', // 12 hour hour, leading zero
    'G' => (type == 'unix' ? '%H' : '%#H'), // 24 hour hour, no leading zero
    'g' => (type == 'unix' ? '%I' : '%#I'), // 12 hour hour, no leading zero
    'i' => '%M', // minutes, leading zero
    's' => '%S', // seconds, leading zero
    'a' => '%p', // am/pm lowercase(strftime windows is only upppercase)
    'A' => '%p', // am/pm capitalized (striftime unix is only lowercase)
    'W' => '%V', // ISO week number of year, starting on first Monday
    'o' => '%G', // ISO year that matches ISO week
    'T' => '%Z', // server timezone name
    'r' => ($type == 'unix' ? '%c' : '%#c'), // formatted complete date and time (Thu, 21 Dec 2000 16:01:07)

    /* date formats with no good strftime match */
    'z' => '', // day of year (0-365), strftime equivalent %j uses 1-365
    'S' => '', // day of month ordinal like st, nd, rd
    't' => '', // number of days in month, 28-31
    'L' => '', // leap year, 0 or 1
    'I' => '', // daylight savings time, 0 or 1
    'B' => '', // Swatch internet time, 000-999
    'e' => '', // server timezone identifier like US/Eastern
    'O' => '', // server timezone to gmt offset (+0200)
    'P' => '', // server timezone to gmt offset (+02:00)
    'Z' => '', // server timezone to gmt offset in seconds
    'U' => '', // seconds since Unix Epoch
    'c' => '', // complete ISO date
    );
  }
  return $replace;
}

/**
 *  Server timezone adjustment.
 *
 *  Used to compute default timezone adjustment made by SQL server
 *  so server adjustment can be removed and replaced with correct timezone
 *  adjustment values.
 *
 *  @return amount in seconds that server adjusts for timezone.
 */
function date_server_zone_adj() {
  global $db_type;
  static $server_zone_adj;
  if (!isset($server_zone_adj)) {
    switch ($db_type) {
      case('mysql'):
      case('mysqli'):
        // Newest MYSQL versions allow us to set the server to GMT to eliminate adjustments.
        if ($GLOBALS['db_type'] == 'mysqli' || version_compare(mysql_get_server_info(), '4.1.3', '>=')) {
          db_query("SET @@session.time_zone = '+00:00'");
          $server_zone_adj = 0;
        }
        // In 4.1.1+ we can use difference between NOW() and UTC_TIMESTAMP().
        elseif (version_compare(mysql_get_server_info(), '4.1.1', '>=')) {
          $server_zone_adj = db_result(db_query("SELECT UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(UTC_TIMESTAMP())"));
        }
        // There is no MYSQL query to produce the adjustment amount in older
        // MYSQL versions, so estimate it using the php timezone adjustment.
        else {
          $server_zone_adj = date('Z');
        }
        break;
      case('pgsql'):
        // EXTRACT TIMEZONE returns the timezone adjustment in seconds.
        $server_zone_adj = db_result(db_query("SELECT EXTRACT('TIMEZONE' FROM NOW())"));
        break;
    }
    // If no value got set by this point,
    // fall back to using php timezone adjustment as an estimate.
    if (!isset($server_zone_adj)) {
      $server_zone_adj = date('Z');
    }
  }
  return $server_zone_adj;
}

/**
 *  Cross-database date SQL wrapper function
 *  allows use of normalized native date functions in both mysql and postgres.
 *  Designed to be extensible to other databases.
 *
 *  @param $result_type - NOW, DATE, YEAR, MONTH, DAY, HOUR, MINUTE, SECOND, DOW, DOY, WEEK
 *  @param $field - the name of the date field to be analyzed
 *  @param $date_type - the type of date field being analyzed, int or iso
 *  @param $offset - timezone offset in seconds, can be either a value or fieldname
 *  @param $offset_op - the operation to perform on the offset, + or -
 *  @return a SQL statement appropriate for the $db_type
 *
 *  example:          date_sql('WEEK', 'MYFIELD', 'int', 'MYOFFSETFIELD', '+')
 *  mysql returns:    WEEK(FROM_UNIXTIME(MYFIELD) + INTERVAL MYOFFSETFIELD SECOND, 3)
 *  postgres returns: EXTRACT(WEEK FROM(TIMESTAMP(MYFIELD::ABSTIME::INT4) + INTERVAL MYOFFSETFIELD SECONDS))
 */
function date_sql($result_type, $field, $date_type = 'int', $offset = '', $offset_op = '+') {
  global $db_type;

  // NOW() is timezone-adjusted by OS, adjust only for the server adj,
  // correct offset will get added back in later step.
  if ($date_type == 'NOW' || $field == 'NOW()') {
    switch ($db_type) {
      case('mysql'):
      case('mysqli'):
        if (date_server_zone_adj()) {
          $field = "(NOW() - INTERVAL ". date_server_zone_adj() ." SECOND)";
        }
        break;
      case('pgsql'):
        if (date_server_zone_adj()) {
          $field = "(NOW() - INTERVAL '". date_server_zone_adj() ." SECONDS')";
        }
        break;
     }
  }
  // Convert integer field value to native date format.
  // Since FROM_UNIXTIME() and TIMESTAMP() are timezone adjusted,
  // remove server adj, correct offset will get added back in later step.
  elseif ($date_type == 'int' && $field) {
    switch ($db_type) {
      case('mysql'):
      case('mysqli'):
        $field = "FROM_UNIXTIME($field)";
        if (date_server_zone_adj()) {
          $field = "($field - INTERVAL ". date_server_zone_adj() ." SECOND)";
        }
                break;
      case('pgsql'):
        $field = "($field::ABSTIME)";
        if (date_server_zone_adj()) {
          $field = "($field - INTERVAL '". date_server_zone_adj() ." SECONDS')";
        }
        break;
    }
  }
  // Get rid of the 'T' in ISO dates to match native date field.
  // This makes it possible to use SQL date functions on the value.
  elseif ($date_type == 'iso' && $field) {
    $field = " REPLACE($field,'T',' ')";
  }
  // Now apply requested offset to the adjusted query field.
  if ($offset) {
    switch ($db_type) {
    case('mysql'):
    case('mysqli'):
      $field = "($field $offset_op INTERVAL ($offset) SECOND)";
      break;
    case('pgsql'):
      $field = "($field $offset_op INTERVAL '$offset SECONDS')";
      break;
    }
  }
  // Return requested sql.
  // Note there is no space after FROM to avoid db_rewrite problems
  // see http://drupal.org/node/79904.
  switch ($result_type) {
  case('NOW'):
  case('DATE'):
    return $field;
  case('YEAR'):
    return "EXTRACT(YEAR FROM($field))";
  case('MONTH'):
    return "EXTRACT(MONTH FROM($field))";
  case('DAY'):
    return "EXTRACT(DAY FROM($field))";
  case('HOUR'):
    return "EXTRACT(HOUR FROM($field))";
  case('MINUTE'):
    return "EXTRACT(MINUTE FROM($field))";
  case('SECOND'):
    return "EXTRACT(SECOND FROM($field))";
  case('WEEK'):  // ISO week number for date
    switch ($db_type) {
      case('mysql'):
      case('mysqli'):
        // WEEK using arg 3 in mysql should return the same value as postgres EXTRACT
        return "WEEK($field, 3)";
      case('pgsql'):
        return "EXTRACT(WEEK FROM($field))";
    }
  case('DOW'):
    switch ($db_type) {
      case('mysql'):
      case('mysqli'):
        // mysql returns 1 for Sunday through 7 for Saturday
        // php date functions and postgres use 0 for Sunday and 6 for Saturday
        return "INTEGER(DAYOFWEEK($field) - 1)";
      case('pgsql'):
        return "EXTRACT (DOW FROM($field))";
    }
  case('DOY'):
    switch ($db_type) {
      case('mysql'):
      case('mysqli'):
        return "DAYOFYEAR($field)";
      case('pgsql'):
        return "EXTRACT (DOY FROM ($field))";
    }
  }
}

/**
 *  A helper function to do cross-database concatation of date parts
 *
 *  @param $array - an array of values to be concatonated in sql
 *  @return - correct sql string for database type
 */
function date_sql_concat($array) {
  global $db_type;

  switch ($db_type) {
    case('mysql'):
    case('mysqli'):
      return "CONCAT(". implode(",", $array) .")";
    case('pgsql'):
      return implode(" || ", $array);
  }
}

/**
 *  A helper function to do cross-database padding of date parts
 *
 *  @param $str - a string to apply padding to
 *  @param $size - the size the final string should be
 *  @param $pad - the value to pad the string with
 *  @param $side - the side of the string to pad
 */
function date_sql_pad($str, $size = 2, $pad = '0', $side = 'l') {
  switch ($side) {
  case('r'):
    return "RPAD($str, $size, '$pad')";
  default:
    return "LPAD($str, $size, '$pad')";
  }
}

/**
 *  Themes for date input form elements
 */

/**
 *  Date selector form
 *
 *  $form contains the whole date selector form.
 *  Make any changes needed, render it, and return the result.
 *
 */
function theme_date_form_select($form) {
  $form['#type']   = 'fieldset';
  return drupal_render($form);
}

/**
 *  Date selector description
 *
 *  $form contains the description added to the date selector.
 *  Make any changes needed, render it, and return the result.
 */
function theme_date_form_select_description($form) {
  $description = drupal_render($form);
  if ($description) {
    return '<br class="clear" /><div class="description"><div class="form-item">'. $description.'</div></div>';
  }
  return '';
}

/**
 *  Text input form
 *
 *  $form contains a text input form.
 *  Make any changes needed, render it, and return the result.
 */
function theme_date_form_text($form) {
  return drupal_render($form);
}

/**
 *  jsCalendar input form
 *
 *  $form contains a jscalendar input form.
 *  Make any changes needed, render it, and return the result.
 */
function theme_date_form_jscalendar($form) {
  return drupal_render($form);
}

/**
 *  Timezone input form
 *
 *  $form contains a timzone input form.
 *  Make any changes needed, render it, and return the result.
 */
function theme_date_form_timezone($form) {
  return drupal_render($form);
}

/**
 * An array of short date formats.
 *
 * @return array an array of short date format strings.
 */
function date_short_formats() {
  return array(
    'Y-m-d H:i',    'm/d/Y - H:i',  'd/m/Y - H:i', 'Y/m/d - H:i',
    'd.m.Y - H:i',  'm/d/Y - g:ia', 'd/m/Y - g:ia', 'Y/m/d - g:ia',
    'M j Y - H:i',  'j M Y - H:i',  'Y M j - H:i',
    'M j Y - g:ia', 'j M Y - g:ia', 'Y M j - g:ia');
}

/**
 * An array of medium date formats.
 *
 * @return array an array of medium date format strings.
 */
function date_medium_formats() {
  return array(
    'D, Y-m-d H:i',    'D, m/d/Y - H:i',  'D, d/m/Y - H:i',
    'D, Y/m/d - H:i',  'F j, Y - H:i',    'j F, Y - H:i',
    'Y, F j - H:i',    'D, m/d/Y - g:ia', 'D, d/m/Y - g:ia',
    'D, Y/m/d - g:ia', 'F j, Y - g:ia',   'j F Y - g:ia',
    'Y, F j - g:ia',   'j. F Y - G:i');
}

/**
 * An array of long date formats.
 *
 * @return array an array of long date format strings.
 */
function date_long_formats() {
  return array(
    'l, F j, Y - H:i',  'l, j F, Y - H:i', 'l, Y,  F j - H:i',
    'l, F j, Y - g:ia', 'l, j F Y - g:ia', 'l, Y,  F j - g:ia',
    'l, j. F Y - G:i');
}

/**
 * Array of granularity options and their lables
 *
 * @return array
 */
function date_granularity_names() {
  return array('Y' => t('Year'), 'M' => t('Month'), 'D' => t('Day'),
    'H' => t('Hour'), 'N' => t('Minute'), 'S' => t('Second'),
    );
}

/**
 * Array of granularity keys and the names of the related array parts.
 *
 * @return array
 */
function date_granularity_parts() {
  return array('Y' => 'year', 'M' => 'mon', 'D' => 'mday',
  'H' => 'hours', 'N' => 'minutes', 'S' => 'seconds');
}

/**
 * Rewrite a format string so it only inludes elements from a
 * specified granularity array.
 *
 * Example, turn 'F j, Y - H:i' into 'F j, Y'
 *
 * @param $format
 *   a format string
 * @param $granularity
 *   an array of allowed date parts, all others will be removed
 *   array('Y', 'M', 'D', 'H', 'N', 'S');
 * @return
 *   a format string with all other elements removed
 */
function date_limit_format($format, $granularity) {
  $regex = array();
  // Get rid of dash separating date and time if either is missing.
  if (!date_has_time($granularity)
    || sizeof(array_intersect($granularity, array('Y', 'M', 'D')) == 0)) {
    $regex[] = '( -)';
  }
  if (!date_has_time($granularity)) {
      $regex[] = '(a|A)';
  }
  // Create regular expressions to remove selected values from string.
  foreach (date_nongranularity($granularity) as $element) {
    switch ($element) {
      case 'Y':
        $regex[] = '([\-/\.]?[Yy][\-/\.,]?)';
        break;
      case 'D':
        $regex[] = '([\-/\.]?[lDdj][\-/\.,]?)';
        break;
      case 'M':
        $regex[] = '([\-/\.]?[FMmn][\-/\.,]?)';
        break;
      case 'H':
        $regex[] = '([HhGg][:]?)';
        break;
      case 'N':
        $regex[] = '([:]?[i])';
        break;
      case 'S':
        $regex[] = '([:]?[s])';
        break;
    }
  }
  // Remove selected values from string.
  // Don't leave any trailing punctuation behind.
  $format = trim(preg_replace($regex, array(), $format));
  return preg_replace('([\-/\.,]$)', '', $format);
}

/**
 * An difference array of granularity elements that are NOT in the
 * granularity array. Used by functions that strip unwanted
 * granularity elements out of formats and values.
 *
 * @param $granularity
 *   an array like ('Y', 'M', 'D', 'H', 'N', 'S');
 */
function date_nongranularity($granularity) {
  return array_diff(array('Y', 'M', 'D', 'H', 'N', 'S'), $granularity);
}
