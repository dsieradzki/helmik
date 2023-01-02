import { makeAutoObservable } from "mobx";
import React, { useContext } from "react";

export class ApplicationStore {
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    reportAnError(err: string | null | undefined) {
        if (err) {
            this.error = err;
        } else {
            this.error = "Something went wrong";
        }
        console.error(err);
    }

    clearAnError() {
        this.error = null;
    }

    get isError(): boolean {
        return !!this.error;
    }
}

export const ApplicationStoreContext = React.createContext<ApplicationStore | null>(null);

export function useApplicationStore(): ApplicationStore {
    const ctx = useContext(ApplicationStoreContext);
    if (!ctx) {
        throw Error("No ApplicationStore found");
    }
    return ctx;
}