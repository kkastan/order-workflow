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

var activities = usher.activities('example-order-manager', 'karl-test-swf-domain')
  .activity('test-begin-order', '1.0.0', (task)=>{
    try {
      winston.info(task.workflowExecution.runId + "\tbeginning order ...");
      //winston.info("begining order ... ", task.input);
      task.success({ input: task.input._input });
    } catch (ex) {
      winston.info("error: ", ex)
      task.failed('application-error', { 'reason': ex });
    }
  })
  .activity('test-check-shipping', '1.0.0', (task)=>{
    try {
      winston.info(task.workflowExecution.runId + "\tchecking for shipping availability ...");
      task.success({ 'result': 'destination ok'});
    } catch (ex) {
      task.failed('application-error', { 'reason': ex });
    }
  })
  .activity('test-check-stock', '1.0.0', (task)=>{
    try {
      winston.info(task.workflowExecution.runId + "\tchecking stock for product: " + task.input._input.productId);
      let productId = parseInt(task.input._input.productId);
      if (isNaN(productId)) {
        task.failed('application-error', { 'reason': 'invalid product id'});
      } else {
        task.success({'in_stock': true});
      }
    } catch (ex) {
      task.failed('application-error', { 'reason': ex });
    }
  })
  .activity('test-process-payment', '1.0.0', (task)=>{
    try {
      winston.info(task.workflowExecution.runId + "\tprocessing payment...");
      task.success({"result": "yes"});
    } catch (ex) {
      task.failed('application-error', { 'reason': ex });
    }
  })
  .activity('test-ship-order', '1.0.0', (task)=>{
    try {
      winston.info(task.workflowExecution.runId + "\tshipping order");
      task.success({"result": "yes"});
    } catch (ex) {
      task.failed('application-error', { 'reason': ex });
    }
  });

activities.start();
