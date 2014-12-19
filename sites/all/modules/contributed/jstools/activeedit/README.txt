Drupal activeedit.module README.txt
==============================================================================

Provides Ajax-based in place editing and content creation.

Activeedit includes three distinct behaviours:

1. in place editing.

Editable elements get a clickable button next to them. Clicking brings up an in
place form for editing the single field. Submit, and the updated data are
rendered back in place.

Technical details: Implemented through hook_activeedit_elements(), which returns
an array of elements to attach behaviors to. Elements are identified by their
jQuery selectors, which can be specified by theme (see files in the /themes
directory). 

2. load forms from links

Links, e.g., the "Add new comment" link for nodes, are clickable to load a form (in
this case, the comment add form). Submit and the new item is rendered.

Technical details: Implemented through hook_activeedit_links(), which returns
an array of links to attach behaviors to. Elements are identified by their
text and path elements (e.g., 'comment/reply' for comments).

3. autocomplete add new record

When there are no matches found for an autocomplete, the user is given the option of
adding a new record. We load a form in place to add a new record. The new record
is assigned the value that was entered but not found in the autocomplete.

There is also a fourth behaviour that's been sketched in but is not ready yet:

4. edit buttons panel

When hovering over an editable item (e.g., a node), a panel appears with 
buttons/elements for accomplishing common tasks, e.g., promote/unpromote,
make sticky, etc.


Requirements
------------------------------------------------------------------------------
This module is written for Drupal 5.0+ and requires the jstools and formfilter
modules o be enabled.

Implementation details
------------------------------------------------------------------------------
The approach is different from most in place editing implementations. Activeedit
uses a helper module, Formfilter, to fetch altered versions of the original
forms. That is, when we want to change a setting (e.g., the site name), we fetch
the appropriate settings form via--but alter it so it has only the field we
need. Then we submit that form via AJAX to its normal path.

The key advantage is that we can don't need to reinvent. Permissions/access
issues are already handled. We can use the original forms so we don't need to
replicate them.

Developer Usage
-----------------------------------------------------------------------------

New activeedit behaviours can be easily attached to page elements through
implementations of three activeedit hooks: hook_activeedit_elements() (for
page elements to make editable); hook_activeedit_links() (for links to bring
up forms for adding items); and hook_activeedit_autocompletes() (for 
autocomplete elements to enable new item adding for.

See the include files in the 'modules' directory of the activeedit module
for sample implementations.

Theme support for in place editing
----------------------------------

Activeedit is theme-dependent in that the Javascript needs to be able to
identify which elements to attach to.

Elements are identified by jQuery selectors, see

http://www.jquery.com/DOM/Traversing/Selectors

Each element is given a default selector, but individual themes may or may not
have the same HTML structure as the default.

To add support for a theme, you need to write a themename.inc file and put it
in the module's theme directory (where themename is the name of the theme). 
See existing theme include files for examples.

The items in a theme .inc file represent those elements that have a different
selector in the theme than the default.

The helper module activeedit_theme_assist is available for generating a stub
theme include file. This module is not included in the stable release of
jstools but is in CVS in the activeedit directory. Install the module and 
visit admin/settings/activeedit_theme_assist to get a stub include file
plus some basic instructions.


