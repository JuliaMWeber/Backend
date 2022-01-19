const express = require('express');
//const request = require('request')
//const path = require('path')
const app = express();

//const bodyParser = require('body-parser');  //
const cors = require('cors');


//app.use(express.static(path.join(__dirname, 'public')))
//Zugriff auf index.html 
const PORT = process.env.PORT || 3000;
//app.use(bodyParser.json());  //
app.use(express.json());


app.use(cors());
const router = require("./routes/router.js");
app.use("/api", router);
app.listen(PORT, () => console.log("Server running on port" + PORT));

//app.get('/', (req,res) => {res.send('Hello World1')})
app.get('/', (req,res) => {res.send(req.query.search)}) //??

