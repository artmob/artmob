<?php
// $Id: flowplayer.admin.inc,v 1.1.4.4 2008/09/07 07:21:31 stuartgreenfield Exp $

function _flowplayer_admin_form() {

  $saved_settings = _flowplayer_settings(FLOWPLAYER_MEDIAPLAYER);

  // Flatten settings for convenience
  $saved = array();
  foreach ($saved_settings AS $category => $vars) {
    $saved = array_merge($saved, $vars);
  }
  $options = _flowplayer_options();

  $form = array();

    $form['flowplayer_mediaplayer'] = array(
    '#type'  => 'fieldset',
    '#collapsible' => FALSE,
    '#collapsed' => FALSE,
    '#description' => 'These are the settings for the FlowPlayer media player.
                      For details of what each parameter does refer to the '.
                      l('FlowPlayer documentation', 'http://flowplayer.org/player/configuration.html')
                      .'. It is possible that you do not need to change any of
                      these settings and blank values will defer to friendly
                      defaults. Note that the label in (<em>brackets</em>)
                      is the configuration setting name and corresponds to the documentation page.
                      If content is embedded using the SWF Tools filter then each parameter
                      can be over-ridden by specifying a new value in the filter string.'
    );

  $form['flowplayer_mediaplayer']['appearance']['player'] = array(
    '#type' => 'select',
    '#default_value' => $saved['player'],
    '#title' => t('FlowPlayer to use'),
    '#options' => $options['player'],
    '#description' => t('Defines which FlowPlayer to use.'),
  );
  $form['flowplayer_mediaplayer']['appearance']['usePlayOverlay'] = array(
    '#type' => 'select',
    '#default_value' => $saved['usePlayOverlay'],
    '#title' => t('Overlay play control'),
    '#options' => $options['bool'],
    '#description' => t('Show a play button at the start of the playlist. (<em>usePlayOverlay</em>)'),
  );
  $form['flowplayer_mediaplayer']['appearance']['hideControls'] = array(
    '#type' => 'select',
    '#default_value' => $saved['hideControls'],
    '#title' => t('Hide controls'),
    '#options' => $options['bool'],
    '#description' => t('Hide the player controls and progress bar. (<em>hideControls</em>)'),
  );
  $form['flowplayer_mediaplayer']['appearance']['controlBarGloss'] = array(
    '#type' => 'select',
    '#default_value' => $saved['controlBarGloss'],
    '#title' => t('Control bar gloss'),
    '#options' => $options['controlBarGloss'],
    '#description' => t('Choose the level of \'gloss\' to apply to the control bar. (<em>controlBarGloss</em>)'),
  );
  $form['flowplayer_mediaplayer']['appearance']['showFullScreenButton'] = array(
    '#type' => 'select',
    '#default_value' => $saved['showFullScreenButton'],
    '#title' => t('Show full screen button'),
    '#options' => $options['bool'],
    '#description' => t('Show a button on the player to allow full screen mode. (<em>showFullScreenButton</em>)'),
  );
  $form['flowplayer_mediaplayer']['appearance']['showPlayListButtons'] = array(
    '#type' => 'select',
    '#default_value' => $saved['showPlayListButtons'],
    '#title' => t('Show playlist buttons'),
    '#options' => $options['bool'],
    '#description' => t('Show previous/next buttons when playing a playlist. (<em>showPlayListButtons</em>)'),
  );
  $form['flowplayer_mediaplayer']['playback']['autoPlay'] = array(
    '#type' => 'select',
    '#options' => $options['bool'],
    '#default_value' => $saved['autoPlay'],
    '#title' => t('Autoplay'),
    '#description' => t('Automatically start playing the media. (<em>autoPlay</em>)'),
  );
  $form['flowplayer_mediaplayer']['playback']['loop'] = array(
    '#type' => 'select',
    '#default_value' => $saved['loop'],
    '#title' => t('Loop'),
    '#options' => $options['bool'],
    '#description' => t('Set whether the media repeats after completion. (<em>loop</em>)'),
  );
  $form['flowplayer_mediaplayer']['playback']['initialVolumePercentage'] = array(
    '#type' => 'textfield',
    '#default_value' => $saved['initialVolumePercentage'],
    '#size' => 8,
    '#maxlength' => 3,
    '#title' => t('Volume'),
    '#description' => t('Starting volume of the player. (<em>initialVolumePercentage</em>)'),
  );

  $form['#tree'] = TRUE;
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save'),
  );
  return $form;

}

/*
 * Called by flowplayer_admin_form_submit()
 */
function _flowplayer_admin_form_submit($form_id, &$form_values) {
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
