class Card {
    constructor() {
        this.cards = [
            [undefined, undefined, undefined, undefined],
            [undefined, undefined, undefined, undefined],
            [undefined, undefined, undefined, undefined],
            [undefined, undefined, undefined, undefined]
        ]
        this.updateCard();
    }
    updateCard() {
        // 获取所有方块
        let cells = document.querySelectorAll('.cell');
        // 把方块按照其在棋盘中的位置一一对应地放到一个二维数组里
        for (let i = 0; i < cells.length; i++) {
            if (cells[i]) {
                let r = +cells[i].id.substr(1, 1);
                let c = +cells[i].id.substr(3, 1);
                this.cards[r][c] = cells[i];
            }
        }
    }
    getValue(r, c) {
        return this.cards[r][c].innerHTML;
    }
    // 为选中卡片上背景颜色
    setColor(r, c, value) {
        this.updateCard();

        switch (value) {
            case 2:
                this.cards[r][c].style.backgroundColor = '#f65e3b';
                break;
            case 4:
                this.cards[r][c].style.backgroundColor = '#33b5e5';
                break;
            case 8:
                this.cards[r][c].style.backgroundColor = '#f2b179';
                break;
            case 16:
                this.cards[r][c].style.backgroundColor = '#f59563';
                break;
            case 32:
                this.cards[r][c].style.backgroundColor = '#f67c5f';
                break;
            case 64:
                this.cards[r][c].style.backgroundColor = '#f65e3b';
                break;
            case 128:
                this.cards[r][c].style.backgroundColor = '#edcf72';
                break;
            case 256:
                this.cards[r][c].style.backgroundColor = '#edcc61';
                break;
            case 512:
                this.cards[r][c].style.backgroundColor = '#9c0';
                break;
            case 1024:
                this.cards[r][c].style.backgroundColor = '#33b5e5';
                break;
            default:
                this.cards[r][c].style.backgroundColor = '#09c';
                break;

        }
    }
    // 设置选中卡片的数值
    setValue(r, c, value) {
        this.cards[r][c].innerHTML = value;
    }
    reloadCard() {
        this.cards = [
            [undefined, undefined, undefined, undefined],
            [undefined, undefined, undefined, undefined],
            [undefined, undefined, undefined, undefined],
            [undefined, undefined, undefined, undefined]
        ]
    }
}