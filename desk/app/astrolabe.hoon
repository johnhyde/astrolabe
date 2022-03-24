/-  astrolabe
/+  naive, default-agent, dbug
|%
+$  versioned-state
  $%  state-0
  ==
+$  state-0  [%0 data=(map @p @t)]
+$  card  card:agent:gall
--
%-  agent:dbug
=|  state-0
=*  state  -
^-  agent:gall
|_  =bowl:gall
+*  this  .
    def   ~(. (default-agent this %.n) bowl)
::
++  on-init
  ^-  (quip card _this)
  `this
::
++  on-save  on-save:def
++  on-load  on-load:def
++  on-poke  on-poke:def
++  on-watch  on-watch:def
++  on-leave  on-leave:def
::
++  on-peek
  |=  =path
  ^-  (unit (unit cage))
  ?+    path  (on-peek:def path)
      [%x %point @ ~]
    =,  bowl
    =/  point  .^(noun %gx /(scot %p our)/azimuth/(scot %da now)/point/[&3.path]/noun)
    ``astrolabe-point+!>((upoint:astrolabe point))
  ==
::
++  on-agent  on-agent:def
++  on-arvo   on-arvo:def
++  on-fail   on-fail:def
--
