let inquirer = require('inquirer');
let consoleTable = require('console.table');
let { 
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
            } else if (answer.chooseAction === 'Update an employee role') {
                generateListEmployees()
                .then((unformattedEmployees) => generateArrayEmployees(unformattedEmployees))
                .then((formattedEmployees) => promptNewRole(formattedEmployees));
            }
        });
}


async function viewDepartments() {
    let departments = await queryDepartments();
    console.table(departments);
    init();
}

async function viewRoles() {
    let roles = await queryRoles();
    console.table(roles);
    init();
}

// THIS IS WHAT I WANT TO HAVE HAPPEN IN INDEX.JS
async function viewEmployees() {
    const employees = await queryEmployees();
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
            insertDept(newDepartment);
            console.log(`\nThe new department, ${newDepartment}, has been added.\n`);
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
            insertJobRole(newRole, salary, deptId);
            console.log(`\nThe new role, ${newRole}, has been added.\n`);
            init();
        });
    });
}


// Let the user add an employee. User should be prompted to enter the employee’s first name, last name, manager, and role.
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

            if (!firstName || !lastName || !manager || !roleId) {
                console.error('\nThe new employee could not be added; please check your responses and try again.\n');
                return;
            }

            insertEmployee(firstName, lastName, managerId, roleId);
            console.log(`\nThe new employee, ${firstName} ${lastName}, has been added.\n`);
            
            init();
        });
}

function promptNewRole(formattedEmployees) {
    inquirer
        .prompt([
            {
                type: 'list', 
                name: 'employee',
                message: 'Please select an employee to update.',
                choices: formattedEmployees
            },
            {
                type: 'input', 
                name: 'newRole', 
                message: 'Please enter the employee\'s new role.'
            }
        ])
        .then(async ({employee, newRole}) => {
            let roleId = await findRoleId(newRole);
            let returnVals = {
                ee: employee, 
                newRoleId: roleId
            }
            return returnVals;
        })
        .then(({ee, newRoleId}) => {
            updateRole(ee, newRoleId);
            console.log(`\n${ee}'s role has been updated.\n`);
        })
        .then(() => init());
}


init();