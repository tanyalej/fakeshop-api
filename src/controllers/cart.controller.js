const client = require('../redisClient')
const { promisify } = require("util")
const lindex = promisify(client.lindex).bind(client)
const json_get = promisify(client.json_get).bind(client)
const json_set = promisify(client.json_set).bind(client)
const json_del = promisify(client.json_del).bind(client)
const json_objkeys = promisify(client.json_objkeys).bind(client)
const json_numincrby = promisify(client.json_numincrby).bind(client)


module.exports={
    async getCart(req,res){
        try {
            const { user } = req
      
            const cartId = await lindex(user, 0)
            const cartExist = await json_get(cartId)
           
            if(cartExist){
                const cartObj = JSON.parse(cartExist)
                let cart = []

                for (const property in cartObj) {
                    
                    const product = await json_get('products', property)
                    const productToJson = JSON.parse(product)
                    
                    cart.push({
                        ...productToJson,
                        quantity: cart[property]
                    })
                }

            res.status(201).json({ cart })
            
            }else{
                res.status(201).json({ message:'Cart is empty' })
            }
        }catch(error) {
            res.status(400).json({ message: error.message })
        }
    },
    async addToCart(req,res){
        try {
            const { body, user } = req
            const productId = 'product'.concat(body.id)
        
            const cartId = await lindex(user, 0)
            const cart = await json_get(cartId)
         
            if(cart){
                const productsInCart = await json_objkeys(cartId,'.')
                const productExist = productsInCart.includes(productId)
                const path = '.'.concat(productId)

                productExist ? await json_numincrby(cartId, path, 1) : await json_set(cartId, path, 1)   
               
            }else{
                const cartCreated = await json_set(cartId,'.',JSON.stringify({ [productId]: 1 }))
                    
                if (cartCreated==='OK'){
                    client.expire(cartId, 60 * 60 * 24)
                }else{
                    throw Error('not possible to add product to cart, please try again')
                }  
            }
            
            res.status(201).json({ message:'Product added to cart' })

        }catch(error) {
            res.status(400).json({ message: error.message })
        }
    },
    async removeFromCart(req,res){
        try {
            const { body, user } = req
            const productId = 'product'.concat(body.id)
        
            const cartId = await lindex(user, 0)
            const path = '.'.concat(productId)

            let productQty = await json_get(cartId, path )
        
            if(productQty>1){
                productQty = productQty - 1
                await json_set(cartId, path, productQty)
                res.status(201).json({ message:`Product quantity decreased to ${productQty}` })
                
            }else{
               await json_del(cartId, path)
               res.status(201).json({ message:'Product removed from cart' })
            }

        }catch(error){
            res.status(400).json({ message: error.message })
        }
    },
    async emptyCart(req,res){
        try {
            const { user } = req
            const cartId = await lindex(user, 0)

            await json_del(cartId) 
            
            res.status(201).json({ message:'Cart is now empty' })

        }catch(error){
            res.status(400).json({ message: error.message })
        }
    }
}