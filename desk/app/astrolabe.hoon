/-  *astrolabe
/+  *astrolabe, naive, default-agent, dbug, agentio
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
      [%x %search @ ~]
    =/  =search-text  (trip &3.path)
    ``astrolabe-point-set+!>((search-opoints:hc search-text))
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
  =?  state  ?=([%tx [* * * %spawn ship *] *] diff)
    %-  put-in-opoints
    ship.tx.raw-tx.diff
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
  |=  f=$-([agg @q] agg)
  ^-  agg
  =/  s-syls  search-syls.search
  ~&  s-syls
  =/  s-opts  search-opts.search
  =|  =agg
  =+  [llb=.~zod rrb=`@q`(sub (bex 32) 1)]
  =|  agg-count=@
  |-
  ^-  _agg
  ?~  points
    :: ~&  "nothing here, going up"
    agg
  =/  n=@q  `@`-.n.points
  =/  lrb=@q  ?:  (gth n 0)  (sub-d n 1)  .~zod
  =/  rlb=@q  (add-d n 1)
  =/  left-view  (range-contains-search llb lrb s-opts)
  :: ~&  "arrived at {<n>}"
  :: ~&  "left side: {<?:(contains.left-view 'Y' 'N')>} {<llb>} - {<lrb>} contains {<s-opts>}"
  =/  right-view  (range-contains-search rlb rrb s-opts)
  =?  agg  contains.left-view
    $(points l.points, rrb lrb, s-opts opts.left-view)
  =?  agg  (matches-search s-syls n)
    =/  fits  (fits-on-page agg-count page-info) 
    =.  agg-count  +(agg-count)
    ?:  fits  (f agg n)  agg
  :: ~&  "right side: {<?:(contains.right-view 'Y' 'N')>} {<rlb>} - {<rrb>} contains {<s-opts>}"
  =?  agg  contains.right-view
    $(points r.points, llb rlb, s-opts opts.right-view)
  agg
::
++  search-opoints
  |=  =search-text
  ^-  (list ship)
  =/  =search-full  (search-text-to-search-full search-text)
  =^  spoints  search-full
    (maybe-reverse-search search-full fopoints ropoints)
  =/  results
    %- 
      (run-wildcard-search (list @q) search-full points.spoints *page-info)
    |=  [agg=(list @q) result=@q]
    [result agg]
  =?  results  reversed.spoints
    (turn results switch-words)
  %-  flop
  (turn results to-p)
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
