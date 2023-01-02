import React from 'react';
import { useApplicationStore } from "../store/applicationStore";
import { observer } from "mobx-react-lite";

const ErrorPanel = () => {
    const errorState = useApplicationStore();
    if (!errorState.isError) {
        return null;
    }
    return (
        <div className="bg-red-50 border border-red-300 p-4 text-red-600 flex">
            <div className="grow flex items-center">
                {errorState.error}
            </div>
            <div>
                <button
                    onClick={() => {
                        errorState.clearAnError();
                    }}
                    className="btn danger">
                    Close
                </button>
            </div>
        </div>
    );
};

export default observer(ErrorPanel);