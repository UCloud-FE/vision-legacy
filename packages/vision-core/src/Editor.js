import React from 'react'

const EditorContext = React.createContext()

const { Provider, Consumer } = React.createContext({})

const Editor = ({ readonly, editorState, onChange = () => {}, children, rendererMap = {}, viewRenderer }) => {
    const emit = (func) => (...args) => {
        onChange(func(...args))
    }

    return (
        <EditorContext.Provider
            value={{
                readonly,
                rendererMap,
                viewRenderer,
                addView: emit(editorState.addView.bind(editorState)),
                removeView: emit(editorState.removeView.bind(editorState)),
                setViewProps: emit(editorState.setViewProps.bind(editorState)),
                getView: editorState.getView.bind(editorState),
            }}
        >
            <Provider value={{ path: [] }}>{children}</Provider>
        </EditorContext.Provider>
    )
}

export default Editor
export { EditorContext, Provider, Consumer }
