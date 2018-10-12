import React, { Component, Fragment } from 'react'
import Button from '@material-ui/core/Button'
import nanoid from 'nanoid'
import { Modifier } from '@ucloud-fe/vision-defaults'
import { View } from '@ucloud-fe/vision-core'

class ListModifier extends Component {
    state = {
        focus: false,
    }

    handleFocus = () => {
        this.setState({ focus: true })
    }

    handleDefocus = () => {
        this.setState({ focus: false })
    }

    render() {
        const { readonly, children, onLeft, onRight, onInsert, onDelete } = this.props

        return (
            <Modifier readonly={readonly} focused={this.state.focus} surface={children}>
                <Button
                    style={{
                        position: 'absolute',
                        top: -60,
                        left: 0,
                        pointerEvents: 'auto',
                    }}
                    mini
                    variant="fab"
                    onClick={onLeft}
                    onMouseEnter={this.handleFocus}
                    onMouseLeave={this.handleDefocus}
                >
                    左移
                </Button>
                <Button
                    style={{
                        position: 'absolute',
                        top: -60,
                        left: 45,
                        pointerEvents: 'auto',
                    }}
                    mini
                    variant="fab"
                    onClick={onRight}
                    onMouseEnter={this.handleFocus}
                    onMouseLeave={this.handleDefocus}
                >
                    右移
                </Button>
                <Button
                    style={{
                        position: 'absolute',
                        top: -60,
                        left: 90,
                        pointerEvents: 'auto',
                    }}
                    mini
                    variant="fab"
                    onClick={onInsert}
                    onMouseEnter={this.handleFocus}
                    onMouseLeave={this.handleDefocus}
                >
                    插入
                </Button>
                <Button
                    style={{
                        position: 'absolute',
                        top: -60,
                        left: 135,
                        pointerEvents: 'auto',
                    }}
                    mini
                    variant="fab"
                    onClick={onDelete}
                    onMouseEnter={this.handleFocus}
                    onMouseLeave={this.handleDefocus}
                >
                    删除
                </Button>
            </Modifier>
        )
    }
}

const List = ({ requestUpdateProps, readonly, children, readonlyView, ids = [] }) => {
    const left = (index) => {
        const arr = [ ...ids ]
        const itemLeft = arr[index - 1]
        if (!itemLeft) {
            return arr
        }

        arr[index - 1] = arr[index]
        arr[index] = itemLeft

        return arr
    }

    const right = (index) => {
        const arr = [ ...ids ]
        const itemRight = arr[index + 1]
        if (!itemRight) {
            return arr
        }

        arr[index + 1] = arr[index]
        arr[index] = itemRight

        return arr
    }

    const remove = (index) => {
        const arr = [ ...ids ]
        arr.splice(index, 1)

        return arr
    }

    const insert = (index) => {
        const arr = [ ...ids ]
        arr.splice(index, 0, nanoid())

        return arr
    }

    let res = ids.map((id, index) => {
        return (
            <ListModifier
                key={id}
                readonly={readonly}
                onLeft={() => {
                    requestUpdateProps({
                        ids: left(index),
                    })
                }}
                onRight={() => {
                    requestUpdateProps({
                        ids: right(index),
                    })
                }}
                onDelete={() => {
                    requestUpdateProps({ ids: remove(index) })
                }}
                onInsert={() => {
                    requestUpdateProps({ ids: insert(index) })
                }}
            >
                <View readonly={readonlyView} id={id} defaultRenderer={children(id, index)} />
            </ListModifier>
        )
    })

    if (!readonly) {
        res.push(
            <span
                style={{
                    position: 'relative',
                    width: 0,
                    height: 0,
                }}
            >
                <Button
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                    }}
                    size="small"
                    key="button"
                    variant="raised"
                    onClick={() => {
                        requestUpdateProps({
                            ids: [ ...ids, nanoid() ],
                        })
                    }}
                >
                    添加
                </Button>
            </span>
        )
    }

    return res
}

export default List
