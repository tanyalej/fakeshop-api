require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const userRouter = require('./routes/user')
const productRouter = require('./routes/product')
const cartRouter = require('./routes/cart')

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/users', userRouter)
app.use('/products', productRouter)
app.use('/carts', cartRouter)

module.exports = app