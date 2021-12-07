import config from '../../config.js'

let productosDao

switch (config.PERS) {
    case 'json':
        const { default: ProductosDaoArchivo } = await import('./ProductosDaoArchivo.js')
        productosDao = new ProductosDaoArchivo(config.fileSystem.path)
        break
    case 'firebase':
        const { default: PersonasDaoFirebase } = await import('./ProductosDaoFirebase.js')
        productosDao = new PersonasDaoFirebase()
        break
    case 'mongodb':
        const { default: ProductosDaoMongo } = await import('./ProductosDaoMongo.js')
        productosDao = new ProductosDaoMongo()
        break
    default:
        const { default: PersonasDaoMem } = await import('./PersonasDaoMem.js')
        productosDao = new PersonasDaoMem()
        break
}

export { productosDao }