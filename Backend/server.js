const db = require('./db');
const express = require('express');
const app = express();
const cors = require('cors');

const authRouter = require('./router/authRouter.js');
const productRouter = require('./router/productRouter.js');
const cartRouter = require('./router/cartRouter.js');
const orderRouter = require('./router/orderRouter.js');


app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.use('/auth', authRouter);
app.use('/product', productRouter);
app.use('/cart', cartRouter);
app.use('/order', orderRouter);


app.listen(3000, () => {
  console.log('Server is running on port 3000✅');
});