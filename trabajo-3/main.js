const { promises: fs } = require("fs")

class Container {
    constructor(route) {
        this.route = route
    }

    async getAll() {
        try {
            let products = await fs.readFile(this.route, "utf-8")
            return JSON.parse(products)
        } catch (error) {
            console.error(error)
            return []
        }
    }

    async getRandom() {
        const products = await this.getAll()
        return this.checkLength(products) ? products[Math.floor(Math.random() * products.length)] : null
    }
    checkLength(arr) {
        if (arr.length === 0) {
            console.error("Error, el contenedor esta vacio")
            return false
        }
        return true
    }

}

module.exports = Container;