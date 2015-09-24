import { addFormatToken } from '../format/format';
import { addUnitAlias } from './aliases';
import { addRegexToken, match1to2, match2 } from '../parse/regex';
import { addWeekParseToken } from '../parse/token';
import toInt from '../utils/to-int';
import { createLocal } from '../create/local';

addFormatToken('w', ['ww', 2], 'wo', 'week');
addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

addUnitAlias('week', 'w');
addUnitAlias('isoWeek', 'W');

addRegexToken('w',  match1to2);
addRegexToken('ww', match1to2, match2);
addRegexToken('W',  match1to2);
addRegexToken('WW', match1to2, match2);

addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
    week[token.substr(0, 1)] = toInt(input);
});
export function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
    var end = firstDayOfWeekOfYear - firstDayOfWeek,
        daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
        adjustedMoment;


    if (daysToDayOfWeek > end) {
        daysToDayOfWeek -= 7;
    }

    if (daysToDayOfWeek < end - 7) {
        daysToDayOfWeek += 7;
    }

    adjustedMoment = createLocal(mom).add(daysToDayOfWeek, 'd');
    return {
        week: Math.ceil(adjustedMoment.dayOfYear() / 7),
        year: adjustedMoment.year()
    };
}

export function localeWeek (mom) {
    return weekOfYear(mom, this._week.dow, this._week.doy).week;
}

export var defaultLocaleWeek = {
    dow : 0, // Sunday is the first day of the week.
    doy : 6  // The week that contains Jan 1st is the first week of the year.
};

export function localeFirstDayOfWeek () {
    return this._week.dow;
}

export function localeFirstDayOfYear () {
    return this._week.doy;
}

export function getSetWeek (input) {
    var week = this.localeData().week(this);
    return input == null ? week : this.add((input - week) * 7, 'd');
}

export function getSetISOWeek (input) {
    var week = weekOfYear(this, 1, 4).week;
    return input == null ? week : this.add((input - week) * 7, 'd');
}
