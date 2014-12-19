jstools

README

Description
------------

Jstools is a collection of Javascript tools and libraries designed for
use with Drupal 5.0+. Each tool is delivered through a separate module.

Some jstools provide direct functionality on being enabled; others
provide tools that developers may use in module development.

Jstools meet the criterion of "graceful degradation" or "progressive 
enhancement"--that is, they contribute additional functionality to pages
that are fully usable without the javascript. All jstools attach behaviors
to page elements on the basis of CSS classes.

Developers are invited to contribute new tools meeting these criteria 
to the package.


Installation
------------

To install, you move this directory and all its subdirectories
to your /modules directory. Enable the jstools.module and any of the
other package tools you wish.