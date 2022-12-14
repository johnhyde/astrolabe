/+  naive, *mip
|%
+$  versioned-state
  $%  state-0
      state-1
      state-2
      state-3
      state-4
  ==
+$  state-latest  state-4
+$  state-0
  $:  %0
      spa=spawned
  ==
+$  state-1
  $:  %1
      fropoints-1
  ==
+$  state-2
  $:  %2
      spam=spawn-mip
      fropoints-1
  ==
+$  state-3
  $:  %3
      prev-spo=(map ship ship) :: so we know who the old sponsor was when sponsor changes
      spam=spawn-mip
      fropoints-1
  ==
+$  state-4
  $:  %4
      bump=_1  :: bump to update state without changing the type
      prev-spo=(map ship ship) :: so we know who the old sponsor was when sponsor changes
      spam=spawn-mip
      fropoints-1
  ==
::
+$  fropoints-1
  $:  fopoints=opoints :: forward ordered points
      ropoints=opoints :: reversed ordered points, e.g. .~palnet-sampel
  ==
+$  spawned  (jug ship ship)
+$  spawn-mip  (mip ship ship tape)
+$  opoints  (tree [@ @])  :: ordered points [ship ~]
::
+$  npoint  point:naive
++  unpoint  (unit npoint)
+$  point
  $:  =ship
      =unpoint
      spa-count=@ud
      sponsor-chain=(list ship)
      probable-dominion=dominion:naive
  ==
+$  spawned-filter  ?(%all %locked %unlocked)
::
::
--
