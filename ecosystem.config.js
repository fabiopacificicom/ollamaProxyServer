module.exports = {
  apps: [{
    name: 'my-ollama-server',
    script: 'index.js',
    watch: true,
    env: {
      // Your environment variables
      "OLLAMA_ADDRESS": process.env.OLLAMA_ADDRESS,
      "PORT": 3001,
      "API_TOKEN": process.env.API_TOKEN
      // ... other variables from .env
    }
  }]
};