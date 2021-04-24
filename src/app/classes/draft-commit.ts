export class DraftCommit {
    commitString : string;

    getString() : string {
        return this.commitString;
    }

    constructor(commitString: string) {
        this.commitString = commitString;
    }
}