const express = require('express');
const router = express.Router();
const db = require('../db.js');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const secret_key = process.env.SECRET_KEY;


// Get product in cart by UserID
router.get('/', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  if (!token) return res.status(400).json({ msg: 'เกิดข้อผิดพลาด กรุณาเข้าสู่ระบบใหม่อีกครั้ง' });

  const data = jwt.verify(token, secret_key);
  const user_id = data.user_id

  db.query('SELECT * FROM cartitems WHERE user_id = ?', [user_id], (err, result) => {
    if (err) return res.status(500).json({ msg: 'Server Error' });
    res.status(200).json(result);
  })
})


// Add product into Cart
router.post('/', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) return res.status(400).json({ msg: 'เกิดข้อผิดพลาด กรุณาเข้าสู่ระบบใหม่อีกครั้ง' });

  const data = jwt.verify(token, secret_key);
  const user_id = data.user_id
  const {
    product_id,
    quantity,
    color,
    storage,
    price,
    brand,
    model,
    img
  } = req.body;

  if (!product_id || !quantity || !color || !storage || !price || !brand || !model || !img) return res.status(400).json({ msg: 'กรุณากรอกข้อมูลให้ครบถ้วน' });

  db.query('INSERT INTO cartitems (user_id, product_id, quantity, color, storage, price, brand, model, img) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
  [user_id, product_id, quantity, color, storage, price, brand, model, img],
  (err, result) => {
    if (err) return res.status(500).json({ msg: 'Server Error' });

    const newItemInCart = {
      id: result.insertId,
      user_id,
      product_id,
      quantity,
      color,
      storage,
      price,
      brand,
      model,
      img
    }

    res.status(200).json({ msg: 'เพิ่มสินค้าสําเร็จ!', newItemInCart });
  })
})


//update quantity in cart
router.put('/', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  if (!token) return res.status(400).json({ msg: 'เกิดข้อผิดพลาด กรุณาเข้าสู่ระบบใหม่อีกครั้ง' });

  const data = jwt.verify(token, secret_key);
  const user_id = data.user_id
  const {
    quantity,
    id
  } = req.body;

  if (!quantity || !id) return res.status(400).json({ msg: 'กรุณากรอกข้อมูลให้ครบถ้วน' });

  db.query('UPDATE cartitems SET quantity = ? WHERE id = ? AND user_id = ?',
  [quantity, id, user_id],
  (err, result) => {
    if (err) return res.status(500).json({ msg: 'Server Error' });

    const updatedItemInCart = {
      id,
      user_id,
      quantity
    }

    res.status(200).json({ msg: 'แก้ไขสินค้าสําเร็จ!', updatedItemInCart });
  })
})


// delete product by ID
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ msg: 'กรุณาเลือกสินค้าที่จะลบ' });

  db.query('DELETE FROM cartitems WHERE id = ?',
  [id],
  (err, result) => {
    if (err) return res.status(500).json({ msg: 'Server Error' });
    res.status(200).json({ msg: 'ลบสินค้าออกจากตะกร้าสําเร็จ!' });
  })
})



module.exports = router;