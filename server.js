'use strict';

var restify = require('restify'),
    usher = require('usher'),
    AWS = require('aws-sdk'),
    winston = require('winston');

winston.level = 'debug';
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, { level: 'debug', colorize: true });


AWS.config.update({
  region: 'us-east-1'
});

var server = restify.createServer({
  name: "Order Workflow Manager",
});

// listen for uncaught exceptions and log as errors.
server.on('uncaughtException', function(req, resp, route, err) {
  winston.info("ERROR", err);
  resp.send(500, {
    message: "Internal Server Error"
  });
});

server.listen(8080, '0.0.0.0', () => {
  winston.info("Server listening on 8080 ...")
});

// Routing

server.get('/', (req, res, next) => {
  let payload = {
    message: "This is the Order Workflow Manager service."
  };
  res.send(200, payload);
  return next();
});

server.get("/wf/start/:prodId", (req, res, next) => {

  var wf = usher.workflow('example-order-manager', 'karl-test-swf-domain');
  wf.execute({
                productId: req.params.prodId,
                destination: '744 Main Street Chicago, IL'
              },
             '1.0.0',
             function (err, runId, workflowId) {
               let payload = {
                 message: "Workflow started",
                 productId: req.params.prodId,
                 runId: runId,
                 worflowId: workflowId
               };
               res.send(200, payload);
               winston.info("runId: " + runId + " workflowId: " + workflowId);
               return next();
             }
  );

});
