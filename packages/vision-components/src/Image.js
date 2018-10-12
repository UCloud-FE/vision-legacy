import React, { Component, Fragment } from 'react'
import { Modifier } from '@ucloud-fe/vision-defaults'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

export default class Image extends Component {
    handleOpen = () => {
        this.setState({ open: true })
    }

    handleCancel = () => {
        this.setState({ open: false, src: this.props.src })
    }

    handleConfirm = () => {
        this.setState({ open: false })
        this.props.requestUpdateProps({ src: this.state.src, href: this.state.href })
    }

    handleFocus = () => {
        this.setState({ focus: true })
    }

    handleDefocus = () => {
        this.setState({ focus: false })
    }

    constructor(...args) {
        super(...args)

        this.state = {
            focus: false,
            open: false,
            src: this.props.src,
            href: this.props.href,
        }
    }

    render() {
        const { src, href, requestUpdateProps, readonly, children, ...rest } = this.props

        const dialog = (
            <Dialog
                style={{
                    zIndex: 1000000,
                }}
                open={this.state.open}
                onEscapeKeyDown={this.handleCancel}
                onBackdropClick={this.handleCancel}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">编辑图片</DialogTitle>
                <DialogContent>
                    <DialogContentText>可以替换图片并为图片添加超链接</DialogContentText>
                    <TextField
                        value={this.state.src}
                        onChange={(event) => {
                            this.setState({
                                src: event.target.value,
                            })
                        }}
                        autoFocus
                        margin="dense"
                        label="图片地址"
                        type="text"
                        fullWidth
                    />
                    <TextField
                        value={this.state.href}
                        onChange={(event) => {
                            this.setState({
                                href: event.target.value,
                            })
                        }}
                        margin="dense"
                        label="超链接"
                        type="text"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleCancel} color="primary">
                        取消
                    </Button>
                    <Button onClick={this.handleConfirm} color="primary">
                        确认
                    </Button>
                </DialogActions>
            </Dialog>
        )

        let restProps = { ...rest }

        if (!readonly) {
            restProps['onClick'] = (event) => {
                event.preventDefault()
                this.handleOpen()
            }
            restProps['onMouseEnter'] = this.handleFocus
            restProps['onMouseLeave'] = this.handleDefocus
        }

        const baseStyle = { maxWidth: '100%', maxHeight: '100%' }

        const r = href
            ? {
                  style: {
                      ...baseStyle,
                      verticalAlign: 'middle',
                  },
              }
            : restProps

        const content = src ? (
            <img style={baseStyle} src={src} {...r}>
                {children}
            </img>
        ) : readonly ? null : (
            <Button onClick={this.handleOpen}>Edit</Button>
        )

        return (
            <Modifier
                readonly={readonly}
                focused={this.state.focus}
                surface={
                    <Fragment>
                        {href ? (
                            <a href={href} {...restProps}>
                                {content}
                            </a>
                        ) : (
                            content
                        )}
                    </Fragment>
                }
            >
                {dialog}
            </Modifier>
        )
    }
}
