/-  sur=astrolabe
/+  azimuth
=<  [sur .]
=,  sur
|%
++  to-q  fein:ob
++  to-p  fynd:ob
++  rev-q
  |=  a=@
  (rev 3 4 a)
++  switch-words
  |=  a=@
  (rev 4 2 a)
++  add-d
  |=  [a=@ b=@]
  (rev-q (add (rev-q a) b))
++  sub-d
  |=  [a=@ b=@]
  (rev-q (sub (rev-q a) b))
++  rev-f
  |*  [f=$-([@ @] *) a=@ b=@]
  (f (rev-q a) (rev-q b))
++  rpor                        :: reversed parent order
  |=  [a=@ b=@]
  ^-  ?
  (rev-f lte a b)
::
+$  opoints  (tree [@ @]) :: ordered points [ship ~]
++  ors  ((on @q @) rpor)
+$  page-info  [size=_100 page=_0]
++  fits-on-page
  |=  [i=@ =page-info]
  ^-  ?
  =,  page-info
  ?:  =(0 size)  %.y
  =/  page-start  (mul size page)
  =/  page-end  (add page-start size)
  &((gte i page-start) (lth i page-end))
::
++  palor                                           ::  @p alphabetical order
  ~/  %por
  |=  [a=@p b=@p]
  ^-  ?
  ?:  =(a b)  &
  =|  i=@
  |-
  ?:  =(i 2)
    ::  second two bytes
    (lte a b)
  ::  first two bytes
  =+  [c=(end 3 a) d=(end 3 b)]
  ?:  =(c d)
    $(a (rsh 3 a), b (rsh 3 b), i +(i))
  (lth c d)
::
++  is-npoint-locked
  |=  p=npoint
  .=  linear-star-release:contracts:azimuth
  address.owner.own.p
::
++  nu                                              ::  parse number as hex
  |=  jon=json
  ?>  ?=([%s *] jon)
  (rash p.jon hex)
::
++  enjs
  =,  enjs:format
  |%
  ++  point-set
    |=  points=(list ^ship)
    ^-  json
    %+  frond  %points
    :-  %a
    %+  turn
      points
    |=  who=^ship
    (ship who)
  ++  point
    |=  =^point
    ^-  json
    =*  unpoint  unpoint.point
    =*  npoint  u.unpoint
    %+  frond  %point
    %-  pairs  :*
        ship+(ship ship.point)
        spa-count+(numb spa-count.point)
        [%probable-dominion s+probable-dominion.point]
        [%sponsor-chain a+(turn sponsor-chain.point ship)]
        ?~  unpoint  ~
        :_  ~
        :-  %npoint
      %-  pairs  :~
          [%dominion s+dominion.npoint]
          :-  %own
        =*  own  own.npoint
        %-  pairs  :~
            owner+(address owner.own)
            spawn-proxy+(address spawn-proxy.own)
            management-proxy+(address management-proxy.own)
            voting-proxy+(address voting-proxy.own)
            transfer-proxy+(address transfer-proxy.own)
        ==
          :-  %net
        =*  net  net.npoint
        %-  pairs
        :~  rift+(numb rift.net)
            :-  %keys
          %-  pairs  :~
            life+(numb life.keys.net)
            suite+(numb suite.keys.net)
            auth+(numb auth.keys.net)
            crypt+(numb crypt.keys.net)
          ==
            :-  %sponsor
          %-  pairs  :~
            has+b+has.sponsor.net
            who+(ship who.sponsor.net)
          ==
            :-  %escape
          (biff escape.net ship)
        ==
      ==
    ==
  ++  address
    |=  [address=@ux nonce=@ud]
    ^-  json
    %-  pairs
    :~  address+(numb-ux address)
        nonce+(numb nonce)
    ==
  ++  numb-ux
    |=  a=@
    ^-  json
    ?~  a  ~
    s+(remove-dots (scot %ux a))
  ++  remove-dots
    |=  a=@ta
    ^-  @ta
    =+  b=(rip 3 a)
    %+  rap  3
    |-  ^-  ^tape
    ?~  b
      ~
    ?:  =('.' i.b)  $(b t.b)
    [i.b $(b t.b)]
  ++  point-meta
    |=  m=^point-meta
    ^-  (list [@tas json])
    =/  main-pairs
      :~
          p+(ship ship.m)
          :: spa-count+(numb spa-count.m)
          [%d s+dom.m]
      ==
    ?:  =(has.spo.m %same)  main-pairs
    :_  main-pairs
    :-  %s
    ?:  =(has.spo.m %none)  ~
    (ship who.spo.m)
  ::
  ++  point-chart-data
    |=  d=^point-chart-data
    ^-  json
    =/  point-meta-pairs  (point-meta -.d)
    %-  pairs
    ?~  spa.d  point-meta-pairs
    %+  snoc  point-meta-pairs
    c+(chart-data spa.d)
    :: spa+a+~ 
  ::
  ++  chart-data
    |=  d=^chart-data
    ^-  json
    :-  %a
    (turn d point-chart-data)
  --
::
++  dejs
  =,  dejs:format
  |%
  ++  point
    |=  jon=json
    *^point
  --
::
++  share-dejs
  =,  dejs:format
  |%
  ++  share  
      ^-  $-(json [%share ship])
      (of share+(su ;~(pfix sig fed:ag)) ~)
  --
--
