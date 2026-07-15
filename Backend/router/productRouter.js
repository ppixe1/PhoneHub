const express = require('express');
const router = express.Router();
const db = require('../db.js');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const secret_key = process.env.SECRET_KEY;

// Get all products
router.get('/', (req, res) => {
  db.query('SELECT * FROM products', (err, result) => {
    if (err) return res.status(500).json({ msg: 'Server Error' });
    res.status(200).json(result);
  })
})



// Get product in cart by UserID
router.get('/', (req, res) => {
  const token = req.headers.authorization;

  if (!token) return res.status(400).json({ msg: 'เกิดข้อผิดพลาด กรุณาเข้าสู่ระบบใหม่อีกครั้ง' });

  const data = jwt.verify(token, secret_key);
  const user_id = data.user_id

  db.query('SELECT * FROM cartitems WHERE id = ?', [user_id], (err, result) => {
    if (err) return res.status(500).json({ msg: 'Server Error' });
    res.status(200).json(result);
  })
})



// crate product
router.post('/', (req, res) => {
  const {
    brand,
    model,
    variation, //rom-color-stock-price
    img,
    specifications,
  } = req.body;
  
  if (!brand || !model || !ram || !variation || !img || !specifications) return res.status(400).json({ msg: 'กรุณากรอกข้อมูลให้ครบถ้วน' });

  db.query('INSERT INTO products (brand, model, variation, img, specifications) VALUES(?,?,?,?,?)',
  [brand, model, variation, img, specifications],
  (err, result) => {
    if (err) return res.status(500).json({ msg: 'Server Error' });
    res.status(200).json({ msg: 'สร้างสินค้าสําเร็จ!', result });
  })
})



// update product data by ID
router.put('/:id', (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ msg: 'กรุณากรอกรหัสสินค้าให้ครบถ้วน' });

  const {
    brand,
    model,
    variation, //rom-color-stock-price
    img,
    specifications,
  } = req.body;

  if (!brand || !model || !ram || !variation || !img || !specifications) return res.status(400).json({ msg: 'กรุณากรอกข้อมูลให้ครบถ้วน' });

  db.query('UPDATE products SET brand = ?, model = ?, variation = ?, img = ?, specifications = ? WHERE id = ?',
  [brand, model, variation, img, specifications, id],
  (err, result) => {
    if (err) return res.status(500).json({ msg: 'Server Error' });
    res.status(200).json({ msg: 'แก้ไขสินค้าสําเร็จ!', result });
  })
})



// delete product by ID
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ msg: 'กรุณากรอกรหัสสินค้าให้ครบถ้วน' });

  db.query('DELETE FROM products WHERE id = ?',
  [id],
  (err, result) => {
    if (err) return res.status(500).json({ msg: 'Server Error' });
    res.status(200).json({ msg: 'ลบสินค้าสําเร็จ!' });
  })
})


module.exports = router;