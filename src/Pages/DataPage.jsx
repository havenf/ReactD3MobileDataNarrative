import { observer } from 'mobx-react-lite';
import * as d3 from 'd3';
import React, { useEffect, useRef, useState } from 'react';

function DataPage() {
  const svgRef = useRef(null); // Reference to the SVG element
  const [size, setSize] = useState({ width: 0, height: 0 }); // State to store SVG dimensions

  useEffect(() => {
    // Set the margins of the graph
    const margin = { top: 10, right: 50, bottom: 30, left: 50 };

    // Function to update width and height based on window size
    function getResponsiveSize() {
      const width = window.innerWidth * 0.80 - margin.left - margin.right;
      const height = window.innerHeight / 2 - margin.top - margin.bottom;
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
      d3.csv('https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered_wide.csv').then((data) => {
        const keys = data.columns.slice(1);

        // X axis: scale for the 'year' data
        const x = d3.scaleLinear()
          .domain(d3.extent(data, d => d.year))
          .range([0, width]);

        newSvg.append('g')
          .attr('transform', `translate(0,${height})`)
          .call(d3.axisBottom(x).ticks(5));

        // Y axis: scale for the range of values
        const y = d3.scaleLinear()
          .domain([-100000, 100000])
          .range([height, 0]);

        newSvg.append('g')
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
        newSvg.selectAll('mylayers')
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
      <h2>Fossil fuel data</h2>
      <div id="dataviz" ref={svgRef}></div>
    </section>
  );
}

export default observer(DataPage);
