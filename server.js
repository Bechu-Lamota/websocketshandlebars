const express = require('express')
const handlebars = require('express-handlebars')
const { Server } = require('socket.io')
const productos = require('./public/products.json')

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

//Quiero tener control de cuando los usuarios se conectan y desconectan de mi servidor
io.on('connection', (socket) => {
    console.log('Usuario conectado');
    socket.on('disconnect', () => {
      console.log('Usuario desconectado');
    });
  });

  app.get('/products', (req, res) => {
	const params = {
		title: 'Productos',
		productos
	}
	return res.render('realtimeproducts', params)
})

app.post('/products/delete', (req, res) => {
    const productId = Number(req.body.id); // Recupera el ID del cuerpo de la solicitud POST
    const productIndex = productos.findIndex(product => product.id === productId);
  
    if (productIndex !== -1) {
      productos.splice(productIndex, 1);
      io.emit('productoEliminado', productId); // Emite un evento para notificar la eliminación
      return res.redirect('/realtimeproducts');
    } else {
      return res.status(400).json({ error: 'Producto no encontrado' }); // Maneja el caso en el que el producto no se encuentra
    }
  });

app.get('/api/products', (req, res) => {//Devuelve los productos en formato json
	return res.json(productos)
})

app.post('/api/products', (req, res) => { //Devuelve los productos en una API.
	const product = {
        title: req.body.title,
        price: req.body.price,
        stock: req.body.stock
    }

	product.id = productos.length + 1
	productos.push(product)

	io.emit('nuevoProducto', JSON.stringify(product)) //Cada vez que se cree un mensaje, me arrojara el nuevo producto.

	return res.redirect('/realtimeproducts')
})
//io hace una suerte de render

app.delete('/api/products/:id', (req, res) => {
	const productId = Number(req.params.id)

	const productIndex = productos.findIndex(product => product.id === productId)

	productos.splice(productIndex, 1)

	console.log('producto borrado')
	return res.redirect('/realtimeproducts')
})