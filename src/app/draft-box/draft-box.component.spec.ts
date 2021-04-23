import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { DraftBoxComponent } from './draft-box.component';

describe('DraftBoxComponent', () => {
  let component: DraftBoxComponent;
  let fixture: ComponentFixture<DraftBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [ DraftBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should have a commit button", () => {
    const nativeElt: HTMLElement = fixture.nativeElement;
    const commitButton = nativeElt.querySelector('.commit');
    expect(commitButton).toBeTruthy();
  });

  it("should create commit when commit button clicked", () => {
    const nativeElt: HTMLElement = fixture.nativeElement;
    const existingNumCommits : number = component.numCommits;
    const commitButton = fixture.debugElement.nativeElement.querySelector('button.commit');
    if (commitButton) {
      commitButton.click();
    } 
    expect(component.numCommits).toEqual(1);
  });

  it("after commit, message should reflect 'at commit 1 of 1'",  fakeAsync(() => {
    const bufferText = "new buffer text";
    const nativeElt: HTMLElement = fixture.nativeElement;
    const existingNumCommits : number = component.numCommits;
    const textarea = fixture.debugElement.nativeElement.querySelector('textarea.main-textarea');
    const positionDescriptor = fixture.debugElement.nativeElement.querySelector('p.position-descriptor');
    const commitPosition = positionDescriptor.querySelector("span.commit-position")
    textarea.value = bufferText;
    textarea.dispatchEvent(new Event('input'));
    const commitButton = fixture.debugElement.query(By.css('button.commit'));
    commitButton.triggerEventHandler('click', null);
    tick();
    fixture.detectChanges();
    expect(commitPosition.textContent).toEqual("At commit 1 of 1");
  }));

  it("display indicates two commits",  fakeAsync(() => {
    const textarea = fixture.debugElement.nativeElement.querySelector('textarea.main-textarea');
    const commitButton = fixture.debugElement.query(By.css('button.commit'));
    const positionDescriptor = fixture.debugElement.nativeElement.querySelector('p.position-descriptor');
    const commitPosition = positionDescriptor.querySelector("span.commit-position")
    // first commit
    textarea.value = "a ";
    textarea.dispatchEvent(new Event('input'));
    commitButton.triggerEventHandler('click', null);

    textarea.value = "a b ";
    textarea.dispatchEvent(new Event('input'));
    commitButton.triggerEventHandler('click', null);
    
    tick();
    fixture.detectChanges();
    expect(commitPosition.textContent).toEqual("At commit 2 of 2");
  }));



  it("display indicates one commits when one commit and unsaved changes",  fakeAsync(() => {
    const bufferText = "new buffer text";
    const textarea = fixture.debugElement.nativeElement.querySelector('textarea.main-textarea');
    const commitButton = fixture.debugElement.query(By.css('button.commit'));
    const positionDescriptor = fixture.debugElement.nativeElement.querySelector('p.position-descriptor');
    const commitPosition = positionDescriptor.querySelector("span.commit-position")
    // first commit
    textarea.value = "a ";
    textarea.dispatchEvent(new Event('input'));
    commitButton.triggerEventHandler('click', null);

    textarea.value = "a b ";
    textarea.dispatchEvent(new Event('input'));
    
    tick();
    fixture.detectChanges();
    expect(commitPosition.textContent).toEqual("At commit 1 of 1");
  }));


  it("saves buffer text into commit",  fakeAsync(() => {
    const originalBufferText = "new buffer text";
    const textarea = fixture.debugElement.nativeElement.querySelector('textarea.main-textarea');
    const commitButton = fixture.debugElement.query(By.css('button.commit'));
    const positionDescriptor = fixture.debugElement.nativeElement.querySelector('p.position-descriptor');
    const commitPosition = positionDescriptor.querySelector("span.commit-position")
    // first commit
    textarea.value = originalBufferText;
    textarea.dispatchEvent(new Event('input'));
    commitButton.triggerEventHandler('click', null);
    expect(component.commitChain.getCommits()[0].commitString).toEqual(originalBufferText);
  }));



  it("resets to most recent commit if you discard changes",  fakeAsync(() => {
    spyOn(window, "confirm").and.returnValue(true);
    const bufferText = "new buffer text";
    const textarea = fixture.debugElement.nativeElement.querySelector('textarea.main-textarea');
    textarea.value = bufferText;
    textarea.dispatchEvent(new Event('input'));
    const commitButton = fixture.debugElement.query(By.css('button.commit'));
    commitButton.triggerEventHandler('click', null);
    const resetLastCommitButton = fixture.debugElement.query(By.css('button.reset-last-commit'));
    const bufferTextWithChanges = "new buffer text with changes";
    textarea.value = bufferTextWithChanges;
    textarea.dispatchEvent(new Event('input'));
    resetLastCommitButton.triggerEventHandler('click', null);
    fixture.detectChanges();
    tick();
    expect(textarea.value).toEqual(bufferText);
  }));


  it("displays first commit if you make two commits and then go back to the first one (1)",  fakeAsync(() => {
    // setup initial references
    const textarea = fixture.debugElement.nativeElement.querySelector('textarea.main-textarea');
    const commitButton = fixture.debugElement.query(By.css('button.commit'));
    const positionDescriptor = fixture.debugElement.nativeElement.querySelector('p.position-descriptor');
    const commitPosition = positionDescriptor.querySelector("span.commit-position")
    const backButton = fixture.debugElement.query(By.css('button.back-button'));

    // first commit
    const firstCommitText = "a "
    textarea.value = firstCommitText;
    textarea.dispatchEvent(new Event('input'));
    commitButton.triggerEventHandler('click', null);

    // second commit
    const secondCommitText = "a b ";
    textarea.value = secondCommitText;
    textarea.dispatchEvent(new Event('input'));
    commitButton.triggerEventHandler('click', null);
    
    // go back once
    backButton.triggerEventHandler('click', null);

    tick();
    fixture.detectChanges();

    expect(commitPosition.textContent).toEqual("At commit 1 of 2");
  }));

  it("displays first commit if you make two commits and then go back to the first one (2)",  fakeAsync(() => {
    // setup initial references
    const textarea = fixture.debugElement.nativeElement.querySelector('textarea.main-textarea');
    const commitButton = fixture.debugElement.query(By.css('button.commit'));
    const backButton = fixture.debugElement.query(By.css('button.back-button'));

    // first commit
    const firstCommitText = "a2 "
    textarea.value = firstCommitText;
    textarea.dispatchEvent(new Event('input'));
    commitButton.triggerEventHandler('click', null);

    // second commit
    const secondCommitText = "a b ";
    textarea.value = secondCommitText;
    textarea.dispatchEvent(new Event('input'));
    commitButton.triggerEventHandler('click', null);
    
    // go back once
    backButton.triggerEventHandler('click', null);

    
    fixture.detectChanges();
    tick();

    expect(textarea.value).toEqual(firstCommitText);
  }));


  it("displays second commit if you make three commits and then go back once",  fakeAsync(() => {
    // setup initial references
    const textarea = fixture.debugElement.nativeElement.querySelector('textarea.main-textarea');
    const commitButton = fixture.debugElement.query(By.css('button.commit'));
    const backButton = fixture.debugElement.query(By.css('button.back-button'));

    // first commit
    const firstCommitText = "a2 "
    textarea.value = firstCommitText;
    textarea.dispatchEvent(new Event('input'));
    commitButton.triggerEventHandler('click', null);

    // second commit
    const secondCommitText = "a b ";
    textarea.value = secondCommitText;
    textarea.dispatchEvent(new Event('input'));
    commitButton.triggerEventHandler('click', null);

    // third commit
    const thirdCommitText = "a b c";
    textarea.value = thirdCommitText;
    textarea.dispatchEvent(new Event('input'));
    commitButton.triggerEventHandler('click', null);
    
    // go back once
    backButton.triggerEventHandler('click', null);

    
    fixture.detectChanges();
    tick();

    expect(textarea.value).toEqual(secondCommitText);
  }));

  it("displays first commit if you make three commits and then go back twice",  fakeAsync(() => {
    // setup initial references
    const textarea = fixture.debugElement.nativeElement.querySelector('textarea.main-textarea');
    const commitButton = fixture.debugElement.query(By.css('button.commit'));
    const backButton = fixture.debugElement.query(By.css('button.back-button'));

    // first commit
    const firstCommitText = "a2 "
    textarea.value = firstCommitText;
    textarea.dispatchEvent(new Event('input'));
    commitButton.triggerEventHandler('click', null);

    // second commit
    const secondCommitText = "a b ";
    textarea.value = secondCommitText;
    textarea.dispatchEvent(new Event('input'));
    commitButton.triggerEventHandler('click', null);

    // third commit
    const thirdCommitText = "a b c";
    textarea.value = thirdCommitText;
    textarea.dispatchEvent(new Event('input'));
    commitButton.triggerEventHandler('click', null);
    
    // go back once
    backButton.triggerEventHandler('click', null);

    // go back again
    backButton.triggerEventHandler('click', null);


    fixture.detectChanges();
    tick();

    expect(textarea.value).toEqual(firstCommitText);
  }));

  it("displays displays second commit if you make two, go back one, then forward one",  fakeAsync(() => {
    // setup initial references
    const textarea = fixture.debugElement.nativeElement.querySelector('textarea.main-textarea');
    const commitButton = fixture.debugElement.query(By.css('button.commit'));
    const backButton = fixture.debugElement.query(By.css('button.back-button'));
    const forwardButton = fixture.debugElement.query(By.css('button.forward-button'));
    //forward-button


    // first commit
    const firstCommitText = "a2 "
    textarea.value = firstCommitText;
    textarea.dispatchEvent(new Event('input'));
    commitButton.triggerEventHandler('click', null);

    // second commit
    const secondCommitText = "a b ";
    textarea.value = secondCommitText;
    textarea.dispatchEvent(new Event('input'));
    commitButton.triggerEventHandler('click', null);

    // go back once
    backButton.triggerEventHandler('click', null);

    // go forward once
    forwardButton.triggerEventHandler('click', null);


    fixture.detectChanges();
    tick();

    expect(textarea.value).toEqual(secondCommitText);
  }));

});
