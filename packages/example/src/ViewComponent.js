import React from 'react'
import ViewModifier from './ViewModifier'

export default (map) => ({ append, remove, readonly, children }) => {
    return (
        <ViewModifier
            readonly={readonly}
            onLoad={(component) => {
                append(component)
            }}
            onClear={() => {
                remove()
            }}
            onRemove={() => {
                append('null')
            }}
            map={map}
        >
            {children}
        </ViewModifier>
    )
}
