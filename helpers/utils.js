// The pool connection is required to query the database.
const pool = require('../connection/pool.js');


// Function queryDepartments handles the database logic needed in index.js's viewDepartments function to display the id and department_name of each department. 
function queryDepartments() {
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


// Function queryRoles obtains only the relevant columns from a JOIN of the job_role and department tables. The result will be printed as a table by index.js's viewRoles function.
function queryRoles() {
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


// The employee, job_role, and department tables are joined in order to gather all of the vital data associated with employees (a self JOIN of the employee table is needed in order to properly associate managers with employees). The viewEmployees function will present this data in a table, and the viewEByDept will access and filter the data for its own purposes.
function queryEmployees() {
    return new Promise(function(resolve, reject) {
        let query = `SELECT employee.id, employee.first_name, employee.last_name, job_role.title, department.department_name, job_role.salary, manager.first_name AS manager_first_name, manager.last_name AS manager_last_name 
        FROM employee 
        JOIN job_role ON employee.role_id = job_role.id 
        JOIN department ON job_role.department_id = department.id 
        LEFT JOIN employee AS manager ON employee.manager_id = manager.id
        ORDER BY id ASC;`;
        pool.query(query, (error, result) => {
            if(error) {
                return reject(error);
            }
            resolve(result.rows);
        });
    });
}


// queryEByManager uses the managerId to find all employees with a given manager.
function queryEByManager(managerId) {
    return new Promise(function(resolve, reject) {
        let query = `SELECT employee.id, employee.first_name, employee.last_name
        FROM employee
        WHERE manager_id = ${managerId};`;
        pool.query(query, (error, result) => {
            if(error) {
                return reject(error);
            }
            resolve(result.rows);
        });
    });
}


// Using the JOIN from queryEmployees, the below function filters out employees in each department except the requested department. The map method is then used to obtain only the relevant columns.
function queryEByDept(department, joinedEmployees) {
    // This if statement prevents the function from continuing if the user did not enter any input for the department, or if there was somehow an error in obtaining the JOIN from queryEmployees.
    if (!department || !joinedEmployees) {
        throw new Error('There was an error in finding employees in that department; please try again and ensure that you provide a department');
    }
    return new Promise(function(resolve, reject) {
        let deptEmployees = joinedEmployees.filter(function(employee) {
            return employee.department_name === department;
        });
        // The below if statement throws an error if the user provided input for the department name, but it was not a department that exists in the database.
        if (deptEmployees.length === 0) {
            throw new Error('There was an error in finding employees in that department; please try again and ensure that you provide an existing department');
        }
        let trimmedEmployees = deptEmployees.map(function(employee) {
            let employeeObj = 
            {id: employee.id, 
            first_name: employee.first_name, 
            last_name: employee.last_name}
            return employeeObj;
        });
        resolve(trimmedEmployees);
    });
}


// A new department of the user's specification can be easily added using the query below.
function insertDept(newDepartment) {
    if (!newDepartment) {
        throw new Error('There was an error in creating a new department; please try again and ensure that you provide the name of a unique department to be added.');
    }
    return new Promise(function(resolve, reject) {
        let query = `INSERT INTO department (department_name)
        VALUES
            ('${newDepartment}');`;
        pool.query(query, (error, result) => {
            if(error) {
                return reject(error);
            }
            resolve(result);
        });
    });
}


// Finding the department id is a preliminary step in adding a role; the department id obtained here will be used by function addRole.
function findDeptId(department) {
    if (!department) {
        throw new Error('There was an error in adding a new role; please try again and ensure that you provide an existing department for the new role.');
    }
    return new Promise(function(resolve, reject) {
        let query = `SELECT id FROM department WHERE department_name = '${department}';`;
        pool.query(query, (error, result) => {
            if(error) {
                return reject(error);
            }
            resolve(result.rows[0].id);
        });
    });
}


// Using the role title and salary obtained from the user, and the department id found in findDeptId, a new job role can be created.
function insertJobRole(newRole, salary, deptId) {
    if (!newRole || !salary || !deptId) {
        throw new Error('There was an error in adding a new role; please try again and ensure that you provide the name/title, salary, and department of the new role.');
    }
    return new Promise(function(resolve, reject) {
        let query = `INSERT INTO job_role (title, salary, department_id)
        VALUES
            ('${newRole}', '${salary}', '${deptId}');`;
        pool.query(query, (error, result) => {
            if(error) {
                return reject(error);
            }
            resolve(result);
        });
    });
}


// Finding the role id of a role is an intermediate step in both adding and updating a new employee.
function findRoleId(role) {
    if (!role) {
        throw new Error('Request could not be completed; please try again and ensure that you provide an existing role.');
    }
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


// Finding the manager id, given a certain manager, is a step in function addEmployee's process of adding a new employee. Function viewEByManager also uses findManagerId as an intermediate step in obtaining all employees under a certain manager.
function findManagerId(manager) {
    if (!manager) {
        throw new Error("Request could not be completed. Please try again and provide an existing manager.");
    }
    return new Promise(function(resolve, reject) {
        let mNameArray = manager.split(' ');
        let mFirstName = mNameArray[0];
        let mLastName = mNameArray[1];

        let query = `SELECT * FROM employee WHERE first_name = '${mFirstName}' AND last_name = '${mLastName}';`;
        pool.query(query, (error, result) => {
            // The below if statement ensures that if the user entered an employee who isn't a manager, an error will be thrown rather than the user receiving a console log with an empty table.
            if (result.rows[0].manager_id !== null) {
                throw new Error('Managers should have a manager_id of null. Please try again and ensure you have provided a valid manager.');
            }
            if(error) {
                return reject(error);
            }
            resolve(result.rows[0].id);
        });
    });
}


// Using previously obtained values, function insertEmployee conducts the INSERT INTO statement to create a new employee.
function insertEmployee(firstName, lastName, managerId, roleId) {
    // The below if statement will throw an error if for some reason there is no data on the new employee's firstName, lastName, managerId, or roleId. If the employee didn't provide a manager or role, or provided an invalid manager or role, the faulty input would have already thrown an error in the roleId or managerId function. But, the managerId and roleId are checked for empty input in this if statement as an additional failsafe. 
    if (!firstName || !lastName || !managerId || !roleId) {
        throw new Error('\nThe new employee could not be added; please try again and ensure you provide the employee\'s first and last name in addition to an existing manager and role.\n');
    }
    
    return new Promise(function(resolve, reject) {
        let query = `INSERT INTO employee (first_name, last_name, manager_id, role_id)
        VALUES
            ('${firstName}', '${lastName}', '${managerId}', '${roleId}');`;
        pool.query(query, (error, result) => {
            if(error) {
                return reject(error);
            }
            resolve(result);
        });
    });
}


// As a preliminary step in updating an employee role, generateListEmployees acquires the list of employees which will later be formatted and passed as a choices array in function promptNewRole. 
function generateListEmployees() {
    return new Promise(function(resolve, reject) {
        let query = `SELECT employee.id, employee.first_name, employee.last_name FROM employee ORDER BY id ASC;`;
        pool.query(query, (error, result) => {
            if (error) {
                return reject(error);
            } 
            resolve(result.rows);
            return result.rows;
        });
    });
}


// The below function transforms the array of objects returned by generateListEmployees into an array of strings for inquirer prompt of promptNewRole.
function generateArrayEmployees(unformattedEmployees) {
    return new Promise(function(resolve, reject) {
        let formattedEmployees = [];
        function formatList(employee) {
            let employeeString = `${employee.first_name} ${employee.last_name}`
            formattedEmployees.push(employeeString);
        }
        unformattedEmployees.forEach(formatList);
        resolve(formattedEmployees);
    });
}


// The below function conducts the UPDATE statement needed to update an employee's role.
function updateRole(ee, newRoleId) {
    if (!ee || !newRoleId) {
        throw new Error('There was an error in updating an employee; please check your input and try again.');
    }
    let eNameArray = ee.split(' ');
    let eFirstName = eNameArray[0];
    let eLastName = eNameArray[1];
    return new Promise(async function(resolve, reject) {
        let query = `UPDATE employee SET role_id = ${newRoleId} WHERE employee.first_name = '${eFirstName}' AND employee.last_name = '${eLastName}';`;
        pool.query(query, (error, result) => {
            if(error) {
                return reject(error);
            }
            resolve(result);
        });
    });
}


// The department name the user requested for deletion is removed using a DELETE FROM statement. 
function deleteDept(department) {
    return new Promise(async function(resolve, reject) {
        let query = `DELETE FROM department WHERE department_name = '${department}';`;
        pool.query(query, (error, result) => {
            if (result.rowCount === 0) {
                throw new Error('There was an error in deleting a department; please try again and ensure that you provide an existing department for deletion.');
            }
            if(error) {
                return reject(error);
            }
            resolve(result);
        });
    });
}


// The role/title the user requested for deletion is removed using a DELETE FROM statement. 
function deleteRole(role) {
    return new Promise(async function(resolve, reject) {
        let query = `DELETE FROM job_role WHERE title = '${role}';`;
        pool.query(query, (error, result) => {
            if (result.rowCount === 0) {
                throw new Error('There was an error in deleting a role; please try again and ensure that you provide an existing role for deletion.');
            }
            if(error) {
                return reject(error);
            }
            resolve(result);
        });
    });
}


// The employee the user requested for deletion is removed using a DELETE FROM statement. 
function deleteEmployee(employee) {
    return new Promise(async function(resolve, reject) {
        let eNameArray = employee.split(' ');
        let eFirstName = eNameArray[0];
        let eLastName = eNameArray[1];
        let query = `DELETE FROM employee WHERE first_name = '${eFirstName}' AND last_name = '${eLastName}';`;
        pool.query(query, (error, result) => {
            if (result.rowCount === 0) {
                throw new Error('There was an error in deleting an employee; please try again and ensure that you provide an existing employee for deletion.');
            }
            if(error) {
                return reject(error);
            }
            resolve(result);
        });
    });
}


module.exports = {
    queryDepartments, 
    queryRoles,
    queryEmployees, 
    queryEByManager,
    queryEByDept,
    insertDept, 
    findDeptId, 
    insertJobRole, 
    findRoleId, 
    findManagerId, 
    insertEmployee,
    generateListEmployees, 
    generateArrayEmployees,
    updateRole,
    deleteDept,
    deleteRole,
    deleteEmployee
};