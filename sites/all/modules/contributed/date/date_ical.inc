<?php
/* $Id: date_ical.inc,v 1.1.2.13 2007/10/26 20:12:58 karens Exp $ */

/**
 * Turn an array of events into a valid iCalendar file
 *
 * @param $events
 *   An array of associative arrays where
 *      'start'         => Unix timestamp (GMT) of start time (Required, if no allday_start)
 *      'end'           => Unix timestamp (GMT) of end time (Optional)
 *      'allday_start'  => Start date of all-day event in YYYYMMDD format (Required, if no start)
 *      'allday_end'    => End date of all-day event in YYYYMMDD format (Optional)
 *      'summary'       => Title of event (Text)
 *      'description'   => Description of event (Text)
 *      'location'      => Location of event (Text)
 *      'uid'           => ID of the event for use by calendaring program.  Recommend the url of the node
 *      'url'           => URL of event information
 *
 * @param $calname
 *   Name of the calendar.  Will use site name if none is specified.
 *
 * @return
 *   Text of a date_icalendar file
 */
function date_ical_export($events, $calname = NULL) {
  $output .= "BEGIN:VCALENDAR\nVERSION:2.0\n";
  $output .= "METHOD:PUBLISH\n";
  $output .= 'X-WR-CALNAME:'. date_ical_escape_text($calname ? $calname : variable_get('site_name', '')) ."\n";
  $output .= "PRODID:-//strange bird labs//Drupal iCal API//EN\n";
  foreach ($events as $uid => $event) {
    $output .= "BEGIN:VEVENT\n";
    $output .= "DTSTAMP;VALUE=DATE-TIME:". gmdate("Ymd\THis\Z", time()) ."\n";
    if ($event['allday_start'] && $event['allday_end']) {
      $output .= "DTSTART;VALUE=DATE-TIME:". $event['allday_start'] ."\n";
      $output .= "DTEND;VALUE=DATE-TIME:". $event['allday_end'] ."\n";
    }
    else if ($event['allday_start'] && empty($event['allday_end'])) {
      $output .= "DTSTART;VALUE=DATE-TIME:". $event['allday_start'] ."\n";
      $output .= "DTEND;VALUE=DATE-TIME:". date('Ymd', strtotime($event['allday_start']) + 86400) ."\n"; //If no allday end date, set to day after allday start
    }
    else if ($event['start'] && $event['end']) {
      $output .= "DTSTART;VALUE=DATE-TIME:". gmdate("Ymd\THis\Z", $event['start']) ."\n";
      $output .= "DTEND;VALUE=DATE-TIME:". gmdate("Ymd\THis\Z", $event['end']) ."\n";
    }
    else if ($event['start']) {
      $output .= "DTSTART;VALUE=DATE-TIME:". gmdate("Ymd\THis\Z", $event['start']) ."\n";
    }
    $output .= "UID:". ($event['uid'] ? $event['uid'] : $uid) ."\n";
    if ($event['url']) $output .= "URL;VALUE=URI:". $event['url'] ."\n";
    if ($event['location']) $output .= "LOCATION:" . date_ical_escape_text($event['location']) . "\n";
    $output .= "SUMMARY:". date_ical_escape_text($event['summary']) ."\n";
    if ($event['description']) $output .= "DESCRIPTION:". date_ical_escape_text($event['description']) ."\n";
    $output .= "END:VEVENT\n";
  }
  $output .= "END:VCALENDAR\n";
  return $output;
}

/**
 * Escape #text elements for safe iCal use
 *
 * @param $text
 *   Text to escape
 *
 * @return
 *   Escaped text
 *
 */
function date_ical_escape_text($text) {
  //$text = strip_tags($text);
  $text = str_replace('"', '\"', $text);
  $text = str_replace("\\", "\\\\", $text);
  $text = str_replace(",", "\,", $text);
  $text = str_replace(":", "\:", $text);
  $text = str_replace(";", "\;", $text);
  $text = str_replace("\n", "\n ", $text);
  return $text;
}

/**
 * Given the location of a valid iCalendar file, will return an array of event information
 *
 * @param $filename
 *   Location (local or remote) of a valid iCalendar file
 *
 * @return
 *   An array of associative arrays where
 *      'start'         => Unix timestamp (GMT) of start time
 *      'end'           => Unix timestamp (GMT) of end time
 *      'allday_start'  => Start date of all-day event in YYYYMMDD format
 *      'allday_end'    => End date of all-day event in YYYYMMDD format
 *      'summary'       => Title of event
 *      'description'   => Description of event
 *      'location'      => Location of event
 *      'uid'           => ID of the event in calendaring program
 *      'url'           => URL of event information                                                                                                                    *
 * 	    'start_raw'     => the raw start date supplied in the ical file,
 *      'start_timezone' => the timezone of the start date,
 *      'start_offset'   => the offset of the start date,
 * 	    'end_raw'        => the raw end date supplied in the ical file,
 *      'end_timezone'   => the timezone of the end date,
 * 	    'end_offset'     => the offset of the end date,
 *      'vcal'           => the complete vevent item,
 */
function date_ical_import($filename) {
  $items = array();

  // Fetch the iCal data. If file is a URL, use drupal_http_request. fopen
  // isn't always configured to allow network connections.
  if (substr($filename, 0, 4) == 'http') {
    // Fetch the ical data from the specified network location
    $icaldatafetch = drupal_http_request($filename);
    // Check the return result
    if ($icaldatafetch->error) {
      drupal_set_message('Request Error: ' . $icaldatafetch->error, 'error');
      return array();
    }
    // Break the return result into one array entry per lines
    $icaldatafolded = explode("\n", $icaldatafetch->data);
  }
  else {
    $icaldatafolded = @file($filename, FILE_IGNORE_NEW_LINES);
    if ($icaldatafolded === FALSE) {
      drupal_set_message('Failed to open file: ' . $filename, 'error');
      return array();
    }
  }

  // Verify this is iCal data
  if (trim($icaldatafolded[0]) != 'BEGIN:VCALENDAR') {
    drupal_set_message('Invalid calendar file:' . $filename, 'error');
    return array();
  }

  // "unfold" wrapped lines
  $icaldata = array();
  foreach ($icaldatafolded as $line) {
    if (substr($line, 0, 1) == ' ') {
      $line = array_pop($icaldata) . substr($line, 1);
    }
    $icaldata[] = $line;
  }
  $icaldatafolded = NULL;

  // Parse the iCal information
  foreach ($icaldata as $line) {
    $line = trim($line);
    $vcal .= $line ."\n";
    switch ($line) {
    	case 'BEGIN:VEVENT':
    		unset($start_unixtime, $start_date, $start_time,
	      $end_unixtime, $end_date, $end_time,
	      $allday_start, $allday_end, $the_duration,
	      $uid, $summary, $description, $url, $location,
	      $start_tz, $end_tz, $start_raw, $end_raw,
	      $start_offset, $end_offset, $vcal );
	      $vcal = $line ."\n";
        break;
      case 'END:VEVENT':
        if (empty($uid)) {
	        $uid = $uid_counter;
	        $uid_counter++;
        }
        if (empty($end_unixtime) && isset($the_duration)) {
	        $end_unixtime = $start_unixtime + $the_duration;
	        $end_time = date ('Hi', $end_unixtime);
        }
        $items[$uid] = array(
          'start' => $start_unixtime,
			    'end' => $end_unixtime,
			    'allday_start' => $allday_start,
			    'allday_end' => $allday_end,
			    'summary' => $summary,
			    'description' => $description,
			    'location' => $location,
			    'url' => $url,
			    'uid' => $uid,
			    'start_raw' => $start_raw,
			    'start_timezone' => $start_tz,
			    'start_offset' => $start_offset,
			    'end_raw' => $end_raw,
			    'end_timezone' => $end_tz,
			    'end_offset' => $end_offset,
          'vcal' => $vcal,
			    );
        break;
      default:
        unset ($field, $data, $prop_pos, $property);
        ereg ("([^:]+):(.*)", $line, $line);
        $field = $line[1];
        $data = $line[2];
        $property = $field;
        $prop_pos = strpos($property,';');
        if ($prop_pos !== false) $property = substr($property,0,$prop_pos);
        $property = strtoupper($property);
        switch ($property) {
          case 'DTSTART':
	          $zulu_time = false;
	          if (substr($data,-1) == 'Z') $zulu_time = true;
	          $data = str_replace('T', '', $data);
	          $data = str_replace('Z', '', $data);
	          $field = str_replace(';VALUE=DATE-TIME', '', $field);
	          if ((preg_match("/^DTSTART;VALUE=DATE/i", $field)) || (ereg ('^([0-9]{4})([0-9]{2})([0-9]{2})$', $data))) {
	            ereg ('([0-9]{4})([0-9]{2})([0-9]{2})', $data, $dtstart_check);
	            $allday_start = $data;
	            $start_date = $allday_start;
	            $start_unixtime = strtotime($data);
	          }
	          else {
	            if (preg_match("/^DTSTART;TZID=/i", $field)) {
	              $tz_tmp = explode('=', $field);
	              $tz_dtstart = $tz_tmp[1];
	              unset($tz_tmp);
	            }
	            elseif ($zulu_time) {
	              $tz_dtstart = 'GMT';
	            }
	            preg_match ('/([0-9]{4})([0-9]{2})([0-9]{2})([0-9]{0,2})([0-9]{0,2})/', $data, $regs);
	            $start_date = $regs[1] . $regs[2] . $regs[3];
	            $start_time = $regs[4] . $regs[5];
	            $start_unixtime = gmmktime($regs[4], $regs[5], 0, $regs[2], $regs[3], $regs[1]);
              $dlst = date('I', $start_unixtime);
	            $server_offset_tmp = _date_ical_chooseOffset($start_unixtime, 'Same as Server');
	            if (isset($tz_dtstart)) {
	              if ($tz = _date_ical_tz($tz_dtstart)) {
	                $offset_tmp = date('I', $start_unixtime) ? _date_ical_calcString($tz->offset_dst)  : _date_ical_calcString($tz->offset);
	              }
	              else {
	                $offset_tmp = '+0000';
	              }
	            } else if (isset($calendar_tz)) {
                if ($tz = _date_ical_tz($calendar_tz)) {
                  $offset_tmp = date('I', $start_unixtime) ? _date_ical_calcString($tz->offset_dst)  : _date_ical_calcString($tz->offset);
	              } else {
	                $offset_tmp = '+0000';
	              }
	            } else {
	              $offset_tmp = $server_offset_tmp;
	            }
	            $start_unixtime = _date_ical_calcTime($offset_tmp, $server_offset_tmp, $start_unixtime);
	            $start_date = gmdate('Ymd', $start_unixtime);
	            $start_time = gmdate('Hi', $start_unixtime);
	            $start_offset = $offset_tmp;
	            $start_tz = $tz_dtstart;
	            $start_raw = $data;
	            unset($server_offset_tmp, $offset_tmp, $tz_dtstart);
	          }
	          break;
          case 'DTEND':
	          $zulu_time = false;
	          if (substr($data,-1) == 'Z') $zulu_time = true;
	          $data = str_replace('T', '', $data);
	          $data = str_replace('Z', '', $data);
	          $field = str_replace(';VALUE=DATE-TIME', '', $field);
            if ((preg_match("/^DTEND;VALUE=DATE/i", $field)) || (ereg ('^([0-9]{4})([0-9]{2})([0-9]{2})$', $data))) {
              $allday_end = $data;
              $end_date = $allday_end;
              $end_unixtime = strtotime($data);
            }
	          else {
	            if (preg_match("/^DTEND;TZID=/i", $field)) {
	              $tz_tmp = explode('=', $field);
	              $tz_dtend = $tz_tmp[1];
	              unset($tz_tmp);
	            }
	            elseif ($zulu_time) {
	              $tz_dtend = 'GMT';
	            }
	            preg_match ('/([0-9]{4})([0-9]{2})([0-9]{2})([0-9]{0,2})([0-9]{0,2})/', $data, $regs);
	            $end_date = $regs[1] . $regs[2] . $regs[3];
	            $end_time = $regs[4] . $regs[5];
	            $end_unixtime = gmmktime($regs[4], $regs[5], 0, $regs[2], $regs[3], $regs[1]);
  	          $server_offset_tmp = _date_ical_chooseOffset($end_unixtime, 'Same as Server');
	            if (isset($tz_dtend)) {
	              if ($tz = _date_ical_tz($tz_dtend)) {
	                $offset_tmp = date('I', $end_unixtime) ? _date_ical_calcString($tz->offset_dst)  : _date_ical_calcString($tz->offset);
	              }
	              else {
	                $offset_tmp = '+0000';
	              }
	            } else if (isset($calendar_tz)) {
                if ($tz = _date_ical_tz($calendar_tz)) {
                  $offset_tmp = date('I', $end_unixtime) ? _date_ical_calcString($tz->offset_dst)  : _date_ical_calcString($tz->offset);
	              } else {
	                $offset_tmp = '+0000';
	              }
	            } else {
	              $offset_tmp = $server_offset_tmp;
	            }
	            $end_unixtime = _date_ical_calcTime($offset_tmp, $server_offset_tmp, $end_unixtime);
	            $end_date = gmdate('Ymd', $end_unixtime);
	            $end_time = gmdate('Hi', $end_unixtime);
	            $end_offset = $offset_tmp;
	            $end_tz = $tz_dtend;
	            $end_raw = $data;
	            unset($server_offset_tmp, $offset_tmp, $tz_dtend);
	          }
	          break;
          case 'DURATION':
	          if (!stristr($field, '=DURATION')) {
	            ereg ('^P([0-9]{1,2}[W])?([0-9]{1,2}[D])?([T]{0,1})?([0-9]{1,2}[H])?([0-9]{1,2}[M])?([0-9]{1,2}[S])?', $data, $duration);
	            $weeks = str_replace('W', '', $duration[1]);
	            $days = str_replace('D', '', $duration[2]);
	            $hours = str_replace('H', '', $duration[4]);
	            $minutes = str_replace('M', '', $duration[5]);
	            $seconds = str_replace('S', '', $duration[6]);
	            $the_duration = ($weeks * 60 * 60 * 24 * 7) + ($days * 60 * 60 * 24) + ($hours * 60 * 60) + ($minutes * 60) + ($seconds);
	          }
	          break;
          case 'SUMMARY':
	          $summary = $data;
	          break;
          case 'DESCRIPTION':
	          $description = $data;
	          break;
          case 'UID':
	          $uid = $data;
	          break;
          case 'X-WR-CALNAME':
	          $actual_calname = $data;
	          break;
          case 'X-WR-TIMEZONE':
	          $calendar_tz = $data;
	          break;
          case 'LOCATION':
	          $location = $data;
	          break;
          case 'URL':
	          $url = $data;
	          break;
        }
    }
  }
  return $items;
}

function _date_ical_tz($tz) {
  include_once(drupal_get_path('module', 'date_api') .'/date.inc');
  include_once('./'. drupal_get_path('module', 'date_api') .'/date_timezones.inc');
  foreach (date_get_timezones() as $delta => $zone) {
    if ($tz == $zone['timezone'])  return (object) $zone;
  }
}

function _date_ical_chooseOffset($time, $timezone) {
  if (!isset($timezone)) $timezone = '';
  switch ($timezone) {
    case '':
      $offset = 'none';
      break;
    case 'Same as Server':
      $offset = date('O', $time);
      break;
    default:
      if ($tz = _date_ical_tz($timezone)) {
        $offset = date('I', $time) ? _date_ical_calcString($tz->offset_dst) : _date_ical_calcString($tz->offset);
      } else {
        $offset = '+0000';
      }
  }
  return $offset;
}


/**
 * Convert time from one timezone to another.
 *
 * @param $have - a timezone string for the submitted timestamp
 * @param $want - the desired output timezone string
 * @param $time - a timestamp to be converted
 * @return converted value
 */
function _date_ical_calcTime($have, $want, $time) {
  if ($have == 'none' || $want == 'none') return $time;
  $have_secs = _date_ical_calcOffset($have);
  $want_secs = _date_ical_calcOffset($want);
  $diff = $want_secs - $have_secs;
  $time += $diff;
  return $time;
}

/**
 * Convert a timezone offset in seconds to a formatted timezone offset string
 *   i.e. +10800 becomes +0300;
 */
function _date_ical_calcString($seconds) {
  $sign = substr($seconds, 0, 1);
  $seconds = substr($seconds, 1);
  $hours = intval($seconds / 3600);
  $minutes = intval(($seconds - ($hours * 3600))/ 60);
  return $sign . sprintf("%02d", $hours) . sprintf("%02d", $minutes);
}

/**
 * Convert a formatted timezone offset string the offset value in seconds.
 *   i.e. +0300 becomes +10800.
 */
function _date_ical_calcOffset($offset_str) {
  $sign = substr($offset_str, 0, 1);
  $hours = substr($offset_str, 1, 2);
  $mins = substr($offset_str, 3, 2);
  $secs = ((int)$hours * 3600) + ((int)$mins * 60);
  if ($sign == '-') $secs = 0 - $secs;
  return $secs;
}
