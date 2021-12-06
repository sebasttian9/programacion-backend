import config from '../../config.js'

let productosDao

switch (config.PERS) {
    case 'json':
        const { default: ProductosDaoArchivo } = await import('./productos/ProductosDaoArchivo.js')
        productosDao = new ProductosDaoArchivo(config.fileSystem.path)
        break
    case 'firebase':
        const { default: PersonasDaoFirebase } = await import('./productos/ProductosDaoFirebase.js')
        productosDao = new PersonasDaoFirebase()
        break
    case 'mongodb':
        const { default: PersonasDaoMongoDb } = await import('./productos/ProductosDaoMongo')
        productosDao = new PersonasDaoMongoDb()
        break
    default:
        const { default: PersonasDaoMem } = await import('./PersonasDaoMem.js')
        productosDao = new PersonasDaoMem()
        break
}

export { productosDao }