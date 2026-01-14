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
  host: 'metro.proxy.rlwy.net',
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: '13604'
};

// Create database connection pool
const pool = mysql.createPool(dbConfig);

//root URL '/'
app.get('/', (req, res) => {
  res.send('Hello, world! What are you doing here?');
});

// Get elements from cigarettes table
app.get('/viktor_db/cigarettes', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT brand,name, price_pack AS 'price/pack' FROM cigarettes");
    
    // Currency formatter
    const formatter = new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    });

    const formattedRows = rows.map(row => {
      const priceValue = Number(row.price_pack) || 0;
      return {
        brand: row.brand,
        name: row.name,
        'price/pack': formatter.format(priceValue) 
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













