import * as sjcl from 'sjcl';

export class DraftCommit {
    commitString : string;
    hash : number;

    getString() : string {
        return this.commitString;
    }

    constructor(commitString: string) {
        this.commitString = commitString;
        this.hash = this.byteArrayToLong(sjcl.hash.sha256.hash(commitString));
        console.log("creating a new commit with text \"" + commitString + "\" and hash \"" + this.hash + "\".");
    }


    private bin2String(array:any) {
        var result = "";
        for (var i = 0; i < array.length; i++) {
          result += String.fromCharCode(parseInt(array[i], 2));
        }
        return result;
    }

    getHash (hash:any): string {
        
        if (hash.length == 0) {
            return hash;
        }
        for (var i = 0; i < hash.length; i++) {
            var char = hash.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }

    byteArrayToLong (byteArray: any) {
        let value = 0;
        for ( let i = byteArray.length - 1; i >= 0; i--) {
            value = (value * 256) + byteArray[i];
        }
        return value;
    };


}