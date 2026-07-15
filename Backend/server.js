const db = require('./db');
const express = require('express');
const app = express();
const cors = require('cors');

const authRouter = require('./router/authRouter.js');
const productRouter = require('./router/productRouter.js');


app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
app.use(express.json());


app.use('/auth', authRouter);
app.use('/product', productRouter);


app.listen(3000, () => {
  console.log('Server is running on port 3000✅');
});