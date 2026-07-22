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
    if (result.length === 0 || result[0].deleted === 1) return res.status(400).json({ msg: 'ชื่อผู้ใช้ไม่ถูกต้อง' });

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



// Get All User Data
router.get('/', (req, res) => {
  db.query('SELECT * FROM users', (err, result) => {
    if (err) return res.status(500).json({ msg: 'Server Error' });
    res.status(200).json(result.filter((user) => user.role === 'user' && user.deleted === 0));
  })
})



// UPDATE User Data
router.put('/:id', (req, res) => {
  const formData = req.body;
  const user_id = req.params.id;

  if (!user_id) return res.status(400).json({ msg: 'ไม่พบ id ของผู้ใช้' });
  if (!formData) return res.status(400).json({ msg: 'กรุณากรอกข้อมูลให้ครบถ้วน' });

  if (formData.password !== '') {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(formData.password, salt);

    db.query('UPDATE users SET username = ?, password = ?, name = ?, email = ?, phone = ?, address = ?, subdistrict = ?, district = ?, province = ?, postal_code = ? WHERE id = ?',
    [formData.username, passwordHash, formData.name, formData.email, formData.phone, formData.address, formData.subdistrict, formData.district, formData.province, formData.postal_code, user_id],
    (err, result) => {
      if (err) return res.status(500).json({ msg: 'Server Error' });
      res.status(200).json({ msg: 'อัพเดตข้อมูลสําเร็จ!', data: result });
    })
  } else {
    db.query('UPDATE users SET username = ?, name = ?, email = ?, phone = ?, address = ?, subdistrict = ?, district = ?, province = ?, postal_code = ? WHERE id = ?',
    [formData.username, formData.name, formData.email, formData.phone, formData.address, formData.subdistrict, formData.district, formData.province, formData.postal_code, user_id],
    (err, result) => {
      if (err) return res.status(500).json({ msg: 'Server Error' });
      res.status(200).json({ msg: 'อัพเดตข้อมูลสําเร็จ!', data: result });
    })
  }
})


// Delete User Data
router.delete('/:id', (req, res) => {
  const user_id = req.params.id;
  if (!user_id) return res.status(400).json({ msg: 'ไม่พบ id ของผู้ใช้' });

  db.query('UPDATE users SET deleted = 1 WHERE id = ?',
  [user_id],
  (err, result) => {
    if (err) return res.status(500).json({ msg: 'Server Error' });
    res.status(200).json({ msg: 'ลบข้อมูลผู้ใช้สําเร็จ!' });
  })
})


// Get Address User data
router.get('/address/:id', (req, res) => {
  const user_id = req.params.id;
  if (!user_id) return res.status(400).json({ msg: 'ไม่พบ id ของผู้ใช้' });

  db.query('SELECT * FROM users WHERE id = ?',
  [user_id],
  (err, result) => {
    if (err) return res.status(500).json({ msg: 'Server Error' });

    const data = {
      fullName: result[0].name,
      phone: result[0].phone,
      houseNo: result[0].address,
      subDistrict: result[0].subdistrict,
      district: result[0].district,
      province: result[0].province,
      postalCode: result[0].postal_code
    }

    res.status(200).json(data);
  })
})



module.exports = router;