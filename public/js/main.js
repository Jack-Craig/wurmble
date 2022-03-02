setTimeout(() => {
    let now = new Date()
    if (now.getHours() == 0 && now) {

    }
}, 5000)

class Notification {
    constructor(id) {
        this.elem = document.getElementById(id)
        this.enabled = true
    }

    open() {
        if (this.enabled) {
            this.enabled = false
            this.elem.classList.remove('hidden')
            this.elem.style.opacity = 1
            setTimeout(() => {
                this.elem.style.opacity = 0
                this.enabled = true
            }, 4000)
        }
    }
}

class Game {
    constructor() {
        this.sqrs = document.getElementsByClassName('square')
        this.maxLen = this.sqrs.length
        this.goal = document.getElementById('this-isnt-the-word-you-cheater').attributes[1].nodeValue
        this.wurmbleno = document.getElementById('wurmble-no').attributes[1].nodeValue
        // lastAccess is a grandfather
        if (localStorage.getItem('wurmbleno') || localStorage.getItem('lastAccess')) {
            if (localStorage.getItem('wurmbleno') !== this.wurmbleno) {
                // new wurmble jus drop
                console.log('clear')
                localStorage.clear()
            }
        }
        localStorage.setItem('wurmbleno', ''+this.wurmbleno)
        this.cStr = localStorage.getItem('lastStr')
        if (this.cStr == null)
            this.cStr = ''

        this.render(false)
        if (localStorage.getItem('wasDone'))
            this.complete()
    }
    complete() {
        if (this.cStr.length < this.maxLen || this.isLocked) {
            return
        }
        // Check if in word list
        let goalAmt = {}
        let accAmt = {}
        for (let i = 0; i < this.maxLen; i++) {
            if (this.goal[i] in goalAmt)
                goalAmt[this.goal[i]] += 1
            goalAmt
            goalAmt[this.goal[i]] = 1
            if (this.cStr[i] === this.goal[i]) {
                if (this.cStr[i] in accAmt)
                    accAmt[this.cStr[i]] += 1
                else
                    accAmt[this.cStr[i]] = 1
            }
        }
        let clrs = []
        for (let i = 0; i < this.maxLen; i++) {
            const expected = this.goal[i]
            const actual = this.cStr[i]
            if (expected == actual) {
                clrs.push('#6aaa64')
            } else if (actual in goalAmt && (!(actual in accAmt) || accAmt[actual] < goalAmt[actual])) {
                if (actual in accAmt) {
                    accAmt[actual] = 1
                } else
                    accAmt[actual] += 1
                clrs.push('#fce166')
            } else {
                clrs.push('gray')
            }
        }
        const frameTime = 500
        for (let i = 0; i < this.maxLen; i++) {
            this.sqrs[i].style.transition = 'transform .25s linear'
            setTimeout(() => this.sqrs[i].style.transform = 'rotateX(-90deg)', i * frameTime)
            setTimeout(() => {
                this.sqrs[i].style.border = 'none'
                this.sqrs[i].style.backgroundColor = clrs[i]
                this.sqrs[i].style.transform = 'rotateX(0deg)'
            }, i * frameTime + frameTime / 2)
        }
        setTimeout(() => document.getElementById('loser-banner').style.opacity = 1, frameTime * this.maxLen)
        if (this.goal !== this.cStr) {
            setTimeout(() => document.getElementById('loser-ting').style.opacity = 1, frameTime * this.maxLen)
        } else {
            setTimeout(() => document.getElementById('winner-ting').style.opacity = 1, frameTime * this.maxLen)
        }
        document.getElementById('share').style.opacity = 1
        localStorage.setItem('wasDone', 'True')
        this.isLocked = true
    }

    render(animLast) {
        for (let i = 0; i < this.maxLen; i++) {
            if (i < this.cStr.length) {
                this.sqrs[i].innerHTML = this.cStr[i]
                if (animLast && i == this.cStr.length - 1)
                    this.sqrs[i].animate([
                        //{transform: 'scale(1.05)'},
                        //{transform: 'scale(1)'},
                    ], { duration: 200 })
            } else
                this.sqrs[i].innerHTML = ''

        }
    }
    toString() {
        if (!this.isLocked) {
            return ''
        }
        let rowStr = ''
        let wasSuccess = 0
        for (const elem of this.sqrs) {
            switch (elem.style.backgroundColor) {
                case 'rgb(106, 170, 100)':
                    wasSuccess += 1
                    rowStr += '🟩'
                    break
                case 'rgb(252, 225, 102)':
                    rowStr += '🟨'
                    break
                default:
                    rowStr += '⬜'
            }
        }
        wasSuccess = Math.floor(wasSuccess / this.maxLen)
        return 'Wurmble ' + this.wurmbleno + " " + wasSuccess + '/1\n' + rowStr + '\nwurmble.com'
    }
    writeChar(c) {
        if (this.cStr.length >= this.maxLen || this.isLocked || !/^[A-Za-z]{1,1}$/.test(c)) {
            return
        }
        this.cStr += c
        localStorage.setItem('lastStr', this.cStr)
        this.render(true)
    }
    delChar() {
        if (this.cStr.length == 0 || this.isLocked) {
            return
        }
        this.cStr = this.cStr.slice(0, -1)
        localStorage.setItem('lastStr', this.cStr)
        this.render(false)
    }
}

let game = new Game()

elems = document.getElementsByClassName('key')
for (elem of elems) {
    elem.addEventListener('click', e => {
        let char = e.srcElement.attributes[1].nodeValue
        switch (char) {
            case 'enter':
                game.complete()
                break
            case 'delete':
                game.delChar()
                break
            default:
                game.writeChar(char)
        }
    })
}
document.addEventListener('keydown', key => {
    switch (key.key) {
        case 'Enter':
            game.complete()
            break
        case 'Backspace':
            game.delChar()
            break
        default:
            game.writeChar(key.key)
    }
})

document.getElementById('help').addEventListener('click', e => {
    document.getElementById('modal').classList.remove('hidden')
})

document.getElementById('close-modal').addEventListener('click', e => {
    document.getElementById('modal').classList.add('hidden')
})
let clippy = new Notification('clipboard-notif')
document.getElementById('share').addEventListener('click', e => {
    shareStr = game.toString()
    navigator.clipboard.writeText(shareStr).then(function () {
        // Say copied to clipboard
        clippy.open()
    }, function (err) {
    });
})