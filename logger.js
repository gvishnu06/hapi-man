var winston = require('winston');

var logdata = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ json: false, timestamp: true, level : 'debug' }),
	new winston.transports.File({ filename: __dirname + '/info.log', json: false, level : 'verbose' })
  ],
  exceptionHandlers: [
    new (winston.transports.Console)({ json: false, timestamp: true , level : 'debug'}),
    new winston.transports.File({ filename: __dirname + '/exceptions.log', json: false, level : 'info' })
  ],
  exitOnError: false
});

module.exports = logdata;