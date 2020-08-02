# Plot Mode

Once you've added EFX, you can send the result to a pen plotter in `Plot Mode`

**NOTE**: I've tested all of this locally and it works fine. However, this is all beta, so I can't promise there aren't bugs or issues. I would run small tests with your plotter to make sure it's all good before doing anything serious.

![plot mode](_media/plot-mode.png ':class=docsImg')

## Layer Controls

The same controls in [Plot Mode](/draw-mode#layer-controls) apply to layers in EFX Mode.

## Plotter Status

![Plotter Status](_media/plot-mode-plot-status.png ':class=docsImg')

This shows the current status of the pen plotter. Possible states are:

* **SEARCHING**: lineboi3000 is checking for the Plotter
* **DISCONNECTED**: No pen plotter was found
* **SIMULATED**: CNCServer is connected but no Plotter was found. Plot actions will be simulated
* **CONNECTED**: A bona fide Pen Plotter was found. Plot actions will be sent to the real plotter

## Plot Actions

![Plot Actions](_media/plot-mode-plot-actions.png ':class=docsImg')

* **PLOT**: Start Plotting all lines on visible layers. 

## Pen Actions

* **PEN UP/DOWN**: Move the pen up or down to the set height
* **SET HEIGHTS**: Lock in the heights in the below options. 
* **PARK PEN**: Set pen state as X:0, Y:O and move
* **RETURN PEN TO START**: Delete Pen status and reset it to default position


To set heights, move the options below, then click `SET HEIGHTS`, then press `PEN UP` or `PEN DOWN` to check the output. Once the heights are set, the app will use those values when plotting.

## Plot Options 

![Plot Options](_media/plot-mode-pen-options.png ':class=docsImg')

* **OPTIMIZE LINE ORDER**: Order Plot lines to reduce the amount of pen travel, by finding the nearest next line to plot after finishing a given line. As a note I've seen slightly "off" results with this that might have to do with the physical difference between the sides of the pen tip,.
* **PEN UP HEIGHT**: Height when the pen is in Up state. 0 is highest.
* **PEN DOWN HEIGHT**: Height when the pen is in Down state. 1 is lowest.
* **SCALE**: Scale of the plotted lines in percent
