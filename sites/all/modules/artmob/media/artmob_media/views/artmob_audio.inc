<?php
  $view = new stdClass();
  $view->name = 'artmob_audio';
  $view->description = 'Creates the audio page.';
  $view->access = array (
);
  $view->view_args_php = '';
  $view->page = TRUE;
  $view->page_title = '';
  $view->page_header = '';
  $view->page_header_format = '1';
  $view->page_footer = '';
  $view->page_footer_format = '1';
  $view->page_empty = '';
  $view->page_empty_format = '1';
  $view->page_type = 'am_alphabet';
  $view->url = 'media/audio';
  $view->use_pager = FALSE;
  $view->nodes_per_page = '10';
  $view->sort = array (
    array (
      'tablename' => 'node',
      'field' => 'title',
      'sortorder' => 'ASC',
      'options' => '',
    ),
    array (
      'tablename' => 'node',
      'field' => 'created',
      'sortorder' => 'ASC',
      'options' => 'normal',
    ),
  );
  $view->argument = array (
  );
  $view->field = array (
  );
  $view->filter = array (
    array (
      'tablename' => 'node',
      'field' => 'status',
      'operator' => '=',
      'options' => '',
      'value' => '1',
    ),
    array (
      'tablename' => 'node',
      'field' => 'type',
      'operator' => 'OR',
      'options' => '',
      'value' => array (
  0 => 'audio',
),
    ),
  );
  $view->exposed_filter = array (
  );
  $view->requires = array(node);
  $views[$view->name] = $view;

