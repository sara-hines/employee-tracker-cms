const pool = require('../connection/pool.js');


let queryDepartments = function() {
    return new Promise(function(resolve, reject) {
        let query = `SELECT * FROM department ORDER BY id ASC;`;
        pool.query(query, (error, result) => {
            if(error) {
                return reject(error);
            }
            resolve(result.rows);
        });
    });
}


let queryRoles = function() {
    return new Promise(function(resolve, reject) {
        let query = `SELECT job_role.id, job_role.title, job_role.salary, department.department_name 
        FROM job_role 
        JOIN department ON job_role.department_id = department.id;`;
        pool.query(query, (error, result) => {
            if(error) {
                return reject(error);
            }
            resolve(result.rows);
        });
    });
}


// THIS IS WHAT I WANT TO HAVE HAPPEN IN THE UTILS FOLDER
let queryEmployees = function() {
    return new Promise(function(resolve, reject) {
        let query = `SELECT employee.id, employee.first_name, employee.last_name, job_role.title, department.department_name, job_role.salary, manager.first_name AS manager_first_name, manager.last_name AS manager_last_name 
        FROM employee 
        JOIN job_role ON employee.role_id = job_role.id 
        JOIN department ON job_role.department_id = department.id 
        LEFT JOIN employee AS manager ON employee.manager_id = manager.id;`;
        pool.query(query, (error, result) => {
            if(error) {
                return reject(error);
            }
            resolve(result.rows)
        });
    });
}

let insertDept = function(newDepartment) {
    return new Promise(function(resolve, reject) {
        let query = `INSERT INTO department (department_name)
        VALUES
            ('${newDepartment}');`;
        pool.query(query, (error, result) => {
            if(error) {
                return reject(error);
            }
        });
    });
}


let findDeptId = function(department) {
    return new Promise(function(resolve, reject) {
        let query = `SELECT id FROM department WHERE department_name = '${department}';`;
        pool.query(query, (error, result) => {
            if(error) {
                return reject(error);
            }
            resolve(result.rows[0].id)
        });
    });
}


function insertJobRole(newRole, salary, deptId) {
    return new Promise(function(resolve, reject) {
        let query = `INSERT INTO job_role (title, salary, department_id)
        VALUES
            ('${newRole}', '${salary}', '${deptId}');`;
        pool.query(query, (error, result) => {
            if(error) {
                return reject(error);
            }
        });
    });
}


let findRoleId = function(role) {
    return new Promise(function(resolve, reject) {
        let query = `SELECT id FROM job_role WHERE title = '${role}';`;
        pool.query(query, (error, result) => {
            let roleId = result.rows[0].id;
            if(error) {
                return reject(error);
            }
            resolve(roleId);
        });
    }); 
}


let findManagerId = function(manager) {
    return new Promise(function(resolve, reject) {
        let managerNameArray = manager.split(' ');
        let managerFirstName = managerNameArray[0];
        let managerLastName = managerNameArray[1];

        // This is to find the managerId, which, as it stands, is necessary to make a new employee
        let query1 = `SELECT id FROM employee WHERE first_name = '${managerFirstName}' AND last_name = '${managerLastName}';`;
        pool.query(query1, (error, result) => {
            if(error) {
                return reject(error);
            }
            resolve(result.rows[0].id);
        });
    });
}

let insertEmployee = function(firstName, lastName, managerId, roleId) {
    let query = `INSERT INTO employee (first_name, last_name, manager_id, role_id)
    VALUES
        ('${firstName}', '${lastName}', '${managerId}', '${roleId}');`;
    pool.query(query, (error, result) => {
        if(error) {
            return reject(error);
        }
    });
}


let generateListEmployees = function() {
    return new Promise(function(resolve, reject) {
        let query = `SELECT employee.id, employee.first_name, employee.last_name FROM employee ORDER BY id ASC;`;
        pool.query(query, (error, result) => {
            if (error) {
                return reject(error);
            } else {
                resolve(result.rows);
            }
            return result.rows;
        });
    });
}


let generateArrayEmployees = function(unformattedEmployees) {
    return new Promise(function(resolve, reject) {
        let listOfEmployees = [];
        function formatList(employee) {
            let employeeString = `${employee.first_name} ${employee.last_name}`
            listOfEmployees.push(employeeString);
        }
        unformattedEmployees.forEach(formatList);
        resolve(listOfEmployees);
    });
}


let updateRole = function(ee, newRoleId) {
    let employeeNameArray = ee.split(' ');
    let employeeFirstName = employeeNameArray[0];
    let employeeLastName = employeeNameArray[1];
    return new Promise(async function(resolve, reject) {
        let query = `UPDATE employee SET role_id = ${newRoleId} WHERE employee.first_name = '${employeeFirstName}' AND employee.last_name = '${employeeLastName}';`;
        pool.query(query, (error, result) => {
            if(error) {
                return reject(error);
            }
        });
    });
}


module.exports = {
    queryDepartments, 
    queryRoles,
    queryEmployees, 
    insertDept, 
    findDeptId, 
    insertJobRole, 
    findRoleId, 
    findManagerId, 
    insertEmployee,
    generateListEmployees, 
    generateArrayEmployees,
    updateRole,
};