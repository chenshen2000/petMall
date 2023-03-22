import {useState,useEffect} from 'react';


const useCart=()=>{
    let [cart,setCart]=useState<cartItem[]>([]);
    let [nowBuy,setNowBuy]=useState({});
    let [cartCount,setCartCount]=useState(0);
    useEffect(()=>{
        let count=0;
        cart.forEach((item:any)=>count=count+item.count);
        setCartCount(count);
    },[cart])
    return {
        cart,
        setCart,
        cartCount,
        nowBuy,
        setNowBuy
    }
}

export default useCart;