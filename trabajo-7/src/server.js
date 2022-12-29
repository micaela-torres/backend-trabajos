
import express from 'express';
import { Server as HttpServer } from 'http';
import { Server as IOServer } from 'socket.io';
import config from './scripts/config.js';
import * as handlebars from 'express-handlebars'
import ContenedorSQL from '../resources/js/ContainerSQL.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';


const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
const hbs = handlebars.create({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/public/views/layout",//Ruta 
    partialsDir: __dirname + "/public/views/partials/" //Ruta 
})
const productos = new ContenedorSQL(config.mariaDb, 'products', './resources/txt/products.txt') //Ruta 
const mensajes = new ContenedorSQL(config.sqlite3, 'messages', './resources/txt/messages.txt') //Ruta 


app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './public/views');


app.get('/', (req, res) => {
    res.render('index', {})
})
io.on('connection', async socket => {
    const products = await productos.getAll();
    const messages = await mensajes.getAll();
    socket.emit('update_products', products);
    socket.emit('update_messages', messages);
    socket.on('new_product', async product => {
        product = await productos.saveProduct(product)
        products.push(product)
        io.sockets.emit('update_products', products)
    })
    socket.on('new_message', async message => {
        messages.push(message)
        await mensajes.saveMessage(message)
        io.sockets.emit('update_messages', messages)
    })
})



const PORT = 8080;
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Server localhost:${PORT}`)
});
connectedServer.on(
    'error', error => console.log(`Error en el servidor : ${error}`)
)