import { Stack, Record } from 'immutable'
import ViewState, { getRoot } from './ViewState'

const EditorRecord = Record({
    past: new Stack(),
    present: getRoot(),
    future: new Stack(),
})

/**
 * focus, undo & redo, view-tree
 */
class EditorState extends EditorRecord {
    getView(path) {
        return this.present.getView(path)
    }

    /**
     * step
     * - 1: clear future
     * - 2: push present to past
     * - 3: modify present
     */
    addView(path, view) {
        const step1 = this.set('future', new Stack())
        const step2 = step1.set('past', step1.past.push(step1.present))
        const step3 = step2.set('present', step2.present.addView(path, view))

        return step3
    }

    removeView(path) {
        const step1 = this.set('future', new Stack())
        const step2 = step1.set('past', step1.past.push(step1.present))
        const step3 = step2.set('present', step2.present.removeView(path))

        return step3
    }

    setViewProps(path, props, withoutStack = false) {
        if (withoutStack) {
            return this.set('present', this.present.setViewProps(path, props))
        }

        const step1 = this.set('future', new Stack())
        const step2 = step1.set('past', step1.past.push(step1.present))
        const step3 = step2.set('present', step2.present.setViewProps(path, props))

        return step3
    }

    convert(viewState, withoutStack) {
        if (withoutStack) {
            return this.set('present', viewState)
        }

        const step1 = this.set('future', new Stack())
        const step2 = step1.set('past', step1.past.push(step1.present))
        const step3 = step2.set('present', viewState)

        return step3
    }

    get undoable() {
        return this.past.size > 0
    }

    /**
     * step
     * - 1: push present to future
     * - 2: pop past
     * - 3: set popped past to present
     */
    undo() {
        if (!this.undoable) {
            return this
        }

        const step1 = this.set('future', this.future.push(this.present))
        const present = step1.past.peek()
        const step2 = step1.set('past', step1.past.pop())
        const step3 = step2.set('present', present)

        return step3
    }

    get redoable() {
        return this.future.size > 0
    }

    /**
     * step
     * - 1: push present to past
     * - 2: pop future
     * - 3: set popped future to present
     */
    redo() {
        if (!this.redoable) {
            return this
        }

        const step1 = this.set('past', this.past.push(this.present))
        const present = step1.future.peek()
        const step2 = step1.set('future', step1.future.pop())
        const step3 = step2.set('present', present)

        return step3
    }

    serialise() {
        return this.present.toJSON()
    }
}

EditorState.createEmpty = () => new EditorState()

EditorState.create = (data) => new EditorState({ present: new ViewState(data) })

export default EditorState
