# senior-project-2024

## Setup

### AWS CLI
https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html

### NVM
https://github.com/coreybutler/nvm-windows
Use version 18 or greater

### npm install
Run npm install in each project directory (devops, functions, web)

### RSP Commands
To gain access to rsp commands (To easily do things like deploy functions from anywhere in the project),
navigate to the `devops` folder and run `npm install --global`


## Conventions

### Function names
Names of lambda functions should be kebab-case.
The name of the folder in ./functions/ should match the created lambda function.

## API

### GET /form
- Returns all forms

### POST /form
- Creates a new form

### POST /form/{id}
- Update form with id {`id`}

### POST /form/{id}/approve
- Approve/Deny form with id {`id`}