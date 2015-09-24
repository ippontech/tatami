import { configFromISO } from './from-string';
import { configFromArray } from './from-array';
import { getParseRegexForToken }   from '../parse/regex';
import { addTimeToArrayFromToken } from '../parse/token';
import { expandFormat, formatTokenFunctions, formattingTokens } from '../format/format';
import checkOverflow from './check-overflow';
import { HOUR } from '../units/constants';
import { hooks } from '../utils/hooks';
hooks.ISO_8601 = function () {};
export function configFromStringAndFormat(config) {
    if (config._f === hooks.ISO_8601) {
        configFromISO(config);
        return;
    }

    config._a = [];
    config._pf.empty = true;
    var string = '' + config._i,
        i, parsedInput, tokens, token, skipped,
        stringLength = string.length,
        totalParsedInputLength = 0;

    tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

    for (i = 0; i < tokens.length; i++) {
        token = tokens[i];
        parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
        if (parsedInput) {
            skipped = string.substr(0, string.indexOf(parsedInput));
            if (skipped.length > 0) {
                config._pf.unusedInput.push(skipped);
            }
            string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
            totalParsedInputLength += parsedInput.length;
        }
        if (formatTokenFunctions[token]) {
            if (parsedInput) {
                config._pf.empty = false;
            }
            else {
                config._pf.unusedTokens.push(token);
            }
            addTimeToArrayFromToken(token, parsedInput, config);
        }
        else if (config._strict && !parsedInput) {
            config._pf.unusedTokens.push(token);
        }
    }
    config._pf.charsLeftOver = stringLength - totalParsedInputLength;
    if (string.length > 0) {
        config._pf.unusedInput.push(string);
    }
    if (config._pf.bigHour === true && config._a[HOUR] <= 12) {
        config._pf.bigHour = undefined;
    }
    config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

    configFromArray(config);
    checkOverflow(config);
}


function meridiemFixWrap (locale, hour, meridiem) {
    var isPm;

    if (meridiem == null) {
        return hour;
    }
    if (locale.meridiemHour != null) {
        return locale.meridiemHour(hour, meridiem);
    } else if (locale.isPM != null) {
        isPm = locale.isPM(meridiem);
        if (isPm && hour < 12) {
            hour += 12;
        }
        if (!isPm && hour === 12) {
            hour = 0;
        }
        return hour;
    } else {
        return hour;
    }
}
