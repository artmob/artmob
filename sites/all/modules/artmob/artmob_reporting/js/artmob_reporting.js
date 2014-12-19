$(document).ready(function() {

       var commonTestData = [
          [[2.0, 1.0, 0.6], {label: 'A'}],
          [[2.4, 0.9, 2.0], {label: 'B'}],
        ];
        
        
        
    var distribution =  Drupal.parseJson(Drupal.settings.artmobreport.workdistribution);
    
	
	var worktypes = [];
	var colours = [];
	
	var subtypes = [];
	
	
	for(var prop in distribution) {
		type = distribution[prop].type;
		
		
		var dist = [];
		var sdist = []
				
		
		
		for (var val in distribution[prop].distribution) {
			dist.push(distribution[prop].distribution[val]);
		}
		
		for (var wval in works[type].values) {
			var params = {colour: works[type].colour, label: works[type].values[wval]}
			
			var count = distribution[prop].distribution[wval] != null ? distribution[prop].distribution[wval] : 0;
			
			sdist.push([count,params]);

		}
		
		subtypes.push({prop: prop,values: sdist});
				
		var row = [dist, {label: works[type].type, colour: works[type].colour,barLabel : distribution[prop].count + ' works'}];
			
		worktypes.push(row);
	}

	$('#reporting-work-distribution-graph').tufteBar({
          data: worktypes,
          barLabel: function(index) { return this[1].barLabel }, 
          axisLabel: function(index) { return this[1].label }, 
		  color:     function(i,stackedIndex) { 
          //  return [this[1].colour,'#DDDDDD'][stackedIndex % 2] || ['#E57536', '#82293B'][i % 2] 
            return this[1].colour|| ['#E57536', '#82293B'][i % 2] 
          }          

	});
	
	//alert($.dump(subtypes.length));
		
	for (var i=0; i<subtypes.length; i++) {
		var id = subtypes[i]['prop'];
		var values = subtypes[i]['values'];
		
		var wid = 'reporting-work-distribution-' + id;
		var gid = 'reporting-work-distribution-graph-' + id;
		$('#reporting-work-distribution').append("<div class='report-set' id='" + wid + "'><div id='" + gid + "'   class='graph' style='width:100%; height: 400px'></div></div>");
		
		$('#' + wid).prepend("<h2>Distribution within " + works[id].type.toLowerCase() + " works</h2>");
		
		$('#' + gid).tufteBar({
			  data: values,
			  axisLabel: function(index) { return this[1].label }, 
			  color:     function(i) { 
				return this[1].colour
			  }          
	
		});
	}
	
});