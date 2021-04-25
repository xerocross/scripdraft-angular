export class LocalStorageFacade {

    static write (key: string, value: string) : boolean {
        if (localStorage) {
            localStorage.setItem(key, value);
            return true;
        }
        return false;
    }

    static read (key: string) : string | null {
        if (localStorage) {
            return localStorage.getItem(key);
        }
        return null;
    }

}