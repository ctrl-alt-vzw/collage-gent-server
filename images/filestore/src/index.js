
import http from 'http';
import express from "express";
import multer from "multer"
import path  from "path";
import fs  from "fs";



// fix __dirname
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(req.body)
    cb(null, path.join(__dirname, './../uploads'))
  },
  filename: function (req, file, cb) {
    console.log(file)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    var ext = file.originalname.split('.').pop();
    req.body.imageURI =  file.fieldname + '-' + uniqueSuffix + '.' + ext;
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext)
  }
})

const upload = multer({ storage: storage })



// API endpoints
const port = 3000;



const app = express();
http.Server(app); 


// put the HTML file containing your form in a directory named "public" (relative to where this script is located)

app.use(express.json())

// app.get("/", express.static(path.join(__dirname, './../uploads')));
app.get('/uploads/:fileName', function (req, res) {
  const filePath = path.join(__dirname, './../uploads', req.params.fileName)
  res.sendFile(filePath);
});



app.post('/upload', upload.single('clipping'), function (req, res, next) {
  // req.file is the `avatar` file
  console.log(req.body)
  // req.body will hold the text fields, if there were any
  res.send({
    imageURI: req.body.imageURI
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})
