import admin from "firebase-admin";
import config from "../config.js";
import fs from "fs";
import { Console } from "console";

// var serviceAccount = require(config.firebase.pathfire);
const serviceAccount = JSON.parse(fs.readFileSync(config.firebase.pathfire, 'utf8'));

admin.initializeApp({credential: admin.credential.cert(serviceAccount)});


class ContenedorFirebase {



    constructor(collection){
        // console.log(admin.firestore());
        const db = admin.firestore();
        this.query = db.collection(collection);
        // console.log(this.query);
        console.log('Base Firebase conectada!');
    }


    // const asObj = doc => ({ id: doc.id, ...doc.data() });

    async getAll(){

      try{

        const querySnapshot = await this.query.get();
        let docs = querySnapshot.docs;

        const response = docs.map((doc)=> ({
          id: doc.id,
          precio:doc.data().precio,
          thumb: doc.data().thumb
        }));


          return response;

      }catch(e){
          console.log(e);
      } 

    }


    async save(objeto){

      let id = 1;
      console.log('objeto-->',objeto);
      // const doc = this.query.doc(`${id}`);
      // let guardado = await doc.create(objeto);
      let guardado = await this.query.add(objeto);
      console.log(guardado.id);
        
      return guardado;
    }


}


export default ContenedorFirebase;