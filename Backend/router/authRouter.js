const express = require('express');
const router = express.Router();
const db = require('../db.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const secret_key = "adminPixel101"

// Register
router.post('/register', (req, res) => {
  const { 
    username,
    password,
    email,
    phone,
    name,
  } = req.body;

  db.query('SELECT * FROM users WHERE username = ?',
    [username],
    (err, result) => {
      if (err) return res.status(500).json({ msg: 'Server Error' });
      if (result.length > 0) return res.status(400).json({ msg: 'Username already exists' });
      
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(password, salt);

      const userData = {
        username: username,
        password: passwordHash,
        role: 'user',
        name: name,
        email: email,
        phone: phone,
        address: '',
        subdistrict: '',
        district: '',
        province: '',
        postal_code: ''
      }

      db.query('INSERT INTO users (username, password, role, name, email, phone, address, subdistrict, district, province, postal_code) VALUES(?,?,?,?,?,?,?,?,?,?,?)',
      [userData.username, userData.password, userData.role, userData.name, userData.email, userData.phone, userData.address, userData.subdistrict, userData.district, userData.province, userData.postal_code],
      (err, result) => {
        if (err) return res.status(500).json({ msg: 'Server Error' });

        const token = jwt.sign(
          { user_id : result.insertId, role: userData.role, username: userData.username, name: userData.name },
          secret_key,
          { expiresIn: '8h' }
        )

        res.status(200).json({ msg: 'User registered successfully', token });
      })
    }
  )
})


module.exports = router;