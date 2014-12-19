

jQ14('document').ready(function() {
	var vis = jQ14('#visualizations');
	
	if (vis.length > 0) {
		var legend = '<h2>Legend</h2><ul>';
		
		for (type in works) {
			legend += '<li><span style="font-weight: bold; color: ' + works[type].colour + '">' + type + ": " + works[type].type + " WORK</span></li>";
		}
		
		legend += "</ul>";
	
		vis.prepend(legend);
		artmob_visualization(audiomenu,'Audio');
		artmob_visualization(documentmenu,'Documents');
		artmob_visualization(imagemenu,'Images');
		artmob_visualization(videomenu,'Video');

	}

});

function artmob_visualization(menu,label) {
		
  var nestopt = jQ14('#nestingoptions');
  
  var output = '<h3>' + label + '</h3>';
	
	output += artmob_visualization_recursion(menu,artmob_visualize_branch)

	nestopt.append(output);


}

function artmob_visualization_display_option(opt) {

	var maj = opt.substr(0,1);
	var min = opt.substr(1,1);
	
	var majlabel = works[maj].type.toLowerCase();
	var minlabel = works[maj].values[min];
	
	var colour = works[maj].colour;
		
	return ("<span style='color: " + colour + "'>[" + opt + "] " + minlabel + '</span>');
}

function artmob_visualization_recursion(o,func,m,d) {
		var maxd = m == null ? 4 : m;
		var depth = d == null ? 1 : d;
		
		var output = '';
		if (depth <= maxd) {
			
			if (typeof o.options != "undefined") {
			
					// options that don't have a nested work tree must be merged into the tree property
					
					var branches = artmob_visualize_get_branches(o);
					
					if (branches != null) {
						for (branch in branches) {
							var branchopt = branches[branch];
							if (typeof o.tree == "undefined") {
								o.tree = new Object;
							}
							
							if (typeof o.tree[branchopt] == "undefined") {
								o.tree[branchopt] = new Object;
							}
						}
						
						// alphabetize
						
						var keys = new Array;
						
						for (index in o.tree) {
								if (index != "undefined") {
									keys.push(index);
								}
						}	
						
						keys.sort();
						
					//	console.log(keys);

						
						// process for output;
						output += "<ul>";
																		
						for (key in keys) {
							
							var prop = keys[key];
							var name = (typeof o.tree[prop].name == 'undefined') ? 'no branches' : o.tree[prop].name;
							output += "<li>";
							output += func.apply(func,[prop,name]);
							
							// recurse
							
							var origdepth = depth;
							
							if (typeof o.tree[prop].options != "undefined") {
								var x = artmob_visualize_get_branches(o.tree[prop]);
								output += " options: " + x.length;
								output += ", depth: " + depth;
								depth++;
								output += artmob_visualization_recursion(o.tree[prop],func,maxd,depth);
							} else if (typeof o.tree[prop].name != 'undefined') {
								//output += dump(o.tree[prop]);
							}
							
							depth = origdepth;
							
							output += "</li>";
						}
						
						output += '</ul>';
					
					}
			}
	 }
				
		return output;
}

function artmob_visualize_get_branches(o) {  // tree options must be assembled on the fly
	if (typeof o.options != "undefined") {
		var options = new Array;
		
		for (majopt in o.options) {
			for (minopt in o.options[majopt]) {
				options.push(majopt + minopt);
			}
		}
		return options;
	}
	
	return null;
}

function artmob_visualize_branch(prop,name) {		
	 var output = '';	
	// output += '<li>';
	 output += artmob_visualization_display_option(prop);
	 output += ' <span class="visbranchnames" style="color: #BBBBBB">(' + name + ')</span>';
//	 output += '</li>';
	 return output;
		
}