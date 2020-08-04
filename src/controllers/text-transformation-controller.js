const mondayService = require('../services/monday-service');
const transformationService = require('../services/transformation-service');
const { TRANSFORMATION_TYPES } = require('../constants');
const { get } = require('../routes/transformation');
const { parse } = require('querystring');
const API_TOKEN = process.env.API_TOKEN;
const ALPHA_VANTAGE_API = process.env.ALPHA_VANTAGE;

async function transformToMondayColumn(req, res) {
  const { payload } = req.body;
  const { inboundFieldValues } = payload;
  const { boardId, itemId, sourceColumnId, targetColumnId } = inboundFieldValues;

  const token = API_TOKEN;
  const text = await mondayService.getColumnValue(token, itemId, sourceColumnId);

  if (!text) {
    return res.status(200).send({});
  }
  var from = await mondayService.getColumnName(token, boardId, sourceColumnId);
  from = String(from).slice(-3);

  var to = await mondayService.getColumnName(token, boardId, targetColumnId);
  to = String(to).slice(-3);

  await transformationService.changeCurrency(text, from, to, ALPHA_VANTAGE_API, function (response) {
    response = String(response);
    try {
      response = JSON.parse(response);
      rate = response['Realtime Currency Exchange Rate']['5. Exchange Rate'];
      var text1 = text.slice(1, -1);
      console.log('From' + parseInt(text1));
      var val = parseInt(text1);
      val = rate * val;
      console.log(val);
    } catch (err) {
      console.error(err);
      val = 0;
    }
    val = JSON.stringify(val);
    console.log(val);
    mondayService.changeColumnValue(token, boardId, itemId, targetColumnId, val);
  });

  return res.status(200).send({});
}

async function subscribe(req, res) {
  return res.status(200).send({
    webhookId: req.body.payload.subscriptionId,
    result: 'it was cool',
  });
}

async function unsubscribe(req, res) {
  return res.status(200).send({ result: 'it was cool' });
}

module.exports = {
  transformToMondayColumn,
  subscribe,
  unsubscribe,
};
