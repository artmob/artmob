<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="<?php print $language ?>" xml:lang="<?php print $language ?>">

<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
  <title><?php print $head_title ?></title>
  <?php print $head ?>
  <?php print $styles ?>
  <?php print $scripts ?>
  <script type="text/javascript"><?php /* Needed to avoid Flash of Unstyle Content in IE */ ?> </script>
</head>

<body id="<?php print $page_id; ?>" class="<?php print $section; ?>">
	<div id="outer">
	
		<div id='artmob-network'>
			<div id='artmob-networkBody'>
				<div id="artmob-network-img" title="Across The Artmob Network"></div>
				<?php print $artmob_network; ?>
			</div>
		</div>
		
		<div id="outer-container">
		<div id="container">
		
			<div id="header">
				<div id="logo">
					<?php if ($logo) { ?><a href="<?php print $base_path ?>" title="<?php print t('Home') ?>"><img src="<?php print $logo ?>" alt="<?php print t('Home') ?>" /></a><?php } ?>
					<?php /*?>	<?php if ($site_name) { ?><h1 class='site-name'><a href="<?php print $base_path ?>" title="<?php print t('Home') ?>"><?php print $site_name ?></a></h1><?php } ?>	<?php */?>
					<?php if ($site_slogan) { ?><div class='site-slogan'><?php print $site_slogan ?></div><?php } ?>
				</div>
				<div id='login-shell' class='login-shell'>
					<?php print $login // theme this? ?> 
				</div>
				<div id='menu-area'>
					<div id='primary-links-box'>
					<?php if (isset($primary_links)) { ?><?php print theme('links', $primary_links, array('class' =>'links', 'id' => 'navlist')) ?><?php } ?>
					</div>
				</div>
			</div>
			
			<div id='active-area'>
				<div id='top-border'></div>
				<table border="0" cellpadding="0" cellspacing="0" id="content">
					<tr>
						<?php if ($left_column) { ?>
						<td id="left-column">
							<?php print $left_column; ?>
						</td>
						<?php } ?>
					    <td valign="top" id='main'>
							<div id='main-top'>
								<div id='service-links'>
								<?php print $service_links ?>
								</div>
								<div id='breadcrumbs'>
									<?php print $breadcrumb; ?>
								</div>
							</div>
							<?php if ($above_title) { print $above_title; } ?>
							<?php if ($alt_title === TRUE) {
								print ("<div class='alt-title-block intro-block'>\n");
								print artmob_load_image($node); // loads thumbnail by default
								print ("<h1>{$title}</h1>\n");
								print ("</div>");
							} else if ($asset_title === TRUE) {
								print "<div class='asset-title-wrapper' id='asset-title-icon-" . strtolower($node->type) . "'>\n";
								print "<h1>" . $title . "</h1>\n";
								print "</div>";
							} else {
								print '<h1>' . $title . '</h1>';
							}
							
							if ($is_front) { 
								if ($mission) {
									print '<div id="mission">';
									print $mission;
									print '</div>';
								}
							}
							
							?>			
							<div id='content-area' class='content-area-<?php print $node->nid;?>'>
								<?php if ($above_content) { print $above_content; } ?>
								<div id='local-task-tabs' class="tabs"><?php print $tabs ?></div>
								<?php if ($subtitle) { print '<h2 class="subtitle">' . $subtitle . '</h2>';	} ?>
								<?php print $help ?>
								<?php print $messages ?>
								<?php print $content; ?>
								<?php if ($below_content) { print $below_content; } ?>
							</div>
					    </td>
						<td id="right-column">
							<?php print $right_column ?>
						</td>
				  </tr>
				</table>
			</div>
			
			<div id="footer">
				<?php print $footer ?>
				<?php print $footer_message ?>
			</div>
				
		</div>
		</div>

		<?php print $closure ?>
		
	</div>
</body>
</html>