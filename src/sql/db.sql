DROP DATABASE IF EXISTS express_mysql_template;
CREATE DATABASE express_mysql_template;
USE express_mysql_template;

CREATE TABLE users (
    id varchar(255) primary key,
    username varchar(100) not null,
    email varchar(100) not null unique,
    password varchar(255) not null,
    create_at timestamp default current_timestamp,
    update_at timestamp default current_timestamp on update current_timestamp
);

INSERT INTO users (id, username, email, password) 
VALUES 
('1', 'john_doe', 'john@example.com', 'password123'),
('2', 'jane_doe', 'jane@example.com', 'password456'),
('3', 'alice_wonder', 'alice@example.com', 'password789'),
('4', 'bob_builder', 'bob@example.com', 'password321'),
('5', 'charlie_brown', 'charlie@example.com', 'password654');
