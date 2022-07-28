import React from 'react';
import { useRef, useEffect } from 'react';
import { select, axisBottom, axisLeft, scaleLinear, scaleBand } from "d3";
import Responsive from "./Responsive.js";

function BarChart({ data, setData }) {
    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = Responsive(wrapperRef);

    //called on every change
    useEffect(() => {
        const svg = select(svgRef.current);
        if (!dimensions) return;

        const xScale = scaleBand().domain(data.map((value, index) => index)).range([0, .95 * dimensions.width]).padding(0.5);
        const yScale = scaleLinear().domain([0, 150]).range([dimensions.height, 0]);

        const colorScale = scaleLinear().domain([75, 100, 150]).range(["blue", "hotpink", "red"]).clamp(true);

        const xAxis = axisBottom(xScale).ticks(data.length);

        svg.select(".x-axis").style("transform", `translateY(${dimensions.height}px)`).call(xAxis);

        const yAxis = axisLeft(yScale);
        svg.select(".y-axis").call(yAxis);

        svg
        .selectAll(".bar")
        .data(data)
        .join("rect")
        .attr("class", "bar")
        .style("transform", "scale(1, -1)")
        .attr("x", (value, index) => xScale(index))
        .attr("y", -dimensions.height)
        .attr("width", xScale.bandwidth())
        .on("mouseenter", (event, value) => {
            const index = svg.selectAll(".bar").nodes().indexOf(event.target);
            svg
            .selectAll(".tooltip")
            .data([value])
            .join((enter) => enter.append("text").attr("y", yScale(value) - 2))
            .attr("class", "tooltip")
            .text(value)
            .attr("x", xScale(index) + xScale.bandwidth() / 2)
            .attr("text-anchor", "middle")
            .transition()
            .attr("y", yScale(value) - 8)
            .attr("opacity", 1);
        })
        .on("mouseleave", () => svg.select(".tooltip").remove())
        .transition()
        .attr("fill", colorScale)
        .attr("height", (value) => dimensions.height - yScale(value));
        
    }, [data, dimensions]);

  return (
    <React.Fragment>
        <div className="chart">
            <div className="box" ref={wrapperRef}>
                <svg ref={svgRef}>
                    <g className="x-axis" />
                    <g className="y-axis" />
                </svg>
            </div>
            <br />
            <div className="controls">
                <button onClick={() =>  setData(data.map(value => value + 5))}>
                    UPDATE
                </button>
                <button onClick={() => setData(data.filter(value => value < 35))}>
                    FILTER
                </button>
                <button onClick={() => setData([...data, Math.round(Math.random() * 100)])}>
                    ADD
                </button>
            </div>
        </div>
    </React.Fragment>
  );
}

export default BarChart;
