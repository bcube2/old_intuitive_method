/*
Note: This version is for Werner Randelshofer's cube simulator.

This script is a workaround for cheerpj to extend rotation outside of the
cube area (for desktop browsers).

Parameters for the rt function:
  n = number of canvases on page
  i = interval in milliseconds
  m = max times to run
 
The following shows the number of canvases for some common display types:

Canvases  Display Type
--------  ------------
    4     cube only
    9     with buttonbar
   10     with buttonbar and move sequence text
 
For pages with many cubes, a count of canvases can be obtained by doing
the following:

1. Include rtwr.js on the page but do not call the rt function:
   <script src=rtwr.js></script>

2. Add this code to the page:
   <button onclick=ff()>Go</button>
   <script>function ff(){console.log('Canvases:',rtCanv.length)}</script>

3. In the browser, press F12 to view the console and reload the page.
   After the last cube is displayed press the Go button to show the number
   of canvases (in the console).  Press Go again after a few seconds to make
   sure the load has completed (count remains same).
*/
var rtCanvTot, rtInt, rtMax, rtCount, rtCanvIx, rtCube, rtMouseDown;
var rtApp = document.getElementsByTagName('object');
var rtCanv = document.getElementsByTagName('canvas');
var rtText = document.getElementsByTagName('textarea');
function rt(n, i, m) {
  rtCanvTot = n;
  rtInt = i;
  rtMax = m;
  rtCount = 0;
  rt2();
}
function rt2() {
  if (rtCanv.length == rtCanvTot)
    rt3();
  else if (rtCount++ < rtMax)
    setTimeout(rt2, rtInt);
}
function rt3() {
  for (var i=0, ix=0; i < rtApp.length; i++) {
    var n = rtApp[i].getElementsByTagName('canvas').length;
    var ix2 = ix + n - 1;
    rtCanv[ix2].ix = ix2;
    rtCanv[ix2].cube = i;
    rtCanv[ix2].addEventListener('mousedown', mousedown);
    rtCanv[ix2].addEventListener('mouseup', mouseup);
    rtCanv[ix2].addEventListener('contextmenu', contextmenu);
    ix += n;
  }
  document.addEventListener('mouseup', mouseup);
  document.addEventListener('pointermove', pointermove);
  console.log('rt done');
}
function mousedown(e) {
  rtCanvIx = e.target.ix;
  rtCube = rtCanv[rtCanvIx].cube;
  rtMouseDown = true;
  pointerEventsOtherApps('none');
  if (e.button == 2)
    parent.document.addEventListener('contextmenu', contextmenu);
}
function mouseup(e) {
  if (rtMouseDown) {
    rtMouseDown = false; 
    pointerEventsOtherApps('auto');
  }
  if (e.button == 2)
    setTimeout(removeParentListener, 100);
}
function contextmenu(e) {
  e.preventDefault();
}
function pointermove(e) {
  if (rtMouseDown) {
    var evt = document.createEvent('HTMLEvents');
    evt.initEvent('mousemove', true, false);
    evt.buttons = e.buttons;
    evt.clientX = e.clientX; 
    evt.clientY = e.clientY;
    rtCanv[rtCanvIx].dispatchEvent(evt);
  }
}
function pointerEventsOtherApps(s) {
  for (var i=0; i < rtApp.length; i++) {
    if (i != rtCube) {
      rtApp[i].style.pointerEvents = s;
      rtApp[i].children[2].style.pointerEvents = s;
      rtText[i].style.pointerEvents = s;
    }
  }
  // also do textarea for current app
  rtText[rtCube].style.pointerEvents = s;
}
function removeParentListener() {
  parent.document.removeEventListener('contextmenu', contextmenu);
}
