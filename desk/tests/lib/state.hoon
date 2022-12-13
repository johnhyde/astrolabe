/-  *astrolabe
/+  *astrolabe, *state, *test
|%
++  test-put-in-spawn-mip
  =|  state=state-latest
  =/  moved-to-bus=npoint
    =<  .(who.sponsor.net ~bus)
    *npoint
  =/  moved-to-hec=npoint
    =<  .(who.sponsor.net ~hec)
    *npoint
  ;:  weld
    %+  expect-eq
      !>  :-
        `~zod  :: new prev-spo
      %.y  :: spawn-mip has something under ~zod
    !>  =-  :-
        (~(get by prev-spo) ~marzod)
      (~(has by spam) ~zod)
    (put-in-spawn-mip ~marzod *npoint state)
    ::
    %+  expect-eq
      !>  :*
        `~hec  :: new prev-spo
        %.n  :: nothing under ~zod
        %.n  :: nothing under ~bus
        %.y  :: something under ~hec
      ==
    !>
    =.  state  (put-in-spawn-mip ~marzod *npoint state)
    =.  state  (put-in-spawn-mip ~marzod moved-to-bus state)
    =+  (put-in-spawn-mip ~marzod moved-to-hec state)
    :*
      (~(get by prev-spo) ~marzod)
      (~(has by spam) ~zod)
      (~(has by spam) ~bus)
      (~(has by spam) ~hec)
    ==
    ::
    %+  expect-eq
      !>  :*
        `~zod  :: new prev-spo
        %.y  :: something under ~zod
        %.n  :: nothing under ~bus
        %.n  :: something under ~hec
      ==
    !>
    =.  state  (put-in-spawn-mip ~marzod *npoint state)
    =.  state  (put-in-spawn-mip ~marzod moved-to-bus state)
    =.  state  (put-in-spawn-mip ~marzod moved-to-hec state)
    =+  (put-in-spawn-mip ~marzod *npoint state)
    :*
      (~(get by prev-spo) ~marzod)
      (~(has by spam) ~zod)
      (~(has by spam) ~bus)
      (~(has by spam) ~hec)
    ==
  ==
--