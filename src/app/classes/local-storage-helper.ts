// @ts-ignore
import { LocalStorageFacade } from "./local-storage-facade.ts";


export class LocalStorageHelper {

    localStorageFacade : LocalStorageFacade = new LocalStorageFacade();
    appDataKey : string = "appData";


    saveAppData(cleanObject : any) : void {
        this.localStorageFacade.write(this.appDataKey, JSON.stringify(cleanObject));
    }

    retrieveAppdata(): any {
        let appDataString = this.localStorageFacade.read(this.appDataKey);
        return JSON.parse(appDataString);
    }

}