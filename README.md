# [stac- Steady-State AC Network Visualization in the Browser](http://immersive.erc.monash.edu.au/stac/)

## Motivation behind stac
Power Networks are large complex systems often spanning over 100 buses at a time.Understanding, Interpreting and Visualizing them is a challenging and tedious process. The STAC project looks to make that process easier through a visualization tool for power networks. <br>

stac is a web-based tool that is aimed at helping power system researchers to understand their network datasets and the results of their research.

## Key features of stac
1.  ** *Automatic graph layout* ** - All you need to do is drop in the input file and stac gives you an automated layout of the network (including the generators, synchronous condensers, loads, shunts and different branches).
2. Ability to `save a custom layout` and reuse the same at a later stage.
3. **Tool-tips** that provide information about the specific elements.
4. **Validation view** - Highlight constraint violations (errors and warnings in the network with a single click)
5. Easy **scaling**, **zooming** and **visualization** of complex Networks.

### Technologies used:
1. HTML5
2. CSS3
3. JavaScript and JQuery.
4. Frameworks - [D3](http://d3js.org/) and [WebCola](http://marvl.infotech.monash.edu/webcola/) (developed at [Monash University](http://www.infotech.monash.edu.au/)).<br>


## Upgrades/Updates

### Bus Locking (Completed)
- Double click a node to fix it's position in the graph (The fill color will turn light blue).
- Double click a node (with fill color blue) to unfix it's position.

### File Parser
- Added support for linear generator cost function.
- Added support for comments in the data matrix (by using the '%' symbol).

### Updates be done
1. Update the read me page with details of various decorators and validation view.
2. Drilling down into specific line flow data
3. Automated testing (to avoid any regression in the functionality when updates/changes are made).

### Completed Updates
- Updated Inline and method level comments.
- Updated the parser to read the names of the properties of the network elements from the rules file.
- Updated the logger (this was done a while ago) - As not many users have inquired about the logger no major changes have been made.