import React, { HTMLAttributes } from 'react';

type Props = {
    icon: React.ComponentType<HTMLAttributes<any>>;
} & React.PropsWithChildren;
const ContentHeader = (props: Props) => {
    const Icon = props.icon;
    return (
        <div className="border-b border-b-zinc-200 text-3xl font-light text-zinc-500 p-4 flex items-center">
            <div className="bg-white rounded-xl p-3 mr-2 drop-shadow">
                <Icon className="w-7 h-7 text-zinc-600"/>
            </div>
            <div className="grow">
                {props.children}
            </div>
        </div>
    );
};

export default ContentHeader;