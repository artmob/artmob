<div class="node<?php if ($sticky) { print " sticky"; } ?><?php if (!$status) { print " node-unpublished"; } if ($page==0) { print ' node-teaser ' . 'node-' . strtolower($node->type); } ?>">
	<div class="innernode <?php print ' innernode-' . strtolower($node->type);?>">
	<?php 
		if ($page == 0) { 
			print "<h2><a href='{$node_url}'>{$title}</a></h2>\n";	
		}
	?>
	
	<div class="content<?php print ' content-' . $node->type; print ' content-nid-' . $node->nid; ?> ">
		 <?php print $content?>
	</div>

	<div class='supplemental'>
		<?php if ($links) { ?>	<div class="links"><?php print $links?></div><?php }; ?>
		<?php if ($terms) { ?>	<div class="categories"><?php print $categories?></div><?php }; ?>
		<?php if ($submitted) {?><div class="submitted submitted-<?php print ' submitted-' . $node->type; ?>"><?php print $submitted;?></div><?php }; ?>
	</div>
	</div>
</div>