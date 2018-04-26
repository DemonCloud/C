import struct from 'ax-struct-js';

const _identify = struct.broken;
const _keys = struct.keys();
const _get = struct.prop('get');
const _size = struct.size();
const _clone = struct.clone();

function modelMutipleVerify(newData, model) {
  if (!model._v) return true;

  let verify = model._asv(_identify);
  let error = [];
  let key = _keys(verify);
  let i = 0;
  let s = key.length;
  let isRequired, value, valid;

  for (; i < s; i++) {
    // get validate funtion
    isRequired = verify[key[i]];
    value = _get(newData, key[i]);

    if (!isRequired(value)) {
      error.push(key[i], value);
      break;
    }
  }

  valid = !_size(error);

  model.emit(
    'verify:' + (valid ? 'success' : 'fail'),
    valid ? [_clone(newData)] : error,
  );

  return valid;
}

export default modelMutipleVerify;
