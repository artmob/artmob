  <div class="comment<?php if ($comment->status == COMMENT_NOT_PUBLISHED) print ' comment-unpublished'; ?>">
    <?php if ($picture) {
    print $picture;
  } ?>
<h3 class="title"><?php print $title; ?></h3><?php if ($new != '') { ?><span class="new"><?php print $new; ?></span><?php } ?>
    <div class="submitted"><?php print "Submitted by " . $comment->name . ' on ' . format_date($comment->timestamp, 'custom', 'F j, Y \a\t g:i a'); ?></div>
    <div class="content"><?php print $content; ?></div>
    <?php if($links) { ?><div class="links"><?php print $links; ?></div><?php } ?>
  </div>
