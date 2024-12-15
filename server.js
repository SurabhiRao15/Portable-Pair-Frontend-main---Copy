const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' })); // Increase limit for larger QR code images
app.use(express.static('public')); // Serve static files from the public folder

// Serve the main HTML pages

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/manufacturer', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'manufacturer.html'));
});

app.get('/seller', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'seller.html'));
});

app.get('/customer', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'customer.html'));
});

app.get('/verify', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'verify.html'));
});

// Endpoint to save QR code
app.post('/qrcode', (req, res) => {
    const { qrDataUrl, filename } = req.body;

    if (!qrDataUrl || !filename) {
        return res.status(400).json({ error: 'QR code data and filename are required' });
    }

    // Remove the "data:image/png;base64," prefix
    const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '');

    // Save the file
    const filePath = path.join(__dirname, 'public', 'qrcodes', filename);
    fs.writeFile(filePath, base64Data, 'base64', (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to save QR code' });
        }
        res.json({ message: 'QR code saved successfully' });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
