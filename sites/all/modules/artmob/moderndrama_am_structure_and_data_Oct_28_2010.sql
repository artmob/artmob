-- phpMyAdmin SQL Dump
-- version 3.3.7
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Oct 28, 2010 at 09:44 AM
-- Server version: 5.0.51
-- PHP Version: 5.2.4-2ubuntu5.10

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `moderndrama_dev`
--

-- --------------------------------------------------------

--
-- Table structure for table `amCopyright`
--

CREATE TABLE IF NOT EXISTS `amCopyright` (
  `vbid` int(10) unsigned NOT NULL default '0',
  `title` varchar(255) default '',
  `mark` varchar(255) default '',
  `mark_long` varchar(255) default '',
  `mark_message` varchar(255) default '',
  `unmark` varchar(255) default '',
  `unmark_long` varchar(255) default '',
  `unmark_message` varchar(255) default '',
  `roles` varchar(255) default '',
  `global` int(1) default '0',
  `teaser` int(1) default '0',
  `show_on_form` int(1) default '0',
  PRIMARY KEY  (`vbid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `amCopyright`
--


-- --------------------------------------------------------

--
-- Table structure for table `am_annotation`
--

CREATE TABLE IF NOT EXISTS `am_annotation` (
  `nid` int(10) unsigned NOT NULL default '0',
  `widget_name` varchar(255) NOT NULL default '',
  `subwidget_id` int(10) unsigned NOT NULL default '0',
  `annotator_nid` int(10) unsigned NOT NULL default '0',
  `annotation` text,
  `annotation_format` int(10) unsigned NOT NULL default '0',
  PRIMARY KEY  (`subwidget_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `am_annotation`
--


-- --------------------------------------------------------

--
-- Table structure for table `am_bcat_contributor_roles`
--

CREATE TABLE IF NOT EXISTS `am_bcat_contributor_roles` (
  `contributor_role_id` varchar(3) NOT NULL default '',
  `contributor_role_description` varchar(255) NOT NULL default '',
  PRIMARY KEY  (`contributor_role_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='ONIX Code List 17';

--
-- Dumping data for table `am_bcat_contributor_roles`
--

INSERT INTO `am_bcat_contributor_roles` (`contributor_role_id`, `contributor_role_description`) VALUES
('A01', 'By'),
('A02', 'With'),
('A03', 'Screenplay by'),
('A04', 'Libretto by'),
('A05', 'Lyrics by'),
('A06', 'By (composer)'),
('A07', 'By (artist)'),
('A08', 'By (photographer)'),
('A09', 'Created by'),
('A10', 'From an idea by'),
('A11', 'Designed by'),
('A12', 'Illustrated by'),
('A13', 'Photographs by'),
('A14', 'Text by'),
('A15', 'Preface by'),
('A16', 'Prologue by'),
('A17', 'Summary by'),
('A18', 'Supplement by'),
('A19', 'Afterword by'),
('A20', 'Notes by'),
('A21', 'Commentaries by'),
('A22', 'Epilogue by'),
('A23', 'Foreword by'),
('A24', 'Introduction by'),
('A25', 'Footnotes by'),
('A26', 'Memoir by'),
('A27', 'Experiments by'),
('A29', 'Introduction and notes by'),
('A30', 'Software written by'),
('A31', 'Book and lyrics by'),
('A32', 'Contributions by'),
('A33', 'Appendix by'),
('A34', 'Index by'),
('A35', 'Drawings by'),
('A36', 'Cover design by'),
('A37', 'Preliminary work by'),
('A38', 'Original author'),
('A99', 'Other primary creator'),
('B01', 'Edited by'),
('B02', 'Revised by'),
('B03', 'Retold by'),
('B04', 'Abridged by'),
('B05', 'Adapted by'),
('B06', 'Translated by'),
('B07', 'As told by'),
('B08', 'Translated with commentary by'),
('B09', 'Series edited by'),
('B10', 'Edited and translated by'),
('B11', 'Editor-in-chief'),
('B12', 'Guest editor'),
('B13', 'Volume editor'),
('B14', 'Editorial board member'),
('B15', 'Editorial coordination by'),
('B16', 'Managing editor'),
('B17', 'Founded by'),
('B18', 'Prepared for publication by'),
('B19', 'Associate editor'),
('B20', 'Consultant editor'),
('B21', 'General editor'),
('B22', 'Dramatized by'),
('B23', 'General rapporteur'),
('B99', 'Other adaptation by'),
('C01', 'Compiled by'),
('C02', 'Selected by'),
('C99', 'Other compilation by'),
('D01', 'Producer'),
('D02', 'Director'),
('D03', 'Conductor'),
('D99', 'Other direction by'),
('E01', 'Actor'),
('E02', 'Dancer'),
('E03', 'Narrator'),
('E04', 'Commentator'),
('E05', 'Vocal soloist'),
('E06', 'Instrumental soloist'),
('E07', 'Read by'),
('E08', 'Performed by (orchestra, band, ensemble)'),
('E99', 'Performed by'),
('F01', 'Filmed/photographed by'),
('F99', 'Other recording by'),
('Z01', 'Assisted by'),
('Z99', 'Other');

-- --------------------------------------------------------

--
-- Table structure for table `am_citation`
--

CREATE TABLE IF NOT EXISTS `am_citation` (
  `cid` int(10) unsigned NOT NULL auto_increment,
  `copyright_date` int(11) NOT NULL,
  `nid` int(10) unsigned NOT NULL default '0',
  `link_nid` int(10) unsigned NOT NULL default '0',
  `uid` int(10) unsigned NOT NULL default '0',
  `citation_title` text,
  `title_without_prefix` text,
  `subtitle` text,
  `series_title` text,
  `series_number` text,
  `series_year` text,
  `series_description` text,
  `set_title` text,
  `set_title_without_prefix` text,
  `set_item_number` text,
  `number_of_pages` text,
  `publication_publisher_name` text,
  `publication_imprint_name` text,
  `publication_print_run` text,
  `genre` text,
  `citation_style` text,
  `citation_text` text,
  `catalogue_description` text,
  `catalogue_description_format` int(10) unsigned NOT NULL default '0',
  `features_and_distinctions` text,
  `features_and_distinctions_format` int(10) unsigned NOT NULL default '0',
  `publication_notes` text,
  `publication_notes_format` int(10) unsigned NOT NULL default '0',
  `publication_date` int(11) NOT NULL,
  `archival_date` int(11) NOT NULL,
  `first_publication_date` int(11) NOT NULL,
  `identifier_type_code_1` text,
  `identifier_type_name_1` text,
  `identifier_type_value_1` text,
  `identifier_type_code_2` text,
  `identifier_type_name_2` text,
  `identifier_type_value_2` text,
  `corporate_contributor` text,
  `running_time` text,
  `is_merged` smallint(6) default '0',
  PRIMARY KEY  (`cid`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=66 ;

--
-- Dumping data for table `am_citation`
--

INSERT INTO `am_citation` (`cid`, `copyright_date`, `nid`, `link_nid`, `uid`, `citation_title`, `title_without_prefix`, `subtitle`, `series_title`, `series_number`, `series_year`, `series_description`, `set_title`, `set_title_without_prefix`, `set_item_number`, `number_of_pages`, `publication_publisher_name`, `publication_imprint_name`, `publication_print_run`, `genre`, `citation_style`, `citation_text`, `catalogue_description`, `catalogue_description_format`, `features_and_distinctions`, `features_and_distinctions_format`, `publication_notes`, `publication_notes_format`, `publication_date`, `archival_date`, `first_publication_date`, `identifier_type_code_1`, `identifier_type_name_1`, `identifier_type_value_1`, `identifier_type_code_2`, `identifier_type_name_2`, `identifier_type_value_2`, `corporate_contributor`, `running_time`, `is_merged`) VALUES
(1, 943938000, 3677, 3079, 17, 'King & Queen Extravaganza: ‘Jamboree Explosion’', 'King & Queen Extravaganza: ‘Jamboree Explosion’', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 86400, 1272416140, 1272340800, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(2, 943938000, 3678, 3047, 17, 'King & Queen Extravaganza: Queen Reinforcement', 'King & Queen Extravaganza: Queen Reinforcement', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1272340800, 1272416317, 1272340800, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(3, 943938000, 3679, 2956, 4, 'Henry Beerbohm Tree - Trilby - "Svengali"', 'Henry Beerbohm Tree - Trilby - "Svengali"', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1272513600, 1272563732, 1272513600, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(4, 978325200, 3684, 3683, 20, 'Orfeo - Blue Screen Version', 'Orfeo - Blue Screen Version', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1276747200, 1276797786, 1276747200, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(5, 978325200, 3685, 2158, 0, 'Egyptian Temple Ritual - Choir (Merged Version)', 'Egyptian Temple Ritual - Choir (Merged Version)', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1276747200, 1276799513, 1276747200, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(6, 978325200, 3686, 2144, 0, 'Egyptian Temple Ritual - Choir (Blue Screen Version)', 'Egyptian Temple Ritual - Choir (Blue Screen Version)', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1276747200, 1276799558, 1276747200, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(7, 978325200, 3687, 2686, 0, 'Egyptian Temple Ritual - Officiating Priest - Clip 2 (Merged Version)', 'Egyptian Temple Ritual - Officiating Priest - Clip 2 (Merged Version)', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1276747200, 1276799614, 1276747200, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(8, 978325200, 3688, 2713, 0, 'Egyptian Temple Ritual - Officiating Priest - Clip 2 (Blue Screen Version)', 'Egyptian Temple Ritual - Officiating Priest - Clip 2 (Blue Screen Version)', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1276747200, 1276799640, 1276747200, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(9, 978325200, 3689, 2681, 0, 'Egyptian Temple Ritual - Officiating Priest - Clip 1 (Merged Version)', 'Egyptian Temple Ritual - Officiating Priest - Clip 1 (Merged Version)', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1276747200, 1276799666, 1276747200, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(10, 978325200, 3690, 2551, 0, 'Egyptian Temple Ritual - Officiating Priest - Clip 1 (Blue Screen Version)', 'Egyptian Temple Ritual - Officiating Priest - Clip 1 (Blue Screen Version)', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1276747200, 1276799690, 1276747200, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(11, 1252468800, 3691, 3666, 0, 'Temple 2009 - Part 2 - Scene 7', 'Temple 2009 - Part 2 - Scene 7', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1276747200, 1276799792, 1276747200, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(12, 978325200, 3692, 3660, 0, 'Temple 2009 - Part 1 - Scene 3', 'Temple 2009 - Part 1 - Scene 3', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1276747200, 1276799886, 1276747200, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(13, 978325200, 3694, 3693, 20, 'Orpheus - 02', 'Orpheus - 02', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1276747200, 1276799946, 1276747200, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(14, 978325200, 3695, 3665, 0, 'Temple 2009 - Part 2 - Scenes 5 and 6', 'Temple 2009 - Part 2 - Scenes 5 and 6', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1276747200, 1276800134, 1276747200, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(15, 978325200, 3696, 3659, 0, 'Pt 1. Sc 1-2: The king is summoned to the temple', 'Pt 1. Sc 1-2: The king is summoned to the temple', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1276747200, 1276801894, 1276747200, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(16, 1252468800, 3697, 3664, 0, 'Pt 2. Sc 1-4: The “player king” ingests the office of kingship', 'Pt 2. Sc 1-4: The “player king” ingests the office of kingship', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1276747200, 1276802012, 1276747200, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(17, 1252468800, 3698, 3667, 0, 'Pt 2 Sc 8: The King reappears and gains the protection of the gods, as birds', 'Pt 2 Sc 8: The King reappears and gains the protection of the gods, as birds', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1276747200, 1276802027, 1276747200, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(18, 1252468800, 3699, 3663, 0, 'Pt 1. Sc 9-10: The "player king" makes offerings to the gods', 'Pt 1. Sc 9-10: The "player king" makes offerings to the gods', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1276747200, 1276802039, 1276747200, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(19, 1252468800, 3700, 3661, 0, 'Pt 1. Sc 4-7: The "player king" makes offerings to the gods', 'Pt 1. Sc 4-7: The "player king" makes offerings to the gods', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1276747200, 1276802052, 1276747200, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(20, 1252468800, 3701, 3662, 0, 'Pt 1. Sc 8: The "player king" makes offerings to the gods', 'Pt 1. Sc 8: The "player king" makes offerings to the gods', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1276747200, 1276802065, 1276747200, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(21, 1252468800, 3717, 2679, 17, 'Text/Pre-Text/Pretext: The Language Of Avant-Garde Experiment', 'Text/Pre-Text/Pretext: The Language Of Avant-Garde Experiment', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1278302400, 1278364703, 1278302400, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(22, 978325200, 3718, 2589, 17, 'A Note on Musicals', 'Note on Musicals', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1278561600, 1278601202, 1278561600, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(23, 1252468800, 3719, 2670, 17, 'Baring The Breast -- Or ''Author! Author!''', 'Baring The Breast -- Or ''Author! Author!''', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1278561600, 1278602315, 1278561600, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(24, 943938000, 3720, 2671, 17, 'Cultural Flow and Modern Art', 'Cultural Flow and Modern Art', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1278561600, 1278611173, 1278561600, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(25, 943938000, 3721, 2672, 17, 'Designing Modern Life -- The Impact of Theatre on American Society', 'Designing Modern Life -- The Impact of Theatre on American Society', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1278561600, 1278611286, 1278561600, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(26, 1252468800, 3722, 2673, 17, 'Dreams Of Violence: Moving Beyond Colonialism In Canadian & West Indian Drama', 'Dreams Of Violence: Moving Beyond Colonialism In Canadian & West Indian Drama', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1278561600, 1278612332, 1278561600, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(27, 943938000, 3723, 2674, 17, 'Gordon Craig in the multi-media postmodern world: from the Art of the Theatre to Ex Machina - Christopher Innes', 'Gordon Craig in the multi-media postmodern world: from the Art of the Theatre to Ex Machina - Christopher Innes', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1278561600, 1278613513, 1278561600, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(28, 1252468800, 3724, 2676, 17, 'Machines of the Mind', 'Machines of the Mind', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1278561600, 1278619841, 1278561600, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(29, 943938000, 3725, 2678, 17, 'Rebuilding Shakespeare''s Globe', 'Rebuilding Shakespeare''s Globe', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1278648000, 1278685827, 1278648000, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(30, 978325200, 3726, 2675, 17, 'The Kiss Of Death: Brecht, Beckett, And Academia', 'Kiss Of Death: Brecht, Beckett, And Academia', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1278648000, 1278690775, 1278648000, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(34, 943938000, 3845, 3844, 19, 'Modern German Drama: A Study In Form', 'Modern German Drama: A Study In Form', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1280980800, 1281039958, 1280980800, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(35, 943938000, 3848, 3847, 19, 'A Sourcebook on Naturalist Theatre', 'Sourcebook on Naturalist Theatre', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1280980800, 1281041270, 1280980800, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(36, 943938000, 3851, 3850, 19, 'A Routledge Literary Sourcebook on Henrik Ibsen''s Hedda Gabler', 'Routledge Literary Sourcebook on Henrik Ibsen''s Hedda Gabler', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1280980800, 1281041665, 1280980800, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(47, 943938000, 3868, 3287, 17, 'Bazodee at Caribana: ''Coco Panyol'' on Stage', 'Bazodee at Caribana: ''Coco Panyol'' on Stage', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1282708800, 1282708948, 1282708800, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(38, 943938000, 3856, 1328, 10, 'King & Queen Extravaganza 2007 - Enchanted Garden of Socaland ', 'King & Queen Extravaganza 2007 - Enchanted Garden of Socaland', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1282190400, 1282231631, 1282190400, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(39, 943938000, 3857, 1320, 17, 'Caribana 2004 - Blue Devil Costumes', 'Caribana 2004 - Blue Devil Costumes', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1282190400, 1282232279, 1282190400, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(40, 943938000, 3858, 2948, 17, 'Bazodee Connection 2006: Rise of the King ', 'Bazodee Connection 2006: Rise of the King', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1282190400, 1282234672, 1282190400, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(41, 943938000, 3859, 1314, 17, 'Pride 2004 - Fruit/Banana Costume', 'Pride 2004 - Fruit/Banana Costume', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1282190400, 1282234858, 1282190400, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(42, 943938000, 3860, 1462, 17, 'delete Caribana 2006 - Oriental Dragon and Music', 'delete Caribana 2006 - Oriental Dragon and Music', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1282190400, 1282235002, 1282190400, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(43, 943938000, 3861, 1329, 10, 'King & Queen Extravaganza 2007 - Spirit of the Rainforest v.2 ', 'King & Queen Extravaganza 2007 - Spirit of the Rainforest v.2', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1282190400, 1282235371, 1282190400, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(44, 943938000, 3862, 1496, 10, 'Rockwood 2006 - Nativity Scene', 'Rockwood 2006 - Nativity Scene', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1282190400, 1282235987, 1282190400, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(45, 943938000, 3863, 1509, 10, 'Rockwood 2006 - Rudolph Tractor', 'Rockwood 2006 - Rudolph Tractor', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1282190400, 1282236453, 1282190400, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(46, 943938000, 3867, 1510, 10, 'Rockwood 2006 - Snowblower', 'Rockwood 2006 - Snowblower', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1282190400, 1282244039, 1282190400, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(48, 943938000, 3870, 3869, 20, 'Triumph of Horus - Pt.1 sc.1', 'Triumph of Horus - Pt.1 sc.1', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1286251200, 1286311093, 1286251200, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(49, 943938000, 3872, 3871, 20, 'Triumph of Horus - Pt.1 sc.2', 'Triumph of Horus - Pt.1 sc.2', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1286251200, 1286311746, 1286251200, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(50, 943938000, 3874, 3873, 20, 'Triumph of Horus - Pt.1 sc.3', 'Triumph of Horus - Pt.1 sc.3', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1286251200, 1286312017, 1286251200, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(51, 943938000, 3876, 3875, 20, 'Triumph of Horus - Pt.1 sc.4', 'Triumph of Horus - Pt.1 sc.4', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1286251200, 1286312422, 1286251200, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(52, 1252468800, 3878, 3877, 20, 'Peter Minshall - Nignorange & Ewhitenment', 'Peter Minshall - Nignorange & Ewhitenment', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1288065600, 1288110337, 1288065600, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(53, 978325200, 3880, 3879, 20, 'Peter Minshall - Nignorance & Ewhitenment', 'Peter Minshall - Nignorance & Ewhitenment', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1288065600, 1288110739, 1288065600, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(54, 1252468800, 3882, 3881, 20, 'Peter Minshall - Nignorance & Ewhitenment', 'Peter Minshall - Nignorance & Ewhitenment', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1288065600, 1288114392, 1288065600, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(55, 1252468800, 3884, 3883, 20, 'Peter Minshall interviewed on CBC', 'Peter Minshall interviewed on CBC', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1288065600, 1288115772, 1288065600, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(56, 1252468800, 3886, 3885, 20, 'Peter Minshall interview with Christopher Innes', 'Peter Minshall interview with Christopher Innes', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1288065600, 1288123750, 1288065600, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(57, 978325200, 3888, 3887, 20, 'Triumph of Horus - Pt. 1 sc.5', 'Triumph of Horus - Pt. 1 sc.5', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1288065600, 1288130723, 1288065600, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(58, 943938000, 3890, 3889, 20, 'Triumph of Horus - Pt.2 sc.1', 'Triumph of Horus - Pt.2 sc.1', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1288065600, 1288131788, 1288065600, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(59, 943938000, 3892, 3891, 20, 'Triumph of Horus - Pt.2 sc.2', 'Triumph of Horus - Pt.2 sc.2', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1288065600, 1288131938, 1288065600, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(60, 978325200, 3894, 3893, 20, 'Triumph of Horus - Pt. 2 sc. 3', 'Triumph of Horus - Pt. 2 sc. 3', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1288065600, 1288131996, 1288065600, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(61, 978325200, 3896, 3895, 20, 'Triumph of Horus - Pt. 3 sc. 2', 'Triumph of Horus - Pt. 3 sc. 2', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1288065600, 1288132036, 1288065600, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(62, 978325200, 3898, 3897, 20, 'Triumph of Horus - Pt. 3 sc. 3', 'Triumph of Horus - Pt. 3 sc. 3', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1288065600, 1288132068, 1288065600, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(63, 1252468800, 3900, 3899, 20, 'Triumph of Horus - Epilogue', 'Triumph of Horus - Epilogue', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1288065600, 1288132098, 1288065600, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(64, 1252468800, 3902, 3901, 20, 'Triumph of Horus - Prologue pt. 1', 'Triumph of Horus - Prologue pt. 1', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1288065600, 1288132128, 1288065600, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0),
(65, 1252468800, 3904, 3903, 20, 'Triumph of Horus - Prologue pt. 2', 'Triumph of Horus - Prologue pt. 2', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 1, '', 1, '', 1, 1288065600, 1288132159, 1288065600, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 0);

-- --------------------------------------------------------

--
-- Table structure for table `am_citation_contributor_roles`
--

CREATE TABLE IF NOT EXISTS `am_citation_contributor_roles` (
  `contributor_role_id` varchar(3) NOT NULL default '',
  `contributor_role_description` varchar(255) NOT NULL default '',
  PRIMARY KEY  (`contributor_role_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='ONIX Code List 17';

--
-- Dumping data for table `am_citation_contributor_roles`
--

INSERT INTO `am_citation_contributor_roles` (`contributor_role_id`, `contributor_role_description`) VALUES
('A01', 'By'),
('A02', 'With'),
('A03', 'Screenplay by'),
('A04', 'Libretto by'),
('A05', 'Lyrics by'),
('A06', 'By (composer)'),
('A07', 'By (artist)'),
('A08', 'By (photographer)'),
('A09', 'Created by'),
('A10', 'From an idea by'),
('A11', 'Designed by'),
('A12', 'Illustrated by'),
('A13', 'Photographs by'),
('A14', 'Text by'),
('A15', 'Preface by'),
('A16', 'Prologue by'),
('A17', 'Summary by'),
('A18', 'Supplement by'),
('A19', 'Afterword by'),
('A20', 'Notes by'),
('A21', 'Commentaries by'),
('A22', 'Epilogue by'),
('A23', 'Foreword by'),
('A24', 'Introduction by'),
('A25', 'Footnotes by'),
('A26', 'Memoir by'),
('A27', 'Experiments by'),
('A29', 'Introduction and notes by'),
('A30', 'Software written by'),
('A31', 'Book and lyrics by'),
('A32', 'Contributions by'),
('A33', 'Appendix by'),
('A34', 'Index by'),
('A35', 'Drawings by'),
('A36', 'Cover design by'),
('A37', 'Preliminary work by'),
('A38', 'Original author'),
('A99', 'Other primary creator'),
('B01', 'Edited by'),
('B02', 'Revised by'),
('B03', 'Retold by'),
('B04', 'Abridged by'),
('B05', 'Adapted by'),
('B06', 'Translated by'),
('B07', 'As told by'),
('B08', 'Translated with commentary by'),
('B09', 'Series edited by'),
('B10', 'Edited and translated by'),
('B11', 'Editor-in-chief'),
('B12', 'Guest editor'),
('B13', 'Volume editor'),
('B14', 'Editorial board member'),
('B15', 'Editorial coordination by'),
('B16', 'Managing editor'),
('B17', 'Founded by'),
('B18', 'Prepared for publication by'),
('B19', 'Associate editor'),
('B20', 'Consultant editor'),
('B21', 'General editor'),
('B22', 'Dramatized by'),
('B23', 'General rapporteur'),
('B99', 'Other adaptation by'),
('C01', 'Compiled by'),
('C02', 'Selected by'),
('C99', 'Other compilation by'),
('D01', 'Producer'),
('D02', 'Director'),
('D03', 'Conductor'),
('D99', 'Other direction by'),
('E01', 'Actor'),
('E02', 'Dancer'),
('E03', 'Narrator'),
('E04', 'Commentator'),
('E05', 'Vocal soloist'),
('E06', 'Instrumental soloist'),
('E07', 'Read by'),
('E08', 'Performed by (orchestra, band, ensemble)'),
('E99', 'Performed by'),
('F01', 'Filmed/photographed by'),
('F99', 'Other recording by'),
('Z01', 'Assisted by'),
('Z99', 'Other');

-- --------------------------------------------------------

--
-- Table structure for table `am_citation_series_contributor`
--

CREATE TABLE IF NOT EXISTS `am_citation_series_contributor` (
  `nid` int(10) unsigned NOT NULL default '0',
  `widget_name` varchar(255) NOT NULL default '',
  `subwidget_id` int(10) unsigned NOT NULL default '0',
  `series_contributor_nid` int(10) unsigned NOT NULL default '0',
  `series_contributor_role` longblob,
  PRIMARY KEY  (`subwidget_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `am_citation_series_contributor`
--


-- --------------------------------------------------------

--
-- Table structure for table `am_citation_ticket`
--

CREATE TABLE IF NOT EXISTS `am_citation_ticket` (
  `cid` int(10) unsigned NOT NULL auto_increment,
  `nid` int(10) unsigned NOT NULL default '0',
  `uid` int(10) unsigned NOT NULL default '0',
  `ticket_number` int(10) unsigned NOT NULL default '0',
  `ticket_link_nid` int(10) unsigned NOT NULL default '0',
  `is_public` smallint(6) default '0',
  `ticket_name` text,
  `ticket_email` text,
  `ticket_status` text,
  `dispute_status` text,
  PRIMARY KEY  (`cid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `am_citation_ticket`
--


-- --------------------------------------------------------

--
-- Table structure for table `am_contributor`
--

CREATE TABLE IF NOT EXISTS `am_contributor` (
  `cid` int(10) unsigned NOT NULL auto_increment,
  `nid` int(10) unsigned NOT NULL default '0',
  `uid` int(10) unsigned NOT NULL default '0',
  `first_name` text,
  `last_name` text,
  PRIMARY KEY  (`cid`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=39 ;

--
-- Dumping data for table `am_contributor`
--

INSERT INTO `am_contributor` (`cid`, `nid`, `uid`, `first_name`, `last_name`) VALUES
(1, 26, 3, 'Joe', 'Alaimo'),
(2, 936, 2, '', 'bpNichol'),
(3, 953, 2, 'Steve', 'McCaffery'),
(4, 954, 2, 'Paul', 'Dutton'),
(5, 955, 2, 'Rafael ', 'Barreto-Rivera'),
(6, 956, 2, '', 'Four Horsemen'),
(7, 963, 8, 'Richard', 'Truhlar'),
(8, 964, 8, 'Michael ', 'Dean'),
(9, 965, 8, 'David', 'Penhale'),
(10, 966, 8, 'Steven ', 'Smith'),
(11, 967, 8, 'Carla', 'Bertola'),
(12, 968, 8, 'Alberto', 'Vitacchio'),
(13, 970, 8, '', 'Starborne Productions'),
(14, 971, 8, 'Robert ', 'Hindley-Smith'),
(15, 972, 8, 'John', 'de Nottbeck'),
(16, 973, 8, 'Renwick', 'Day'),
(17, 974, 2, 'Steve', 'Venright'),
(18, 998, 4, '', 'Anonymouse'),
(19, 999, 4, 'Michael', 'Tims'),
(20, 1000, 4, 'Marc', 'Chinoy'),
(21, 1001, 4, 'Jerry', '000'),
(22, 1002, 4, 'Ken', 'Coupland'),
(23, 1003, 4, 'D.M.', 'Price'),
(24, 1004, 4, 'Andrew', 'Robinson'),
(25, 1005, 4, 'Maryrose', 'Coleman'),
(26, 1006, 4, 'Ken', 'McRitchie'),
(27, 1007, 4, 'Edd', 'Benton'),
(28, 1008, 4, '', 'Becka'),
(29, 1009, 4, '', 'Suomynona'),
(30, 1053, 8, 'Lori', 'Emerson'),
(31, 1077, 17, 'Peter', 'Babiak'),
(32, 1078, 17, 'Philip ', 'Buckley'),
(33, 1152, 10, 'Jonathan ', 'Baltrusaitis'),
(34, 3645, 18, 'Stewart', 'MacDonald'),
(35, 3649, 19, 'Roz', 'Roach'),
(36, 3650, 19, 'Paul', 'Lampert'),
(37, 3651, 19, 'John', 'Dawson'),
(38, 3652, 19, 'Edward Gordon ', 'Craig');

-- --------------------------------------------------------

--
-- Table structure for table `am_copyrightholder`
--

CREATE TABLE IF NOT EXISTS `am_copyrightholder` (
  `nid` int(10) unsigned NOT NULL default '0',
  `widget_name` varchar(255) NOT NULL default '',
  `subwidget_id` int(10) unsigned NOT NULL default '0',
  `contributor_nid` int(10) unsigned NOT NULL default '0',
  `firstname` text NOT NULL,
  `middlenames` text,
  `lastname` text,
  `email` text,
  `othercontact` text,
  PRIMARY KEY  (`subwidget_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `am_copyrightholder`
--


-- --------------------------------------------------------

--
-- Table structure for table `am_license`
--

CREATE TABLE IF NOT EXISTS `am_license` (
  `cid` int(10) unsigned NOT NULL auto_increment,
  `nid` int(10) unsigned NOT NULL default '0',
  `uid` int(10) unsigned NOT NULL default '0',
  `version` text,
  `web_reference` text,
  `additional_instructions` text,
  `instruction_format` int(10) unsigned NOT NULL default '0',
  PRIMARY KEY  (`cid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `am_license`
--


-- --------------------------------------------------------

--
-- Table structure for table `am_licensing_ticket`
--

CREATE TABLE IF NOT EXISTS `am_licensing_ticket` (
  `cid` int(10) unsigned NOT NULL auto_increment,
  `nid` int(10) unsigned NOT NULL default '0',
  `uid` int(10) unsigned NOT NULL default '0',
  `ticket_number` int(10) unsigned NOT NULL default '0',
  `ticket_link_nid` int(10) unsigned NOT NULL default '0',
  `is_public` smallint(6) default '0',
  `ticket_name` text,
  `ticket_email` text,
  `ticket_status` text,
  `dispute_status` text,
  PRIMARY KEY  (`cid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `am_licensing_ticket`
--


-- --------------------------------------------------------

--
-- Table structure for table `am_usage_request_ticket`
--

CREATE TABLE IF NOT EXISTS `am_usage_request_ticket` (
  `cid` int(10) unsigned NOT NULL auto_increment,
  `nid` int(10) unsigned NOT NULL default '0',
  `uid` int(10) unsigned NOT NULL default '0',
  `ticket_number` int(10) unsigned NOT NULL default '0',
  `ticket_link_nid` int(10) unsigned NOT NULL default '0',
  `is_public` smallint(6) default '0',
  `ticket_name` text,
  `ticket_email` text,
  `ticket_status` text,
  `dispute_status` text,
  PRIMARY KEY  (`cid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `am_usage_request_ticket`
--

