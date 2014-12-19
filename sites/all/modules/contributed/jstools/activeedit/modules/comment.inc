<?php
// $Id: comment.inc,v 1.2 2007/01/26 23:09:29 nedjo Exp $

/**
 * Implementation of hook_comment().
 */
function activeedit_comment(&$comment, $op) {
  static $output;

  switch ($op) {
    case 'view':
      if (comment_access('edit', $comment)) {
        $comment->comment .= activeedit_comment_data_form($comment);
      }
      break;
    case 'insert':
    case 'update':
      if ($key = $_REQUEST['activeedit_id'] && $type = $_REQUEST['activeedit_type']) {
        $null = NULL;
        $output = comment_render($null, $comment['cid']);
      }
      break;
    case 'activeedit':
      return $output;
      break;
  }
}

/**
 * Encode data on comments for reference by Javascript.
 */
function activeedit_comment_data_form($comment) {
  $form = '<form id="activeedit_comment_data_'. $comment->cid .'" class="activeedit-data">';
  $form .= '<input name="cid" type ="hidden" value="'. $comment->cid .'" />';
  $form .= '</form>';
  return $form;
}

/**
 * Implementation of hook_activeedit_elements().
 */
function comment_activeedit_elements($object = NULL) {
  $elements = array();
  // We only support comment editing if comments can be posted without preview.
  if (variable_get('comment_preview', COMMENT_PREVIEW_REQUIRED) == COMMENT_PREVIEW_OPTIONAL) {
    $elements['comment'] = array(
      '#selector' => 'div.comment',
      '#target' => 'comment/edit/*',
      '#id_field' => 'cid',
    );
    if (variable_get('comment_subject_field', 1) == 1) {
      $elements['comment']['comment_subject'] = array(
        '#title' => t('comment subject'),
        '#selector' => 'h3.title > a',
        '#submit_text' => t('Post comment'),
        '#form' => array(
          'comment_form' => array(
            array(
              'subject',
            ),
          ),
        ),
      );
    }
    $elements['comment']['comment_comment'] = array(
      '#title' => t('comment'),
      '#selector' => 'div.content > p',
      '#submit_text' => t('Post comment'),
      '#form' => array(
        'comment_form' => array(
          array(
            'comment_filter',
          ),
        ),
      ),
    );
  }
  // We generate content separately, on demand, to avoid unneeded processing.
  // Otherwise these calls would all be run on every page load.
  if (isset($_POST) && $_POST['activeedit_submit'] && $key = $_REQUEST['activeedit_id']) {
    $content = FALSE;
    switch ($key) {
      case 'comment_subject':
        $elements['comment'][$key]['#content'] = $object->subject;
        break;
      case 'comment_comment':
        $elements['comment'][$key]['#content'] = $object->comment;
        break;
    }
  }

  return $elements;
}

function user_activeedit_links() {
  $links = array();
  // We only support comment editing if comments can be posted without preview.
  if (variable_get('comment_preview', COMMENT_PREVIEW_REQUIRED) == COMMENT_PREVIEW_OPTIONAL) {
    $links['comment_new'] = array(
      '#title' => t('comment'),
      '#marker' => 'comment/reply',
      '#text' => t('Add new comment'),
      '#parent' => 'div.links',
      '#submit_text' => t('Post comment'),
      '#access' => user_access('post comments'),
      '#form' => array(
        'comment_form' => array(),
      ),
    );
    $links['comment_reply'] = array(
      '#title' => t('comment reply'),
      '#marker' => 'comment/reply',
      '#text' => t('reply'),
      '#parent' => 'div.links',
      '#submit_text' => t('Post comment'),
      '#access' => user_access('post comments'),
      '#form' => array(
        'comment_form' => array(),
      ),
    );
    // We generate content separately, on demand, to avoid unneeded processing.
    // Otherwise these calls would all be run on every page load.
    if (isset($_POST) && $_POST['activeedit_submit'] && $key = $_REQUEST['activeedit_id']) {
      $content = FALSE;
      switch ($key) {
        case 'comment_new':
        case 'comment_reply':
          $null = NULL;
          $content = activeedit_comment($null, 'activeedit');
          break;
      }
      if ($content) {
        $links[$key]['#content'] = $content;
      }
    }
  }
  return $links;
}