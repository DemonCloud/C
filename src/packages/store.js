// author 亦俊(DemonCloud)
// github: https://github.com/DemonCloud
// date: 2017/12/28
// localStorage with micro encryption
// storage.js

const LS = window.localStorage;
const SN = 'CUBEC@';
const revs = function(str) {
  return str
    .split('')
    .reverse()
    .join('');
};

const store = {
  t: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

  ram: {},

  kAt: function(key, i) {
    return key.charCodeAt(~~(i % key.length));
  },

  ecd: function(data) {
    var o1,
      o2,
      o3,
      h1,
      h2,
      h3,
      h4,
      bits,
      r,
      i = 0,
      enc = '';
    if (!data) {
      return data;
    }
    do {
      o1 = data[i++];
      o2 = data[i++];
      o3 = data[i++];
      bits = (o1 << 16) | (o2 << 8) | o3;
      h1 = (bits >> 18) & 0x3f;
      h2 = (bits >> 12) & 0x3f;
      h3 = (bits >> 6) & 0x3f;
      h4 = bits & 0x3f;
      enc +=
        this.t.charAt(h1) +
        this.t.charAt(h2) +
        this.t.charAt(h3) +
        this.t.charAt(h4);
    } while (i < data.length);
    r = data.length % 3;
    return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
  },

  dcd: function(data) {
    var o1,
      o2,
      o3,
      h1,
      h2,
      h3,
      h4,
      bits,
      i = 0,
      result = [];
    if (!data) {
      return data;
    }
    data += '';
    do {
      h1 = this.t.indexOf(data.charAt(i++));
      h2 = this.t.indexOf(data.charAt(i++));
      h3 = this.t.indexOf(data.charAt(i++));
      h4 = this.t.indexOf(data.charAt(i++));
      bits = (h1 << 18) | (h2 << 12) | (h3 << 6) | h4;
      o1 = (bits >> 16) & 0xff;
      o2 = (bits >> 8) & 0xff;
      o3 = bits & 0xff;
      result.push(o1);
      if (h3 !== 64) {
        result.push(o2);
        if (h4 !== 64) result.push(o3);
      }
    } while (i < data.length);
    return result;
  },

  incry: function(s, key) {
    var i = 0,
      l = s.length,
      res = [];
    for (; i < l; i++) res[i] = s[i].charCodeAt(0) ^ this.kAt(key, i);
    return this.ecd(res);
  },

  decyt: function(s, key) {
    s = this.dcd(s);
    var i = 0,
      l = s.length;
    for (; i < l; i++) s[i] = String.fromCharCode(s[i] ^ this.kAt(key, i));
    return s.join('');
  },

  set: function(name, data) {
    LS.setItem(
      SN + this.incry(name, revs(name)),
      this.incry(encodeURIComponent(JSON.stringify(data)), name),
    );
  },

  get: function(name) {
    var str = LS.getItem(SN + this.incry(name, revs(name)));
    return str ? JSON.parse(decodeURIComponent(this.decyt(str, name))) : 0;
  },

  rm: function(name) {
    LS.removeItem(SN + this.incry(name, revs(name)));
  },
};

export default store;
