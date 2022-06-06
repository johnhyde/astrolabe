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
      =opoints
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
  ^-  _opoints
  (put:ors opoints (to-q ship) ~)
++  on-naive-state
  |=  nas=^state:naive
  ^-  (quip card _state)
  =+  points=points.nas ::  =points, eh?
  =.  opoints
    |-
    ^-  _opoints
    ?~  points  opoints
    =/  =ship  -.n.points
    ::  traverse tree of points and add @ps to opoints with ^sein, you know
    =.  opoints  (put-in-opoints ship)
    $(points l.points, opoints $(points r.points))
  `state
::
++  on-naive-diff
  |=  =diff:naive
  ^-  (quip card _state)
  =?  opoints  ?=([%tx [* * * %spawn ship *] *] diff)
    %-  put-in-opoints
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
  |*  [agg=mold search=search-full =page-info]
  |=  f=$-([agg @q] agg)
  ^-  agg
  =/  s-syls  search-syls.search
  ~&  s-syls
  =/  s-opts  search-opts.search
  =+  =agg
  =+  [llb=.~zod rrb=`@q`(sub (bex 32) 1)]
  =|  agg-count=@
  |-
  ^-  _agg
  ?~  opoints
    :: ~&  "nothing here, going up"
    agg
  =*  n=@q  `@`-.n.opoints
  =/  lrb=@q  ?:  (gth n 0)  (sub-d n 1)  .~zod
  =/  rlb=@q  (add-d n 1)
  =/  left-view  (range-contains-search llb lrb s-opts)
  :: ~&  "arrived at {<n>}"
  :: ~&  "left side: {<?:(contains.left-view 'Y' 'N')>} {<llb>} - {<lrb>} contains {<s-opts>}"
  =/  right-view  (range-contains-search rlb rrb s-opts)
  =?  agg  contains.left-view
    $(opoints l.opoints, rrb lrb, s-opts opts.left-view)
  =?  agg  (matches-search s-syls n)
    =/  fits  (fits-on-page agg-count page-info) 
    =.  agg-count  +(agg-count)
    ?:  fits  (f agg n)  agg
  :: ~&  "right side: {<?:(contains.right-view 'Y' 'N')>} {<rlb>} - {<rrb>} contains {<s-opts>}"
  =?  agg  contains.right-view
    $(opoints r.opoints, llb rlb, s-opts opts.right-view)
  agg
::
++  search-opoints
  |=  =search-text
  ^-  (list ship)
  =/  =search-full  (search-text-to-search-full search-text)
  =/  results
    %-  (run-wildcard-search (list @q) search-full *page-info)
    |=  [agg=(list @q) result=@q]
    [result agg]
  %-  flop
  (turn results to-p)
::
++  sponsor-chain
  |=  =unpoint
  ^-  (list ship)
  ?~  unpoint  ~
  =/  sponsor  sponsor.net.u.unpoint
  ?.  has.sponsor  ~
  [who.sponsor ~] ::  todo: lookup parent
::
++  probable-dominion
  |=  =unpoint
  ^-  dominion:naive
  ?^  unpoint
    dominion.u.unpoint
  %l1 ::  todo: lookup parent
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
