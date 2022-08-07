/*
Navicat MySQL Data Transfer

Source Server         : server
Source Server Version : 50505
Source Host           : server:3306
Source Database       : db_video_chat

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2017-10-30 22:34:21
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for t_admin
-- ----------------------------
DROP TABLE IF EXISTS `t_admin`;
CREATE TABLE `t_admin` (
  `id` int(15) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_email_verified` enum('NO','YES') NOT NULL DEFAULT 'NO',
  `create_datetime` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_admin
-- ----------------------------
INSERT INTO `t_admin` VALUES ('1', 'admin', '13522688976@163.com', '123456', 'YES', '2017-09-12 16:33:19');

-- ----------------------------
-- Table structure for t_bad_word
-- ----------------------------
DROP TABLE IF EXISTS `t_bad_word`;
CREATE TABLE `t_bad_word` (
  `id` int(15) NOT NULL AUTO_INCREMENT,
  `bad_word` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_bad_word
-- ----------------------------
INSERT INTO `t_bad_word` VALUES ('1', 'aaaaabbbbbbbbbbbbbb');
INSERT INTO `t_bad_word` VALUES ('2', 'bbbbbbbbbbbbbbbbb');
INSERT INTO `t_bad_word` VALUES ('3', 'cccccccccccccccccccccccc');
INSERT INTO `t_bad_word` VALUES ('4', 'ddddddddddddddddddddddddd');
INSERT INTO `t_bad_word` VALUES ('5', 'eeeeeeeeeeeeeeeeeeeeeeeeee');
INSERT INTO `t_bad_word` VALUES ('7', 'dfdf');
INSERT INTO `t_bad_word` VALUES ('8', 'ab');
INSERT INTO `t_bad_word` VALUES ('9', 'fefe');

-- ----------------------------
-- Table structure for t_font
-- ----------------------------
DROP TABLE IF EXISTS `t_font`;
CREATE TABLE `t_font` (
  `id` int(15) NOT NULL AUTO_INCREMENT,
  `font_family` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_font
-- ----------------------------
INSERT INTO `t_font` VALUES ('1', 'Times new roman');
INSERT INTO `t_font` VALUES ('2', 'Sans-serif');
INSERT INTO `t_font` VALUES ('3', 'Arial');
INSERT INTO `t_font` VALUES ('4', 'Helvetica');
INSERT INTO `t_font` VALUES ('5', 'Helvetica Neue');

-- ----------------------------
-- Table structure for t_language
-- ----------------------------
DROP TABLE IF EXISTS `t_language`;
CREATE TABLE `t_language` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(255) NOT NULL,
  `value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_language
-- ----------------------------
INSERT INTO `t_language` VALUES ('1', 'create_new_room_page_title', 'Create New Room');
INSERT INTO `t_language` VALUES ('2', 'front_page_title', 'Front Page');
INSERT INTO `t_language` VALUES ('3', 'private_chat_page_title', 'Private Chat Page');
INSERT INTO `t_language` VALUES ('4', 'public_chat_page_title', 'Public Chat Page');
INSERT INTO `t_language` VALUES ('5', 'navbar_create_room', 'Create Room');
INSERT INTO `t_language` VALUES ('6', 'navbar_login', 'Login');
INSERT INTO `t_language` VALUES ('7', 'navbar_logout', 'Logout');
INSERT INTO `t_language` VALUES ('8', 'navbar_active_rooms', 'Active Rooms');
INSERT INTO `t_language` VALUES ('9', 'navbar_all_rooms', 'All Rooms');
INSERT INTO `t_language` VALUES ('10', 'navbar_total_users_online', 'Total Users Online:');
INSERT INTO `t_language` VALUES ('11', 'frontpage_corner_joinroom_button', 'Join Room');
INSERT INTO `t_language` VALUES ('12', 'frontpage_is_on_mic', 'is on mic');
INSERT INTO `t_language` VALUES ('13', 'frontpage_room_', 'Room-');
INSERT INTO `t_language` VALUES ('14', 'frontpage_online', 'Online');
INSERT INTO `t_language` VALUES ('15', 'frontpage_login_or_register', 'Login Or Register');
INSERT INTO `t_language` VALUES ('16', 'frontpage_click_here_to_register', 'Click here to Register');
INSERT INTO `t_language` VALUES ('17', 'frontpage_username', 'USERNAME');
INSERT INTO `t_language` VALUES ('18', 'frontpage_password', 'PASSWORD');
INSERT INTO `t_language` VALUES ('19', 'frontpage_guest_login', 'GUEST LOGIN');
INSERT INTO `t_language` VALUES ('20', 'frontpage_remember_me', 'REMEMBER ME');
INSERT INTO `t_language` VALUES ('21', 'frontpage_auto_login_next_visit', 'AUTO LOGIN NEXT VISIT');
INSERT INTO `t_language` VALUES ('22', 'frontpage_login', 'Login');
INSERT INTO `t_language` VALUES ('23', 'frontpage_forgot_password', 'FORGOT PASSWORD');
INSERT INTO `t_language` VALUES ('24', 'frontpage_terms_and_conditions', 'TERMS AND CONDITIONS');
INSERT INTO `t_language` VALUES ('25', 'frontpage_email', 'EMAIL');
INSERT INTO `t_language` VALUES ('26', 'frontpage_upload_picture', 'UPLOAD PICTRUE');
INSERT INTO `t_language` VALUES ('27', 'frontpage_register', 'Register');
INSERT INTO `t_language` VALUES ('28', 'frontpage_room_password', 'ROOM PASSWORD');
INSERT INTO `t_language` VALUES ('29', 'frontpage_email_address_or_username', 'EMAIL ADDRESS OR USERNAME');
INSERT INTO `t_language` VALUES ('30', 'frontpage_retrieve_password', 'RETRIVE PASSWORD');
INSERT INTO `t_language` VALUES ('31', 'frontpage_verify_code', 'VERIFY CODE');
INSERT INTO `t_language` VALUES ('32', 'frontpage_verify', 'Verify');
INSERT INTO `t_language` VALUES ('33', 'frontpage_resend_verify_code', 'RESEND VERIFY CODE');
INSERT INTO `t_language` VALUES ('34', 'frontpage_error', 'Error');
INSERT INTO `t_language` VALUES ('35', 'frontpage_success', 'Success');
INSERT INTO `t_language` VALUES ('36', 'frontpage_internal_server_error', 'Internal server error.');
INSERT INTO `t_language` VALUES ('37', 'cnrpage_room_name', 'ROOM NAME');
INSERT INTO `t_language` VALUES ('38', 'cnrpage_room_details', 'ROOM DETAILS');
INSERT INTO `t_language` VALUES ('39', 'cnrpage_room_capacity', 'ROOM CAPACITY');
INSERT INTO `t_language` VALUES ('40', 'cnrpage_upload_picture', 'UPLOAD PICTRUE');
INSERT INTO `t_language` VALUES ('41', 'cnrpage_room_options', 'ROOM OPTIONS');
INSERT INTO `t_language` VALUES ('42', 'cnrpage_users_cannot_use_mic', 'users cannot use mic');
INSERT INTO `t_language` VALUES ('43', 'cnrpage_users_cannot_use_cam', 'users cannot use cam');
INSERT INTO `t_language` VALUES ('44', 'cnrpage_users_cannot_text', 'users cannot text');
INSERT INTO `t_language` VALUES ('45', 'cnrpage_room_password', 'ROOM PASSWORD');
INSERT INTO `t_language` VALUES ('46', 'cnrpage_room_note', 'Note: Room will be deactivated if there are no users after 3 hours or hours set inactive by admin.');
INSERT INTO `t_language` VALUES ('47', 'cnrpage_create_room', 'CREATE ROOM');
INSERT INTO `t_language` VALUES ('48', 'cnrpage_error', 'Error');
INSERT INTO `t_language` VALUES ('49', 'cnrpage_success', 'Success');
INSERT INTO `t_language` VALUES ('50', 'publicpage_profile', 'PROFILE');
INSERT INTO `t_language` VALUES ('51', 'publicpage_username', 'USERNAME');
INSERT INTO `t_language` VALUES ('52', 'publicpage_password', 'PASSWORD');
INSERT INTO `t_language` VALUES ('53', 'publicpage_email', 'EMAIL');
INSERT INTO `t_language` VALUES ('54', 'publicpage_upload_picture', 'UPLOAD PICTRUE');
INSERT INTO `t_language` VALUES ('55', 'publicpage_update', 'Update');
INSERT INTO `t_language` VALUES ('56', 'publicpage_moderator_command', 'Moderator Command');
INSERT INTO `t_language` VALUES ('57', 'publicpage_warning', 'Warnning');
INSERT INTO `t_language` VALUES ('58', 'publicpage_error', 'Error');
INSERT INTO `t_language` VALUES ('59', 'publicpage_incoming_request', 'Incoming request');
INSERT INTO `t_language` VALUES ('60', 'publicpage_user_want_private_chat', 'A user wants to have private chat with you.');
INSERT INTO `t_language` VALUES ('61', 'publicpage_accept', 'Accept');
INSERT INTO `t_language` VALUES ('62', 'publicpage_reject', 'Reject');
INSERT INTO `t_language` VALUES ('63', 'publicpage_success', 'Success');
INSERT INTO `t_language` VALUES ('64', 'publicpage_send', 'Send');
INSERT INTO `t_language` VALUES ('65', 'publicpage_cant_call_by_yourself', 'Can\'t have private chat by yourself');
INSERT INTO `t_language` VALUES ('66', 'plz_go_back_to_public_page_to_start_new_private_chat', 'Please go back to public page to start new private chat.');
INSERT INTO `t_language` VALUES ('67', 'privatepage_you_started_private_chat_with', 'You have started private chat with');
INSERT INTO `t_language` VALUES ('68', 'privatepage_send', 'Send');
INSERT INTO `t_language` VALUES ('69', 'privatepage_opponent_goes_offline', 'opponent goes offline...');
INSERT INTO `t_language` VALUES ('70', 'privatepage_error', 'Error');
INSERT INTO `t_language` VALUES ('71', 'privatepage_warning', 'Warning');
INSERT INTO `t_language` VALUES ('72', 'privatepage_not_allowed_text', 'You are note allowed for text chat...');
INSERT INTO `t_language` VALUES ('73', 'server_moderator_disallowed_text', 'Moderator disallowed you for using Text.');
INSERT INTO `t_language` VALUES ('74', 'server_user_text_disabled_success', 'User text disabled successfully.');
INSERT INTO `t_language` VALUES ('75', 'server_moderator_allowed_text', 'Moderator allowed you for using Text.');
INSERT INTO `t_language` VALUES ('76', 'server_user_text_enabled_success', 'User text enabled successfully.');
INSERT INTO `t_language` VALUES ('77', 'server_moderator_disallowed_mic', 'Moderator disallowed you for using Mic.');
INSERT INTO `t_language` VALUES ('78', 'server_user_mic_disabled_success', 'User mic disabled successfully.');
INSERT INTO `t_language` VALUES ('79', 'server_moderator_allowed_camera', 'Moderator allowed you for using Camera.');
INSERT INTO `t_language` VALUES ('80', 'server_moderator_disallowed_camera', 'Moderator disallowed you for using Camera.');
INSERT INTO `t_language` VALUES ('81', 'server_user_camera_disabled_success', 'User camera disabled successfully.');
INSERT INTO `t_language` VALUES ('82', 'server_moderator_allowed_mic', 'Moderator allowed you for using Mic.');
INSERT INTO `t_language` VALUES ('83', 'server_sorry_your_call_rejected', 'Sorry, your call is rejected.');
INSERT INTO `t_language` VALUES ('84', 'server_you_were_kicked', 'You were kicked.');
INSERT INTO `t_language` VALUES ('85', 'server_you_were_banned', 'You were banned.');
INSERT INTO `t_language` VALUES ('86', 'server_user_banned_success', 'User banned successfully.');
INSERT INTO `t_language` VALUES ('87', 'server_user_unbanned_success', 'User unbanned successfully.');

-- ----------------------------
-- Table structure for t_room
-- ----------------------------
DROP TABLE IF EXISTS `t_room`;
CREATE TABLE `t_room` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `room_name` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT '',
  `is_password_protected` enum('YES','NO') NOT NULL DEFAULT 'NO',
  `detail` varchar(255) DEFAULT NULL,
  `capacity` int(11) NOT NULL,
  `image` varchar(255) DEFAULT '',
  `is_text` enum('YES','NO') NOT NULL DEFAULT 'YES',
  `is_voice` enum('YES','NO') NOT NULL DEFAULT 'YES',
  `is_video` enum('YES','NO') NOT NULL DEFAULT 'YES',
  `is_activated` enum('YES','NO') NOT NULL DEFAULT 'YES',
  `create_datetime` datetime NOT NULL,
  `last_event_datetime` datetime NOT NULL,
  `moderator_id` int(11) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name unique` (`room_name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_room
-- ----------------------------
INSERT INTO `t_room` VALUES ('1', 'room1', null, 'NO', 'welcome to home room enjoy your stay', '30', 'room1.png', 'YES', 'YES', 'YES', 'YES', '2017-09-23 12:34:23', '2017-09-23 12:34:23', '36');
INSERT INTO `t_room` VALUES ('3', 'room2', '123456', 'YES', 'password is 123456', '15', 'room2.png', 'YES', 'YES', 'YES', 'YES', '2017-09-23 12:34:23', '2017-09-23 12:34:23', '36');
INSERT INTO `t_room` VALUES ('4', 'room3', '', 'NO', 'description for room3', '2', 'room3.png', 'YES', 'YES', 'YES', 'YES', '2017-09-23 12:34:23', '2017-09-23 12:34:23', '36');
INSERT INTO `t_room` VALUES ('5', 'room4', '123456', 'YES', 'password protected room', '0', 'room4.png', 'YES', 'YES', 'YES', 'YES', '2017-09-23 12:34:23', '2017-09-23 12:34:23', '36');
INSERT INTO `t_room` VALUES ('6', 'room5', '', 'NO', 'this room has no password', '0', 'room5.png', 'YES', 'YES', 'YES', 'NO', '2017-09-23 12:34:23', '2017-09-23 12:34:23', '36');
INSERT INTO `t_room` VALUES ('7', 'jj', '', 'NO', 'asdf', '11', 'upload_ec551f037c6e5bf3a2b898c8a64a291d', 'NO', 'NO', 'NO', 'YES', '2017-10-23 02:49:50', '2017-10-23 02:49:50', '36');
INSERT INTO `t_room` VALUES ('8', 'qqq', '123456', 'YES', 'qweqweqwe', '99', 'upload_f30476ff4af89f83e8d147e1d912ef91', 'NO', 'NO', 'NO', 'YES', '2017-10-23 05:31:43', '2017-10-23 05:31:43', '36');

-- ----------------------------
-- Table structure for t_theme
-- ----------------------------
DROP TABLE IF EXISTS `t_theme`;
CREATE TABLE `t_theme` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category` enum('COLOR','FONT_FAMILY','FONT_SIZE','DATA') NOT NULL DEFAULT 'DATA',
  `name` varchar(255) NOT NULL,
  `comment` varchar(255) NOT NULL,
  `size` int(255) DEFAULT '30',
  `font_family` varchar(255) DEFAULT '',
  `red` int(255) DEFAULT '0',
  `green` int(255) DEFAULT '0',
  `blue` int(255) DEFAULT '0',
  `alpha` float(255,0) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`,`category`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_theme
-- ----------------------------
INSERT INTO `t_theme` VALUES ('1', 'COLOR', 'main', 'Main theme color.', '30', '', '212', '212', '212', '1');
INSERT INTO `t_theme` VALUES ('2', 'COLOR', 'accent', 'Main accent color', '30', '', '63', '63', '63', '1');
INSERT INTO `t_theme` VALUES ('3', 'COLOR', 'alternative', 'Main alternative color.', '30', '', '255', '245', '104', '1');
INSERT INTO `t_theme` VALUES ('4', 'FONT_SIZE', 'big', 'Big font size.', '30', '', '0', '0', '0', '1');
INSERT INTO `t_theme` VALUES ('5', 'FONT_SIZE', 'normal', 'Normal font size.', '20', '', '0', '0', '0', '1');
INSERT INTO `t_theme` VALUES ('6', 'FONT_SIZE', 'small', 'Small font size.', '15', '', '0', '0', '0', '1');
INSERT INTO `t_theme` VALUES ('7', 'FONT_FAMILY', 'main', 'Main font family.', '30', 'Times new roman', '0', '0', '0', '1');
INSERT INTO `t_theme` VALUES ('8', 'DATA', 'temp', 'asdfsdfafawevaevawe', '30', '', '0', '0', '0', '1');
INSERT INTO `t_theme` VALUES ('9', 'COLOR', 'Color1', 'Header Color', '30', '', '255', '255', '255', '1');
INSERT INTO `t_theme` VALUES ('10', 'COLOR', 'Color2', 'Main Background', '30', '', '200', '200', '200', '1');
INSERT INTO `t_theme` VALUES ('11', 'COLOR', 'Color3', 'Create Room Text Color', '30', '', '63', '63', '63', '1');
INSERT INTO `t_theme` VALUES ('12', 'COLOR', 'Color4', 'Activate Room Text Color', '30', '', '63', '63', '63', '1');
INSERT INTO `t_theme` VALUES ('13', 'COLOR', 'Color5', 'All Room Text Color', '30', '', '63', '63', '63', '1');
INSERT INTO `t_theme` VALUES ('14', 'COLOR', 'Color6', 'Total Users Online Color', '30', '', '63', '63', '63', '1');
INSERT INTO `t_theme` VALUES ('15', 'COLOR', 'Color7', 'Logout Color', '30', '', '63', '63', '63', '1');
INSERT INTO `t_theme` VALUES ('16', 'COLOR', 'Color8', 'Room Description Text Color', '30', '', '255', '255', '255', '1');
INSERT INTO `t_theme` VALUES ('17', 'COLOR', 'Color9', 'Room Description Bk Color', '30', '', '63', '63', '63', '1');
INSERT INTO `t_theme` VALUES ('18', 'COLOR', 'Color10', 'Video List Color', '30', '', '240', '240', '240', '1');
INSERT INTO `t_theme` VALUES ('19', 'COLOR', 'Color11', 'Chat List Color', '30', '', '255', '255', '255', '1');
INSERT INTO `t_theme` VALUES ('20', 'COLOR', 'Color12', 'User List Color', '30', '', '255', '255', '255', '1');
INSERT INTO `t_theme` VALUES ('21', 'COLOR', 'Color13', 'Send Button Color', '30', '', '232', '232', '232', '1');
INSERT INTO `t_theme` VALUES ('22', 'COLOR', 'Color14', 'Mic Button Color', '30', '', '232', '232', '232', '1');
INSERT INTO `t_theme` VALUES ('23', 'COLOR', 'Color15', 'Cam Button Color', '30', '', '232', '232', '232', '1');

-- ----------------------------
-- Table structure for t_user
-- ----------------------------
DROP TABLE IF EXISTS `t_user`;
CREATE TABLE `t_user` (
  `id` int(15) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `avatar` varchar(255) NOT NULL,
  `status` enum('ONLINE','OFFLINE') NOT NULL DEFAULT 'OFFLINE',
  `is_activated` enum('YES','NO') NOT NULL DEFAULT 'YES',
  `is_email_verified` enum('YES','NO') NOT NULL DEFAULT 'NO',
  `is_text_enabled` enum('YES','NO') NOT NULL DEFAULT 'YES',
  `is_voice_enabled` enum('YES','NO') NOT NULL DEFAULT 'YES',
  `is_video_enabled` enum('YES','NO') NOT NULL DEFAULT 'YES',
  `create_datetime` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usernameUnique` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_user
-- ----------------------------
INSERT INTO `t_user` VALUES ('1', 'user01', 'user01@users.com', '123456', '1.png', 'OFFLINE', 'YES', 'YES', 'YES', 'YES', 'YES', '2017-09-15 16:29:47');
INSERT INTO `t_user` VALUES ('2', 'user02', 'user02@users.com', '123456', '2.png', 'OFFLINE', 'YES', 'YES', 'YES', 'YES', 'YES', '2017-09-17 07:44:21');
INSERT INTO `t_user` VALUES ('36', 'joki', 'user06@users.com', '123456', 'upload_13bf2571e862cbf69a7e1881f17961c3', 'OFFLINE', 'YES', 'YES', 'YES', 'YES', 'YES', '2017-09-25 00:33:28');
INSERT INTO `t_user` VALUES ('48', 'user03', 'user03@users.com', '123456', '3.png', 'OFFLINE', 'YES', 'YES', 'YES', 'YES', 'YES', '2017-09-30 03:00:25');
INSERT INTO `t_user` VALUES ('49', 'user04', 'user04@users.com', '123456', '4.png', 'OFFLINE', 'YES', 'YES', 'YES', 'YES', 'YES', '2017-09-30 03:00:43');
INSERT INTO `t_user` VALUES ('50', 'user05', 'user05@users.com', '123456', '5.png', 'OFFLINE', 'YES', 'YES', 'YES', 'YES', 'YES', '2017-09-30 03:00:56');
INSERT INTO `t_user` VALUES ('51', 'jjj', 'joki0924@outlook.com', '123456', 'upload_23854eb252f898b6847d28bd1182f154', 'OFFLINE', 'YES', 'YES', 'YES', 'YES', 'YES', '2017-10-30 19:43:33');
INSERT INTO `t_user` VALUES ('52', 'iii', 'joki0924@outlook.com', '123456', 'upload_026853bc19d2d29c9006c52aa70c4718', 'OFFLINE', 'YES', 'YES', 'YES', 'YES', 'YES', '2017-10-30 19:44:04');

-- ----------------------------
-- Table structure for t_user_room_relation
-- ----------------------------
DROP TABLE IF EXISTS `t_user_room_relation`;
CREATE TABLE `t_user_room_relation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `room_id` int(11) NOT NULL DEFAULT '0',
  `is_user_mic` enum('YES','NO') NOT NULL DEFAULT 'YES',
  `is_user_camera` enum('YES','NO') NOT NULL DEFAULT 'YES',
  `is_moderator_text` enum('YES','NO') NOT NULL DEFAULT 'YES',
  `is_moderator_voice` enum('YES','NO') NOT NULL DEFAULT 'YES',
  `is_moderator_video` enum('YES','NO') NOT NULL DEFAULT 'YES',
  `is_banned` enum('YES','NO') NOT NULL DEFAULT 'NO',
  `last_login_time` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userid_roomid_unique` (`user_id`,`room_id`)
) ENGINE=InnoDB AUTO_INCREMENT=588 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_user_room_relation
-- ----------------------------
INSERT INTO `t_user_room_relation` VALUES ('416', '2', '3', 'YES', 'YES', 'YES', 'YES', 'YES', 'NO', '2017-10-09 04:07:25');
INSERT INTO `t_user_room_relation` VALUES ('441', '1', '6', 'YES', 'YES', 'YES', 'YES', 'YES', 'NO', '2017-10-09 04:48:54');
INSERT INTO `t_user_room_relation` VALUES ('558', '1', '7', 'YES', 'YES', 'YES', 'YES', 'YES', 'NO', '2017-10-12 22:10:23');
INSERT INTO `t_user_room_relation` VALUES ('574', '36', '3', 'YES', 'YES', 'NO', 'NO', 'NO', 'NO', '2017-10-23 04:53:26');
