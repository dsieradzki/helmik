import React from 'react';
import AppDialog from "./AppDialog";

type Props = {
    title: string;
    confirmLabel: string;
    cancelLabel: string;
    onConfirm: () => void;
    onCancel: () => void;
} & React.PropsWithChildren;
const AppConfirmDialog = (props: Props) => {
    return (
        <AppDialog
            onClose={props.onCancel}
            title={props.title}>
            <div>
                {props.children}
            </div>
            <div className="mt-4 flex">
                <div className="mr-4">
                    <button
                        type="button"
                        className="btn danger"
                        onClick={props.onConfirm}>
                        {props.confirmLabel}
                    </button>
                </div>
                <button
                    type="button"
                    className="btn"
                    onClick={props.onCancel}>
                    {props.cancelLabel}
                </button>
            </div>
        </AppDialog>
    );
};

export default AppConfirmDialog;