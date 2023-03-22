import {request} from '@umijs/max'

export function queryGetUserInfo(token:string) {
    return request(`/api/getUserInfo`);
}

export function queryGetCartList() {
    return request(`/api/getCartList`);
}

export function addToCart(params:any) {
    return request(`/api/addToCart`,{
        method:"POST",
        data:params
    });
}

export function updateCart(params:any) {
    return request(`/api/updateCart`,{
        method:"POST",
        data:params
    });
}

export function updateCartFlag(params:any){
    return request(`/api/updateCartFlag`,{
        method:"POST",
        data:params
    });
}


export function deleteCart(params:any){
    return request(`/api/deleteCart`,{
        method:"POST",
        data:params
    });
}

export function deleteCartAll(params:any){
    return request(`/api/deleteCartAll`,{
        method:"POST",
        data:params
    });
}

export function alipay(params:any){
    return request(`/api/pay`,{
        method:"POST",
        data:params
    });
}