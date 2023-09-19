import React from 'react'

export default function Alerts(props) {
    return (
        props.alert && <div>
            <div className={`alert alert-${props.type}`} role="alert">
                {props.alert}
            </div>
        </div>
    )
}
