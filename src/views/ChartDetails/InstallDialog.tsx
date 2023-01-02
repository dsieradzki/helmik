import React, { useState } from 'react';
import AppDialog from "../../components/AppDialog";
import { useFormik } from "formik";
import * as yup from "yup";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export type InstallChartForm = {
    name: string;
    namespace: string;
}

const schema = yup.object({
    name: yup.string().trim().required(),
    namespace: yup.string().trim().required()
});

type Props = {
    onInstall: (request: InstallChartForm) => Promise<void>;
    onClose: () => void
}
const InstallDialog = (props: Props) => {
    const [error, setError] = useState<string | null>();
    const formik = useFormik<InstallChartForm>({
        initialValues: {
            name: "",
            namespace: ""
        } as InstallChartForm,
        validationSchema: schema,
        validateOnMount: true,
        onSubmit: (values, formikHelpers) => {
            props.onInstall(values)
                .then(() => {
                    setError(null);
                    props.onClose();
                })
                .catch(e => {
                    setError(e);
                })
                .finally(() => {
                    formikHelpers.setSubmitting(false);
                });
        }
    });
    return (
        <AppDialog
            title="Install chart">
            <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
                <div className="mb-2 flex flex-col">
                    <label htmlFor="name">Name</label>
                    <input id="name"
                           autoComplete={"off"}
                           onChange={formik.handleChange}
                           onBlur={formik.handleBlur}
                           value={formik.values.name}/>
                </div>

                <div className="mb-4 flex flex-col">
                    <label htmlFor="url">Namespace</label>
                    <input id="namespace"
                           autoComplete={"off"}
                           onChange={formik.handleChange}
                           onBlur={formik.handleBlur}
                           value={formik.values.namespace}/>
                </div>
                {error && <div className="text-red-500 mb-2">{error}</div>}
                <div className="flex">
                    <button
                        type="submit"
                        disabled={!formik.isValid || !formik.dirty || formik.isSubmitting || formik.isValidating}
                        className="btn mr-4">
                        {formik.isSubmitting && <ArrowPathIcon className="h-5 w-5 animate-spin text-zinc-800 mr-4"/>}
                        Install
                    </button>
                    <button
                        type="button"
                        className="btn"
                        disabled={formik.isSubmitting}
                        onClick={() => {
                            formik.resetForm();
                            props.onClose();
                        }}>
                        Cancel
                    </button>
                </div>
            </form>
        </AppDialog>
    );
};

export default InstallDialog;