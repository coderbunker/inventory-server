# Current deployment method

The deployment is triggered when something is pushed on [deployment](https://github.com/coderbunker/inventory-server/tree/deployment) branch using [codeship](http://codeship.com/).

The server hosting the deployment runs the webapp using pm2 as suggested in [this tutorial](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04).

pm2 uses [process.yml](https://github.com/coderbunker/inventory-server/blob/deployment/process.yml) configuration file.

The hosting itself works with an nginx service forwarding the requests to the local web application.


## Codeship administration
Once you are listed in the [project owners](https://app.codeship.com/orgs/coderbunker/teams/owners) you can:
* see deployments history: [Codeship dashboard](https://app.codeship.com/projects/261737)
* manage deployment scripts [Codeship administration page](https://app.codeship.com/projects/261737/deployment_branches/187689)


# How to prepare the host

#### Allow host's ssh keys to access this repository
The host needs to have read access on this reposit to download the deployment branch.

Add the ssh keys of the new host (the content of the file: ~/.ssh/id_rsa.pub) on the "[Deploy keys section](https://github.com/coderbunker/inventory-server/settings/keys)".

Before the first deployment, the reposit has to be downloaded and the deployment branch must be checkout.

    git clone git@github.com:coderbunker/inventory-server.git
    cd inventory-server
    git checkout deployment

#### Install hosting programs
If you choose to use pm2 + nginx to monitor application, they have to be installed separately (their installation is not triggered by 'npm install').
