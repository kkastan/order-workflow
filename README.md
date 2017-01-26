# order-workflow

Simple proof of concept illustrating the use of SWF with node.js and the node-usher library.

See:

* https://aws.amazon.com/documentation/swf/
* https://www.npmjs.com/package/usher

## Components

* activities.js - polls SWF for and executes activity tasks
* decisions.js - polls SWF for and executes decision tasks
* server.js - exposes a single http GET method to trigger a workflow

## Prerequesites

The activity task names, decision task names, workflow name, versions and domain are hard coded. Its a POC. These resources need to exist before running this example.

* swf domain: karl-test-swf-domain
* workflow types:
  * example-order-manager 
* activity types:
  * test-begin-order
  * test-check-shipping
  * test-check-stock
  * test-process-payment
  * test-ship-order

All versions are 1.0.0

## Running a Workflow

To start the server
```
$ docker-compose up order-wfm
```

To start the activity poller
```
$ docker-compose run order-wfm nodemon activities.js 
```

To start the decision poller
```
$ docker-compose run order-wfm nodemon decisions.js
```

To trigger a workflow:
```
$ curl localhost:8080/wf/start/12345
{"message":"Workflow started","productId":"12345","runId":"22ZtdCrDKFQLRl5CSnsMv5qDSuRnywBApAyc6eXawkOk8=","worflowId":"18293494323025428"}
```

## Open Issues

**Initial Decision Timeout**

Occasionally there is a delay between starting a workflow and the execution of the first task. Inspecting the event history in this case shows that the first decision task times out. Another decision task is then scheduled and runs. The rest of the workflow completes without delay. This behavior is observed intermittently. It is not clear what causes this - my internet connection, the use of nodemon, a bug in node-usher, the swf service itself, etc.

**Error and timeout handling**

Programatically failing a task and letting SWF know whether or not the task should be retried is straightforward. 

The following aspects of workflow management, at least within the node-usher API, is not clear:
* being notified of a workflow's failure along with the context of the failed execution. The decision poller will log when a workflow execution fails, but it's not clear if there is a hook provided to take action in this case or whether or not the context of the failed workflow execution is provided.
* being notified of an activity task timeout. It's not clear if the deicsion poller gets notified of this type of event and provides a means to take action. 

**AWS node.js client**

If either of the open issues are important and not easily solved for with the node-usher api it is likely they can be handled with an additional integration with SWF using the AWS node.js client.
