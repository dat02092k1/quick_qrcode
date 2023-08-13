const express = require('express');
const mongoose = require('mongoose');
const QRCode = require('qrcode');
const app = express();
const { faker } = require('@faker-js/faker');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/checkin_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const Checkin = require('./model/checkin.model');

// Generate QR code and store check-in data
app.get('/generateQR', async (req, res) => {
  try {
    const checkin = new Checkin({ name: faker.internet.userName() });
    await checkin.save();

    const checkinId = checkin._id.toString();
    const qrCodeData = `https://yourwebsite.com/checkin/${checkinId}`;

    QRCode.toDataURL(qrCodeData, (err, qrCodeURL) => {
      if (err) {
        console.error('Error generating QR code:', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.send(`<img src="${qrCodeURL}" alt="QR Code">`);
      }
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/qrCodeImage/:checkinId', (req, res) => {
    const checkinId = req.params.checkinId;
    const qrCodeData = `https://yourwebsite.com/checkin/${checkinId}`;
  
    QRCode.toDataURL(qrCodeData, (err, qrCodeURL) => {
      if (err) {
        console.error('Error generating QR code:', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.send(`<img src="${qrCodeURL}" alt="QR Code">`);
      }
    });
  });
   
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
