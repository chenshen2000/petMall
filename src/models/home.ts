//Effect 异步操作     Reducer  纯函数      Subscription 订阅更新
import { queryLunboList,querygetGoodsList } from '@/services/home';

export default {
  namespace: 'home',
  state: {
    lunboList: [],
    catSnackList:[],
    catSupplyList:[],
  },
  reducers: {
    lunboListSave(state: any, { payload }:any) {
      const { lunboList} = payload;
      return { ...state, lunboList };
    },
    catSnackListSave(state: any, { payload }:any) {
      const { catSnackList} = payload;
      return { ...state, catSnackList };
    },
    catSupplyListSave(state: any, { payload }:any) {
      const { catSupplyList} = payload;
      return { ...state, catSupplyList };
    },
  },
  //用于处理异步操作和业务逻辑，不直接修改 state，简单的来说，就是获取从服务端获取数据，并且发起一个 action 交给 reducer。其中它用到了redux-saga，里面有几个常用的函数
  effects: {
    // * 表示生成器函数，该函数会返回一个迭代器
    // 参数 payload 表示有效负载的数据，在外部通过dispatch传递
    // put:  用于触发action  yield put({ type: 'todos/add', payload: 'Learn Dva'});
    // call:用于调用异步逻辑，支持Promise，第一个参数是你要调用的函数，第二个参数开始是你要传递的参。const result = yield call(fetch, '/todos');
    // select:用于从state里获取数据。const todos = yield select(state => state.todos);
    *fetchLunboList({ payload } :any, { call, put }:any) {
      const { data } = yield call(queryLunboList);
      yield put({
        type: 'lunboListSave',
        payload: {
          lunboList: data.lunboList,
        },
      });
    },
    *fetchcatSnackList({ payload } :any, { call, put }:any) {
      const { data } = yield call(querygetGoodsList,{petClassify:payload.petClassify,goodsType:payload.goodsType});
      yield put({
        type: 'catSnackListSave',
        payload: {
          catSnackList: data.list,
        },
      });
    },
    *fetchcatSupplyList({ payload } :any, { call, put }:any) {
      const { data } = yield call(querygetGoodsList);
      yield put({
        type: 'catSupplyListSave',
        payload: {
          catSupplyList: data.list,
        },
      });
    }
  }
};