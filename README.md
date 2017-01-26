# order-workflow

Simple proof of concept illustrating the use of SWF with node.js and the node-usher library.

See:

* https://aws.amazon.com/documentation/swf/
* https://www.npmjs.com/package/usher

Components:

* activities.js - polls SWF for and executes activity tasks
* decisions.js - polls SWF for and executes decision tasks
* server.js - exposes a single http GET method to trigger a workflow

Prerequesites

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
