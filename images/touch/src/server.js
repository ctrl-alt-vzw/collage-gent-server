const path = require('path');
const express = require('express');



const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 8080 : process.env.PORT;
const app = express();

const staticPath = path.join(__dirname, '../dist')

app.use(express.static(staticPath));

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s.', port);
});