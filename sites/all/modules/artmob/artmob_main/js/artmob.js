var jQ14 = jQuery; // creates new jQuery 1.4 object
jQuery.noConflict(true); // restores to drupal standard

jQ14('document').ready(function() {
	// modify text for standard drupal items.
	jQ14('#edit-status-wrapper').append('<div class="description">Publishing a work will make it visible to users who are browsing the archive.</div>');
	jQ14('#node-form .authored legend').html('Input Information');
  jQ14('.node-form #edit-name-wrapper label').html('Input by');
	jQ14('.node-form #edit-date-wrapper label').html('Input on');
});


var am_works = {
  
    "A"  :  {
      'type' : "LITERARY",
      'id' : "dt-literary-work",
      'colour' : '#cba200',
      'values' : {
        'a' : "Literary Work",
        'b' : "Literary Compilation"
        },
      'help' : {
        'a' : "For example, a literary work might contain illustrations or photographs created by someone other than the author.",
        'b' : "A literary compilation such as an edited collection, pamphlet, or program may contain individual literary works written by different authors, and may incorporate illustrations and photographs that have been licensed for inclusion, but have their own distinct rights holders."
        },
      'keyroles' : {
        'a' : ["A01","B01","B06","B24","B98"],
        'b' : ["A01","B01","B06","B24","B98"]
        },
      'otherroles' : {
        'a' : ["B21","B09","A24","A15","A11"],
        'b' : ["A24","A15","B04","B05","B21","B09","B16","A11"]
        },
      'keyfields' : {
        'a' : ["subtitle","publication_publisher_name","number_of_pages","edition","features_and_distinctions","date_first_published","date_published","date_created"],
        'b' : ["subtitle","publication_publisher_name","number_of_pages","edition","features_and_distinctions","date_first_published","date_published","date_created"]
        },
      'otherfields' : {
        'a' : ["publication_imprint_name","series_title","series_number","series_year","series_description","edition","set_title","set_item_number"],
        'b' : ["publication_imprint_name","series_title","series_number","series_year","series_description","edition","set_title","set_item_number"]
        }
     },
     "B" :  {
      'type' : "DRAMATIC",
      'id' : "dt-dramatic-work",
      'colour' : '#df5998',
      'values' : {
        'a' : "Choreographed Work",
        'b' : "Play/Format/Script/Screenplay",
        'c' : "Film(Cinema/TV Show/Documentary/Animation/Found Footage)",
        'd'	: "Dramatic Compilation"
      },
      'help' : {
        'a' : "A choreographed work might be derived from a literary work, a musical composition, or be the notation or fixation of an original dance or dramatic performance.",
        'b' : "A play, format, script or screenplay may be adapted from a literary work, or be derived from a musical composition, recording, or compilation (for example, the original screenplay for a musical based on previously composed or recorded music, including an album).",
        'c' : "A film may incorporate musical recordings  a musical compilation, and/or visual artistic works. The film may also be based on a literary work, or on a dramatic work such as a play, script or screenplay and will likely contain dramatic performances.",
      	'd'	: "A dramatic compilation may include underlying dramatic works, visual artistic works, musical recordings or compilations, and/or dramatic or musical performances."
      },
      'keyroles' : {
        'a' : ["D04","D05"],
        'b' : ["A01","A39","A03","B06","B05","B22","B24","E10","F04"],
        'c' : ["D02","D01","F04","F02","F05","F06","F99"],
        'd'	: ["C01","C99","D04"]
        },
      'otherroles' : {
        'a' : ["D01","Z99"],
        'b' : ["E04","Z99"],  
        'c' : ["Z99"],
        'd' : ["D05","D06","D99","F03"]

        },
      'keyfields' : {
        'a' : ["subtitle","edition","features_and_distinctions","publication_publisher_name","date_published","date_created"],
        'b' : ["subtitle","edition","features_and_distinctions","publication_publisher_name","date_first_released","date_published","date_first_published","date_created"],
        'c' : ["subtitle","date_first_released","date_created"],
        'd' : ["subtitle"],
        },      
      'otherfields' : {
        'a' : ["date_first_published","publication_imprint_name","series_title","series_number","series_year","series_description","edition","set_title","set_item_number","edition","features_and_distinctions","publisher_name"],
        'b' : ["publication_imprint_name","series_title","series_number","series_year","series_description","edition","set_title","set_item_number","number_of_pages"],
        'c' : ["date_broadcast","series_title","series_number","series_year","series_description","edition","set_title","set_item_number"],
        'd' : ["date_performed","date_recorded","date_broadcast","series_title","series_number","series_year","series_description","features_and_distinctions"],
        }

     },
     "C" :  {
      'type' : "MUSICAL",
      'id' : "dt-musical-work",
      'colour' : '#00a9d0',
      'values' : {
        'a' : "Musical Composition",
        'b' : "Musical Recording",
        'c' : "Musical Compilation"
      },
      'help' : {
        'a' : "A musical composition may incorporate a literary work such as lyrics or poetry, or be derived from a libretto or literary work.",
        'b' : "A musical or sound recording captures the performance of a musical composition or compilation, or records audio of voices and/or other natural or original sounds.",
        'c' : "A musical compilation will usually include underlying musical compositions, recordings, and performances, and may incorporate literary works such as lyrics or liner notes, and visual artistic works such as photographs."
      },
      'keyroles' : {
        'a' : ["B25","A06","A05","A04"],
        'b' : ["B25","F07"],
        'c' : ["A06","A05","A04","B25","C01","C02","E09"],

        },
      'otherroles' : {
        'a' : ["Z99"],
        'b' : ["B29","D01","F03","F04","Z99"],
        'c' : ["E10","F07","Z99"]

        },
      'keyfields' : {
        'a' : ["subtitle","publication_publisher_name","date_first_released","date_first_published","date_broadcast","date_created"],
        'b' : ["subtitle","features_and_distinctions","date_first_released","date_recorded","date_performed","date_created","set_title","set_item_number"],
        'c' : ["subtitle","date_published","date_recorded","date_created"]
        },      
      'otherfields' : {
        'a' : ["publication_imprint_name","edition","features_and_distinctions","series_title","series_number","series_year","series_description","edition","set_title","set_item_number","date_published","date_performed"],
        'b' : ["date_broadcast","series_title","series_number","series_year","series_description"],
        'c' : ["date_broadcast","date_first_published","date_first_released","date_performed","features_and_distinctions","publication_imprint_name","publication_publisher_name","series_description","series_number","series_title","series_year","set_title","set_item_number"]
        }
     },
     "D" :  {
      'type' : "VISUAL ARTISTIC",
      'id' : "dt-visual-artistic-work",
      'colour' : '#a7d000',
      'values' : {
        'a' : "Photograph",
        'b' : "Painting",
        'c' : "Drawing",
        'd' : "Engraving",
        'e' : "Sculpture",
        'f' : "Architectural Work",
        'g' : "Map/Plan/Chart",
        'h' : "Artistic Compilation",
        'i' : "Design"
      },
      'help' : {
        'a' : "A photograph may be derived from or depict another visual artistic work such as a painting, drawing, engraving, sculpture, architectural work, design, map, plan or chart, or may capture a dramatic or musical performance.", //"Help text for Photograph",
        'b' : "A painting may be derived from or depict an original visual artistic work such as a photograph, sculpture, or architectural work.", //"Help text for Painting",
        'c' : "A drawing may be derived from or depict an original visual artistic work such as a sculpture or architectural work.", //"Help text for Drawing",
        'd' : "An engraving may be derived from or depict an original visual artistic work such as a sculpture or architectural work.", //"Help text for Engraving",
        'e' : "A sculpture may be derived from or depict an original visual artistic work such as a photograph or architectural work.", //"Help text for Sculpture.",
        'f' : "An architectural work may be derived from a map, plan or chart.", //"Help text for Architectural Work.",
        'g' : "A map, plan or chart may be derived from an architectural work.", //"Help text for Map/Plan/Chart.",
        'h' : "An artistic compilation may incorporate a combination of individual visual artistic works such as photographs, drawings, or paintings.",
        'i' : "", //"Help text for design."
      },
      'keyroles' : {
        'a' : ["A08"],
        'b' : ["A07"],
        'c' : ["A07"],
        'd' : ["A41","A07","A12"],
        'e' : ["A42","A07"],
        'f' : ["A43","A44","A08","A12"],
        'g' : ["A46","A11"],
        'h' : ["A41","A42","A43","A44","A46","B01","A24","A23"],
        'i' : ["A11","B26","B27"]
        },
      'otherroles' : {
        'a' : ["Z99"],
        'b' : ["Z99"],
        'c' : ["Z99"],
        'd' : ["Z99"],
        'e' : ["Z99"],
        'f' : ["Z99"],
        'g' : ["B24","Z99"],
        'h' : ["B24","C01","C02","Z99"],
        'i' : ["A36","A44","Z99"]
        },
      'keyfields' : {
        'a' : ["subtitle","date_created"],
        'b' : ["subtitle"],
        'c' : ["subtitle"],
        'd' : ["subtitle"],
        'e' : ["subtitle"],
        'f' : ["subtitle"],       
        'g' : ["subtitle"],
        'h' : ["subtitle"],
        'i' : ["subtitle"]
        },      
      'otherfields' : {
        'a' : ["date_first_published","date_first_released","date_published","edition","features_and_distinctions","publication_imprint_name","series_title","series_number","series_year","series_description","set_title","set_item_number"],
        'b' : ["date_first_released","features_and_distinctions","series_title","series_number","series_year","series_description","set_title","set_item_number"],
        'c' : ["date_first_published","date_first_released","date_published","edition","features_and_distinctions","publication_imprint_name","series_title","series_number","series_year","series_description","set_title","set_item_number"],
        'd' : ["date_first_published","date_first_released","date_published","edition","features_and_distinctions","publication_imprint_name","series_title","series_number","series_year","series_description","set_title","set_item_number"],
        'e' : ["date_first_released","edition","features_and_distinctions","series_title","series_number","series_year","series_description","set_title","set_item_number"],
        'f' : ["date_first_released","features_and_distinctions","series_title","series_number","series_year","series_description"],       
        'g' : ["date_first_published","date_first_released","date_published","edition","features_and_distinctions","series_title","series_number","series_year","series_description","set_title","set_item_number"],
        'h' : ["date_first_published","date_first_released","date_published","edition","features_and_distinctions","number_of_pages","publication_imprint_name","publisher_name","series_title","series_number","series_year","series_description","set_title","set_item_number"],
        'i' : ["date_first_published","date_first_released","date_published","features_and_distinctions","series_title","series_number","series_year","series_description","set_title","set_item_number"]
        }

     },
     "E" :  {
      'type' : "PERFORMANCE",
      'id' : "dt-performance",
      'colour' : '#ff7800',
      'values' : {
        'a' : "Performance"
      },
      'help' : {
        'a' : "A performance will often involve the interpretation of a literary, dramatic, or musical work."
      },
      'keyroles' : {
        'a' : ["E01","E02","A07","E03","E99","E05","E06","E10","A24","D03","E12","A11","B26","D02","D04","B27","B28","B29","B30"],
        },
      'otherroles' : {
        'a' : ["E09","F06","F07","D05","D06","F04","F01"],
        },
      'keyfields' : {
        'a' : ["date_broadcast","subtitle","features_and_distinctions","date_recorded","date_performed"],
      },      
      'otherfields' : {
        'a' : ["series_title","series_number","series_year","series_description","edition"],
        'b' : []
        }
     }
  };


jQ14(document).ready( function() {
  var i=0;
  jQ14('#asset-title-icon-ampicture').css('background-image','none');
  jQ14('#asset-title-icon-amvideo').css('background-image','none');
  jQ14('#asset-title-icon-amaudio').css('background-image','none');
  jQ14('#asset-title-icon-digitizedworks').css('background-image','none');

  jQ14('.worktype-swop').each(function() {
    var wt = jQ14(this).html();

    var type = wt.substr(0,1);
    var key = wt.substr(1,2);

    if (typeof am_works[type] != "undefined") {
      jQ14(this).html(am_works[type].values[key]);
    }
  });

  jQ14('.results-browser').each(function(){
    var browserclass = jQ14(this).parent('div').attr('class');
    //add the '.' in front to match the cookie saved in am_fetchPage_plus
    browserclass = '.'+ browserclass;
    var cookie_serialized = am_get_cookie ( browserclass );
    if (cookie_serialized != null) {
    	var cookie_unserialized = cookie_serialized.split('|');
   	  am_fetchPage_plus.apply( this, cookie_unserialized );
   	}
    //am_fetchPage_plus.apply(this,[".browser-view-block-front-page","/artmob_main/views/all/all","2","title","DESC","ASC","thumbnails","front_page"] );

  });

});



//artmob browser functions

function rb_pageflip(op, page) {

  var pagecount = document.getElementById('rb-page-count').value;
  var itemcount = document.getElementById('rb-item-count').value;

  // hide all panels

    var elem = document.getElementById('results-browser').childNodes;

    for(var i = 0; i < elem.length; i++) {
      if (elem[i].className == "item-page") {
      elem[i].style.display = "none";
    }
    }

    var nextPage = (page == pagecount) ? 1 : (page + 1);
    var prevPage = (page == 1) ? pagecount : page - 1;

    var nelem = document.getElementById('item-page-' + nextPage);
    var pelem = document.getElementById('item-page-' + prevPage);

    if (op == 'next') {
      nelem.style.display = 'block';
    }

    if (op == 'prev') {
      pelem.style.display = 'block';
    }
}


/**
 * Fetches the new page and puts it inline.
 * @param id    - The element id whose contents will get replaced
 * @param viewUrl - The URL for the new page
 * @param page    - The page number to request
 */
function am_fetchPage(id, viewUrl, page) {
  jQ14.get(viewUrl + '/'+ page, {page: page}, function(data, status) {
   jQ14(id).html(data);
  }); 
  return false;
}

function am_fetchPage_plus(id, viewUrl, page, sort, sortorder_date, sortorder_title, view_by, view_name) {
  //string arguments together with |
  var cookie_params = '';
  for (var i=0; i<arguments.length;i++){
    cookie_params = cookie_params + arguments[i] + '|';
  }
  am_set_cookie( id, cookie_params );
  /*
  jQ14.get(viewUrl + '/'+ page + '/' + sort + '/' + sortorder_date + '/' + sortorder_title + '/' + view_by + '/' + view_name, {page: page, sort: sort, sortorder_date: sortorder_date, sortorder_title: sortorder_title, view_by: view_by, view_name: view_name}, function(data, status) {
  jQ14(id).html(data);
  });*/
  
   
  jQ14.ajax({
    url: viewUrl + '/'+ page + '/' + sort + '/' + sortorder_date + '/' + sortorder_title + '/' + view_by + '/' + view_name,
    type: 'GET',
    data: {page: page, sort: sort, sortorder_date: sortorder_date, sortorder_title: sortorder_title, view_by: view_by, view_name: view_name},
    timeout: 1000,
    error: function(){
       // alert('Error loading results');
    },
    success: function(data){
    		//alert (dump(data));
        if (data != null) {
        	jQ14(id).html(data);
        }
    }
	});
  return false;
}

function am_set_cookie ( name, value, exp_y, exp_m, exp_d, path, domain, secure )
{
  var cookie_string = name + "=" + escape ( value );

  if ( exp_y )
  {
    var expires = new Date ( exp_y, exp_m, exp_d );
    cookie_string += "; expires=" + expires.toGMTString();
  }

  if ( path )
        cookie_string += "; path=" + escape ( path );

  if ( domain )
        cookie_string += "; domain=" + escape ( domain );

  if ( secure )
        cookie_string += "; secure";

  document.cookie = cookie_string;
}
function am_get_cookie ( cookie_name )
{
  var results = document.cookie.match ( '(^|;) ?' + cookie_name + '=([^;]*)(;|$)' );

  if ( results )
    return ( unescape ( results[2] ) );
  else
    return null;
}
