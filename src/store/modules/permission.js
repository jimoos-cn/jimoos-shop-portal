import { asyncRouterMap, constantRouterMap } from '@/config/router.config'

/**
 * 过滤账户是否拥有某一个权限，并将菜单从加载列表移除
 *
 * @param permission
 * @param route
 * @returns {boolean}
 */
// function hasPermission (permission, route) {
//   console.log('route:' + JSON.stringify(route))
//   if (route.meta && route.meta.permission) {
//     let flag = false
//     for (let i = 0, len = permission.length; i < len; i++) {
//       console.log('i:' + route.meta.permission + ',' + permission[i])
//       flag = route.meta.permission.includes(permission[i])
//       if (flag) {
//         return true
//       }
//     }
//     return false
//   }
//   return true
// }
/**
 * 是否包含 管理员权限
 * @param {object}} route
 * @returns
 */
function hasAdminPermission (route) {
  if (route.meta && route.meta.permission) {
      return route.meta.permission.includes('admin')
  }
  return false
}

/**
 * 单账户多角色时，使用该方法可过滤角色不存在的菜单
 *
 * @param roles
 * @param route
 * @returns {*}
 */
// eslint-disable-next-line
function hasRole(roles, route) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(roles.id)
  } else {
    return true
  }
}

// function filterAsyncRouter (routerMap, roles) {
//   const accessedRouters = routerMap.filter(route => {
//     if (hasPermission(roles.permissionList, route)) {
//       if (route.children && route.children.length) {
//         route.children = filterAsyncRouter(route.children, roles)
//       }
//       return true
//     }
//     return false
//   })
//   return accessedRouters
// }

function filterAdminAsyncRouter (routerMap) {
  const accessedRouters = routerMap.filter(route => {
    if (route.children && route.children.length) {
      route.children = filterAdminAsyncRouter(route.children)
    }
    if (hasAdminPermission(route)) {
      return false
    }
    return true
  })
  return accessedRouters
}
const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes ({ commit }, isAdmin) {
      return new Promise(resolve => {
        console.log('isAdmin:' + isAdmin)
        const accessedRouters = isAdmin ? asyncRouterMap : filterAdminAsyncRouter(asyncRouterMap)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
