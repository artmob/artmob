<?php

function artmob_regions() { 
	$regions = array(
		'artmob_network'	=> 'artmob network bar',
		'above_content'		=> 'above the content area',
		'content' 			=> 'main content area',
		'below_content'		=> 'below the content area',
		'masthead'			=> 'masthead',
		'left_column' 		=> 'left column',
		'right_column'		=> 'right column',
		'footer'  			=> 'footer area',
		'above_title'		=> 'above the page title'
	);

	return $regions;
	
}

/**
 * Override or insert PHPTemplate variables into the templates.
----------------------------------------------------------------
 * Now emulates Drupal 6 methodology. Use _preprocess functions
 * below to make variable adjustments to the page, node and block
 * templates.
 *
 */
 
function _phptemplate_variables($hook, $vars) {

  $vars['show_artmob_summary'] = array('digitizedworks','ampicture','audio','video');  // TO DO: select through content_types at some point.

  $function = 'phptemplate_preprocess_'. str_replace('-', '_', $hook);
  
  if (function_exists($function)) {
    $function($vars);
  }
  
  return $vars;
  
}

function phptemplate_preprocess_page(&$vars) {

	global $user;
        //remove the has been deleted messages
        $messages = $vars['messages'];
        $pos = strrpos($messages, "has been deleted");

        if ($pos === false) { // note: three equal signs
            // do nothing
        } else {
          //Should clear the messages
          //This didn't do it
          //unset( $vars['messages'] );
          //This does
          $vars['messages'] = '';
        }
	$node = &$vars['node'];

	$vars['scripts'] .= "\n" . '<script src="' . base_path() . path_to_theme() . '/scripts/rollover.js" type="text/javascript"></script>';
	$vars['scripts'] .= "\n" . '<script src="' . base_path() . path_to_theme() . '/scripts/artmob_theme.js" type="text/javascript"></script>';
	$vars['styles'] .= "\n" . '<style type="text/css" media="all">@import "'. base_path() . path_to_theme() . '/local/css/local.css";</style>' ."\n";
	$vars['styles'] .= "\n" . '<style type="text/css" media="all">@import "'. base_path() . path_to_theme() . '/contentlayout/css/style.css";</style>' ."\n";
	$vars['styles'] .= '<!--[if lte IE 6]>' . "\n" . '<style type="text/css" media="all">@import "'. base_path() . path_to_theme() . '/style-ie.css";</style>'. "\n" . '<script type="text/javascript" src="' . base_path() . path_to_theme() . '/scripts/pngfix/pngfix.js"></script>' . "\n<![endif]-->\n\n";
	$vars['styles'] .= '<!--[if IE 7]>' . "\n" . '<style type="text/css" media="all">@import "'. base_path() . path_to_theme() . '/fix-ie-7.css";</style>'. "\n<![endif]-->";
	$vars['styles'] .= theme('artmob_build_icon_styles');
	$vars['login'] = $user->uid > 0 ? theme('artmob_logged_in',$user) : theme('artmob_log_in');
	$vars['alt_title'] = artmob_display_alt_title($node);
	$vars['asset_title'] = in_array(strtolower($node->type),$vars['show_artmob_summary']) ? TRUE : FALSE;
	
	$local_logo_src = base_path() . path_to_theme() . "/local/logo.png";
	
	if (file_exists($_SERVER{'DOCUMENT_ROOT'} . $local_logo_src)) {
		$vars['logo'] = $local_logo_src;
	}


	$sections = array (
		'about',
		'articles',
		'browse',
		'exhibits',
		'links',
		'news'
	);

	$args = explode('/',$_REQUEST['q']);

	if (in_array($args[0],$sections) || $args[0] == 'admin' || $args[2]

	== 'edit' || $args[1] == 'add') {
		$vars['section'] = $args[0];
	} else {
		$vars['section'] = 'general_page';
	}		
	
	
	
	if ($node) {
		$vars['page_id'] = "page-" . $node->nid;
	} else {
		$vars['page_id'] = urlencode($vars['title']);
	}
	
	$vars['is_admin'] = in_array('admin', $user->roles);
	$vars['logged_in'] = ($user->uid > 0) ? TRUE : FALSE;

	return $vars;

}

function phptemplate_preprocess_node(&$vars) {

	if ($vars['page'] === TRUE) {
	
		if (in_array(strtolower($vars['type']),$vars['show_artmob_summary'])) { 
			// suppress images (a ham-fisted approach for now) - change in illustration module at some point?
			$vars['content'] = ereg_replace('class="image image-thumbnail "','class="image image-thumbnail" style="display:none"',$vars['content']);
			$vars['artmob_summary'] = theme('artmob_summary',$vars['node']);
			
		}
	}

	return $vars;
}

function phptemplate_preprocess_block(&$vars) {
     
    $vars['block_id'] = $vars['block']->module . '-' . $vars['block']->delta;
    
    return $vars;

}




/* Artmob Results Browser and Themes
----------------------------------------------------------
   key function to handle results from all node arrays,
   with associated themes.  phptemplate_display_results_page
   overrides display module pagination theme.
   
*/

function phptemplate_artmob_media_browse_menu($links=NULL) {  

	$asset_links = artmob_media_build_asset_browser_array();
	
	$path = base_path() . path_to_theme() . "/images/icons/";
	
	$model_str = "<li  class='browse-%s-link'><img class='asset-icon' src='%s' alt='%s'/><a href='%s' class='browse-%s-link'>%s</a></li>";  
	/*$model_str = "<li  class='browse-%s-link'><a href='%s' class='browse-%s-link'>%s</a></li>";*/
	
	$content = '<div class="browse_assets_menu"><ul>';
	
	foreach ($asset_links as $asset_type => $asset_link) {
		if ($asset_link['display']) {
			$content .= sprintf($model_str,$asset_type,$path . $asset_link['icon'],$asset_link['label'],$asset_link['link'],$asset_type,$asset_link['label']);
			/*$content .= sprintf($model_str,$asset_type,$asset_link['link'],$asset_type,$asset_link['label']);*/
		}
	
	}
	
	$content .= '</ul></div>';

	return $content;
}


function artmob_results_browser (&$nodes,$source=NULL) {   // DEPRECATED

	switch ($source) {
		case 'views':
			$nodes = artmob_load_views_nodes($nodes);
			break;
		default:
			break;
	}
	
	if (!is_array($nodes)) {
		return ("No results found");
	}
	
	$items = array();
	
	foreach ($nodes as $nid=>$node) {
		$items[] = node_view($node,TRUE,FALSE,FALSE);
	}

	$core_content = display_paginate_items($items,6);
		
	return theme_artmob_results_browser($core_content);
}


function theme_artmob_results_browser($content) {   // DEPRECATED
	$output = "<div class='results-browser' id='results-browser'>\n";
	$output .= $content;
	$output .= "\n</div>";


	return $output;
	
}


/* Artmob Load Views Nodes
----------------------------------------------------------
   abstraction layer to take views results and return
   them as a results browser
*/


function phptemplate_amMain_display($view, $nodes, $type, $teasers = FALSE, $links = TRUE) {

    $view_css = views_css_safe("browser-view-block-$view->name");
    $content = '';
    $content .= theme( "amMain_pager", $view, $_GET['q'] );
   	$content .= "<div class='$view_css'>";
  	$content .= artmob_results_browser($nodes,'views');
   	$content .= "</div>";
    return $content;
	 
}

/* Artmob Load Views Nodes
----------------------------------------------------------
   abstraction layer to take views nodes array and
   return loaded nodes keyed by nid
*/


function artmob_load_views_nodes($nodes) {  

	foreach($nodes as $node) {
		$lnodes[$node->nid] = node_load($node->nid);		
	}
	
	return is_array($lnodes) ? $lnodes : FALSE;

}


function theme_artmob_node_page(&$node,$type=NULL,$precontent=NULL,$postcontent=NULL) {
	
	// $content .= check_markup( $node->body, $node->HTMLBodyFormat, FALSE );
		
	$content .= check_markup($node->body, $node->format, FALSE);
	
	return ($precontent . $content . $postcontent);

}


function theme_artmob_node_teaser(&$node,$type=NULL,$curatorial_note=NULL) {
	
	if ($type != 'audio') {   // weird. audio files have duplicate teasers. must troubleshoot.
		$content = $node->teaser;
	}
	
	return $content;

}

/*
   Content Overrides: Teasers
   ---------------------------------------------------------------------------
*/

function phptemplate_DigitizedWorks_basic_view_teaser( &$node, $page ){

	return (theme('artmob_node_teaser',$node,'DigitzedWorks'));
}

function phptemplate_amPicture_basic_view_teaser( &$node, $page ){

	return (theme('artmob_node_teaser',$node,'amPicture'));
}


function phptemplate_audio_teaser($node){  // TO DO: this creates a redundant teaser. why?
  return (theme('artmob_node_teaser',$node,'audio'));
}


// may be redundant;

// function phptemplate_image_teaser($node) {
// 
//     return (theme('artmob_node_teaser',$node,'image'));
//   
//   //return l(image_display($node, IMAGE_THUMBNAIL), 'node/'. $node->nid, array(), NULL, NULL, TRUE, TRUE);
// }
// 
// /**
//  * Theme a body
//  */
// function phptemplate_image_body($node, $size) {
//   return image_display($node, $size);
// }


/*
   Content Overrides: Pages
   ---------------------------------------------------------------------------
*/


function phptemplate_DigitizedWorks_basic_view_page( &$node, $page ){
	return theme('artmob_node_page', $node, 'DigitizedWorks');
}

function phptemplate_amPicture_basic_view_page( &$node, $page ){
	
	$output = artmob_load_image($node,'large',TRUE);	
	$output .= "<div class='picture-caption'><p>Click image to enlarge</p></div>";

	return theme('artmob_node_page', $node,'amPicture',$output);
}



/* Artmob Load Image
----------------------------------------------------------
   abstraction layer to load various images
*/


function artmob_load_image(&$arg,$size=NULL,$thickbox=FALSE) {

	if (is_object($arg) && $arg->iid) { // content node provided
		$node = node_load($arg->iid); 
	} else if (is_integer($arg)) {  // iid provided
		$node = node_load($arg);
	} else {
		return NULL;
	}
	
		
	$size = $size ? $size : IMAGE_THUMBNAIL;
	
	
	$image = image_display($node,$size);
	
	if ($thickbox === TRUE) {		
		return l($image, file_create_url($node->images['_original']), array('title' => $title, 'class' => 'thickbox', 'rel' => $node->type), NULL, NULL, FALSE, TRUE);
		
	}

	
	return $image;
}


/* Artmob Alternate Title
----------------------------------------------------------
   checks vocabulary to display alternate page titling on page.
   returns true or false.
   
   TO DO: make this part of the "display" module - and configurable
   through form_alter on individual node entry pages (rather than through
   vocabs);
   
*/

function artmob_display_alt_title(&$node,$tid=115) {
	
	if (!is_object($node->taxonomy[$tid])) { return FALSE; }

	if ($node->taxonomy[$tid]->name == "Yes") {
		return TRUE;
	}
	
	return FALSE;

}




function phptemplate_similarterms($nodes) {
  $related = array();

  if (!empty($nodes)) {
    foreach ($nodes as $node) {
      $lnode = node_load($node->nid);
      
      $related[] = array(
      	'title' => $lnode->title,
      	'href' =>"node/{$lnode->nid}",
      	'attributes' => array('title'=>$lnode->teaser)
      	);
            
      //$output .= node_view($lnode,TRUE,FALSE,FALSE);
    }    
  }
  return theme('links',$related,'related-links');
}

function phptemplate_breadcrumb($breadcrumb) {

	if (!$breadcrumb) {
		return (l('Home','<front>'));
	}

 	$nid = arg(1);
//
	$vars = array('nid'=>$nid);
  $divider = '<div class="breadcrumbs-dividers"> / </div>';
	return implode($divider,$breadcrumb);

}	

function phptemplate_menu_local_tasks() {
  $output = '';

  if ($primary = menu_primary_local_tasks()) {
    $output .= "<ul id ='menu-local-tasks' class=\"tabs primary\">\n" . $primary . "</ul>\n";
  }
  if ($secondary = menu_secondary_local_tasks()) {
    $output .= "<ul  id ='menu-local-tasks-2' class=\"tabs secondary\">\n" . $secondary . "</ul>\n";
  }

  return $output;
}


/* Alphabet Browser Content-Type Tabs
----------------------------------------------------------
   TO DO: make tabs identical to existing system tabs
   
*/


function phptemplate_amMain_nodetype_tabs( $view ){
  $holder = '';

  $arguments = amMain_get_last_2_args( $last_arg, $type );
  $TypesArray = array();
  $TypesArray  = amMain_get_view_type_nodes();

// --- Now build the tabs ---
	$result .= '<div class="tabs"><ul class="tabs primary">';
  foreach ($TypesArray as $typename=>$typedesc){
    $href = $view->url.'/'.$typename.'/'.$last_arg;
    if ($type == $typename){
      $result .= '<li class="active">'.l( $typedesc,$href, array( 'class' => 'active' ) ).'</li>';
    } else {
      $result .= '<li>'.l( $typedesc,$href, array( 'class' => 'active' ) ).'</li>';
    }
	}
  $result .= '</ul></div>';

  return $result;
}


function phptemplate_menu_links($links) {
	
  if (!count($links)) {
    return '';
  }
  $level_tmp = explode('-', key($links));
  $level = $level_tmp[0];
  $output = "<ul class=\"links-$level\">\n";
  foreach ($links as $index => $link) {
    $output .= '<li';
    if (stristr($index, 'active')) {
      $output .= ' class="active"';
    }
    if (strpos($link['title'], '<img') === 0) {
      $output .= ">". l($link['title'], $link['href'], $link['attributes'], $link['query'], $link['fragment'], FALSE, TRUE) ."</li>\n";
    }
    else {
        $output .= ">". l($link['title'], $link['href'], $link['attributes'], $link['query'], $link['fragment']) ."</li>\n";
    }
  }
  $output .= '</ul>';

  return $output;
}


function phptemplate_upload_attachments($files) {
  $header = array(t('Files Available for Download'), t('Size'));
  $rows = array();
  
  $icon_path = base_path() . path_to_theme() . '/images/icons';

  
  foreach ($files as $file) {
  
    $file = (object)$file;
    if ($file->list && !$file->remove) {

      $type = array_pop(explode('.',$file->filepath));


      $href = file_create_url((strpos($file->fid, 'upload') === FALSE ? $file->filepath : file_create_filename($file->filename, file_create_path())));
      $text = $file->description ? $file->description : $file->filename;
      $icon = sprintf("<img src='%s' height='22' width='22' alt='%s' class='download-icon' />","{$icon_path}/icon-fileformat_{$type}.png",$text);      
      $rows[] = array(l($icon . $text, $href,array(),NULL,NULL,FALSE,TRUE), format_size($file->filesize));
    }
  }
  if (count($rows)) {
    return theme('table', $header, $rows, array('id' => 'attachments'));
  }
}



/* Masthead Menu: Primary Links
----------------------------------------------------------
*/
function theme_artmob_primary_links(&$primarylinks) {

	/* figure out active page. will be replaced by proper sectioning */
	
	$arg0 = arg(0);
	$arg1 = arg(1);
	
	$href_test = "{$arg0}/{$arg1}";  // a little cheesey
		
	//drupal_set_message(devtools_dump($primarylinks));

    $output = '';
    $theme_path = base_path() . path_to_theme();
    $masthead_path = "{$theme_path}/images";
        
    foreach ($primarylinks as $aInfo) {     
        $title = strtolower($aInfo['title']);
        $alt = strtolower($aInfo['title']);
        $image_name = strtolower($aInfo['title']);
   //     $state = ($image_name == strtolower($section)) ? "down" : "up";
        $state = up;
        
       	if ($href_test == $aInfo['href']) {
       		$state = 'down';
       	} else {
       		$state = 'up';
       	}

        
        $href = drupal_get_path_alias($aInfo['href']) ; // ??
        
        $href = $href == '<front>' ?  drupal_lookup_path($href) : $href; // don't know why <front> is aliased out above...

        
		//$output .= "<a href='/{$href}' title='{$title}'><img src='images/header_{$image_name}_{$state}.jpg' alt='{$alt} link' /></a>";
		$output .= "<a href='/{$href}' title='{$title}'><img src='{$theme_path}/local/images/masthead/header_{$title}_{$state}.jpg' alt='{$alt}' /></a>";
    }
    
    return $output;
    
				
}

function theme_artmob_log_in() {
	$imgpath = base_path() . path_to_theme() . "/images";
	$signin_img = sprintf('<img src="%s" alt="%s" width="14" height="16" />',"{$imgpath}/header_sign-in_up.png",'log in');
	
	
	//$output .= '<div class="login-status">' . l($signin_img,"user/login",array('title'=>'sign in'),null,null,false,true) .'</div>';
	$output .= '<div class="login-username">' . l('Sign In',"user/login") .'</div>';
	$output .= '<div class="login-usermessage"></div>';
	
	return $output;
}

function theme_artmob_logged_in(&$oUser) {

	$imgpath = base_path() . path_to_theme() . "/images";
	$signinx_img = sprintf('<img src="%s" alt="%s" width="14" height="16" />',"{$imgpath}/header_sign-inx_up.png",'log in');
	$signout_img = sprintf('<img src="%s" alt="%s" width="14" height="16" />',"{$imgpath}/header_sign-out_up.png",'log out');
	

	//$output .= '<div class="login-status">' . l($signinx_img,"logout",array('title'=>'log out'),null,null,false,true) .'</div>';
	//$output .= '<div class="login-status" id="login-icon">' . l($signout_img,"user/{$oUser->uid}",array('title'=>'go to my profile'),null,null,false,true) .'</div>';
	$output .= '<div class="login-username">'. l(ucfirst($oUser->name),"user/{$oUser->uid}") . '</div>';
	$output .= '<div class="login-usermessage">Welcome</div>';
	
	return $output;
}

function theme_artmob_news_basic_view( &$node ){
	$content .= "<h2>" . l($node->title,"node/{$node->nid}") . "</h2>";
	if ($iid = $node->iid) {
		$image = node_load($iid);		
		$content .= sprintf('<div class="image-attach-body"><img src="%s" alt="%s"  class="image main" /></div>',base_path() . file_directory_path() . '/' . $image->images['main'],$image->title);	
	}

	$content .= check_markup($node->body,$node->format,FALSE);
	
	return $content;

}

function theme_artmob_read_more_teaser(&$node) {
	
	$imgpath = base_path() . path_to_theme() . "/images";

	$output .= "<div class='read-more-teaser read-more-node-{$node->nid}'>\n";
	$output .= l("Read Full Story <img src='{$imgpath}/more_teaser_up.png' alt='read more' />","node/{$node->nid}",array(),null,null,false,true);
	$output .= "</div>";
	
	return $output;

}

function theme_artmob_block_read_more(&$block) {
    // temporary solution
    
    $block_ids = array (
        'views-news_feed' => 'news',
        'views-recent_articles' => 'articles',
        'event-1' => 'events',
        'audio-1' => 'audio'
    );
    
    $image_ids = array (
        'views-news_feed' => 'story',
        'views-recent_articles' => 'articles',
        'event-1' => 'events',
        'audio-1' => 'audio'
    );

    $id = $block->module .'-'. $block->delta;
    
    if (!array_key_exists($id,$block_ids)) {
        return;
    }
    
    $moreimg = sprintf("<img src='%s' alt='view more' class='more-icon' />", base_path() . path_to_theme() . '/images/more_' . $image_ids[$id] . '_up.png');
    $link = l("More" . $moreimg,$block_ids[$id],array(),null,null,false,true);

    return ("<div class='block-read-more'>" . $link . "</div>");

}

function theme_artmob_read_more(&$node) {

	$model = "<img src='%s' alt='%s' />";
	$link = "node/{$node->nid}";
	$img = base_path() . path_to_theme() . "/local/images/widgets/btn_readmore_up.png";
	
	$output .= "<div class='read-more'>";
	$output .= l(sprintf($model,$img,'read more'),$link,array('class'=>'read-more-link'),NULL,NULL,FALSE,TRUE);
	$output .= "</div>";
	
	return $output;

}

function theme_artmob_more_link($path) {
	//$image = sprintf("<img src='%s' width='31' height='7' alt='view more' />",base_path() . path_to_theme() . '/images/widgets/more_up.gif');
	$link = l("More",$path,array(),NULL,NULL,FALSE,TRUE);
	
	return ("<div class='more'>" . $link . "</div>\n");

}

function phptemplate_amMain_alphabet_bar_tabs ( $view ){
	$result = '';
/* for now we are disabling the alpha tabs - JA - July 23 2009

  $imgpath = base_path() . path_to_theme() . "/local/images/general";
  $alphabet = 'abcdefghijklmnopqrstuvwxyz';
  
  $result .= "<div class='alphabrowser'>\n";
  $result .= '<table class="tab-alphabet" cellspacing="0" cellpadding="0">';
  $row = '';
  $count = count($view->argument);
  $holder = '';

  //When in an alphabetical view the last argument
  //is always the alphabet so when we find the last
  //argument we concatenate the ones before it onto it.
  //The second last argument is always the type.
  //Therefore the alphabet bar concatenates $view->url, $type, and the alphabet letter.
  
  $arguments = amMain_get_last_2_args( $last_arg, $type );
  //$views_params = amMain_get_views_params();

  for ($i = 0; $i < strlen($alphabet); $i++ ){
  
	$az_imgup = sprintf('<img src="%s" alt="%s" />',"{$imgpath}/az-" . $alphabet[$i] . "_up.jpg",$alphabet[$i]);
	$az_imgover = sprintf('<img src="%s" alt="%s" />',"{$imgpath}/az-" . $alphabet[$i] . "_over.jpg",$alphabet[$i]);

	$img_model = ($alphabet[$i] == $last_arg) ? $az_imgover : $az_imgup;

//  $header .= '<th width = "23"></th>';
    $row .= '<td class="az-type1">'.l( $img_model, $view->url.'/'.$type.'/'.$alphabet[$i],array(),NULL,NULL,FALSE,TRUE)."</td>\n";
  }
  
  	$az_digits_imgup = sprintf('<img src="%s" alt="%s" />',"{$imgpath}/az-0-9_up.jpg","#");
  	$az_digits_imgover = sprintf('<img src="%s" alt="%s" />',"{$imgpath}/az-0-9_over.jpg","#");
  	$az_all_imgup = sprintf('<img src="%s" alt="%s" />',"{$imgpath}/az-all_up.jpg","All");
  	$az_all_imgover = sprintf('<img src="%s" alt="%s" />',"{$imgpath}/az-all_over.jpg","All");
  	

	$az_digits_img_model = ($last_arg === '0') ?   $az_digits_imgover : $az_digits_imgup;
	$az_all_img_model = ($last_arg === 'all') ?   $az_all_imgover : $az_all_imgup;

//  $header .= '<th width = "25"></th>';
    $row .= '<td class="az-type2">'.l( $az_digits_img_model, $view->url.'/'.$type.'/0',array(),NULL,NULL,FALSE,TRUE ). "</td>\n";
//  $header .= '<th width = "31"></th>';
    $row .= '<td class="az-type3">'.l( $az_all_img_model, $view->url.'/'.$type.'/all',array(),NULL,NULL,FALSE,TRUE ). "</td>\n";
	
  $result .= '<tr>'.$row.'</tr>';
  $result .= '</table>';
  $result .= "</div>";
*/
	if ( variable_get('use_tabs_'.$view->vid, 1 ) ){
    $result .= theme( 'amMain_nodetype_tabs', $view );
  }
  
  return $result;
}

function theme_artmob_build_icon_styles() {
		
		$cssmodel = ".view .node-teaser .innernode-%s, .item-page .node-teaser .innernode-%s, #asset-title-icon-%s { background-image:url('%s/local/images/icons/icon-asset_%s.png'); }\n";
		
		$dbquery = db_query("SELECT DISTINCT type FROM {node_type}");
			
		$output .= "\n" . '<style type="text/css" media="all">';
		
		while ($typeobj = db_fetch_object($dbquery)) {
			$type = strtolower($typeobj->type);
			$output .= sprintf($cssmodel,$type,$type,$type,base_path().path_to_theme(),$type);
		}
		
		$output .= "\n</style>\n";
		
		return $output;
	

}

function theme_artmob_random_picture() {
	$dbquery = db_query("SELECT nid FROM {node} WHERE type='amPicture' ORDER BY RAND() LIMIT 1");
	
	$qobj = db_fetch_object($dbquery);
	
	if (!is_object($qobj)) {
		return ("<p>No images available</p>");
	}
		
	$node = node_load($qobj->nid);
	
	
	$output .= artmob_load_image($node,'preview');
	
	return (l($output,"node/{$node->nid}",array('title'=>$node->title),NULL,NULL,FALSE,TRUE));
}

/**
 * Display a view.
 */
function phptemplate_views_view($view, $type, $nodes, $level = NULL, $args = NULL) {
  $num_nodes = count($nodes);

  if ($type == 'page') {
    drupal_set_title(views_get_title($view, 'page'));
    views_set_breadcrumb($view);
  }

  if ($num_nodes) {
    $output .= views_get_textarea($view, $type, 'header');
  }

  if ($type != 'block' && $view->exposed_filter) {
    $output .= views_theme('views_display_filters', $view);
  }

  $plugins = _views_get_style_plugins();
  $view_type = ($type == 'block') ? $view->block_type : $view->page_type;
  if ($num_nodes || $plugins[$view_type]['even_empty']) {
    if ($level !== NULL) {
      $output .= "<div class='view-summary ". views_css_safe('view-summary-'. $view->name) ."'>". views_theme($plugins[$view_type]['summary_theme'], $view, $type, $level, $nodes, $args) . '</div>';
    }
    else {
      if ( $view->type == 'am_alphabet' ){
        $output .= views_theme($plugins[$view_type]['theme'], $view, $nodes, $type);
      } else {
        $output .= "<div class='view-content ". views_css_safe('view-content-'. $view->name) ."'>". views_theme($plugins[$view_type]['theme'], $view, $nodes, $type) . '</div>';
      }
    }
    $output .= views_get_textarea($view, $type, 'footer');

    if ($type == 'block' && $view->block_more && $num_nodes >= $view->nodes_per_block) {
      $output .= theme('views_more', $view->real_url);
    }
  }
  else {
    $output .= views_get_textarea($view, $type, 'empty');
  }

  if ($view->use_pager) {
    $output .= theme('pager', '', $view->pager_limit, $view->use_pager - 1);
  }

  if ($output) {
    if ( $view->type == 'am_alphabet' ){
      //$output = $output; //Do Nothing
    } else {
      $output = "<div class='view ". views_css_safe('view-'. $view->name) ."'>$output</div>\n";
    }
  }

  return $output;
}

function phptemplate_artmob_exhibit_landing_page($content_array = array()) {
  $blocks = array();
  if (count($content_array) == 0) {
    $content .= '<p>No exhibits are currently available.</p>';
  } 
  else {
    foreach ($content_array as $node) {
        $blocks[] =  node_view($node, TRUE, FALSE);
    }
    
    $content = display_columnize($blocks,2,'exhibit-table');
  }
  return $content;
}

function phptemplate_artmob_exhibit_teaser_view($nodes, $exhibit_node, $page) {
	$content = '';
  $content .= "<h3 class='exhibit-teaser-title'>" . l($exhibit_node->title,"node/{$exhibit_node->nid}") . "</h3>";
  $content .= theme('artmob_exhibit_list_curators', artmob_exhibit_list_curators($exhibit_node));
  $content .= theme('theme_artmob_exhibit_show_exhibit_date', $exhibit_node);
  $content .= $exhibit_node->teaser;
  $content .= "<div class='exhibit-read-more'>" . l("View exhibit page","node/{$exhibit_node->nid}") . "</div>";
  
  return $content;
}



