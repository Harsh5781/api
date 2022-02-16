const express = require('express')
const router = express.Router()

const mongoose=require('mongoose')
const Product =require('../model/product')
const User = require('../model/user')

const checkLogin = require('../isLoggedin')

router.get('/new',checkLogin, (req, res)=>{
    res.render('product/new')
})

router.route('/')
.get(async(req, res)=>{
    const products = await Product.find()
    res.render('product/home', {products})
})
.post(checkLogin,async(req, res)=>{
    try{
        const product = new Product(req.body)
        product.user = req.user
        await product.save()
        res.status(200).redirect(`/product/${product.id}`)
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.route('/:id')
.get(async(req,res)=>{
    try {
        const {id}=req.params
        const product = await Product.findById(id).populate('user')
        if(!product){
            return res.status(404).send('No product found')
        }
        res.render('product/show',{product})
    } catch (error) {
        res.status(400).send(error)
    }
})
.put(checkLogin,async(req, res)=>{
    const {id} = req.params
    const product = await Product.findByIdAndUpdate(id, req.body)
    if(!product.user.equals(req.user)){
        return res.redirect(`/product/${id}`)
    }
    res.redirect(`/product/${id}`)
})
.delete(checkLogin,async (req, res)=>{
    try {
        const {id}=req.params
        const product = await Product.findByIdAndDelete(id)
        if(!product){
            return res.status(404).redirect('/product')
        }
        res.redirect('/product')
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/:id/edit',checkLogin,async (req, res)=>{
    const {id} = req.params
    const product = await Product.findById(id).populate('user')
    if(!product.user.equals(req.user)){
        return res.redirect(`/product/${id}`)
    }
    res.render('product/edit', {product})
})

module.exports = router