import React from 'react';

interface ChipProps {
    content?: URL | string;
}

export default function Chip(props: ChipProps) {
    if (props.content) {
        return (
            <div className="chip">
                {
                    (props.content instanceof URL) ?
                    <a href={props.content.href} target="_blank" rel='noreferer'>{props.content.origin.replace(/http[s]?:\/\//, '')}</a>
                    :
                    <p>{props.content}</p>
                }
            </div>
        );
    } else {
        return <></>;
    }
}