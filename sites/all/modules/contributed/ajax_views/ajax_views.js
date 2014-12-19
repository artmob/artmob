
/**
 * Fetches the new page and puts it inline.
 * @param id 		- The element id whose contents will get replaced
 * @param viewUrl	- The URL for the new page
 * @param page		- The page number to request 
 */
function fetchPage(id, viewUrl, page) {
	$.get(viewUrl, {page: page}, function(data, status) {
		$(id).html(data);
	});
	return false;
}