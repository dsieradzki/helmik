import React, { useState } from 'react';
import { Release } from "../../api/model";
import Tag from "../../components/Tag";
import { DocumentArrowDownIcon, ListBulletIcon, TrashIcon } from "@heroicons/react/24/outline";
import { api } from "../../api/api";
import { useOnFirstMount } from "../../hooks";
import ContentContainer from "../../layout/ContentContainer";
import ContentHeader from "../../components/ContentHeader";
import Toolbar from "../../components/Toolbar";
import AppConfirmDialog from "../../components/AppConfirmDialog";
import LoadingPanel from "../../components/LoadingPanel";
import { useApplicationStore } from "../../store/applicationStore";
import { observer } from "mobx-react-lite";
import AppDialog from "../../components/AppDialog";
import UsedValues from "./UsedValues";

const ListInstalledView = () => {
    const [releases, setReleases] = useState<Release[]>([]);
    const [selected, setSelected] = useState<Release | null>(null);
    const [showDelete, setShowDelete] = useState(false);
    const [showUsedValues, setShowUsedValues] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uninstalling, setUninstalling] = useState(false);
    const applicationStore = useApplicationStore();
    useOnFirstMount(async () => {
        try {
            setLoading(true);
            const data = await api.list_releases();
            setReleases(data);
        } catch (err: any) {
            applicationStore.reportAnError(err);
        } finally {
            setLoading(false);
        }
    });

    const toDateTime = (d: Date) => {
        return d.toLocaleDateString() + " " + d.toLocaleTimeString();
    }
    const releaseTable = <div className="grow h-1 overflow-y-auto">
        <div className="bg-zinc-50 rounded-xl drop-shadow p-4 mb-2">
            <table className="w-full">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Namespace</th>
                    <th>Chart</th>
                    <th>App version</th>
                    <th>Status</th>
                    <th>Updated</th>
                    <th>Revision</th>
                </tr>
                </thead>
                <tbody>
                {
                    releases.map((e) =>
                        <tr key={e.name}
                            className={`${selected?.name == e.name ? "selected" : ""} cursor-pointer`}
                            onClick={() => {
                                if (selected?.name == e.name) {
                                    setSelected(null);
                                } else {
                                    setSelected(e)
                                }
                            }}>
                            <td>{e.name}</td>
                            <td>{e.namespace}</td>
                            <td>{e.chart}</td>
                            <td>{e.appVersion}</td>
                            <td>
                                <Tag className="bg-emerald-700 px-2">
                                    {e.status}
                                </Tag>
                            </td>
                            <td>{toDateTime(new Date(e.updated))}</td>
                            <td>{e.revision}</td>
                        </tr>
                    )
                }
                </tbody>
            </table>
        </div>
    </div>;
    return (
        <ContentContainer
            className="bg-zinc-100"
            beforeContent={
                <ContentHeader icon={ListBulletIcon}>
                    Installed charts
                </ContentHeader>
            }>
            <div className="h-full flex flex-col px-4">
                {
                    showUsedValues &&
                    <UsedValues
                        onClose={() => {
                            setShowUsedValues(false);
                        }}
                        releaseName={selected?.name ?? ""}
                        namespace={selected?.namespace ?? ""}/>
                }
                {
                    showDelete &&
                    <AppConfirmDialog title="Uninstall release"
                                      confirmLabel="Delete"
                                      cancelLabel="Cancel"
                                      onConfirm={() => {
                                          if (selected) {
                                              setShowDelete(false);
                                              setSelected(null);
                                              setUninstalling(true);
                                              api.uninstallChart(selected.name, selected.namespace)
                                                  .then(() => {
                                                      setReleases((s) => {
                                                          return s.filter(e => e.name != selected.name);
                                                      })
                                                  })
                                                  .catch((err: any) => {
                                                      applicationStore.reportAnError(err);
                                                  })
                                                  .finally(() => {
                                                      setUninstalling(false)
                                                  })
                                          }
                                      }}
                                      onCancel={() => {
                                          setShowDelete(false);
                                      }}>
                        Are you sure, do you want to uninstall <span
                        className="font-bold">{selected?.name}</span> release?
                    </AppConfirmDialog>
                }
                <Toolbar>
                    <Toolbar.Button icon={TrashIcon}
                                    title="Uninstall release"
                                    disabled={selected == null}
                                    onClick={() => {
                                        setShowDelete(true);
                                    }}
                                    iconClassName="text-red-500"
                    />
                    <Toolbar.Button icon={DocumentArrowDownIcon}
                                    title="Show values used in installation"
                                    disabled={selected == null}
                                    onClick={() => {
                                        setShowUsedValues(true);
                                    }}/>
                </Toolbar>
                {
                    loading
                        ? <LoadingPanel>Loading installed releases</LoadingPanel>
                        : uninstalling
                            ? <LoadingPanel>Uninstalling release</LoadingPanel>
                            : releaseTable
                }
            </div>
        </ContentContainer>
    )
        ;
};

export default observer(ListInstalledView);