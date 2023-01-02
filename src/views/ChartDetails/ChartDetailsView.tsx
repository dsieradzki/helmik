import React, { useRef, useState } from 'react';
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { useNavigate, useParams } from "react-router-dom";
import { ChartDetails, InstallChartRequest } from "../../api/model";
import { api } from "../../api/api";
import { useOnFirstMount } from "../../hooks";
import { Tab } from '@headlessui/react';
import Dependencies from "./Dependencies";
import Info from "./Info";
import ContentContainer from "../../layout/ContentContainer";
import ContentHeader from "../../components/ContentHeader";
import LoadingPanel from "../../components/LoadingPanel";
import Editor from "@monaco-editor/react";
import { editor } from "monaco-editor";
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;
import InstallDialog, { InstallChartForm } from "./InstallDialog";
import { useApplicationStore } from "../../store/applicationStore";
import { observer } from "mobx-react-lite";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const ChartDetailsView = () => {
    const {name} = useParams();
    const navigate = useNavigate();
    const [chartDetails, setChartDetails] = useState<ChartDetails | null>();
    const [loading, setLoading] = useState(false);
    const [showInstallDialog, setShowInstallDialog] = useState(false);
    const valuesEditor = useRef<IStandaloneCodeEditor>();
    const applicationStore = useApplicationStore();
    useOnFirstMount(async () => {
        if (name) {
            setLoading(true);
            try {
                const data = await api.getChartDetails(name);
                setChartDetails(data);
            } catch (err: any) {
                applicationStore.reportAnError(err);
            } finally {
                setLoading(false);
            }
        } else {
            console.error("Chart name is required");
        }
    });

    const installChart = async (form: InstallChartForm) => {
        await api.installChart({
            name: form.name,
            namespace: form.namespace,
            chartName: name,
            values: valuesEditor.current?.getValue()
        } as InstallChartRequest)
        navigate("/");
    }
    const content = <div className="h-full flex flex-col p-4">
        <div className="h-full flex flex-col bg-zinc-50 rounded-xl drop-shadow p-4 mb-2">
            <div className="grow h-1 overflow-y-scroll">
                {chartDetails && <Info name={name ?? ""}
                                       onInstall={() => {
                                           setShowInstallDialog(true);
                                       }}
                                       data={chartDetails?.info}/>}
                <div className="mt-8">
                    <Tab.Group>
                        <Tab.List className="flex mx-2 space-x-1 rounded-xl bg-zinc-100 p-1 drop-shadow">
                            <Tab
                                className={({selected}) =>
                                    classNames(
                                        'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                                        'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                        selected
                                            ? 'bg-white shadow'
                                            : 'text-blue-600 hover:bg-white/[0.12] hover:text-blue-700'
                                    )
                                }
                            >
                                Readme
                            </Tab>
                            <Tab
                                className={({selected}) =>
                                    classNames(
                                        'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                                        'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                        selected
                                            ? 'bg-white shadow'
                                            : 'text-blue-600 hover:bg-white/[0.12] hover:text-blue-700'
                                    )
                                }
                            >
                                Values
                            </Tab>
                            <Tab
                                className={({selected}) =>
                                    classNames(
                                        'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                                        'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                        selected
                                            ? 'bg-white shadow'
                                            : 'text-blue-600 hover:bg-white/[0.12] hover:text-blue-700'
                                    )
                                }
                            >
                                Dependencies
                            </Tab>
                        </Tab.List>
                        <Tab.Panels className="mt-2">
                            <Tab.Panel className="p-4">
                                <div className="markdown overflow-x-scroll"
                                     dangerouslySetInnerHTML={{__html: chartDetails?.readme ?? ""}}>
                                </div>
                            </Tab.Panel>
                            <Tab.Panel className="p-4">
                                <Editor
                                    defaultLanguage="yaml"
                                    defaultValue={chartDetails?.values ?? ""}
                                    height="65vh"
                                    theme={"light"}
                                    options={{fontSize: 16}}
                                    onMount={(editor) => {
                                        valuesEditor.current = editor;
                                    }}
                                />
                            </Tab.Panel>
                            <Tab.Panel className="p-4">
                                <Dependencies items={chartDetails?.info?.dependencies ?? []}/>
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                </div>
            </div>
        </div>
    </div>
    return (
        <ContentContainer
            className="bg-zinc-100"
            beforeContent={
                <ContentHeader icon={DocumentTextIcon}>
                    Chart details
                </ContentHeader>
            }>
            {
                showInstallDialog
                    ? <InstallDialog
                        onInstall={installChart}
                        onClose={() => {
                            setShowInstallDialog(false)
                        }}/>
                    : null
            }
            {
                loading
                    ? <LoadingPanel>Loading chart details</LoadingPanel>
                    : content
            }
        </ContentContainer>

    );
};

export default observer(ChartDetailsView);