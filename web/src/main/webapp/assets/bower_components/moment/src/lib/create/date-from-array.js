export function createDate (y, m, d, h, M, s, ms) {
    var date = new Date(y, m, d, h, M, s, ms);
    if (y < 1970) {
        date.setFullYear(y);
    }
    return date;
}

export function createUTCDate (y) {
    var date = new Date(Date.UTC.apply(null, arguments));
    if (y < 1970) {
        date.setUTCFullYear(y);
    }
    return date;
}
