const express = require('express');
const path = require('path');
const fileupload = require('express-fileupload');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/your_database_name', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define a schema for storing file information
const fileSchema = new mongoose.Schema({
    imageName: String,
    imagePath: String
});

const File = mongoose.model('File', fileSchema);

let initial_path = path.join(__dirname, "public");

const app = express();
app.use(express.static(initial_path));
app.use(fileupload());

app.get('/', (req, res) => {
    res.sendFile(path.join(initial_path, "home.html"));
});

app.get('/editor', (req, res) => {
    res.sendFile(path.join(initial_path, "editor.html"));
});

// upload link
app.post('/upload', (req, res) => {
    let file = req.files.image;
    let date = new Date();
    // image name
    let imagename = date.getDate() + date.getTime() + file.name;
    // image upload path
    let imagePath = 'public/uploads/' + imagename;

    // create upload
    file.mv(imagePath, (err, result) => {
        if (err) {
            throw err;
        } else {
            // Save file information to MongoDB
            const newFile = new File({
                imageName: imagename,
                imagePath: imagePath
            });

            newFile.save((err) => {
                if (err) {
                    throw err;
                } else {
                    // Return the image upload path
                    res.json(`uploads/${imagename}`);
                }
            });
        }
    });
});

app.get("/:blog", (req, res) => {
    res.sendFile(path.join(initial_path, "blog.html"));
    console.log("Data Scuccessfully Stored");
});

app.use((req, res) => {
    res.json("404");
});

app.listen(3000, () => {
    console.log('listening......');
});
