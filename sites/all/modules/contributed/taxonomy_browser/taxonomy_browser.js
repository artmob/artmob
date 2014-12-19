/* $Id: taxonomy_browser.js,v 1.1.2.2 2008/08/14 14:27:13 nancyw Exp $ */

function taxonomy_browser_count_nodes_handler(event) {
  // Disable "Show unused" if not counting.
  if ($("input[@name=taxonomy_browser_count_nodes]:checked").val() == 1) {
    $("input[@name=taxonomy_browser_show_unused]").removeAttr("disabled");
  }
  else {
    $("input[@name=taxonomy_browser_show_unused]").attr("disabled", "disabled");
  }
}

function taxonomy_browser_collapse_handler(event) {
  // Disable "Show unused" if not counting.
  if ($("input[@name=taxonomy_browser_select_type]:checked").val() == 1) {
    $("input[@name=taxonomy_browser_collapse]").removeAttr("disabled");
  }
  else {
    $("input[@name=taxonomy_browser_collapse]").attr("disabled", "disabled");
    $("input[@name=taxonomy_browser_collapse]").val(0);
  }
}

// Run the javascript on page load.
if (Drupal.jsEnabled) {
  $(document).ready(function () {
  // On page load, determine the default setting of "taxonomy_browser_show_unused".
  taxonomy_browser_count_nodes_handler();
  taxonomy_browser_collapse_handler();

  // Bind the function to click events on "taxonomy_browser_count_nodes".
  $("input[@name=taxonomy_browser_count_nodes]").bind("click", taxonomy_browser_count_nodes_handler);
  $("input[@name=taxonomy_browser_select_type]").bind("click", taxonomy_browser_collapse_handler);
  });
}