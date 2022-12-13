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
  =*  spo  sponsor.net.npoint
  =/  prev  (~(gut by prev-spo.s) child parent)
  =/  unsponsored-state
    =.  prev-spo.s  (~(del by prev-spo.s) child)
    =.  spam.s  (~(del bi spam.s) prev child)
    s
  ?.  has.spo  unsponsored-state
  =?  s  !=(prev who.spo)
    unsponsored-state
  =.  prev-spo.s  (~(put by prev-spo.s) child who.spo)
  =.  spam.s  (~(put bi spam.s) who.spo child pdata)
  s
--
