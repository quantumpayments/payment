module.exports = handler

var debug  = require('debug')('qpm_balance:balance')
var fs     = require('fs')
var qpm_ui = require('qpm_ui');
var wc_db  = require('wc_db')
var wc     = require('webcredits')


function createCredit(source, amount, currency, destination, description, context) {
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


  if (description && description !== '') {
    credit["https://w3id.org/cc#description"] = description
  }

  if (context && context !== '') {
    credit["https://w3id.org/cc#context"] = context
  }

  if (currency) {
    credit["https://w3id.org/cc#currency"] = currency
  } else {
    credit["https://w3id.org/cc#currency"] = defaultCurrency
  }

  return credit
}




function handler(req, res) {

  var origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  var defaultCurrency = res.locals.config.currency || 'https://w3id.org/cc#bit';

  var source      = req.session.userId;
  var destination = req.body.destination;
  var currency    = req.body.currency || defaultCurrency;
  var amount      = req.body.amount;
  var timestamp   = null;
  var description = req.body.description;
  var context     = req.body.context;


  var source      = req.session.userId

  if (!req.session.userId) {
    res.send('must be authenticated')
    return
  }


  var config = res.locals.config

  var sequelize = wc_db.getConnection(config.db)

  var credit = createCredit(source, amount, currency, destination, description, context)
  console.log(credit)


  if (credit) {
    wc.insert(credit, sequelize, config, function(err, ret){
      if (err) {
        debug(err);
      } else {
        debug(ret);
        if (ret === null) {
          ret = 0
        }
        var balance = Math.round(ret).toString()

        res.status(200)
        res.header('Content-Type', 'text/html');

        config.ui.balance = balance;

        res.render('pages/payment/payment', { ui : config.ui })

      }
      sequelize.close();
    });
  } else {
    res.render('pages/payment/payment', { ui : config.ui })
  }


}
