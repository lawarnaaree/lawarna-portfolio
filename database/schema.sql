-- CPanel Schema (Database creation handled via CPanel UI)
-- ══════════════════════════════════════════════════════════════

-- Drop tables in reverse order of dependencies to avoid foreign key constraints
DROP TABLE IF EXISTS project_tag_map;
DROP TABLE IF EXISTS project_media;
DROP TABLE IF EXISTS project_tags;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS journey_entries;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS site_settings;
DROP TABLE IF EXISTS about_info;
DROP TABLE IF EXISTS post_likes;
DROP TABLE IF EXISTS post_comments;
DROP TABLE IF EXISTS lifestyle_posts;
DROP TABLE IF EXISTS lifestyle_highlights;
DROP TABLE IF EXISTS admins;

CREATE TABLE admins(
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, 
    avatar_url VARCHAR(255) NULL,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE projects(
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    short_description TEXT NOT NULL, 
    long_description TEXT NULL,
    thumbnail VARCHAR(255) NOT NULL,
    cover_image VARCHAR(255) NULL, 
    live_url VARCHAR(255) NULL,
    github_url VARCHAR(255) NULL, 
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    project_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE project_tags(
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project_tag_map(
    project_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (project_id, tag_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES project_tags(id) ON DELETE CASCADE
);

CREATE TABLE project_media(
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    media_url VARCHAR(255) NOT NULL,
    media_type ENUM('image', 'video') DEFAULT 'image',
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE journey_entries(
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NULL,
    is_current BOOLEAN DEFAULT FALSE,
    description TEXT NOT NULL,
    type ENUM('work', 'education', 'award') DEFAULT 'work',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE contacts(
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NULL,
    subject VARCHAR(255) NULL,
    message TEXT NOT NULL,
    status ENUM('unread', 'read', 'archived') DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE site_settings(
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE about_info(
    id INT PRIMARY KEY AUTO_INCREMENT,
    bio TEXT NOT NULL,
    resume_url VARCHAR(255) NULL,
    skills_json JSON NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE lifestyle_highlights(
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    cover_image VARCHAR(255) NOT NULL,
    media_type ENUM('image', 'video') DEFAULT 'image',
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lifestyle_posts(
    id INT PRIMARY KEY AUTO_INCREMENT,
    media_url VARCHAR(255) NOT NULL,
    media_type ENUM('image', 'video') DEFAULT 'image',
    caption TEXT NULL,
    location VARCHAR(255) NULL,
    likes INT DEFAULT 0,
    comments INT DEFAULT 0,
    is_reel BOOLEAN DEFAULT FALSE,
    posted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE post_likes(
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    fingerprint VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES lifestyle_posts(id) ON DELETE CASCADE
);

CREATE TABLE post_comments(
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES lifestyle_posts(id) ON DELETE CASCADE
);