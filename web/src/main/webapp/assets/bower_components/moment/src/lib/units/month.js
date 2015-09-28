import { get } from '../moment/get-set';
import { addFormatToken } from '../format/format';
import { addUnitAlias } from './aliases';
import { addRegexToken, match1to2, match2, matchWord } from '../parse/regex';
import { addParseToken } from '../parse/token';
import { hooks } from '../utils/hooks';
import { MONTH } from './constants';
import toInt from '../utils/to-int';
import { createUTC } from '../create/utc';

export function daysInMonth(year, month) {
    return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

addFormatToken('M', ['MM', 2], 'Mo', function () {
    return this.month() + 1;
});

addFormatToken('MMM', 0, 0, function (format) {
    return this.localeData().monthsShort(this, format);
});

addFormatToken('MMMM', 0, 0, function (format) {
    return this.localeData().months(this, format);
});

addUnitAlias('month', 'M');

addRegexToken('M',    match1to2);
addRegexToken('MM',   match1to2, match2);
addRegexToken('MMM',  matchWord);
addRegexToken('MMMM', matchWord);

addParseToken(['M', 'MM'], function (input, array) {
    array[MONTH] = toInt(input) - 1;
});

addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
    var month = config._locale.monthsParse(input, token, config._strict);
    if (month != null) {
        array[MONTH] = month;
    } else {
        config._pf.invalidMonth = input;
    }
});

export var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
export function localeMonths (m) {
    return this._months[m.month()];
}

export var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
export function localeMonthsShort (m) {
    return this._monthsShort[m.month()];
}

export function localeMonthsParse (monthName, format, strict) {
    var i, mom, regex;

    if (!this._monthsParse) {
        this._monthsParse = [];
        this._longMonthsParse = [];
        this._shortMonthsParse = [];
    }

    for (i = 0; i < 12; i++) {
        mom = createUTC([2000, i]);
        if (strict && !this._longMonthsParse[i]) {
            this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
            this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
        }
        if (!strict && !this._monthsParse[i]) {
            regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
            this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
        }
        if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
            return i;
        } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
            return i;
        } else if (!strict && this._monthsParse[i].test(monthName)) {
            return i;
        }
    }
}

export function setMonth (mom, value) {
    var dayOfMonth;
    if (typeof value === 'string') {
        value = mom.localeData().monthsParse(value);
        if (typeof value !== 'number') {
            return mom;
        }
    }

    dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
    mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
    return mom;
}

export function getSetMonth (value) {
    if (value != null) {
        setMonth(this, value);
        hooks.updateOffset(this, true);
        return this;
    } else {
        return get(this, 'Month');
    }
}

export function getDaysInMonth () {
    return daysInMonth(this.year(), this.month());
}
