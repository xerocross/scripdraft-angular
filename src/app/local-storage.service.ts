import { Injectable } from '@angular/core';

import { LocalStorageFacade } from "./classes/local-storage-facade"

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  localStorageFacade : LocalStorageFacade = new LocalStorageFacade();
  appDataKey : string = "appData";


  saveAppData(cleanObject : any) : void {
    LocalStorageFacade.write(this.appDataKey, JSON.stringify(cleanObject));
  }

  retrieveAppdata(): any {
      let appDataString : string | null = LocalStorageFacade.read(this.appDataKey);
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
