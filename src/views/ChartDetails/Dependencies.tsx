import React from 'react';
import { ChartDependency } from "../../api/model";


function dataEntry(name: string, value: string | null | undefined) {
    return value ?
        <div>
            <span className="font-bold mr-1">{name}:</span> {value}
        </div>
        : null;
}

type Props = {
    items: ChartDependency[]
}
const Dependencies = (props: Props) => {
    return (
        <div className="w-full">
            {props.items.length == 0
                ? <div className="w-full flex justify-center text-2xl text-zinc-800">
                    No dependencies
                </div>
                : null}
            {props.items.map(e => {
                return <div key={e.name} className="bg-zinc-100 rounded-2xl p-4 mb-4 drop-shadow">
                    <div>
                        {dataEntry("Name", e.name)}
                        {dataEntry("Repository", e.repository)}
                        {dataEntry("Version", e.version)}
                        {dataEntry("Tags", e.tags?.join(", "))}
                        {dataEntry("Condition", e.condition)}
                        {dataEntry("Alias", e.alis)}
                        {dataEntry("Enabled", e.enabled ? "Yes" : "No")}
                    </div>
                </div>
            })}
        </div>
    );
};

export default Dependencies;