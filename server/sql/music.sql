CREATE TABLE   IF NOT EXISTS  user (
  `user_id` INT AUTO_INCREMENT,
  `user_name` VARCHAR(40) NOT NULL UNIQUE,
  `user_password` VARCHAR(40) NOT NULL,
  `user_vip` TINYINT DEFAULT 0,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO user (user_name, user_password) VALUES('admin1', '123456');
