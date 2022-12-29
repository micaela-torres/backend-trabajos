import knex from 'knex'
import { checkId, checkLength, newId } from '../../src/scripts/aux_functions'
import { promises as fs } from 'fs';


class ContenedorSQL {

    constructor(config, table, route) {
        this.knex = knex(config)
        this.table = table
        this.route = route
    }

    async getById(id) {
        try {
            const product = await this.knex(this.table).select('*').where('id', id)
            this.disconnect()
            return product
        } catch (error) {
            return null
        }
    }

    async getAll() {
        try {
            const products = await this.knex(this.table).select('*')
            this.disconnect()
            return products
        } catch (error) {
            console.log('Cannot get products')
            console.log(error)
            return []
        }
    }

    async saveProduct(object) {
        const products = await this.getAll()
        object.id = parseInt(object.id)
        object.id = checkId(object, products)
        object.price = parseInt(object.price)
        try {
            await this.knex(this.table).insert(object)
                .then(() => console.log(`${JSON.stringify(object)} will be insterted.`))
                .catch(error => { console.log(error); throw error })
                .finally(async () => {
                    products.push(object)
                    await fs.writeFile(this.route, JSON.stringify(products, null, 2));
                    this.disconnect()
                })
        } catch (error) {
            console.log(error)
        }
    }

    async saveMessage(mensaje) {
        const mensajes = await this.getAll()
        try {
            await this.knex(this.table).insert(mensaje)
                .then(() => console.log(`${JSON.stringify(mensaje)} will be posted`))
                .catch(error => { console.log(error); throw error })
                .finally(async () => {
                    mensajes.push(mensaje)
                    await fs.writeFile(this.route, JSON.stringify(mensajes, null, 2));
                    this.disconnect()
                })
            console.log('Guardado exitoso')
        } catch (error) {
            console.error('Error de escritura')
            console.error(error)
        }
    }

    async disconnect() {
        try {
            await this.knex.destroy()
        } catch (error) {
            console.log(error)
        }
    }
}

export default ContenedorSQL