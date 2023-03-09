/-  *astrolabe
/+  *astrolabe, *search, slib=state
/+  *mip, naive, default-agent, dbug, agentio
/$  udon-to-docu  %udon  %docu
|%
+$  card  card:agent:gall
--
%-  agent:dbug
=|  state-latest
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
  [az-events-card:hc]~
::
++  on-save  !>(state)
++  on-load
  |=  old-state=vase
  ^-  (quip card _this)
  =/  old  !<(versioned-state old-state)
  =/  [cards-01=(list card) new=state-latest]
    ?.  |(?=(?(%0 %1 %2 %3) -.old) (lth bump.old bump))  `old
    (on-naive-state:hc get-nas:hc)
  ?>  ?=(%4 -.new)
  =/  cards=(list card)
    =/  ug-vase  !>([/astrolabe '/apps/astrolabe/#'])
    :~  [%pass /monkey-ug %agent [our.bowl %monkey] %poke [%bind-ug ug-vase]]
        groups-link-patch-card:hc
    ==
  =.  cards  (weld cards-01 cards)
  [cards this(state new)]
++  on-poke  on-poke:def
++  on-watch  on-watch:def
++  on-leave  on-leave:def
::
++  on-peek
  |=  =path
  ^-  (unit (unit cage))
  ?+    path  (on-peek:def path)
      [%x %nop ~]
    ``noun+!>(~)
      [%x %point @ ~]
    ``astrolabe-point+!>((get-point:hc &3.path))
      [%x %point @ %spawned ?(~ [spawned-filter ~])]
    =/  =ship  `@p`(slav %p &3.path)
    =/  filter  t.t.t.t.path
    =/  arg  ?~(filter %all -.filter)
    ``astrolabe-point-set+!>((get-spawned-points:hc ship arg))
      [%x %search %patp @ ?(~ [%narrow ~])]
    =/  =search-text  (trip &4.path)
    ?~  search-text  ~|(%search-predicted-too-broad !!)
    =/  expand-search  =(t.t.t.path ~)
    ``astrolabe-point-set+!>((search-opoints-patp:hc search-text expand-search))
      [%x %search %sigil @ ~]
    =/  =search-text  (trip &4.path)
    ?~  search-text  ~|(%search-predicted-too-broad !!)
    ``astrolabe-point-set+!>((search-opoints-sigil:hc search-text))
      [%x %peers ~]
    =/  peers  .^((map ship ?(%alien %known)) %ax (scrio:hc %$ /peers))
    ``astrolabe-point-set+!>((turn ~(tap in peers) head))
      [%x %chart-data ~]
    ``json+!>(get-chart-data:hc)
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
        :: ~&  >  %received-azimuth-state
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
:: Helper Core
|_  =bowl:gall
++  scrio  ~(scry agentio bowl)
++  az-events-card  [%pass /azimuth-events %agent [our.bowl %azimuth] %watch /event]
++  get-nas  .^(^state:naive %gx (scrio %azimuth /nas/noun))
++  put-in-fropoints
  |=  =ship
  ^-  _state
  =.  fopoints
    (put:ors fopoints (to-q ship) ~)
  =.  ropoints
    (put:ors ropoints (switch-words (to-q ship)) ~)
  state
::
++  put-in-spawn-mip
  |=  [child=ship nas=^state:naive]
  ^-  _state
  =/  =npoint  (get-npoint-from-nas child nas)
  (put-in-spawn-mip:slib child npoint state)
::
++  on-naive-state
  |=  nas=^state:naive
  ^-  (quip card _state)
  =+  points=points.nas ::  =points, eh?
  :-  ~
  |-
  ^-  _state
  ?~  points  state
  =/  =ship  -.n.points
  =.  state  (put-in-fropoints ship)
  =.  state  (put-in-spawn-mip ship nas)
  $(points l.points, state $(points r.points))
::
++  on-naive-diff
  |=  =diff:naive
  ^-  (quip card _state)
  :: ~&  %+  weld  "received diff:naive: {<-.diff>}"
  ::     ?+  -.diff  ""
  ::       %nonce  " ship: {<ship.diff>}"
  ::       %tx  " from: {<ship.from.tx.raw-tx.diff>} - {<+<.tx.raw-tx.diff>}"
  ::       %point  " ship: {<ship.diff>} - {<+>-.diff>}"
  ::     ==
  =?  state  ?=([%tx [* * * %spawn ship *] *] diff)
    %-  put-in-fropoints
    ship.tx.raw-tx.diff
  =?  state  ?=([%point @ %owner *] diff)
    %-  put-in-fropoints
    ship.diff
  =?  state  ?=([%point @ *] diff)
    %+  put-in-spawn-mip
      ship.diff
    get-nas
  `state
::
++  is-spawn-tx
  |=  =diff:naive
  ^-  ?
  ?=  [%tx [* * * %spawn ship *] *]  diff
::
++  get-unpoint-term
  |=  ship-name=term
  .^(unpoint %gx (scrio %azimuth /point/[ship-name]/noun))
::
++  get-unpoint
  |=  =ship
  (get-unpoint-term (scot %p ship))
::
++  get-point
  |=  ship-name=term
  ^-  point
  =/  =ship  `@p`(slav %p ship-name)
  =/  unpoint  (get-unpoint-term ship-name)
  :*  ship
      unpoint
      (spa-count ship)
      (sponsor-chain ship unpoint)
      (probable-dominion ship unpoint)
  ==
++  get-npoint-from-nas
  |=  [=ship nas=^state:naive]
  ^-  npoint
  (need (get:orm:naive points.nas ship))
::
++  run-spawned-points
  |*  [agg=mold targ=ship nas=^state:naive filter=spawned-filter]
  |=  f=$-([agg [ship npoint]] agg)
  ^-  agg
  =|  =agg
  ?.  ?=(?(%czar %king) (clan:title targ))
    agg
  =+  points=points.nas
  |-
  ^-  _agg
  ?~  points
    agg
  =*  n  -.n.points
  =/  gt=?  (por:naive targ n)
  ?:  |(=(targ n) !gt)
    $(points r.points)
  =?  agg  =(targ (end (add 2 (xeb (met 3 targ))) n))
    $(points r.points)
  =/  should-agg
    ?&  =(targ (^sein:title n))
        ?|  =(filter %all)
            .=  =(filter %locked)  (is-npoint-locked +.n.points)
        ==
    ==
  =?  agg  should-agg
    (f agg n.points)
  $(points l.points)
++  get-spawned-points
  |=  [targ=ship filter=spawned-filter]
  =/  nas  get-nas
  %-  (run-spawned-points (list ship) targ nas filter)
  |=  [agg=(list ship) [spawn=ship *]]
  [spawn agg]
::
++  spa-count
  |=  targ=ship
  %-  (run-spawned-points @ud targ get-nas %all)
  |=  [agg=@ud [spawn=ship *]]
  +(agg)
::
++  search-opoints-patp
  |=  [=search-text expand-search=?]
  ^-  (list ship)
  =/  search-fulls
    ?:  expand-search
      (search-text-to-fulls search-text)
    ~[(search-text-to-full search-text)]
  (search-opoints search-fulls)
::
++  search-opoints-sigil
  |=  [=search-text]
  ^-  (list ship)
  =/  search-fulls
    ~[(sigil-search-text-to-full search-text)]
  (search-opoints search-fulls)
::
++  search-opoints
  |=  [search-fulls=(list search-full)]
  ^-  (list ship)
  =/  mr-searches  (maybe-reverse-searches search-fulls 1.000)
  :: ~&  (turn mr-searches |=(=mr-search pain.mr-search))
  :: ~&  mr-searches
  ?~  mr-searches  ~|(%search-predicted-too-broad !!)
  =/  res
    %+  roll  `(list mr-search)`mr-searches
    (run-mr-search fopoints ropoints)
  :: ~&  "search for {<search-text>}".
  ::     " returning {<~(wyt by agg.res)>}".
  ::     " of {<count.res>} results"
  (turn ~(tap in agg.res) head)
::
++  sponsor-chain
  |=  [=ship =unpoint]
  ^-  (list ^ship)
  ?~  unpoint  ~
  =/  sponsor  sponsor.net.u.unpoint
  ?.  has.sponsor  ~
  =/  spon  who.sponsor
  ?:  =(spon ship)  ~
  :-  spon
  =/  spon-point  (get-unpoint spon)
  $(ship spon, unpoint spon-point)
::
++  probable-dominion
  |=  [=ship =unpoint]
  ^-  dominion:naive
  ?^  unpoint
    dominion.u.unpoint
  =/  parent  (^sein:title ship)
  ?:  =(parent ship)  %l1
  =/  parent-point  (get-unpoint parent)
  $(ship parent, unpoint parent-point)
::
++  get-chart-data
  ^-  json
  =/  nas  get-nas
  =/  main-data
    ^-  tape
    %-  ~(rep by spam)
    |=  [[=ship kids=(map ship tape)] agg=tape]
    ^-  tape
    %+  weld  agg
    %+  pdata:smel  (ship:smel ship)
    (flop ~(val by kids))
  =/  gal-data
    %+  pdata:smel  "base"
    %+  turn  galaxies
    |=  gal=ship
    =/  npoint  (get-npoint-from-nas gal nas)
    (pdata:smel (pmeta:smel gal npoint) ~)
  s+(crip :(weld "[" gal-data main-data "]"))
::
::
++  groups-link-patch-card
  =/  catch  [%cord '/apps/groups/desk.js']
  =/  hatch  [%before "."]
  =/  patch  [/apps/astrolabe catch hatch groups-link-thatch]
  =/  patch-kit-vase  !>([/groups/astrolabe/link patch])
  [%pass /monkey/patch/groups/link %agent [our.bowl %monkey] %poke [%patch patch-kit-vase]]
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
