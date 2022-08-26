function goldPallete() {
    const _goldPallete = ["#ffbf00", "#ffcf40", "#ffdc73"];

    return _goldPallete[Math.floor(Math.random() * _goldPallete.length)]
}

module.exports = {goldPallete}