// 示例方法，没有实际意义
export function trim(str) {
  return str.trim();
}


export  function debounce(func, delay) {  // 参数为传入的事件处理函数和间隔时间
  var interval = delay || 1000;
  var timer = null;  // 闭包保存的 timer 变量，会常驻内存

  return function() { // 返回的匿名函数是事件的回调函数，在事件触发时执行，参数为 DOM 事件对象(event)
      let args = arguments;
      var context = this; // 事件的回调函数中，this 指向事件的绑定的 DOM 元素对象(HTMLElement)
      
      clearTimeout(timer); // 如果事件回调函数中存在定时器，则清空上次定时器，重新计时。如果间隔时间到后，处理函数自然就被执行了。
      timer = setTimeout(function() {
          func.apply(context, args); // 定时器时间到后，执行事件真正的处理函数 handler
          // 执行的事件处理函数（handler），需要把调用对象 this 和事件对象 传递过去，就像没被debounce处理过一样
      }, interval)
  }
}
