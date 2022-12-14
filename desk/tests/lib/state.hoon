/-  *astrolabe
/+  *astrolabe, *state, *mip, *test
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
      "marzod:s;"  :: spawn-mip has something under ~zod
    !>  =-  :-
        (~(get by prev-spo) ~marzod)
      (~(gut bi spam) ~zod ~marzod "nothing!")
    (put-in-spawn-mip ~marzod *npoint state)
    ::
    %+  expect-eq
      !>  :*
        `~hec  :: new prev-spo
        "marzod:s:hec!zod;"  :: under ~zod
        %.n  :: nothing under ~bus
        "marzod:s:hec!zod;"  :: under ~hec
      ==
    !>
    =.  state  (put-in-spawn-mip ~marzod *npoint state)
    =.  state  (put-in-spawn-mip ~marzod moved-to-bus state)
    =+  (put-in-spawn-mip ~marzod moved-to-hec state)
    :*
      (~(get by prev-spo) ~marzod)
      (~(gut bi spam) ~zod ~marzod "nothing!")
      (~(has by spam) ~bus)
      (~(gut bi spam) ~hec ~marzod "nothing!")
    ==
    ::
    %+  expect-eq
      !>  :*
        `~zod  :: new prev-spo
        "marzod:s;"  :: under ~zod
        %.n  :: nothing under ~bus
        %.n  :: nothing under ~hec
      ==
    !>
    =.  state  (put-in-spawn-mip ~marzod *npoint state)
    =.  state  (put-in-spawn-mip ~marzod moved-to-bus state)
    =.  state  (put-in-spawn-mip ~marzod moved-to-hec state)
    =+  (put-in-spawn-mip ~marzod *npoint state)
    :*
      (~(get by prev-spo) ~marzod)
      (~(gut bi spam) ~zod ~marzod "nothing!")
      (~(has by spam) ~bus)
      (~(has by spam) ~hec)
    ==
  ==
--