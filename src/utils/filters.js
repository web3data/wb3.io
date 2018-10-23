// -------------------------------------------------------------------------------------------------
//
// Copyright © 2017-2018 Amberdata, Inc.
// California, USA
// All rights reserved.
//
// This software (the "Software") is provided pursuant to the license agreement you entered into
// with Amberdata, Inc. (the "License Agreement"). The Software is the confidential and
// proprietary information of Amberdata, * Inc., and you shall use it only in accordance with the
// terms and conditions of the License Agreement.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND "AS AVAILABLE." AMBERDATA, INC. MAKES NO WARRANTIES OF
// ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO THE IMPLIED WARRANTIES AND
// CONDITIONS OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT.
//
// -------------------------------------------------------------------------------------------------

import Vue from 'vue'
// import customIcons from './customIcons'
//
// const iconFile = customIcons[9].document
// const iconFileCodeO = `
// <svg version="1.1" role="presentation" width="25" height="25" viewBox="0 0 512 512" class="fa-icon"><path d="${
//   iconFile.d
// }"></path></svg>
// `

// Static map of number formats.
const metric = [
  { value: 1, symbol: ' ' },
  { value: 1e3, symbol: 'k' },
  { value: 1e6, symbol: 'M' },
  { value: 1e9, symbol: 'G' },
  { value: 1e12, symbol: 'T' },
  { value: 1e15, symbol: 'P' }
  // { value: 1E18, symbol: 'E' },
]

const wei = [
  { value: 1, symbol: 'wei' },
  // { value: 1e3, symbol: 'Kwei' },
  // { value: 1e6, symbol: 'Mwei' },
  { value: 1e9, symbol: 'Gwei' },
  // { value: 1e12, symbol: 'µether' },
  // { value: 1e15, symbol: 'mether' },
  { value: 1e18, symbol: 'ether' }
  // { value: 1e21, symbol: 'kether' },
  // { value: 1e24, symbol: 'Mether' },
  // { value: 1e27, symbol: 'Gether' },
  // { value: 1e30, symbol: 'Tether' },
]

const dynamicUnit = (unit, token) => {
  return [
    { value: 1, symbol: `${unit}` },
    // { value: 1e3, symbol: `K${unit}` },
    // { value: 1e6, symbol: `M${unit}` },
    // { value: 1e9, symbol: `G${unit}` },
    // { value: 1e12, symbol: `µ${token}` },
    // { value: 1e15, symbol: `m${token}` },
    { value: 1e18, symbol: `${token}` }
    // { value: 1e21, symbol: `k${token}` },
    // { value: 1e24, symbol: `M${token}` },
    // { value: 1e27, symbol: `G${token}` },
    // { value: 1e30, symbol: `T${token}` },
  ]
}

const milliseconds = [
  // { value: 1, symbol: 'ms', div: 60 },
  { value: 1e3, symbol: 'sec', div: 60 },
  { value: 6e4, symbol: 'min', div: 60 },
  { value: 36e5, symbol: 'hr', div: 24 },
  { value: 864e5, symbol: 'dy', div: 7 },
  { value: 6048e5, symbol: 'wk', div: 4 },
  { value: 2592e6, symbol: 'mon', div: 12 },
  { value: 31104e6, symbol: 'yr', div: 1 }
]

const units = {
  wei,
  metric,
  milliseconds
}

const addCommas = x => {
  if (!x) return 0
  const tmp = x.toString().split('.')
  tmp[0] = tmp[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return tmp.join('.')
}

function numFormatObj(keys, amount, digits = 2) {
  const reg = /\.0+$|(\.[0-9]*[1-9])0+$/
  let i
  const num =
    amount && typeof amount.value !== 'undefined'
      ? parseFloat(amount.value)
      : parseFloat(amount)
  // Milliseconds Extra Formatting
  if (keys[0].symbol === 'sec') {
    for (i = keys.length - 1; i > 0; i--) {
      if (num >= keys[i].value) break
    }

    const item = keys[i]
    const hasPrev = i > 0
    const prevItem = hasPrev ? keys[i - 1] : {}
    const remainder = hasPrev ? (num % item.value) / item.value : 0
    const vNum = num / item.value
    const val = hasPrev ? Math.round(vNum - remainder) : vNum.toFixed(digits)
    const extraVal = hasPrev
      ? ` ${Math.round((num % item.value) / prevItem.value)}`
      : ''
    const extraSym = hasPrev ? prevItem.symbol : ''
    const str = `${val}${item.symbol}${extraVal}${extraSym}`

    return {
      formatted: str,
      short: str,
      value: addCommas(
        (num / keys[i].value).toFixed(digits).replace(reg, '$1')
      ),
      unit: item.symbol,
      symbol: item.symbol,
      raw: amount.value || amount
    }
  }

  for (i = keys.length - 1; i > 0; i--) {
    if (num >= keys[i].value) break
  }

  const keyValue = parseFloat(keys[i].value)
  const keySym = keys[i].symbol || amount.unit
  const keyFormatted = addCommas(
    (num / keyValue).toFixed(digits).replace(reg, '$1')
  )

  return {
    formatted: `${keyFormatted} ${keySym}`,
    short: `${keyFormatted}${keySym}`,
    value: keyFormatted,
    unit: keySym,
    symbol: keySym,
    raw: amount.value || amount
  }
}

const toTokenTransferAmount = obj => {
  const amount = obj.amount
  // pretty sure it's already an integer, but parseInt to be safe
  const decimals = parseInt(obj.decimals)
  if (!obj.isERC20) return amount
  if (amount.length > decimals)
    return (
      amount.slice(0, amount.length - decimals) +
      '.' +
      amount.slice(amount.length - decimals)
    )
  return '0.' + amount.padStart(decimals, '0')
}

const toWei = (num, digits = 2) => {
  // if we have previous value, use predefined unit & value
  if (num && typeof num.value !== 'undefined') {
    const u = num.unit && num.unit !== 0 ? ` ${num.unit}` : ''
    const n =
      num.value !== 0 ? parseFloat(num.value).toFixed(digits) : num.value
    return `${addCommas(n)}${u}`
  }
  if (!num) return 0
  return numFormatObj(wei, num, digits).formatted
}

// dynamic version of toWei based on network unit
const toRawUnit = (num, unit, token, digits = 2) => {
  if (!num) return 0
  return numFormatObj(dynamicUnit(unit, token), num, digits).formatted
}

const toMetric = (num, digits) => {
  if (!num) return 0
  return numFormatObj(metric, num, digits).formatted
}

const toUnitObj = (unit, num, digits) => {
  if (!num) return 0
  if (!unit || !units[unit]) return num
  return numFormatObj(units[unit], num, digits)
}

const toUnit = (unit, num, digits) => toUnitObj(unit, num, digits).formatted

const parseUnitNum = (num, unit, digits) => {
  if (!num) return 0
  if (!unit || !units[unit]) return num
  return numFormatObj(units[unit], num, digits).value
}

const parseUnitSym = (num, unit, digits) => {
  if (!num) return 0
  if (!unit || !units[unit]) return num
  return numFormatObj(units[unit], num, digits).symbol
}

const displayUnitNum = data => {
  if (!data) return ''
  const v = data.value ? data.value : data
  return `${parseFloat(v).toFixed(6)} ${data.unit}`
}

const convertNumToUnit = (num, unit, sym, digits) => {
  if (!num) return 0
  if (!sym || !unit || !units[unit]) return num
  let finNum = 0
  units[unit].forEach(u => {
    if (u.symbol === sym) finNum = parseFloat(num) * u.value
  })
  return digits ? finNum.toFixed(digits) : finNum
}

const hashShorten = (str, len) => {
  if (!str) return ''
  if (!len) return str && str.length > 10 ? `0x…${str.slice(-6)}` : str
  const half = Math.round(len / 2)
  return str && str.length > len
    ? `${str.substring(0, half)}…${str.slice(-half)}`
    : str
}

const hashShortenMultiple = (hashes, len) => {
  if (!hashes) return []
  if (typeof hashes === 'string') return [hashShorten(hashes, len)]
  if (!hashes || !Array.isArray(hashes) || hashes.length < 1) return []
  const result = []
  hashes.forEach(hash => {
    result.push(hashShorten(hash, len))
  })
  return result
}

const getEoaOrContract = (data, len) => {
  if (!data.to && !data.contractAddress) return ''
  const hashes = data.to
  // const hasContract =
  //   (data.to.length > 0 && data.to[0] === 'null') ||
  //   data.to === null ||
  //   data.to === 'null'
  // if (hasContract)
  //   return `${iconFileCodeO} ${hashShorten(data.contractAddress, 16)}`
  return hashShortenMultiple(hashes, len)
}

// REF:
// OLD: https://stackoverflow.com/questions/3745666/how-to-convert-from-hex-to-ascii-in-javascript
// NEW: https://stackoverflow.com/questions/13865302/how-to-convert-a-string-containing-utf8-hex-codes-to-a-javascript-string
const hexToString = hexx => {
  if (!hexx) return hexx
  try {
    return decodeURIComponent(
      hexx.replace(/\s+/g, '').replace(/[0-9a-f]{2}/g, '%$&')
    )
  } catch (e) {
    const hex = hexx.toString() //force conversion
    let str = ''
    for (var i = 0; i < hex.length && hex.substr(i, 2) !== '00'; i += 2) {
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
    }
    return str
  }
}

// Get function argument types from the params
const extractFnArgTypes = fn => {
  if (typeof fn !== 'string') return []
  const reg = new RegExp('(?:()([a-zA-Z0-9,]{3,})(?:))', 'g')
  const match = fn.match(reg)
  const types = match && match[1] ? match[1].split(',') : match

  return types
}

const formatArgumentByType = (arg, type) => {
  if (!type) return arg
  let s
  const t = type.replace(/[0-9]/g, '')

  switch (t) {
    case 'address':
      s = `0x${arg.substring(24, 64)}`
      break
    case 'uint':
      s = parseInt(arg, 16)
      break
    case 'int':
      s = parseInt(arg, 16)
      break
    case 'bool':
      // TODO: Verify byte version
      s = arg === 'true' || arg === true
      break
    default:
      s = arg
  }

  return s
}

const getListParams = query => {
  const q = query
  const pg = parseInt(q.page, 0)
  let str = ''
  if (q.page) str += `?page=${pg - 1}`
  if (q.size) str += `&size=${q.size}`

  return str
}

const objectToQuery = obj => {
  let q = ''
  Object.keys(obj).forEach(o => {
    q += `&${o}=${obj[o]}`
  })
  q = q.substring(1)
  return `?${q}`
}

const formatQueryParams = route => {
  const q = route.query
  const pg = parseInt(q.page, 10)
  const params = Object.assign({}, q)

  // adjustments for table/pagination
  if (q.page) params.page = pg - 1

  return objectToQuery(params)
}

const fromNow = ts => {
  if (process.server) return
  if (!ts) return window.moment().fromNow()
  return window.moment(ts).fromNow()
}

const dateTime = ts => {
  if (!ts) return window.moment().format('h:mma - MM/D/YY')
  return window.moment(ts).format('h:mma - MM/D/YY')
}

const removeSpecialChars = str => {
  if (!str) return str
  let q = str.replace(/[^\w\s]/gi, '').replace(/\\\.,'"/gi, '')
  if (typeof q !== 'number') q = q.toLowerCase()
  return q
}

const toGasPercentage = item => {
  const gasLimit =
    item.gasLimit && item.gasLimit.value ? item.gasLimit.value : item.value
  const gasUsed =
    item.gasUsed && item.gasUsed.value ? item.gasUsed.value : item.value
  if (!gasLimit) {
    return gasUsed
  }

  let gasPercentage = Math.round(
    (parseFloat(gasUsed) / parseFloat(gasLimit)) * 100
  )
  if (gasPercentage > 100) gasPercentage = 100
  return `${gasPercentage}%`
}

const toDuration = duration => {
  if (duration === 'undefined' || duration.value === 'undefined') return '-'
  const seconds = Math.round(duration.value)
  if (isNaN(Number(seconds))) return '-'
  return `${seconds}s`
}

const convertToCurrencyNumber = (value, currency) => {
  if (!currency || !currency.price) return null
  if (!value) return null
  const amount = parseFloat(value)
  const rate = parseFloat(currency.price)
  const calc = (amount * rate).toFixed(2)
  return calc
}

const convertToCurrency = (value, currency) => {
  return addCommas(convertToCurrencyNumber(value, currency))
}

const displayAsCurrency = value => {
  if (!value || isNaN(value)) return '-'
  // https://stackoverflow.com/questions/23887400/how-to-get-first-2-non-zero-digits-after-decimal-in-javascript
  let decimals = 1 - Math.floor(Math.log(value) / Math.log(10))
  if (!decimals || decimals < 2) decimals = 2
  if (decimals > 8) decimals = 8
  return `$${addCommas(parseFloat(value).toFixed(decimals))}`
}

// This requires data as an object with a value key
const preciseDecimal = (data, digits = 8) => {
  if (!data) return parseFloat(0).toFixed(digits)
  const val = data && data.value ? data.value : data
  return `${addCommas(parseFloat(val).toFixed(digits))}`
}

const toColorPercentage = percentage => {
  const value = !percentage || isNaN(percentage) ? '-' : `${percentage}%`
  const color = percentage > 0 ? 'green' : 'red'
  return {
    type: 'color',
    color,
    value
  }
}

const toBlockie = data => {
  return {
    type: 'avatar',
    data
  }
}

const toRawFixedValue = value => {
  return addCommas(parseFloat(value).toFixed(12))
}

const toTokenAmountName = data => {
  if (!data) return 'Amount'
  if (data.isERC20) return 'Quantity'
  if (data.isERC721) return 'Uuid'
  return 'Amount'
}

const displayEth = eth => {
  const result = eth < 1000 ? preciseDecimal(eth, 8) : preciseDecimal(eth, 2)
  return result
}

const filters = {
  addCommas,
  convertNumToUnit,
  convertToCurrencyNumber,
  convertToCurrency,
  displayAsCurrency,
  displayUnitNum,
  extractFnArgTypes,
  formatArgumentByType,
  fromNow,
  dateTime,
  getListParams,
  getEoaOrContract,
  formatQueryParams,
  hashShorten,
  hashShortenMultiple,
  hexToString,
  objectToQuery,
  parseUnitNum,
  parseUnitSym,
  removeSpecialChars,
  preciseDecimal,
  toUnitObj,
  toMetric,
  toUnit,
  toWei,
  toRawUnit,
  toGasPercentage,
  toDuration,
  toColorPercentage,
  toBlockie,
  toTokenTransferAmount,
  toRawFixedValue,
  toTokenAmountName,
  displayEth
}

// Setup global filters in vue
const vueFilters = Object.keys(filters)
vueFilters.forEach(k => Vue.filter(k, filters[k]))

export default filters
