import { observer } from 'mobx-react-lite';
import * as d3 from 'd3';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter } from '../Components/Filter';


function DataPage() {
  
  const svgRef = useRef(null); // Reference to the SVG element for the first graph
  const svgRef2 = useRef(null); // Reference to the SVG element for the second graph

  const [size, setSize] = useState({ width: 0, height: 0 }); // State to store SVG dimensions

  useEffect(() => {
    // Set the margins of the graph
    const margin = { top: 35, right: 85, bottom: 35, left: 35 };
  
    // update width and height based on window size
    function getResponsiveSize() {
      const width = window.innerWidth * 0.90 - margin.left - margin.right;
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
          .style('color', '#8886ff')
          .style('border-bottom', '#8886ff solid 1px')
          .style('pointer-events', 'none')
          .style('z-index', 10);

        // Hover functions
        const mouseover = function () {
          Tooltip.style('opacity', 1);
          d3.selectAll('.myArea')
            .style('opacity', 0.2)
            .style('transition', '777ms ease');
          d3.select(this)
            .style('stroke', 'white')
            .style('opacity', 1)
            .style('transition', '777ms ease');
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
        .style('background-color', '#646cff') // Add background color here
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
          .range([window.innerWidth / 1000, Math.min(width, height) / 1.8])
          .domain([0, 600]); // Adjust based on your data range

        // Create Tooltip
        const Tooltip = d3.select(svgElement)
          .append('text')
          .attr('x', 0)
          .attr('y', 0)
          .style('opacity', 0)
          .style('font-size', '12px')
          .style('color', '#8886ff')
          .style('border-bottom', '#8886ff solid 1px')
          .style('pointer-events', 'none')
          .style('z-index', 10);

        // Hover functions
        const mouseover = function () {
          Tooltip.style('opacity', 1);
          d3.selectAll('.radialBar')
            .style('opacity', 0.2) // Dim all other bars
            .style('transition', '777ms ease');
          d3.select(this)
            .style('stroke', 'white')
            .style('opacity', 1) // Highlight the hovered bar
            .style('transition', '777ms ease');
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
          .attr("fill", "#242424")
          .attr("d", d3.arc()
            .innerRadius(window.innerWidth)
            .outerRadius(d => y(d['Rough Vostok Ice core Data: CO2 Athmosphereic levels in parts per million (1 x 10^-6) over thousands of years (https://tos.org/oceanography/assets/docs/17-4_alley.pdf)'] / 1.618))
            .startAngle(d => x(d.Year))
            .endAngle(d => x(d.Year) + x.bandwidth())
            .padAngle(0.01)
            .padRadius(70))
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
          .attr("transform", d => `rotate(${(x(d.Year) + x.bandwidth() / 2) * 180 / Math.PI - 90})translate(${y(d['Rough Vostok Ice core Data: CO2 Athmosphereic levels in parts per million (1 x 10^-6) over thousands of years (https://tos.org/oceanography/assets/docs/17-4_alley.pdf)']) - 12},0)`)
        .append("text")
          .text(d => d.Year)
          .attr("transform", d => (x(d.Year) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)")
          .style("font-size", "9pt")
          .style("fill", "#ffffff")
          .attr("alignment-baseline", "middle");
      });
    }

    function updateEnergyUseTable(energyData) {
      d3.csv(energyData).then(function (data) {
        // Clear any existing table in the #dataTable div
        d3.select("#dataTable").selectAll("*").remove();

        // Create the table inside the 'dataTable' div
        const table = d3.select("#dataTable").append("table");

        // Create the header row
        const headers = Object.keys(data[0]);
        const thead = table.append("thead").append("tr");

        thead.selectAll("th")
          .data(headers)
          .enter()
          .append("th")
          .text(d => d);  // Set header text as column names

        // Create the body of the table
        const tbody = table.append("tbody");

        // Add rows for each data entry
        const rows = tbody.selectAll("tr")
          .data(data)
          .enter()
          .append("tr");

        // Add cells for each row
        rows.selectAll("td")
          .data(row => headers.map(header => row[header]))  // Map each row to its columns
          .enter()
          .append("td")
          .text(d => d);  // Set cell text as the data value
      }).catch(function (error) {
        console.error("Error loading the CSV file:", error);
      });
    }
    

  
    // Dataset URLs
    const datasetUrls = [
      'https://raw.githubusercontent.com/havenf/CSV-Datasets/refs/heads/main/US%20FF%20and%20CO2%20pp10k.csv', // For the first graph (stacked area)
      'https://raw.githubusercontent.com/havenf/CSV-Datasets/refs/heads/main/Vostok%20Ice%20Core%20Data%20-%20Sheet.csv', // For the second graph (radial chart)
      'https://raw.githubusercontent.com/havenf/CSV-Datasets/refs/heads/main/Energy%20Consumption%20Data.csv'
    ];
    

    
  
    // Initial chart update for both graphs
    updateFirstGraph(svgRef.current, datasetUrls[0]); // For the first graph (stacked area)
    updateSecondGraph(svgRef2.current, datasetUrls[1]); // For the second graph (radial chart)
    updateEnergyUseTable(datasetUrls[2]); //send data to table

  
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
    <section className='mx-0 px-0'>
      <h2 className='ms-4'>US Fossil Fuel and Global CO2 Data</h2>
      <div id="dataviz" ref={svgRef}></div>
      <div className='row d-flex justify-content-center'>
        <p className='col-md-8 pt-5'>
          The data suggests a very strong correlation between human endeavors with fossil fuels and increase of
          atmospheric carbon dioxide levels. Many aspects of our infrastructure rely on these types of fuels. Our 
          current driving force on the potential disruption of earth's naturally cyclic carbon dioxide levels is brought
          on by ecnomic forces meant to maintain industrial infrastructure as it relies on fossil fuel. Without these fuels 
          burning, thousands of jobs cease to exist, agriculture no longer harvests, truckers stop transporting goods, 
          vehicles do not drive to work or school, and factories stop producing. Due to this reliance, there may also be a 
          strong correlation between high prices of goods and service caused by price per barrel of oil (~42 gallons / barrel).
        </p>
      </div>
      <h2 className='ms-4'>Vostok Ice Core Data</h2>
      <div id="dataviz2" ref={svgRef2}></div>
      <div className='row d-flex justify-content-center'>
        <p className='col-md-8 pt-5'>
          The data in this visualization are approximate estimates to the actual recorded levels. Generally, a pattern can be drawn out
          that involves large abrupt spikes in carbon dioxide every one-hundred thousand years with gradual decrese over the same
          amount of time. Some anomalous data exists in the ice such as ash from volcanic events that disrupted earth's normal
          atmospheric composition. The conclusion that our emissions are the cause of the current higher than average levels is likely true.
          An absolute conclusion of what this means for the future is unknown. 
        </p>
      </div>
      <h2 className='ms-4'>Basic Economics Regarding Global Energy Use</h2>
      <div className='row d-flex justify-content-center'>
        <img className='col-md-5 py-3 mt-3' src="src\assets\BasicSupDemEconChart.png" alt='basic supply and demand econ chart'/>
        <p className='col-md-6 pt-5'>
          Supply (blue) and demand (red) are the basis of our economic understanding. They hold a symbiotic relationship in determining
          the value of any product, good, or service. Where there is less supply of something, the price is higher. Where 
          there is low demand for something and high supply, the price is lower. The ethics of high supply and high price will however
          be left to those who sell the product, good, or service. This system naturally leaves room for corruption in determining prices especially
          when dealing with a an abundant and societally dependant resource such as oil. However, current projections made by The 
          Millenium Alliance for Humanity and the Biosphere organized by Standford University approximate earth's oil supplies running 
          dry by the year 2052. Continued reliance on fossil fuels could drive the price of everything up as the supply dwindles.
          <br /><br /><br />
          This leaves much room for the necessary innovations leading to more sustainable energy sources with less carbon emissions. The amount of 
          energy consumption in the form of fossil fuels has increased to over double to the global terrawatt per hour amount since the 
          year 1965. Collectively we have an energy crisis. As global governance is aware of these trifling issues, the call to innovate
          has been initiated. Some examples of these calls include the UN Paris agreement and the energy security and climate change 
          initiatives taken on through The US Inflation Reduction Act. Many businiesses in the United States have begun pledging to lower
          carbon emissions. This is a good initiative but still leaves us missing the mark in terms of where the energy is sourced and
          its renewability. 
        </p>
        <Filter />
        <div id="dataTable" className='table-responsive col-md-10 py-3 mt-3'></div>
        <Link to={'/sources'}><button>See Data Sources</button></Link>
      </div> 
    </section>
  );
}

export default observer(DataPage);
