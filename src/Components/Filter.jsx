import { useState, useEffect } from "react";
import * as d3 from 'd3';

export function Filter() {

    const [filters, setFilters] = useState({
        year: "",
        energySources: [] // Updated to hold an array of selected energy sources
    });

    const [filteredData, setFilteredData] = useState([]); // To store filtered data for the table

    useEffect(() => {

        const dataFilterUrls = [
          'https://raw.githubusercontent.com/havenf/CSV-Datasets/refs/heads/main/Energy%20Consumption%20Data.csv'
        ];

        // Function to fetch and filter the energy data based on the selected filters
        function fetchAndFilterData(energyData) {
          d3.csv(energyData).then((data) => {
            // Apply filters based on the filter state
            let filtered = data;

            // Filter by year
            if (filters.year) {
              filtered = filtered.filter((d) => d.Year == filters.year); // Filter by year
            }

            // Filter by selected energy sources
            if (filters.energySources.length > 0) {
              filtered = filtered.filter((d) => {
                return filters.energySources.some(source => d[source]); // Check if any selected source exists in the row
              });
            }

            setFilteredData(filtered); // Update the filtered data state
            renderEnergyTable(filtered); // Re-render the table with the filtered data
          });
        }

        function renderEnergyTable(filteredData) {
          const tableDiv = d3.select("#dataTable");
          tableDiv.selectAll("*").remove();  // Clear existing table

          if (filteredData.length === 0) {
            tableDiv.append("p").text("No data for the selected filters.");
            return;
          }

          // Create a new table inside the 'dataTable' div
          const table = tableDiv.append("table");

          // Create the header row
          const headers = Object.keys(filteredData[0]); // Get column headers from the first row of data
          
          // Dynamically filter columns based on the selected energy source
          const visibleHeaders = headers.filter((header) => {
            if (filters.energySources.length > 0) {
              return header === "Year" || filters.energySources.includes(header);
            }
            return true; // If no filter, show all columns
          });

          const thead = table.append("thead").append("tr");

          thead.selectAll("th")
            .data(visibleHeaders)
            .enter()
            .append("th")
            .text(d => d);  // Set header text as column names

          // Create the body of the table
          const tbody = table.append("tbody");

          // Add rows for each data entry
          const rows = tbody.selectAll("tr")
            .data(filteredData)
            .enter()
            .append("tr");

          // Add cells for each row
          rows.selectAll("td")
            .data(row => visibleHeaders.map(header => row[header]))  // Map each row to its visible columns
            .enter()
            .append("td")
            .text(d => d);  // Set cell text as the data value
        }

        // Fetch and filter the energy consumption data on initial load
        fetchAndFilterData(dataFilterUrls[0]); // Send data to table and apply filters

      }, [filters]); // Trigger re-fetch when filters change

      // Filter change handler for year and energy sources
      const handleFilterChange = (e) => {
        const { name, value, checked } = e.target;

        if (name === "year") {
          setFilters((prev) => ({
            ...prev,
            [name]: value,
          }));
        }

        if (name === "energySource") {
          setFilters((prev) => {
            let updatedEnergySources = [...prev.energySources];
            if (checked) {
              updatedEnergySources.push(value);
            } else {
              updatedEnergySources = updatedEnergySources.filter(source => source !== value);
            }
            return {
              ...prev,
              energySources: updatedEnergySources
            };
          });
        }
      };

    return (
      <div className="filters col-md-10 pt-5 mt-5">
        <h3 className="row mx-1">Global Energy Use</h3>
        <div className="row mx-1">
          <label className="col-md-3">
            Filter by Year:&nbsp;
            <input
              type="text"
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
            />
          </label>
          <div className="col-md-3">
              <label>
              Filter by Oil:&nbsp;
                <input
                  type="checkbox"
                  name="energySource"
                  value="Oil (TWh direct energy)"
                  checked={filters.energySources.includes("Oil (TWh direct energy)")}
                  onChange={handleFilterChange}
                />
              </label>
          </div>
          <div className="col-md-3">
              <label>
              Filter by Gas:&nbsp;
                <input
                  type="checkbox"
                  name="energySource"
                  value="Gas (TWh direct energy)"
                  checked={filters.energySources.includes("Gas (TWh direct energy)")}
                  onChange={handleFilterChange}
                />
              </label>
          </div>
          <div className="col-md-3">
              <label>
              Filter by Coal&nbsp;
                <input
                  type="checkbox"
                  name="energySource"
                  value="Coal (TWh direct energy)"
                  checked={filters.energySources.includes("Coal (TWh direct energy)")}
                  onChange={handleFilterChange}
                />
              </label>
            </div>
        </div>
      </div>
    );
}
