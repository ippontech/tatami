import isArray from '../utils/is-array';
import compareArrays from '../utils/compare-arrays';
import { Locale } from './constructor';
var locales = {};
var globalLocale;

function normalizeLocale(key) {
    return key ? key.toLowerCase().replace('_', '-') : key;
}
function chooseLocale(names) {
    var i = 0, j, next, locale, split;

    while (i < names.length) {
        split = normalizeLocale(names[i]).split('-');
        j = split.length;
        next = normalizeLocale(names[i + 1]);
        next = next ? next.split('-') : null;
        while (j > 0) {
            locale = loadLocale(split.slice(0, j).join('-'));
            if (locale) {
                return locale;
            }
            if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                break;
            }
            j--;
        }
        i++;
    }
    return null;
}

function loadLocale(name) {
    var oldLocale = null;
    if (!locales[name] && typeof module !== 'undefined' &&
            module && module.exports) {
        try {
            oldLocale = globalLocale._abbr;
            require('./locale/' + name);
            getSetGlobalLocale(oldLocale);
        } catch (e) { }
    }
    return locales[name];
}
export function getSetGlobalLocale (key, values) {
    var data;
    if (key) {
        if (typeof values === 'undefined') {
            data = getLocale(key);
        }
        else {
            data = defineLocale(key, values);
        }

        if (data) {
            globalLocale = data;
        }
    }

    return globalLocale._abbr;
}

export function defineLocale (name, values) {
    if (values !== null) {
        values.abbr = name;
        if (!locales[name]) {
            locales[name] = new Locale();
        }
        locales[name].set(values);
        getSetGlobalLocale(name);

        return locales[name];
    } else {
        delete locales[name];
        return null;
    }
}
export function getLocale (key) {
    var locale;

    if (key && key._locale && key._locale._abbr) {
        key = key._locale._abbr;
    }

    if (!key) {
        return globalLocale;
    }

    if (!isArray(key)) {
        locale = loadLocale(key);
        if (locale) {
            return locale;
        }
        key = [key];
    }

    return chooseLocale(key);
}
