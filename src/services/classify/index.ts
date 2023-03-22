import {request} from '@umijs/max'

export function queryGetGoodsList(params:any) {
    return request(`/api/notoken/getGoodsList`,{
        params
    });
}



export function queryGetClassifyList() {
    return request(`/api/notoken/getClassify`);
}