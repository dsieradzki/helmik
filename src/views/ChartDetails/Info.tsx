import React from 'react';
import { ChartInfo } from "../../api/model";
import { useNavigate } from "react-router-dom";

function dataEntry(name: string, value: React.ReactNode) {
    return value ?
        <div className="mb-1 flex">
            <div className="font-bold mr-1">{name}:</div>
            <div>{value}</div>
        </div>
        : null;
}

type Props = {
    name: string;
    data: ChartInfo;
    onInstall: () => void;
}
const Info = (props: Props) => {
    const navigate = useNavigate();
    return (
        <div className="flex">
            {
                props.data.icon &&
                <div className="min-w-[160px] mr-4">
                    <img src={props.data.icon} className="w-40 h-40"/>
                </div>
            }
            <div className="grow pt-4">
                <div className="font-bold text-3xl flex items-center justify-between mb-2">
                    <div>
                        {props.data?.name}
                    </div>
                    <div className="mr-4">
                        <button
                            onClick={props.onInstall}
                            className="btn">Install
                        </button>
                    </div>
                </div>
                <p className="mb-4">
                    {props.data?.description}
                </p>
                {dataEntry("Chart type", props.data.chartType)}
                {dataEntry("Version", props.data.version)}
                {dataEntry("Kube version", props.data.kubeVersion)}
                {dataEntry("Api version", props.data.apiVersion)}
                {dataEntry("App version", props.data.appVersion)}
                {dataEntry("Home page", props.data.home)}

                {dataEntry(
                    "Sources",
                    props.data?.sources && props.data.sources.length > 0
                        ? <div>
                            {
                                props.data.sources?.map(e => {
                                    return <div key={e}>{e}</div>
                                })
                            }
                        </div>
                        : null
                )}


                {dataEntry("Keywords", props.data.keywords?.join(", "))}
                {dataEntry(
                    "Maintainers",
                    props.data?.maintainers && props.data.maintainers.length > 0
                        ? <div>
                            {
                                props.data.maintainers?.map(e => {
                                    return <div key={e.name}>{e.name}: {e.url} {e.email}</div>
                                })
                            }
                        </div>
                        : null
                )}

                {dataEntry(
                    "Annotations",
                    props.data.annotations && props.data.annotations.size > 0
                        ? <div>
                            {
                                Array.from(props.data.annotations).map(([k, v]) => {
                                    return <div key={k}>{k}{v.length > 0 ? ":" : ""} {v}</div>
                                })
                            }
                        </div>
                        : null
                )}
                {dataEntry("Condition", props.data.condition)}
                {dataEntry(
                    "Tags",
                    props.data.tags ?
                        <div>
                            {
                                props.data.tags.map(e => {
                                    return <div key={e}>{e}</div>
                                })
                            }
                        </div>
                        : null
                )}
                {dataEntry("Deprecated", props.data.deprecated ? "Yes" : null)}
            </div>
        </div>
    );
};

export default Info;