// elegir tu persistencia acá
const PERS = 'mongodb'

export default {
    PERS,
    fileSystem: {
        path: './db'
    },
    mongodb: {
        // cnxStr: 'srv+mongodb://xxxxxxxxxxxxxxxxxxx', 
        cnxStr: 'mongodb://localhost:27017',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,
            serverSelectionTimeoutMS: 5000,
        }
    },
    firebase: {
    }
}