const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'bxyiyxcx1lcr7kordekp-mysql.services.clever-cloud.com', // XAMPP default
  user: 'u6lkckjy4tzdj3pa',      // Default user
  password: 'v32iGlN6pT61QOvp4fjV',      // No password (unless set)
  database: 'bxyiyxcx1lcr7kordekp', // Replace with your actual DB name
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err);
  } else {
    console.log('✅ Connected to MySQL (XAMPP)');
  }
});

module.exports = db;
