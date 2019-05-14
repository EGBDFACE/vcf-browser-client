  export const degree = Math.PI / 180;
  export const ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array;

  // degree to radian
  export function toRadian(a) {
    return a * degree;
  }

  // matrix
  export function create() {
    let out = new ARRAY_TYPE(16);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }

  export function translate(tx, ty) {
    return [
      1, 0, 0,
      0, 1, 0,
      tx, ty, 1
    ];
  }

  export function rotate(radian) {
    const cos = Math.cos(radian);
    const sin = Math.sin(radian);
    return [
      c, -s, 0,
      s, c, 0,
      0, 0, 1
    ];
  }

  export function scale(sx, sy) {
    return [
      sx, 0, 0,
      0, sy, 0,
      0, 0, 1
    ];
  }

  // fetch data
  export function getData(url, type, callback) {
    switch (type) {
      case 'json':
        return d3.json(url, callback);
      case 'tsv':
        return d3.tsv(url, callback);
      case 'csv':
        return d3.csv(url, callback);
    }
  }

  /**
   * 对数字按照指定取整
   * @param  {Number}  n      源数据
   * @param  {Number}  sn     指定整数
   * @param  {Boolean} isCeil 是否向上取整
   * @return {Number}         处理后的数据
   */
  export function roundNumber(n, sn, isCeil) {
    if (isCeil) {
      return (Math.floor(n / sn) + 1) * sn;
    } else {
      return (Math.floor(n / sn)) * sn;
    }
  }