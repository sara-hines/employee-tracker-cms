// Packages and modules are required for use throughout the application.
const inquirer = require('inquirer');
const ks = require('node-key-sender');
const os = require('os');
const consoleTable = require('console.table');
const { color, magentaBright } = require('console-log-colors');
const { 
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
}
= require('./helpers/utils.js');


const question = [
    {
        type: 'list', 
        name: 'chooseAction', 
        message: 'What would you like to do?', 
        choices: ['View all departments', 'View all roles', 'View all employees', 'View employees by manager', 'View employees by department', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Delete a department', 'Delete a role', 'Delete an employee', 'Quit']
    }
]


// The init function allows the user to choose an action, and it is used as a recurring menu. 
function init() {
    inquirer
        .prompt(question)
        .then(({chooseAction}) => {
            switch (chooseAction) {
                case 'View all departments':
                    viewDepartments();
                    break;
                case 'View all roles':
                    viewRoles();
                    break;
                case 'View all employees':
                    viewEmployees();
                    break;
                case 'View employees by manager':
                    viewEByManager();
                    break;
                case 'View employees by department':
                    viewEByDept();
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Update an employee role':
                    generateListEmployees()
                    .then((unformattedEmployees) => generateArrayEmployees(unformattedEmployees))
                    .then((formattedEmployees) => promptNewRole(formattedEmployees));
                    break;
                case 'Delete a department':
                    removeDept();
                    break;
                case 'Delete a role':
                    removeRole();
                    break;
                case 'Delete an employee':
                    removeEmployee();
                    break;
                case 'Quit':
                    quit();
                    break;
                default:
                    console.log('Please select an option');
                    init();
            }
        })
        .catch((error) => console.error(error));
}


// viewDepartments will print the results of a query to view all departments as a table. Async await is used throughout the application in order to carry out asynchronous operations.
async function viewDepartments() {
    let departments = await queryDepartments();
    console.log(magentaBright.underline(`\nAll Departments:\n`));
    console.table(departments);
    init();
}


// viewRoles will print the results of a query to view all roles as a table.
async function viewRoles() {
    let roles = await queryRoles();
    console.log(magentaBright.underline(`\nAll Roles:\n`));
    console.table(roles);
    init();
}


// viewEmployees will print the results of a query to view all employees as a table. The employee ids, names, roles, departments, salaries, and managers will be included.
async function viewEmployees() {
    let employees = await queryEmployees();
    console.log(magentaBright.underline(`\nAll Employees:\n`));
    console.table(employees);
    init();
}


// The below function will produce a table of employees working under a single manager. The managerId is first obtained through the findManagerId function and is then passed to a query for employees in the queryEByManager function.
async function viewEByManager() {
    inquirer
        .prompt([
            {
                type: 'input', 
                name: 'manager', 
                message: 'Please enter the name of the manager to view employees by.'
            }
        ])
        .then(async ({manager}) => {
            let managerId = await findManagerId(manager);
            let employees = await queryEByManager(managerId);
            console.log(magentaBright.underline(`\nEmployees with ${manager} as manager:\n`));
            console.table(employees);
            init();
        })
        .catch((error) => console.error(error));
}


// viewEByDept prints a table of employees all working under a single department. The queryEmployees function returns a join of employee data, and this data is passed to queryEByDept to extract only the relevant employees and columns.
async function viewEByDept() {
    inquirer
        .prompt([
            {
                type: 'input', 
                name: 'department', 
                message: 'Please enter the name of the department to view employees by.'
            }
        ])
        .then(async ({department}) => {
            let joinedEmployees = await queryEmployees();
            let trimmedEmployees = await queryEByDept(department, joinedEmployees);
            console.log(magentaBright.underline(`\nEmployees in the ${department} department:\n`));
            console.table(trimmedEmployees);
            init();
        })
        .catch((error) => console.error(error));
}


// Function addDepartment obtains the name of the new department and passes it to function insertDept. Function insertDept conducts an INSERT INTO statement, creating the new department.
function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input', 
                name: 'newDepartment',
                message: 'Please enter the name of the new department.'
            }
        ])
        .then(async ({newDepartment}) => {
            await insertDept(newDepartment);
            console.log(magentaBright.underline(`\nThe new department, ${newDepartment}, has been added.\n`));
        })
        .then(() => init())
        .catch((error) => console.error(error));
}


// The below function helps create a new role using the user-provided name, salary, and department for the role. The department id is obtained through function findDeptId, and function insertJobRole uses the name, salary, and department id in an INSERT INTO statement. 
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
        .then(async ({newRole, salary, department}) => {
            await findDeptId(department)
        .then(async function(deptId) {
            await insertJobRole(newRole, salary, deptId);
            console.log(magentaBright.underline(`\nThe new role, ${newRole}, has been added.\n`));
            init();
        })
        .catch((error) => console.error(error));
    });
}


// To add a new employee, a role id and manager id are first obtained. In order to create the new employee, the first name, last name, role id, and manager id are used in an INSERT INTO statement in the insertEmployee function.
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
            await insertEmployee(firstName, lastName, managerId, roleId);
            console.log(magentaBright.underline(`\nThe new employee, ${firstName} ${lastName}, has been added.\n`));
            
            init();
        })
        .catch((error) => console.error(error));
}


// To change the role of an employee, promptNewRole is first passed an array of employees (obtained through a query in generateListEmployees and formatted in generateArrayEmployees) for the user to choose the appropriate employee. Function findRoleId obtains the role id, and the updateRole function performs the appropriate UPDATE statement. 
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
        .then(async ({ee, newRoleId}) => {
            await updateRole(ee, newRoleId);
            console.log(magentaBright.underline(`\n${ee}'s role has been updated.\n`));
        })
        .then(() => init())
        .catch((error) => console.error(error));
}


// Function removeDept prompts the user for the department to be deleted and passes the department name to function deleteDept in utils.js. Function deleteDept executes the DELETE FROM statement to remove the department from the database.
async function removeDept() {
    inquirer
        .prompt([
            {
                type: 'input', 
                name: 'department', 
                message: 'Please enter the name of the department to delete.'
            }
        ])
        .then(async ({department}) => {
            await deleteDept(department);
            return department;
        })
        .then((department) => {
            console.log(magentaBright.underline(`\nThe ${department} department has been deleted.\n`));
            init();
        })       
        .catch((error) => console.error(error));
}


// Similarly to function removeDept, function removeRole passes the name of the role to be deleted to the deleteRole function in utils.js, where the role is removed from the database.
async function removeRole() {
    inquirer    
        .prompt([
            {
                type: 'input', 
                name: 'role', 
                message: 'Please enter the name of the role to delete.'
            }
        ])
        .then(async ({role}) => {
            await deleteRole(role);
            return(role);
        })
        .then((role) => {
            console.log(magentaBright.underline(`\nThe ${role} role has been deleted.\n`));
            init();
        })
        .catch((error) => console.error(error));
}


// Function removeEmployee will delete an employee from the database by passing the name of the employee to function deleteEmployee in utils.js.
async function removeEmployee() {
    inquirer    
        .prompt([
            {
                type: 'input', 
                name: 'employee', 
                message: 'Please enter the first and last name of the employee to delete.'
            }
        ])
        .then(async ({employee}) => {
            await deleteEmployee(employee);
            return(employee);
        })
        .then((employee) => {
            console.log(magentaBright.underline(`\n${employee} has been deleted from the database.\n`));
            init();
        })
        .catch((error) => console.error(error));
}


// The quit function uses npm package node-key-sender to simulate the Control + C keyboard event (or, a Control + . keyboard event for MAC), causing inquirer to terminate. This adds flexibility to the user interface for users who may be more familiar with navigating through a menu versus using keyboard shortcuts.
function quit() {
    inquirer
        .prompt([
            {   
                type: 'confirm',
                name: 'confirmQuit',
                message: 'Are you sure you want to quit?'
            }
        ])
        .then(({confirmQuit}) => {
            if (!confirmQuit) {
                init();
            }
            if (os.type === 'Darwin') {
                ks.sendCombination(['command', '.']);
            } else {
                ks.sendCombination(['control', 'c']);
            }
        })
        .catch((error) => console.error(error));
}


// Starts the first prompt.
init();