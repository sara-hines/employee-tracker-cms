let inquirer = require('inquirer');
let consoleTable = require('console.table');
let { 
        listEmployees, 
        insertIntoDept, 
        findDeptId, 
        insertIntoJobRole, 
        findRoleId,
        findManagerId, 
        insertIntoEmployee, 
        generateListEmployees, 
        generateArrayEmployees,
    }
    = require('./helpers/utils.js');
let pool = require('./connection/pool.js');


const question = [
    {
        type: 'list', 
        name: 'chooseAction', 
        message: 'What would you like to do?', 
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role',]
    }, 
]


function init() {
    inquirer
        .prompt(question)
        .then((answer) => {
            if (answer.chooseAction === 'View all departments') {
                viewDepartments();
            } else if (answer.chooseAction === 'View all roles') {
                viewRoles();
            } else if (answer.chooseAction === 'View all employees') {
                viewEmployees();
            } else if (answer.chooseAction === 'Add a department') {
                addDepartment();
            } else if (answer.chooseAction === 'Add a role') {
                addRole();
            } else if (answer.chooseAction === 'Add an employee') {
                addEmployee();
            // } else if (answer.chooseAction === 'Update an employee role') {
                // async function generateFormattedEmployees() {
                //     const formattedEmployees = await generateArrayEmployees();
                //     // console.log(formattedEmployees);
                //     // return formattedEmployees;
                // }
                // generateFormattedEmployees()
                // .then(async (formattedEmployees) => {
                //     console.log(formattedEmployees);
                // });
                // let formattedEmployees = generateFormattedEmployees();
                // console.log(formattedEmployees);
                // promptUpdateRole(formattedEmployees);
            }
        });
}


function viewDepartments() {
    let query = `SELECT * FROM department ORDER BY id ASC;`;
    pool.query(query, (error, result) => {
        console.table(result.rows);
        init();
    });
}


function viewRoles() {
    let query = `SELECT job_role.id, job_role.title, job_role.salary, department.department_name 
    FROM job_role 
    JOIN department ON job_role.department_id = department.id;`;
    pool.query(query, (error, result) => {
        console.table(result.rows);
        init();
    });
}

// THIS IS WHAT I WANT TO HAVE HAPPEN IN INDEX.JS
async function viewEmployees() {
    const employees = await listEmployees();
    console.table(employees);
    init();
}


function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input', 
                name: 'newDepartment',
                message: 'Please enter the name of the new department.'
            }
        ])
        .then(({newDepartment}) => {
            insertIntoDept(newDepartment);
            init();
        });
}


// Let the user add a role. User should be prompted to enter the name, salary, and department for the role.
function addRole() {
    inquirer
        .prompt([
            {
                type: 'input', 
                name: 'newRole',
                message: 'Please enter the name of the new role.'
            },
            {
                type: 'input', 
                name: 'salary', 
                message: 'Please enter the salary of the new role.'
            },
            {
                type: 'input', 
                name: 'department', 
                message: 'Please enter the department of the new role.'
            }
        ])
        .then(({newRole, salary, department}) => {
            findDeptId(department)
        .then(function(deptId) {
            insertIntoJobRole(newRole, salary, deptId);
            init();
        });
    });
}


// Let the user add an employee. User should be prompted to enter the employee’s first name, last name, role, and manager.
function addEmployee() {
    inquirer
        .prompt([
            {
                type: 'input', 
                name: 'firstName',
                message: 'Please enter the new employee\'s first name.'
            },
            {
                type: 'input', 
                name: 'lastName', 
                message: 'Please enter the new employee\'s last name.'
            },
            {
                type: 'input', 
                name: 'manager', 
                message: 'Please enter the new employee\'s manager.'
            },
            {
                type: 'input', 
                name: 'role', 
                message: 'Please enter the new employee\'s role.'
            },
        ])
        .then (async ({ firstName, lastName, manager, role }) => {
            let roleId = await findRoleId(role);
            let managerId = await findManagerId(manager);
            console.log(roleId);
            console.log(managerId);
            if (firstName && lastName && managerId && roleId) {
                insertIntoEmployee(firstName, lastName, managerId, roleId);
            }

            init();
        });
}


// function promptUpdateRole(formattedEmployees) {
//     inquirer
//         .prompt([
//             {
//                 type: 'list', 
//                 name: 'employee',
//                 message: 'Please select an employee to update.',
//                 choices: formattedEmployees
//             },
//             {
//                 type: 'input', 
//                 name: 'newRole', 
//                 message: 'Please enter the employee\'s new role.'
//             }
//         ]);
// }


init();



