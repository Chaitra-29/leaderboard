// const express = require("express");
// const port = process.env.PORT || 8080;
// const app = express();

// app.use(express.static(__dirname + "/build/"));
// app.get(/.*/, function(req, res) {
//   res.sendfile(__dirname + "/build/index.html");
// });
// app.listen(port);

// console.log("Server started...");


const express = require("express");
const port = process.env.PORT || 8080;
const app = express();

let protectedfiles = ['transformed.js', 'main.css', 'favicon.ico']
app.use(express.static(__dirname+'/build'));
app.get("*", (req, res) => {

  let path = req.params['0'].substring(1)

  if (protectedfiles.includes(path)) {
    // Return the actual file
    res.sendFile(__dirname+'/build/${path}');
  } else {
    // Otherwise, redirect to /build/index.html
    res.sendFile(__dirname+'/build/index.html');
  }
});

app.listen(port);

console.log("Server started...");