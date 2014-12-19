Node Relativity Module

Mark Howell (mark@nullcraft.org or javanaut on drupal.org)

Functional Description:

Simply put, this tool allows parent-child relationships between nodes to be
established, managed and searched. You can restrict the types of nodes that can
be parented and the ordinality of parents. These are used to contextually create
links to add new child nodes or attach existing ones. Some work is still
required for searching through large result sets, but this is a first stab at
getting this module working. Several user interface pieces still need work, but
it is functional for the most part. The only substantial feature that is missing
is the connected node search page.

My purpose for developing this tool was for a rapid application development
environment. Using this module in conjunction with flexinode and other existing
modules, I'm able to create very complex data models that can be changed with
minimal effort and no code. These structures can be navigated with relative ease
and lend themselves well to many of the types of projects that I'm faced with.
I'm already planning on using it for several projects coming up, and I'm not
even finished with it.


Technical Description:

This tool allows users to represent drupal nodes as Nodes in a Directed Graph.
The relations represent directed Edges connecting the nodes of the graph. This
allows very complex data structures to be created with relative ease, and those
data structures can be sorted, searched and traversed using various Graph
traversal algorithms.

I've created a recursive function that "walks" the graph starting from a node,
applying filtering rules for direction, distance and node type. It will return
an array of all connected nodes that meet the search criteria. I'm now working
on a query builder that lets you specify all of the search parameters.
Currently, this includes direction (follow parents, children or both), recursion
depth (how far from the starting node to search), end points (what types of
nodes to stop searching beyond) and avoidance points (what types of nodes to
avoid altogether).


Comparison:

A module that is similar to this one is the book module. A book could be seen as
a graph of nodes where the book module maintains the relations between them. It
is generally seen as unidirectional, but to a Graph theorist, looks fairly
similar. If a book-like construct were created using this tool, it could be
traversed in any direction. For instance, you could say: "show me all image
nodes in Chapter 3 of this book" and it would perform a depth-first-search
through all content in "Chapter 3" looking for image nodes. You could query for
"every filestore2 node within 6 pages of this one" for instance. Since the
underlying table structure of the book module is similar to this one, I might
port this search tool over to the book module if it turns out as pretty as I'm
hoping it will.


Real World Uses:

An example of how to use this module (that has several cleaner, though
context-specific solutions already) would be attaching image nodes to blog posts
(this example requires image module to already be installed). To do this, you
would:

1. Go to admin/settings/relativity and find the section for blog modules.

2. Select a "Parental Ordinality" of "none", as no other module will be
attaching blog posts to it.

3. Select from the "Attachment Options for blog nodes" list all of the types of
nodes that you want to allow users to attach to blog posts. In this example,
just choose image nodes.

4. Scroll to the configuration for image nodes and change the "Parental
Ordinality" to "any" if images can exist independently or be parented by
multiple blog nodes. In this example, "any", "one" or "one or more" will work.
The choice will restrict what links appear on the blog post. "attach exiting
image" won't appear as an option if image modules are limited to "one" parent,
for example.

5. Click "Save Configuration" at the bottom of the page.


I'll include other examples of how this could be useful and a real functional
description of all settings options and their meanings and consequences as time
permits. For now, I hope someone else finds this useful.

