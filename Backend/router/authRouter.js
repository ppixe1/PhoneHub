const express = require('express');
const router = express.Router();
const db = require('../db.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const secret_key = process.env.SECRET_KEY;

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
      if (result.length > 0) return res.status(400).json({ msg: 'มีคนใช้ชื่อนี้ในระบบแล้ว' });
      
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

        res.status(200).json({ msg: 'สมัครสมาชิกสําเร็จ!', token });
      })
    }
  )
})



// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) return res.status(400).json({ msg: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่านให้ครบถ้วน' });

  db.query('SELECT * FROM users WHERE username = ?',
  [username],
  (err, result) => {
    if (err) return res.status(500).json({ msg: 'Server Error' });
    if (result.length === 0) return res.status(400).json({ msg: 'ชื่อผู้ใช้ไม่ถูกต้อง' });

    const isMatch = bcrypt.compareSync(password, result[0].password);
    if (!isMatch) return res.status(400).json({ msg: 'รหัสผ่านไม่ถูกต้อง' });

    const token = jwt.sign(
      { user_id : result[0].id, role: result[0].role, username: result[0].username, name: result[0].name },
      secret_key,
      { expiresIn: '8h' }
    )

    res.status(200).json({ msg: 'เข้าสู่ระบบสําเร็จ!', token });
  })
})



module.exports = router;