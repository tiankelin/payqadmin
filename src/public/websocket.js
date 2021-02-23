let Socket = ''
let setIntervalWesocketPush = null
let staffId=''
if(window.sessionStorage.userData){
	staffId=(JSON.parse(window.sessionStorage.userData)).staffId
}

/**
 * 建立websocket连接
 * @param {string} url ws地址
 */
export const createSocket = url => {
  Socket && Socket.close()
  if (!Socket) {
//  console.log('建立websocket连接')

    Socket = new WebSocket('wss://sys.payq-iot.com:8999/callCenter/'+staffId)
    Socket.onopen = onopenWS
    Socket.onmessage = onmessageWS
    Socket.onerror = onerrorWS
    Socket.onclose = oncloseWS
  } else {
//  console.log('websocket已连接')
  }
}

/**打开WS之后发送心跳 */
const onopenWS = () => {
  sendPing()
}

/**连接失败重连 */
const onerrorWS = () => {
  Socket.close()
  clearInterval(setIntervalWesocketPush)
//console.log('连接失败重连中')
  if (Socket.readyState !== 3) {
    Socket = null
    createSocket()
  }
}

/**WS数据接收统一处理 */
const onmessageWS = e => {
  window.dispatchEvent(new CustomEvent('onmessageWS', {
    detail: {
      data: e.data
    }
  }))
}

/**
 * 发送数据但连接未建立时进行处理等待重发
 * @param {any} message 需要发送的数据
 */
const connecting = message => {
  setTimeout(() => {
    if (Socket.readyState === 0) {
      connecting(message)
    } else {
      Socket.send(JSON.stringify(message))
    }
  }, 1000)
}

/**
 * 发送数据
 * @param {any} message 需要发送的数据
 */
export const sendWSPush = message => {
  if (Socket !== null && Socket.readyState === 3) {
    Socket.close()
    createSocket()
  } else if (Socket.readyState === 1) {
    Socket.send(JSON.stringify(message))    
  } else if (Socket.readyState === 0) {
    connecting(message)
  }
}

/**断开重连 */
const oncloseWS = () => {
  clearInterval(setIntervalWesocketPush)
//console.log('websocket已断开....正在尝试重连')
  if (Socket.readyState !== 2) {
    Socket = null
    createSocket()
  }
}
/**发送心跳
 * @param {number} time 心跳间隔毫秒 默认5000
 * @param {string} ping 心跳名称 默认字符串ping
 */
function getHandledValue(num){
		return num < 10 ? '0' + num : num
	};
  let timestamp =Date.parse(new Date());
 	let d = new Date()
 	let year = d.getFullYear()
 	let month = getHandledValue(d.getMonth() + 1)
 	let date = getHandledValue(d.getDate())
 	let hours =getHandledValue(d.getHours())
 	let minutes =getHandledValue(d.getMinutes())
 	let second =getHandledValue(d.getSeconds())
 	let resStr = ''
 	resStr = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + second


export const sendPing = (time = 30000, ping = 'ping') => {
  clearInterval(setIntervalWesocketPush)
  Socket.send(
    JSON.stringify({"from":"0","type":2,"payload":{"id":timestamp,"data":{"msg":"ping"}},"to":"0","time":resStr})
  )
  setIntervalWesocketPush = setInterval(() => {
    Socket.send(JSON.stringify({"from":"0","type":2,"payload":{"id":timestamp,"data":{"msg":"ping"}},"to":"0","time":resStr}))
  }, time)
}
