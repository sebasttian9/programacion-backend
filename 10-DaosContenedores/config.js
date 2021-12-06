// elegir tu persistencia acá
const PERS = 'json'

export default {
    PERS,
    fileSystem: {
        path: './db'
    },
    mongodb: {
        cnxStr: 'srv+mongodb://xxxxxxxxxxxxxxxxxxx',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            serverSelectionTimeoutMS: 5000,
        }
    },
    firebase: {
    }
}