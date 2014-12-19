  var debug = false; 
  
  var cid; // top level citation ID
  var worksmodel;
  var worksmenumodel;
  var addworkmodel;
  var nonestedworks;
  var ffcontributors;
  var ffinfofields;
  var datewidget;
  var existingreport;
  var ffaddnewcontributor;
  var emptytitleplaceholder;

  var contributorscache = null;

  var globalcontribfromcache = false;

  var wrapping_box = '#fair-dealing-wrapper';  // div to build menus

	/* fieldattr and fieldtypes are deprecated variables */
  var fieldattr = ["access","after_build","ahah","attributes","autocomplete_path","button_type","collapsed","collapsible","cols","default_value","delta","description","disabled","element_validate","executes_submit_callback","field_prefix","field_suffix","maxlength","method","multiple","name","options","parents","post_render","prefix","pre-render","process","required","resizable","return_value","rows","size","src","submit","suffix","theme","title","tree","validate","value","weight"];

  var fieldtypes = { // cf. http://api.drupal.org/api/drupal/developer--topics--forms_api_reference.html/6
    "textfield"   : ["access","after_build","ahah","attributes","autocomplete_path","default_value","description","disabled","element_validate","field_prefix","field_suffix","maxlength","parents","post_render","prefix","pre-render","process","required","size","suffix","theme","title","tree","weight"],
    "textarea"    : ["access","after_build","ahah","attributes","cols","default_value","description","disabled","element_validate","parents","post_render","prefix","pre-render","process","required","resizable","rows","suffix","theme","title","tree","weight"],
    "select"      : ["access","after_build","ahah","attributes","default_value","description","disabled","element_validate","multiple","options","parents","post_render","prefix","pre-render","process","required","size","suffix","theme","title","tree","weight"],
    "radio"       : ["access","after_build","ahah","attributes","default_value","description","disabled","element_validate","parents","post_render","prefix","pre-render","process","required","return_value","suffix","theme","title","tree","weight"],
    "radios"      : ["access","after_build","attributes","default_value","description","disabled","element_validate","options","parents","post_render","prefix","pre-render","process","required","suffix","theme","title","tree","weight"],
    "checkboxes"  : ["access","after_build","attributes","default_value","description","disabled","element_validate","options","parents","post_render","prefix","pre-render","process","required","suffix","theme","title","tree","weight"],
    "radio"       : ["access","after_build","ahah","attributes","default_value","description","disabled","element_validate","parents","post_render","prefix","pre-render","process","required","return_value","suffix","theme","title","tree","weight"]
  };

  var fields  = {  // TO DO: Generate Server-side
     "subtitle" : {
      "fieldtype" : "textfield",
      "label" : "Subtitle",
      "cardinality" : "1"
    },
     "series_title" : {
      "fieldtype" : "textfield",
      "label" : "Series Title",
      "cardinality" : "1"
    },
     "series_number" : { 
      "fieldtype" : "textfield",
      "label" : "Series Number",
      "cardinality" : "1"
    },
     "series_year" : { 
      "fieldtype" : "textfield",
      "label" : "Series Year",
      "cardinality" : "1"
    },
     "series_description" : {
      "fieldtype" : "textarea",
      "label" : "Series Description",
      "cardinality" : "1"
    },
     "edition" : {
      "fieldtype" : "textarea",
      "label" : "Edition",
      "cardinality" : "1"
    },
     "set_title" : {
      "fieldtype" : "textfield",
      "label" : "Set Title",
      "cardinality" : "1"
    },
     "set_item_number" : {
      "fieldtype" : "textfield",
      "label" : "Set Item Number",
      "cardinality" : "1"
    },
     "number_of_pages" : { 
      "fieldtype" : "textfield",
      "label" : "Number of Pages",
      "cardinality" : "1"
    },
     "edition" : { 
      "fieldtype" : "textfield",
      "label" : "Edition /Version",
      "cardinality" : "1"
    },
     "publication_publisher_name" : { 
      "fieldtype" : "textfield",
      "label" : "Publisher Name",
      "cardinality" : "1"
    },
     "publication_imprint_name" : { 
      "fieldtype" : "textfield",
      "label": "Imprint",
      "cardinality" : "1"
    },
     "features_and_distinctions" : { 
      "fieldtype" : "textarea",
      "label" : "Features and Distinctions",
      "cardinality" : "1"
    },
    "date_created" : {
      "fieldtype" : "date",
      "label" :  "Date Created",
      "cardinality" : "1"
    },
    "date_first_released" : {
      "fieldtype" : "date",
      "label" :  "Date First Released",
      "cardinality" : "1"
    },
    "date_first_published" : {
      "fieldtype" : "date",
      "label":  "Date First Published",
      "cardinality" : "1"
    },
     "date_published" : {
      "fieldtype" : "date",
      "label":  "Date Published",
      "cardinality" : "1"
    },
    "date_recorded" : {
      "fieldtype" : "date",
      "label":  "Date Recorded",
      "cardinality" : "1"
    },
     "date_broadcast" : {
      "fieldtype" : "date",
      "label":  "Date Broadcast",
      "cardinality" : "1"
    },
     "date_performed" : {
      "fieldtype" : "date",
      "label":  "Date Performed",
      "cardinality" : "1"
    },
    "date_updated" : {
      "fieldtype" : "date",
      "label" :  "Date Updated",
      "cardinality" : "1"
    },
     "date_created" : { // NEW
      "fieldtype" : "date",
      "label" :  "Date Created",
      "cardinality" : "1"
    },
     "date_updated" : { // NEW
      "fieldtype" : "date",
      "label" :  "Date Updated",
      "cardinality" : "1	"
    },
     "identifier" : {  // NEW
      "fieldtype" : "textfield",
      "label": "Identifier",
      "cardinality" : "1"
    },
     "corporate_contributor" : {  // LEGACY:  Left in for backwards compatibility.  Now handled through flag.
      "fieldtype" : "textfield",
      "label": "Corporate Contributor",
      "cardinality" : "1"
    }
  };
  
  
  var filetypes = {
    "1" : { 
    	"type" : "document", 
    	"label" : "Document",
    	"menu" : "documentmenu",
    	"keyroles" : ["B01","B26","D01","Z97","Z98"],
    	"otherroles" : ["D99"],
    	"keyfields" : ["date_recorded","date_created","identifier"],
    	"otherfields" : ["date_updated"]
    	},
    "2" : { 
    	"type" : "video", 
    	"label" : "Video", 
    	"menu" : "videomenu",
    	"keyroles" : ["B01","B26","D01","Z98"],
    	"otherroles" : ["D99"],
    	"keyfields" : ["date_recorded","date_created","identifier"],
    	"otherfields" : ["date_updated"]
    	},
    "3" : { 
    	"type" : "image",
    	"label" : "Still image",
    	"menu" : "imagemenu",
    	"keyroles" : ["B01","B26","D01","Z97","Z98"],
    	"otherroles" : ["D99"],
    	"keyfields" : ["date_recorded","date_created","identifier"],
    	"otherfields" : ["date_updated"]
    	},
    "4" : { 
    	"type" : "audio", 
    	"label" : "Audio file", 
    	"menu" : "audiomenu",
    	"keyroles" : ["B01","B26","D01","Z98"],
    	"otherroles" : ["D99"],
    	"keyfields" : ["date_recorded","date_created","identifier"],
    	"otherfields" : ["date_updated"]
    	},
  };
  
  var contributor_roles = {  // TO DO: Generate Server-side
    "A01" : "Author",
    "A02" : "With",
    "A03" : "Screenwriter",
    "A04" : "Librettist",
    "A05" : "Lyricist",
    "A06" : "Composer",
    "A07" : "Artist",
    "A08" : "Photographer",
   // "A09" : "Created by", // deprecated as ambiguous
    "A10" : "From an idea by",
    "A11" : "Designer",
    "A12" : "Illustrator",
    "A14" : "Text by",
    "A15" : "Preface by",
    "A16" : "Prologue by",
    "A17" : "Summary by",
    "A18" : "Supplement by",
    "A19" : "Afterword by",
    "A20" : "Notes by",
    "A21" : "Commentaries by",
    "A22" : "Epilogue by",
    "A23" : "Foreword by",
    "A24" : "Introduction by",
    "A25" : "Footnotes by",
    "A26" : "Memoir by",
    "A27" : "Experiments by",
    "A29" : "Introduction and notes by",
    "A30" : "Software written by",
    "A31" : "Book and lyrics by",
    "A32" : "Contributions by",
    "A33" : "Appendix by",
    "A34" : "Index by",
    "A35" : "Drawings by",
    "A36" : "Cover designer",
    "A37" : "Preliminary work by",
    "A38" : "Original author",
    "A39" : "Playwright",
    "A40" : "Arranger",
    "A41" : "Engraver",
    "A42" : "Sculptor",
    "A43" : "Architect",
    "A44" : "Architectural designer",
    "A45" : "Curator",
    "A46" : "Cartographer",
    "A99" : "Other primary creator",
    "B01" : "Editor",
    "B02" : "Revised by",
    "B03" : "Retold by",
    "B04" : "Abridged by",
    "B05" : "Adapted by",
    "B06" : "Translator",
    "B07" : "As told by",
    "B08" : "Translated with commentary by",
    "B09" : "Series editor",
    "B11" : "Editor-in-chief",
    "B12" : "Guest editor",
    "B13" : "Volume editor",
    "B14" : "Editorial board member",
    "B15" : "Editorial coordination by",
    "B16" : "Managing editor",
    "B17" : "Founded by",
    "B18" : "Prepared for publication by",
    "B19" : "Associate editor",
    "B20" : "Consultant editor",
    "B21" : "General editor",
    "B22" : "Dramatist",
    "B23" : "General rapporteur",
    "B24" : "Publisher",
    "B25" : "Arranged by",
    "B26" : "Technical Editor",
    "B27" : "Set designer",
    "B28" : "Lighting designer",
    "B29" : "Sound Designer",
    "B30" : "Stage Manager",
    "B98" : "Literary Editor",
    "B99" : "Other adaptation by",
    "C01" : "Compiled by",
    "C02" : "Selected by",
    "C99" : "Other compilation by",
    "D01" : "Producer",
    "D02" : "Director",
    "D03" : "Conductor",
    "D04" : "Choreographer",
    "D05" : "Dance Company",
    "D06" : "Theatre Company",
    "D99" : "Other direction by",
    "E01" : "Actor",
    "E02" : "Dancer",
    "E03" : "Narrator",
    "E04" : "Commentator",
    "E05" : "Vocalist",
    "E06" : "Instrumentalist",
    "E07" : "Read by",
    "E08" : "Performed by (orchestra, band, ensemble)",
    "E09" : "Broadcaster",
    "E10" : "Host",
    "E11" : "Moderator",
    "E12" : "Speaker",
    "E99" : "Performer",
    "F01" : "Filmed/photographed by",
    "F02" : "Cinematographer",
    "F03" : "Distributor",
    "F04" : "Production Company",
    "F05" : "Film editor",
    "F06" : "Videographer",
    "F07" : "Recording engineer",
    "F99" : "Other recording by",
    "Z01" : "Assisted by",
    "Z97" : "Scanned by",
    "Z98" : "Digitized by",
    "Z99" : "Other" 
  };
    
  var works = {
  
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
        'a' : ["subtitle","publication_publisher_name","number_of_pages","edition","features_and_distinctions","date_first_published","date_published","date_created","identifier"],
        'b' : ["subtitle","publication_publisher_name","number_of_pages","edition","features_and_distinctions","date_first_published","date_published","date_created","identifier"]
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
        'a' : ["series_title","series_number","series_year","series_description","edition"]
        }
     }
  };
  
// Global Counters

var idcounter = 0;
var topsibling = 1;

// DEBUG


function dump(arr,level) {
  var dumped_text = "";
  if(!level) level = 0;
  
  //The padding given at the beginning of the line.
  var level_padding = "";
  for(var j=0;j<level+1;j++) level_padding += "    ";
  
  if(typeof(arr) == 'object') { //Array/Hashes/Objects
   for(var item in arr) {
    var value = arr[item];
   
    if(typeof(value) == 'object') { //If it is an array,
     dumped_text += level_padding + "'" + item + "' ...\n";
     dumped_text += dump(value,level+1);
    } else {
     dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
    }
   }
  } else { //Stings/Chars/Numbers etc.
   dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
  }
  return dumped_text;
} 

