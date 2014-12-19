<?php
// $Id: user.inc,v 1.1.2.5 2008/03/29 13:37:27 nedjo Exp $

function user_activeedit_autocompletes() {
  $autocompletes = array();
  $autocompletes['user'] = array(
    '#title' => t('users'),
    '#marker' => 'user/autocomplete',
    '#submit_text' => t('Create new account'),
    '#access' => user_access('administer users'),
    '#target' => 'admin/user/user/create',
    '#form' => array(
      'user_register' => array(),
    ),
    '#transfer_element' => 'name',
  );
  return $autocompletes;
}