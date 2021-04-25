export class DraftCommit {
    commitString : string;

    getString() : string {
        return this.commitString;
    }

    toJSON(): string {
        let cleanCommitObject : any = {};
        cleanCommitObject["commitString"] = this.commitString;
        return JSON.stringify(cleanCommitObject);
    }

    getCleanObject() : any {
        let cleanCommitObject : any = {};
        cleanCommitObject["commitString"] = this.commitString;
        return cleanCommitObject;
    }

    constructor(commitString: string) {
        this.commitString = commitString;
    }
}