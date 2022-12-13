/-  sur=astrolabe
/+  azimuth, naive
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
++  ors  ((on @q @) rpor)
++  or-meta  ((on @p tape) por:naive)
++  bi-meta
  =|  a=(map * (map)) 
  |@
  ++  put
    |*  [b=* c=* d=*]
    %+  ~(put by a)  b
    %+  put:or-meta
      (~(gut by a) b ~)
    [c d]
  --
::
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
++  is-npoint-locked
  |=  p=npoint
  .=  linear-star-release:contracts:azimuth
  address.owner.own.p
::
++  split
  |*  [nedl=(list) hstk=(list)]
  |-  ^-  (list _hstk)
  =/  brk  (find nedl hstk)
  ?~  brk  ~[hstk]
  =/  next  (add u.brk (lent nedl))
  :-  (scag u.brk hstk)
  $(hstk (slag next hstk))
::
++  smel
  |%
  ++  ship
    |=  =^ship
    ^-  tape
    (slag 1 (scow %p ship))
  ++  dom
    |=  =dominion:naive
    ?-  dominion
      %l1  ""
      %l2  "t"
      %spawn  "s"
    ==
  ++  spo
    |=  [self=^ship has=? spo=^ship]
    ?.  has  "~"
    =/  parent  (^sein:title self)
    ?:  =(spo parent)
      ""
    :(weld ":" (ship spo) "!" (ship parent))
  ++  pmeta
    |=  [self=^ship point=npoint]
    ^-  tape
    =/  self-str  (ship self)
    =/  extras  (weld (dom dominion.point) (spo self sponsor.net.point))
    ?~  extras  self-str
    :(weld self-str ":" extras)
  ++  spa
    |=  children=(list tape)
    =/  chil-str=tape  (zing children)
    :: =/  chil-str=tape  (reel children |=([a=tape b=tape] (weld a b)))
    ?~  chil-str  ";"
    :(weld "[" chil-str "]")
  ++  pdata
    |=  [pmeta=tape children=(list tape)]
    ^-  tape
    (weld pmeta (spa children))
  --
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
