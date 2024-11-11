import { observer } from 'mobx-react-lite';
import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';

function DataPage() {

    const svgRef = useRef(null); // Reference to the SVG element
  
    useEffect(() => {
      // Set the dimensions and margins of the graph
      // Set up margins and base width/height
      const margin = { top: 10, right: 60, bottom: 30, left: 60 };

      // Function to update width and height based on window size
      function getResponsiveSize() {
      const width = (window.innerWidth * 0.80) - margin.left - margin.right;
      const height = (window.innerHeight / 2) - margin.top - margin.bottom;
      return { width, height };
      }

      // Call it initially to set up size
      let { width, height } = getResponsiveSize();

      // You can now use `width` and `height` for your SVG or canvas size

  
      // Append the svg object to the DOM element using the ref
      const svg = d3.select(svgRef.current)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
  
      // Fetch the data
      d3.csv('https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered_wide.csv').then((data) => {
        // List of groups = header of the CSV file (excluding the 'year' column)
        const keys = data.columns.slice(1);
  
        // X axis: scale for the 'year' data
        const x = d3.scaleLinear()
          .domain(d3.extent(data, d => d.year))
          .range([0, width]);
  
        svg.append('g')
          .attr('transform', `translate(0,${height})`)
          .call(d3.axisBottom(x).ticks(5));
  
        // Y axis: scale for the range of values
        const y = d3.scaleLinear()
          .domain([-100000, 100000])
          .range([height, 0]);
  
        svg.append('g')
          .call(d3.axisLeft(y));
  
        // Color palette
        const color = d3.scaleOrdinal()
          .domain(keys)
          .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf']);
  
        // Stack the data
        const stackedData = d3.stack()
          .offset(d3.stackOffsetSilhouette)
          .keys(keys)(data);
  
        // Show the areas
        svg.selectAll('mylayers')
          .data(stackedData)
          .enter()
          .append('path')
          .style('fill', d => color(d.key))
          .attr('d', d3.area()
            .x((d, i) => x(d.data.year))
            .y0(d => y(d[0]))
            .y1(d => y(d[1]))
          );
      });

      return () => {
        d3.select(svgRef.current).selectAll('*').remove();
      };

    }, []); // Empty dependency array to run only once when the component mounts
  return (
    <section>
        <h2>Fossil fuel data</h2>
        <div id="dataviz" ref={svgRef}></div>
    </section>
  );
}

export default observer(DataPage);
