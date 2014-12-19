<?php

function activeedit_theme_data() {
  $selectors = array();
  $selectors['logo_path'] = 'div#header > a';
  $selectors['site_name'] = '.site-name';
  $selectors['site_slogan'] = '.site-slogan';
  $selectors['site_footer'] = '#footer';
  return $selectors;
}