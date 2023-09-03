const socket = io()
console.log(socket) // Ruta de a realTimeProducts y creo su handlebar
    
const product = async getProduct() => {
    try {
    return fs.promises.readFile(this.path, 'utf-8')
    .then((productString) => {
        const products = JSON.parse(productString)
        console.log(products)

        return products
    })
    } catch (error) {
        console.log('Error al leer el archivo', error )
        return []
     }
    }
  
    socketServer.on('connection', (socket) => { // Establezco que hace nuestro servidor cuando un cliente se conecta
        console.log('Nuevo cliente conectado!')
    
        socket.on('mi_mensaje', (data) => {
            console.log(data)
        })
    
        setTimeout(() => { //Fijo un tiempo para que se envie el mensaje del backend
            socket.emit('mensaje_backend', 'Mensaje enviado desde el backend') //Envio un mensaje desde el servidor hacia el cliente
        }, 2000)
    })
  

  