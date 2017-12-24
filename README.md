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

# Other information:
The content are stored on a google spreadsheet. You need permission to edit: 
https://docs.google.com/spreadsheets/d/1QHKa3vUpht7zRl_LEzl3BlUbolz3ZiL8yKHzdBL42dY/edit

# Deployment

## Push to deploy
The website is published on the domain name url.coderbunker.com

The deployment is automatically triggered when something is pushed on the [deployment branch](https://github.com/coderbunker/inventory-server/tree/deployment).

The deployment uses pm2 as suggested in [this tutorial](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04).

pm2 uses [process.yml](https://github.com/coderbunker/inventory-server/blob/deployment/process.yml) configuration file.

The hosting itself works with an nginx service forwarding the requests to the local webapplication.

Once you are listed in the [project owners](https://app.codeship.com/orgs/coderbunker/teams/owners) you can:
* see deployments history: [Codeship dashboard](https://app.codeship.com/projects/261737)
* manage deployment scripts [Codeship administration page](https://app.codeship.com/projects/261737/deployment_branches/187689)


## If deployment changes ?
The host needs to have read access on this reposit to download the deployment branch.

Add the ssh keys of the new host (the content of the file: ~/.ssh/id_rsa.pub) on the "[Deploy keys section](https://github.com/coderbunker/inventory-server/settings/keys)".

Before the first deployment, the reposit has to be downloaded and the deployment branch must be checkout.

    git clone git@github.com:coderbunker/inventory-server.git
    cd inventory-server
    git checkout deployment

If you choose to use pm2 + nginx to monitor application, they have to be installed separately (their installation is not triggered by 'npm install').

## Troobleshooting.
If the deployment fails, check that any application on the host is running a service on port 80.
It is possible that the previous time that "inventory-server" had been lauched did not termniate properly and it is still holding the port.


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
