CREATE SCHEMA IF NOT EXISTS password_manager_db;

USE password_manager_db;

DROP TABLE IF EXISTS users;
CREATE TABLE users (
	id INT UNSIGNED NOT NULL AUTO_INCREMENT,
	email VARCHAR(254) NOT NULL,
	auth_code VARCHAR(64) NOT NULL,
	PRIMARY KEY (id)
);

DROP TABLE IF EXISTS vault;
CREATE TABLE vault (
	id INT UNSIGNED NOT NULL AUTO_INCREMENT,
	entry TEXT NOT NULL,
	iv VARCHAR(24) NOT NULL,
	user_id INT UNSIGNED NOT NULL,
	created_at DATETIME NOT NULL,
	updated_at DATETIME NOT NULL,
	PRIMARY KEY (id)
);
