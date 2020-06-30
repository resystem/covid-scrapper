const launch = require('@serverless-chrome/lambda')

const handler = require('./j0c3ib4qdph___index.js')
const options = {"chromePath":"/var/task/headless-chromium","flags":[]}

module.exports.getDataFunction = function ensureHeadlessChrome (
  event,
  context,
  callback
) {
  return (typeof launch === 'function' ? launch : launch.default)(options)
    .then(instance =>
      handler.getDataFunction(event, context, callback, instance))
    .catch((error) => {
      console.error(
        'Error occured in serverless-plugin-chrome wrapper when trying to ' +
          'ensure Chrome for getDataFunction() handler.',
        options,
        error
      )

      callback(error)
    })
}