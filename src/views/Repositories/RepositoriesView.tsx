import React, { useState } from 'react';
import {
    ArrowPathIcon,
    FolderPlusIcon,
    PencilSquareIcon,
    PlusCircleIcon,
    TrashIcon
} from "@heroicons/react/24/outline";
import { Repo } from "../../api/model";
import { api } from "../../api/api";
import Toolbar from "../../components/Toolbar";
import AppConfirmDialog from "../../components/AppConfirmDialog";
import AddNewRepo from "./AddNewRepo";
import { useOnFirstMount } from "../../hooks";
import EditRepo from "./EditRepo";
import ContentContainer from "../../layout/ContentContainer";
import ContentHeader from "../../components/ContentHeader";
import LoadingPanel from "../../components/LoadingPanel";
import { useApplicationStore } from "../../store/applicationStore";
import { observer } from "mobx-react-lite";

const RepositoriesView = () => {
    const [repos, setRepos] = useState<Repo[]>([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<Repo | null>(null);
    const [showDelete, setShowDelete] = useState(false);
    const [showAddNewRepo, setShowAddNewRepo] = useState(false);
    const [showEditRepo, setShowEditRepo] = useState(false);
    const [reposAreRefreshing, setReposAreRefreshing] = useState(false);
    const applicationStore = useApplicationStore();

    const loadRepos = async () => {
        try {
            setLoading(true);
            const data = await api.repos();
            setRepos(data);
        } catch (err: any) {
            applicationStore.reportAnError(err);
        } finally {
            setLoading(false);
        }
    };

    useOnFirstMount(async () => {
        await loadRepos();
    });

    const content = <div className="bg-zinc-50 rounded-xl drop-shadow p-4 mb-2">
        <table className="w-full">
            <thead>
            <tr>
                <th>Name</th>
                <th>Url</th>
            </tr>
            </thead>
            <tbody>
            {
                repos.map((e) =>
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
                        <td>{e.url}</td>
                    </tr>
                )
            }
            </tbody>
        </table>
    </div>;
    return (
        <ContentContainer
            className="bg-zinc-100"
            beforeContent={
                <ContentHeader icon={FolderPlusIcon}>
                    Repositories
                </ContentHeader>
            }>
            <div className="h-full flex flex-col px-4">
                {
                    showDelete &&
                    <AppConfirmDialog title="Delete repository"
                                      confirmLabel="Delete"
                                      cancelLabel="Cancel"
                                      onConfirm={() => {
                                          setShowDelete(false);
                                          if (selected) {
                                              api.deleteRepository(selected.name)
                                                  .then(() => {
                                                      setRepos((s) => {
                                                          return s.filter(e => e.name != selected.name);
                                                      })
                                                  })
                                                  .catch((err: any) => {
                                                      applicationStore.reportAnError(err);
                                                  })
                                          }
                                      }}
                                      onCancel={() => {
                                          setShowDelete(false);
                                      }}>
                        Are you sure, do you want to delete <span
                        className="font-bold">{selected?.name}</span> repository?
                    </AppConfirmDialog>
                }
                {
                    showAddNewRepo &&
                    <AddNewRepo onClose={async (created) => {
                        setShowAddNewRepo(false)
                        if (created) {
                            await loadRepos();
                        }
                    }}/>
                }
                {
                    showEditRepo &&
                    <EditRepo visible={showEditRepo}
                              initName={selected?.name ?? ""}
                              initUrl={selected?.url ?? ""}
                              onClose={async (created) => {
                                  setShowEditRepo(false)
                                  if (created) {
                                      await loadRepos();
                                  }
                              }}/>
                }
                <Toolbar>
                    <Toolbar.Button icon={ArrowPathIcon}
                                    iconClassName={reposAreRefreshing ? "animate-spin" : ""}
                                    title="Update repositories"
                                    onClick={() => {
                                        setReposAreRefreshing(true)
                                        api.refreshRepositories()
                                            .then(() => {
                                                console.debug("Repositories has been refreshed")
                                            })
                                            .catch((err: any) => {
                                                applicationStore.reportAnError(err);
                                            })
                                            .finally(() => {
                                                setReposAreRefreshing(false);
                                            })
                                    }}/>
                    <Toolbar.Button icon={PlusCircleIcon}
                                    title="Add new repository"
                                    onClick={() => {
                                        setShowAddNewRepo(true);
                                    }}/>
                    <Toolbar.Button icon={PencilSquareIcon}
                                    title="Edit repository"
                                    onClick={() => {
                                        setShowEditRepo(true);
                                    }}
                                    disabled={selected == null}/>
                    <Toolbar.Button icon={TrashIcon}
                                    title="Delete repository"
                                    onClick={() => {
                                        setShowDelete(true);
                                    }}
                                    iconClassName="text-red-500"
                                    disabled={selected == null}/>
                </Toolbar>
                {
                    loading
                        ? <LoadingPanel>Loading repositories</LoadingPanel>
                        : content
                }
            </div>
        </ContentContainer>
    )
        ;
};

export default observer(RepositoriesView);