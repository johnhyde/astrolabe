/-  sur=astrolabe
=<  [sur .]
=,  sur
|%
++  search-text-chars  "*abcdefghilmnoprstuvwxyz"
++  sanitize-search-text
  |=  =search-text
  ^-  tape
  %+  skim  search-text
  |=  a=@t
  !=(~ (find [a]~ search-text-chars))
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
+$  opoints  (tree [ship @]) :: ordered points
++  ors  ((on ship @) rpor)
+$  pfsf  ?(%prefix %suffix)
+$  syl  [=tape =pfsf]
+$  search-text  tape
+$  search-syls  (list syl)    :: in reverse order, e.g. ["net" "pal" "pel" "sam" ~]. length 1-4
+$  search-syl-opts  (list @q)
+$  search-opts  (list search-syl-opts) :: must have length 4
+$  search-full
  $:
    =search-syls
    =search-opts
  ==
+$  page-info  [size=_100 page=_0]
++  fits-on-page
  |=  [i=@ =page-info]
  ^-  ?
  =,  page-info
  ?:  =(0 size)  %.y
  =/  page-start  (mul size page)
  =/  page-end  (add page-start size)
  &((gte i page-start) (lth i page-end))
++  search-syl-to-search-syl-opts
  |=  search=syl
  ^-  search-syl-opts
  =/  syls=(list @t)
    %+  rip  [0 24] :: jet doesn't support rip [3 3] which is equivalent
    ?:  =(%prefix pfsf.search)  sis:po  dex:po
  ~!  syls
  ~!  search
  %+  murn  syls
  |=  cand=@t
  ?.  (tape-matches tape.search (trip cand))  ~
  %-  ?:  =(%prefix pfsf.search)  ins:po  ind:po
  cand
++  search-text-to-search-syls
  |=  search-text=tape
  ^-  search-syls
  =.  search-text  (sanitize-search-text search-text)
  =/  syl-tapes
    %+  turn
      %-  flop
      (rip [0 24] (crip search-text)) :: jet doesn't support rip [3 3] which is equivalent
    trip
  =|  count=@
  |-
  ^-  search-syls
  =/  =pfsf
    ?:  =(0 (mod count 2))  %suffix  %prefix
  ?~  syl-tapes  ~
  :-  [i.syl-tapes pfsf]
  $(syl-tapes t.syl-tapes, count +(count))

++  search-syls-to-search-opts
  |=  =search-syls
  ^-  search-opts
  =/  opts
    %+  turn
      search-syls
    |=  =syl
    (search-syl-to-search-syl-opts syl)
  |-
  ?:  (gte (lent opts) 4)
    opts
  $(opts (snoc (search-opts opts) (search-syl-opts ~[.~zod])))
++  search-text-to-search-full
  |=  search-text=tape
  ^-  search-full
  =/  =search-syls  (search-text-to-search-syls search-text)
  :-  search-syls
  (search-syls-to-search-opts search-syls)
::
++  reverse-list     :: that is, put first 2 in back "abcd" -> "cdab"
  |*  lst=(list)
  ^-  _lst
  %+  weld
    (slag 2 lst)
  (scag 2 lst)
++  pad-search-syls
  |=  =search-syls
  ^-  ^search-syls
  =/  padding  (search-text-to-search-syls "dozzoddozzod")
  %+  weld
    search-syls
  (slag (lent search-syls) padding)
++  reverse-search
  |=  search=search-full
  ^-  search-full
  :-  (reverse-list (pad-search-syls search-syls.search))
  (reverse-list search-opts.search)
++  estimate-search-pain
  |=  search=search-full
  =/  opts  search-opts.search
  =|  acc=@
  |-
  ?~  opts  acc
  =/  new-acc
    (add (mul acc 2) (lent i.opts))
  $(acc new-acc, opts t.opts)
:: ++  estimate-search-pain
::   |=  search=search-full
::   =/  max-pain  (bex 32)
::   =/  opts  search-opts.search
::   =|  acc=@
::   |-
::   ?~  opts  acc
::   =/  level-pain  (div (mul max-pain (lent i.opts)) 256)
::   =/  new-acc
::     (add (mul acc 2) (lent i.opts))
::   $(acc new-acc, opts t.opts)
++  estimate-search-text-pain
  |=  =search-text
  (estimate-search-pain (search-text-to-search-full search-text))
++  maybe-reverse-search
  |=  [search=search-full fopoints=opoints ropoints=opoints]
  ^-  [[points=opoints reversed=? pain=@] =search-full]
  =/  search-pain  (estimate-search-pain search)
  =/  rsearch  (reverse-search search)
  =/  rsearch-pain  (estimate-search-pain rsearch)
  ?:  (gth search-pain rsearch-pain)
    [[ropoints %.y rsearch-pain] rsearch]
  [[fopoints %.n search-pain] search]
++  tape-matches
  |=  [search=tape cand=tape]
  ^-  ?
  |-
  ?~  search  %.y
  ?~  cand  %.n
  ?:  |(=(i.search i.cand) =(i.search '*'))
    $(search t.search, cand t.cand)
  %.n
++  tosd
  |=  [a=@ =pfsf]
  %-  ?:(=(%prefix pfsf) tos:po tod:po)
  a
++  syl-equals
  |=  [=syl cand=@]
  =((crip tape.syl) (tosd cand pfsf.syl))
++  syl-matches
  |=  [=syl cand=@]
  ::  todo check cand < 256
  (tape-matches tape.syl (trip (tosd cand pfsf.syl)))
++  matches-search
  |=  [search=search-syls cand-atom=@]
  =/  cand  (rip 3 cand-atom)
  |-
  ^-  ?
  ?~  search  =(cand ~)
  :: =?  cand  =(cand ~)
  ::   `(lest @)`~[0]
  ?~  cand
    ?&  (syl-equals i.search 0)
        $(search t.search)
    ==
  :: =/  nncand  ^-  (lest @) 
  ::   ?~  cand  ~[0]  cand
  ?&  (syl-matches i.search i.cand)
      $(search t.search, cand t.cand)
  ==
::
++  opts-in-range
  |=  [lb=@ rb=@ opts=(list @)]
  ^-  search-syl-opts
  %+  skim
    opts
  |=  a=@
  &((lte lb a) (gte rb a))
::
++  range-contains-search
  |=  [lb=@ rb=@ search=search-opts] :: includes lb and rb - [lb, rb]
  ^-  [opts=search-opts contains=?]
  ?~  search  `%.y
  =/  s-0  i.search
  ?~  s-0  `%.n
  =/  lb-0  (end 3 lb)
  =/  rb-0  (end 3 rb)
  =/  cand-0  (opts-in-range lb-0 rb-0 s-0)
  =/  cand-0-len  (lent cand-0)
  :: ~&  "lb: {<`@q`lb>} rb: {<`@q`rb>} cand-len: {<cand-0-len>}"
  ?:  =(0 cand-0-len)  `%.n
  =.  i.search  cand-0
  :_
    ?:  (gte cand-0-len 3)  %.y  :: entire valid galaxy is bounded
    =/  lb-clean  =(0 (rsh 3 lb)) :: lb is galaxy
    =/  rb-clean  =(0 (rsh 3 (add-d rb 1))) :: rb is last planet in galaxy
    ?:  &(=(2 cand-0-len) |(lb-clean rb-clean))
      %.y  :: two galaxies, and one is right on the edge (fully bounded)
    |-
    ^-  ?
    ?~  cand-0  %.n
    =/  crb  (add .~fipfes-fipzod i.cand-0)
    =/  slb  (rev-q (rev-f max lb i.cand-0))
    =/  srb  (rev-q (rev-f min rb crb))
    =/  sub-contains  +:^$(lb (rsh 3 slb), rb (rsh 3 srb), search t.search)
    ?:  sub-contains  %.y
    $(cand-0 t.cand-0)
  search
  ::  check that first byte of lb and rb contain something that matches first of search
  ::  if contains full matching galaxy, return true
  ::  if contains no more than part of any galaxy, check those galaxies (1 or 2)
  :: 
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
