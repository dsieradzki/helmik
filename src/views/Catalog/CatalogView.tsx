import React, { useState } from 'react';
import { FolderOpenIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Toolbar from "../../components/Toolbar";
import { ChartListItem } from "../../api/model";
import { useAsyncEffect, useDebounce } from "../../hooks";
import { api } from "../../api/api";
import { generatePath, Link } from "react-router-dom";
import ContentContainer from "../../layout/ContentContainer";
import ContentHeader from "../../components/ContentHeader";
import LoadingPanel from "../../components/LoadingPanel";
import { useApplicationStore } from "../../store/applicationStore";
import { observer } from "mobx-react-lite";

const CatalogView = () => {
    const [charts, setCharts] = useState<ChartListItem[]>([]);
    const [filter, setFilter] = useState("");
    const debouncedValue = useDebounce(filter, 500);
    const [loading, setLoading] = useState(false);
    const applicationStore = useApplicationStore();

    useAsyncEffect(async () => {
        setLoading(true);
        try {
            const data = await api.findChartsInRepo(filter);
            setCharts(data);
        } catch (err: any) {
            applicationStore.reportAnError(err);
        } finally {
            setLoading(false);
        }
    }, [debouncedValue]);

    const catalogTable = <div className="grow h-1 bg-zinc-50 rounded-xl drop-shadow p-4 mb-2 overflow-y-scroll">
        {
            charts.map(e =>
                <Link key={e.name} to={generatePath("/chart/:name", {name: encodeURIComponent(e.name)})}>
                    <div className="bg-zinc-100 rounded-xl drop-shadow p-4 mb-4">
                        <div className="font-bold mb-4">
                            {e.name}
                        </div>
                        <div className="mb-4">
                            {e.description}
                        </div>
                        <div className="flex">
                            <div className="mr-4">
                                <span className="font-bold mr-1">Chart version:</span>
                                <span>{e.version}</span>
                            </div>
                            <div>
                                <span className="font-bold mr-1">App version:</span>
                                <span>{e.appVersion}</span>
                            </div>
                        </div>
                    </div>
                </Link>
            )
        }
    </div>

    return (
        <ContentContainer
            className="bg-zinc-100"
            beforeContent={
                <ContentHeader icon={FolderOpenIcon}>
                    Available charts
                </ContentHeader>
            }>
            <div className="h-full flex flex-col px-4">
                <Toolbar>
                    <div className="w-full flex items-center">
                        <div className="absolute">
                            <MagnifyingGlassIcon className="h-6 w-6 text-zinc-400 relative left-2"/>
                        </div>
                        <input
                            value={filter}
                            onChange={(e) => {
                                setFilter(e.target.value);
                            }}
                            className="w-full pl-8"
                            placeholder="chart name"/>
                    </div>
                </Toolbar>

                {
                    loading
                        ? <LoadingPanel>Loading chart catalog</LoadingPanel>
                        : catalogTable
                }
            </div>
        </ContentContainer>

    );
};

export default observer(CatalogView);