#!/usr/bin/env node

var wc = require('webcredits')

var config = wc.getConfig();

config.database = 'melvincarvalho'
config.wallet   = 'https://melvincarvalho.com/wallet/small.ttl#this'


var sequelize = wc.setupDB(config);

console.log(config)

var source      = 'https://workbot.databox.me/profile/card#me'
var amount      = 5
var destination = 'https://melvincarvalho.com/#me'
var currency    = 'https://w3id.org/cc#bit'


function createCredit(source, amount, currency, destination) {
  var credit = {}

  var defaultCurrency = 'https://w3id.org/cc#bit'

  if (source) {
    credit["https://w3id.org/cc#source"] = source
  } else {
    return
  }

  if (amount) {
    credit["https://w3id.org/cc#amount"] = amount
  } else {
    return
  }

  if (destination) {
    credit["https://w3id.org/cc#destination"] = destination
  } else {
    return
  }

  if (currency) {
    credit["https://w3id.org/cc#currency"] = currency
  } else {
    credit["https://w3id.org/cc#currency"] = defaultCurrency
  }

  return credit
}


var credit = createCredit(source, amount, currency, destination)


wc.insert(credit, sequelize, config, function(err, res) {
   if (!err) {
     console.log(res)
     sequelize.close()
   } else {
     console.error(err)
   }
})

