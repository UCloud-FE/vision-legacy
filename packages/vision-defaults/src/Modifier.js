import React, { Component, Fragment } from 'react'
import { findDOMNode, createPortal } from 'react-dom'
import isInBrowser from 'is-in-browser'

export default class Modifier extends Component {
    calc = () => {
        const dom = this.dom
        if (dom) {
            const rect = dom.getBoundingClientRect()
            this.x = window.scrollX + rect.left
            this.y = window.scrollY + rect.top
            this.w = rect.width
            this.h = rect.height
        }
    }

    handleMouseEnter = (event) => {
        if (this.props.onMouseEnter instanceof Function) {
            this.props.onMouseEnter(event)
        }
    }

    handleMouseLeave = (event) => {
        if (this.props.onMouseLeave instanceof Function) {
            this.props.onMouseLeave(event)
        }
    }

    componentDidMount = () => {
        this.dom = findDOMNode(this)
        this.forceUpdate()
        if (this.dom) {
            this.dom.addEventListener('mouseenter', this.handleMouseEnter)
            this.dom.addEventListener('mouseleave', this.handleMouseLeave)
        }
    }

    componentWillUnmount = () => {
        if (this.dom) {
            this.dom.removeEventListener('mouseenter', this.handleMouseEnter)
            this.dom.removeEventListener('mouseleave', this.handleMouseLeave)
        }
    }

    componentDidUpdate = () => {
        const dom = findDOMNode(this)
        if (dom !== this.dom) {
            if (this.dom) {
                this.dom.removeEventListener('mouseenter', this.handleMouseEnter)
                this.dom.removeEventListener('mouseleave', this.handleMouseLeave)
            }
            this.dom = dom
            this.forceUpdate()
            if (this.dom) {
                this.dom.addEventListener('mouseenter', this.handleMouseEnter)
                this.dom.addEventListener('mouseleave', this.handleMouseLeave)
            }
        }
    }

    render() {
        const { children, readonly, surface, focused } = this.props
        if (!isInBrowser) return surface

        this.calc()

        return (
            <Fragment>
                {surface}
                {focused && !readonly ? (
                    createPortal(
                        <span
                            style={{
                                position: 'absolute',
                                background: 'rgba(45, 156, 247, 0.4)',
                                width: this.w,
                                height: this.h,
                                pointerEvents: 'none',
                                verticalAlign: 'top',
                                display: !readonly && focused ? 'unset' : 'none',
                                left: this.x,
                                top: this.y,
                            }}
                        />,
                        document.body
                    )
                ) : null}
                {readonly ? null : (
                    createPortal(
                        <span
                            style={{
                                display: 'block',
                                position: 'absolute',
                                width: this.w,
                                height: this.h,
                                pointerEvents: 'none',
                                verticalAlign: 'top',
                                left: this.x,
                                top: this.y,
                                zIndex: 120,
                            }}
                        >
                            {children}
                        </span>,
                        document.body
                    )
                )}
            </Fragment>
        )
    }
}
