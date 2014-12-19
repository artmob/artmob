<?php

function activeedit_theme_data() {
  $selectors = array();
  $selectors['logo_path'] = '#home > a';
  $selectors['site_name'] = '.site-name';
  $selectors['site_slogan'] = '.site-slogan';
  $selectors['site_mission'] = '#mission';
  $selectors['site_footer'] = '#footer';
  return $selectors;
}