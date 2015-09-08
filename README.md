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

### Immediate Updates (self notes)
* Complete documentation, add detailed in-line and method comments.
* Update the read me page with details of various decorators and validation view.
* Make the file parser robust so that it can even withstand Destructive testing.


### Updates targeted for version 2.0.0
1. Drilling down into specific line flow data
2. Automated testing (to avoid any regression in the functionality when updates/changes are made).
3. Analyse and add custom logging requirements.