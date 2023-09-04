import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { baseService } from "../base.service";
import { AngularFireStorage } from "@angular/fire/compat/storage";

@Injectable({
  providedIn: "root",
})
export class FirebaseUploadService extends baseService {
  constructor(public override http: HttpClient, private storage: AngularFireStorage) {
    super(http);
  }

  uploadImage(photoImage, fileName, userId) {
    let firebaseFileUrl = `${userId}/${fileName}`;
    const pictures = this.storage.ref(firebaseFileUrl);

    return pictures.putString(photoImage, "data_url");
  }

  uploadOtherFiles(file, fileName, userId) {
    let firebaseFileUrl = `${userId}/${fileName}`;
    const pictures = this.storage.ref(firebaseFileUrl);
    let blob = new Blob([file.data], { type: file.mediaType });

    return pictures.put(blob, { contentType: file.mediaType });
  }
}
