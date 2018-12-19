import Dygraph from 'dygraphs';
import React, { Component } from 'react';
//Änderung: graph und tempData nicht mehr als states, weil egal für Update
//ComponentDidUpdate funktioniert über props, die von signal reinkommen
class GraphSignal extends Component {

    constructor(props){
        super(props);
        this.indexPointer = 0;
        this.graph = null;
        this.tempData = [];
    }
    render() {
        return <div id="dygraph-container" ref="chart"></div>;
    }

    componentDidMount() {
        console.log("DidMount ", this.props.bioSignalValue);
        this.saveSignal();
        this.timerID = setInterval(
            () => this.drawGraph(),
            100
        );
      }

    componentDidUpdate() {
        //console.log("DidUpdate ", this.props.bioSignalValue);
        this.saveSignal();
    }    

    saveSignal() {
        console.log("Save Signal, indexpointer: ", this.indexPointer, this.props.bioSignalType,": ", this.props.bioSignalValue ); 
        //console.log("saveSignal ", this.props.bioSignalType);
        let x = new Date();
        let y = Number(this.props.bioSignalValue);
            this.tempData.push([x, y]);
    }

    drawGraph() {
        if(this.graph == null) {
            this.graph = new Dygraph(
                this.refs.chart,
                this.tempData,
                {
                    fillGraph: false,
                    labels: ['Time', 'Biosignal'],
                    drawGrid: false,
                    valueRange: [
                        this.props.valueRangeMin , 
                        this.props.valueRangeMax , 

                    ],
                    drawPoints: true,
                });
        } else {
            let dygraphContainerOffsetWidth = document.getElementById('dygraph-container').offsetWidth
            //display at most around 500 values depending on canvas width
            //ToDo: lost values, e.g. if last update at length 97 and next at 103 and offset =100, values 97,98,99 will be lost because array reduced to size 100
            if(this.tempData.length >= dygraphContainerOffsetWidth*2){
                let valuesToBeRemoved = this.tempData.length-dygraphContainerOffsetWidth*2;
                //delete items from array to remain array.length at length of offsetWidth;
                this.tempData.splice(0,valuesToBeRemoved);
            }
            this.graph.updateOptions( { 'file' : this.tempData } );
        }
    }
}

export default GraphSignal;