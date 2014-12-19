/**
 * Override the standard autocomplete searching to enable activeedit response to
 * no matches.
 */
if (Drupal.ACDB) {
  Drupal.ACDB.prototype.search = function (searchString) {
    var db = this;
    this.searchString = searchString;
  
    // See if this key has been searched for before
    if (this.cache[searchString]) {
      return this.owner.found(this.cache[searchString]);
    }
  
    // Initiate delayed search
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(function() {
      db.owner.setStatus('begin');
  
      // Ajax GET request for autocompletion
      $.ajax({
        type: "GET",
        url: db.uri +'/'+ Drupal.encodeURIComponent(searchString),
        success: function (data) {
          var elt = db.owner.input;
          if (data == '{  }' && db.searchString == searchString && elt.activeedit && confirm('No matches found. Create a new record?')) {
            var ac = Drupal.settings.activeedit.autocompletes[elt.activeedit];
            elt.uri = ac['#target'] + (Drupal.settings.cleanurls ? '?' : '&') + 'activeedit_id=' + elt.activeedit + '&activeedit_type=autocompletes&activeedit_transfer=' + Drupal.encodeURIComponent(searchString);
            Drupal.activeeditTrigger(elt);
          }
          // Parse back result
          var matches = Drupal.parseJson(data);
          if (typeof matches['status'] == 'undefined' || matches['status'] != 0) {
            db.cache[searchString] = matches;
            // Verify if these are still the matches the user wants to see
            if (db.searchString == searchString) {
              db.owner.found(matches);
            }
            db.owner.setStatus('found');
          }
        },
        error: function (xmlhttp) {
          alert('An HTTP error '+ xmlhttp.status +' occured.\n'+ db.uri);
        }
      });
    }, this.delay);
  }
}