// elegir tu persistencia acá
const PERS = 'firebase'

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
        pathfire: './db/basefirebase-1268b-firebase-adminsdk-m8t9d-d60b5496d7.json',

    }
}