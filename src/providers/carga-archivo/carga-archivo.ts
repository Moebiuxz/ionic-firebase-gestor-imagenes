import { Injectable } from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import * as firebase from 'firebase';
import {ToastController} from "ionic-angular";

@Injectable()
export class CargaArchivoProvider {
  imagenes: ArchivoSubir[] = [];

  constructor(private toastCtrl: ToastController,
              public afDB: AngularFireDatabase) {

  }

  cargarImagenFirebase(archivo: ArchivoSubir) {
    let promesa = new Promise((resolve, reject) => {
      this.mostrarToast('Cargando...');

      let storeRef = firebase.storage().ref();
      let nombreArchivo: string = new Date().valueOf().toString();

      let uploadTask: firebase.storage.UploadTask = storeRef.child(`img/${nombreArchivo}`)
        .putString(archivo.img, 'base64', {contentType: 'image/jpeg'});

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        () => {}, //saber el % de mb subidos)
        (error) => {
          // manejo de error
          console.log('ERROR EN LA CARGA');
          console.log(JSON.stringify(error));
          this.mostrarToast(JSON.stringify(error));
          reject();
        },
        () => {
          // Correcto
          console.log('Archivo subido');
          this.mostrarToast('Imagen cargada correctamente');

          let url = uploadTask.snapshot.downloadURL;

          this.crearPost(archivo.titulo, url, nombreArchivo);
          resolve();
        }
        )
    });
    return promesa
  }

  private crearPost( titulo:string, url: string, nombreArchivo:string ) {
    let post: ArchivoSubir = {
      img: url,
      titulo: titulo,
      key: nombreArchivo
    };
    console.log(JSON.stringify(post));

    // id por defecto de firebase
    // this.afDB.list('/post').push(post);
    this.afDB.object(`/post/${nombreArchivo}`).update(post);
    this.imagenes.push(post);
  }

  mostrarToast(mensaje: string) {
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 2000
    });
    toast.present()
  }
}

interface ArchivoSubir {
  titulo: string;
  img: string;
  key?: string;
}
