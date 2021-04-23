import { Component, OnInit } from '@angular/core';
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
  
  
  //  state
  draftText : string = "";
  bufferText : string = "";
  bufferBackup : string = "";
  isUncommittedChanges: boolean = false;
  commitIndex : number = -1;
  isDirty : boolean = false; // to capture whether text of a commit has been changed.


  // commit history
  commitChain : CommitChain;
  

  constructor () {
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

  // get positionDescriptor(): string {
  //   if (this.commitIndex == -1 && !this.isDirty) {
  //     return "No commits, no changes";
  //   } else if (this.commitIndex == -1 && this.isDirty) {
  //     return "No commits, uncommitted changes."
  //   } else if (this.commitIndex >= 0 && this.isDirty) {
  //     return "At commit " + (this.commitIndex + 1) + " of " + this.numCommits.toString() + " with uncommitted changes";
  //   } else if (this.commitIndex >= 0 && !this.isDirty) {
  //     return "At commit " + (this.commitIndex + 1) + " of " + this.numCommits.toString() + " with no changes.";
  //   } else {
  //     throw new Error("unexpected condition");
  //   }
  // }


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


  // private updateText(draftCommit : DraftCommit) : void {
  //   this.displayText = draftCommit.getString();
  // }

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
    let newChainArray = this.commitChain.getCommits().splice(0, this.commitIndex);
    newChainArray.push(newCommit);
    let newChain = CommitChain.getFromArray(newChainArray);
    return newChain;
  }


  commit(): void {
    // first, let's assume we are at the tail edge of the commit history
    if (this.isAtTailEdge()) {
      let draftCommit = new DraftCommit(this.bufferText);
      this.commitChain.push(draftCommit);
      this.commitIndex = this.commitIndex + 1;
      this.setIsClean();
    } else if (this.isAtInterior()) {
      //if(confirm("This action is destructive. It will destroy any commits that are 'forward' from the current one. Do you want to continue with this commit?")) {
      
      if (true) {
        let commit = new DraftCommit(this.bufferText);
        let newCommitChain: CommitChain = this.spliceNewCommitChain(commit);
        this.commitChain = newCommitChain;
        //this.commitIndex = this.commitIndex + 1;
        this.isDirty = false;
      } else {
        this.sendUserMessage("Commit was canceled. No action taken.")
      }


    } else {
      throw new Error("this case hasn't been handled yet")
    }
  }


  handleTextChange(newText : string) {
    console.log("event:" + newText);
    this.setIsDirty();
  }


  get canGoBack():boolean {
    return !this.isDirty && !(this.commitIndex == -1);
  }

  get canResetToLastCommit(): boolean {
    return this.commitIndex > -1 && this.isDirty && (this.commitIndex == this.commitChain.size() - 1);
  }

  goBackOne(): void {
    if (this.isDirty)  {
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
    //let confirmation = confirm("This will erase any uncommitted changes you have made. Keep going?");
    if (true) {
      this.bufferText = this.commitChain.get(this.commitIndex).getString();
      this.setIsClean();
    }
  }


  ngOnInit(): void {
  }

}
