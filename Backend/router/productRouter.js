const express = require('express');
const router = express.Router();
const db = require('../db.js');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const multer = require('multer');

dotenv.config();

const secret_key = process.env.SECRET_KEY;

const upload = multer({ dest: 'uploads/' });

// Get all products
router.get('/', (req, res) => {
  db.query('SELECT * FROM products', (err, result) => {
    if (err) return res.status(500).json({ msg: 'Server Error' });
    res.status(200).json(result);
  })
})



// crate product
router.post('/', upload.single('img'), (req, res) => {
  const {
    brand,
    model,
    variation, //rom-color-stock-price
    img,
    specifications,
  } = req.body;
  
  if (!brand || !model || !variation || !img || !specifications) return res.status(400).json({ msg: 'กรุณากรอกข้อมูลให้ครบถ้วน' });

  const variationString = typeof variation === 'object' ? JSON.stringify(variation) : variation;
  const imgString = typeof img === 'object' ? JSON.stringify(img) : img;
  const specificationsString = typeof specifications === 'object' ? JSON.stringify(specifications) : specifications;

  // const variationObj = typeof variation === 'object' ? variation : JSON.parse(variation);
  // const imageFile = req.file
  // const specificationsObj = typeof specifications === 'object' ? specifications : JSON.parse(specifications);

  db.query('INSERT INTO products (brand, model, variation, img, specifications) VALUES(?,?,?,?,?)',
  [brand, model, variationString, imgString, specificationsString],
  (err, result) => {
    if (err) return console.log(err);

    const newProduct = {
      id: result.insertId,
      brand,
      model,
      variation,
      img,
      specifications
    }

    res.status(200).json({ msg: 'สร้างสินค้าสําเร็จ!', newProduct });
  })
})



// update product data by ID
router.put('/:id', upload.single('img'), (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ msg: 'กรุณากรอกรหัสสินค้าให้ครบถ้วน' });

  const {
    brand,
    model,
    variation, //rom-color-stock-price
    img,
    specifications,
  } = req.body;

  if (!brand || !model || !variation || !img || !specifications) return res.status(400).json({ msg: 'กรุณากรอกข้อมูลให้ครบถ้วน' });

  const variationString = typeof variation === 'object' ? JSON.stringify(variation) : variation;
  const imgString = typeof img === 'object' ? JSON.stringify(img) : img;
  const specificationsString = typeof specifications === 'object' ? JSON.stringify(specifications) : specifications;

  // const variationObj = typeof variation === 'object' ? variation : JSON.parse(variation);
  // const imageFile = req.file
  // const specificationsObj = typeof specifications === 'object' ? specifications : JSON.parse(specifications);

  db.query('UPDATE products SET brand = ?, model = ?, variation = ?, img = ?, specifications = ? WHERE id = ?',
  [brand, model, variationString, imgString, specificationsString, id],
  (err, result) => {
    if (err) return res.status(500).json({ msg: 'Server Error' });

    const updatedProdcut = {
      id,
      brand,
      model,
      variation,
      img,
      specifications
    }

    res.status(200).json({ msg: 'แก้ไขสินค้าสําเร็จ!', updatedProdcut });
  })
})


// Add View Product count
router.put('/view/:id', (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ msg: 'เกิดข้อผิดพลาด' });

  db.query('UPDATE products SET view_count = view_count + 1 WHERE id = ?',
  [id],
  (err, result) => {
    if (err) return res.status(500).json({ msg: 'Server Error' });
    res.status(200);
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