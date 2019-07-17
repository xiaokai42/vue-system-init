import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/serve-info',
                    component: resolve => require(['../components/page/BaseTable.vue'], resolve),
                    meta: { title: '服务资源' }
                },
                {
                    path: '/message',
                    component: resolve => require(['../components/page/Message.vue'], resolve),
                    meta: { title: '消息中心' }
                },
                {
                    path: '/person',
                    component: resolve => require(['../components/page/PersonalDet.vue'], resolve),
                    meta: { title: '个人信息' }
                },
                {
                    path: '/account',
                    component: resolve => require(['../components/page/Account.vue'], resolve),
                    meta: { title: '账户信息' }
                },
				{
                    // 国际化组件
                    path: '/i18n',
                    component: resolve => require(['../components/page/I18n.vue'], resolve),
                    meta: { title: '国际化' }
                },
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
