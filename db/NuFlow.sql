DROP DATABASE IF EXISTS NuFlow;
CREATE DATABASE NuFlow;
USE NuFlow;

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NULL,
    last_name VARCHAR(100) NULL,
    birthday DATE NULL,
    height DECIMAL(5,2),
    weight DECIMAL(5,2),
    gender ENUM('male', 'female', 'other') NULL,
    user_level ENUM('user', 'professional', 'moderator') NOT NULL DEFAULT 'user'
);

CREATE TABLE health_metrics (
    metric_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    drug_use TEXT,
    diseases_medications TEXT,
    sleep TEXT,
    self_assessment TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE diary_entries (
    entry_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    entry_date DATE NOT NULL,
    time_of_day ENUM('morning', 'evening') NOT NULL,
    sleep_duration DECIMAL(4,2),
    sleep_notes TEXT,
    current_mood INT CHECK (current_mood BETWEEN 1 AND 5),
    activity TEXT,
    professional_comment TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);



UPDATE diary_entries SET sleep_duration = 3.0;
ALTER TABLE diary_entries MODIFY sleep_duration FLOAT;
UPDATE diary_entries SET current_mood = 3.0;
ALTER TABLE diary_entries MODIFY current_mood FLOAT;


ALTER TABLE users ADD COLUMN avatar_url VARCHAR(255);




