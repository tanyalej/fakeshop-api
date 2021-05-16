const client = require('../redisClient')
const { promisify } = require("util")
const json_get = promisify(client.json_get).bind(client)

module.exports={
  async getProduct(req,res){
    try {
        const { id } = req.params
        const productId = '.product'.concat(id)

        const product = await json_get('products', productId)

        const productToJson = JSON.parse(product)
    
        res.status(201).json(productToJson)

    }catch(error){
        res.status(400).json({ message: error.message })
    }
},
async getAllProducts(req,res){
    try {
        const productsToObj = JSON.parse(await json_get('products'))

        const products = Object.values(productsToObj)
       
        res.status(201).json({ products })

    }catch(error) {
        res.status(400).json({ message: error.message })
    }
}
}
