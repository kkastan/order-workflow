'use strict';

var usher = require('usher'),
    AWS = require('aws-sdk'),
    winston = require('winston');

AWS.config.update({
  region: 'us-east-1'
});

winston.level = 'debug';
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, { level: 'debug', colorize: true });

var workflow = usher.workflow('example-order-manager', 'karl-test-swf-domain');

workflow.version('1.0.0')
        .activity('test-begin-order')
        .activity('test-check-shipping', ['test-begin-order'])
        .activity('test-check-stock', ['test-begin-order'])
        .activity('test-process-payment', ['test-check-shipping', 'test-check-stock'])
        .activity('test-ship-order', ['test-process-payment']);

workflow.start();

// var wf = usher.workflow('example-order-manager', 'karl-test-swf-domain');
// wf.execute({
//               productId: 'prod123456',
//               destination: '744 Main Street Chicago, IL'
//             },
//            '1.0.0',
//            function (err, runId, workflowId) {
//               console.log("runId: " + runId + " workflowId: " + workflowId);
//             }
// );
