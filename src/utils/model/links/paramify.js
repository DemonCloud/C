import MODEL from '../../../constant/model.define';
import { registerLink } from '../linkSystem';
import {
  _merge,
  _isObject,
  _isFn,
  _slice,
} from '../../usestruct';

const linkProto = "paramify";

const paramifyLink = function(useOptions){
  const staticOptions = useOptions || {};

  return function(params={}){
    const useFn = _isFn(staticOptions);
    const args = _slice(arguments);

    if(useFn)
      params = staticOptions(params);
    else if(args.length > 1)
      params = args;
    else
      params = (params && _isObject(params)) ? params : {};

    let createOptions = {};
    if(useFn)
      createOptions = params;
    else
      createOptions = _merge(staticOptions, { param: params });

    return createOptions;
  };
};

registerLink("update",  linkProto, MODEL.LINKTYPES.before, paramifyLink);
registerLink("request", linkProto, MODEL.LINKTYPES.before, paramifyLink);
