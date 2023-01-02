import React from 'react';

type Props = {
    sidebar: React.ReactNode
} & React.PropsWithChildren
const MainContainer = (props: Props) => {
    return (
        <main className="min-w-[400px] h-full flex">
            <div className="min-w-[200px]">
                {props.sidebar}
            </div>
            {props.children}
        </main>
    );
};

export default MainContainer;