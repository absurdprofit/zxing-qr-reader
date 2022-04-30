import React from 'react';

interface ProfileDisplayProps {
    fps: string;
    mspf: string;
}

export default function ProfileDisplay(props: ProfileDisplayProps) {
    if (process.env.NODE_ENV === 'development') {
        return (
            <div className="profile-info">
                <p>FPS: {props.fps}</p>
                <p>MSPF: {props.mspf}</p>
            </div>
        );
    } else {
        return <></>;
    }
}