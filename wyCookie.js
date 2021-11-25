/*
此文件为Node.js专用。其他用户请忽略
 */
//此处填写网易严选账号cookie。
let CookieWYs = [
  '',
]
// 判断环境变量里面是否有京东ck
if (process.env.WY_COOKIE) {
  if (process.env.WY_COOKIE.indexOf('&') > -1) {
    console.log(`您的cookie选择的是用&隔开\n`)
    CookieWYs = process.env.WY_COOKIE.split('&');
  } else if (process.env.WY_COOKIE.indexOf('\n') > -1) {
    console.log(`您的cookie选择的是用换行隔开\n`)
    CookieWYs = process.env.WY_COOKIE.split('\n');
  } else {
    CookieWYs = [process.env.WY_COOKIE];
  }
}

CookieWYs = [...new Set(CookieWYs.filter(item => !!item))]
console.log(`\n====================共有${CookieWYs.length}个网易严选账号Cookie=========\n`);
console.log(`==================脚本执行- 北京时间(UTC+8)：${new Date(new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000).toLocaleString()}=====================\n`)
if (process.env.WY_DEBUG && process.env.WY_DEBUG === 'false') console.log = () => {};
for (let i = 0; i < CookieWYs.length; i++) {
  const index = (i + 1 === 1) ? '' : (i + 1);
  exports['CookieWY' + index] = CookieWYs[i].trim();
}
