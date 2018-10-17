const express = require('express'),
  path = require('path'),
  request = require('request'),
  ethereum_address = require('ethereum-address'),
  app = express(),
  port = process.env.PORT || 2000,
  root = path.normalize(`${__dirname}/dist`)

// Configure to redirect base
const baseUri = 'https://amberdata.io/'
const searchUri = 'search?q='

app.use(express.static(root, { redirect: false }))
app.disable('x-powered-by')

// Redirect all HTTP traffic to HTTPS
// function ensureSecure(req, res, next) {
//   if (req.secure) return next()
//   res.redirect('https://' + req.hostname + req.url)
// }
// if (process.env.NODE_ENV === 'production') app.all('*', ensureSecure)

function getDataFromSearch(str) {
  return new Promise((resolve, reject) => {
    try {
      const options = {
        method: 'POST',
        url: 'https://1c9c969065fcd1cf.api.amberdata.io/search/lookahead',
        headers: {
          'x-amberdata-blockchain-id': '1c9c969065fcd1cf',
          'cache-control': 'no-cache',
          'Content-Type': 'application/json'
        },
        body: { term: str, types: [] },
        json: true
      }

      // Using request, since axios has lamesauce on post from nodejs
      request(options, (error, response, body) => {
        // if (error) reject(error)
        if (error) resolve(null)
        const data = body && body.length > 0 ? body[0] : null
        const match =
          data && data.match && data.match.address ? data.match.address : null
        resolve(match)
      })
    } catch (e) {
      reject(e)
    }
  })
}

// Logic to analyze request and return appropriate redirect
// Supported Strings:
// - Address:     0x8a0011ccb1850e18a9d2d4b15bd7f9e9e423c11b
// - Transaction: 0x39f0a2fd5b554793364dbf619185ce653a0dfc340213e0b7195a72e6f75f9090
// - Block:       6342820
// - Token Name:  CryptoKitties
// - Token Sym:   CK
// - Fallback is search endpoint
async function getRouteFromString(str) {
  const isAddress = ethereum_address.isAddress(str)
  const isTxn = /^0x([A-Fa-f0-9]{64})$/.test(str)
  const isBlock = /^-{0,1}\d*\.{0,1}\d+$/.test(str)

  // Standard data formats
  if (isAddress) return `addresses/${str}`
  if (isTxn) return `transactions/${str}`
  if (isBlock) return `blocks/${str}`

  // Get dynamic data
  const token = await getDataFromSearch(str)
  if (token) return `addresses/${token}`

  // Final fallback
  return `${searchUri}${str}`
}

app.get('/:id', async (req, res) => {
  const id = req.params.id
  if (id === 'favicon.ico') {
    res.end()
    return
  }
  const redirect = await getRouteFromString(id)
  // NOTE: For testing
  // res.send(`Redirect Here: ${redirect}`)
  res.redirect(`${baseUri}${redirect}`)
})

app.listen(port, () => console.log(`Listening on port ${port}!`))
