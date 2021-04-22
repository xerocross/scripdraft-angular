import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
// @ts-ignore
import { DraftCommit } from '../classes/draft-commit.ts';

@Component({
  selector: 'app-draft-box',
  templateUrl: './draft-box.component.html',
  styleUrls: ['./draft-box.component.scss']
})
export class DraftBoxComponent implements OnInit {
  committedString : string = "";
  draftText : string = "";
  //draftText = new FormControl('');




  commit(): void {
    this.committedString = this.draftText;
    alert("committed value is " + this.committedString);
  }


  ngOnInit(): void {
  }

}
