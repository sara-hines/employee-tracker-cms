const pool = require('../connection/pool.js');

// THIS IS WHAT I WANT TO HAVE HAPPEN IN THE UTILS FOLDER
let listEmployees = function() {
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


let insertIntoDept = function(newDepartment) {
    let query = `INSERT INTO department (department_name)
    VALUES
        ('${newDepartment}');`;
    pool.query(query, (error, result) => {
        console.log(`The new department, ${newDepartment}, has been added.`);
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


function insertIntoJobRole(newRole, salary, deptId) {
    let query = `INSERT INTO job_role (title, salary, department_id)
    VALUES
        ('${newRole}', '${salary}', '${deptId}');`;
        pool.query(query, (error, result) => {
            console.log(`The new role, ${newRole}, has been added.`);
        });
}


let findRoleId = function(role) {
    return new Promise(function(resolve, reject) {
        let query2 = `SELECT id FROM job_role WHERE title = '${role}';`;
    pool.query(query2, (error, result) => {
        let roleId = result.rows[0]?.id;
        if(error) {
            return reject(error);
        }
        resolve(roleId);
    });
    });
    
}


let findManagerId = function(manager) {
    return new Promise(function(resolve, reject) {
        let managerNameArray = manager.split(" ");
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

let insertIntoEmployee = function(firstName, lastName, managerId, roleId) {
    let query = `INSERT INTO employee (first_name, last_name, manager_id, role_id)
    VALUES
        ('${firstName}', '${lastName}', '${managerId}', '${roleId}');`;
    pool.query(query, (error, result) => {
        // console.log(`The new employee, ${firstName} ${lastName}, has been added.`);
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
            // generateArrayEmployees(result.rows);
        });
    });
}


let generateArrayEmployees = function() {
    return new Promise(function(resolve, reject) {
        let unformattedEmployees = generateListEmployees();
        console.log(unformattedEmployees);
        // let listOfEmployees = [];
        // function formatList(employee) {
        //     let employeeString = `${employee.first_name} ${employee.last_name}`
        //     listOfEmployees.push(employeeString);
        // }
        // // console.log(unformattedEmployees);
        // unformattedEmployees.forEach(formatList);
        // resolve(listOfEmployees);
        // // console.log(listOfEmployees);
        // return listEmployees;
        // The below successfully gets us an array of strings, each string being the first and last name of an employee
        // console.log(listOfEmployees);
    });
}


module.exports = { 
    listEmployees, 
    insertIntoDept, 
    findDeptId, 
    insertIntoJobRole, 
    findRoleId, 
    findManagerId, 
    insertIntoEmployee,
    generateListEmployees, 
    generateArrayEmployees,
};