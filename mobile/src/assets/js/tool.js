
 function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
};

 function padLeftZero(str) {
   return ('00' + str).substr(str.length);
 }
 function is_Weixn(){
   var ua = navigator.userAgent.toLowerCase();                                                     
   if(ua.match(/MicroMessenger/i)=="micromessenger") {
     return true;
   } else {
     return false;
   }
 }
 function isMobile() {
   if(/android/i.test(navigator.userAgent)) {
  //document.write("This is Android'browser.");//这是Android平台下浏览器
     return true;
   }
   if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
  //document.write("This is iOS'browser.");//这是iOS平台下浏览器
     return true;
   }
   return false;
 }
 export{
   formatDate,
   is_Weixn,
   isMobile
 }
