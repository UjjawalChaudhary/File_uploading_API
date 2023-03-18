const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/Assignment_App', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('MongoDB connected!');
});

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Define file model
const fileSchema = new mongoose.Schema({
  name: String,
  path: String
});
const File = mongoose.model('File', fileSchema);

// Handle file upload
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = new File({
      name: req.file.originalname,
      path: req.file.path
    });
    // const file = req.file;

    await file.save();
    res.send('File uploaded successfully!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
});

// Start server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
