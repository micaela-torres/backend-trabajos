const { promises: fs } = require('fs')

class Container {
    constructor(route) {
        this.route = route
    }

    async save(object) {
        const productos = await this.getAll()
        const index = productos.map(element => element.id).indexOf(object.id)

        if (index >= 0) {
            const oldProduct = productos[index]
            object.id = productos[index].id
            productos[index] = object

            try {
                await fs.writeFile(this.route, JSON.stringify(productos, null, 2))
                console.log("Guardado")
                return [object, oldProduct]
            } catch (error) {
                console.error("Error de escritura")
                console.error(error)
                return []
            }
        }
        else {
            console.log("Not found")
            return []
        }
    }
    async saveProduct(object) {
        const products = await this.getAll()
        object.id = parseInt(object.id)
        object.id = this.checkId(object, products)
        object.price = parseInt(object.price)
        try {
            console.log(`El siguiente elemento sera guardado : \n${JSON.stringify(object)}`)
            products.push(object)
            await fs.writeFile(this.route, JSON.stringify(products, null, 2))
            console.log("Guardado")
            return object
        } catch (error) {
            console.error("Error de escritura")
            console.error(error)
        }
    }
    async getById(id) {
        const products = await this.getAll()
        if (!this.checkLength(products)) {
            return
        }
        let product = products.find(element => element.id == id)
        return product ? product : null
    }
    async getAll() {
        try {
            let products = await fs.readFile(this.route, 'utf-8')
            return JSON.parse(products)
        } catch (error) {
            console.error("Error de lectura.")
            console.error(error)
            return []
        }
    }
    async deleteById(id) {
        console.log(id)
        const products = await this.getAll()
        if (!this.checkLength(products)) {
            return
        }
        const product = products.find(element => element.id == id)
        console.log(product)
        const newProducts = products.filter(element => element != product)
        try {
            console.log(`El siguiente elemento sera eliminado : \n${JSON.stringify(product)}`)
            await fs.writeFile(this.route, JSON.stringify(newProducts, null, 2))
            console.log(`Cambios guardados`)
            return product
        } catch (error) {
            console.error("Error de escritura.")
            console.error(error)
        }
    }
    checkLength(arr) {
        if (arr.length === 0) {
            return false
        }
        return true
    }

    checkId(product, arr) {
        arr.forEach(element => {
            if (element.id == product.id) {
                console.warn("El id del elemento ya existe, se le asignara uno nuevo.")
                return this.newId(product, arr)
            }
        });
        return product.id
    }
    newId(product, arr) {
        arr.sort((a, b) => { return a - b })
        product.id = parseInt(arr[arr.length - 1].id) + 1
        console.log(`Nuevo id del producto : ${product.id}`)
        return product.id
    }
}

module.exports = Container;