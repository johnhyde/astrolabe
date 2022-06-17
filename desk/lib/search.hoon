/-  sur=astrolabe
/+  *astrolabe
=<  [sur .]
=,  sur
|%
++  search-text-chars  "*abcdefghilmnoprstuvwxyz"
++  trip-syls
  |=  syls=cord
  %+  turn
    (rip [0 24] syls)
  trip
++  prefixes  ^~  (trip-syls sis:po)
++  suffixes  ^~  (trip-syls dex:po)
++  full-opts  ^~  (gulf .~zod .~fes)
++  sanitize-search-text
  |=  =search-text
  ^-  tape
  %+  skim  search-text
  |=  a=@t
  !=(~ (find [a]~ search-text-chars))
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
+$  mr-search  :: maybe reversed full search
  $:
    [reversed=? pain=@]
    =search-full
  ==
++  search-syl-to-search-syl-opts
  |=  search=syl
  ^-  search-syl-opts
  =/  syls
    ?:  =(%prefix pfsf.search)  prefixes  suffixes
  ?:  =(tape.search "***")  full-opts
  %+  murn  syls
  |=  cand=tape
  ?.  (tape-matches tape.search cand)  ~
  %-  ?:  =(%prefix pfsf.search)  ins:po  ind:po
  (crip cand)
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
::
++  search-syls-to-search-opts
  |=  =search-syls
  ^-  search-opts
  =/  opts
    %+  turn
      search-syls
    |=  =syl
    (search-syl-to-search-syl-opts syl)
  ?:  %+  lien  opts
      |=  syl-opts=search-syl-opts
      =(~ syl-opts)
    ~[~ ~ ~ ~]
  |-
  ?:  (gte (lent opts) 4)
    opts
  $(opts (snoc (search-opts opts) (search-syl-opts ~[.~zod])))
::
++  search-text-to-full
  |=  search-text=tape
  ^-  search-full
  =/  =search-syls  (search-text-to-search-syls search-text)
  :-  search-syls
  (search-syls-to-search-opts search-syls)
::
++  expand-search-text-to-len
  |=  [search=tape flen=@ud rotate=?]
  =.  search  (sanitize-search-text search)
  |-
  ^-  (list tape)
  =+  slen=(lent search)
  ?:  =(slen flen)
    ~[search]
  ?:  (gth slen flen)  ~
  :-
    (weld search (reap (sub flen slen) '*'))
  ?.  rotate  ~
  $(search (weld "*" search))
::
++  expand-search-text
  |=  search=tape
  ^-  (list tape)
  =.  search  (sanitize-search-text search)
  ?~  search  ~
  =/  rotate
    ?&  !=('~' i.search)
        !(levy (tape search) (cury test '*'))  :: is all wild
    ==
  =/  expand  (cury expand-search-text-to-len search)
  ;:  weld
      (expand 3 rotate)
      (expand 6 rotate)
      (expand 12 rotate)
  ==
::
++  search-text-to-fulls
  |=  search=tape
  ^-  (list search-full)
  =/  texts  (expand-search-text search)
  %+  murn
    texts
  |=  text=tape
  =/  full  (search-text-to-full text)
  ?:  =(~[~ ~ ~ ~] search-opts.full)
    ~
  (some full)
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
  (estimate-search-pain (search-text-to-full search-text))
++  maybe-reverse-search
  |=  [search=search-full]
  ^-  mr-search
  =/  search-pain  (estimate-search-pain search)
  =/  rsearch  (reverse-search search)
  =/  rsearch-pain  (estimate-search-pain rsearch)
  ?:  (gth search-pain rsearch-pain)
    [[%.y rsearch-pain] rsearch]
  [[%.n search-pain] search]
::
++  maybe-reverse-searches
  |=  [searches=(list search-full) pain-thresh=@]
  =|  pain=@
  |-
  ^-  (list mr-search)
  ?~  searches  ~
  =/  mr  (maybe-reverse-search i.searches)
  =/  new-pain  (add pain pain.mr)
  ?:  (gth new-pain pain-thresh)
    $(searches t.searches)
  :-  mr
  $(searches t.searches, pain new-pain)
::
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
::
--
