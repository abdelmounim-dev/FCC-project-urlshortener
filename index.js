require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
// app.use(express.json())

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const urls = []
const isUrl = (url) => {
  if (typeof url !== 'string') return false 
  let expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
  return url.match(expression);
}

// Your first API endpoint
app.get('/api/shorturl/:index', function(req, res) {
  let index = req.params.index;

  if(!isUrl(urls[index]))  res.send({ error: 'invalid url' });

  res.redirect(urls[index]);
});

app.post('/api/shorturl', (req, res) => {
  const url = req.body.url;

  if(!isUrl(url)) {res.send({ error: 'invalid url' })
  return;
}

  let index = urls.indexOf(url)

  if (index === -1) {urls.push(url);
    index = urls.length - 1
  }

  console.log(urls)

  res.send({
    original_url: url,
    short_url: index
  })

})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
