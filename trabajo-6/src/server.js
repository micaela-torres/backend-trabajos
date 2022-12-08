const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const Products = require("../resources/js/products");
const Messages = require("../resources/js/messages");
const handlebars = require("express-handlebars");


const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
const productos = new Products("../resources/txt/products.txt")
const mensajes = new Messages("../resources/txt/messages.txt")
const hbs = handlebars.create({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/public/views/layout",
    partialsDir: __dirname + "/public/views/partials/"
})

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "../public/views");


app.get("/", (req, res, next) => {
    res.render("../index.html", {})
})

io.on("connection", async socket => {
    socket.emit("update_products", await productos.getAll());
    socket.emit("update_messages", await mensajes.getAll());
    socket.on("new_product", async product => {
        await productos.saveProduct(product)
        io.emit("update_products", await productos.getAll())
    })

    socket.on("new_message", async message => {
        await mensajes.save(message)
        io.emit("update_messages", await mensajes.getAll())
    })
})


const PORT = 8080;
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Server on http:/localhost:${PORT}`)
});
connectedServer.on(
    'error', error => console.log(`Error en el servidor : ${error}`)
)