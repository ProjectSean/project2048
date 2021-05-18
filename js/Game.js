// import Tool from './utils.js'
// import Card from './cards.js'
var that
class Game {
    constructor() {
        that = this;
        this.cards = new Card();
        this.tool = new Tool(400);
        this.gamestatus = 1;
        this.score = document.querySelectorAll('.score');
        this.box = document.querySelector('main');
        this.tips = document.querySelector('.tips')
        this.start = document.querySelector('.start')
        this.restart = document.querySelectorAll('.restart')
        this.isslide = false;
        this.ismerge = false;
        this.startX = 0
        this.startY = 0
        this.endX = 0
        this.endY = 0
        this.distance = 30
        this.init();
    }
    // 初始化
    init() {
        this.start.addEventListener('click', function () {
            that.start.disabled = true
            that.generateOne(2);
            that.generateOne(2);
            for (let i of that.restart) {
                i.disabled = false
                i.addEventListener('click', that.reStart.bind(that))
            }
            document.addEventListener('keydown', that.tool.throttle(function (e) {
                switch (e.keyCode) {
                    case 37:
                        that.moveLeft()
                        break
                    case 38:
                        that.moveUp()
                        break
                    case 39:
                        that.moveRight()
                        break
                    case 40:
                        that.moveDown()
                        break;
                }
            }, that.tool.waitingTime))
            document.addEventListener("touchstart", function (event) {
                that.startX = event.touches[0].clientX;
                that.startY = event.touches[0].clientY;
            })
            document.addEventListener("touchmove", function (event) {
                event.preventDefault();
                that.endX = event.changedTouches[0].clientX;
                that.endY = event.changedTouches[0].clientY;
            })
            document.addEventListener("touchend", function (event) {
                var x = that.endX - that.startX;
                var y = that.endY - that.startY;
                if (Math.abs(x) > Math.abs(y) && that.endX > that.startX && Math.abs(x) > that.distance) {
                    that.moveRight()
                }
                if (Math.abs(x) > Math.abs(y) && that.endX < that.startX && Math.abs(x) > that.distance) {
                    that.moveLeft()
                }
                if (Math.abs(x) < Math.abs(y) && that.endY < that.startY && Math.abs(y) > that.distance) {
                    that.moveUp()
                }
                if (Math.abs(x) < Math.abs(y) && that.endY > that.startY && Math.abs(y) > that.distance) {
                    that.moveDown()
                }
            })
        })
    }
    // 随机生成一个方块
    generateOne(value) {
        this.cards.updateCard();
        let empty = this.getEmpty()
        let position = this.tool.getRandompos(empty);

        let r = position[0];
        let c = position[1];

        let cell = document.createElement('div');
        cell.className = 'cell';
        cell.id = `r${r}c${c}`;

        cell.style.left = 1 / 4 * c * 100 + '%';
        cell.style.top = r * 25 + '%';
        cell.innerHTML = value;
        this.box.appendChild(cell);
        this.cards.setColor(r, c, value);
    }
    // 延迟生成一个卡片，用于等待移动动画结束
    generateOnelater() {
        if (this.isslide) {
            let timer;
            timer && clearTimeout(timer)
            timer = setTimeout(() => {
                this.generateOne(2);
            }, this.tool.waitingTime)
        }
        this.isslide = false
    }
    // 获取棋盘上的空余位置
    getEmpty() {
        let arr = [];
        for (let i = 0; i < this.cards.cards.length; i++) {
            for (let j = 0; j < this.cards.cards[i].length; j++) {
                if (this.cards.cards[i][j] == undefined) {
                    let arr1 = [];
                    arr1.push(i);
                    arr1.push(j);
                    arr.push(arr1);
                }
            }
        }
        return arr
    }
    // 判断棋盘上是是否还要相邻方块可以融合了
    isMerge() {
        let arr = this.cards.cards.flat(Infinity).map((item) => {
            if (item !== undefined) return +item.innerHTML
        });
        arr.splice(4, 0, undefined)
        arr.splice(9, 0, undefined)
        arr.splice(14, 0, undefined)
        console.log(arr);
        for (let i = 0; i < arr.length; i++) {
            if ((arr[i] === arr[i - 1] || arr[i] === arr[i + 1] || arr[i] === arr[i - 5] || arr[i] === arr[i + 5]) && arr[i] !== undefined) {
                this.ismerge = true
                return
            }
        }
        this.ismerge = false
    }
    // 判断游戏是否无法进行了，条件为棋盘充满且没有方块可以消除
    isgameOver() {
        let flag = this.cards.cards.flat(Infinity).every(item => {
            return item !== undefined
        })
        if (flag) {
            this.isMerge()
            this.gamestatus = this.ismerge ? 1 : 0
            console.log(this.gamestatus);
            this.gamestatus === 0 && this.gameOver()
        }
    }
    // 游戏结束
    gameOver() {
        this.tips.style.display = 'block'
    }
    // 获取分数
    getScore(score) {
        for (let i of this.score) {
            i.innerHTML = +i.innerHTML + score
        }

    }
    // 重新开始
    reStart() {
        this.cards.reloadCard()
        this.box.innerHTML = ''
        this.tips.style.display = 'none'
        for (let i of this.score) {
            i.innerHTML = 0
        }
        for (let i of this.restart) {
            i.disabled = true
        }
        that.start.disabled = false
    }
    // 处理左移动
    moveLeft() {
        for (let i = 0; i < 4; i++) {
            this.moveLeftinRow(i);
        }
        this.generateOnelater()
        this.isgameOver()

    }
    // 获取每个方块的右边存在的方块，有就返回其列坐标，无则返回-1
    getnext(r, c) {
        for (let i = c + 1; i < 4; i++) {
            if (this.cards.cards[r][i] !== undefined) {
                return i;
            }
        }
        return -1;
    }
    // 处理一栏的方块左移
    moveLeftinRow(r) {
        for (let c = 0; c < 3; c++) {
            let nextc = this.getnext(r, c);
            if (nextc != -1) {
                if (this.cards.cards[r][c] == undefined) {
                    this.cards.cards[r][c] = this.cards.cards[r][nextc];
                    // ------------------------
                    this.tool.hScroll(this.cards.cards[r][nextc], c * 25);
                    // ------------------------ 
                    this.cards.cards[r][nextc].id = `r${r}c${c}`;
                    this.cards.cards[r][nextc] = undefined;
                    c--;
                    this.isslide = true
                } else if (this.cards.cards[r][c].innerHTML == this.cards.cards[r][nextc].innerHTML) {
                    this.getScore(+this.cards.cards[r][c].innerHTML)
                    this.cards.cards[r][c].innerHTML *= 2;
                    // 消除方法不一样 需要注意
                    let distance = c * 25;
                    // 异步
                    this.tool.hScroll(this.cards.cards[r][nextc], distance);
                    that.box.removeChild(this.cards.cards[r][nextc]);
                    that.cards.cards[r][nextc] = undefined;
                    this.cards.setColor(r, c, +this.cards.cards[r][c].innerHTML);
                    this.isslide = true
                }

            } else {
                break;
            }
        }
    }
    // 处理右移动
    moveRight() {
        for (let i = 0; i < 4; i++) {
            this.moveRightinRow(i)
        }
        // 异步问题和没有方块移动就不能生成卡片的问题
        this.generateOnelater()
        this.isgameOver()
    }
    // 获取每个方块的左边存在的方块，有就返回其列坐标，无则返回-1
    getpre(r, c) {
        for (let i = c - 1; i > -1; i--) {
            if (this.cards.cards[r][i] != undefined) {
                return i;
            }
        }
        return -1;
    }
    // 处理一栏方块的右移
    moveRightinRow(r) {
        for (let c = 3; c > 0; c--) {
            let prec = this.getpre(r, c);
            // -----------------------------------------------------
            if (prec != -1) {
                if (this.cards.cards[r][c] == undefined) {
                    this.cards.cards[r][c] = this.cards.cards[r][prec];
                    this.tool.hScroll(this.cards.cards[r][prec], c * 25);
                    this.cards.cards[r][prec].id = `r${r}c${c}`;
                    this.cards.cards[r][prec] = undefined;
                    c++;
                    this.isslide = true
                } else if (this.cards.cards[r][c].innerHTML == this.cards.cards[r][prec].innerHTML) {
                    this.getScore(+this.cards.cards[r][c].innerHTML)
                    this.cards.cards[r][c].innerHTML *= 2;
                    let distance = c * 25;
                    this.tool.hScroll(this.cards.cards[r][prec], distance);
                    this.box.removeChild(this.cards.cards[r][prec]);
                    this.cards.cards[r][prec] = undefined;
                    this.cards.setColor(r, c, +this.cards.cards[r][c].innerHTML);
                    this.isslide = true
                }
            } else {
                break;
            }
            // -----------------------------------------------------
        }
    }
    // 处理上移动
    moveUp() {
        for (let i = 0; i < 4; i++) {
            this.moveUpinColumn(i)
        }
        this.generateOnelater()
        this.isgameOver()
    }
    // 处理一列方块的上移
    moveUpinColumn(c) {
        for (let r = 0; r < 3; r++) {
            let belowr = this.getbelow(r, c);
            if (belowr !== -1) {

                if (this.cards.cards[r][c] == undefined) {
                    // 移动赋值
                    this.cards.cards[r][c] = this.cards.cards[belowr][c]
                    /*处理视图动画效果*/
                    this.tool.vScroll(this.cards.cards[belowr][c], r * 25)
                    // 消除原来位置的值
                    this.cards.cards[belowr][c].id = `r${r}s${c}`
                    this.cards.cards[belowr][c] = undefined
                    r--
                    this.isslide = true
                } else if (this.cards.cards[r][c].innerHTML == this.cards.cards[belowr][c].innerHTML) {
                    this.getScore(+this.cards.cards[r][c].innerHTML)
                    this.cards.cards[r][c].innerHTML *= 2
                    this.tool.vScroll(this.cards.cards[belowr][c], r * 25)
                    that.box.removeChild(this.cards.cards[belowr][c]) //因为合并了，还要把html里面的元素删除掉
                    this.cards.cards[belowr][c] = undefined
                    this.cards.setColor(r, c, +this.cards.cards[r][c].innerHTML);
                    this.isslide = true
                }
            } else {
                break
            }
        }

    }
    // 获取每个方块的下面存在的方块，有就返回其横坐标，无则返回-1
    getbelow(r, c) {
        for (let i = r + 1; i < 4; i++) {
            if (this.cards.cards[i][c] !== undefined) return i
        }
        return -1
    }
    // 处理下移动
    moveDown() {
        for (let i = 0; i < 4; i++) {
            this.moveDowninColumn(i)
        }
        this.generateOnelater()
        this.isgameOver()
    }
    // 处理一列方块的下移动
    moveDowninColumn(c) {
        for (let r = 3; r > 0; r--) {
            let abover = this.getabove(r, c);
            if (abover !== -1) {
                if (this.cards.cards[r][c] == undefined) {
                    this.cards.cards[r][c] = this.cards.cards[abover][c];
                    this.tool.vScroll(this.cards.cards[abover][c], r * 25);   /** 动画部分*/
                    this.cards.cards[abover][c].id = `r${r}c${c}`;
                    this.cards.cards[abover][c] = undefined;
                    r++
                    this.isslide = true
                } else if (this.cards.cards[r][c].innerHTML == this.cards.cards[abover][c].innerHTML) {
                    this.getScore(+this.cards.cards[r][c].innerHTML)
                    this.cards.cards[r][c].innerHTML *= 2
                    this.tool.vScroll(this.cards.cards[abover][c], r * 25);
                    that.box.removeChild(this.cards.cards[abover][c])
                    this.cards.cards[abover][c] = undefined;
                    this.cards.setColor(r, c, +this.cards.cards[r][c].innerHTML);
                    this.isslide = true
                }
            } else {
                break
            }
        }
    }
    // 获取每个方块的上面存在的方块，有就返回其横坐标，无则返回-1
    getabove(r, c) {
        for (let i = r - 1; i > -1; i--) {
            if (this.cards.cards[i][c] !== undefined) return i
        }
        return -1
    }
    // 获取分数

}