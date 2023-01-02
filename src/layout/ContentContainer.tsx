import React from 'react';
import styles from './ContentContainer.module.css';

type Props = {
    beforeContent?: React.ReactNode
    className?: string;
} & React.PropsWithChildren
const ContentContainer = (props: Props) => {
    return (
        <div className={`grow min-w-[200px] flex flex-col ${props.className ?? ""}`}>
            {
                props.beforeContent
                    ? <div className={styles.hardBreak}>
                        {props.beforeContent}
                    </div>
                    : null
            }
            <div className={`grow m-auto ${styles.hardBreak} w-full max-w-5xl`}>
                {props.children}
            </div>
        </div>
    );
};

export default ContentContainer;