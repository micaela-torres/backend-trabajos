const Container = require("./main");
const products = new Container('products.txt');
let express = require("express");
const PORT = 3001;
let app = express();

app.get("/", (req, res, next) => {
    res.send("Trabajo practico, servidor con express")
})

app.get("/productos", async (req, res, next) => {
    const allProducts = await products.getAll()
    res.send(allProducts)
})

app.get("/productoRandom", async (req, res, next) => {
    const product = await products.getRandom()
    res.send(product)
})


app.listen(PORT, () => console.log(`Server on http:/localhost:${PORT}`));