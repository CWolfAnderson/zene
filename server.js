const bodyParser = require('body-parser');
const express = require('express');

const app = express();
const port = process.env.PORT || 9001;

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json()); 

if (process.env.NODE_ENV === 'production') { 
  app.use(express.static('client/build')); 
} 

app.listen(port, () => console.log(`Server started on port ${port}`));