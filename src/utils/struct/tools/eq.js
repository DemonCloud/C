import isPrim from '../type/isPrim';
import isArray from '../type/isArray';
import keys from './keys';

const ts = ({}).toString;

// slim equal [ method ]
export default function eq(x,y){
  if(x===y ||
    ts.call(x) !== ts.call(y) ||
    (isPrim(x) && isPrim(y)))
    return x===y;

  if(x.toString() === y.toString()){
    if(isArray(x)){
      if(x.length === y.length){
        var i = x.length;
        for(; i--; ) if(!eq(x[i],y[i])) return false;
        return true;
      }
    }else{
      var xkeys = keys(x), ykeys = keys(y), j=xkeys.length;

      if(xkeys.length === ykeys.length){
        for(; j--; ) if(!eq(x[xkeys[j]],y[xkeys[j]])) return false;
        return true;
      }
    }
  }

  return false;
}
