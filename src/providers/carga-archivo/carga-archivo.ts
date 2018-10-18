import { Injectable } from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import * as firebase from 'firebase';
import {ToastController} from "ionic-angular";

@Injectable()
export class CargaArchivoProvider {

  constructor(private toastCtrl: ToastController) {

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
          resolve();
        }
        )
    });
    return promesa
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
