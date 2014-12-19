function clear_exhibit_browser() {

  $.get('/exhibit/current_session/0', function(data) { location.reload(); } );
 
}

