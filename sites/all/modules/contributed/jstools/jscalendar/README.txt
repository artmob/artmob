Drupal jscalendar.module README.txt
==============================================================================

Produces DHTML popup calendars using the jscalendar library,

http://www.dynarch.com/projects/calendar/


Requirements
------------------------------------------------------------------------------
This module is written for Drupal 5.0.


Installation
------------------------------------------------------------------------------
Create a directory modules/jscalendar (or, for easy updating, 
modules/jstools/jscalendar) and copy all the module's files into it, as well 
as the folder 'lib' and its contents. Enable the module via the 
administer > modules page.


Developer usage
------------------------------------------------------------------------------

Adding to a textfield
----------------------

To include a jscalendar popup with a textfield, just add the class 'jscalendar':

  $form['date'] = array(
    '#type' => 'textfield',
    '#attributes' => array('class' => 'jscalendar'),
  );


Customization
----------------------

To change the default display and functionality of the calendar, set startup
parameters by adding selectors to your element. The three configurable options 
are 'ifFormat' (the format of the date/time written to the text field), 
'showsTime' (boolean: should time be displayed on the calendar), and 
'timeFormat' (values of '12' for 12-hour clock, which is the default, or '24'
for 24-hour clock).

Example:
  $form['date'] = array(
    '#type' => 'textfield',
    '#attributes' => array('class' => 'jscalendar'),
    // Use only year, month, and day in textfield.
    '#jscalendar_ifFormat' => '%Y-%m-%d',
    // Don't show time.
    '#jscalendar_showsTime' => 'false',
    // Show 24-hour clock.
    '#jscalendar_timeFormat' => '24',
  );


Localization
----------------------

Jscalendar comes with numerous localization files, see the /lib/lang directory.
By default, the module will look at the current Drupal $locale and load an
appropriate localization file, defaulting to 'en' for unsupported languages.
To explicitly set the localization file to be used, call jscalendar_load() with
your desired localization as the argument. Example:

jscalendar_load('it');