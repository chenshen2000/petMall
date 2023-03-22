import {request} from '@umijs/max'


export function queryLunboList() {
    return request(`/api/notoken/lunbolist`);
}

export function querygetGoodsList(params:any) {
    return request(`/api/notoken/getGoodsList`,{params});
}