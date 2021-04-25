import { identifierModuleUrl } from '@angular/compiler';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { DraftBoxComponent } from './draft-box.component';

describe('DraftBoxComponent', () => {
  let component: DraftBoxComponent;
  let fixture: ComponentFixture<DraftBoxComponent>;
  let commitButton: DebugElement;
  let textareaDebug: DebugElement;
  let textarea: any;
  let backButton: DebugElement;
  let forwardButton: DebugElement;
  let positionDescriptor: DebugElement;
  let commitPosition: any;
  let commit : Function;
  let resetLastCommitButton : DebugElement;
  const firstCommitText = "a";
  const secondCommitText = "b"
  const thirdCommitText = "c"
  let goBack : Function;
  let goForward : Function;
  let updateBuffer : Function;
  let resetToLastCommit : Function;

  beforeEach(async () => {

    

    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [ DraftBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    localStorage.removeItem("appData");
    fixture = TestBed.createComponent(DraftBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    textareaDebug = fixture.debugElement.query(By.css('textarea.main-textarea'));
    textarea = textareaDebug.nativeElement;
    commitButton = fixture.debugElement.query(By.css('button.commit'));
    backButton = fixture.debugElement.query(By.css('button.back-button'));
    forwardButton = fixture.debugElement.query(By.css('button.forward-button'));
    positionDescriptor = fixture.debugElement.query(By.css('p.position-descriptor'));
    resetLastCommitButton = fixture.debugElement.query(By.css('button.reset-last-commit'));
    commitPosition = positionDescriptor.query(By.css("span.commit-position")).nativeElement;

    commit = function (stringValue : String) {
      textarea.value = stringValue;
      textarea.dispatchEvent(new Event('input'));
      commitButton.triggerEventHandler('click', null);
    }

    goBack = function () {
      backButton.triggerEventHandler('click', null);
    }

    goForward = function() {
      forwardButton.triggerEventHandler('click', null);
    }

    resetToLastCommit = function() {
      resetLastCommitButton.triggerEventHandler('click', null);
    }

    updateBuffer = function () {
      textarea.value = firstCommitText;
      textarea.dispatchEvent(new Event('input'));
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should have a commit button", () => {
    expect(commitButton).toBeTruthy();
  });




  function getUniqueCommitString(id : number) : string {
    return "commit " + id;
  }


  describe("in regard to the basic functionality of committing changes", ()=> {

      it("saves buffer text into commit",  fakeAsync(() => {
        const originalBufferText = "new buffer text";
        commit(originalBufferText);
        expect(component.commitsList.getCommits()[0].commitString).toEqual(originalBufferText);
      }));

      it("increments the number of commits when text entered and commit button clicked", fakeAsync(() => {
        const bufferText = "new buffer text";
        textarea.value = bufferText;
        textarea.dispatchEvent(new Event('input'));
        commitButton.triggerEventHandler('click', null);
        fixture.detectChanges();
        tick();
        expect(component.numCommits).toEqual(1);
      }));

      it("displays 'at commit 1 of 1' after one commit",  fakeAsync(() => {
        const bufferText = "new buffer text";
        commit(bufferText);
        tick();
        fixture.detectChanges();
        expect(commitPosition.textContent).toEqual("At commit 1 of 1");
      }));

      it("displays two commits when user has made two commits",  fakeAsync(() => {
        commit("a ");
        commit("a b ");
        
        tick();
        fixture.detectChanges();
        expect(commitPosition.textContent).toEqual("At commit 2 of 2");
      }));

      it("indicates one commit on display when one commit made and unsaved changes",  fakeAsync(() => {
        const bufferText = "new buffer text";
        // first commit
        commit(firstCommitText);
        updateBuffer("a b ")
        
        tick();
        fixture.detectChanges();
        expect(commitPosition.textContent).toEqual("At commit 1 of 1");
      }));


      it("indicates two commits when user has made two commits",  fakeAsync(() => {
        commit("a ");
        commit("a b ");
        
        tick();
        fixture.detectChanges();
        expect(commitPosition.textContent).toEqual("At commit 2 of 2");
      }));

      it("makes no changes if you commit in the middle and cancel when it asks you to confirm",  fakeAsync(() => {
        spyOn(window, "confirm").and.returnValue(false);
        commit("1");
        commit("2");
        commit("3");
    
        goBack();
        // at second commit now
    
        const bufferTextWithChanges = "new buffer text with changes";
        commit(bufferTextWithChanges);
        // created a new third commit, which we are on now
    
        fixture.detectChanges();
        tick();
    
        expect(commitPosition.textContent).toEqual("At commit 2 of 3");
        expect(textarea.value).toEqual(bufferTextWithChanges);
        expect(component.isBufferContainsUncommittedChanges).toBeTrue();
      }));

      it("creates a new commit destructively when you commit in the middle and confirm",  fakeAsync(() => {
        spyOn(window, "confirm").and.returnValue(true);
    
        commit("1");
        commit("2");
        commit("3");
    
        goBack();
        // at second commit now
    
        const bufferTextWithChanges = "new buffer text with changes";
        commit(bufferTextWithChanges);
        // created a new third commit, which we are on now
        fixture.detectChanges();
        tick();
        expect(commitPosition.textContent).toEqual("At commit 3 of 3");
        expect(textarea.value).toEqual(bufferTextWithChanges);
        expect(component.isBufferContainsUncommittedChanges).toBeFalse();
      }));
    });







  describe("in regard to resetting changes", ()=> {

    it("resets to most recent commit if you discard changes (at tail)",  fakeAsync(() => {
      spyOn(window, "confirm").and.returnValue(true);
      const bufferText = "buffer text";
      commit(bufferText)
      const bufferTextWithChanges = "new buffer text with changes";
      updateBuffer(bufferTextWithChanges)
      resetLastCommitButton.triggerEventHandler('click', null);
      fixture.detectChanges();
      tick();
      expect(textarea.value).toEqual(bufferText);
    }));

    it("resets to most recent commit if you discard changes (at mid-position commit) ",  fakeAsync(() => {
      spyOn(window, "confirm").and.returnValue(true);
      let numCommits = 8;
      let innerCommitIndex = 3;
      const bufferTextWithChanges = "new buffer text with changes";
  
      for (let i = 0; i < numCommits; i++) {
        commit(getUniqueCommitString(i));
      }
  
      let numBacksteps = (numCommits-1) - innerCommitIndex;
  
      for (let j = 0; j < numBacksteps; j++) {
        goBack();
      }
      // at commit innerCommitIndex now
  
      // change buffer text
      textarea.value = bufferTextWithChanges;
      textarea.dispatchEvent(new Event('input'));
      
      
      resetLastCommitButton.triggerEventHandler('click', null);
      fixture.detectChanges();
      tick();
  
      expect(textarea.value).toEqual(getUniqueCommitString(innerCommitIndex));
    }));

  });

  



  describe("in regard to the functionality of moving forward and backward", ()=> {

    it("disables forward button if no commits", () => {
      const bufferText = "new buffer text";
      updateBuffer(bufferText)
      expect(forwardButton.nativeElement.disabled).toBeTruthy();
    });
    
    it("disables back button if no commits", () => {
      const bufferText = "new buffer text";
      updateBuffer(bufferText);
      expect(backButton.nativeElement.disabled).toBeTruthy();
    });

    it("disables the back button if you are viewing the first commit",  fakeAsync(() => {

      commit(firstCommitText);
      commit(secondCommitText);
      
      goBack();
      goBack();
      // should be on first commit now
      tick();
      fixture.detectChanges();
      expect(backButton.nativeElement.disabled).toBeTruthy();
    }));

    it("displays first commit if you make two commits and then go back to the first one (1)",  fakeAsync(() => {
      // setup initial references
      commit(firstCommitText);
      commit(secondCommitText);
      goBack();    
      
      tick();
      fixture.detectChanges();
  
      expect(commitPosition.textContent).toEqual("At commit 1 of 2");
    }));

    it("displays first commit if you make two commits and then go back to the first one (2)",  fakeAsync(() => {
      commit(firstCommitText);
      commit(secondCommitText);
      goBack();
      fixture.detectChanges();
      tick();
      expect(textarea.value).toEqual(firstCommitText);
    }));

    it("displays second commit if you make three commits and then go back once",  fakeAsync(() => {
      commit(firstCommitText)
      commit(secondCommitText)
      commit(thirdCommitText);
      goBack();
      fixture.detectChanges();
      tick();
  
      expect(textarea.value).toEqual(secondCommitText);
    }));

    it("displays second commit if you make two, go back one, then forward one",  fakeAsync(() => {

      commit(firstCommitText)
      commit(secondCommitText);
      goBack();
      goForward();
      fixture.detectChanges();
      tick();
  
      expect(textarea.value).toEqual(secondCommitText);
    }));

    it("displays first commit if you make three commits and then go back twice",  fakeAsync(() => {
      const firstCommitText = "a2";
      commit(firstCommitText);
      commit(secondCommitText);
      commit(thirdCommitText);
  
      goBack();
      goBack();
      fixture.detectChanges();
      tick();
  
      expect(textarea.value).toEqual(firstCommitText);
    }));

    it("disables forward if you commit twice, go back once, then go forward once",  fakeAsync(() => {
      commit(firstCommitText);
      commit(secondCommitText);
      goBack();
      goForward();
      fixture.detectChanges();
      tick();
      expect(forwardButton.nativeElement.disabled).toBeTruthy();
    }));
  
  
    it("disables forward if you make one commit and leave it there",  fakeAsync(() => {
      commit(firstCommitText);
      fixture.detectChanges();
      tick();
      expect(forwardButton.nativeElement.disabled).toBeTruthy();
    }));

    
  });








  describe("in regard to re-focusing after an event" , () => {
    it("focuses on the textarea again after a commit",  fakeAsync(() => {
      commit("1");
  
      fixture.detectChanges();
      tick();
  
  
      textareaDebug = fixture.debugElement.query(By.css('textarea.main-textarea'));
      expect(textarea ===  document.activeElement).toBeTrue();
    }));
  
    it("focuses on the textarea again after a reset to last commit",  fakeAsync(() => {
      spyOn(window, "confirm").and.returnValue(true);
      commit("first commit");
      updateBuffer("changes")
      resetToLastCommit()
  
      fixture.detectChanges();
      tick();
  
  
      textareaDebug = fixture.debugElement.query(By.css('textarea.main-textarea'));
      expect(textarea ===  document.activeElement).toBeTrue();
    }));
  })



});
