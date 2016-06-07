if (Drupal.jsEnabled){
  $(document).ready(function(){
    $('#edit-current-exhibit').change( function(){
      var num_selected = $('#edit-current-exhibit').val();
      $.get('/content/exhibit/current/' + num_selected, null );
      return false;
    });
    $('#edit-current-exhibit').click( function(){
      $.get('/content/exhibit/current_node', null, function(data) {
        var result = Drupal.parseJson(data);
        var nid = result['nid'];
        var num_selected = $('#edit-current-exhibit').val();
        $(".am-curator").attr({'href': 'node/' + nid + '/Curator/note/' + num_selected});
      });
      $.get('/content/exhibit/current/' + num_selected, null );
      return false;
    });
    $('a.am-bookmark-unmark').click( function(){
     	$('a.am-bookmark-unmark').hide(); //fadeOut('slow');
     	$('a.am-bookmark-mark').fadeIn('slow');
      $.get(this.href,null);
      return false;
    });
    $('a.am-bookmark-mark').click( function(){
     	$('a.am-bookmark-mark').hide(); //fadeOut('slow');
     	$('a.am-bookmark-unmark').fadeIn('slow');
      $.get(this.href,null);
      return false;
    });
  });
}
