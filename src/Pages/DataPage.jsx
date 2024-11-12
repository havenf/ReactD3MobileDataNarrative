import { observer } from 'mobx-react-lite';
import * as d3 from 'd3';
import React, { useEffect, useRef, useState } from 'react';

function DataPage() {
  const svgRef = useRef(null); // Reference to the SVG element
  const [size, setSize] = useState({ width: 0, height: 0 }); // State to store SVG dimensions

  useEffect(() => {
    // Set the margins of the graph
    const margin = { top: 10, right: 100, bottom: 100, left: 20 };

    // Function to update width and height based on window size
    function getResponsiveSize() {
      const width = window.innerWidth * 0.85 - margin.left - margin.right;
      const height = window.innerHeight * 0.60 - margin.top - margin.bottom;
      return { width, height };
    }

    // Function to create/update the chart
    function updateChart() {
      const { width, height } = getResponsiveSize();
      setSize({ width, height });

      // Select SVG element and remove old content
      const svg = d3.select(svgRef.current).selectAll('*').remove();

      // Create new SVG with updated dimensions
      const newSvg = d3.select(svgRef.current)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // Fetch the data
      d3.csv('https://raw.githubusercontent.com/havenf/CSV-Datasets/refs/heads/main/US%20FF%20and%20CO2%20pp10k.csv').then((data) => {
        // Assuming the first column is 'Year' and other columns are fuel/CO2-related
        const keys = data.columns.slice(1); // all columns except the first one (assumed to be Year)

        // Parse the data for numbers (e.g., converting strings to numbers)
        data.forEach(d => {
          d.Year = +d.Year; // Ensure Year is a number
          keys.forEach(key => {
            d[key] = +d[key]; // Convert other columns to numbers
          });
        });

        // X axis: scale for the 'Year' data
        const x = d3.scaleLinear()
          .domain(d3.extent(data, d => d.Year)) // Set the domain based on the Year column
          .range([0, width]);

        newSvg.append('g')
          .attr('transform', `translate(0,${height})`)
          .call(d3.axisBottom(x).ticks(5));

        // Y axis: scale for the range of values (you may adjust domain based on your data range)
        const y = d3.scaleLinear()
          .domain([0, d3.max(data, d => d3.max(keys, key => d[key])) * 2.5]) // Set domain based on the max value in data
          .range([height, 0]);

        newSvg.append('g')
          .call(d3.axisLeft(y));

        // Color palette
        const color = d3.scaleOrdinal()
          .domain(keys)
          .range(d3.schemeCategory10); // You can adjust the color scale as needed

        // Stack the data
        const stackedData = d3.stack()
          .keys(keys)(data);

        // Create a tooltip
        const Tooltip = newSvg.append('text')
          .attr('x', 0)
          .attr('y', 0)
          .style('opacity', 0)
          .style('font-size', '12px')
          .style('pointer-events', 'none')
          .style('z-index', 0); // Ensuring tooltip doesn't interfere with hover events

        // Hover functions
        const mouseover = function (event, d) {
          Tooltip.style('opacity', 1);
          d3.selectAll('.myArea')
            .style('opacity', 0.2); // Fade out other areas
          d3.select(this)
            .style('stroke', 'white')
            .style('opacity', 100); // Make the hovered area more prominent
        };

        const mousemove = function (event, d) {
          // Get the column name from the 'key' of the current stack
          const columnName = d.key;
          Tooltip.text(columnName)
            .attr('x', event.pageX - 200) // Position tooltip near the cursor
            .attr('y', event.pageY - 30)
            .style('stroke', 'white');
        };

        const mouseleave = function () {
          Tooltip.style('opacity', 0);
          d3.selectAll('.myArea')
            .style('opacity', 1)
            .style('stroke', 'none'); // Reset opacity and stroke
        };

        // Show the areas
        newSvg.selectAll('mylayers')
          .data(stackedData)
          .enter()
          .append('path')
          .attr('class', 'myArea')
          .style('fill', d => color(d.key))
          .attr('d', d3.area()
            .x((d, i) => x(d.data.Year)) // Use the 'Year' for x axis
            .y0(d => y(d[0])) // Bottom of the stacked area
            .y1(d => y(d[1])) // Top of the stacked area
          )
          .on('mouseover', mouseover)
          .on('mousemove', mousemove)
          .on('mouseleave', mouseleave);
      });
    }

    // Initial chart update
    updateChart();

    // Resize event listener
    window.addEventListener('resize', updateChart);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', updateChart);
    };
  }, []); // Empty dependency array to run only once when the component mounts

  return (
    <section>
      <h2>Fossil Fuel and CO2 Data</h2>
      <div id="dataviz" ref={svgRef}></div>
    </section>
  );
}

export default observer(DataPage);
