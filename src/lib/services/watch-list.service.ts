import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
// import { Observable } from 'rxjs/Observable';

import { BadInput } from '../Enums/bad-input';
import { NotFoundError } from '../Enums/not-found-error';
import { AppError } from '../Enums/app-error';
import { NotificationModel } from '../model/NotificationModel';
import { Subject } from 'rxjs';
import { CSVFile, Person } from '../person-enrollment/person-enrollment.component';
import { CollectionType } from '../Enums/CollectionType';

@Injectable({
  providedIn: 'root'
})
export class WatchListService {

  noOfEnrollment: number = 0;
  $TotalEnrollmentCount: Subject<number> = new Subject<number>();
  $enrollmentDoneCount: Subject<number> = new Subject<number>();
  $cancelEnrollmentStatus: Subject<boolean> = new Subject<boolean>();
  $enrollmentCompleted: Subject<number> = new Subject<number>();
  $UploadedImagesPersonEnrollStatus : Subject<Person> = new Subject<Person>();
  $refreshWatchList: Subject<boolean> = new Subject<boolean>();

  constructor(protected http: HttpClient) { }
  notificationemittor: EventEmitter<NotificationModel> =
    new EventEmitter<any>();



  public getSystemDetails() {
    return this.http.get("/api/GetSystemDetails");
  }

  public getAllFacePoints() {
    return this.http.get("/api/common/GetAllFacePoints");
  }

  public getMatchingFaces(data: any, matchPercentage: number , collectionType: CollectionType) {
    return this.http.post(`/api/common/GetMatchingFaces?matchPercentage=${matchPercentage}`, {EmbeddingData:data, CollectionName: collectionType});

  }

  public GetMatchingEvents(data: any, matchPercentage: number , collectionType: CollectionType){
    return this.http.post(`/api/Common/GetMatchingEvents?matchPercentage=${matchPercentage}`, {EmbeddingData:data, CollectionName: collectionType});
  }

  public deletePerson(id: number) {
    return this.http.delete("/api/common/DeletePerson?personId=" + id);
  }

  public deleteAllPerson() {
    return this.http.delete("/api/common/DeleteAllPerson");
  }

  public deleteSelectedPerson(ids) {
    return this.http.post("/api/common/DeleteMultiplePerson", ids);
  }

  public getPersonsById(ids: any) {
    return this.http.post("/api/common/getPersonByIds", ids);
  }

  public uploadFiles(file: File, fileName: string) {
    let formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);

    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post('/api/common/Upload', formData, { headers: headers });
  }

  public uploadMultipleFiles(files: FileList) {
    let formData: FormData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i], files[i].name);
    }

    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    return this.http.post('/api/common/UploadMultiple', formData, { headers: headers });
  }

  public getUploadedImages(files: FileList, matchThreshold : number) {
    let formData: FormData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i], files[i].name);
    }

    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    return this.http.post(`/api/common/getUploadedImages?matchingThreshold=${matchThreshold}`, formData, { headers: headers });
  }

  public deleteUploadedImages(personImages: string[]) {
    return this.http.delete("/api/common/deleteUploadedImages", {"body" : personImages});
  }

  public getUploadedFolders() {
    let headers = new HttpHeaders();
    headers.append('Cache-Control', 'no-cache');
    return this.http.get("/api/common/getUploadedFolder");
  }

  public getPersonsByPaginated(skip: number, pageLimit: number, label: string, name: string, order: string) {
    return this.http.get(`/api/GetPersonsByPagination/?skip=${skip}&pageLimit=${pageLimit}&label=${label}&name=${name}&order=${order}`);
  }


  public getPersonByname() {
    return this.http.get("/api/GetPerson");
  }

  public getEmbedding(imagePath: any, detectAllFace?: any, fullImageAsFace?: any) {
    if (!detectAllFace) {
      detectAllFace = false;
    }
    if (fullImageAsFace == undefined) {
      fullImageAsFace = false;
    }
    return this.http.get("/api/common/GetEmbedding?ImagePath=" + imagePath + "&largestFace=" + !detectAllFace + "&fullImageAsFace=" + fullImageAsFace);
  }

  public addMultiplePerson(personList: any) {
    return this.http.post("/api/common/AddMultiplePerson", personList);
  }

  public getPersonList() {
    return this.http.get('/api/GetPersons');
  }

  public addFaceswithperson(person: any) {
    return this.http.post("/api/common/AddFaces", person);
  }
  public removeFaces(facePoints: any) {
    var facePointIds: number[] = [];
    if (facePoints) {
      facePoints.forEach((point: any) => {
        facePointIds.push(point.id);
      });
    }
    return this.http.post("/api/common/RemoveFace", facePointIds);
  }

  public editPerson(person: any) {
    return this.http.put("/api/common/UpdatePerson?personId=" + person.id, person);
  }

  // public getPersonsByAttributes(data: any) {
  //   return this.http.post("/api/common/GetPersonsByAttributes", data);
  // }
  public getPersonsByAttributes(skip: number, pageLimit: number, order: string, data: any) {
    return this.http.post(`/api/common/GetPersonsByAttributes/?skip=${skip}&pageLimit=${pageLimit}&order=${order}`, data);
  }

  public addPerson(person: any) {
    return this.http.post<any>("/api/common/AddPerson", person);
  }

  public addPersonInBatch(folderPath: string, label: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post("/api/common/AddPersonInBatch", {'folderPath' : folderPath, 'label' : label}, { headers: headers });
  }

  public addPersonInBatchWithMultiplePhotos(folderPath: string, label: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post("/api/common/AddPersonInBatchWithMultiplePhotos", {'folderPath' : folderPath, 'label' : label}, { headers: headers });
  }

  public cancelEnrollment() {
    return this.http.get("/api/common/cancelEnrollment");
  }

  public postPersonVideoSourceMapping(personVideoSources: any) {
    return this.http.post("/api/PersonVideoSource", personVideoSources);
  }

  public deletePersonVideoSourceMapping(personVideoSources: any) {
    return this.http.request('delete', "/api/PersonVideoSource", { body: personVideoSources });
  }

  public AddVideoSourceToAllPersons(videoSourceIds: Array<number>) {
    return this.http.post("/api/PersonVideoSource/AddVideoSourceToAllPersons" , videoSourceIds);
  }

  getVideoSources() {
    return this.http.get('/api/VideoSource');
  }
  
  enrollingThroughFilePath(filePath: any, base64: any) {
    // return this.http.get('/api/common/filepath/?filepath=' + filePath + "&filename" + `&base64=${base64}`).pipe(
    //   catchError((err: any) => {
    //     console.log(err);
    //     return err
    //   })
    // );
  }

  public getUniqueAttributes() {
    return this.http.get("/api/Analytic/GetUniqueAttributes");
  }

  uploadExcel(file : CSVFile, base64: boolean) {
    let formData: FormData = new FormData();
    formData.append('file', file.file);    
    return this.http.post(`/api/common/excel?incomingFilePath=${file.filePath}&base64=${base64}`, formData);
  }

  public enrollUploadedImages(personToEnroll : Person[])
  {
    return this.http.post('api/common/enrollUploadedImages', personToEnroll);
  }

  public getEnrollmentStatus(){
    let headers = new HttpHeaders({
      'Cache-Control':  'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0'
  });
    
    return this.http.get('api/common/getEnrollmentStatus', { headers: headers});
  }
  closeUpload() {
    return this.http.post('/api/common/closeUpload', {})

  }

  public ExportWatchList(isAllRowsSelected : boolean, selectedRowsList : []){
    let headers = new HttpHeaders({
      'Cache-Control':  'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0'
  });
    return this.http.post('api/common/export/WatchList', {"isAllRowsSelected" : isAllRowsSelected, "selectedRowsList" : selectedRowsList}, { headers: headers});
  }
  
  private handleError(error: any) {
    if (error.status === 400) {
      if (error.error && error.error != '') {
        this.notificationemittor.next({
          source: 'watch-list.service',
          message: error.error,
          type: "error"
        });
      }
      // return Observable.throw(new BadInput(error));
    }
    else if (error.status === 404) {
      // return Observable.throw(new NotFoundError());
    }
    else {
      // return Observable.throw(new AppError(error));
    }
  }
}

