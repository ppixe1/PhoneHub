const express = require('express');
const router = express.Router();
const db = require('../db.js');

const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const isBetween = require('dayjs/plugin/isBetween');
dayjs.extend(customParseFormat);
dayjs.extend(isBetween);



const getStartDateObj = (period) => {
  const now = dayjs();
  switch (period) {
    case 'today':
      return now.startOf('day');
    case 'last7days':
      return now.subtract(7, 'day').startOf('day');
    case 'last30days':
      return now.subtract(30, 'day').startOf('day');
    case 'all':
      return dayjs('01/01/2025 00:00', 'DD/MM/YYYY HH:mm');
    default:
      return now.startOf('day');
  }
};



router.get('/', (req, res) => {
  const period = req.query.period || 'today';

  const startDate = getStartDateObj(period);
  const endDate = dayjs();

  db.query('SELECT * FROM orders', (err, result1) => {
    if (err) return res.status(500).json({ msg: 'Server Error' });
    

    const filteredData = result1.filter((order) => {
      if (!order.created_at) return false;
      const currentDate = dayjs(order.created_at, 'DD/MM/YYYY HH:mm');

      return currentDate.isBetween(startDate, endDate, null, '[]');
    });

    const totalOrders = filteredData.length;
    const totalPrice = filteredData.reduce((total, order) => total + Number(order.total_price), 0);
    const newOrders = filteredData.filter((order) => order.status === 'pending').length;
    const pendingOrders = filteredData.filter((order) => order.status === 'pending').length;
    const waitingToShipOrders = filteredData.filter((order) => order.status === 'paid').length;
    const ShippingOrders = filteredData.filter((order) => order.status === 'shipping').length;
    const completedOrders = filteredData.filter((order) => order.status === 'delivered').length;

    db.query('SELECT * FROM products', (err, result2) => {
      if (err) return res.status(500).json({ msg: 'Server Error' });

      const totalView = result2.reduce((total, product) => total + Number(product.view_count), 0);
      
      const validOrderIds = filteredData.map((order) => order.id)

      db.query('SELECT * FROM orderitems WHERE order_id IN (?)', [validOrderIds], (err, result3) => {
        if (err) return res.status(500).json({ msg: 'Server Error' });

        const salesByProduct = {};

        result3.forEach((item) => {
          const productId = item.product_id;
          const qty = Number(item.quantity || 1);
          const price = Number(item.price_at_purchase || 0);

          if (!salesByProduct[productId]) {
            salesByProduct[productId] = { soldQuantity: 0, totalSales: 0 };
          }

          salesByProduct[productId].soldQuantity += qty;
          salesByProduct[productId].totalSales += price;
        });

        const topProductsList = result2
        .map((product) => {
          const periodSales = salesByProduct[product.id] || { soldQuantity: 0, totalSales: 0 };
          return {
            productId: product.id,
            name: `${product.brand} ${product.model}`,
            soldQuantity: periodSales.soldQuantity,
            totalSales: periodSales.totalSales,
          }
        })
        .filter((product) => product.soldQuantity > 0)
        .sort((a, b) => b.soldQuantity - a.soldQuantity)
        .slice(0, 5)
        .map((product, index) => ({ rank: index + 1, ...product }))

        res.status(200).json({
          totalOrders,
          totalPrice,
          newOrders,
          pendingOrders,
          waitingToShipOrders,
          ShippingOrders,
          completedOrders,
          totalView,
          topProductsList
        })
      })
    })
  });
});



module.exports = router;