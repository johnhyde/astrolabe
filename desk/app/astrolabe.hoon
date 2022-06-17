/-  *astrolabe
/+  *astrolabe, *search, naive, default-agent, dbug, agentio
/$  udon-to-docu  %udon  %docu
|%
+$  versioned-state
  $%  state-0
      state-1
  ==
+$  state-0
  $:  %0
      spa=spawned
  ==
+$  state-1
  $:  %1
      fopoints=opoints :: forward ordered points
      ropoints=opoints :: reversed ordered points, e.g. .~palnet-sampel
  ==
::
+$  spawned  (jug ship ship)
+$  card  card:agent:gall
--
%-  agent:dbug
=|  state-1
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
  =^  cards-0  old
    ?.  ?=(%0 -.old)  `old
    (on-naive-state:hc get-nas:hc)
  ?>  ?=(%1 -.old)
  [cards-0 this(state old)]
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
      [%x %point @ %spawned ~]
    =/  =ship  `@p`(slav %p &3.path)
    ``astrolabe-point-set+!>((get-spawned-points:hc ship))
      [%x %search @ ?(~ [%narrow ~])]
    =/  =search-text  (trip &3.path)
    =/  expand-search  =(t.t.t.path ~)
    ``astrolabe-point-set+!>((search-opoints:hc search-text expand-search))
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
:: Helper Core
|_  =bowl:gall
++  scrio  ~(scry agentio bowl)
++  az-events-card  [%pass /azimuth-events %agent [our.bowl %azimuth] %watch /event]
++  get-nas  .^(^state:naive %gx (scrio %azimuth /nas/noun))
++  put-in-opoints
  |=  =ship
  ^-  _state
  =.  fopoints
    (put:ors fopoints (to-q ship) ~)
  =.  ropoints
    (put:ors ropoints (switch-words (to-q ship)) ~)
  state
++  on-naive-state
  |=  nas=^state:naive
  ^-  (quip card _state)
  =+  points=points.nas ::  =points, eh?
  :-  ~
  |-
  ^-  _state
  ?~  points  state
  =/  =ship  -.n.points
  =.  state  (put-in-opoints ship)
  $(points l.points, state $(points r.points))
::
++  on-naive-diff
  |=  =diff:naive
  ^-  (quip card _state)
  ~&  %+  weld  "received diff:naive: {<-.diff>}"
  ?+  -.diff  ""
    %nonce  " ship: {<ship.diff>}"
    %tx  " from: {<ship.from.tx.raw-tx.diff>} - {<+<.tx.raw-tx.diff>}"
    %point  " ship: {<ship.diff>} - {<+>-.diff>}"
    ==
  =?  state  ?=([%tx [* * * %spawn ship *] *] diff)
    %-  put-in-opoints
    ship.tx.raw-tx.diff
  =?  state  ?=([%point @ %owner *] diff)
    %-  put-in-opoints
    ship.diff
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
::
++  run-spawned-points
  |*  [agg=mold targ=ship]
  |=  f=$-([agg ship] agg)
  ^-  agg
  =/  nas  get-nas
  =+  points=points.nas
  =|  agg=agg
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
  =?  agg  =(targ (^sein:title n))
    (f agg n)
  $(points l.points)
++  get-spawned-points
  |=  targ=ship
  %-  (run-spawned-points (list ship) targ)
  |=  [agg=(list ship) spawn=ship]
  [spawn agg]
::
++  spa-count
  |=  targ=ship
  %-  (run-spawned-points @ud targ)
  |=  [agg=@ud spawn=ship]
  +(agg)
::
++  run-wildcard-search
  |*  [agg=mold search=search-full points=opoints =page-info]
  |=  [res=[count=@ =agg] f=$-([agg @q] agg)]
  ^-  [count=@ =agg]
  =/  s-syls  search-syls.search
  :: ~&  s-syls
  =/  s-opts  search-opts.search
  =+  [llb=.~zod rrb=`@q`(sub (bex 32) 1)]
  :: =<  +
  |-
  ^-  _res
  ?~  points
    :: ~&  "nothing here, going up"
    res
  ?:  (gth count.res 1.000)  ~|(%search-too-broad !!)
  =/  n=@q  `@`-.n.points
  =/  lrb=@q  ?:  (gth n 0)  (sub-d n 1)  .~zod
  =/  rlb=@q  (add-d n 1)
  =/  left-view  (range-contains-search llb lrb s-opts)
  :: ~&  "arrived at {<n>}"
  :: ~&  "left side: {<?:(contains.left-view 'Y' 'N')>} {<llb>} - {<lrb>}"
  =/  right-view  (range-contains-search rlb rrb s-opts)
  =?  res  contains.left-view
    $(points l.points, rrb lrb, s-opts opts.left-view)
  =?  res  (matches-search s-syls n)
    =/  fits  (fits-on-page count.res page-info) 
    =.  count.res  +(count.res)
    =?  agg.res  fits  (f agg.res n)
    res
  :: ~&  "right side: {<?:(contains.right-view 'Y' 'N')>} {<rlb>} - {<rrb>}"
  =?  res  contains.right-view
    $(points r.points, llb rlb, s-opts opts.right-view)
  res
::
++  run-mr-search
  |=  [search=mr-search res=[count=@ agg=opoints]]
  ^-  _res
  =/  points  ?:  reversed.search  ropoints  fopoints
  =.  res
    %+  (run-wildcard-search _agg.res search-full.search points [0 0])
      res
    |=  [agg=_agg.res result=@q]
    =?  result  reversed.search
      (switch-words result)
    =.  result  (to-p result)
    (put:((on @ @) gte) agg result ~)
  :: ~&  "returning {<~(wyt by agg.res)>} of {<count.res>} results"
  res
++  search-opoints
  |=  [=search-text expand-search=?]
  ^-  (list ship)
  =/  search-fulls
    ?:  expand-search
      (search-text-to-fulls search-text)
    ~[(search-text-to-full search-text)]
  :: ~&  (turn search-fulls |=(=search-full search-syls.search-full))
  =/  mr-searches  (maybe-reverse-searches search-fulls 2.820)
  :: ~&  (turn mr-searches |=(=mr-search pain.mr-search))
  :: ~&  mr-searches
  ?~  mr-searches  ~|(%search-predicted-too-broad !!)
  =/  res
    %+  roll  `(list mr-search)`mr-searches
    run-mr-search
  ~&  "search for {<search-text>} returning {<~(wyt by agg.res)>} of {<count.res>} results"
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
