<?php
// $Id: swftools_integrate.admin.inc,v 1.1.2.5 2008/08/08 22:37:23 stuartgreenfield Exp $

function _swftools_integrate_admin_form() {

  $form = array();

  $form['swftools_integrate'] = array(
    '#type'  => 'fieldset',
    '#title' => t('SWF Tools Integration Options'),
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
//    '#description' => '',
  );
  $file_types = array(
    'img' => 'Images',
    'mp3' => 'Audio (MP3)',
    'flv' => 'Flash video (FLV)',
    'swf' => 'SWF files (SWF)',
  );
  $form['swftools_integrate']['swftools_integrate_render_upload'] = array(
    '#type' => 'select',
    '#default_value' => variable_get('swfintegrate_render_upload', array()),
    '#title' => t('Render Attachments'),
    '#description' => t('Automatically show attachments in a media player,
                         attachments are files attached to a node using
                         Upload module.'),
    '#options' => $file_types,
    '#multiple' => TRUE,
  );
  return $form;
}
