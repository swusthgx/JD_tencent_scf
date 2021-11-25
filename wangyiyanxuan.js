const $ = new Env('网易严选心愿城');
const notify = $.isNode() ? require('./sendNotify') : '';
const wyCookieNode = $.isNode() ? require('./wyCookie.js') : '';
let cookiesArr = [], cookie = '';

if ($.isNode()) {
	Object.keys(wyCookieNode).forEach((item) => {
		cookiesArr.push(wyCookieNode[item])
	})
	if (process.env.WY_DEBUG && process.env.WY_DEBUG === 'false')
		console.log = () => {};
}

url_tomorrowWater="https://act.you.163.com/act/napi/wish-tree/tomorrowWater?csrf_token=db4c7db9b0245e45227c64a11b29b049&__timestamp="+Date.now() //查看明天可领取的水滴
url_getTomorrowWater="https://act.you.163.com/act/napi/wish-tree/getTomorrowWater?csrf_token=db4c7db9b0245e45227c64a11b29b049&__timestamp="+Date.now() //领取昨日攒的水滴
url_getTaskList="https://act.you.163.com/act/napi/wish-tree/getTaskList?csrf_token=1176afb489d52bd72f460b6d90400430&__timestamp="+Date.now() //查看任务列表
url_receiveReward="https://act.you.163.com/act/napi/wish-tree/receiveReward?csrf_token=db4c7db9b0245e45227c64a11b29b049" //领取任务奖励{"rewardIds":["15247867"],"taskType":90}
url_finishTask="https://act.you.163.com/act/napi/wish-tree/finishTask?_="+Date.now() //做任务{"taskType":"20","taskId":"1"} post
url_getFinishedAwardList="https://act.you.163.com/act/napi/wish-tree/getFinishedAwardList?csrf_token=db4c7db9b0245e45227c64a11b29b049&__timestamp="+Date.now() //已完成任务信息get
url_getTopID="https://you.163.com/topic/v1/getTopicId.json?token=4JS7MUWKXFAT&_="+Date.now()


url_getSignInfo="https://m.you.163.com/act-attendance/attendance/index.json?csrf_token=db4c7db9b0245e45227c64a11b29b049&__timestamp="+Date.now()//获取签到信息
url_signTask="https://m.you.163.com/act-attendance/attendance/attendance.json?csrf_token=db4c7db9b0245e45227c64a11b29b049&__timestamp="+Date.now()//签到获得积分
url_lottery="https://m.you.163.com/act-attendance/attendance/lottery.json?csrf_token=ffee5313bb71f9c70d3f7c7fe1017dab&__timestamp="+Date.now()//积分签到抽奖

var taskScan10s="Scan10s"
var taskFindGP="FindGoodProducts"
var taskClick5P="Click5Products"
var receiveRewardScan10s="receiveRewardS10s"
var receiveRewardClick5P="receiveRewardClick"
var receiveRewardFindGP="receiveRewardFindGP"

var getSignInfo="getSignInfo"
var signTask="doSignTask"
var lottery="lottery"

!(async() => {
	if (!cookiesArr[0]) {
		$.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {
			"open-url": "https://bean.m.jd.com/bean/signIndex.action"
		});
		return;
	}

	for (a = 0; a < cookiesArr.length; a++) {
		console.log(`==============开始账号${a},共${cookiesArr.length}个账号================`)
        console.log(cookiesArr[a])
		if (cookiesArr[a]) {
			$.cookie = cookiesArr[a];
			//$.pt_pin = (cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
			//$.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);

			$.receiveSpecialCoin = 0;
            //$.myCookie = mycookieAsura;
	        $.myBuildingId = [];
			$.nickName = ''
			$.usrToken = '1176afb489d52bd72f460b6d90400430'
			$.addCoin = 0;
			$.wishValue = 0;
			$.goldCoinNum = 0;
			$.message = '';
            $.rewardId = 0;
	        //await finishTask()
            
			await getUserBuildingInfo() //获取建筑信息
			await coinTask() //收取金币


            while($.hasSpecialTaskCount == true){
                await sleep(2000)
                await receiveSpecialGoldCoin()
                console.log(`金币宝箱还有次数,等待100秒...`)
                await sleep(101000)
                await getUserBuildingInfo()
                
            }
			// if($.hasSpecialTaskCount == true){
            //     await receiveSpecialGoldCoin()
			// 	console.log(`打开金币宝箱,获得金币:${$.receiveSpecialCoin}`)
			// }else{
			// 	console.log(`金币宝箱冷却中或次数已用完`)
			// }
			
			
			
			//-----心愿树
			//await getThreeMealsWater() //获取3餐水滴
			//await sleep(3000)
			//await finishTask() //签到获取水滴
            //await getUserTreeInfo() //获取树苗信息
			//await wishGet(url_sign) 
            //await sleep(radomTimers())
            //await wishPost(url_finishTask,taskScan10s)
            //await sleep(radomTimers())
            //await wishPost(url_finishTask,taskFindGP)
            //await wishGet(url_getFinishedAwardList)
            //await getTaskList()
			//await watering() //浇水
			//await getUserTreeInfo()
			await sleep(radomTimers())
			//----------积分签到
			//await Sign(url_getSignInfo,getSignInfo)//获取积分签到信息
            //await Sign(url_signTask,signTask)//积分签到
            //await Sign(url_lottery,lottery)//积分签到抽奖
			//await sleep(radomTimers())
        }
	}

})()
.catch((e) => {
	$.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
})
.finally(() => {
	$.done();
})


var sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


async function rewardGoldCoin(links,buildingId) {//收取金币
  return new Promise(resolve => {
    //const body = {"linkId":signLinkId,"serviceName":"dayDaySignGetRedEnvelopeSignService","business":1};
	const body ={"buildingId":buildingId};//列一:3,4;列二:2,1;列三:6,7
    const options = {
      body: JSON.stringify(body),
	  url:links,
      headers: {
        'Cookie': $.cookie,
        "Host": "act.you.163.com",
        'Origin': 'https://act.you.163.com',
        "Content-Type": "application/json",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Connection": "keep-alive",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; ELS-AN00 Build/HUAWEIELS-AN00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/88.0.4324.93 Mobile Safari/537.36 yanxuan/6.7.9 device-id/3228a1a8086bea61a303e7f6305fcc1c app-chan-id/aos_market_huawei trustId/android_trustid_8821a74f57ec4f08bf2666e6bc82a51a",
        "Accept-Language": "zh-CN,zh;q=0.9,en-CN;q=0.8,en-US;q=0.7,en;q=0.6",
        'Referer': 'https://act.you.163.com/act/pub/s43ynixZzW.html',
        "Accept-Encoding": "gzip, deflate",
		"Content-Length": 16,
		"X-Requested-With": "com.netease.yanxuan",
		"Sec-Fetch-Site": "same-origin",
		"Sec-Fetch-Mode": "cors",
		"Sec-Fetch-Dest": "empty",
		
      }
    }
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
		  //console.log(resp)
		  //console.log(data)
          if (safeGet(data)) {
			if(buildingId){
				data = JSON.parse(data);
				//console.log(`获得${data.data.userAccount.nickName}`);
				$.message +=`建筑${buildingId}收获金币:${data.data.addCoin}\n`
				$.addCoin += parseInt(data.data.addCoin);
				$.wishValue = parseInt(data.data.userAccount.wishValue);
				$.goldCoinNum = parseInt(data.data.userAccount.goldCoinNum);
				//console.log(`建筑${buildingId}收获金币:${data.data.addCoin}`);
			}
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

function getUserBuildingInfo() {//建筑信息
	return new Promise(async resolve => {
		url="https://act.you.163.com/act/napi/fairyland/getUserBuildingInfo?csrf_token="+$.usrToken+"&__timestamp="+Date.now()
		const options = {
			url: url,
			headers: {
			  'Cookie': $.cookie,
			  "Host": "act.you.163.com",
			  'Origin': 'https://act.you.163.com',
			  "Content-Type": "application/json",
			  "Accept": "application/json, text/javascript, */*; q=0.01",
			  "Connection": "keep-alive",
			  "User-Agent": "Mozilla/5.0 (Linux; Android 10; ELS-AN00 Build/HUAWEIELS-AN00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/88.0.4324.93 Mobile Safari/537.36 yanxuan/6.7.9 device-id/3228a1a8086bea61a303e7f6305fcc1c app-chan-id/aos_market_huawei trustId/android_trustid_8821a74f57ec4f08bf2666e6bc82a51a",
			  "Accept-Language": "zh-CN,zh;q=0.9,en-CN;q=0.8,en-US;q=0.7,en;q=0.6",
			  'Referer': 'https://act.you.163.com/act/pub/0lgg78TZlisC.html',
			  "Accept-Encoding": "gzip, deflate",
			}
		}
		$.get(options, (err, resp, data) => {
			try {
				if (err) {
					$.logErr(err)
				} else {
					if (data) {
						data = JSON.parse(data);
						if (data.code != 200) {
							console.log(`数据返回异常`)
							return;
						}
						//r=JSON.parse(resp.body);
						//console.log(data.data.userBuildingInfo)
						$.hasSpecialTaskCount = data.data.hasSpecialTaskCount
						$.nickName = data.data.userAccount.nickName
						//console.log(data)
						console.log(`总建筑数量:${data.data.userBuildingInfo.length}\n总生产速度:${data.data.goldCoinProduceSpeed}\n可以开宝箱:${data.data.hasSpecialTaskCount}`)
						for (i = 0; i < data.data.userBuildingInfo.length; i++) {
							$.myBuildingId.push(data.data.userBuildingInfo[i].buildingId)
						}
						//console.log(data.code)
					} else {
						$.log('服务器返回空数据,将无法获取信息');
					}
				}
			} catch (e) {
				$.logErr(e)
			}
			finally {
				resolve(data);
			}
		})
	})
}

function safeGet(data) {
  try {
    if (typeof JSON.parse(data) == "object") {
      return true;
    }
  } catch (e) {
    console.log(e);
    console.log(`服务器访问数据为空，请检查自身设备网络情况`);
    return false;
  }
}

async function coinTask() {
  try {
	csrf_token_Asura="8e2d0eae4912604b722fb090aad788b9";
	url_receiveGold='https://act.you.163.com/act/napi/fairyland/receiveGoldCoin?csrf_token='+$.usrToken;
	url_saveUserRecord='https://act.you.163.com/act/napi/fairyland/saveUserRecord?csrf_token='+$.usrToken;
	console.log(`======== 账号${$.nickName}开始收取金币 ============`)
	for (let i = 0; i < $.myBuildingId.length; ++i) {
      await rewardGoldCoin(url_receiveGold,$.myBuildingId[i])
	  await sleep(2000)
      await rewardGoldCoin(url_saveUserRecord)
	  delay = radomTimers()
	  console.log(`建筑${$.myBuildingId[i]}收取完成,延迟${delay/1000}秒`)
      await sleep(delay)
    }
	$.message +=`-----------------------\n`
	
	if($.addCoin<1000000){
		$.message +=`本次运行获得金币:${Math.floor($.addCoin/1000)}K\n`
		//console.log(addCoin/)
	}else{
		$.message +=`本次运行获得金币:${Math.floor($.addCoin/1000000 * 100)/100}M\n`
	}
	if($.goldCoinNum<1000000){
		$.message +=`当前金币:${Math.floor($.goldCoinNum/1000)}K\n`
		//console.log(addCoin/)
	}else{
		$.message +=`当前金币:${Math.floor($.goldCoinNum/1000000 * 10)/10}M\n`
	}
	$.message +=`当前心愿值:${$.wishValue/1000}K\n`
	//console.log(addCoin)
	console.log($.message)
	if(new Date().getHours() >21 && new Date().getHours() <22){
		await notify.sendNotify($.name,$.message);
	}
	
  } catch (e) {
    $.logErr(e)
  }
}

function Sign(url,taskName) {//每日积分签到
	return new Promise(async resolve => {
		const options = {
            url:url,
			headers: {
			  'Cookie': $.cookie,
			  "Host": "m.you.163.com",
			  'Origin': 'https://act.you.163.com',
			  "Content-Type": "application/json",
              "Accept": "application/json, text/javascript, */*; q=0.01",
			  "Connection": "keep-alive",
			  "User-Agent": "Mozilla/5.0 (Linux; Android 10; ELS-AN00 Build/HUAWEIELS-AN00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/88.0.4324.93 Mobile Safari/537.36 yanxuan/6.7.9 device-id/3228a1a8086bea61a303e7f6305fcc1c app-chan-id/aos_market_huawei trustId/android_trustid_8821a74f57ec4f08bf2666e6bc82a51a",
			  "Accept-Language": "zh-CN,zh;q=0.9,en-CN;q=0.8,en-US;q=0.7,en;q=0.6",
              'Referer': 'https://m.you.163.com/sign-challenge/h5/index?appConfig=1_1_1',
			  "Accept-Encoding": "gzip, deflate",
			//   "X-Requested-With": "XMLHttpRequest",
			//   "Sec-Fetch-Site": "same-origin",
			//   "Sec-Fetch-Mode": "cors",
			//   "Sec-Fetch-Dest": "empty",
			}
		}
		$.get(options, (err, resp, data) => {
			try {
				if (err) {
					$.logErr(err)
				} else {
					if (data) {
						data = JSON.parse(data);
                        resp = JSON.parse(resp.body);
						console.log(data)
						console.log(resp)
                        switch(taskName){
                            case getSignInfo:
                                if(data.code == 200 ){
                                    if(data.data.signTaskData.goodsSceneBo != null){
                                        console.log(`连续签到免费拿商品信息:\n商品名称: {${data.data.signTaskData.goodsSceneBo.name}},原价:${data.data.signTaskData.goodsSceneBo.price}元`)
                                        console.log(`需要连续签到: ${data.data.signTaskData.totalDay}天, 已连续签到: ${data.data.signTaskData.haveSignInDay}天`)
                                    }else{
                                        console.log(`当前没有连续签到获得商品任务.`)
                                    }
                                    if(!data.data.signTaskData.signedInToday){
                                        console.log(`今天还没签到,去签到`)
                                        sleep(2000)
                                        Sign(url_signTask,signTask)
                                    }
                                    //console.log(data.data.signTaskData.attendanceInfoBoList)
                                }else{
                                    console.log(`错误信息:${data.msg}`)
                                }
                                break;
                            case signTask:
                                if(data.code == 217 ){
                                    console.log(`签到失败,已签过,错误信息:${data.msg}`)
                                }else if(data.code == 200 ){
                                    console.log(`签到成功,已连续签到${data.data.haveSignInDay}天。\n签到获得${data.data.score}积分,连续签到获得${data.data.continuousScore},总共获得${data.data.totalScore}积分。\n明日签到积分${data.data.tomorrowPoint}`)
                                    if(data.data.lotteryTimes == 1){
                                        console.log(`每周1次抽奖机会,周二刷新。当前可抽奖次数${data.data.lotteryTimes},去抽奖`)
                                        sleep(2000)
                                        Sign(url_lottery,lottery)
                                    }
                                }
                                break;
                            case lottery:
                                if(data.code == 223 ){
                                    console.log(`当前无抽奖次数,错误信息:${data.msg}`)
                                }
                                break;
                        } 


					} else {
						$.log('服务器返回空数据,将无法获取信息');
					}
				}
			} catch (e) {
				$.logErr(e)
			}
			finally {
				resolve();
			}
		})
	})
}

async function receiveSpecialGoldCoin() {//打开金币宝箱
  return new Promise(resolve => {
    //const body = {"linkId":signLinkId,"serviceName":"dayDaySignGetRedEnvelopeSignService","business":1};
    const options = {
	  url:"https://act.you.163.com/act/napi/fairyland/receiveSpecialGoldCoin?csrf_token=db4c7db9b0245e45227c64a11b29b049",
      headers: {
        'Cookie': $.cookie,
        "Host": "act.you.163.com",
        'Origin': 'https://act.you.163.com',
        "Content-Type": "application/json",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Connection": "keep-alive",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; ELS-AN00 Build/HUAWEIELS-AN00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/88.0.4324.93 Mobile Safari/537.36 yanxuan/6.7.9 device-id/3228a1a8086bea61a303e7f6305fcc1c app-chan-id/aos_market_huawei trustId/android_trustid_8821a74f57ec4f08bf2666e6bc82a51a",
        "Accept-Language": "zh-CN,zh;q=0.9,en-CN;q=0.8,en-US;q=0.7,en;q=0.6",
        'Referer': 'https://act.you.163.com/act/pub/0lgg78TZlisC.html',
        "Accept-Encoding": "gzip, deflate",
      }
    }
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
		  data = JSON.parse(data);
		  //console.log(resp)
		  console.log(data)
          if (data.code == 811) {
			console.log(`叼毛手速太快了,冷却时间100秒`)
			return
		  }
          if (data.code == 411) {
			console.log(`叼毛账号黑了,收手吧`)
			return
		  }
          if (data.code == 200) {
            $.receiveSpecialCoin=data.data.addCoin;
            console.log(`打开金币宝箱,获得金币:${$.receiveSpecialCoin}`)
          }
          
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

//-------------------------------------------------------心愿树--------------------
async function watering() {//心愿树浇水
  return new Promise(resolve => {
    //const body = {"linkId":signLinkId,"serviceName":"dayDaySignGetRedEnvelopeSignService","business":1};
	url="https://act.you.163.com/act/napi/wish-tree/waterFertilization?csrf_token=1176afb489d52bd72f460b6d90400430"
	const body ={"type":1,"waste":false};
    const options = {
      body: JSON.stringify(body),
	  url:url,
      headers: {
        'Cookie': $.cookie,
        "Host": "act.you.163.com",
        'Origin': 'https://act.you.163.com',
        "Content-Type": "application/json",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Connection": "keep-alive",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; ELS-AN00 Build/HUAWEIELS-AN00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/88.0.4324.93 Mobile Safari/537.36 yanxuan/6.7.9 device-id/3228a1a8086bea61a303e7f6305fcc1c app-chan-id/aos_market_huawei trustId/android_trustid_8821a74f57ec4f08bf2666e6bc82a51a",
        "Accept-Language": "zh-CN,zh;q=0.9,en-CN;q=0.8,en-US;q=0.7,en;q=0.6",
        'Referer': 'https://act.you.163.com/act/pub/0lgg78TZlisC.html',
        "Accept-Encoding": "gzip, deflate",
		"Content-Length": 24,
		"X-Requested-With": "com.netease.yanxuan",
		"Sec-Fetch-Site": "same-origin",
		"Sec-Fetch-Mode": "cors",
		"Sec-Fetch-Dest": "empty",
		
      }
    }
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
		  //console.log(resp)
          data = JSON.parse(data);
		  console.log(data)
          console.log(`心愿树等级${data.data.treeLevel}, 浇水成功\n剩余水滴${data.data.kettleWater}g, 明天可领取水滴${data.data.tomorrowWaterValue}g, 当前营养值${data.data.nutritionValue}`)
          if(data.data.tomorrowWaterValue < 80 ){
              await watering()
              await sleep(radomTimers())
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

function getUserTreeInfo() {//心愿树信息
	return new Promise(async resolve => {
		url="https://act.you.163.com/act/napi/wish-tree/getUserTreeInfo?csrf_token=1176afb489d52bd72f460b6d90400430&__timestamp="+Date.now()
		const options = {
			url: url,
			headers: {
			  'Cookie': $.cookie,
			  "Host": "act.you.163.com",
			  'Origin': 'https://act.you.163.com',
			  "Content-Type": "application/json",
			  "Accept": "application/json, text/javascript, */*; q=0.01",
			  "Connection": "keep-alive",
			  "User-Agent": "Mozilla/5.0 (Linux; Android 10; ELS-AN00 Build/HUAWEIELS-AN00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/88.0.4324.93 Mobile Safari/537.36 yanxuan/6.7.9 device-id/3228a1a8086bea61a303e7f6305fcc1c app-chan-id/aos_market_huawei trustId/android_trustid_8821a74f57ec4f08bf2666e6bc82a51a",
			  "Accept-Language": "zh-CN,zh;q=0.9,en-CN;q=0.8,en-US;q=0.7,en;q=0.6",
			  'Referer': 'https://act.you.163.com/act/pub/0lgg78TZlisC.html',
			  "Accept-Encoding": "gzip, deflate",
			}
		}
		$.get(options, (err, resp, data) => {
			try {
				if (err) {
					$.logErr(err)
				} else {
					if (data) {
						data = JSON.parse(data);
						console.log(data)
						//console.log(resp)
						//console.log(data.code)
						if (data.code == 200) {
							console.log(200111)
							$.isLogin = false; //cookie过期
							return;
						}

					} else {
						$.log('服务器返回空数据,将无法获取信息');
					}
				}
			} catch (e) {
				$.logErr(e)
			}
			finally {
				resolve();
			}
		})
	})
}

function getTaskList() {//获取任务列表
	return new Promise(async resolve => {
		url="https://act.you.163.com/act/napi/wish-tree/getTaskList?csrf_token=1176afb489d52bd72f460b6d90400430&__timestamp="+Date.now()
		const options = {
			url: url,
			headers: {
			  'Cookie': $.cookie,
			  "Host": "act.you.163.com",
			  'Origin': 'https://act.you.163.com',
			  "Content-Type": "application/json",
			  "Accept": "application/json, text/javascript, */*; q=0.01",
			  "Connection": "keep-alive",
			  "User-Agent": "Mozilla/5.0 (Linux; Android 10; ELS-AN00 Build/HUAWEIELS-AN00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/88.0.4324.93 Mobile Safari/537.36 yanxuan/6.7.9 device-id/3228a1a8086bea61a303e7f6305fcc1c app-chan-id/aos_market_huawei trustId/android_trustid_8821a74f57ec4f08bf2666e6bc82a51a",
			  "Accept-Language": "zh-CN,zh;q=0.9,en-CN;q=0.8,en-US;q=0.7,en;q=0.6",
			  'Referer': 'https://act.you.163.com/act/pub/0lgg78TZlisC.html',
			  "Accept-Encoding": "gzip, deflate",
			}
		}
		$.get(options, (err, resp, data) => {
			try {
				if (err) {
					$.logErr(err)
				} else {
					if (data) {
						data = JSON.parse(data);
						console.log(data)
						//console.log(resp)
						console.log(data.code)
						if (data.code == 200) {
							console.log(200111)
							$.isLogin = false; //cookie过期
							return;
						}

					} else {
						$.log('服务器返回空数据,将无法获取信息');
					}
				}
			} catch (e) {
				$.logErr(e)
			}
			finally {
				resolve();
			}
		})
	})
}

function getThreeMealsWater() {//获取3餐水滴,7-9,12-14,18-20
	return new Promise(async resolve => {
		url="https://act.you.163.com/act/napi/wish-tree/getThreeMealsWater?csrf_token=1176afb489d52bd72f460b6d90400430&taskId&taskType&__timestamp="+Date.now()
		const options = {
			url: url,
			headers: {
			  'Cookie': $.cookie,
			  "Host": "act.you.163.com",
			  'Origin': 'https://act.you.163.com',
			  "Content-Type": "application/json",
			  "Accept": "application/json, text/javascript, */*; q=0.01",
			  "Connection": "keep-alive",
			  "User-Agent": "Mozilla/5.0 (Linux; Android 10; ELS-AN00 Build/HUAWEIELS-AN00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/88.0.4324.93 Mobile Safari/537.36 yanxuan/6.7.9 device-id/3228a1a8086bea61a303e7f6305fcc1c app-chan-id/aos_market_huawei trustId/android_trustid_8821a74f57ec4f08bf2666e6bc82a51a",
			  "Accept-Language": "zh-CN,zh;q=0.9,en-CN;q=0.8,en-US;q=0.7,en;q=0.6",
			  'Referer': 'https://act.you.163.com/act/pub/0lgg78TZlisC.html',
			  "Accept-Encoding": "gzip, deflate",
			}
		}
		$.get(options, (err, resp, data) => {
			try {
				if (err) {
					$.logErr(err)
				} else {
					if (data) {
						data = JSON.parse(data);
						console.log(data)
						//console.log(resp)
						if(data.code == 400){
							console.log(data.msg)
						}
						

						if (data.code == 200) {
							console.log(`3餐水滴领取成功,获得水滴${data.data.rewardThreeMealsWater}g, 当前共有水滴${data.data.kettleWater}`)
							//cookie过期
							//return;
						}

					} else {
						$.log('服务器返回空数据,将无法获取信息');
					}
				}
			} catch (e) {
				$.logErr(e)
			}
			finally {
				resolve();
			}
		})
	})
}

async function finishTask() {//每日签到获取水滴
  return new Promise(resolve => {
	const body ={"taskType":10,"taskId":"0"};//每日签到获取水滴
	//const body ={"taskType":90,"taskId":"6"}; //
    const options = {
      body: JSON.stringify(body),
	  url:"https://act.you.163.com/act/napi/wish-tree/finishTask?csrf_token=1176afb489d52bd72f460b6d90400430",
      headers: {
        'Cookie': $.cookie,
        "Host": "act.you.163.com",
        'Origin': 'https://act.you.163.com',
        "Content-Type": "application/json",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Connection": "keep-alive",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; ELS-AN00 Build/HUAWEIELS-AN00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/88.0.4324.93 Mobile Safari/537.36 yanxuan/6.7.9 device-id/3228a1a8086bea61a303e7f6305fcc1c app-chan-id/aos_market_huawei trustId/android_trustid_8821a74f57ec4f08bf2666e6bc82a51a",
        "Accept-Language": "zh-CN,zh;q=0.9,en-CN;q=0.8,en-US;q=0.7,en;q=0.6",
        'Referer': 'https://act.you.163.com/act/pub/0lgg78TZlisC.html',
        "Accept-Encoding": "gzip, deflate",
      }
    }
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
		  data = JSON.parse(data);
		  //console.log(resp)
		  console.log(data)
          if (data.code == 402) {
			console.log(`今天已签到`)
			return
		  }
		  console.log(`签到成功,获得水滴${data.data.waterValue}`)
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}


async function wishGet(url) {//获取心愿树任务是否可做 ,优化
	return new Promise(async resolve => {
		//url_getWishCityStatus="https://act.you.163.com/act/napi/wish-tree/getWishCityStatus?csrf_token=db4c7db9b0245e45227c64a11b29b049&__timestamp="+Date.now() //获取心愿树任务是否可做
		//url =url_getTomorrowWater
		const options = {
			url: url,
			headers: {
			  'Cookie': $.cookie,
			  "Host": "act.you.163.com",
			  'Origin': 'https://act.you.163.com',
			  "Content-Type": "application/json",
			  "Accept": "application/json, text/javascript, */*; q=0.01",
			  "Connection": "keep-alive",
			  "User-Agent": "Mozilla/5.0 (Linux; Android 10; ELS-AN00 Build/HUAWEIELS-AN00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/88.0.4324.93 Mobile Safari/537.36 yanxuan/6.7.9 device-id/3228a1a8086bea61a303e7f6305fcc1c app-chan-id/aos_market_huawei trustId/android_trustid_8821a74f57ec4f08bf2666e6bc82a51a",
			  "Accept-Language": "zh-CN,zh;q=0.9,en-CN;q=0.8,en-US;q=0.7,en;q=0.6",
			  'Referer': 'https://act.you.163.com/act/pub/0lgg78TZlisC.html',
			  "Accept-Encoding": "gzip, deflate",
			}
		}
		$.get(options, (err, resp, data) => {
			try {
				if (err) {
					$.logErr(err)
				} else {
					if (data) {
						data = JSON.parse(data);
						console.log(data)
						//console.log(resp)
						if(data.code == 400){
							console.log(data.msg)
							return resolve(data);
						}
						
						if (data.code == 200) {
							//console.log(`code == 200`)
							 //cookie过期
							
						}
						//if( !data.data.entered ){
						//	console.log(`进入心愿城任务还未做`)
						//}
						switch (url) {
							case url_tomorrowWater:
                                if(data.data.status){
                                    console.log(`今日可领取水滴${data.data.tomorrowWaterValue}g`)
                                    wishGet(url_getTomorrowWater)
                                }else{
                                    console.log(`今日水滴已领取过,明日可领取${data.data.tomorrowWaterValue}g`)
                                }
								break;
							case url_getTomorrowWater:
                                if(data.code == 1005){
                                    console.log(`今日水滴已领取过,${data.msg}`)
                                    break;
                                }
                                console.log(`领取成功,当前共有水滴${data.data.kettleWater}g`)
							    break;
                            case url_getFinishedAwardList:
                                console.log(data.data.length)
                                for (a = 0; a < data.data.length; a++) {
                                    if(data.data[a].taskId == 1){
                                        $.rewardId=data.data[a].id
                                        console.log(`领取浏览活动页面10秒奖励`)
                                        wishPost(url_receiveReward,receiveRewardScan10s)
                                    }

                                    if(data.data[a].taskId == 6){
                                        console.log(`领取发现严选好物奖励`)
                                        $.rewardId=data.data[a].id
                                        wishPost(url_receiveReward,receiveRewardFindGP)
                                    }
                                    if(data.data[a].taskId == 4){
                                        console.log(`领取点击5个商品奖励`)
                                        $.rewardId=data.data[a].id
                                        wishPost(url_receiveReward,receiveRewardClick5P)
                                    }
                                }
                                break;
							default:
							    break;
						}

					} else {
						$.log('服务器返回空数据,将无法获取信息');
					}
				}
			} catch (e) {
				$.logErr(e)
			}
			finally {
				resolve(data);
			}
		})
	})
}

async function wishPost(url,taskName) {//
    return new Promise(resolve => {
      //const body ={"taskType":10,"taskId":"0"};//每日签到获取水滴
      //const body ={"rewardIds":["15268855"],"taskType":20}; //领取浏览活动页面10秒任务水滴
      //const body ={"taskType":"20","taskId":"1"}; //做浏览活动页面10秒任务
      //const body ={"taskType":"20","taskId":"1"}; //做浏览活动页面10秒任务
      body='';
      switch(taskName){
          case taskScan10s:
              body ={"taskType":"20","taskId":"1"};
              console.log(`开始做任务浏览活动页面10秒`)
              break;
          case taskFindGP:
              body ={"taskType":"90","taskId":"6"};
              console.log(`开始做任务发现严选好物`)
              break;
          case taskClick5P:
              body ={"taskType":"70","taskId":"4"};
              console.log(`开始做任务点击5个商品`)
              break;
          case receiveRewardScan10s:
              body ={"rewardIds":[$.rewardId],"taskType":20}
              console.log(body)
              break;
          case receiveRewardFindGP:
              body ={"rewardIds":[$.rewardId],"taskType":90}
              break;
          case receiveRewardClick5P:
              body ={"rewardIds":[$.rewardId],"taskType":70}
              break;

          default:
              break;

      }



      const options = {
        body: JSON.stringify(body),
        url:url,
        headers: {
          'Cookie': $.cookie,
          "Host": "act.you.163.com",
          'Origin': 'https://act.you.163.com',
          "Content-Type": "application/json",
          "Accept": "application/json, text/javascript, */*; q=0.01",
          "Connection": "keep-alive",
          "User-Agent": "Mozilla/5.0 (Linux; Android 10; ELS-AN00 Build/HUAWEIELS-AN00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/88.0.4324.93 Mobile Safari/537.36 yanxuan/6.7.9 device-id/3228a1a8086bea61a303e7f6305fcc1c app-chan-id/aos_market_huawei trustId/android_trustid_8821a74f57ec4f08bf2666e6bc82a51a",
          "Accept-Language": "zh-CN,zh;q=0.9,en-CN;q=0.8,en-US;q=0.7,en;q=0.6",
          'Referer': 'https://act.you.163.com/act/pub/0lgg78TZlisC.html',
          "Accept-Encoding": "gzip, deflate",
        }
      }
      $.post(options, async (err, resp, data) => {
        try {
          if (err) {
            console.log(`${JSON.stringify(err)}`)
            console.log(`${$.name} API请求失败，请检查网路重试`)
          } else {
            data = JSON.parse(data);
            //console.log(resp)
            console.log(data)
            if (data.code == 402 | data.code == 901 |data.code == 404) {
              console.log(`领取失败或任务已完成,${data.msg}`)
              return resolve(data);
            }

            switch(taskName){
                case taskScan10s:
                    $.rewardId = data.data.rewardId
                    if($.rewardId > 0){
                        console.log(`任务完成,去领取奖励`)
                        await sleep(radomTimers())
                        wishPost(url_receiveReward,receiveRewardScan10s)
                        await sleep(radomTimers())
                        if(data.data.dayTimes < 3){
                            wishPost(url_finishTask,taskScan10s)
                        }
                    }
                    
                    break;
                case taskFindGP:

                    //console.log(`做任务${taskFindGP},${body}`)
                    break;
                case taskClick5P:
                    $.rewardId = data.data.rewardId
                    //console.log(`做任务${taskClick5P},${body}`)
                    break;
                case receiveRewardScan10s:
                    console.log(`领取奖励成功,获得水滴${data.data.rewardWaterValue}g`)
                    //console.log(`领取奖励成功,完成次数${data.data.reward}`)
                    break;
                case receiveRewardFindGP:
                    console.log(`领取奖励成功,获得水滴${data.data.rewardWaterValue}g`)
                    break;
                case receiveRewardClick5P:
                    console.log(`领取奖励成功,获得水滴${data.data.rewardWaterValue}g`)
                    break;
                default:
                    break;
      
            }
            //console.log(`签到成功,获得水滴${data.data.waterValue}`)
          }
        } catch (e) {
          $.logErr(e, resp)
        } finally {
          resolve(data);
        }
      })
    })
  }


//--------------------------------------------心愿树-----------------------------------------------------------------------------
function radomTimers() {
  return Math.floor(Math.random() * (10000 - 5000) + 2000);
}

//console.log(Math.random()* 10)
//console.log(Math.floor((Math.random() * 200))+100)
//coinTask()
//Sign()
//watering("https://act.you.163.com/act/napi/wish-tree/waterFertilization?csrf_token=1176afb489d52bd72f460b6d90400430")
//getUserTreeInfo()
//getTaskList()
//getThreeMealsWater(mycookie4195)
//finishTask(mycookie4195)
//getUserBuildingInfo(mycookie1553,myTokenAsura)
//receiveSpecialGoldCoin(mycookie4195)
//main()













// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`??${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============??系统通知??=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`??${this.name}, 错误!`,t.stack):this.log("",`??${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`??${this.name}, 结束! ?? ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
