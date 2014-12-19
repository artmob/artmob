<?php
// $Id: wijering.admin.inc,v 1.1.2.11 2008/09/07 07:21:32 stuartgreenfield Exp $

/*
 * Called by wijering_admin_form()
 */
function _wijering_admin_form() {

  $saved_settings = _wijering_settings('wijering_mediaplayer');
  // Flatten settings for convenience
  $saved = array();
  foreach ($saved_settings AS $category => $vars) {
    $saved = array_merge($saved, $vars);
  }
  $options = _wijering_options();

  $form = array();

  // Media Player

  $form['wijering_mediaplayer'] = array(
    '#type'  => 'fieldset',
    '#title' => t('Media Player Flashvars'),
    '#collapsible' => FALSE,
    '#collapsed' => FALSE,
    '#description' => 'These are the settings for Jeroen Wijering\'s mediaplayer.swf
                       and correspond (by category and order) to the '.
                       l('Media Player and Image Rotator README', 'http://jeroenwijering.com/extras/readme.html')
                       .'. It is possible that you do not need to change any of
                       these settings, blanks values will defer to friendly
                       Media Player defaults. Note that the label in (<em>brackets</em>)
                       is the actual flashvar name and corresponds to the README.'

  );
  $form['wijering_mediaplayer']['basic'] = array(
    '#type'  => 'fieldset',
    '#title' => t('Basic'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  );
  $form['wijering_mediaplayer']['basic']['displayheight'] = array(
    '#type' => 'textfield',
    '#default_value' => $saved['displayheight'],
    '#size' => 8,
    '#maxlength' => 5,
    '#title' => t('Display height'),
    '#description' => t('Leave blank for default which will respond to the available height of the player. (<em>displayheight</em>)'),
  );
  $form['wijering_mediaplayer']['basic']['height'] = array(
    '#type' => 'textfield',
    '#default_value' => $saved['height'],
    '#size' => 8,
    '#maxlength' => 5,
    '#title' => t('Height'),
    '#description' => t('Leave blank for default. (<em>height</em>)'),
  );
  $form['wijering_mediaplayer']['basic']['width'] = array(
    '#type' => 'textfield',
    '#default_value' => $saved['width'],
    '#size' => 8,
    '#maxlength' => 5,
    '#title' => t('Width'),
    '#description' => t('Leave blank for default. (<em>width</em>)'),
  );
  $form['wijering_mediaplayer']['color'] = array(
    '#type'  => 'fieldset',
    '#title' => t('Color'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  );
  $form['wijering_mediaplayer']['color']['backcolor'] = array(
    '#type' => 'textfield',
    '#default_value' => $saved['backcolor'],
    '#size' => 8,
    '#maxlength' => 7,
    '#title' => t('Background color'),
    '#description' => t('Enter a hex value eg. for white enter <b>#FFFFFF</b>. (<em>backcolor</em>)'),
  );
  $form['wijering_mediaplayer']['color']['frontcolor'] = array(
    '#type' => 'textfield',
    '#default_value' => $saved['frontcolor'],
    '#size' => 8,
    '#maxlength' => 7,
    '#title' => t('Text color'),
    '#description' => t('Enter a hex value eg. for white enter <b>#FFFFFF</b>. (<em>frontcolor</em>)'),
  );
  $form['wijering_mediaplayer']['color']['lightcolor'] = array(
    '#type' => 'textfield',
    '#default_value' => $saved['lightcolor'],
    '#size' => 8,
    '#maxlength' => 7,
    '#title' => t('Rollover color'),
    '#description' => t('Enter a hex value eg. for white enter <b>#FFFFFF</b>. (<em>lightcolor</em>)'),
  );
  $form['wijering_mediaplayer']['appearance'] = array(
    '#type'  => 'fieldset',
    '#title' => t('Appearance'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  );
  $form['wijering_mediaplayer']['appearance']['autoscroll'] = array(
    '#type' => 'select',
    '#options' => $options['bool'],
    '#default_value' => $saved['autoscroll'],
    '#title' => t('Autoscroll'),
    '#description' => t('Provide a scrollbar or autoscroll with mouse movements. (<em>autoscroll</em>)'),
  );
  $form['wijering_mediaplayer']['appearance']['displaywidth'] = array(
    '#type' => 'textfield',
    '#default_value' => $saved['displaywidth'],
    '#size' => 8,
    '#maxlength' => 5,
    '#title' => t('Display width'),
    '#description' => t('Setting this will result in controls along the side and override "Display width". (<em>displaywidth</em>)'),
  );
  $form['wijering_mediaplayer']['appearance']['largecontrols'] = array(
    '#type' => 'select',
    '#options' => $options['bool'],
    '#default_value' => $saved['largecontrols'],
    '#title' => t('Large controls'),
    '#description' => t('Double the size of the controls. (<em>largecontrols</em>)'),
  );
  $form['wijering_mediaplayer']['appearance']['logo'] = array(
    '#type' => 'textfield',
    '#default_value' => $saved['logo'],
    '#title' => t('Logo URL'),
    '#description' => t('Full url to logo for a watermark, use PNG files for best results. (<em>logo</em>)'),
  );
  $form['wijering_mediaplayer']['appearance']['overstretch'] = array(
    '#type' => 'select',
    '#default_value' => $saved['overstretch'],
    '#title' => t('Overstretch'),
    '#options' => $options['overstretch'],
    '#description' => t('Defines how to stretch images to fit the display. (<em>overstretch</em>)'),
  );
  $form['wijering_mediaplayer']['appearance']['showdigits'] = array(
    '#type' => 'select',
    '#options' => $options['bool'],
    '#default_value' => $saved['showdigits'],
    '#title' => t('Show digits'),
    '#description' => t('Show or hide the elasped/total time. (<em>showdigits</em>)'),
  );
  $form['wijering_mediaplayer']['appearance']['showeq'] = array(
    '#type' => 'select',
    '#options' => $options['bool'],
    '#default_value' => $saved['showeq'],
    '#title' => t('Show equalizer'),
    '#description' => t('Nice and fake graphic equalizer. (<em>showeq</em>)'),
  );
  $form['wijering_mediaplayer']['appearance']['showicons'] = array(
    '#type' => 'select',
    '#options' => $options['bool'],
    '#default_value' => $saved['showicons'],
    '#title' => t('Show icons'),
    '#description' => t('Show status icons in display. (<em>showicons</em>)'),
  );
  $form['wijering_mediaplayer']['appearance']['thumbsinplaylist'] = array(
    '#type' => 'select',
    '#options' => $options['bool'],
    '#default_value' => $saved['thumbsinplaylist'],
    '#title' => t('Show thumbs in playlist'),
    '#description' => t('Show item by item thumbnails passed by xml playlist. (<em>thumbsinplaylist</em>)'),
  );
  $form['wijering_mediaplayer']['playback'] = array(
    '#type'  => 'fieldset',
    '#title' => t('Playback'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  );
  $form['wijering_mediaplayer']['playback']['autostart'] = array(
    '#type' => 'select',
    '#options' => $options['bool'],
    '#default_value' => $saved['autostart'],
    '#title' => t('Autostart'),
    '#description' => t('Automatically start playing the media. (<em>autostart</em>)'),
  );
  $form['wijering_mediaplayer']['playback']['bufferlength'] = array(
    '#type' => 'textfield',
    '#default_value' => $saved['bufferlength'],
    '#size' => 5,
    '#maxlength' => 2,
    '#title' => t('Buffer length'),
    '#description' => t('Number of seconds of buffering before playing file. (<em>bufferlength</em>)'),
  );
  $form['wijering_mediaplayer']['playback']['repeat'] = array(
    '#type' => 'select',
    '#default_value' => $saved['repeat'],
    '#title' => t('Repeat'),
    '#options' => $options['repeat'],
    '#description' => t('Set whether the media repeats after completion. (<em>repeat</em>)'),
  );
  $form['wijering_mediaplayer']['playback']['rotatetime'] = array(
    '#type' => 'textfield',
    '#default_value' => $saved['rotatetime'],
    '#size' => 5,
    '#maxlength' => 3,
    '#title' => t('Rotate time'),
    '#description' => t('Number of seconds between image rotations. (<em>rotatetime</em>)'),
  );
  $form['wijering_mediaplayer']['playback']['shuffle'] = array(
    '#type' => 'select',
    '#options' => $options['bool'],
    '#default_value' => $saved['shuffle'],
    '#title' => t('Shuffle'),
    '#description' => t('Shuffle media randomly. (<em>shuffle</em>)'),
  );
  $form['wijering_mediaplayer']['playback']['volume'] = array(
    '#type' => 'textfield',
    '#default_value' => $saved['volume'],
    '#size' => 8,
    '#maxlength' => 3,
    '#title' => t('Volume'),
    '#description' => t('Starting volume of the player. (<em>volume</em>)'),
  );
  $form['wijering_mediaplayer']['interaction'] = array(
    '#type'  => 'fieldset',
    '#title' => t('Interaction'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  );
  $form['wijering_mediaplayer']['interaction']['callback'] = array(
    '#type' => 'textfield',
    '#default_value' => $saved['callback'],
    '#title' => t('Callback URL'),
    '#description' => t('Full url used to pass statistics back to a server. (<em>callback</em>)'),
  );
  $form['wijering_mediaplayer']['interaction']['captions'] = array(
    '#type' => 'textfield',
    '#default_value' => $saved['captions'],
    '#title' => t('Captions URL'),
    '#description' => t('Full url used to an external textfile with captions. (<em>captions</em>)'),
  );
  $form['wijering_mediaplayer']['interaction']['enablejs'] = array(
    '#type' => 'select',
    '#options' => $options['bool'],
    '#default_value' => $saved['enablejs'],
    '#title' => t('Enable javascript'),
    '#description' => t('Enable javascript interaction with the flash player. (<em>enablejs</em>)'),
  );
  $form['wijering_mediaplayer']['interaction']['fsbuttonlink'] = array(
    '#type' => 'textfield',
    '#default_value' => $saved['fsbuttonlink'],
    '#title' => t('Fullscreen button link'),
    '#description' => t('Full url link to an alternative page, assuming the player supports full screen play. (<em>fsbuttonlink</em>)'),
  );
  $form['wijering_mediaplayer']['interaction']['link'] = array(
    '#type' => 'textfield',
    '#default_value' => $saved['link'],
    '#title' => t('Link URL'),
    '#description' => t('Web address linked to logo watermark. (<em>link</em>)'),
  );
  $form['wijering_mediaplayer']['interaction']['linkfromdisplay'] = array(
    '#type' => 'select',
    '#options' => $options['bool'],
    '#default_value' => $saved['linkfromdisplay'],
    '#title' => t('Link from display'),
    '#description' => t('Link "Link URL" but with the whole display as the click area. (<em>linkfromdisplay</em>)'),
  );
  $form['wijering_mediaplayer']['interaction']['linktarget'] = array(
    '#type' => 'select',
    '#default_value' => $saved['linktarget'],
    '#options' => $options['linktarget'],
    '#title' => t('Link target'),
    '#description' => t('Target of "Link URL". (<em>linktarget</em>)'),
  );
  $form['wijering_mediaplayer']['interaction']['streamscript'] = array(
    '#type' => 'textfield',
    '#default_value' => $saved['streamscript'],
    '#title' => t('Streaming script URL'),
    '#description' => t('Full url to \'fake\' streaming script. (<em>streamscript</em>)'),
  );
  $form['wijering_mediaplayer']['interaction']['type'] = array(
    '#type' => 'textfield',
    '#size' => 8,
    '#maxlength' => 5,
    '#default_value' => $saved['type'],
    '#title' => t('File type'),
    '#description' => t('Specify a default filename extension, rarely required. (<em>type</em>)'),
  );
  $form['wijering_mediaplayer']['interaction']['usecaptions'] = array(
    '#type' => 'select',
    '#options' => $options['bool'],
    '#default_value' => $saved['usecaptions'],
    '#title' => t('Use captions'),
    '#description' => t('Determine whether to show captions. (<em>usecaptions</em>)'),
  );
  $form['wijering_mediaplayer']['interaction']['usefullscreen'] = array(
    '#type' => 'select',
    '#options' => $options['bool'],
    '#default_value' => $saved['usefullscreen'],
    '#title' => t('Use fullscreen'),
    '#description' => t('Determine whether to allow fullscreen functionality. (<em>usefullscreen</em>)'),
  );
  $form['wijering_mediaplayer']['interaction']['usekeys'] = array(
    '#type' => 'select',
    '#options' => $options['bool'],
    '#default_value' => $saved['usekeys'],
    '#title' => t('Use keys'),
    '#description' => t('Determine whether to allow nteraction with the keyboard. (<em>usekeys</em>)'),
  );

 // Image Rotator

  $saved_settings = _wijering_settings('wijering_imagerotator');
  // Flatten settings for convenience
  $saved = array();
  foreach ($saved_settings AS $category => $vars) {
    $saved = array_merge($saved, $vars);
  }

  $form['wijering_imagerotator'] = array(
    '#type'  => 'fieldset',
    '#title' => t('Image Rotator Flashvars'),
    '#collapsible' => FALSE,
    '#collapsed' => FALSE,
    '#description' => 'These are the settings for Jeroen Wijering\'s imagerotator.swf
                       and correspond (by category and order) to the '.
                       l('Media Player and Image Rotator README', 'http://jeroenwijering.com/extras/readme.html')
                       .'. It is possible that you do not need to change any of
                       these settings, blanks values will defer to friendly
                       Media Player defaults. Note that the label in (<em>brackets</em>)
                       is the actual flashvar name and corresponds to the README.'

  );
  $form['wijering_imagerotator']['basic'] = array(
    '#type'  => 'fieldset',
    '#title' => t('Basic'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  );
  $form['wijering_imagerotator']['basic']['height'] = array(
    '#type' => 'textfield',
    '#default_value' => $saved['height'],
    '#size' => 8,
    '#maxlength' => 5,
    '#title' => t('Height'),
    '#description' => t('Leave blank for default. (<em>height</em>)'),
  );
  $form['wijering_imagerotator']['basic']['width'] = array(
    '#type' => 'textfield',
    '#default_value' => $saved['width'],
    '#size' => 8,
    '#maxlength' => 5,
    '#title' => t('Width'),
    '#description' => t('Leave blank for default. (<em>width</em>)'),
  );
  $form['wijering_imagerotator']['color'] = array(
    '#type'  => 'fieldset',
    '#title' => t('Color'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  );
  $form['wijering_imagerotator']['color']['backcolor'] = array(
    '#type' => 'textfield',
    '#default_value' => $saved['backcolor'],
    '#size' => 8,
    '#maxlength' => 7,
    '#title' => t('Background color'),
    '#description' => t('Enter a hex value eg. for white enter <b>#FFFFFF</b>. (<em>backcolor</em>)'),
  );
  $form['wijering_imagerotator']['color']['frontcolor'] = array(
    '#type' => 'textfield',
    '#default_value' => $saved['frontcolor'],
    '#size' => 8,
    '#maxlength' => 7,
    '#title' => t('Text color'),
    '#description' => t('Enter a hex value eg. for white enter <b>#FFFFFF</b>. (<em>frontcolor</em>)'),
  );
  $form['wijering_imagerotator']['color']['lightcolor'] = array(
    '#type' => 'textfield',
    '#default_value' => $saved['lightcolor'],
    '#size' => 8,
    '#maxlength' => 7,
    '#title' => t('Rollover color'),
    '#description' => t('Enter a hex value eg. for white enter <b>#FFFFFF</b>. (<em>lightcolor</em>)'),
  );
  $form['wijering_imagerotator']['appearance'] = array(
    '#type'  => 'fieldset',
    '#title' => t('Appearance'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  );
  $form['wijering_imagerotator']['appearance']['logo'] = array(
    '#type' => 'textfield',
    '#default_value' => $saved['logo'],
    '#title' => t('Logo URL'),
    '#description' => t('Full url to logo for a watermark, use PNG files for best results. (<em>logo</em>)'),
  );
  $form['wijering_imagerotator']['appearance']['overstretch'] = array(
    '#type' => 'select',
    '#default_value' => $saved['overstretch'],
    '#title' => t('Overstretch'),
    '#options' => $options['overstretch'],
    '#description' => t('Defines how to stretch images to fit the display. (<em>overstretch</em>)'),
  );
  $form['wijering_imagerotator']['appearance']['showicons'] = array(
    '#type' => 'select',
    '#options' => $options['bool'],
    '#default_value' => $saved['showicons'],
    '#title' => t('Show icons'),
    '#description' => t('Show status icons in display. (<em>showicons</em>)'),
  );
  $form['wijering_imagerotator']['playback'] = array(
    '#type'  => 'fieldset',
    '#title' => t('Playback'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  );
  $form['wijering_imagerotator']['appearance']['transition'] = array(
    '#type' => 'select',
    '#default_value' => $saved['transition'],
    '#options' => $options['transition'],
    '#title' => t('Transition effect'),
    '#description' => t('The way the photos change from one to another". (<em>transition</em>)'),
  );
  $form['wijering_imagerotator']['playback']['rotatetime'] = array(
    '#type' => 'textfield',
    '#default_value' => $saved['rotatetime'],
    '#size' => 5,
    '#maxlength' => 3,
    '#title' => t('Rotate time'),
    '#description' => t('Number of seconds between image rotations. (<em>rotatetime</em>)'),
  );
  $form['wijering_imagerotator']['playback']['shuffle'] = array(
    '#type' => 'select',
    '#options' => $options['bool'],
    '#default_value' => $saved['shuffle'],
    '#title' => t('Shuffle'),
    '#description' => t('Shuffle media randomly. (<em>shuffle</em>)'),
  );
  $form['wijering_imagerotator']['interaction'] = array(
    '#type'  => 'fieldset',
    '#title' => t('Interaction'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  );
  $form['wijering_imagerotator']['interaction']['enablejs'] = array(
    '#type' => 'select',
    '#options' => $options['bool'],
    '#default_value' => $saved['enablejs'],
    '#title' => t('Enable javascript'),
    '#description' => t('Enable javascript interaction with the flash player. (<em>enablejs</em>)'),
  );
  $form['wijering_imagerotator']['interaction']['link'] = array(
    '#type' => 'textfield',
    '#default_value' => $saved['link'],
    '#title' => t('Link URL'),
    '#description' => t('Web address linked to logo watermark. (<em>link</em>)'),
  );
  $form['wijering_imagerotator']['interaction']['linkfromdisplay'] = array(
    '#type' => 'select',
    '#options' => $options['bool'],
    '#default_value' => $saved['linkfromdisplay'],
    '#title' => t('Link from display'),
    '#description' => t('Link "Link URL" but with the whole display as the click area. (<em>linkfromdisplay</em>)'),
  );
  $form['wijering_imagerotator']['interaction']['linktarget'] = array(
    '#type' => 'select',
    '#default_value' => $saved['linktarget'],
    '#options' => $options['linktarget'],
    '#title' => t('Link target'),
    '#description' => t('Target of "Link URL". (<em>linktarget</em>)'),
  );
  $form['#tree'] = TRUE;
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save'),
  );
  return $form;
}

/*
 * Called by wijering_admin_form_submit()
 */
function _wijering_admin_form_submit($form_id, &$form_values) {
  // Flatten settings for saving
  $saved = array();
  foreach ($form_values AS $player => $settings) {
    $flat[$player] = array();
    if (is_array($settings)) {
      foreach ($settings AS $category => $vars) {
        $flat[$player] = array_merge($flat[$player], $vars);
      }
      variable_set('swftools_'. $player, $flat[$player]);
    }
  }

  // Clear caches
  cache_clear_all();
  cache_clear_all('*', 'cache_filter', TRUE);

}
