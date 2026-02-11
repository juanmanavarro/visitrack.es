require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 8000;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TO_EMAIL = 'juanaco1.p@gmail.com';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Routes
app.post('/api/contact', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: 'Onboarding <onboarding@resend.dev>',
                to: [TO_EMAIL],
                subject: 'Nuevo Lead en Visitrack.es',
                html: `<p>Un nuevo usuario ha solicitado acceso:</p><p>Email: <strong>${email}</strong></p>`
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error from Resend:', errorData);
            return res.status(response.status).json(errorData);
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
