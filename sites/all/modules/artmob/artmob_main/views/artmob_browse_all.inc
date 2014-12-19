<?php
  $view = new stdClass();
  $view->name = 'artmob_browse_all';
  $view->description = 'the main content browser';
  $view->access = array (
);
  $view->view_args_php = '';
  $view->page = TRUE;
  $view->page_title = 'Browse All Content';
  $view->page_header = '';
  $view->page_header_format = '1';
  $view->page_footer = '';
  $view->page_footer_format = '1';
  $view->page_empty = '';
  $view->page_empty_format = '1';
  $view->page_type = 'am_alphabet';
  $view->url = 'browse/content';
  $view->use_pager = FALSE;
  $view->nodes_per_page = '6';
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
    array (
      'type' => 'nodetype',
      'argdefault' => '1',
      'title' => 'Type %1',
      'options' => '',
      'wildcard' => 'all',
      'wildcard_substitution' => 'all',
    ),
    array (
      'type' => 'nodeletter',
      'argdefault' => '1',
      'title' => '',
      'options' => '1',
      'wildcard' => 'all',
      'wildcard_substitution' => 'all',
    ),
  );
  $view->field = array (
    array (
      'tablename' => 'node',
      'field' => 'title',
      'label' => '',
      'handler' => 'views_handler_field_nodelink',
      'options' => 'link',
    ),
  );
  $view->filter = array (
  );
  $view->exposed_filter = array (
  );
  $view->requires = array(node);
  $views[$view->name] = $view;



