import storage from 'store'

const debug = {
    state: {
        debugState: false
    },
    mutations: {
        SET_DEBUG: (state, debugState) => {
            state.debugState = debugState
        }
    },
    actions: {
        // 获取开发者debugState信息
        getDebugState ({ commit }) {
            return new Promise((resolve, reject) => {
                const debugState = storage.get('debugState')

                resolve(debugState)
            })
        },
        // 设置 debug 信息
        setDebugState ({ commit }, debugState) {
            return new Promise((resolve, reject) => {
                commit('SET_DEBUG', debugState)
                storage.set('debugState', debugState)
                resolve(debugState)
            })
        }
    }
}

export default debug
