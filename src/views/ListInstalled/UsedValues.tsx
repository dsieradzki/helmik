import React, { useEffect, useState } from 'react';
import AppDialog from "../../components/AppDialog";
import { api } from "../../api/api";
import { observer } from "mobx-react-lite";
import { useApplicationStore } from "../../store/applicationStore";
import Editor from "@monaco-editor/react";

type Props = {
    onClose: () => void;
    releaseName: string,
    namespace: string;
};
const UsedValues = (props: Props) => {
    const applicationStore = useApplicationStore();
    const [values, setValues] = useState("");
    useEffect(() => {
        api.getValues(props.releaseName, props.namespace)
            .then((data) => {
                setValues(data);
            })
            .catch((err: any) => {
                applicationStore.reportAnError(err);
                props.onClose();
            })
    }, [props.releaseName, props.namespace]);
    return (
        <AppDialog
            title={<div className="flex justify-between items-center pb-4">
                <div>
                    Release
                    <span className="font-bold mx-1">{props.namespace}/{props.releaseName}</span>
                    has been installed with following values:
                </div>
                <div>
                    <button
                        onClick={props.onClose}
                        className="btn">Close
                    </button>
                </div>
            </div>}
            maxWidth="max-w-7xl"
            onClose={props.onClose}>
            <div className={"pre"}>
                <Editor
                    defaultLanguage="yaml"
                    value={values}
                    height="80vh"
                    theme={"light"}
                    options={{fontSize: 16, readOnly: true}}
                />
            </div>
        </AppDialog>
    );
};

export default observer(UsedValues);