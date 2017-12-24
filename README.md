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

# Other information:
The content are stored on a google spreadsheet. You need permission to edit: 
https://docs.google.com/spreadsheets/d/1QHKa3vUpht7zRl_LEzl3BlUbolz3ZiL8yKHzdBL42dY/edit

# Deployment
The website is published on the domain name url.coderbunker.com

The deployment is automatically triggered when something is pushed on the [deployment branch](https://github.com/coderbunker/inventory-server/tree/deployment).
Please update the build_number file before every push on that branch. On server side there is a log file for every deployment whose name is the content of that file (with the ".log" extension)

This branch contains a script [run_forever.sh](https://github.com/coderbunker/inventory-server/blob/deployment/run_forever.sh) that we run on server side.
The deployment branch also differs with the default listening port (80 instead of 1234).

Once you are listed in the [project owners](https://app.codeship.com/orgs/coderbunker/teams/owners) you can:
* see deployments history: [Codeship dashboard](https://app.codeship.com/projects/261737)
* manage deployment scripts [Codeship administration page](https://app.codeship.com/projects/261737/deployment_branches/187689)


## If deployment changes ?
The host needs to have read access on this reposit to download the deployment branch.

One administrator of this github project has to add the ssh keys of the new host (the content of the file: ~/.ssh/id_rsa.pub) on the [Deploy keys section](https://github.com/coderbunker/inventory-server/settings/keys).

Before the first deployment, the reposit has to be downloaded and the deployment branch must be checkouted.
    git clone git@github.com:coderbunker/inventory-server.git
    cd inventory-server
    git checkout deployment


## Troobleshooting.
If the deployment fails, check that any application on the host is running a service on port 80.
It is possible that the previous time that "invetory-server" had been lauched did not termniate properly and it is still holding the port.

In linux distributions only the root user can run a service listening to 80 port. Ensure you have the right permissions.


Try also
http://127.0.0.1:1234/search
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
# Deploy
To deploy inventory-server you need an account a [heroku account](https://signup.heroku.com/dc?_ga=2.174119140.795848951.1511268290-1509905748.1509873833)
#### - [Install heroku](https://devcenter.heroku.com/articles/getting-started-with-python?c=70130000000NhRJAA0&utm_campaign=Onboarding-Nurture-Email-1&utm_medium=email&utm_source=nurture&utm_content=devcenter&utm_term=start-python#set-up)
#### - Once your installation succeded you can login into your account using heroku's command line: 
    heroku login
## Prepare your workspace
### Prepare it from scratch
#### - Clone this repository then go to the project folder
    git clone https://github.com/coderbunker/inventory-server.git
    cd inventory-server
#### - In order to quickly create a new deployment of this repository, create your copy repository hosted in their server: https://git.heroku.com. 
You can create one with one command:
Skip this step if you want to manage our deployment.
    heroku create #will add a remote repository called 'heroku'(ensure you don't have an existing remote with that name)
### Deploy the code you contributed on
#### - Clone this repository then go to the project folder
    git clone https://github.com/coderbunker/inventory-server.git
    cd inventory-server
#### - In order to administrate our release you can run the following commands (requires access rights). 
    git remote add heroku  https://git.heroku.com/enigmatic-brushlands-32514.git

### Create a separate repository that tracks the deployment 
#### - Or, if you want to work in a dedicated repository you can do this that way
    heroku git:clone -a enigmatic-brushlands-32514
    cd enigmatic-brushlands-32514

## Release your work
#### - Push the version of the repository you want to deploy on the 'heroku' remote, for instance if you want to deploy your master branch type:
    git push heroku master
    #No matter the local branch you are pushing, it is recommended to push on heroku remote's master branch 
    git push heroku my_branch:master #only if you are using a different branch
#### - Finally just deploy the app you just pushed using this command.
    heroku ps:scale web=1

Et voilà