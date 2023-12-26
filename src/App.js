import './App.css';
import { useEffect, useState } from 'react';
import * as d3 from 'd3';

function App() {
  const [title, setTitle] = useState("Title")
  const [data, setData] = useState([])
  
  useEffect(() => {
    fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
    .then(res => res.json())
    .then(res => {
      setData(res.data)
      setTitle(res.source_name)
    })
    .catch(error => { console.error('Error fetching data:', error)})
  }, [])

  useEffect(() => {
    if(data) {drawChart(800, 600, 40)}
  }, [data])


  const drawChart = ( w, h, p) => {

    d3.select('#chart-container svg').remove();

    let tooltip = d3.select('body #tooltip');

    if (tooltip.empty()) {
      tooltip = d3.select('body')
        .append('div')
        .attr('id', 'tooltip')
        .style('visibility', 'hidden')
        .style('position', 'absolute')
        .style('background-color', '#333')
        .style('opacity', '0.8')
        .style('color', '#fff')
        .style('padding', '12px')
        .style('border-radius', '8px')
        .style('box-shadow', '0 0 10px rgba(0, 0, 0, 0.5)')
        .style('font-family', 'Arial, sans-serif')
        .style('font-size', '14px')
        .style('line-height', '1.5')
        .style('pointer-events', 'none');
        
  }

    // SVG Container
    const svg = d3.select('#chart-container')
        .append('svg')
        .attr('width', w  + 'px')
        .attr('height', h + 'px')
        .style('background-color', '#437FC7');

    const heightScale = d3.scaleLinear()
    .domain([0 , d3.max(data, (d) => d[1])])
    .range([0, h - (2*p)])

    const xScale = d3.scaleLinear()
    .domain([0 , data.length - 1])
    .range([p, w - p])

    const yScale = d3.scaleLinear()
    .domain([0 , d3.max(data, (d) => d[1])])
    .range([h - p, p])

    // Rectangle Elements
    svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', (d , i) => xScale(i))
        .attr('y', (d)=> (h - p) - heightScale(d[1]) )
        .attr('width',( w - (p * 2)) / data.length)
        .attr('height', (d)=> {
          return heightScale(d[1])
        })  
        .attr('class', 'bar')
        .attr('data-date', d => d[0])
        .attr('data-gdp', d => d[1])
        .attr('fill', (d, i)=> { return i % 2 ? '#6DAFFE': '#5CABFF'})

   
      .on('mouseover', (event, d) => {
        const [x, y] = d3.pointer(event);
    
        tooltip.transition()
            .style('visibility', 'visible')
            .style('left', x + 'px')
            .style('top', y + 'px');
    
        const formattedDate = new Date(d[0]).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
      });

        tooltip.html(`
            <div><strong>Date:</strong> ${formattedDate}</div>
            <div><strong>GDP:</strong> $${d[1]} Billion</div>
        `);
        tooltip.attr('data-date', d[0]);
    })
    .on('mousemove', (event, d) => {
        const [x, y] = d3.pointer(event);
        tooltip.style('left', x + 'px').style('top', y + 'px');
    })
    .on('mouseout', (event, d) => {
        tooltip.transition()
            .style('visibility', 'hidden');
    });

  

        const datesArray = data.map((item) => new Date(item[0]))

        const xAxisScale = d3.scaleTime()
          .domain([d3.min(datesArray), d3.max(datesArray)])
          .range([p, w - p])

          const xAxis = d3.axisBottom(xAxisScale)
          svg.append('g')
          .call(xAxis)
          .attr('transform', `translate(0, ${h - p})`)
          .attr('id', 'x-axis')

        
        const yAxis = d3.axisLeft(yScale)
        svg.append('g')
          .attr('transform', `translate(${p}, 0)`)
          .attr('id', 'y-axis')
          .call(yAxis)
  }

  return (
    <div className="App">
    <h1 id="title">{title}</h1>
    <div id="chart-container"></div>
    </div>
  );
}

export default App;
