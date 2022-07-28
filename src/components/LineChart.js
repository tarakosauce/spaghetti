import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { select, line, curveCardinal, axisBottom, axisLeft, scaleLinear } from "d3";

function LineChart() {
    const [data, setData] = useState([25, 30, 45, 60, 20, 65, 75]);
    const svgRef = useRef();

    //called on every change
    useEffect(() => {
        const svg = select(svgRef.current);
        const xScale = scaleLinear().domain([0, data.length - 1]).range([0, 300]);
        const yScale = scaleLinear().domain([0, 150]).range([150, 0]);

        const xAxis = axisBottom(xScale).ticks(data.length).tickFormat(index => index + 1);
        svg.select(".x-axis").style("transform", "translateY(150px)").call(xAxis);

        const yAxis = axisLeft(yScale);
        svg.select(".y-axis").call(yAxis);

        const myLine = line()
        .x((value, index) => xScale(index))
        .y(yScale)
        .curve(curveCardinal);
        svg
        .selectAll(".line")
        .data([data])
        .join("path")
        .attr("class", "line")
        .attr("d", myLine)
        .attr("stroke", "blue")
        .attr("fill", "none");
    }, [data]);

  return (
    <React.Fragment>
        <div className="chart">
            <svg className="box" ref={svgRef}>
                <g className="x-axis" />
                <g className="y-axis" />
            </svg>
            <br />
            <div className="controls">
                <button onClick={() => setData(data.map(value => value + 5))}>
                    UPDATE
                </button>
                <button onClick={() => setData(data.filter(value => value < 35))}>
                    FILTER
                </button>
            </div>
        </div>
    </React.Fragment>
  );
}

export default LineChart;
