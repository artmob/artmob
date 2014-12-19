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

  var contributorscache = null;

  var globalcontribfromcache = false;

  var wrapping_box = '#fair-dealing-wrapper';  // div to build menus

  var addwork_flag = false;
  var addwork_worktype = "";
  
  var filetypes = {
    "1" : { "type" : "document", "label" : "document","menu" : "documentmenu"},
    "2" : { "type" : "video", "label" : "video", "menu" : "videomenu"},
    "3" : { "type" : "image", "label" : "still image", "menu" : "imagemenu"},
    "4" : { "type" : "audio", "label" : "audio file", "menu" : "audiomenu"},
  };

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
      "label":  "  Date Created",
      "cardinality" : "1"
    },
    "date_first_released" : {
      "fieldtype" : "date",
      "label":  "  Date First Released",
      "cardinality" : "1"
    },
    "date_first_published" : {
      "fieldtype" : "date",
      "label":  "  Date First Published",
      "cardinality" : "1"
    },
     "date_published" : {
      "fieldtype" : "date",
      "label":  "  Date Published",
      "cardinality" : "1"
    },
    "date_recorded" : {
      "fieldtype" : "date",
      "label":  "  Date Recorded",
      "cardinality" : "1"
    },
     "date_broadcast" : {
      "fieldtype" : "date",
      "label":  "  Date Broadcast",
      "cardinality" : "1"
    },
     "date_performed" : {
      "fieldtype" : "date",
      "label":  "  Date Performed",
      "cardinality" : "1"
    },
    "date_updated" : {
      "fieldtype" : "date",
      "label":  "  Date Updated",
      "cardinality" : "1"
    },
     "corporate_contributor" : {
      "fieldtype" : "textfield",
      "label":  "Corporate Contributor",
      "cardinality" : "n"
    }
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
    "A09" : "Created by",
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
    "B25" : "Printer",
    "B26" : "Costume designer",
    "B27" : "Set designer",
    "B28" : "Lighting designer",
    "B29" : "Sound Designer",
    "B30" : "Stage Manager",
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
        'b' : "For example, a literary compilation usually contains individual literary works written by different authors, and may incorporate illustrations and photographs owned by their creators."
        },
      'keyroles' : {
        'a' : ["A01","B01","B06","B24"],
        'b' : ["A01","B01","B06","B24","B25"]
        },
      'otherroles' : {
        'a' : ["B21","B09","A24","A15","A11"],
        'b' : ["A24","A15","B04","B05","B21","B09","B16","A11"]
        },
      'keyfields' : {
        'a' : ["subtitle","publication_publisher_name","number_of_pages","edition","features_and_distinctions","date_first_published","date_published"],
        'b' : ["subtitle","publication_publisher_name","number_of_pages","edition","features_and_distinctions","date_first_published","date_published"]
        },
      'otherfields' : {
        'a' : ["corporate_contributor","publication_imprint_name","series_title","series_number","series_year","series_description","edition","set_title","set_item_number"],
        'b' : ["corporate_contributor","publication_imprint_name","series_title","series_number","series_year","series_description","edition","set_title","set_item_number"]
        }
     },
     "B" :  {
      'type' : "DRAMATIC",
      'id' : "dt-dramatic-work",
      'colour' : '#df5998',
      'values' : {
        'a' : "Choreographed Work",
        'b' : "Play/Script/Screenplay",
        'c' : "Film (Cinema/Animation/Documentary/Found Footage)"
      },
      'help' : {
        'a' : "For example, a choreographed work might include sketches, photographs, or other visual instructions on how to choreograph the work.",
        'b' : "For example, a published play, script or screenplay might include photographs of specific performances for illustration purposes.",
        'c' : "For example, a film might contain a number of musical recordings or visual artistic works. The film may also be based on a literary work, or on a play, script or screenplay."
      },
      'keyroles' : {
        'a' : ["D04","D05"],
        'b' : ["A01","A39","A03","B06","B05","B22"],
        'c' : ["D02","D01","F04","F02","F05","F06","F99"]
        },
      'otherroles' : {
        'a' : ["D01","Z99"],
        'b' : ["Z99"],  
        'c' : ["Z99"]

        },
      'keyfields' : {
        'a' : ["subtitle","edition","features_and_distinctions","publication_publisher_name","date_first_released","date_published"],
        'b' : ["subtitle","edition","features_and_distinctions","publication_publisher_name","date_first_released","date_published"],
        'c' : ["subtitle","edition","date_first_released","date_broadcast"]
        },      
      'otherfields' : {
        'a' : ["corporate_contributor","publication_imprint_name","series_title","series_number","series_year","series_description","edition","set_title","set_item_number"],
        'b' : ["corporate_contributor","publication_imprint_name","series_title","series_number","series_year","series_description","edition","set_title","set_item_number"],
        'c' : ["corporate_contributor","series_title","series_number","series_year","series_description","edition","set_title","set_item_number"]
        }

     },
     "C" :  {
      'type' : "MUSICAL",
      'id' : "dt-musical-work",
      'colour' : '#00a9d0',
      'values' : {
        'a' : "Musical Composition",
        'b' : "Musical Recording",
        'c' : "Musical Broadcast"
      },
      'help' : {
        'a' : "For example, a published musical composition could include an accompanying photograph of the composer that is protected by a separate copyright.",
        'b' : "For example, a musical recording might include a number of individual musical performances.",
        'c' : "For example, a musical broadcast might include a number of individual musical or dramatic performances."
      },
      'keyroles' : {
        'a' : ["A06","A05","A04"],
        'b' : ["F07"],
        'c' : ["E09"]

        },
      'otherroles' : {
        'a' : ["A40","Z99"],
        'b' : ["Z99"],
        'c' : ["E10","E11","E12","F07","Z99"]

        },
      'keyfields' : {
        'a' : ["subtitle","edition","features_and_distinctions","publication_publisher_name","date_first_released","date_published"],
        'b' : ["subtitle","features_and_distinctions","date_first_released","date_recorded","date_performed"],
        'c' : ["corporate_contributor","date_recorded","date_broadcast"]
        },      
      'otherfields' : {
        'a' : ["corporate_contributor","publication_imprint_name","series_title","series_number","series_year","series_description","edition","set_title","set_item_number"],
        'b' : ["corporate_contributor"],
        'c' : []

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
        'a' : "", //"Help text for Photograph",
        'b' : "", //"Help text for Painting",
        'c' : "", //"Help text for Drawing",
        'd' : "", //"Help text for Engraving",
        'e' : "", //"No nesting or help text required.",
        'f' : "", //"No nesting or help text required.",
        'g' : "", //"No nesting or help text required.",
        'h' : "For example, an artistic complication might include individual visual artistic works such as photographs, paitings, or drawings.",
        'i' : "", //"No nesting or help text required."
      },
      'keyroles' : {
        'a' : ["A08"],
        'b' : ["A07"],
        'c' : ["A07","A12"],
        'd' : ["A41","A07","A12"],
        'e' : ["A42","A07"],
        'f' : ["A43","A44","A08","A12"],
        'g' : ["A46","A11"],
        'h' : ["A45","B01","A24","A23"],
        'i' : ["A11","B26","B27"]
        },
      'otherroles' : {
        'a' : ["Z99"],
        'b' : ["Z99"],
        'c' : ["Z99"],
        'd' : ["Z99"],
        'e' : ["Z99"],
        'f' : ["Z99"],
        'g' : ["Z99"],
        'h' : ["C01","C02","Z99"],
        'i' : ["A36","A44","Z99"]
        },
      'keyfields' : {
        'a' : ["subtitle","date_first_released"],
        'b' : ["subtitle","date_first_released"],
        'c' : ["subtitle","date_first_released"],
        'd' : ["subtitle","date_first_released"],
        'e' : ["subtitle","date_first_released"],
        'f' : ["subtitle","date_first_released"],       
        'g' : ["subtitle","date_first_released"],
        'h' : ["subtitle","date_first_released"],
        'i' : ["subtitle","date_first_released"]
        },      
      'otherfields' : {
        'a' : ["corporate_contributor","features_and_distinctions","series_title","series_number","series_year","series_description"],
        'b' : ["corporate_contributor","features_and_distinctions","series_title","series_number","series_year","series_description"],
        'c' : ["corporate_contributor","features_and_distinctions","series_title","series_number","series_year","series_description"],
        'd' : ["corporate_contributor","features_and_distinctions","series_title","series_number","series_year","series_description"],
        'e' : ["corporate_contributor","features_and_distinctions","series_title","series_number","series_year","series_description"],
        'f' : ["corporate_contributor","features_and_distinctions","series_title","series_number","series_year","series_description"],       
        'g' : ["corporate_contributor","features_and_distinctions","series_title","series_number","series_year","series_description"],
        'h' : ["corporate_contributor","features_and_distinctions","series_title","series_number","series_year","series_description"],
        'i' : ["corporate_contributor","features_and_distinctions","series_title","series_number","series_year","series_description"]
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
        'a' : "For example, a performance will often involve the interpretation of a literary, dramatic, or musical work."
      },
      'keyroles' : {
        'a' : ["E01","E02","A07","E03","E99","E05","E06","E10","A24","D03","E12","A11","B26","D02","D04","B27","B28","B29","B30"],
        },
      'otherroles' : {
        'a' : ["E09","F06","F07","D05","D06","F04","F01"],
        },
      'keyfields' : {
        'a' : ["subtitle","features_and_distinctions","date_recorded","date_performed"],
      },      
      'otherfields' : {
        'a' : ["series_title","series_number","series_year","series_description","edition"],
        'b' : []
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

