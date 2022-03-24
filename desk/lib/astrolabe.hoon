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
    |=  =upoint
    ^-  json
    ?~  upoint  (pairs ~)
    =*  point  u.upoint
    %+  frond  %point
    %-  pairs  :~
        [%dominion s+dominion.point]
        :-  %own
      =*  own  own.point
      %-  pairs  :~
          owner+(address owner.own)
          spawn-proxy+(address spawn-proxy.own)
          management-proxy+(address management-proxy.own)
          voting-proxy+(address voting-proxy.own)
          transfer-proxy+(address transfer-proxy.own)
      ==
        :-  %net
      =*  net  net.point
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
    ^-  upoint  ~
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
