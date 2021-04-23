import { chainedInstruction } from "@angular/compiler/src/render3/view/util"
// @ts-ignore
import { DraftCommit } from "./draft-commit"

export class CommitChain {
    commits :DraftCommit[]

    push (newCommit: DraftCommit) {
        this.commits.push(newCommit);
    }

    get(index : number) : DraftCommit {
        if (index >= this.commits.length) {
            throw new Error("index out of bounds");
        }
        return this.commits[index];

    }

    getLast() : DraftCommit {
        let index = this.commits.length - 1;
        return this.commits[index];
    }

    size() : number {
        return this.commits.length;
    }


    // returns true if the revision was completed successfully
    // returns false if revision encountered an error
    revise (index : number, commit : DraftCommit) : boolean {
        if (index >= this.commits.length) {
            return false;
        } else {
            let newCommitsList : DraftCommit[] = this.commits.slice(0,index);
            newCommitsList.push(commit);
            this.commits = newCommitsList;
            return true;
        }
    }


    createNewCommit (text : string) : DraftCommit {
        return new DraftCommit(text);
    }


    addNewCommit(text : string) : void {

    }
    constructor() {
        this.commits = [];
    }

}