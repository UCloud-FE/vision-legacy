/**
 * 组件池
 */
const pool = {}

export function register(name, component) {
    pool[name] = component
}

export function get(name) {
    return pool[name]
}

export function map(fn) {
    return Object.keys(pool).map(fn)
}

export function getPoolMap() {
    return pool
}

register('null', () => null)
