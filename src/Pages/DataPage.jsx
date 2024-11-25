import { observer } from 'mobx-react-lite';
import * as d3 from 'd3';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

function DataPage() {
  const svgRef = useRef(null); // Reference to the SVG element for the first graph
  const svgRef2 = useRef(null); // Reference to the SVG element for the second graph
  const [size, setSize] = useState({ width: 0, height: 0 }); // State to store SVG dimensions

  useEffect(() => {
    // Set the margins of the graph
    const margin = { top: 10, right: 100, bottom: 100, left: 50 };
  
    // update width and height based on window size
    function getResponsiveSize() {
      const width = window.innerWidth * 0.85 - margin.left - margin.right;
      const height = window.innerHeight * 0.60 - margin.top - margin.bottom;
      return { width, height };
    }
  
    // update the first graph (stacked area chart)
    function updateFirstGraph(svgElement, datasetUrl) {
      const { width, height } = getResponsiveSize();
      setSize({ width, height });

      // Select SVG element and remove old content
      const svg = d3.select(svgElement).selectAll('*').remove();

      // SVG with updated dimensions
      const newSvg = d3.select(svgElement)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // Fetch the dataset for the stacked area chart
      d3.csv(datasetUrl).then((data) => {
        const keys = data.columns.slice(1); // Assuming first column is 'Year'

        data.forEach(d => {
          d.Year = +d.Year;
          keys.forEach(key => {
            d[key] = +d[key]; // Convert other columns to numbers
          });
        });

        // X axis: scale for the 'Year' data
        const x = d3.scaleLinear()
          .domain(d3.extent(data, d => d.Year))
          .range([0, width]);

        newSvg.append('g')
          .attr('transform', `translate(0,${height})`)
          .call(d3.axisBottom(x).ticks(6));

        // Y axis: scale for the range of values
        const y = d3.scaleLinear()
          .domain([0, d3.max(data, d => d3.max(keys, key => d[key])) * 2.35])
          .range([height, 0]);

        newSvg.append('g')
          .call(d3.axisLeft(y));

        // Color palette
        const color = d3.scaleOrdinal()
          .domain(keys)
          .range(d3.schemeCategory10);

        // Stack the data
        const stackedData = d3.stack()
          .keys(keys)(data);

        // Create a tooltip
        const Tooltip = d3.select(svgElement)
          .append('text')
          .attr('x', 0)
          .attr('y', 0)
          .style('opacity', 0)
          .style('font-size', '12px')
          .style('pointer-events', 'none')
          .style('z-index', 10);

        // Hover functions
        const mouseover = function () {
          Tooltip.style('opacity', 1);
          d3.selectAll('.myArea')
            .style('opacity', 0.2);
          d3.select(this)
            .style('stroke', 'white')
            .style('opacity', 1);
        };

        const mousemove = function (event, d) {
          const columnName = d.key;
          const graphBBox = newSvg.node().getBoundingClientRect();

          Tooltip.text(columnName)
            .attr('x', event.pageX - graphBBox.left - 200)
            .attr('y', event.pageY - graphBBox.top - 30);
        };

        const mouseleave = function () {
          Tooltip.style('opacity', 0);
          d3.selectAll('.myArea')
            .style('opacity', 1)
            .style('stroke', 'none');
        };

        // Show the areas
        newSvg.selectAll('mylayers')
          .data(stackedData)
          .enter()
          .append('path')
          .attr('class', 'myArea')
          .style('fill', d => color(d.key))
          .attr('d', d3.area()
            .x((d, i) => x(d.data.Year))
            .y0(d => y(d[0]))
            .y1(d => y(d[1]))
          )
          .on('mouseover', mouseover)
          .on('mousemove', mousemove)
          .on('mouseleave', mouseleave);
      });
    }

   // Function to update the second graph (radial chart)
    function updateSecondGraph(svgElement, datasetUrl) {
      const { width, height } = getResponsiveSize();
      setSize({ width, height });

      // Select SVG element and remove old content
      const svg = d3.select(svgElement).selectAll('*').remove();

      // Create new SVG with updated dimensions
      const newSvg = d3.select(svgElement)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${width / 2 + margin.left},${height / 2 + margin.top})`);

      // Fetch the dataset for the radial chart
      d3.csv(datasetUrl).then((data) => {
        // Scales for radial chart
        const x = d3.scaleBand()
          .range([0, 2 * Math.PI])
          .align(0)
          .domain(data.map(d => d.Year));

        const y = d3.scaleRadial()
          .range([window.innerWidth / 1000, Math.min(width, height) / 2])
          .domain([0, 600]); // Adjust based on your data range

        // Create Tooltip
        const Tooltip = d3.select(svgElement)
          .append('text')
          .attr('x', 0)
          .attr('y', 0)
          .style('opacity', 0)
          .style('font-size', '12px')
          .style('pointer-events', 'none')
          .style('z-index', 10);

        // Hover functions
        const mouseover = function () {
          Tooltip.style('opacity', 1);
          d3.selectAll('.radialBar')
            .style('opacity', 0.2); // Dim all other bars
          d3.select(this)
            .style('stroke', 'white')
            .style('opacity', 1); // Highlight the hovered bar
        };

        const mousemove = function (event, d) {
          const graphBBox = newSvg.node().getBoundingClientRect();
          Tooltip.text(`${d.Year}: ${'co2 ' + d['Rough Vostok Ice core Data: CO2 Athmosphereic levels in parts per million (1 x 10^-6) over thousands of years (https://tos.org/oceanography/assets/docs/17-4_alley.pdf)'] + ' parts per million (1 x 10^-6)'}`)
            .attr('x', event.pageX - graphBBox.left - 200)
            .attr('y', event.pageY - graphBBox.top - 30);
        };

        const mouseleave = function () {
          Tooltip.style('opacity', 0);
          d3.selectAll('.radialBar')
            .style('opacity', 1)
            .style('stroke', 'none'); // Reset style
        };

        // Add the bars (arc paths) and apply the mouseover effect
        newSvg.append("g")
          .selectAll("path")
          .data(data)
          .enter()
          .append("path")
          .attr("class", "radialBar") // Add class for reference
          .attr("fill", "#69b3a2")
          .attr("d", d3.arc()
            .innerRadius(20)
            .outerRadius(d => y(d['Rough Vostok Ice core Data: CO2 Athmosphereic levels in parts per million (1 x 10^-6) over thousands of years (https://tos.org/oceanography/assets/docs/17-4_alley.pdf)']))
            .startAngle(d => x(d.Year))
            .endAngle(d => x(d.Year) + x.bandwidth())
            .padAngle(0.01)
            .padRadius(125))
          .on('mouseover', mouseover)
          .on('mousemove', mousemove)
          .on('mouseleave', mouseleave);

        // Add the labels (Year labels for each bar)
        newSvg.append("g")
          .selectAll("g")
          .data(data)
          .enter()
          .append("g")
          .attr("text-anchor", d => (x(d.Year) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start")
          .attr("transform", d => `rotate(${(x(d.Year) + x.bandwidth() / 2) * 180 / Math.PI - 90})translate(${y(d['Rough Vostok Ice core Data: CO2 Athmosphereic levels in parts per million (1 x 10^-6) over thousands of years (https://tos.org/oceanography/assets/docs/17-4_alley.pdf)']) + 5},0)`)
        .append("text")
          .text(d => d.Year)
          .attr("transform", d => (x(d.Year) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)")
          .style("font-size", "12px")
          .style("fill", "#ffffff")
          .attr("alignment-baseline", "middle");
      });
    }

  
    // Dataset URLs
    const datasetUrls = [
      'https://raw.githubusercontent.com/havenf/CSV-Datasets/refs/heads/main/US%20FF%20and%20CO2%20pp10k.csv', // For the first graph (stacked area)
      'https://raw.githubusercontent.com/havenf/CSV-Datasets/refs/heads/main/Vostok%20Ice%20Core%20Data%20-%20Sheet.csv' // For the second graph (radial chart)
    ];
  
    // Initial chart update for both graphs
    updateFirstGraph(svgRef.current, datasetUrls[0]); // For the first graph (stacked area)
    updateSecondGraph(svgRef2.current, datasetUrls[1]); // For the second graph (radial chart)
  
    // Resize event listener
    window.addEventListener('resize', () => {
      updateFirstGraph(svgRef.current, datasetUrls[0]);
      updateSecondGraph(svgRef2.current, datasetUrls[1]); // Resize the second graph
    });
  
    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', () => {
        updateFirstGraph(svgRef.current, datasetUrls[0]);
        updateSecondGraph(svgRef2.current, datasetUrls[1]);
      });
    };
  }, []); // Empty dependency array to run only once when the component mounts
  
  return (
    <section className='container mx-0 px-0'>
      <h2 className='ms-4'>Fossil Fuel and CO2 Data</h2>
      <div id="dataviz" ref={svgRef}></div>
      <div className='row d-flex justify-content-end'>
        <p className='col-10 pt-5'>
          Lorem ipsum this is what the data above describes and so on.
        </p>
      </div>
      <h2 className='ms-4'>Vostok Ice Core Data</h2>
      <div id="dataviz2" ref={svgRef2}></div>
      <div className='row d-flex justify-content-end'>
        <p className='col-10 pt-5'>
          Lorem ipsum this is what the data above describes and so on.
        </p>
      </div>
      <Link to={'/sources'}><button>See Sources</button></Link>
    </section>
  );
}

export default observer(DataPage);
