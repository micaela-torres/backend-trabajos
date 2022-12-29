import { promises as fs } from 'fs';

export const productsArray = JSON.parse(await fs.readFile('./resources/txt/products.txt')) //RUTA
export const messagesArray = JSON.parse(await fs.readFile('./resources/txt/messages.txt')) //RUTA