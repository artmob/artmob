<?php
// $Id: artmob_exhibit_support/inc, v 1.0 2011/03/31 08:31:22 stop14 Exp $

/**
 * @file
 * Contains helper functions to assist with Taxonomy manipulation and Date Handling
*/

/* TAXONOMY MANIPULATION */

function artmob_exhibit_taxonomy_get_types_in_vocabulary_as_array($vname) {
  $result_array = array();
  $result = artmob_exhibit_taxonomy_get_types_in_vocabulary_as_result($vname);
  while ($row = db_fetch_object($result)) {
    $result_array[] = $row->type;
  }
  return $result_array;
}

function artmob_exhibit_taxonomy_get_types_in_vocabulary_as_result($vname) {
  $vid = artmob_exhibit_taxonomy_get_vocabulary_by_name($vname);
  if ($vid) {
    $result = db_query("SELECT t.type FROM {vocabulary} v
                         LEFT JOIN vocabulary_node_types t
                         ON v.vid = t.vid
                         WHERE v.vid = %d", $vid);
    }
  return $result;
}

//--------------------------------------------------------------------
function artmob_exhibit_taxonomy_get_terms_node_in_vocabulary_by_name($nid, $vname) {
  $result_array = array();
  $vid = artmob_exhibit_taxonomy_get_vocabulary_by_name($vname);
  if ($vid) {
    return artmob_exhibit_taxonomy_get_terms_node_in_vocabulary($nid, $vid);
  } 
  else {
    return $result_array;
  }
}

//--------------------------------------------------------------------
function artmob_exhibit_taxonomy_get_terms_node_in_vocabulary($nid, $vid) {
  $result_array = array();
  
  //if there are any node with any term in this vocabulary then return an array of term objects
  $result = db_query("SELECT t.tid FROM {term_node} t LEFT JOIN {term_data} d ON t.tid = d.tid WHERE t.nid = %d AND d.vid = %d", $nid, $vid);
  
  while ($row = db_fetch_object($result)) {
    $term = taxonomy_get_term($row->tid);
    $result_array[] = $term;
  }
  
  return $result_array;
}

function artmob_exhibit_taxonomy_add_term_to_vocabulary_by_name($vname, $module, $term_name, $term_description, &$vid, $term_weight = 0) {
      
  //This function will see if a vocabulary $vname from module $module exists.
  //If it doesn't then it will create it.
  //It will check to see if vocabulary $vname has a term called $term_name
  //If it doesn't then it will create one
  //Note that it assumes that a $vid variable is passed in which it will
  //change it to the $vid it either found or created.
        
  $vid = artmob_exhibit_taxonomy_add_vocabulary($vname, $module);
  
  //Then we want to add a new term that matches the name of our module
  $term = array(
                'name' => $term_name,
                'description' => $term_description,
                'weight' => $term_weight,
                'vid' => $vid
 );

  //First check to see if this term name already exists inside this vocabulary
  $tid = '';
  $term_result = taxonomy_get_term_by_name($term_name);
  foreach ($term_result as $term_object) {
       if ($term_object->vid == $vid) {
         $tid = $term_object->tid;
    }
  }

  //If the term does not exist in this vocabulary then save it
  if (empty($tid)) {
    $result = taxonomy_save_term($term); //unfortunately, this does NOT return the tid so we have to query to get it using taxonomy_get_term_by_name
    $term_result = taxonomy_get_term_by_name($term_name);
     foreach ($term_result as $term_object) {
       $tid = $term_object->tid;
    }
   } 
   else {
     $term['tid'] = $tid;
     $result = taxonomy_save_term($term); 
  }
  return $tid;
}


//--------------------------------------------------------------------
function artmob_exhibit_taxonomy_add_vocabulary($vname, $module) {
  //This function will create a vocabulary with the name $vname
  //and tagged with module $module. Note there exists a vocabulary
  //with this name or from this module, then that $vid will be returned
  
  $vid = artmob_exhibit_taxonomy_get_vocabulary_by_name($vname);
  if (!$vid) {
    //Check to see if a vocabulary for this module exists
    $vid = db_result(db_query("SELECT vid FROM {vocabulary} WHERE module = '%s'", $module));
  }
  return $vid;
}


function artmob_exhibit_taxonomy_del_term_from_vocabulary_by_name($vname, $term_name) {
  //This function will see if a vocabulary $vname from module $module exists.
  //If it exists then it checks for the term_name
  //it then deletes the term with term_name inside of this vocabulary
  
  $vid = artmob_exhibit_taxonomy_get_vocabulary_by_name($vname);
  if ($vid) {

  //Then we want to add a new term that matches the name of our module
  $term = array(
          'name' => $term_name,
          'description' => $term_description,
          'vid' => $vid
      );
   $tid = '';
   $term_result = taxonomy_get_term_by_name($term_name);
   foreach ($term_result as $term_object) {
     if ($term_object->vid == $vid) {
     $tid = $term_object->tid;
     taxonomy_del_term($tid);
     }
     }
  }
}

function artmob_exhibit_taxonomy_get_vocabulary_by_name($vname) {
  $result = db_result(db_query("SELECT vid FROM {vocabulary} WHERE name = '%s'", $vname));
  return $result;
}

/* DATE HANDLING FUNCTIONS */

function artmob_exhibit_date_to_timestamp($date = 1) {
   return mktime(0, 0, 0, (int)$date['month'], (int)$date['day'], (int)$date['year']);
}


function artmob_exhibit_set_date($timestamp = NULL) {
  if ($timestamp == NULL) {
    return time();
  }
  else{
    return $timestamp;
  }
}

function artmob_exhibit_timestamp_to_date($timestamp = 1) {
  $day = date('j', $timestamp);
  $month = date('n', $timestamp);
  $year = date('Y', $timestamp);
  $hour = date('G', $timestamp);
  $minutes = date('i', $timestamp);
  $seconds = date('s', $timestamp);
  return array('day' => $day, 'month' => $month, 'year' => $year, 'hour' => $hour, 'minutes' => $minutes, 'seconds' => $seconds);
}