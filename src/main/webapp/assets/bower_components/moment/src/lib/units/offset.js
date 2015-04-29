import zeroFill from '../utils/zero-fill';
import { createDuration } from '../duration/create';
import { addSubtract } from '../moment/add-subtract';
import { isMoment } from '../moment/constructor';
import { addFormatToken } from '../format/format';
import { addRegexToken, matchOffset } from '../parse/regex';
import { addParseToken } from '../parse/token';
import { createLocal } from '../create/local';
import { createUTC } from '../create/utc';
import isDate from '../utils/is-date';
import toInt from '../utils/to-int';
import compareArrays from '../utils/compare-arrays';
import { hooks } from '../utils/hooks';

function offset (token, separator) {
    addFormatToken(token, 0, 0, function () {
        var offset = this.utcOffset();
        var sign = '+';
        if (offset < 0) {
            offset = -offset;
            sign = '-';
        }
        return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
    });
}

offset('Z', ':');
offset('ZZ', '');

addRegexToken('Z',  matchOffset);
addRegexToken('ZZ', matchOffset);
addParseToken(['Z', 'ZZ'], function (input, array, config) {
    config._useUTC = true;
    config._tzm = offsetFromString(input);
});
var chunkOffset = /([\+\-]|\d\d)/gi;

function offsetFromString(string) {
    var matches = ((string || '').match(matchOffset) || []);
    var chunk   = matches[matches.length - 1] || [];
    var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
    var minutes = +(parts[1] * 60) + toInt(parts[2]);

    return parts[0] === '+' ? minutes : -minutes;
}
export function cloneWithOffset(input, model) {
    var res, diff;
    if (model._isUTC) {
        res = model.clone();
        diff = (isMoment(input) || isDate(input) ? +input : +createLocal(input)) - (+res);
        res._d.setTime(+res._d + diff);
        hooks.updateOffset(res, false);
        return res;
    } else {
        return createLocal(input).local();
    }
    return model._isUTC ? createLocal(input).zone(model._offset || 0) : createLocal(input).local();
}

function getDateOffset (m) {
    return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
}
hooks.updateOffset = function () {};
export function getSetOffset (input, keepLocalTime) {
    var offset = this._offset || 0,
        localAdjust;
    if (input != null) {
        if (typeof input === 'string') {
            input = offsetFromString(input);
        }
        if (Math.abs(input) < 16) {
            input = input * 60;
        }
        if (!this._isUTC && keepLocalTime) {
            localAdjust = getDateOffset(this);
        }
        this._offset = input;
        this._isUTC = true;
        if (localAdjust != null) {
            this.add(localAdjust, 'm');
        }
        if (offset !== input) {
            if (!keepLocalTime || this._changeInProgress) {
                addSubtract(this, createDuration(input - offset, 'm'), 1, false);
            } else if (!this._changeInProgress) {
                this._changeInProgress = true;
                hooks.updateOffset(this, true);
                this._changeInProgress = null;
            }
        }
        return this;
    } else {
        return this._isUTC ? offset : getDateOffset(this);
    }
}

export function getSetZone (input, keepLocalTime) {
    if (input != null) {
        if (typeof input !== 'string') {
            input = -input;
        }

        this.utcOffset(input, keepLocalTime);

        return this;
    } else {
        return -this.utcOffset();
    }
}

export function setOffsetToUTC (keepLocalTime) {
    return this.utcOffset(0, keepLocalTime);
}

export function setOffsetToLocal (keepLocalTime) {
    if (this._isUTC) {
        this.utcOffset(0, keepLocalTime);
        this._isUTC = false;

        if (keepLocalTime) {
            this.subtract(getDateOffset(this), 'm');
        }
    }
    return this;
}

export function setOffsetToParsedOffset () {
    if (this._tzm) {
        this.utcOffset(this._tzm);
    } else if (typeof this._i === 'string') {
        this.utcOffset(offsetFromString(this._i));
    }
    return this;
}

export function hasAlignedHourOffset (input) {
    if (!input) {
        input = 0;
    }
    else {
        input = createLocal(input).utcOffset();
    }

    return (this.utcOffset() - input) % 60 === 0;
}

export function isDaylightSavingTime () {
    return (
        this.utcOffset() > this.clone().month(0).utcOffset() ||
        this.utcOffset() > this.clone().month(5).utcOffset()
    );
}

export function isDaylightSavingTimeShifted () {
    if (this._a) {
        var other = this._isUTC ? createUTC(this._a) : createLocal(this._a);
        return this.isValid() && compareArrays(this._a, other.toArray()) > 0;
    }

    return false;
}

export function isLocal () {
    return !this._isUTC;
}

export function isUtcOffset () {
    return this._isUTC;
}

export function isUtc () {
    return this._isUTC && this._offset === 0;
}
