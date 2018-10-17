const express = require('express'),
  path = require('path'),
  app = express(),
  port = process.env.PORT || 2000

const root = path.normalize(`${__dirname}/dist`)
app.use(express.static(root))
app.use('/static', express.static(`${root}/static`))
app.disable('x-powered-by')

// Redirect all HTTP traffic to HTTPS
function ensureSecure(req, res, next) {
  if (req.secure) return next()
  res.redirect('https://' + req.hostname + req.url)
}

// Always send index.html
function sendIndex(req, res) {
  res.sendFile(`${root}/index.html`)
}

// BASIC Server Routes, split out if needed deeper urls
app.all('/*', sendIndex)
if (process.env.NODE_ENV === 'production') app.all('*', ensureSecure)

app.listen(port, () => console.log(`Listening on port ${port}!`))
