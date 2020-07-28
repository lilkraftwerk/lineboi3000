# Draw Mode

![draw mode](_media/draw-mode.png ':class=docsImg')

## Layer Controls

Layer controls apply in both Draw Mode and Efx Mode. Find them on the top bar.

Layers in Draw Mode and Efx Mode are displayed left to right. The layer on the far left is on bottom, the layer on the far right is on top. The selected layer has a green background.

### Layer Interface

![layer controls](_media/layer-controls.png ':class=docsImg')

# Global Options

![global draw options](_media/global-draw-options.png ':class=docsImg')

-   **Lines**: Sum of all lines on currently visible layers
-   **Points**: Sum of all points on currently visible layers
-   **Points On/Off**: Click to highlight each point in the currently visible layers
-   **Grid On/Off**: Click to show a square grid. Click the buttons to the right to make the grid squares bigger or smaller

# Drawing Submodes

![layer controls](_media/draw-modes.png ':class=docsImg')

## Tools

![draw mode tools](_media/draw-mode-tools.png ':class=docsImg')

To use a tool, select one, then click and drag on the canvas while in Draw mode. Alternatively you can move the mouse and hold the Shift key to draw (good for trackpads or people with sore fingers).

### Pen

Draw a line.

### Fill Brush

Draw an area that will then be filled with lines at a spacing/angle/density you can select.

### Eraser

Erase points under the area you've drawn. If points to be erased are within a line, the line will be split into multiple lines

### Shapes

Draw a straight line, square/rectangle, or circle

### Text

![draw mode text options](_media/draw-mode-text-options.png ':class=docsImg')

-   **Text Content**: What you want to appear
-   **Font Size**: How big you want it to be
-   **Font Selector**: Font face you want to use (click left and right to pick another)
-   **Outline**: Enable to print the outline around the inner part of the text
-   **Distance Between letters**: Distance between letters in px
-   **Distance Between Words**: Distance between words in px

Fill Options (add link) also apply to the text output.

## Scale Tools

![draw mode text options](_media/draw-mode-scale-options.png ':class=docsImg')

### Shrink

Shrink the current canvas by a given fraction. Click the fraction you wanna use and then `Shrink Canvas` to apply.

![draw mode text options](_media/draw-mode-scale-shrink-options.png ':class=docsImg')

**Note:** Points and lines are not smoothed or manipulated when shrunk. If you have a high number of points/lines, the count will remain the same. If you then multiply this canvas you might have a massive number of points/lines, which could make some processing take longer.

### Multiply

Take the current canvas and multiply it a given number of times. The image you have currently on each layer will be added X times to the width and Y times to the height.

![draw mode text options](_media/draw-mode-scale-multiply-options.png ':class=docsImg')

Select how many times to multiply by X and Y. The number shown is the final height by width of the output.

## Template

Add lines to the current layer based on a template or generator. Select one and then hit `APPLY` to add it to the current layer.

![draw mode text options](_media/draw-mode-template-options.png ':class=docsImg')

-   **Frame**: Big rectangle or square around the edge of your canvas
-   **One Circle**: Big circle nearing the edge of your canvas
-   **Many Circles**: A lot of circles, from big to little depending on your options
-   **Many Squares**: Lots of rectangle/circle frames going from large to small
-   **Rain**: Vertical lines at various lengths, spacing, and point density, starting from the top or the bottom of the canvas.
