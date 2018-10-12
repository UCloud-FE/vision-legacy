import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import AppBar from '@material-ui/core/AppBar'
import Dialog from '@material-ui/core/Dialog'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import Slide from '@material-ui/core/Slide'
import { withStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Tooltip from '@material-ui/core/Tooltip'
import { Modifier } from '@ucloud-fe/vision-defaults'

const styles = {
    appBar: {
        position: 'relative',
    },
    flex: {
        flex: 1,
    },
}

function Transition(props) {
    return <Slide direction="up" {...props} />
}

const delay = (fn, ms = 0) => {
    return function() {
        setTimeout(fn, ms)
    }
}

class Item extends Component {
    state = {
        hover: false,
    }

    render() {
        const { id, image, name, desc, onClick } = this.props

        return (
            <div
                style={{
                    width: 193,
                    marginTop: 20,
                }}
            >
                <div
                    style={{
                        color: 'white',
                    }}
                    onMouseEnter={() => {
                        this.setState({ hover: true })
                    }}
                    onMouseLeave={() => {
                        this.setState({ hover: false })
                    }}
                    onClick={onClick}
                >
                    {name}
                </div>
                <div
                    style={{
                        position: 'relative',
                    }}
                >
                    <img
                        src={image}
                        style={{
                            width: '100%',
                            height: 110,
                            objectFit: 'contain',
                            objectPosition: 'center',
                            imageRendering: '-webkit-optimize-contrast',
                        }}
                        onMouseEnter={() => {
                            this.setState({ hover: true })
                        }}
                        onMouseLeave={() => {
                            this.setState({ hover: false })
                        }}
                        onClick={onClick}
                    />
                    <div
                        style={{
                            background: 'rgba(0,0,0,.6)',
                            height: 110,
                            left: 0,
                            opacity: this.state.hover ? 1 : 0,
                            position: 'absolute',
                            top: 0,
                            transition: 'opacity .2s cubic-bezier(.7,0,.3,1)',
                            width: '100%',
                            color: 'white',
                            textAlign: 'center',
                            pointerEvents: 'none',
                        }}
                    >
                        {desc && (
                            <div
                                style={{
                                    whiteSpace: 'pre-wrap',
                                    background: 'rgba(0,0,0,.7)',
                                    position: 'absolute',
                                    left: 220,
                                    width: 350,
                                    textAlign: 'left',
                                    padding: 10,
                                }}
                            >
                                {desc}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

class ViewModifier extends Component {
    state = {
        open: false,
        focus: false,
    }

    unHoveringTask = null

    handleClickOpen = () => {
        this.setState({ open: true })
    }

    handleClose = () => {
        this.setState({ open: false })
    }

    handleFocus = () => {
        this.setState({ focus: true })
        this.handleHovering()
    }

    handleDefocus = () => {
        this.setState({ focus: false })
        this.handleUnHovering()
    }

    handleHovering = () => {
        this.setState({ hovering: true })
        if (this.unHoveringTask) {
            clearTimeout(this.unHoveringTask)
            this.unHoveringTask = null
        }
    }

    handleUnHovering = () => {
        if (this.unHoveringTask) {
            clearTimeout(this.unHoveringTask)
        }
        this.unHoveringTask = setTimeout(() => {
            this.setState({ hovering: false })
        }, 500)
    }

    render() {
        const {
            classes,
            id,
            children,
            readonly,
            map,
            onLoad = () => {},
            onClear = () => {},
            onRemove = () => {},
        } = this.props

        return (
            <Modifier
                onMouseEnter={this.handleHovering}
                onMouseLeave={this.handleUnHovering}
                readonly={readonly}
                focused={this.state.focus}
                surface={children}
            >
                {this.state.hovering ? (
                    <div
                        style={{
                            pointerEvents: 'auto',
                        }}
                    >
                        <Button
                            variant="raised"
                            size="small"
                            style={{
                                position: 'absolute',
                                top: -28,
                                left: 0,
                            }}
                            onClick={this.handleClickOpen}
                            onMouseEnter={this.handleFocus}
                            onMouseLeave={this.handleDefocus}
                        >
                            替换
                        </Button>
                        <Button
                            variant="raised"
                            size="small"
                            style={{
                                position: 'absolute',
                                top: -28,
                                left: 68,
                            }}
                            onClick={onClear}
                            onMouseEnter={this.handleFocus}
                            onMouseLeave={this.handleDefocus}
                        >
                            重置
                        </Button>
                        <Button
                            variant="raised"
                            size="small"
                            style={{
                                position: 'absolute',
                                top: -28,
                                left: 136,
                            }}
                            onClick={onRemove}
                            onMouseEnter={this.handleFocus}
                            onMouseLeave={this.handleDefocus}
                        >
                            删除
                        </Button>
                    </div>
                ) : null}
                <Drawer
                    open={this.state.open}
                    onClose={this.handleClose}
                    elevation={0}
                    ModalProps={{
                        BackdropProps: {
                            invisible: true,
                        },
                    }}
                    PaperProps={{
                        style: {
                            background: 'transparent',
                        },
                        id: 'view-modifier-scroller',
                        onClick: this.handleClose,
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                        }}
                    >
                        <div
                            style={{
                                padding: 20,
                                background: '#2f2f2f',
                                boxSizing: 'border-box',
                                height: '100%',
                            }}
                            onClick={(event) => {
                                event.stopPropagation()
                            }}
                        >
                            {map((data) => {
                                return (
                                    <Item
                                        onClick={() => {
                                            onLoad(data.key)
                                        }}
                                        {...data}
                                    />
                                )
                            })}
                        </div>
                        <div
                            style={{
                                background: 'transparent',
                                width: 400,
                            }}
                        />
                    </div>
                </Drawer>
                <style global jsx>
                    {`
                        #view-modifier-scroller::-webkit-scrollbar {
                            display: none;
                        }
                    `}
                </style>
            </Modifier>
        )
    }
}

export default withStyles(styles)(ViewModifier)
