import { addFormatToken } from '../format/format';

addFormatToken('z',  0, 0, 'zoneAbbr');
addFormatToken('zz', 0, 0, 'zoneName');

export function getZoneAbbr () {
    return this._isUTC ? 'UTC' : '';
}

export function getZoneName () {
    return this._isUTC ? 'Coordinated Universal Time' : '';
}
