INSERT INTO department (department_name)
VALUES 
    ('Technology'), 
    ('Human Resources'), 
    ('Finance');

INSERT INTO job_role (title, salary, department_id)
VALUES
    ('Chief Technology Officer', 300000, 1),
    ('Chief Human Resources Officer', 200000, 2),
    ('Chief Financial Officer', 350000, 3),
    ('Engineering Manager', 180000, 1), 
    ('IT Director', 220000, 1), 
    ('Data Science Director', 300000, 1),
    ('Product Manager', 100000, 1), 
    ('Talent Acquisition Manager', 120000, 2), 
    ('Benefits Manager', 90000, 2), 
    ('Employee Relations Manager', 95000, 2), 
    ('Learning and Development Manager', 99000, 2), 
    ('Controller', 80000, 3), 
    ('Treasurer', 110000, 3), 
    ('Tax Director', 165000, 3), 
    ('Financial Reporting Manager', 160000, 3);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUES
    -- Emily Smith is CTO and her employee id is 1
    ('Emily', 'Smith', null, 1),
    ('James', 'Johnson', 1, 4),
    ('Sophia', 'Williams', 1, 5),
    ('Michael', 'Jones', 1, 6),
    ('Olivia', 'Brown', 1, 7),
    -- Ben Miller is CHRO and his employee id is 6
    ('Ben', 'Miller', null, 2),
    ('Ava', 'Davis', 6, 8),
    ('William', 'Garcia', 6, 9),
    ('Isabella', 'Rodriguez', 6, 10),
    ('Alexander', 'Martinez', 6, 11),
    -- Charlotte Hernandez is CFO and her employee id is 11
    ('Charlotte', 'Hernandez', null, 3),
    ('Jacob', 'Lopez', 11, 12),
    ('Jesse', 'Harell', 11, 13), 
    ('Ann', 'Fitzpatrick', 11, 14), 
    ('Randy', 'Marshall', 11, 15);