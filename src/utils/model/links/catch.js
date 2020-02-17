import MODEL from '../../../constant/model.define';
import { registerLink } from '../linkSystem';
import {
  _isFn,
  _eachArray,
  _idt,
} from '../../usestruct';

const linkProto = "catch";

const catchLink = function(catcher){
  const useCatch = _isFn(catcher) ? catcher : function(){ return catcher; };

  return useCatch;
};

_eachArray(MODEL.ALLOWLINKAPIS, function(modelAPI){
  return registerLink(modelAPI, linkProto, MODEL.LINKTYPES.catch, catchLink, _idt);
});
