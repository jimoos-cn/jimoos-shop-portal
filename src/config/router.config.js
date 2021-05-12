// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    redirect: '/dashboard/workplace',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/workplace',
        component: RouteView,
        meta: { title: 'menu.dashboard', keepAlive: true, icon: bxAnaalyse, permission: ['dashboard'] },
        children: [
          {
            path: '/dashboard/workplace',
            name: 'Analysis',
            component: () => import('@/views/dashboard/DashboardHome'),
            meta: { title: 'menu.dashboard.main', keepAlive: false, permission: ['dashboard'] }
          }
        ]
      },
      //  product 商品管理
      {
        path: '/products',
        name: 'product',
        redirect: '/product/list',
        component: RouteView,
        meta: { title: 'menu.product', keepAlive: true, icon: 'shopping', permission: ['product'] },
        children: [
          {
            path: '/product/list',
            name: 'productList',
            component: () => import('@/views/product/ProductList'),
            meta: { title: 'menu.product.list', keepAlive: false, permission: ['product'] }
          },
          {
            path: '/product/categoryList',
            name: 'productCategoryList',
            component: () => import('@/views/product/ProductCategoryList'),
            meta: { title: 'menu.product.category', keepAlive: false, permission: ['product'] }
          },
          {
            path: '/product/tagList',
            name: 'productTagList',
            component: () => import('@/views/product/ProductTagList'),
            meta: { title: 'menu.product.tag', keepAlive: false, permission: ['product'] }
          },
          {
            path: '/product/detail',
            name: 'productDetail',
            hidden: true,
            component: () => import('@/views/product/ProductDetail'),
            meta: { title: '商品详情', keepAlive: true, permission: ['product'] }
          },
          {
            path: '/product/attrList-management',
            name: 'attrList-management',
            hideChildrenInMenu: true,
            redirect: '/product/attrList',
            meta: { title: 'menu.product.attr', keepAlive: true, permission: ['product'] },
            component: RouteView,
            children: [
              {
                path: '/product/attrList',
                name: 'attrList',
                meta: { title: 'menu.product.attr', keepAlive: true, permission: ['product'] },
                component: () => import('@/views/product/ProductAttrList')
              },
              {
                path: '/product/attr/save',
                name: 'productAttrSave',
                hidden: true,
                component: () => import('@/views/product/attr/SaveAttr'),
                meta: { title: 'menu.product.addAttr', keepAlive: false, permission: ['product'] }
              }
              // {
              //   path: '/product/product-attr-management/edit',
              //   name: 'skuEdit',
              //   meta: { title: '编辑销售属性', keepAlive: true, permission: ['attr-edit'] },
              //   component: () => import('@/views/product/product-attr-management/product-attr-edit/ProductAttrEdit')
              // }
            ]
          }
        ]
      },
      // coupons 优惠券管理
      {
        path: '/coupons',
        name: 'coupon',
        redirect: '/coupon/list',
        component: RouteView,
        meta: { title: 'menu.coupon', keepAlive: true, icon: 'gift', permission: ['coupon'] },
        children: [
          {
            path: '/coupon/list',
            name: 'couponList',
            component: () => import('@/views/coupon/CouponList'),
            meta: { title: 'menu.coupon.list', keepAlive: false, permission: ['coupon'] }
          },
          {
            path: '/coupon/detail',
            name: 'couponDetail',
            hidden: true,
            component: () => import('@/views/coupon/CouponDetail'),
            meta: { title: '优惠券详情', keepAlive: true }
          }
        ]
      },
      // admin
      {
        path: '/admins',
        name: 'admin',
        redirect: '/admin/list',
        component: RouteView,
        meta: { title: 'menu.admin', keepAlive: true, icon: 'crown', permission: ['admin'] },
        children: [
          {
            path: '/admin/list',
            name: 'adminList',
            component: () => import('@/views/admin/adminList'),
            meta: { title: 'menu.admin.list', keepAlive: false, permission: ['admin'] }
          }
        ]
      },
      // account
      {
        path: '/settings',
        component: RouteView,
        redirect: '/settings/center',
        name: 'account',
        meta: { title: 'menu.setting', icon: 'setting', keepAlive: true, permission: ['setting'] },
        children: [
          {
            path: '/settings',
            name: 'settings',
            component: () => import('@/views/settings/Index'),
            meta: { title: '商城设置', hideHeader: true, permission: ['setting'] },
            redirect: '/settings/shopInfo',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/settings/shopInfo',
                name: 'ShopInfo',
                component: () => import('@/views/settings/ShopInfo'),
                meta: { title: '基本信息', hidden: true, permission: ['setting'] }
              },
              {
                path: '/account/settings/security',
                name: 'SecuritySettings',
                component: () => import('@/views/account/settings/Security'),
                meta: {
                  title: 'account.settings.menuMap.security',
                  hidden: true,
                  keepAlive: true,
                  permission: ['user']
                }
              },
              {
                path: '/account/settings/custom',
                name: 'CustomSettings',
                component: () => import('@/views/account/settings/Custom'),
                meta: { title: 'account.settings.menuMap.custom', hidden: true, keepAlive: true, permission: ['user'] }
              },
              {
                path: '/account/settings/binding',
                name: 'BindingSettings',
                component: () => import('@/views/account/settings/Binding'),
                meta: { title: 'account.settings.menuMap.binding', hidden: true, keepAlive: true, permission: ['user'] }
              },
              {
                path: '/account/settings/notification',
                name: 'NotificationSettings',
                component: () => import('@/views/account/settings/Notification'),
                meta: {
                  title: 'account.settings.menuMap.notification',
                  hidden: true,
                  keepAlive: true,
                  permission: ['user']
                }
              }
            ]
          }
        ]
      },
      {
        path: '/develop',
        component: RouteView,
        name: 'develop',
        meta: { title: 'menu.develop', icon: 'tool', keepAlive: true, permission: ['admin'] },
        children: [
          {
            path: '/develop',
            name: 'develop',
            component: () => import('@/views/develop/Index'),
            meta: { title: '开发者选项', hideHeader: true, permission: ['develop'] },
            redirect: '/develop/Debug',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/develop/debug',
                name: 'Debug',
                component: () => import('@/views/develop/Debug'),
                meta: { title: '开发者模式', hidden: true, permission: ['develop'] }
              },
              {
                path: '/develop/upload',
                name: 'Upload',
                component: () => import('@/views/develop/Upload'),
                meta: { title: '文件上传设置', hidden: true, permission: ['develop'] }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/auth/Login')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
