import { Component } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import * as faceapi from '@vladmandic/face-api';
import { IonGrid, IonRow } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  constructor(public photoService: PhotoService) { }

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }

  public async faceDetect() {
    await faceapi.nets.ssdMobilenetv1.load('./assets/models');
  
    const elm = document.getElementById('photo');
    if (elm !== null) { // elmがnullでないことを確認
      const shadow = elm.shadowRoot?.querySelector('img');
  
      if (shadow !== null && shadow !== undefined) { // shadowがnullまたはundefinedでないことを確認
        // 以下の処理を実行
        // overlay canvas作成
        const canvas = faceapi.createCanvasFromMedia(shadow);
  
        var targetDiv = document.getElementById('test_canvas');
        if (targetDiv !== null) { // targetDivがnullでないことを確認
          targetDiv.appendChild(canvas);
        }
  
        const image = new Image();
        // https://kumamine.blogspot.com/2019/12/blog-post_27.html
        image.src = './assets/icon/cat.png';
  
        //顔認識
        const results = await faceapi.detectAllFaces(shadow);
  
        //サイズ合わせ
        const displaySize = {
          width: shadow.width,
          height: shadow.height
        };
        faceapi.matchDimensions(canvas, displaySize);
        const resizedResults = faceapi.resizeResults(results, displaySize);
        console.log(resizedResults);
        if (resizedResults.length <= 0) {
          alert("顔が認識できませんでした")
        }
  
        image.onload = function () {
          resizedResults.forEach(detection => {
            const marginValX = 1.1, marginValY = 1.5;
            const width = detection.box.width * (1.0 + marginValX);
            const height = detection.box.height * (1.0 + marginValY);
            const x = detection.box.x - detection.box.width * marginValX / 2;
            const y = detection.box.y - detection.box.height * marginValY / 1.3;
            const context = canvas.getContext('2d');
            if (context !== null) { // contextがnullでないことを確認
              context.drawImage(image, x, y, width, height);
            }
          });
        }
      }
    }
  }
  
  
    
}

