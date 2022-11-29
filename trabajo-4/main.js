const express = require('express');
const app = express()
// JSON settings
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// Engine set
app.set('views', "./views");
app.set('view engine', 'ejs');
// Products 
const Container = require("./api/productos")
const products = new Container("./resources/products.txt")

// GET and POST

app.get('/', (req, res) => {
    res.render('inicio', {})
})
app.post('/productos', async (req, res) => {
    let product = req.body
    if (product) {
        await products.saveProduct(product)
        console.log(`Producto guardado : ${JSON.stringify(product)}`)
        res.redirect('/')
    }
    else { res.sendStatus(400) }

})
app.get('/productos', async (req, res) => {
    const productos = await products.getAll()
    res.render('productos', { productos })
})


const PORT = 8080;
app.listen(PORT, () => console.log(`Server on http:/localhost:${PORT}`));