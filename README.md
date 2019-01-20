# Presentation
Inventory server is a "quick tool" designed to manage coderbunker's equipements using QR code.
It is a web based application that provides maintenance information for users and service staff.
# Installation
## install nodejs
Go there for instructions to install npm and nodejs using package manager [there](https://nodejs.org/en/download/package-manager/)
## download repository
    git clone git@github.com:coderbunker/inventory-server.git
    cd inventory-server
## run service on localhost
    npm install
    npm start 

At this point you can go to home page by typing this on your webbrowser: 
http://127.0.0.1:1234/

Try also
http://127.0.0.1:1234/search

## Troobleshooting.
If the application is not starting, check that if there is any application already using port 1234.
It is also possible that the previous time that "inventory-server" had been lauched did not termniate properly and it is still holding the port.

# Other information:
The content are stored on a google spreadsheet. You need permission to edit: 
https://docs.google.com/spreadsheets/d/1QHKa3vUpht7zRl_LEzl3BlUbolz3ZiL8yKHzdBL42dY/edit

# Deployment

## Push to deploy
The website is published on the domain name url.coderbunker.com

The deployment is automatically triggered when something is pushed on the [deployment branch](https://github.com/coderbunker/inventory-server/tree/deployment).


# Contribution

## Use pull request
Avoid pushing straight to the master branch any code that needs review.
Please follow the following steps.
#### 1. Keep the master branch clean and always up to date with the remote master branch
    git checkout master
    git stash
    git pull origin master

#### 2. Create your local branch
    git checkout -b my_changes #give a better name, could be an issue number or a title
    git commit -am "some change"

#### 3. Ensure your changes do not conflict with remote master
    git rebase master #ensure the master is up-to-date at this moment

#### 4. Recopy our branch on the remote.
    git push origin my_branch

#### 5. Create a pull request on github and discuss with other contributors

#### 6. Once the changes are integrated refresh your repository
    git checkout master #your local master is clean, no changes on this branch
    git pull origin master
    git branch -d my_branch #if you don't need that branch anymore you can delete it
## other information
the project is structured around [expressjs](https://github.com/expressjs/express)
