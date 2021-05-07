import storage from 'store'
import { login } from '@/api/auth/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          storage.set('Authorization', response.token, 7 * 24 * 60 * 60 * 1000)
          storage.set('info', response)
          storage.set(ACCESS_TOKEN, response.token, 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', response.token)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        const info = storage.get('info')

        commit('SET_NAME', { name: info.username })
        const role = {
          permissionList: []
        }
        commit('SET_ROLES', role)
        storage.set('roles', role)
        resolve(info)
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        storage.remove('Authorization')
        storage.remove(ACCESS_TOKEN)
        resolve()
      })
    }

  }
}

export default user
