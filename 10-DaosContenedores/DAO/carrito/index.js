import config from '../../config.js'

let carritoDao

switch (config.PERS) {
    case 'json':
        const { default: CarritoDaoArchivo } = await import('./CarritoDaoArchivo.js')
        carritoDao = new CarritoDaoArchivo(config.fileSystem.path)
        break
    case 'firebase':
        const { default: PersonasDaoFirebase } = await import('./CarritoDaoFirebase.js')
        carritoDao = new PersonasDaoFirebase()
        break
    case 'mongodb':
        const { default: CarritoDaoMongo } = await import('./CarritoDaoMongo.js')
        carritoDao = new CarritoDaoMongo()
        break
    default:
        const { default: PersonasDaoMem } = await import('./PersonasDaoMem.js')
        carritoDao = new PersonasDaoMem()
        break
}

export { carritoDao }