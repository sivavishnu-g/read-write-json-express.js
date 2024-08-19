const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyparser = require('body-parser')

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(bodyparser.urlencoded({extended:true}))

// Set the views directory and EJS as the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Route to display data from JSON file
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'data.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read file' });
    }
    res.render('read', { data: JSON.parse(data) });
  });
});

app.post('/data', (req, res) => {
    const filePath = path.join(__dirname, 'data.json');
    
    // Read the existing data from the file
    fs.readFile(filePath, 'utf8', (err, fileData) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to read file' });
      }
      
      let dataArray = JSON.parse(fileData);
      
      // Get new data from the form
      const newData = {
        name: req.body.name,
        email: req.body.email,
        age: req.body.age
      };

      console.log("new name == "+ newData.name)
      
      dataArray.push(newData);
      
      // Write updated data back to the file
      fs.writeFile(filePath, JSON.stringify(dataArray, null, 2), 'utf8', (err) => {
        console.log("success !")
        if (err) {
          return res.status(500).json({ error: 'Failed to write file' });
        }
        res.redirect('/'); // Redirect to the home page to see the updated data
      });
    });
  });

// Start the server
app.listen(port, () => {
  console.log(`Server running at ${port}`);
});
