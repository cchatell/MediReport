var ovh = require('ovh')({
  appKey: '01pZ581aNeX265Kk',
  appSecret: 'Nny6LTEWuT0iEFsp02fHJMxfwK8DQoYp',
  consumerKey: 'svS4vQ52BSmiCGqJ7icfyJhBkN57CuP7'
});

 // Get the serviceName (name of your sms account)
ovh.request('GET', '/sms', function (err, serviceName) {
  if(err) {
    console.log(err, serviceName);
  }
  else {
    console.log("My account SMS is " + serviceName);

    // Send a simple SMS with a short number using your serviceName
    ovh.request('POST', '/sms/' + serviceName + '/jobs', {
      message: 'Hello World!',
      senderForResponse: true,
      receivers: ['0033678207112']
    }, function (errsend, result) {
      console.log(errsend, result);
    });
  }
});