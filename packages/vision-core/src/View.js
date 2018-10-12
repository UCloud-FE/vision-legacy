import React, { Component } from 'react'
import invariant from 'invariant'
import { EditorContext, Provider, Consumer } from './Editor'
import ViewState from './ViewState'
import { isClassComponent } from 'recompose'

const EditorConsumer = EditorContext.Consumer

const emptyRenderer = ({ children }) => {
    return children
}

const emptyFunc = () => {}

class V extends Component {
    constructor(...args) {
        super(...args)

        const { path, id, viewRenderer, readonly } = this.props
        const localPath = [ ...path, id ]
        this.localPath = localPath

        this.requestUpdateProps = (props, withoutStack) => {
            this.props.setViewProps(localPath, props, withoutStack)
        }
        this.append = (component) => {
            this.props.addView(localPath, new ViewState({ id, component }))
            this.props.onChange()
        }
        this.remove = () => {
            this.props.removeView(localPath)
        }

        this.view = (comp) => {
            const component = (
                <Provider
                    value={{
                        path: localPath,
                    }}
                >
                    {comp}
                </Provider>
            )

            return React.createElement(
                viewRenderer,
                {
                    requestUpdateProps: this.requestUpdateProps,
                    append: this.append,
                    remove: this.remove,
                    readonly: readonly || this.props.globalReadonly,
                },
                component
            )
        }
    }

    render() {
        const { rendererMap, globalReadonly, defaultRenderer, getView } = this.props
        const viewState = getView(this.localPath)
        const type = viewState && viewState.get('component')

        if (type) {
            const { props } = viewState

            const Comp = rendererMap[type]

            invariant(Comp, `Can't get component of type: '${type}'.`)

            return this.view(<Comp requestUpdateProps={this.requestUpdateProps} readonly={globalReadonly} {...props} />)
        }

        if (defaultRenderer) {
            const props = {
                ...(viewState && viewState.get('props')),
                requestUpdateProps: this.requestUpdateProps,
                readonly: globalReadonly,
            }

            return this.view(React.createElement(defaultRenderer, props))
        }

        if (globalReadonly) return null

        return this.view(null)
    }
}

const View = ({ id, defaultRenderer, readonly, onChange = () => {} }) => {
    return (
        <EditorConsumer>
            {({
                addView,
                removeView,
                setViewProps,
                getView,
                readonly: globalReadonly,
                rendererMap,
                viewRenderer = emptyRenderer,
            }) => {
                if (globalReadonly) {
                    addView = emptyFunc
                    removeView = emptyFunc
                    setViewProps = emptyFunc
                }

                return (
                    <Consumer>
                        {({ path = [] }) => {
                            return (
                                <V
                                    {...{
                                        id,
                                        defaultRenderer,
                                        readonly,
                                        addView,
                                        removeView,
                                        setViewProps,
                                        getView,
                                        globalReadonly,
                                        rendererMap,
                                        viewRenderer,
                                        path,
                                        onChange,
                                    }}
                                />
                            )
                        }}
                    </Consumer>
                )
            }}
        </EditorConsumer>
    )
}

export default View
