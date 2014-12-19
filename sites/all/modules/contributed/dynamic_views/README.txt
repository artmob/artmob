$Id: README.txt,v 1.1.2.3 2007/07/28 19:23:44 sarvab Exp $

Description
-----------
Dynamic Views allows users to create dynamically updated content areas using
views. It provides the ability to combine block and page views along with
exposed filters to create dynamic pages that update without a page refresh.

Dependancies
-------------
Views

Installation
------------
Add to your modules directory and enable

Configuration
-------------
First you need to just setup a standard view

Use Case #1:
A teaser list of nodes in a pager-enabled-block showing up on the page view
with 1 Full Node setup

1. Enable the page-type for your view
2. Set the type of view to Dynamic Full Node
3. Set the # of Nodes Per Page to 1
4. Enable the block-type for the view
5. Set the type of view to Dynamic Teaser List
6. Set the # of Nodes Per Block to 3-4
7. Enable "[More] Link?"
8. Save view and go to admin/build/blocks
9. Enable Dynamic: your_view in a region of your choice and make sure its viewable on your view page
10. Go to your pages url and click on a node title in the block and watch it get updated in the main
    content area. You can also click your page #'s in the blocks pager and watch the block get updated
    with the new page.

Use Case #2:
Use an exposed filter in your view to dynamically update your content.

1. Enable the page-type for your view
2. Set the type of view to Dynamic Filter: Teaser/Full/List/Table
3. Expose a filter that will create a select list. (eg. Taxonomy terms, Content types)
4. Check "Force Single" and "Lock Operator"
5. Save view
6. Visit your view's url and click on a link in the newly created list of items that replaced your
   filter and watch the content update in response.



Future Enhancements
-------------------
* Easily turn on/off fancy jQuery effects

Cool Effects
------------
In order to achieve similar functionality to http://warnerbrosrecords.com/artists you can
combine this module with the jQuery interface slider plugin from http://interface.eyecon.ro/download.

Some extra javascript + styles will need to be used in order to set it up.

Todo
----
* Write up a howto to create a nice slider using jQuery interface slider
* Rewrite the exposed filters code so that it works with any type of exposed filter
* Allow dynamic blocks on their own without requiring a dynamic page as well.
* Instead of using extra view types to setup the dynamic functionality, add checkboxes to "make view dynamic"

Bugs/Features/Patches:
----------------------
If you want to report bugs, feature requests, or submit a patch, please do so
at the project page on the Drupal web site.
http://drupal.org/project/issues/dynamic_views

Author
------
Sarva Bryant
Mail: sarva@aliandesign.com
Website: http://aliandesign.com

