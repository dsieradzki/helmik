import React, { useEffect, useState } from 'react';
import AppDialog from "../../components/AppDialog";
import { useFormik } from "formik";
import * as yup from "yup";
import { api } from "../../api/api";

type AddNewRepoForm = {
    name: string;
    url: string;
}
type Props = {
    onClose: (created: boolean) => void;
};

const schema = yup.object({
    name: yup.string().trim().required(),
    url: yup.string().trim().required()
});
const AddNewRepo = (props: Props) => {
    useEffect(() => {
        setError(null);
        formik.resetForm();
    }, []);

    const [error, setError] = useState<string | null>();
    const formik = useFormik<AddNewRepoForm>({
        initialValues: {
            name: "",
            url: ""
        } as AddNewRepoForm,
        validationSchema: schema,
        validateOnMount: true,
        onSubmit: (values, formikHelpers) => {
            api.addRepository(values.name, values.url)
                .then(() => {
                    setError(null);
                    props.onClose(true);
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
        <AppDialog title="Add new repository"
                   onClose={() => {
                       props.onClose(false)
                   }}>
            <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
                <div className="mb-2 flex flex-col">
                    <label htmlFor="name">Name</label>
                    <input id="name"
                           onChange={formik.handleChange}
                           onBlur={formik.handleBlur}
                           value={formik.values.name}/>
                </div>

                <div className="mb-4 flex flex-col">
                    <label htmlFor="url">Url</label>
                    <input id="url"
                           onChange={formik.handleChange}
                           onBlur={formik.handleBlur}
                           value={formik.values.url}/>
                </div>
                {error && <div className="text-red-500 mb-2">{error}</div>}
                <div className="flex">
                    <button
                        type="submit"
                        disabled={!formik.isValid || !formik.dirty || formik.isSubmitting || formik.isValidating}
                        className="btn mr-4">
                        Add
                    </button>
                    <button
                        type="button"
                        className="btn"
                        disabled={formik.isSubmitting}
                        onClick={() => {
                            formik.resetForm();
                            props.onClose(false);
                        }}>
                        Cancel
                    </button>
                </div>
            </form>
        </AppDialog>
    );
};

export default AddNewRepo;