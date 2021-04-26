import { Component, OnInit, Input } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { GuidService } from "./guid.service"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {
  title = 'scrip-draft';

  localStorageService : LocalStorageService;
  documentGuids : string[] = [];
  selectedDocument : string = "";
  guidService : GuidService;
  

  createNewDocument() {
    let newGuid : string = this.guidService.getGuid();
    this.selectedDocument = newGuid;
    this.localStorageService.saveDocument(newGuid);
    this.documentGuids.push(newGuid);
  }

  ngOnInit(): void {
    this.documentGuids = this.localStorageService.getDocumentGuids();
    if (this.documentGuids.length > 0) {
      this.selectedDocument = this.documentGuids[0];
    } else {
      let newGuid = this.guidService.getGuid();
      this.selectedDocument = newGuid;
      this.localStorageService.saveDocument(newGuid);
    }


    // this.guid = this.guidService.getGuid();
    // this.loadSavedAppData();
  }

  constructor(localStorageService : LocalStorageService, guidService : GuidService) {
    this.localStorageService = localStorageService;
    this.guidService = guidService;
  }

}
