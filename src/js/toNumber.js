/**
 * Converts `value` to a number.
 * @author Luisa.Xiao
 */
import isType from './isType';


/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

export default function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }

  // isSymbol
  if (isType(value, 'Symbol')) {
    return NAN;
  }
  if (isType(value, 'Object')) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isType(other,'Object') ? (other + '') : other;
  }

  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}