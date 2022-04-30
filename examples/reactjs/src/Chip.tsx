import React, { useEffect, useState } from 'react';

interface ChipProps {
    content?: URL | string;
}

export default function Chip(props: ChipProps) {
    const [hide, setHide] = useState(true);
    const [timeoutID, setTimeoutID] = useState(0);
    const [content, setContent] = useState<URL | string | undefined>();

    useEffect(() => {
        clearTimeout(timeoutID);
        if (props.content) {
            setContent(props.content);
            if (hide) setHide(false);
        }
        setTimeoutID(
            window.setTimeout(() => {
                setHide(true);
            }, 3000)
        );
        
    }, [props.content]);

    return (
        <div className={`chip ${hide ? 'hide' : 'show'}`}>
            {
                (content instanceof URL) ?
                <a href={content.href} target="_blank" rel='noreferer'>{content.origin.replace(/http[s]?:\/\//, '').replace(/^www./, '')}</a>
                :
                <p>{content}</p>
            }
        </div>
    );
}