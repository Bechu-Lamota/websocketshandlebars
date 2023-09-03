const express = require('express')
const productRouter = require('./Routes/productsRoutes')
const cartRouter = require('./Routes/cartsRoutes')
const handlebars = require('express-handlebars')
const { Server } = require('socket.io')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.engine('handlebars', handlebars.engine())

app.set('views', './views')
app.set('view engine', 'handlebars')

  //El MIDDLEWARE acá esta a nivel Aplicación
  app.use((req, res, next) => {
    console.log('El tiempo de este Middleware a nivel Aplicacion:', Date.now());
    
    return next();
})

app.use('/api/products', productRouter)//work
app.use('/api/carts', cartRouter)//work

const PORT = 8080

const httpServer = app.listen(PORT, () => console.log(`Servidor Express escuchado: Puerto ${PORT}`))
const socketServer = new Server(httpServer)