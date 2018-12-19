import Dygraph from 'dygraphs';
import React, { Component } from 'react';

class TestGraph extends Component {
    constructor(props){
        super(props);
        this.state = {
            tempData: [],
            graph: null,
        }
    }

    render() {
        return <div className="Bla" ref="chart"></div>;
    }

    componentDidMount() {
        this.timerID = setInterval(
          () => this.drawGraph(),
          50
        );
      }
    
      componentWillUnmount() {
        clearInterval(this.timerID);
      }

      drawGraph() {
        this.getNewData();
        if(this.state.graph == null) {
            //console.log("new Dygraph", this.state.tempData);
            this.state.graph = new Dygraph(
                this.refs.chart,
                this.state.tempData,
                {
                    fillGraph: false,
                    labels: ['Time', 'EKG'],
                    drawGrid: false,
                });
        } else {
            //console.log("update", this.state.tempData);
            this.state.graph.updateOptions( { 'file': this.state.tempData } );
        }
    }

    getNewData() {
        var x = new Date();  // current time
        var y = Math.random();
        //collect 100 signalValues before start shifting old signals
        if(this.state.tempData.length <= 100) {
            this.state.tempData.push([x, y]);
        } else {
            this.state.tempData.shift();
            this.state.tempData.push([x, y]);
        }
    }

}

export default TestGraph;