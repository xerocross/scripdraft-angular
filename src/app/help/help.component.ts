import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
  isShow : boolean = false;
  

  get showOrHideMessage(): string {
    return this.isShow ? "Hide Manual" : "Show Manual";
  }

  constructor() { }

  toggleShowHide() : void {
    this.isShow = !this.isShow;
  }

  ngOnInit(): void {
  }

}
