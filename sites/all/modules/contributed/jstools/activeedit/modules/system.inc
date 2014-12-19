<?php
// $Id: system.inc,v 1.1 2007/01/26 22:15:18 nedjo Exp $

/**
 * Implementation of hook_activeedit_elements().
 */
function system_activeedit_elements($object = NULL) {
  $elements = array();
  // Test for appropriate permissions.
  $access = user_access('administer site configuration');
  $submit_text = t('Save configuration');
  $elements['logo_path'] = array(
    '#title' => t('logo file'),
    '#selector' => '#logo > a',
    '#submit_text' => $submit_text,
    '#target' => 'admin/themes/settings',
    '#access' => $access,
    '#form' => array(
      'system_theme_settings' => array(
        array(
          'logo', 'logo_upload',
        ),
      ),
    ),
  );
  $elements['site_name'] = array(
    '#title' => t('site name'),
    '#selector' => '.site-name',
    '#submit_text' => $submit_text,
    '#target' => 'admin/settings/site-information',
    '#access' => $access,
    '#form' => array(
      'system_site_information_settings' => array(
        array(
          'site_name',
        ),
      ),
    ),
  );
  $elements['site_slogan'] = array(
    '#title' => t('site slogan'),
    '#selector' => '.site-slogan',
    '#submit_text' => $submit_text,
    '#target' => 'admin/settings/site-information',
    '#access' => $access,
    '#form' => array(
      'system_site_information_settings' => array(
        array(
          'site_slogan',
        ),
      ),
    ),
  );
  $elements['site_mission'] = array(
    '#title' => t('site mission'),
    '#selector' => '#mission',
    '#submit_text' => $submit_text,
    '#target' => 'admin/settings/site-information',
    '#access' => $access,
    '#form' => array(
      'system_site_information_settings' => array(
        array(
          'site_mission',
        ),
      ),
    ),
  );
  $elements['site_footer'] = array(
    '#title' => t('footer'),
    '#selector' => '#footer',
    '#submit_text' => $submit_text,
    '#target' => 'admin/settings/site-information',
    '#access' => $access,
    '#form' => array(
      'system_site_information_settings' => array(
        array(
          'site_footer',
        ),
      ),
    ),
  );
  // We generate content separately, on demand, to avoid unneeded processing.
  // Otherwise these calls would all be run on every page load.
  if (isset($_POST) && $_POST['activeedit_submit'] && $key = $_REQUEST['activeedit_id']) {
    $content = FALSE;
    switch ($key) {
      case 'logo_path':
        init_theme();
        $content = '<img src="'. theme_get_setting('logo', TRUE) .'" alt="'. t('Home') .'"/>';
        break;
      case 'site_name':
        $content = '<a href="'. $base_path .'" title="'. t('Home') .'">'. variable_get('site_name', 'drupal') .'</a>';
        break;
      case 'site_slogan':
        $content = variable_get('site_slogan', '');
        break;
      case 'site_mission':
        $content = variable_get('site_mission', '');
        break;
      case 'site_footer':
        $content = variable_get('site_footer', '');
        break;
    }
    if ($content) {
      $elements[$key]['#content'] = $content;
    }
  }

  return $elements;
}