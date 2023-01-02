import React from 'react';


type ToolbarButtonProps = {
    icon: React.ComponentType<any>;
    iconClassName?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>
const ToolbarButton = (props: ToolbarButtonProps) => {
    const {icon, iconClassName, ...buttonProps} = props;
    const Icon = icon;
    return <button {...buttonProps}
                   className="bg-zinc-100 hover:bg-zinc-200 disabled:bg-zinc-50 group rounded-xl p-2 mr-3 drop-shadow">
        <Icon className={`w-7 h-7 text-zinc-600 group-disabled:text-zinc-400 ${iconClassName ?? ""}`}/>
    </button>
}

type ToolbarProps = {} & React.PropsWithChildren
const Toolbar = (props: ToolbarProps) => {
    return (
        <div className="mt-4">
            <div className="bg-zinc-50 rounded-xl drop-shadow mb-2">
                <div className="py-4 px-4 flex">
                    {props.children}
                </div>
            </div>
        </div>
    );
};

Toolbar.Button = ToolbarButton;
export default Toolbar;