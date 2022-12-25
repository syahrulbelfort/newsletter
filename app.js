const { log } = require('console');
const { json } = require('express');
const express = require('express');
const port = 4000;
const app = express();
const https = require('https');

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('HELLO MOM!');
});

app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/public/signup.html');
});

// Manage post request on home route and
// Send data to the MailChimp account via API
app.post('/signup', function (req, res) {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;

  var data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  // Converting string data to JSON data
  const jsonData = JSON.stringify(data);
  const url = 'https://us21.api.mailchimp.com/3.0/lists/d3659b964d';
  const options = {
    method: 'POST',
    auth: 'syahrul:af3c0038c87131322bd5245c94fad3ab-us21',
  };

  // On success send users to success, otherwise on failure template
  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + '/success.html');
    } else {
      res.sendFile(__dirname + '/failure.html');
    }
    response.on('data', function (data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.listen(port, () => {
  console.log(`server is running on port :${port}`);
});
