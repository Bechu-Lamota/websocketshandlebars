const express = require('express')
const handlebars = require('express-handlebars')
const { Server } = require('socket.io')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.engine('handlebars', handlebars.engine())
app.set('views', './views')
app.set('view engine', 'handlebars')

const PORT = 8080
const httpServer = app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`))
const io = new Server(httpServer) //Mi Socket Server corre en el mismo servidor que HTTP.

app.get('/', (req, res) => {
    return res.json({
        status: 'running',
        date: new Date()
    })
})

//Creo una ruta en mi servidor para acceder desde el lado del cliente
app.get('/api/products', (req, res) => {
    const products = require('./public/products.json'); // Carga el archivo JSON
    res.json(products);
});

app.get('/home', (req, res) => {
    return res.render('home')
})

app.get('/realTimeProducts', (req, res) => {
    return res.render('realtimeproducts')
})