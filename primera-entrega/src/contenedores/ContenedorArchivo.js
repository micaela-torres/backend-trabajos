const { promises: fs } = require('fs');
const { getTimestamp, checkId, checkLength, newId } = require("../functions")

class Container {
    constructor(route) {
        this.route = route;
    }
    async getAll() {
        try {
            let array = await fs.readFile(this.route, 'utf-8')
            return JSON.parse(array)
        } catch (error) {
            console.error('Error de lectura.')
            console.error(error)
            return []
        }
    }
    async getById(id) {
        let array = await this.getAll()
        if (!checkLength(array)) {
            return null
        }
        let object = array.find(element => element.id == id)
        return object ? object : null
    }
    async saveProduct(object) {
        const products = await this.getAll()
        object.id = parseInt(object.id)
        object.id = checkId(object, products)
        object.price = parseInt(object.price)
        object.timestamp = getTimestamp()
        try {
            console.log(`El siguiente elemento sera guardado : \n${JSON.stringify(object)}`)
            products.push(object)
            await fs.writeFile(this.route, JSON.stringify(products, null, 2))
            console.log('Guardado exitoso')
            return object
        } catch (error) {
            console.error('Error de escritura')
            console.error(error)
        }
    }
    async updateProduct(object) {
        let productos = await this.getAll()
        let index = productos.map(element => element.id).indexOf(object.id)
        if (index >= 0 && object.id === productos[index].id) {
            let oldProduct = productos[index]
            productos[index] = object
            try {
                await fs.writeFile(this.route, JSON.stringify(productos, null, 2))
                console.log('Guardado exitoso')
            } catch (error) {
                console.error('Error de escritura')
                console.error(error)
                return new Error(500)
            }
        }
        else {
            console.log('Not found')
            return new Error(404)
        }
    }
    async deleteById(id) {
        const array = await this.getAll()
        if (!checkLength(array)) {
            throw new Error('No carts')
        }
        const object = array.find(element => element.id == id)
        try {
            if (object === undefined) {
                throw new Error('Id not found')
            }
            const newArray = array.filter(element => element != object)
            console.log(`El siguiente elemento sera eliminado : \n${JSON.stringify(object)}`)
            await fs.writeFile(this.route, JSON.stringify(newArray, null, 2))
            console.log(`Cambios guardados`)
            return object
        } catch (error) {
            console.error(error)
            throw (error)
        }
    }
    async newCart() {
        let products = [];
        let timestamp = getTimestamp();
        let carts = await this.getAll();
        let id = 1
        if (carts.length > 0) {
            id = newId(carts);
        }
        this.saveCart({ id, timestamp, products })
        return { id, timestamp, products }

    }
    async saveCart(cart) {
        let carts = await this.getAll();
        carts.push(cart)
        try {
            await fs.writeFile(this.route, JSON.stringify(carts, null, 2))
        } catch (error) {
            console.log(error)
        }
    }
    async saveCarts(carts) {
        try {
            await fs.writeFile(this.route, JSON.stringify(carts, null, 2))
        } catch (error) {
            console.log(error)
        }
    }
    async updateCart(cart) {
        let carts = await this.getAll()
        let index = carts.map(element => element.id).indexOf(cart.id)
        carts.splice(index, 1)
        console.log(cart)
        carts.push(cart)
        await this.saveCarts(carts)
        return true

    }
    async addToCart(cartId, product) {
        let cart = await this.getById(cartId)
        cart.push(product)
        await this.update(cart)
    }
    async deleteCartProduct(cartId, productId) {
        let cart = await this.getById(cartId)
        try {
            if (cart === null) {
                throw new Error('Id de carrito no encontrado')
            }
            let newCart = cart.filter(element => element.id = !productId)
            await this.saveCart(newCart)
        } catch (error) {
            console.log('Error de escritura')
            console.log(error)
        }
    }

}

module.exports = Container;