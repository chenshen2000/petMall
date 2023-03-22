//全局共享数据示例
import {useState,useEffect} from 'react';

const useUser = () => {
  let [userInfo,setUInfo]=useState<any>({});
  //获取sesssionStorge数据
  let uInfo=myDecode('userInfo') || {};
  useEffect(()=>{
    setUInfo(uInfo);
  },[]);
  
  let setUserInfo=(obj:any)=>{
    setUInfo(obj);
    myEncode('userInfo',obj);
  }
  const resetData=()=>{
    setToken("");
    setUserInfo({});
  }
  return {
    userInfo,
    setUserInfo,
    resetData
  };
};

export const getToken=()=>{
   return myDecode('token');
}

export const setToken=(token:string)=>{
   myEncode('token',token);
}

export default useUser;





//加密
function myEncode(name:string,code:any){
  return sessionStorage.setItem(name,window.btoa(window.encodeURIComponent(JSON.stringify({code}))));
}

//解密
function myDecode(name:string){
  return JSON.parse(decodeURIComponent(window.atob(sessionStorage.getItem(name) || "JTdCJTdE"))).code;
}

