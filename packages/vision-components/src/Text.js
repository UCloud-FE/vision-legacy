import React, { Component } from 'react'
import { Modifier } from '@ucloud-fe/vision-defaults'
import SvgIcon from '@material-ui/core/SvgIcon'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

const EditIcon = (props) => {
    return (
        <SvgIcon {...props}>
            <path d="M5,3C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19H5V5H12V3H5M17.78,4C17.61,4 17.43,4.07 17.3,4.2L16.08,5.41L18.58,7.91L19.8,6.7C20.06,6.44 20.06,6 19.8,5.75L18.25,4.2C18.12,4.07 17.95,4 17.78,4M15.37,6.12L8,13.5V16H10.5L17.87,8.62L15.37,6.12Z" />
        </SvgIcon>
    )
}

export default class Text extends Component {
    constructor(...args) {
        super(...args)

        this.ref = React.createRef()

        this.handler = (event) => {
            this.props.requestUpdateProps(
                {
                    textContent: event.target.textContent,
                },
                true
            )
        }

        this.state = {
            open: false,
            color: this.props.color,
        }
    }

    handleOpen = () => {
        this.setState({ open: true })
    }

    handleCancel = () => {
        this.setState({ open: false, color: this.props.color })
    }

    handleConfirm = () => {
        this.setState({ open: false })
        this.props.requestUpdateProps({ color: this.state.color })
    }

    componentDidMount() {
        this.ref.current.addEventListener('webkitEditableContentChanged', this.handler)
    }

    componentWillUnmount() {
        this.ref.current.removeEventListener('webkitEditableContentChanged', this.handler)
    }

    render() {
        const { requestUpdateProps, color, textContent = 'input...', readonly, ...rest } = this.props

        const dialog = (
            <Dialog
                open={this.state.open}
                onEscapeKeyDown={this.handleCancel}
                onBackdropClick={this.handleCancel}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">编辑文字属性</DialogTitle>
                <DialogContent>
                    <TextField
                        value={this.state.color}
                        onChange={(event) => {
                            this.setState({
                                color: event.target.value,
                            })
                        }}
                        autoFocus
                        margin="dense"
                        label="颜色色值"
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

        let style = rest.style || {}

        if (color) {
            style = { ...style, color }
        }

        return (
            <Modifier
                readonly={readonly}
                surface={
                    <span
                        suppressContentEditableWarning
                        ref={this.ref}
                        contentEditable={readonly ? false : 'plaintext-only'}
                        {...rest}
                        style={style}
                    >
                        {textContent}
                    </span>
                }
            >
                <div
                    style={{
                        width: '100%',
                        position: 'relative',
                        pointerEvents: 'auto',
                    }}
                >
                    <EditIcon
                        onClick={this.handleOpen}
                        style={{
                            color: 'white',
                            fontSize: 14,
                            position: 'absolute',
                            right: -14,
                            top: 0,
                            background: 'rgb(10, 22, 51)',
                        }}
                    />
                </div>
                {dialog}
            </Modifier>
        )
    }
}
