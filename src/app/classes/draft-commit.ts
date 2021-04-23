export class DraftCommit {
    commitString : string;
    hash : string;

    getString() : string {
        return this.commitString;
    }

    constructor(commitString: string) {
        this.commitString = commitString;
        this.hash = "";
    }

}