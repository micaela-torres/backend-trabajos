import knex from 'knex'
import config from './config.js'
import { productsArray, messagesArray } from './importTables.js';

try {
    const mariaDbClient = knex(config.mariaDb)
    await mariaDbClient.schema.dropTableIfExists('products');
    await mariaDbClient.schema.createTable('products', table => {
        table.increments('id')
        table.string('name')
        table.integer('price')
        table.string('src')
        console.log('Tabla vacia creada con exito')
    })

    console.log(productsArray)
    await mariaDbClient('products').insert(productsArray)
        .then(() => console.log('Productos insertados en la tabla'))
        .catch((err) => { console.log(err); throw new Error(err) })
        .finally(() => { mariaDbClient.destroy(); console.log('Conexion MySQL Finalizada') })
    console.log('Tabla productos en mariaDb creada con éxito')
} catch (error) {
    console.log('Error al crear tabla productos en mariaDb')
    console.log(error)
}

try {
    const sqliteClient = knex(config.sqlite3)
    await sqliteClient.schema.dropTableIfExists('messages')
    await sqliteClient.schema.createTable('messages', table => {
        table.string('date');
        table.string('mail').notNullable();
        table.string('text');
    });
    await sqliteClient('messages').insert(messagesArray)
        .then(() => console.log('Mensajes insertados en la tabla'))
        .catch((err) => { console.log(err); throw new Error(err) })
        .finally(() => { sqliteClient.destroy(); console.log('Conexion SQLite finalizada') })
    console.log('tabla mensajes en sqlite3 creada con éxito')
} catch (error) {
    console.log('error al crear tabla mensajes en sqlite3')
    console.log(error)
}