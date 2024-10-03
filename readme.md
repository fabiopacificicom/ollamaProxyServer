# Ollama server proxy

This is a proxy for the ollama local server.

## System requirements

- NodeJS 22.x
- npm 10.x
- pm2
- dotenv-cli
  
> If you don't have NodeJS installed, you can download it from [here](https://nodejs.org/en/download/package-manager)
Example:

```bash
# installs nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
# download and install Node.js (you may need to restart the terminal)
nvm install 22
# verifies the right Node.js version is in the environment
node -v # should print `v22.9.0`
# verifies the right npm version is in the environment
npm -v # should print `10.8.3`
```

## SSH into your server

Access the machine where you have installed ollama

```bash
ssh youruser@yourserver
```

## Clone the repo

```bash
git clone https://github.com/fabiopacificicom/ollamaProxyServer.git

```

enter the folder and install the dependencies

```bash
cd ollamaProxyServer
npm install
# on your production server you need to install pm2 globally
npm install -g dotenv-cli
npm install pm2 -g
```

next set up an api key to protect your server from unwanted calls. To do this you can use any api key generator or create your own.
for example [https://www.grc.com/passwords.htm](https://www.grc.com/passwords.htm)

create a copy of the .env.example file and rename it as .env and in there paste your api token.
> an api token is required for authentication, it's like a password for your server. Just create one.

```bash
# copy the file and rename 
cp .env.example .env
```

## Setting your server api key

now open the .env file and paste your api token in there.

```text
API_TOKEN=your-api-token-here
```

## Start the server

```bash
npm run dev
```

this will start the proxy server localhost:3001 press ctrl+c to stop.

## Test your server endpoints

The server will run on the port you specified in the .env file. You can use [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/download) to test your endpoints.

You have access to the following endpoints:

- POST /api/chat
- GET /api/models

Here is an example payload you can send using POST method to the /chat endpoint

```json
{
    "model" : "llama3.2",
    "stream": false,
    "messages": [
        {
            "role" : "system",
            "content": "You are an helpful assistant"
        },
        {
            "role" : "user",
            "content": "Hi there"
        }
    ]
}
```

Remember that you need to set the api token in the header of your so make sure to click on the Headers tab and add it there.

```text
x-access-token: your-api-token-here
```

If you set everything correctly, you should see a response like this

```json
{
    "model": "llama3.2",
    "created_at": "2024-10-02T17:22:59.251273224Z",
    "message": {
        "role": "assistant",
        "content": "Hello! How can I assist you today? Do you have any questions or topics you'd like to discuss? I'm all ears and here to help."
    },
    "done_reason": "stop",
    "done": true,
    "total_duration": 6457254991,
    "load_duration": 78545179,
    "prompt_eval_count": 32,
    "prompt_eval_duration": 248402000,
    "eval_count": 32,
    "eval_duration": 5992042000
}
```

## How to keep the server running

To keep the node proxy server running we need to install [pm2](https://pm2.keymetrics.io/) and run it with the following command:

```bash
npm install pm2 -g
```

Navigate to your node server directory and create a pm2 config file:

```bash
cd ollamaProxyServer
nano ecosystem.config.cjs
```

in the file place

```js
module.exports = {
  apps: [{
    name: 'my-ollama-server',
    script: 'index.js',
    watch: true,
    env: {
      // Your environment variables
      "OLLAMA_ADDRESS": "http://localhost:11434/",
      "PORT": 3001,
      "API_TOKEN": "your_api_token"
      // ... other variables from .env
    }
  }]
};

```

replace the placehodlders with the values from your .env file.

### Start PM2

```bash
pm2 start ecosystem.config.cjs
```

This will start the server in the background.

### Configure PM2 to Restart Automatically

To make sure PM2 and your Node.js application start on server reboot, use the following command:

`pm2 startup`
PM2 will provide you with a command that you need to run with superuser privileges. This command will configure your system to start PM2 on boot.

> [PM2] Freeze a process list on reboot via:
> $`pm2 save`
> [PM2] Remove init script via:
> $ `pm2 unstartup systemd`

### Save Your PM2 Process List

After starting your processes, save the list to ensure they are restarted after a reboot or application crash:

`pm2 save`

### Monitoring and Logs

PM2 provides a way to monitor your applications and view logs, which is very useful for debugging:

`pm2 monit`

### Logs

`pm2 logs`

### Updating Your Application

When you have updates to your application, you can restart it with PM2 to apply the changes:

`pm2 restart my-app`

this can be done also like so:

```bash

# Start all applications
pm2 start ecosystem.config.js

# Stop all
pm2 stop ecosystem.config.js

# Restart all
pm2 restart ecosystem.config.js

# Reload all
pm2 reload ecosystem.config.js

# Delete all
pm2 delete ecosystem.config.js
```

Readmore <https://pm2.keymetrics.io/docs/usage/application-declaration/>
