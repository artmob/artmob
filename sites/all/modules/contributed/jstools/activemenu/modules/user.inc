<?php
// $Id: user.inc,v 1.1 2007/01/23 20:14:19 nedjo Exp $

function user_activemenu() {
  $items = array();
  $items['#block-user-1'] = 'activemenu/menu';
  return $items;
}