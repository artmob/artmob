<?php
// $Id: page-node-lightbox2.tpl.php,v 1.1.4.3 2008/06/11 22:16:56 snpower Exp $

/**
 * @file
 * Template file for displaying the node content, associated with an image, in
 * the lightbox.  It displays it without any sidebars, etc.
 */
?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<?php print $language ?>" lang="<?php print $language ?>">
  <head>
    <title><?php print $head_title ?></title>
    <?php print $head ?>
    <?php print $styles ?>
    <?php print $scripts ?>
    <style type="text/css" media="print">@import "<?php print base_path() . path_to_theme() ?>/print.css";</style>
    <!--[if lt IE 7]>
    <style type="text/css" media="all">@import "<?php print base_path() . path_to_theme() ?>/fix-ie.css";</style>
    <![endif]-->
  </head>
  <body>

    <div id="wrapper" style="background: transparent;">
    <div id="container" class="clear-block">

      <div id="center"><div id="squeeze"><div class="right-corner"><div class="left-corner">
<?php phptemplate_comment_wrapper(NULL, $node->type); ?>

<?php if ($page == 0): ?>
  <h2><a href="<?php print $node_url ?>" title="<?php print $title ?>"><?php print $title ?></a></h2>
<?php endif; ?>

    <?php print $content ?>

  <div class="clear-block clear">
    <div class="meta">
    <?php if ($taxonomy): ?>
      <div class="terms"><?php print $terms ?></div>
    <?php endif;?>
    </div>

    <?php if ($links): ?>
      <div class="links"><?php print $links; ?></div>
    <?php endif; ?>
  </div>

</div>
</div>
</div>
</div>
</div> <!-- close container -->
</div> <!-- close wrapper -->
</body>
</html>
