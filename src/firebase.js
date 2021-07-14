import app from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATA_BASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
  };
  
  if(!app.apps.length){
    app.initializeApp(firebaseConfig);
}

class Firebase{
    constructor(){
  
      //Referenciando a database para acessar em outros locais
      this.app = app.database();
      this.storage = app.storage();
  
    }
  
    login(email, password){
      return app.auth().signInWithEmailAndPassword(email, password)
    }
  
    logout(){
      return app.auth().signOut();
    }
  
    async register(nome, email, password){
      await app.auth().createUserWithEmailAndPassword(email, password)
  
      const uid = app.auth().currentUser.uid;
  
      return app.database().ref('usuarios').child(uid).set({
        nome: nome
      })
  
    }
  
    isInitialized(){
        return new Promise(resolve =>{
            app.auth().onAuthStateChanged(resolve);
        })
    }
  
    getCurrent(){
      return app.auth().currentUser && app.auth().currentUser.email
    }
  
    getCurrentUid(){
      return app.auth().currentUser && app.auth().currentUser.uid
    }
  
    async getUserName(callback){
      if(!app.auth().currentUser){
        return null;
      }
  
      const uid = app.auth().currentUser.uid;
      await app.database().ref('usuarios').child(uid)
      .once('value').then(callback);
    }
  
  }
  
  export default new Firebase();