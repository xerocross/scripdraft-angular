import { Component, OnInit, ElementRef,Renderer2, ViewChild } from '@angular/core';

// @ts-ignore
import { DraftCommit } from '../classes/draft-commit.ts';
// @ts-ignore
import { CommitChain } from '../classes/commit-chain.ts';
// @ts-ignore
import { LocalStorageHelper } from '../classes/local-storage-helper.ts';
// // @ts-ignore
// import { GuidHelper } from '../classes/guid-helper.ts';

// @ts-ignore
import { GuidService } from '../guid.service';

@Component({
  selector: 'app-draft-box',
  templateUrl: './draft-box.component.html',
  styleUrls: ['./draft-box.component.scss']
})
export class DraftBoxComponent implements OnInit {

  @ViewChild('mainEditor') 
  editor:ElementRef | null = null;
  localStorageHelper : LocalStorageHelper = new LocalStorageHelper();

  log : Function = function(message:string){
    console.log(message);
  }

  guidService : GuidService;
  guid: string;
  bufferText : string = "";
  commitUserIsLookingAt : number = -1;
  isBufferContainsUncommittedChanges : boolean = false; // to capture whether text of a commit has been changed.
  commitsList : CommitChain;
  

  copyText : any = {
    confirmGoForwardWithLossUnsavedChanges : "If you go forward, you will lose unsaved changes currently in the buffer. But there is no way to keep both. Continue?",
    alertCanNotGoBackWithUnsavedChanges : "You have unsaved changes. You must either commit them or reset to the last commit point.",
    confirmDestructiveInnerCommitWarning : "This action is destructive. It will destroy any commits that are 'forward' from the current one. Do you want to continue with this commit?",
    confirmDestructiveClearAll : "Clear all text and delete all commits?",
    commitCancelledAlert : "Commit was canceled. No action taken.",
    noChangesYet : "no changes yet",
    uncommittedChanges : "uncommitted changes",
    allChangesCommitted : "all changes committed",
    noCommits : "no commits",
    cannotGoBack : "Cannot go back from here."
  }

  errorMessages : any = {
    unexpectedCondition : "An unexpected condition has occurred."
  }

  constructor (private rd: Renderer2, guidService :GuidService) {
    this.commitsList = new CommitChain();
    this.guidService = guidService;
    this.guid = guidService.getGuid();
  }


  private getMessageAtCommit(atCommit : number, ofCommits : number) : string {
    return "At commit " + atCommit + " of " + ofCommits;
  }


  private isThereAreNoCommitsYet() {
    return this.commitUserIsLookingAt == -1;
  }

  private isAtTailEdge() : boolean {
    return (this.isThereAreNoCommitsYet() || this.commitsList.size() == this.commitUserIsLookingAt + 1);
  }

  private isUserViewingInteriorCommit() : boolean {
    return (!this.isThereAreNoCommitsYet() // rule out case of no commits
      && this.commitUserIsLookingAt < this.commitsList.size());
  }

  private updateBuffer():void {
    this.bufferText = this.getDisplayText(); 
  }

  private getDisplayText(): string {
    if (this.commitUserIsLookingAt < this.commitsList.size()) { 
      return this.commitsList.get(this.commitUserIsLookingAt).getString();
    } else {
      throw new Error(this.errorMessages.unexpectedCondition);
    }
  }

  get numCommits() :number {
    return this.commitsList.size();
  }

  get currentDraftCommit() : any {
    if (this.commitUserIsLookingAt >= 0) {
      this.commitsList.get(this.commitUserIsLookingAt);
    } else {
      return null;
    } 
  }

  get changesDescriptorText(): string {
    if (this.isThereAreNoCommitsYet()) {
      return this.copyText.noChangesYet;
    } else if (this.isBufferContainsUncommittedChanges) {
      return this.copyText.uncommittedChanges;
    } else { 
      // viewing a pristine commit
      return this.copyText.allChangesCommitted;
    }
  }

  get commitPositionText(): string {
    if (this.commitUserIsLookingAt == -1) {
      return this.copyText.noCommits;
    } else if (this.commitUserIsLookingAt >= 0) {
      return this.getMessageAtCommit(this.commitUserIsLookingAt + 1, this.numCommits);
    } else {
      throw new Error(this.errorMessages.unexpectedCondition);
    }
  }

  get isClearAllAllowed() : boolean {
    return this.isBufferContainsUncommittedChanges || this.numCommits > 0;
  }


  clearAll() : void {
    if(confirm(this.copyText.confirmDestructiveClearAll)) {
      this.bufferText = "";
      this.isBufferContainsUncommittedChanges = false;
      this.commitUserIsLookingAt = -1;
      this.isBufferContainsUncommittedChanges = false; 
      this.commitsList = new CommitChain();
    }
  }


  saveData () : void {
    let cleanObject : any = this.getCleanObject();
    console.log(cleanObject);
    this.localStorageHelper.saveAppData(cleanObject);
  }

  getCleanObject() : any {
    let cleanObject : any = {};
    cleanObject["bufferText"] = this.bufferText;
    cleanObject["guid"] = this.guid;
    cleanObject["isBufferContainsUncommittedChanges"]   = this.isBufferContainsUncommittedChanges;
    cleanObject["commits"] = this.commitsList.getCleanObject();
    cleanObject["commitUserIsLookingAt"] = this.commitUserIsLookingAt;
    return cleanObject;
  }



  sendUserMessage (message: string) : void {
    alert(message);
  }


  private spliceNewCommitChain(newCommit : DraftCommit) : CommitChain {
    let newChainArray = this.commitsList.getCommits().splice(0, this.commitUserIsLookingAt + 1);
    newChainArray.push(newCommit);
    let newChain = CommitChain.getFromArray(newChainArray);
    return newChain;
  }


  private focusOnEditor() {
    if (this.editor) {
      this.editor.nativeElement.focus();
    }
  }


  // tail edge includes the case of no commits yet
  private commitAtTailEdge() : void {
    let draftCommit = new DraftCommit(this.bufferText);
    this.commitsList.push(draftCommit);
    this.commitUserIsLookingAt = this.commitUserIsLookingAt + 1;
    this.setIsClean();
  }



  private commitNewAtInteriorDestructive() : void {
    let commit = new DraftCommit(this.bufferText);
    let newCommitChain: CommitChain = this.spliceNewCommitChain(commit);
    this.commitsList = newCommitChain;
    this.commitUserIsLookingAt = this.commitUserIsLookingAt + 1;
    this.isBufferContainsUncommittedChanges = false;
  }


  commit(): void {
    if (this.isAtTailEdge()) {
      this.commitAtTailEdge();
    } else if (this.isUserViewingInteriorCommit()) {
      if(confirm(this.copyText.confirmDestructiveInnerCommitWarning)) {
        this.commitNewAtInteriorDestructive();
      } else {
        this.sendUserMessage(this.copyText.commitCancelledAlert)
      }
    } else {
      throw new Error(this.errorMessages.unexpectedCondition);
    }
    this.focusOnEditor();
  }


  handleTextChange(newText : string) {
    this.setIsDirty();
    let dataObj = this.saveData();
  }


  get canGoBack():boolean {
    if (this.isBufferContainsUncommittedChanges) {
      return this.commitUserIsLookingAt > 0;
      // in this case, user receives a tip message, and then there is no further effect,
      // handled inside the goBackOne method
    } else {
      // buffer is clean
      return this.commitUserIsLookingAt > 0;
    }
  }

  get canGoForward() : boolean {
    return this.existsNextCommit;
  }


  get existsAtLeastOneCommit() : boolean {
    return this.numCommits > 0;
  }

  get canResetToLastCommit(): boolean {
    if (this.isBufferContainsUncommittedChanges) {
      // check that there exists at least one commit and 
      // the current commit in view is at least commit 0.
      return this.commitUserIsLookingAt > -1
    } else {
      // buffer is pristine: there is nothing to reset
      return false;
    }
  }

  get existsNextCommit(): boolean {
    let size = this.commitsList.size();
    return this.commitUserIsLookingAt < size - 1;
  }

  goBackOne(): void {
    if (this.isBufferContainsUncommittedChanges)  {
      alert(this.copyText.alertCanNotGoBackWithUnsavedChanges);
      return;
    }

    if (this.commitUserIsLookingAt > 0 ) {
      this.commitUserIsLookingAt = this.commitUserIsLookingAt - 1;
      this.updateBuffer();
      this.setIsClean();
    } else {
      // the button should be disabled so this condition should never occur.
      // but this is not a fatal error
      this.log("unexpected condition: 0A8D825C-85F4-4B58-9AB6-78D1621E423F");
      alert(this.copyText.cannotGoBack);
    }
  }

  goForwardOne(): void {
    if (this.existsNextCommit) {
      if (this.isBufferContainsUncommittedChanges) {
        if (confirm(this.copyText.confirmGoForwardWithLossUnsavedChanges)) {
          this.isBufferContainsUncommittedChanges = false;
        } else {
          return; // do nothing
        }
      }
      this.commitUserIsLookingAt = this.commitUserIsLookingAt + 1;
      this.updateBuffer();
    } else {
        // the button is disabled and this should never happen
        // but it is not a fatal error. Instead, log
        this.log("unexpected event: ED892479-9E6C-483C-9F77-5E4911B70163");
    }
  }

  private setIsDirty(): void {
    this.isBufferContainsUncommittedChanges = true;
  }

  setIsClean(): void {
    this.isBufferContainsUncommittedChanges = false;
  }

  resetToLatestCommit() : void {
    let confirmation = confirm("This will erase any uncommitted changes you have made. Keep going?");
    if (confirmation) {
      this.bufferText = this.commitsList.get(this.commitUserIsLookingAt).getString();
      this.setIsClean();
      this.focusOnEditor();
    }
  }


  ngOnInit(): void {
  }

}
