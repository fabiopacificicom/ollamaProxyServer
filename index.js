import express, { json } from 'express'


const app = express()
app.use(json())

// create a middleware that checks if the incoming request has a valid token
// createa random API token
const token = process.env.API_TOKEN || '<password-token>'
const port = process.env.PORT || '3001'
const apiURL = process.env.OLLAMA_ADDRESS || 'http://localhost:11434/'

const tokenCheck = (req, res, next) => {
  console.log(req.headers);

  if (req.headers['x-access-token'] === token) {
    next()
  } else {
    res.status(401).json({
      error: 'Invalid token'
    })
  }
}

app.use(tokenCheck);
app.get('/api/models', (req, res) => {

  // use fetch to make a get request to the api: http://localhost:11434/api/tags

  fetch(`${apiURL}/tags`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      return res.json(data);
    }).catch((err) => {
      console.error('Error:', err);
    });
})

app.post('/api/chat', (req, res) => {

  console.log(req.body);

  const payload = {
    method: 'POST',
    body: JSON.stringify(req.body),

  }
  fetch(`${apiURL}/chat`, payload)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      res.json(data);
    }).catch((err) => {
      console.error('Error:', err);
    });



});

app.listen(port, () => {

  console.log('listening on port 3001');
});