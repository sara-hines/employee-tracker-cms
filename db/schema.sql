\c postgres

DROP DATABASE IF EXISTS employees_db WITH (FORCE);
CREATE DATABASE employees_db;

\c employees_db;

CREATE TABLE department (
    id SERIAL PRIMARY KEY, 
    department_name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE job_role (
    id SERIAL PRIMARY KEY, 
    title VARCHAR(60) UNIQUE NOT NULL, 
    salary DECIMAL NOT NULL, 
    department_id INTEGER NOT NULL DEFAULT 6, 
    FOREIGN KEY (department_id) 
    REFERENCES department(id)
    ON DELETE SET DEFAULT
);

CREATE TABLE employee (
    id SERIAL PRIMARY KEY, 
    first_name VARCHAR(30) NOT NULL, 
    last_name VARCHAR(30) NOT NULL, 
    manager_id INTEGER,
    FOREIGN KEY (manager_id) 
    REFERENCES employee(id)
    ON DELETE SET NULL,
    role_id INTEGER NOT NULL DEFAULT 31, 
    FOREIGN KEY (role_id)
    REFERENCES job_role(id)
    ON DELETE SET DEFAULT
);
