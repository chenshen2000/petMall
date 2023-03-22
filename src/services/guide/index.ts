import {request} from '@umijs/max'


export function queryGetShoppingGuideList() {
    return request(`/api/notoken/getShoppingGuideList`);
}

export function queryGetNewGoodsList(params:any) {
    return request(`/api/notoken/getGoodsList`,{
        params
    });
}