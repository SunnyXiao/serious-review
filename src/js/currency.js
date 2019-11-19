export default function currency(val, symbol='$'){
  if (typeof val != "number" || isNaN(val)) {
    return val
  }
  let tmp = ''+val;
  let reg = /(\d)(?=(\d{3})+(?:\.\d+)?$)/g;
  let result = tmp.replace(reg,'$1,')
  return symbol + result;
}