import React from 'react';

type Props = {
    className?: string;
} & React.PropsWithChildren
const Tag = (props: Props) => {
    return (
        <div className={`${props.className ?? ""} rounded-full text-white text-center`}>
            {props.children}
        </div>
    );
};

export default Tag;