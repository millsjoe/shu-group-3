const express = require('express');
const app = express();

//Routes
app.use("/", require("./routes/index.js"));


const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));

// unsure how to connect the html to the localhost
app.get("/", (req, res) => {
  res.sendFile("index.html");
});
