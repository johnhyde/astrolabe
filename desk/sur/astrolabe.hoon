/+  naive
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
+$  point-meta
  $:  =ship
      :: spa-count=@ud
      dom=dominion:naive
      spo=[has=?(%none %same %diff) who=ship]
      :: moons=(list ship)
  ==
:: +$  point-chart-data
::   $%  [%czar point-meta spa=chart-data]
::       [%king point-meta spa=chart-data]
::       [%duke point-meta]
::   ==
+$  point-chart-data  [point-meta spa=chart-data]
:: +$  star-chart-data  [self=point planets=(list point)]
:: +$  galaxy-chart-data  stars=(list star-chart-data)
++  chart-data
  |-
  $@  ~
  (list [point-meta spa=$])

--
