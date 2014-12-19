// $Id: ajaxsubmit.js,v 1.8.2.5 2008/04/14 16:10:31 nedjo Exp $

/**
 * Attaches the ajaxsubmit behaviour to forms.
 */
Drupal.behaviors.ajaxSubmit = function (context) {
  $('form.ajaxsubmit:not(.ajaxsubmit-processed)').each(function () {
    if (this.ajaxsubmit_target) {
      var target = this.ajaxsubmit_target.value;
    }
    else {
      var target = document.createElement('div');
      $(target).addClass('ajaxsubmit-message');
      $(this).before(target);
    }
    // Set a flag to indicate that the form is using ajaxsubmit.
    if (!this.ajaxsubmit) {
      var ajaxsubmitInput = document.createElement('input');
      $(ajaxsubmitInput)
        .attr('type', 'hidden')
        .attr('name', 'ajaxsubmit')
        .attr('value', '1');
      $(this).append(ajaxsubmitInput);
    }
    $(this).addClass('ajaxsubmit-processed');
    new Drupal.ajaxsubmit(this, target);
  });
};

/**
 * JS ajaxsubmit object.
 */
Drupal.ajaxsubmit = function (form, target) {
  this.target = target;
  this.form = form;
  Drupal.redirectFormSubmit($(form).attr('action'), form, this);
};

/**
 * Handler for the form redirection submission.
 */
Drupal.ajaxsubmit.prototype.onsubmit = function () {
  // Remove any error messages.
  var form = this.form;
  for (var i = 0; elt = form.elements[i]; i++) {
    $(elt).removeClass('error');
  }
  $(this.target).html('');
  // Insert progressbar.
  if (form.ajaxsubmit_progress) {

    // Success: redirect to the summary.
    var submitCallback = function (progress, status, pb) {
      if (progress == 100) {
        pb.stopMonitoring();
        window.location = '';
      }
    }

    // Failure: point out error message and provide link to the summary.
    var errorCallback = function (pb) {
      var div = document.createElement('p');
      $(div)
        .addClass('error')
        .html('An unrecoverable error has occured. You can find the error message below.');
      $('#progress').children(0).before(div);
      $('#wait').css('display', 'none');
 
    }
    this.progress = new Drupal.progressBar('updateprogress', submitCallback, HTTPPost, errorCallback);
    this.progress.startMonitoring(Drupal.url(form.ajaxsubmit_progress.value, 'form_id=' + form.form_id.value), 0);
  }
  else {
    this.progress = new Drupal.progressBar('ajaxsubmitprogress');
  }
  this.progress.setProgress(-1, 'submiting form');
  this.progress.element.style.width = '28em';
  this.progress.element.style.height = '200px';
  $(this.target).append(this.progress.element);
};

/**
 * Handler for the form redirection completion.
 */
Drupal.ajaxsubmit.prototype.oncomplete = function (data) {
  // Remove progressbar
  $(this.progress.element).remove();
  this.progress = null;
  $(this.target).html(data['message']);
  if (data['errors']) {
    for (id in data['errors']) {
      // edit[foo][bar] -> foo-bar
      $('#edit-' + id.replace('][', '-')).addClass('error');
    }
  }
  // Set preview.
  if (data['preview']) {
    $(this.target).html($(this.target).html() + data['preview']);
  }
  // Redirect.
  if (data['destination']) {
    window.location = Drupal.url(data['destination']);
  }
  Drupal.scrollTo(this.target);
  Drupal.attachBehaviors(this.target);
};

/**
 * Handler for the form redirection error.
 */
Drupal.ajaxsubmit.prototype.onerror = function (error) {
  // Remove progressbar
  $(this.progress.element).remove();
  this.progress = null;
  // Go to a designated error page, if any.
  var form = this.form;
  $(this.target).html(form.ajaxsubmit_error_message ? form.ajaxsubmit_error_message.value : 'An error occurred:<br /><br />'+ error);
  if (form.ajaxsubmit_error_redirect) {
    window.location.href = form.ajaxsubmit_error_redirect.value;
  }
};
