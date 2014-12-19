<?php

  $view = new stdClass();
  $view->name = 'frontpage';
  $view->description = 'The basic front page view.';
  $view->access = array (
);
  $view->view_args_php = '';
  $view->page = FALSE;
  $view->page_title = '';
  $view->page_header = '';
  $view->page_header_format = '1';
  $view->page_footer = '';
  $view->page_footer_format = '1';
  $view->page_empty = '';
  $view->page_empty_format = '1';
  $view->page_type = 'am_alphabet';
  $view->url = '';
  $view->use_pager = TRUE;
  $view->nodes_per_page = '10';
  $view->block = TRUE;
  $view->block_title = 'Recently in the archive';
  $view->block_header = '';
  $view->block_header_format = '1';
  $view->block_footer = '';
  $view->block_footer_format = '1';
  $view->block_empty = '';
  $view->block_empty_format = '1';
  $view->block_type = 'am_alphabet';
  $view->nodes_per_block = '40';
  $view->block_more = FALSE;
  $view->block_use_page_header = FALSE;
  $view->block_use_page_footer = FALSE;
  $view->block_use_page_empty = FALSE;
  $view->sort = array(
    array(
      'tablename' => 'node',
      'field' => 'title',
      'sortorder' => 'ASC',
      'options' => '',
    ),
    array(
      'tablename' => 'node',
      'field' => 'created',
      'sortorder' => 'DESC',
      'options' => 'normal',
    ),
  );
  $view->argument = array(
    array(
      'type' => 'node_feed',
      'argdefault' => '2',
      'title' => 'drupal - ',
      'options' => '',
      'wildcard' => '',
      'wildcard_substitution' => '',
    ),
  );
  $view->field = array(
    array(
      'tablename' => 'node',
      'field' => 'title',
      'label' => '',
      'handler' => 'views_handler_field_nodelink',
      'options' => 'link',
    ),
    array(
      'tablename' => 'node',
      'field' => 'created',
      'label' => '',
      'handler' => 'views_handler_field_date_small',
    ),
  );
  $view->filter = array(
    array(
      'tablename' => 'node',
      'field' => 'status',
      'operator' => '=',
      'options' => '',
      'value' => '1',
    ),
    array(
      'tablename' => 'node',
      'field' => 'type',
      'operator' => 'OR',
      'options' => '',
      'value' => array (
  0 => 'amAudio',
  1 => 'DigitizedWorks',
  2 => 'amPicture',
  3 => 'amVideo',
),
    ),
  );
  $view->exposed_filter = array(
  );
  $view->requires = array(node);
  $views[$view->name] = $view;
