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
#### - Clone this repository then go to the project folder
    git clone https://github.com/coderbunker/inventory-server.git
    cd inventory-server
#### - In order to perform quick and easy deployment heroku requires a copy of your git repository hosted in their server: https://git.heroku.com. 
This is handled automatically with one command:
This command will add a remote repository called 'heroku' better ensure you did not have a remote repository with that name before.
    heroku create 
#### - Push the version of the repository you want to deploy on the 'heroku' remote, for instance if you want to deploy your master branch type:
    git push heroku master
    #No matter the local branch you are pushing, it is recommended to push on heroku remote's master branch 
    git push heroku my_branch:master #only if you are using a different branch
#### - Finally just deploy the app you just pushed using this command.
    heroku ps:scale web=1

Et voilà