/+  naive, *mip
|%
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
+$  spawn-mip  (mip ship ship tape)
::
--
