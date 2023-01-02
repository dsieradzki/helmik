import React, { useEffect, useState } from 'react';
import { FolderOpenIcon, FolderPlusIcon, ListBulletIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import { api } from "../api/api";
import logo from "../assets/images/app-icon.png";
import { useApplicationStore } from "../store/applicationStore";
import { observer } from "mobx-react-lite";

type ItemProps = {
    to: string
    title: string
    icon: React.ReactNode
}
const Item = (props: ItemProps) => {
    const location = useLocation();
    const isActive = location.pathname === props.to;

    if (isActive) {
        return <Link to={props.to} className="p-2 rounded-md mb-2 flex items-center bg-zinc-100 text-zinc-800">
            {props.icon}
            <div className="whitespace-nowrap">
                {props.title}
            </div>
        </Link>
    } else {
        return <Link to={props.to} className="p-2 rounded-xl mb-2 flex items-center text-zinc-100">
            {props.icon}
            <div className="whitespace-nowrap">
                {props.title}
            </div>
        </Link>
    }
}

type Props = {
    className?: string;
}
const Sidebar = (props: Props) => {
    const [helmVersion, setHelmVersion] = useState("");
    const applicationStore = useApplicationStore();
    useEffect(() => {
        api.version()
            .then(data => {
                setHelmVersion(data);
            })
            .catch((err: any) => {
                applicationStore.reportAnError(err);
            })
    }, []);
    return (
        <div className={`${props.className ?? ""} bg-zinc-800 p-2 flex flex-col justify-between`}>
            <div className="flex flex-col justify-start">
                <div className="my-2 flex items-center justify-center text-white text-3xl   ">
                    <img src={logo} className="w-32" alt="Logo"/>
                </div>

                <Item to={"/catalog"} title={"Available charts"} icon={<FolderOpenIcon className="w-6 h-6 mr-1"/>}/>
                <Item to={"/"} title={"Installed charts"} icon={<ListBulletIcon className="w-6 h-6 mr-1"/>}/>
                <Item to={"/repos"} title={"Repositories"}
                      icon={<FolderPlusIcon className="w-6 h-6 mr-1"/>}/>
            </div>
            <div className="text-zinc-400 text-center">
                Helm: {helmVersion}
            </div>
        </div>
    );
};

export default observer(Sidebar);