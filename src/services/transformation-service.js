const urllib = require('urllib');

class TransformationService {
  static async changeColumnValue(token, boardId, itemId, columnId, value) {
    try {
      const mondayClient = initMondayClient({ token });

      const query = `mutation change_column_value($boardId: Int!, $itemId: Int!, $columnId: String!, $value: JSON!) {
        change_column_value(board_id: $boardId, item_id: $itemId, column_id: $columnId, value: $value) {
          id
        }
      }
      `;
      const variables = { boardId, columnId, itemId, value };

      const response = await mondayClient.api(query, { variables });
      return response;
    } catch (err) {
      console.log(err);
    }
  }

  static async changeCurrency(amount, from, to, api_key, callback) {
    var url =
      'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=' +
      from +
      '&to_currency=' +
      to +
      '&apikey=' +
      api_key;

    urllib.request(url, { wd: 'nodejs' }, function (err, data, response) {
      var statusCode = response.statusCode;
      var finalData = data;
      return callback(finalData);
    });
  }
}

module.exports = TransformationService;
