var abs = Math.abs;

export function toISOString() {
    var Y = abs(this.years());
    var M = abs(this.months());
    var D = abs(this.days());
    var h = abs(this.hours());
    var m = abs(this.minutes());
    var s = abs(this.seconds() + this.milliseconds() / 1000);
    var total = this.asSeconds();

    if (!total) {
        return 'P0D';
    }

    return (total < 0 ? '-' : '') +
        'P' +
        (Y ? Y + 'Y' : '') +
        (M ? M + 'M' : '') +
        (D ? D + 'D' : '') +
        ((h || m || s) ? 'T' : '') +
        (h ? h + 'H' : '') +
        (m ? m + 'M' : '') +
        (s ? s + 'S' : '');
}
