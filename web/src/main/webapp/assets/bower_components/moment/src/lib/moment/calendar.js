import { createLocal } from '../create/local';
import { cloneWithOffset } from '../units/offset';

export function calendar (time) {
    var now = time || createLocal(),
        sod = cloneWithOffset(now, this).startOf('day'),
        diff = this.diff(sod, 'days', true),
        format = diff < -6 ? 'sameElse' :
            diff < -1 ? 'lastWeek' :
            diff < 0 ? 'lastDay' :
            diff < 1 ? 'sameDay' :
            diff < 2 ? 'nextDay' :
            diff < 7 ? 'nextWeek' : 'sameElse';
    return this.format(this.localeData().calendar(format, this, createLocal(now)));
}
