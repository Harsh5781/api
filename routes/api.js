const express = require('express')
const router = express.Router()

const mongoose=require('mongoose')
const Product =require('../model/product')


const checkLogin = require('../isLoggedin')

router.get('/',checkLogin,async (req, res)=>{
    const products = await Product.find()
    const data = JSON.stringify(products)
    res.send(products)
})

module.exports = router