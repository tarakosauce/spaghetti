import React, { useRef, useEffect, useState } from "react";
import { select, geoPath, geoMercator, min, max, mean, scaleLinear } from "d3";
import Responsive from "./Responsive";
import mapData from "../map.json";

function Map() {
    const [property, setProperty] = useState("pop_est");
    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = Responsive(wrapperRef);
    const [selectedCountry, setSelectedCountry] = useState(null);

    useEffect(() => {
        const svg = select(svgRef.current);

        const minimum = min(mapData.features, feature => feature.properties[property]);
        const maximum = max(mapData.features, feature => feature.properties[property]);
        const avr = mean(mapData.features, features => features.properties[property]);

        const colors = scaleLinear().domain([minimum, avr, maximum]).range(["blue", "hotpink", "red"]);


        const { width, height } = dimensions || wrapperRef.current.getBoundingClientRect();
        const projection = geoMercator().fitSize([.95 * width, height], selectedCountry || mapData).precision(100);
        const pathGenerator = geoPath().projection(projection);

        svg
        .selectAll(".country")
        .data(mapData.features)
        .join("path")
        .on("click", (event, feature) => {
            setSelectedCountry(selectedCountry === feature ? null : feature);
        })
        .attr("class", "country")
        .transition()
        .attr("fill", feature => colors(feature.properties[property]))
        .attr("d", feature => pathGenerator(feature));

        svg
        .selectAll(".label")
        .data([selectedCountry])
        .join("text")
        .attr("class", "label")
        .text(
            feature => feature && feature.properties.name + ": " + feature.properties[property].toLocaleString()
        )
        .attr("x", 10)
        .attr("y", 25);

    }, [selectedCountry, dimensions, property]);

    return (
        <div className="chart">
            <div className="box" id="map-box" ref={wrapperRef}>
                <svg ref={svgRef}></svg>
            </div>
            <br/>

            <select value={ property } onChange={event => setProperty(event.target.value)}>
                <option value="pop_est">Population</option>
                <option value="name_len">Name Length</option>
            </select>
        </div>
    )
}

export default Map;