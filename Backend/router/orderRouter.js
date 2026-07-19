const express = require('express');
const router = express.Router();
const db = require('../db.js');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const dayjs = require('dayjs');

dotenv.config();

const secret_key = process.env.SECRET_KEY;


// Get all orders ของ User
router.get('/', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // ป้องกันกรณีไม่มี token ส่งมา

  if (!token) return res.status(400).json({ msg: 'เกิดข้อผิดพลาด กรุณาเข้าสู่ระบบใหม่อีกครั้ง' });

  try {
    const data = jwt.verify(token, secret_key);
    const user_id = data.user_id;

    // 1. ดึงข้อมูลแบบ JOIN กันระหว่าง orders และ orderitems
    // เลือกฟิลด์ที่ต้องการ และใช้ o.id เป็นตัวตั้ง
    const query = `
      SELECT 
        o.id AS order_id, o.total_price, o.status, o.created_at, o.paid_at, 
        o.shipping_address, o.customer_name, o.customer_phone, o.start_shipping_at,
        o.shipper_name, o.tracking_no, o.delivery_person_name, o.delivery_person_phone, o.delivered_at,
        oi.id AS item_id, oi.product_id, oi.quantity, oi.price_at_purchase, 
        oi.product_brand, oi.product_img, oi.product_model, oi.variation
      FROM orders o
      LEFT JOIN orderitems oi ON o.id = oi.order_id
      WHERE o.user_id = ?
      ORDER BY o.id DESC
    `;

    // ทำการคิวรีข้อมูล (อิงตามรูปแบบ mysql2/promise)
    const [rows] = await db.query(query, [user_id]);

    // ถ้าไม่มีข้อมูลเลย ให้ส่ง Array ว่างกลับไปอย่างปลอดภัย
    if (rows.length === 0) {
      return res.status(200).json({ orders: [] });
    }

    // 2. จัดกลุ่มข้อมูล (Group By Order) เพื่อให้ Frontend เอาไปใช้งานง่ายๆ
    // โครงสร้างที่ได้จะเป็น 1 Order มี Array ของ Items อยู่ข้างใน
    const ordersMap = {};

    rows.forEach(row => {
      // ถ้ายังไม่เคยเจอ Order ID นี้ ให้สร้าง Object ของ Order รอไว้ก่อน
      if (!ordersMap[row.order_id]) {
        ordersMap[row.order_id] = {
          id: row.order_id,
          total_price: row.total_price,
          status: row.status,
          created_at: row.created_at,
          paid_at: row.paid_at,
          shipping_address: row.shipping_address,
          customer_name: row.customer_name,
          customer_phone: row.customer_phone,
          items: [] // เตรียมกล่องเก็บสินค้าใน Order นี้
        };
      }

      // ถ้าในแถวนั้นมีข้อมูลสินค้า (ไม่ได้เป็นคิวรีว่างจาก LEFT JOIN) ให้ยัดลงอาเรย์ items
      if (row.item_id) {
        ordersMap[row.order_id].items.push({
          id: row.item_id,
          product_id: row.product_id,
          quantity: row.quantity,
          price_at_purchase: row.price_at_purchase,
          product_brand: row.product_brand,
          product_img: row.product_img,
          product_model: row.product_model,
          variation: row.variation
        });
      }
    });

    // แปลงจาก Object Map กลับมาเป็น Array ธรรมดาเพื่อส่งให้ Frontend
    const formattedOrders = Object.values(ordersMap);

    res.status(200).json({ orders: formattedOrders });

  } catch (error) {
    console.error("Get orders error:", error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ msg: 'Token ไม่ถูกต้องหรือหมดอายุ' });
    }
    res.status(500).json({ msg: 'Server Error' });
  }
});


// Creade Order
router.post('/', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  if (!token) return res.status(400).json({ msg: 'เกิดข้อผิดพลาด กรุณาเข้าสู่ระบบใหม่อีกครั้ง' });

  let user_id;
  try {
    const data = jwt.verify(token, secret_key);
    user_id = data.user_id;
  } catch (err) {
    return res.status(401).json({ msg: 'Token ไม่ถูกต้องหรือหมดอายุ' });
  }

  const {
    totalPrice,
    shippingAddress,
    customerName,
    customerPhone,
    items
  } = req.body;

  const today = dayjs().format('DD/MM/YYYY HH:mm');
  // BYPASS PAYMENT
  const createdAt = today; 
  const paidAt = today;

  if (!totalPrice || !createdAt || !paidAt || !shippingAddress || !customerName || !customerPhone || !items || items.length === 0) {
    return res.status(400).json({ msg: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const orderQuery = 'INSERT INTO orders (user_id, total_price, status, created_at, paid_at, shipping_address, customer_name, customer_phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const [orderResult] = await connection.query(orderQuery, [
      user_id, totalPrice, 'paid', createdAt, paidAt, shippingAddress, customerName, customerPhone
    ]);

    const order_id = orderResult.insertId;

    const orderItemsValue = items.map(item => [
      order_id,
      item.product_id,
      item.quantity,
      item.price_at_purchase,
      item.product_brand,
      item.product_img,
      item.product_model,
      item.variation
    ]);

    const orderItemsQuery = 'INSERT INTO orderitems (order_id, product_id, quantity, price_at_purchase, product_brand, product_img, product_model, variation) VALUES ?';
    await connection.query(orderItemsQuery, [orderItemsValue]);

    await connection.commit();

    res.status(200).json({ msg: 'สั่งซื้อสินค้าสําเร็จ!' });

  } catch (error) {
    await connection.rollback();
    console.error("Failed to create order:", error);
    res.status(500).json({ msg: 'เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ' });
  } finally {
    connection.release();
  }
})



// UPDATE Order - Start Shipping
router.put('/:id', (req, res) => {
  const order_id = req.params.id;
  if (!order_id) return res.status(400).json({ msg: 'กรุณากรอกรหัสสินค้าให้ครบถ้วน' });

  const {
    shipperName,
    trackingNo,
    deliveryPersonName,
    deliveryPersonPhone
  } = req.body;

  const startShippingAt = dayjs().format('DD/MM/YYYY HH:mm');

  if (!startShippingAt || !shipperName || !trackingNo || !deliveryPersonName || !deliveryPersonPhone) {
    return res.status(400).json({ msg: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }

  db.query('UPDATE orders SET start_shipping_at = ?, shipper_name = ?, tracking_no = ?, delivery_person_name = ?, delivery_person_phone = ? WHERE id = ?',
  [startShippingAt, shipperName, trackingNo, deliveryPersonName, deliveryPersonPhone, order_id],
  (err, result) => {
    if (err) return res.status(500).json({ msg: 'Server Error' });

    res.status(200).json({ msg: 'อัพเดตสถานะสินค้าสําเร็จ!' });
  })
})


// UPDATE Order - Delivered
router.put('/delivered/:id', (req, res) => {
  const order_id = req.params.id;
  if (!order_id) return res.status(400).json({ msg: 'กรุณากรอกรหัสสินค้าให้ครบถ้วน' });

  const deliveredAt = dayjs().format('DD/MM/YYYY HH:mm');

  if (!deliveredAt) return res.status(400).json({ msg: 'Server Error' })

  db.query('UPDATE orders SET delivered_at = ? WHERE id = ?',
  [deliveredAt, order_id],
  (err, result) => {
    if (err) return res.status(500).json({ msg: 'Server Error' });

    res.status(200).json({ msg: 'อัพเดตสถานะสินค้าสําเร็จ!' });
  })
})


module.exports = router;