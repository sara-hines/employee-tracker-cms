INSERT INTO department (department_name)
VALUES 
    ('Technology'), 
    ('Human Resources'), 
    ('Finance'),
    ('Operations'),
    ('Marketing'),
    ('Unspecified Department');

INSERT INTO job_role (title, salary, department_id)
VALUES
    -- C-suite roles
    ('Chief Technology Officer', 300000, 1),
    ('Chief Human Resources Officer', 280000, 2),
    ('Chief Financial Officer', 310000, 3),
    ('Chief Operating Officer', 290000, 4),
    ('Chief Marketing Officer', 250000, 5),
    -- Roles in the Technology department
    ('Engineering Manager', 180000, 1), 
    ('IT Director', 220000, 1), 
    ('Data Science Director', 300000, 1),
    ('Product Manager', 100000, 1), 
    ('Software Development Manager', 160000, 1),
    -- Roles in the Human Resources department
    ('Talent Acquisition Manager', 120000, 2), 
    ('Benefits Manager', 90000, 2), 
    ('Employee Relations Manager', 95000, 2), 
    ('Learning and Development Manager', 99000, 2), 
    ('Compensation and Benefits Manager', 100000, 2),
    -- Roles in the Finance department
    ('Controller', 80000, 3), 
    ('Treasurer', 110000, 3), 
    ('Tax Director', 165000, 3), 
    ('Financial Reporting Manager', 160000, 3),
    ('Internal Auditor', 120000, 3),
    -- Roles in the Operations department
    ('Operations Manager', 100000, 4),
    ('Supply Chain Manager', 120000, 4),
    ('Quality Assurance Manager', 90000, 4), 
    ('Facilities Manager', 110500, 4), 
    ('Production Manager', 95500, 4),
    -- Roles in the Marketing department
    ('Marketing Manager', 90000, 5), 
    ('Brand Manager', 100000, 5), 
    ('Digital Marketing Manager', 120000, 5),
    ('Market Research Manager', 110000, 5), 
    ('Content Marketing Manager', 115000, 5),
    -- Default role if an employee's role is deleted
    ('Unspecified Role', 0, 6);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUES
    -- Maya Kapoor is CTO and her employee id is 1. Maya Kapoor's employee id is the manager id for employees who report to her.
    ('Maya', 'Kapoor', null, 1),
    ('James', 'Johnson', 1, 6),
    ('Sophia', 'Williams', 1, 7),
    ('Amir', 'Khan', 1, 8),
    ('Olivia', 'Brown', 1, 9),
    ('Michael', 'Jones', 1, 10),
    -- Javier Martinez is CHRO and his employee id is 7. Javier Martinez's employee id is the manager id for employees who report to him.
    ('Javier', 'Martinez', null, 2),
    ('Ava', 'Davis', 7, 11),
    ('William', 'Garcia', 7, 12),
    ('Isabella', 'Rodriguez', 7, 13),
    ('Fatima', 'Ahmed', 7, 14),
    ('Lucas', 'Silva', 7, 15),
    -- Charlotte Hernandez is CFO and her employee id is 13. Charlotte Hernandez's employee id is the manager id for employees who report to her.
    ('Charlotte', 'Hernandez', null, 3),
    ('Jacob', 'Lopez', 13, 16),
    ('Jesse', 'Harell', 13, 17), 
    ('Ann', 'Fitzpatrick', 13, 18), 
    ('Randy', 'Marshall', 13, 19),
    ('Jasmine', 'Lee', 13, 20),
    -- Simone Costa is COO and her employee id is 19. Simone Costa's employee id is the manager id for employees who report to her.
    ('Simone', 'Costa', null, 4),
    ('Lily', 'Brooks', 19, 21),
    ('Christopher', 'Turner', 19, 22),
    ('Tyrone', 'Jackson', 19, 23),
    ('Layla', 'Abadi', 19, 24),
    ('Grace', 'Mitchell', 19, 25),
    -- Logan Sullivan is CMO and his employee id is 25. Logan Sullivan's employee id is the manager id for employees who report to him.
    ('Logan', 'Sullivan', null, 5),
    ('Mei', 'Wong', 25, 26),
    ('Chloe', 'Washington', 25, 27),
    ('Asha', 'Gupta', 25, 28),
    ('Oliver', 'Long', 25, 29),
    ('Scarlett', 'Stewart', 25, 30);