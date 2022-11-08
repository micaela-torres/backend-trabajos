
let fs = require("fs");

class Contenedor {
    constructor(produc) {
        this.produc = produc;
    }

    save = async (titulo, precio, imagen) => {
        let producto = {
            titulo: titulo,
            precio: precio,
            imagen: imagen
        }
        let stock = await this.getAll();
        try {
            if (stock.length === 0) {
                producto.id = 0;
                stock.push(producto)
                await fs.promises.writeFile(this.produc, JSON.stringify(stock, null, "\t"))
            } else {
                producto.id = stock[stock.length - 1].id + 1
                stock.push(producto)
                await fs.promises.writeFile(this.produc, JSON.stringify(stock, null, "\t"))
            }
        } catch (error) {
            console.log(error)

        }
    }

    getById = async (number) => {
        let stock = await this.getAll();
        try {
            let filter = stock.find(e => e.id == number)
            return filter
        } catch (error) {
            console.log(error)
        }
    }

    getAll = async () => {
        try {

            if (fs.existsSync(this.produc)) {
                let info = await fs.promises.readFile(this.produc, "utf-8");
                let products = JSON.parse(info);
                return products
            }
        } catch (error) {
            console.log(error)

        }
    }

    deleteById = async (number) => {
        let stock = await this.getAll();
        try {
            let filter = stock.filter(product => product.id != number)
            await fs.promises.writeFile(this.produc, JSON.stringify(filter, null, "\t"))
        } catch (error) {
            console.log(error);
        }
    }

    deleteAll = async () => {
        try {
            await fs.promises.writeFile(this.produc, JSON.parse("[]"))
        } catch (error) {
            console.log(error)
        }
    }

}

let produc = new Contenedor("productos.json")

// AGREGANDO PRODUCTOS

produc.save("Jabon tocador baby con estuche", "60", "https://firebasestorage.googleapis.com/v0/b/primerapractica-22fb2.appspot.com/o/1001.jpg?alt=media&token=9a458821-6122-4bb4-872c-57688478e5f5");

produc.save("Shampoo baby", "117", "https://firebasestorage.googleapis.com/v0/b/primerapractica-22fb2.appspot.com/o/1441.jpg?alt=media&token=3a069684-5280-4608-94a2-fc4276573e30");

produc.save("Toallitas húmedas", "540", "https://firebasestorage.googleapis.com/v0/b/primerapractica-22fb2.appspot.com/o/1224.jpg?alt=media&token=e94d5a4c-3cbc-4d78-886a-c9dd9de9b1df");

// BUSCANDO PRODUCTO POR ID
produc.getById(0).then(val => console.log(val))
produc.getById(2).then(val => console.log(val))

// ELIMINAR POR ID
//produc.deleteById(2)
//produc.deleteById(0)

// BORRAR TODO
//produc.deleteAll()

