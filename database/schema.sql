CREATE DATABASE IF NOT EXISTS lawarna_portfolio;

USE lawarna_portfolio;

DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS project_tags;
DROP TABLE IF EXISTS project_tag_map;
DROP TABLE IF EXISTS project_media;
DROP TABLE IF EXISTS journey_entries;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS site_settings;
DROP TABLE IF EXISTS about_info;

CREATE TABLE admins(
    id int PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_has VARCHAR(255) NOT NULL, 
    avatar_url VARCHAR(255) NULLABLE,
    last_login TIMESTAMP NULLABLE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE projects(
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    short_description TEXT NOT NULL, 
    long_description TEXT NOT NULLABLE,
    thumbnail VARCHAR(255) NOT NULL,
    cover_image VARCHAR(255) NULLABLE, 
    live_url VARCHAR(255) NULLABLE,
    github_url VARCHAR(255) NULLABLE, 
    status ENUM(
        'draft',
        'published',
        'archived'
    ) DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    project_date NULLABLE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);