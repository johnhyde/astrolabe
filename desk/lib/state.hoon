/-  *astrolabe
/+  *astrolabe
|%
++  put-in-spawn-mip
  |=  [child=ship =npoint s=state-latest]
  ^-  _s
  =/  parent  (^sein:title child)
  ?:  =(parent child)  s
  ?:  (is-npoint-locked npoint)  s
  =/  pdata  (pdata:smel (pmeta:smel child npoint) ~)
  =.  spam.s  (~(put bi spam.s) parent child pdata)
  =*  spo  sponsor.net.npoint
  =/  prev  (~(gut by prev-spo.s) child parent)
  =.  prev-spo.s  (~(del by prev-spo.s) child)
  =?  spam.s  !=(parent prev)
    (~(del bi spam.s) prev child)
  ?.  has.spo  s
  =.  prev-spo.s  (~(put by prev-spo.s) child who.spo)
  =.  spam.s  (~(put bi spam.s) who.spo child pdata)
  s
--
