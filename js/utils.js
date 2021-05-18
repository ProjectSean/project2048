class Tool {
  constructor(waitingTime) {
    this.waitingTime = waitingTime
  }
  // 生成min到max之间的随机整数
  randomNum(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  // 生成a*b棋盘所有结果
  allResults(rows, columns) {
    let arr = [];
    for (let i = 0; i < rows; i++) {
      let arr1 = [];
      for (let j = 0; j < columns; j++) {
        arr1.push(i * 4 + j)
      }
      arr.push(arr1);
    }
    return arr
  }
  // 生成一个在指定数组中的数, 取得方位
  getRandompos(arr) {
    let that = this;
    return arr[that.randomNum(0, arr.length)];
  }
  // 封装的动画函数，处理水平方向平移，只能作用于定位的盒子
  hScroll(obj, target, callback) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {
      let step = (target - parseInt(obj.style.left)) / 10;
      step = step > 0 ? Math.ceil(step) : Math.floor(step);
      if (parseInt(obj.style.left) == target) {
        clearInterval(obj.timer);
      }
      callback && callback();
      obj.style.left = parseInt(obj.style.left) + step + '%';
    }, 15)
  }
  // 封装的动画函数，处理垂直方向平移，只能作用于定位的盒子
  vScroll(obj, target, callback) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {
      let step = (target - parseInt(obj.style.top)) / 10;
      step = step > 0 ? Math.ceil(step) : Math.floor(step);
      if (parseInt(obj.style.top) == target) {
        clearInterval(obj.timer);
      }
      callback && callback();
      obj.style.top = parseInt(obj.style.top) + step + '%';
    }, 15)
  }
  // 封装一个节流函数
  throttle(func, delay) {
    let pre = 0
    return function (...args) {
      let context = this
      let now = new Date()
      if (now - pre > delay) {
        func.call(context, ...args)
        pre = now
      }
    }
  }
}
