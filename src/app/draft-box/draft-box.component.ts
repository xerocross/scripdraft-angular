import { Component, OnInit, ElementRef,Renderer2, ViewChild } from '@angular/core';


import { FormControl } from '@angular/forms';
// @ts-ignore
import { DraftCommit } from '../classes/draft-commit';
// @ts-ignore
import { CommitChain } from '../classes/commit-chain'


@Component({
  selector: 'app-draft-box',
  templateUrl: './draft-box.component.html',
  styleUrls: ['./draft-box.component.scss']
})
export class DraftBoxComponent implements OnInit {

  draftText : string = "";
  @ViewChild('mainEditor') 
  editor:ElementRef | null = null;
  bufferText : string = "";
  bufferBackup : string = "";
  isUncommittedChanges: boolean = false;
  commitIndex : number = -1;
  isDirty : boolean = false; // to capture whether text of a commit has been changed.


  // commit history
  commitChain : CommitChain;
  

  constructor (private rd: Renderer2) {
    this.commitChain = new CommitChain();
  }

  get numCommits() :number {
    return this.commitChain.size();
  }

  get isShowPreview(): boolean {
    return this.commitIndex > -1;
  }

  get currentDraftCommit() : any {
    if (this.commitIndex >= 0) {
      this.commitChain.get(this.commitIndex);
    } else {
      return null;
    } 
 }

  get changesDescriptorText(): string {
    if (this.commitIndex == -1) {
      return "no changes yet";
    } else if (this.isDirty) {
      return "uncommitted changes"
    } else {
      return "all changes committed"
    }
  }

  get commitPositionText(): string {
    if (this.commitIndex == -1) {
      return "No commits";
    } else if (this.commitIndex >= 0) {
      return "At commit " + (this.commitIndex + 1) + " of " + this.numCommits.toString()
    } else {
      throw new Error("unexpected condition");
    }
  }

  get displayText() : string {

    if (this.commitIndex == -1 || this.commitChain.size() == this.commitIndex) {
      return this.bufferText;
      
    } else if (this.commitIndex < this.commitChain.size()) { 
      return this.commitChain.get(this.commitIndex).getString();
    } else {
      throw new Error("unexpected event");
    }
  }




  updateBuffer():void {
    this.bufferText = this.getDisplayText(); 
  }

  getDisplayText(): string {
    console.log("commitChain.size", this.commitChain.size());
    console.log("commitIndex", this.commitIndex);
    if (this.commitIndex == -1 || this.commitChain.size() == this.commitIndex) {
      console.log("this", this.commitChain.size());
      return this.bufferText;
      
      //
    } else if (this.commitIndex < this.commitChain.size()) { 
      console.log("that");
      return this.commitChain.get(this.commitIndex).getString();
    } else {
      throw new Error("unexpected event");
    }
  }

  isAtTailEdge() : boolean {
    return (this.commitIndex == -1 || this.commitChain.size() == this.commitIndex + 1);
  }

  isAtInterior() : boolean {
    return (0 <= this.commitIndex && this.commitIndex < this.commitChain.size());
  }


  clearAll() : void {
    if(confirm("Clear all text and delete all commits?")) {

      this.draftText = "";
      this.bufferText = "";
      this. bufferBackup = "";
      this.isUncommittedChanges = false;
      this.isDirty = false;
      this.commitIndex = -1;
      this.isDirty = false; 
      this.commitChain = new CommitChain();
    }
  }


  sendUserMessage (message: string) : void {
    alert(message);
  }


  spliceNewCommitChain(newCommit : DraftCommit) : CommitChain {
    let newChainArray = this.commitChain.getCommits().splice(0, this.commitIndex + 1);
    newChainArray.push(newCommit);
    let newChain = CommitChain.getFromArray(newChainArray);
    return newChain;
  }


  focusOnEditor() {
    if (this.editor) {
      this.editor.nativeElement.focus();
    }
  }


  commit(): void {
    // first, let's assume we are at the tail edge of the commit history
    if (this.isAtTailEdge()) {
      let draftCommit = new DraftCommit(this.bufferText);
      this.commitChain.push(draftCommit);
      this.commitIndex = this.commitIndex + 1;
      this.setIsClean();
    } else if (this.isAtInterior()) {
      if(confirm("This action is destructive. It will destroy any commits that are 'forward' from the current one. Do you want to continue with this commit?")) {
        let commit = new DraftCommit(this.bufferText);
        let newCommitChain: CommitChain = this.spliceNewCommitChain(commit);
        this.commitChain = newCommitChain;
        this.commitIndex = this.commitIndex + 1;
        this.isDirty = false;
      } else {
        this.sendUserMessage("Commit was canceled. No action taken.")
      }
      
    } else {
      throw new Error("this case hasn't been handled yet")
    }
    this.focusOnEditor();
  }


  handleTextChange(newText : string) {
    console.log("event:" + newText);
    this.setIsDirty();
  }


  get canGoBack():boolean {
    if (this.isDirty) {
      return this.commitIndex > 0;
    } else {
      // it's clean
      return this.commitIndex > 0;
    }


    return !this.isDirty && this.commitIndex > 0
  }

  get existsAtLeastOneCommit() : boolean {
    return this.numCommits > 0;
  }

  get canResetToLastCommit(): boolean {
    if (this.isDirty) {
      // check that there exists at least one commit and 
      // the current commit in view is at least commit 0.
      return this.commitIndex > -1
    } else {
      // buffer is pristine: there is nothing to reset
      return false;
    }
}

  goBackOne(): void {
    if (this.isDirty)  {
      alert("You have unsaved changes. You must either commit them or reset to the last commit point.");
      return;
    }

    if (this.commitIndex > 0 ) {
      this.bufferBackup = this.bufferText;
      if (this.isDirty) {
        this.isUncommittedChanges = true;
      }
      this.commitIndex = this.commitIndex - 1;
      this.updateBuffer();
      this.setIsClean();
    }
  }

  goForwardOne(): void {


    if (this.isNextCommit) {

      if (this.isDirty) {
        if (confirm("If you go forward, you will lose unsaved changes currently in the buffer. But there is no way to keep both. Continue?")) {
          this.isDirty = false;
        } else {
          return;
        }
      }



      this.bufferBackup = this.bufferText;
      this.commitIndex = this.commitIndex + 1;
      this.updateBuffer();
    } else if (this.isUncommittedChanges) {
        this.showUncommittedChanges();
    }
  }

  // get isUnsavedChanges(): boolean {
  //   console.log("soupy")
  //   if (!this.isNextCommit) {
  //     return this.isUncommittedChanges;
  //   } else {
  //     return false;
  //   }
  // }

  showUncommittedChanges(): void {

    this.bufferText = this.bufferBackup;
    console.log("UncommittedChanges", this.bufferBackup);
    this.setIsDirty();
  }


  get isNextCommit(): boolean {
    let size = this.commitChain.size();
    return this.commitIndex < size - 1;
  }


  setIsDirty(): void {
    this.isDirty = true;
  }

  setIsClean(): void {
    this.isDirty = false;
  }



  resetToLatestCommit() : void {
    let confirmation = confirm("This will erase any uncommitted changes you have made. Keep going?");
    if (confirmation) {
      this.bufferText = this.commitChain.get(this.commitIndex).getString();
      this.setIsClean();
      this.focusOnEditor();
    }
  }


  ngOnInit(): void {
  }

}
