import absFloor from '../utils/abs-floor';

export function bubble () {
    var milliseconds = this._milliseconds;
    var days         = this._days;
    var months       = this._months;
    var data         = this._data;
    var seconds, minutes, hours, years = 0;
    data.milliseconds = milliseconds % 1000;

    seconds           = absFloor(milliseconds / 1000);
    data.seconds      = seconds % 60;

    minutes           = absFloor(seconds / 60);
    data.minutes      = minutes % 60;

    hours             = absFloor(minutes / 60);
    data.hours        = hours % 24;

    days += absFloor(hours / 24);
    years = absFloor(daysToYears(days));
    days -= absFloor(yearsToDays(years));
    months += absFloor(days / 30);
    days   %= 30;
    years  += absFloor(months / 12);
    months %= 12;

    data.days   = days;
    data.months = months;
    data.years  = years;

    return this;
}

export function daysToYears (days) {
    return days * 400 / 146097;
}

export function yearsToDays (years) {
    return years * 146097 / 400;
}
