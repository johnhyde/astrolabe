/-  sur=astrolabe
=<  [sur .]
=,  sur
|%
++  nu                                              ::  parse number as hex
  |=  jon=json
  ?>  ?=([%s *] jon)
  (rash p.jon hex)
::
++  enjs
  =,  enjs:format
  |%
  ++  point
    |=  =^point
    ^-  json
    =*  unpoint  unpoint.point
    ?~  unpoint  (pairs ~)
    =*  npoint  u.unpoint
    %+  frond  %point
    %-  pairs  :~
        spa-count+(numb spa-count.point)
        [%probable-dominion s+probable-dominion.point]
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
