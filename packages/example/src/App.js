import React, { Component } from 'react'
import { Editor, View, EditorState } from '@ucloud-fe/vision-core'
import './injected'
import { getPoolMap, map } from './Pool'
import ViewComponent from './ViewComponent'
import { Text, Image, List } from '@ucloud-fe/vision-components'
import { defaultProps } from 'recompose'
import Button from '@material-ui/core/Button'
import Switch from '@material-ui/core/Switch'

const ViewRenderer = ViewComponent(map)

const Title = defaultProps({ textContent: 'Title' })(Text)

class App extends Component {
    state = {
        editorState: EditorState.createEmpty(),
        preview: false,
    }

    render() {
        return (
            <Editor
                editorState={this.state.editorState}
                readonly={this.state.preview}
                onChange={(editorState) => {
                    this.setState({ editorState })
                }}
                rendererMap={getPoolMap()}
                viewRenderer={ViewRenderer}
            >
                <div
                    style={{
                        background: '#fff',
                        lineHeight: '70px',
                        height: 70,
                        width: '100%',
                        position: 'fixed',
                        top: 0,
                        zIndex: 110,
                        boxShadow: '0px 2px 100px black',
                    }}
                >
                    <Button
                        disabled={!this.state.editorState.undoable || this.state.preview}
                        onClick={() => {
                            const nextState = this.state.editorState.undo()
                            this.setState({ editorState: nextState })
                        }}
                    >
                        撤销
                    </Button>
                    <Button
                        disabled={!this.state.editorState.redoable || this.state.preview}
                        onClick={() => {
                            const nextState = this.state.editorState.redo()
                            this.setState({ editorState: nextState })
                        }}
                    >
                        重做
                    </Button>
                    <span style={{ float: 'right' }}>
                        <b>预览</b>
                        <Switch
                            checked={this.state.preview}
                            onChange={(event) => this.setState({ preview: event.target.checked })}
                        />
                    </span>
                </div>
                <div
                    style={{
                        background: '#fff',
                        lineHeight: '70px',
                        height: 70,
                    }}
                />
                <View id="text" defaultRenderer={Title} />
                <View id="image" defaultProps={Image} />
            </Editor>
        )
    }
}

export default App
