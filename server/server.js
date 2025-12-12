/**
 * Backend Server for AdGenius AI
 * 
 * Required Dependencies:
 * npm install express cors body-parser googleapis bcryptjs dotenv
 * 
 * Setup:
 * 1. Create a project in Google Cloud Console
 * 2. Enable Google Sheets API
 * 3. Create OAuth 2.0 Client ID or Service Account credentials
 * 4. Download JSON and save as 'credentials.json' in this folder
 * 5. Run: node server.js
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// --- CONFIGURATION ---
const SPREADSHEET_ID = "1mE66ZN9KYM2X88_5JPi8H9x45GVx9Rcc";
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');

app.use(cors());
app.use(bodyParser.json());

// --- GOOGLE SHEETS AUTH HELPER ---
async function getAuthClient() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error('credentials.json not found. Please upload your OAuth JSON file.');
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: SCOPES,
  });

  return await auth.getClient();
}

async function getSheetInstance() {
  const authClient = await getAuthClient();
  return google.sheets({ version: 'v4', auth: authClient });
}

// --- API ROUTES ---

// SIGNUP ROUTE
app.post('/api/signup', async (req, res) => {
  const { firstName, lastName, email, phone, country, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const sheets = await getSheetInstance();

    // 1. Check if email already exists
    // We read Column C (Email)
    const readResult = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!C:C',
    });

    const emails = readResult.data.values ? readResult.data.values.flat() : [];
    if (emails.includes(email)) {
      return res.status(409).json({ message: 'This email is already registered. Please log in.' });
    }

    // 2. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    const timestamp = new Date().toISOString();

    // 3. Append to Sheet
    // Columns: First Name, Last Name, Email, Phone, Country, Password, Timestamp
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A:G',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[firstName, lastName, email, phone, country, hashedPassword, timestamp]],
      },
    });

    return res.status(201).json({ message: 'Your account has been created successfully.' });

  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// LOGIN ROUTE
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const sheets = await getSheetInstance();

    // 1. Get all data to find user
    const readResult = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A:G',
    });

    const rows = readResult.data.values || [];
    
    // Find row with matching email (Index 2 is Email)
    const userRow = rows.find(row => row[2] === email);

    if (!userRow) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // 2. Verify Password (Index 5 is Hashed Password)
    const storedHash = userRow[5];
    const isMatch = await bcrypt.compare(password, storedHash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // 3. Success
    res.json({
      message: 'Login successful! Welcome back.',
      user: {
        firstName: userRow[0],
        lastName: userRow[1],
        email: userRow[2],
        country: userRow[4]
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend Server running on http://localhost:${PORT}`);
  console.log('Ensure credentials.json is present for Google Sheets access.');
});