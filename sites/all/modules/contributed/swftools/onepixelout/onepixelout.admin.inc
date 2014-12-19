<?php
// $Id: onepixelout.admin.inc,v 1.1.2.8 2008/09/08 16:27:39 stuartgreenfield Exp $

/*
 * Called by onepixelout_admin_form()
 */
function _onepixelout_admin_form() {

  $saved = _onepixelout_settings('onepixelout_mediaplayer');
  $options = _swftools_options();

  $form = array();
/*
  $form['onepixelout_mediaplayer'] = array(
    '#type'  => 'fieldset',
    '#title' => t('Media Player Flashvars'),
    '#collapsible' => FALSE,
    '#collapsed' => FALSE,
    '#description' => 'These are the settings for '.
                       l('1 Pixel Out', 'http://jeroenonepixelout.com/extras/readme.html')
                       .' Flash MP3 player.',
  );
*/
  $form['onepixelout_mediaplayer']['autostart'] = array(
    '#type' => 'select',
    '#options' => array('yes' => 'yes', 'no' => 'no'),
    '#default_value' => $saved['autostart'],
    '#title' => t('Autostart'),
    '#description' => t('Automatically start playing the MP3. (<em>autostart</em>)'),
  );
  $form['onepixelout_mediaplayer']['loop'] = array(
    '#type' => 'select',
    '#options' => array('yes' => 'yes', 'no' => 'no'),
    '#default_value' => $saved['loop'],
    '#title' => t('Loop'),
    '#description' => t('Loop the sound file back to the beginning when done. (<em>loop</em>)'),
  );
  unset($saved['loop']);
  unset($saved['autostart']);
  foreach ($saved AS $key => $color) {
    $form['onepixelout_mediaplayer'][$key] = array(
      '#type' => 'textfield',
      '#default_value' => $color,
      '#size' => 8,
      '#maxlength' => 8,
      '#title' => t($key .' color'),
      '#description' => t('Hexadecimal color of the format 0xRRGGBB'),
    );
  }
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save'),
  );
  return $form;
}

/*
 * Called by onepixelout_admin_form_submit()
 */
function _onepixelout_admin_form_submit($form_id, &$form_values) {
  unset($form_values['op']);
  unset($form_values['submit']);
  unset($form_values['form_token']);
  unset($form_values['form_id']);
  variable_set('swftools_'. ONEPIXELOUT, $form_values);

  // Clear caches
  cache_clear_all();
  cache_clear_all('*', 'cache_filter', TRUE);

}
