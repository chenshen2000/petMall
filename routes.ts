export default [
  {
    name: '登录',
    path: '/login',
    title:"宠物商城-登录",
    component: './Login',
  },
  {
    name: '注册',
    path: '/register',
    title:"宠物商城-注册",
    component: './Register',
  },
  {
    path: '/',
    component: '@/layouts/layouts',
    exact:true,
    routes: [
      {
        name: '首页',
        path: '/',
        title:"宠物商城-首页",
        component: './Home',
      },
      {
        name: '狗零食',
        path: '/dogSnack',
        title:"宠物商城-狗零食",
        component: './DogSnack',
      },
      {
        name: '狗用品',
        path: '/dogSupply',
        title:"宠物商城-狗用品",
        component: './DogSupply',
      },
      {
        name: '猫零食',
        path: '/catSnack',
        title:"宠物商城-猫零食",
        component: './CatSnack',
      },
      {
        name: '猫用品',
        path: '/catSupply',
        title:"宠物商城-猫用品",
        component: './CatSupply',
      },
      {
        name: '所有商品',
        path: '/classify',
        title:"宠物商城-所有商品",
        component: './Classify',
      },      
      {
        name: '购物指南',
        path: '/shoppingGuide',
        title:"宠物商城-购物指南",
        component: './ShoppingGuide',
      },
      {
        name: '联系我们',
        path: '/feedback',
        title:"宠物商城-联系我们",
        component: './Feedback',
      },
      {
        name: '个人中心',
        path: '/user',
        title:"宠物商城-个人中心",
        component: './User',
      },
      {
        name: '商品详情',
        path: '/detail/:goodsId',
        title:"宠物商城-商品详情",
        component: './Detail',
      },
      {
        name: '购物车',
        path: '/cart',
        title:"宠物商城-购物车",
        component: './Cart',
      },
      {
        name: '结算',
        path: '/settle',
        title:"宠物商城-结算",
        component: './Settle',
      },
    ],
  },

  { path: '*', redirect: '/'},
];
