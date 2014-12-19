<?php

function activeedit_theme_data() {
  $selectors = array();
  $selectors['logo_path'] = '#logo > a';
  $selectors['site_name'] = '#logo-floater span';
  // No usable selector for slogan.
  // $selectors['site_slogan'] = '#logo-floater a';
  $selectors['site_mission'] = '#mission';
  $selectors['site_footer'] = '#footer';
  $selectors['node_title'] = 'h2 > a';
  $selectors['comment_subject'] = 'h3 > a';
  return $selectors;
}