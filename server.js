// server.js - Node.js backend with Express and MySQL
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS for frontend requests
app.use(cors());
app.use(express.json());

// Database configuration
const dbConfig = {
  host: process.env.DBHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.DBPORT
};

// Create database connection pool
const pool = mysql.createPool(dbConfig);

// root URL '/'
app.get('/', (req, res) => {
  res.send('Hello, world! What are you doing here?');
});

// Get elements from cigarettes brands table
app.get('/viktor_db/cigarette_brands', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id from brands");
    res.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Get elements from cigarettes table
app.get('/viktor_db/cigarettes', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT brand,name, price_pack FROM cigarettes");
    
    // Currency formatter
    const formatter = new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    });

    const formattedRows = rows.map(row => {
      return {
        brand: row.brand,
        name: row.name,
        'price/pack': formatter.format(Number(row.price_pack) || 0)
      };
    });
    
    res.json(formattedRows);
    
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

});
















