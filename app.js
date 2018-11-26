const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Bodyparser Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Singup Route
app.post("/signup", (req, res) => {
  //   console.log(req.body);
  //   res.send("hello");
  // ES6 destructring syntax below
  const { firstName, lastName, email } = req.body;

  // Make sure fields are filled
  if (!firstName || !lastName || !email) {
    res.redirect("/fail.html");
    return;
  }

  // Construct requeset data
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const postData = JSON.stringify(data);

  const options = {
    url: "https://us19.api.mailchimp.com/3.0/lists/fab0b9292a",
    method: "POST",
    headers: {
      Authorization: "auth xxxxxxxx"
    },
    body: postData
  };
  request(options, (err, response, body) => {
    if (err) {
      res.redirect("/fail.html");
    } else {
      if (response.statusCode === 200) {
        res.redirect("/success.html");
      } else {
        res.redirect("/fail.html");
      }
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on ${PORT} ...`));
