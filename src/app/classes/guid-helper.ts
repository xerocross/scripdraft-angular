import { Injectable } from '@angular/core';


@Injectable({
    // declares that this service should be created
    // by the root application injector.
    providedIn: 'root',
  })

export class GuidHelper {

    getGuid () : string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
    }
}