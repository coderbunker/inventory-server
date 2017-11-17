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
 
# Contribution
 
## Use pull request
Avoid pushing straight to the master branch any code that needs review.
Please follow the following steps.
1. Keep the master branch clean and always up to date with the remote master branch.
    git checkout master
    git stash
    git pull origin master
2. Create your local branch
    git checkout -b my_changes #give a better name, could be an issue number or a title
    git commit -am "ome change"
3. Ensure your changes do not conflict with remote master
    git rebase master #ensure the master is up-to-date at this moment
4. Recopy our branch on the remote
    git push origin my_branch
5. Create a pull request on github and discuss with otherr contributors
6. Once the changes are integrated refresh your repository
    git checkout master #your local master is clean, no changes on this branch
    git pull origin master
    
    
## other information
the project is structured around [expressjs](https://github.com/expressjs/express)

