import { Record, fromJS, Map } from 'immutable'

const convertPath = (path) => {
    return path.reduce((a, b) => a.concat([ 'children', b ]), [])
}

const ViewRecord = Record({
    id: null,
    component: null,
    props: {},
    children: fromJS({}),
})

class ViewState extends ViewRecord {
    constructor(data) {
        if (!data.children) {
            data.children = {}
        }
        let children = new Map()
        for (let key in data.children) {
            children = children.set(key, new ViewState(data.children[key]))
        }

        super({ ...data, children })
    }

    getView(path) {
        return this.getIn(convertPath(path))
    }

    addView(path, view) {
        return this.setIn(convertPath(path), view)
    }

    removeView(path) {
        return this.removeIn(convertPath(path))
    }

    setViewProps(path, props) {
        const viewState = this.getView(path)

        if (!viewState) {
            return this.addView(path, new ViewRecord({ id: path[path.length - 1], props }))
        }

        const originProps = viewState.get('props', {})

        return this.setIn([ ...convertPath(path), 'props' ], { ...originProps, ...props })
    }
}

const getRoot = () =>
    new ViewState({
        id: 'root',
    })

export default ViewState

export { getRoot, ViewRecord }
