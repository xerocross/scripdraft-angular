import { Injectable } from '@angular/core';

import { LocalStorageFacade } from "./classes/local-storage-facade"

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  localStorageFacade : LocalStorageFacade = new LocalStorageFacade();
  appDataKey : string = "appData";
  
  documentsKey : string = "documents";


  private getKeyString (externalKey : string) {
    return this.appDataKey + ":" + externalKey;
  }

    
  saveAppData(key: string, cleanObject : any) : void {
    LocalStorageFacade.write(this.getKeyString(key), JSON.stringify(cleanObject));
  }

  saveDocumentData (guid: string, cleanObject : any) : void {
    LocalStorageFacade.write(this.getKeyString(guid), JSON.stringify(cleanObject));
  }

  getDocumentData (guid : string) : any {
    let documentString : string | null = LocalStorageFacade.read(this.getKeyString(guid));
    if (documentString!= null) {
      return JSON.parse(documentString)
    } else {
      return null;
    }
  }


  getDocumentGuids() : string[] {
    let documentString : string | null = LocalStorageFacade.read(this.documentsKey);
    if (documentString != null) {
      return JSON.parse(documentString);
    } else {
      return []
    }
  }

  saveDocument(guid : string) : void {
    let documents : string[] = this.getDocumentGuids();
    if (documents.indexOf(guid) > -1) {
      return;
    } else {
      documents.push(guid);
    }
    LocalStorageFacade.write(this.documentsKey, JSON.stringify(documents));
  }


  retrieveAppdata(key: string): any {
      let appDataString : string | null = LocalStorageFacade.read(this.getKeyString(key));
      if (appDataString != null) {
        return JSON.parse(appDataString);
      } else {
        return null;
      }
  }

  isAppdataExists(): boolean {
    let appDataString : string | null = LocalStorageFacade.read(this.appDataKey);
    return (appDataString != null);
  }
}
