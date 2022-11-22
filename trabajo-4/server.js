const express = require("express");
const app = express();
const PORT = 8080;
const { Router } = express

const Container = require("./api/productos");
const products = new Container("./resources/products.txt");
app.use(express.static('public'))

const routerProductos = new Router();
routerProductos.use(express.json());
routerProductos.use(express.urlencoded({ extended: true }))


routerProductos.get('/', async (req, res, next) => {
    const productos = await products.getAll()
    if (productos.length > 0) { res.json(productos) }
    else { res.sendStatus(400) }

});
app.use('/api/productos', routerProductos);


routerProductos.get('/:id', async (req, res, next) => {
    const producto = await products.getById(req.params.id)
    if (producto) {
        res.json({
            search: `Producto con id : ${req.params.id}.`,
            result: producto
        })
    }
    else { res.sendStatus(404) }
})


routerProductos.post('/', async (req, res, next) => {
    let product = req.body
    if (product) {
        product = await products.saveProduct(product)
        res.json({
            newProduct: product
        })
    }
    else { res.sendStatus(400) }

})


routerProductos.delete('/:id', async (req, res, next) => {
    const product = req.params.id
    try {
        let deleted = await products.deleteById(product)
        res.json({
            deletedElement: deleted,
            products: await products.getAll()
        })
    } catch (error) {
        console.log(error)
        res.sendStatus(404)
    }
})


routerProductos.put('/:id', async (req, res, next) => {
    const result = products.save(req.body)
    if (result.length > 0) {
        res.send(`El producto : ${JSON.stringify(result[1])}\n\n fue reemplazado por : ${JSON.stringify(result[0])} en la posicion : ${result[0].id}`)
    }
    else {
        res.sendStatus(400)
    }
})




const server = app.listen(PORT, () => { console.log(`htpp://localhost:${PORT}`) })
server.on('error', error => console.log(`Error en servidor ${error}`))