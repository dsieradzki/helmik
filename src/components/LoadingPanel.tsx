import React from 'react';
import { ArrowPathIcon } from "@heroicons/react/24/outline";

type Props = {} & React.PropsWithChildren;
const LoadingPanel = (props: Props) => {
    return (
        <div className="w-full h-full flex justify-center items-center text-2xl ">
            <div className="bg-zinc-50 rounded-xl drop-shadow p-8 flex">
                <ArrowPathIcon className="h-7 w-7 animate-spin text-zinc-800 mr-4"/>
                {props.children}...
            </div>
        </div>
    );
};

export default LoadingPanel;