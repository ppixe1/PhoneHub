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
const query = `
    SELECT 
      o.id AS order_id, o.user_id, o.total_price, o.status, o.created_at, o.paid_at, 
      o.shipping_address, o.customer_name, o.customer_phone, o.start_shipping_at,
      o.shipper_name, o.tracking_no, o.delivery_person_name, o.delivery_person_phone, o.delivered_at,
      oi.id AS item_id, oi.product_id, oi.quantity, oi.price_at_purchase, 
      oi.product_brand, oi.product_img, oi.product_model, oi.variation
    FROM orders o
    LEFT JOIN orderitems oi ON o.id = oi.order_id
    ORDER BY o.id DESC
  `;

  db.query(query,
    (err, result) => {
      if (err) return res.status(500).json({ msg: 'Server Error' });
      
      // ถ้าไม่มีข้อมูลเลย ให้ส่ง Array ว่างกลับไปอย่างปลอดภัย
      if (result.length === 0) {
        return res.status(200).json({ orders: [] });
      }

      // 2. จัดกลุ่มข้อมูล (Group By Order) เพื่อให้ Frontend เอาไปใช้งานง่ายๆ
      // โครงสร้างที่ได้จะเป็น 1 Order มี Array ของ Items อยู่ข้างใน
      const ordersMap = {};

      result.forEach(row => {
        // ถ้ายังไม่เคยเจอ Order ID นี้ ให้สร้าง Object ของ Order รอไว้ก่อน
        if (!ordersMap[row.order_id]) {
          ordersMap[row.order_id] = {
            id: row.order_id,
            user_id: row.user_id,
            total_price: row.total_price,
            status: row.status,
            created_at: row.created_at,
            paid_at: row.paid_at,
            shipping_address: row.shipping_address,
            customer_name: row.customer_name,
            customer_phone: row.customer_phone,
            start_shipping_at: row.start_shipping_at,
            shipper_name: row.shipper_name,
            tracking_no: row.tracking_no,
            delivery_person_name: row.delivery_person_name,
            delivery_person_phone: row.delivery_person_phone,
            delivered_at: row.delivered_at,
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
    }
  );
});


// Creade Order
router.post('/', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  if (!token) return res.status(400).json({ msg: 'เกิดข้อผิดพลาด กรุณาเข้าสู่ระบบใหม่อีกครั้ง' });

  const data = jwt.verify(token, secret_key);
  const user_id = data.user_id;

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

  const formattedAddress = `${shippingAddress.fullName}, ${shippingAddress.phone}, ${shippingAddress.houseNo}, ${shippingAddress.subDistrict}, ${shippingAddress.district}, ${shippingAddress.province}, ${shippingAddress.postalCode}`;

  const orderQuery = 'INSERT INTO orders (user_id, total_price, status, created_at, paid_at, shipping_address, customer_name, customer_phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(orderQuery,
    [user_id, totalPrice, 'paid', createdAt, paidAt, formattedAddress, customerName, customerPhone], 
    (err, result1) => {
    if (err) return res.status(500).json({ msg: 'Server Error' });

    const order_id = result1.insertId;

    const orderItemsValue = items.map(item => [
      order_id,
      item.product_id,
      item.quantity,
      item.price,
      item.brand,
      `["${item.img}"]`,
      item.model,
      `[{"storage":"${item.storage}","color":"${item.color}"}]`
    ]);

    const orderItemsQuery = 'INSERT INTO orderitems (order_id, product_id, quantity, price_at_purchase, product_brand, product_img, product_model, variation) VALUES ?';
    db.query(orderItemsQuery, [orderItemsValue],
      (err, result2) => {
        if (err) return res.status(500).json({ msg: 'Server Error' });
        
        const orderItemsPurchase = items.map(item => [
          item.id
        ])

        const orderItemsPurchaseQuery = 'DELETE FROM cartitems WHERE id IN (?)';
        db.query(orderItemsPurchaseQuery, [orderItemsPurchase],
          (err, result3) => {
            if (err) return res.status(500).json({ msg: 'Server Error' });

            res.status(200).json({ msg: 'สั่งซื้อสินค้าสําเร็จ!' });
          }
        )
      }
    );
  })
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

  db.query('UPDATE orders SET status = ?, start_shipping_at = ?, shipper_name = ?, tracking_no = ?, delivery_person_name = ?, delivery_person_phone = ? WHERE id = ?',
  ['shipping', startShippingAt, shipperName, trackingNo, deliveryPersonName, deliveryPersonPhone, order_id],
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

  db.query('UPDATE orders SET status = ?, delivered_at = ? WHERE id = ?',
  ['delivered', deliveredAt, order_id],
  (err, result) => {
    if (err) return res.status(500).json({ msg: 'Server Error' });

    res.status(200).json({ msg: 'อัพเดตสถานะสินค้าสําเร็จ!' });
  })
})


// UPDATE Status
router.put('/:action/:id', (req, res) => {
  const action = req.params.action;
  const order_id = req.params.id;
  if (!action) return res.status(400).json({ msg: 'เกิดข้อบกพร่อง' });
  if (!order_id) return res.status(400).json({ msg: 'เกิดข้อบกพร่อง' });

  db.query('UPDATE orders SET status = ? WHERE id = ?',
    [action, order_id],
    (err, result) => {
      if (err) return res.status(500).json({ msg: 'Server Error' });
      res.status(200).json({ msg: 'อัพเดตสถานะสินค้าสําเร็จ!' });
    }
  )
})


module.exports = router;