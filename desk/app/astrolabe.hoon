/-  *astrolabe
/+  naive, default-agent, dbug, agentio
/$  udon-to-docu  %udon  %docu
|%
+$  versioned-state
  $%  state-0
  ==
+$  state-0 
  $:  %0
      spa=spawned
  ==
::
+$  spawned  (jug ship ship)
+$  card  card:agent:gall
--
%-  agent:dbug
=|  state-0
=*  state  -
^-  agent:gall
=<
|_  =bowl:gall
+*  this  .
    def   ~(. (default-agent this %.n) bowl)
    hc    ~(. +> bowl)
::
++  on-init
  ^-  (quip card _this)
  :_  this
  [%pass /azimuth-events %agent [our.bowl %azimuth] %watch /event]~
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
    ``astrolabe-point+!>((get-point:hc &3.path))
      [%x %doc ^]
    =/  doc-path=^path  t.t.path
    =/  doc  (read-doc:hc doc-path)
    ?~  doc
      `~
    ``json+!>(s+u.doc)
  ==
++  on-agent
  |=  [=wire =sign:agent:gall]
  ^-  (quip card _this)
  |^
  ?+  wire  (on-agent:def wire sign)
    [%azimuth-events ~]   (azimuth-event sign)
  ==
  ::
  ++  azimuth-event
    |=  =sign:agent:gall
    ^-  (quip card _this)
    ?+  -.sign  [~ this]
        %watch-ack
      ?~  p.sign  [~ this]
      =/  =tank  leaf+"{(trip dap.bowl)} couldn't start listen to %azimuth"
      %-  (slog tank u.p.sign)
      [~ this]
    ::
        %fact
      ?+  p.cage.sign  (on-agent:def wire sign)
          %naive-diffs
        =+  !<(=diff:naive q.cage.sign)
        =^  cards  state
          (on-naive-diff:hc diff)
        [cards this]
      ::
          %naive-state
        ~&  >  %received-azimuth-state
        :: =+  !<([nas=^state:naive =indices:dice] q.cage.sign)
        =+  !<([nas=^state:naive indices=*] q.cage.sign)
        =^  cards  state
          (on-naive-state:hc nas)
        [cards this]
      ==
    ==
  --
::
++  on-arvo  on-arvo:def
++  on-fail  on-fail:def
--
::
|_  =bowl:gall
++  scrio  ~(scry agentio bowl)
++  put-in-spa
  |=  =ship
  ^-  _spa
  =/  parent=^ship  (^sein:title ship)
  ?:  =(parent ship)  
    spa
  (~(put ju spa) parent ship)
++  on-naive-state
  |=  nas=^state:naive
  ^-  (quip card _state)
  =+  points=points.nas :: =points, eh?
  =.  spa
    |-
    ^-  _spa
    ?~  points  spa
    =/  =ship  -.n.points
    :: traverse tree of points and add @ps to spa with ^sein, you know
    =.  spa  (put-in-spa ship)
    $(points l.points, spa $(points r.points))
  `state
::
++  on-naive-diff
  |=  =diff:naive
  ^-  (quip card _state)
  :: =?  spa  (is-spawn-tx diff)
  =?  spa  ?=([%tx [* * * %spawn ship *] *] diff)
    %-  put-in-spa
    ship.tx.raw-tx.diff
  `state
::
++  is-spawn-tx
  |=  =diff:naive
  ^-  ?
  ?=  [%tx [* * * %spawn ship *] *]  diff
::
++  get-point
  |=  ship-name=term
  ^-  point
  =/  =ship  `@p`(slav %p ship-name)
  =/  unpoint  (get-unpoint ship-name)
  :*  unpoint
      (spa-count ship)
      (sponsor-chain unpoint)
      (probable-dominion unpoint)
  ==
::
++  get-unpoint
  |=  ship-name=term
  .^(unpoint %gx (scrio %azimuth /point/[ship-name]/noun))
::
++  spa-count
  |=  =ship
  ^-  @ud
  %~  wyt
    in
  (~(get ju spa) ship)
::
++  sponsor-chain
  |=  =unpoint
  ^-  (list ship)
  ?~  unpoint  ~
  =/  sponsor  sponsor.net.u.unpoint
  ?.  has.sponsor  ~
  [who.sponsor ~] :: todo: lookup parent
::
++  probable-dominion
  |=  =unpoint
  ^-  dominion:naive
  ?^  unpoint
    dominion.u.unpoint
  %l1 :: todo: lookup parent
::
++  read-doc
  |=  =path
  =/  doc-path=^path  :(weld /doc/usr path /udon)
  ^-  (unit @t)
  ?.  .^(? %cu (scrio q.byk.bowl doc-path))
    ~
  =/  mme=(each manx tang)  (mule |.((udon-to-docu .^(@t %cx (scrio q.byk.bowl doc-path)))))
  ?:  ?=(%.n -.mme)
    %-  (slog p.mme)
    ~
  `(crip (en-xml:html p.mme))
--
