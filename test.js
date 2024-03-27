async function updateEmployeeRole() {
    const employeeArray = await generateListEmployees();
    // The resolved promise from generateListEmployees, result.rows, will be the thing that comes into the employeesArray parameter here

        // The below console log does successfully get me the result.rows.
        // console.log(employeesArray);


                let listOfEmployees = [];
                function formatList(employee) {
                    let employeeString = `${employee.first_name} ${employee.last_name}`
                    listOfEmployees.push(employeeString);
                }
        
                employeeArray.forEach(formatList);
  
                // The below successfully gets us an array of strings, each string being the first and last name of an employee
                // console.log(listOfEmployees);


            // The below console log successfully gets me the formatted list of employees in the array we can provide for the choices.
            // console.log(listOfEmployees);
            inquirer
                .prompt([
                    {
                        type: 'list', 
                        name: 'employee',
                        message: 'Please select an employee to update.',
                        choices: listOfEmployees
                    },
                    {
                        type: 'input', 
                        name: 'newRole', 
                        message: 'Please enter the employee\'s new role.'
                    }
                ])
                .then(({ employee, newRole }) => {
                    let employeeNameArray = employee.split(" ");
                    let employeeFirstName = employeeNameArray[0];
                    let employeeLastName = employeeNameArray[1];
                    queryToFindRoleId(newRole);

                    // queryToUpdateEmployeeRole(employeeFirstName, employeeLastName, newRole);
                    // console.log(employeeFirstName);
                    // console.log(employeeLastName);
                })
                .then((roleId) => {
                    // I am getting undefined when I try to console log the roleId. I was hoping this .then would automatically receive the resolved value from queryToFindRoleId.
                    // console.log(roleId);
                    init();

                })
}