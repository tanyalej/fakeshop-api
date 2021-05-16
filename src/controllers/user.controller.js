const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const faker = require('faker')
const client = require('../redisClient')
const { promisify } = require("util")
const llen = promisify(client.llen).bind(client)
const lindex = promisify(client.lindex).bind(client)
const json_get = promisify(client.json_get).bind(client)

module.exports={
    async signup(req,res){
        try{
            const { body } = req
            const password = await bcrypt.hash(body.password, 8)
            const cartId = 'cart'+faker.datatype.number()
            let emailExist
            let token
            
            await llen(body.email)
                .then(function(res){
                    if(res===0){
                        client.lpush(body.email, [password, cartId]) 

                        token = jwt.sign(
                            { userEmail: body.email },
                            process.env.SECRET,
                            { expiresIn: '48h' }
                        )
                    }else{
                        emailExist = true
                    }
                })
                .catch((err) => {if (err) console.error(err)})
            
            if(emailExist){
                throw Error('Email already in use')
            }else{
                client.expire(body.email, 60 * 60 * 48)
            }
           
            res.status(201).json({ token, message: 'User successfully created. User will EXPIRE in 48 hrs' })
    
        }catch(error){
            res.status(400).json({ message: error.message })
        }
    },
    async signin(req,res){
        try{
            const { body } = req
            let token

            const data = await llen(body.email)
            
            if(data!==0){
                const hashedPassword = await lindex(body.email, 1)
                const isValid = await bcrypt.compare(body.password, hashedPassword)
             
                if(isValid){
                    token = jwt.sign(
                        { userEmail: body.email },
                        process.env.SECRET,
                        { expiresIn: '48h' }
                    )
                }else{
                    throw Error('Email or password is invalid')
                }   
            }else{
                throw Error('Email or password is invalid')
            }                       
            res.status(201).json({ token, message: 'User signed in successfully' })

        }catch(error){
            res.status(400).json({ message: error.message })
        }
    },
    async getUser(req,res){
        try {
            const { id } = req.params
            const userId = '.user'.concat(id)

            const user = await json_get('users', userId)
          
            const userToJson = JSON.parse(user)
        
            res.status(201).json(userToJson)

        }catch(error){
            res.status(400).json({ message: error.message })
        }
    },
    async getAllUsers(req,res){
        try {
            const usersToObj = JSON.parse(await json_get('users'))

            const users = Object.values(usersToObj)
           
            res.status(201).json({ users })

        }catch(error) {
            res.status(400).json({ message: error.message })
        }
    }
}
