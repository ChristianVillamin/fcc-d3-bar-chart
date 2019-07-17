const dataURL =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

const svgWidth = 900;
const svgHeight = 450;
const svgPadding = 60;
const svgPaddingTop = 90;

d3.select('#container')
  .style('width', `${svgWidth}px`)
  .style('height', `${svgHeight}px`);

d3.select('#title').style('left', `${svgWidth / 2}px`);

// SVG
const svg = d3
  .select('#container')
  .append('svg')
  .attr('class', 'svg-container')
  .attr('width', svgWidth)
  .attr('height', svgHeight);

// Data
d3.json(dataURL).then(dataset => visualize(dataset));

const visualize = dataset => {
  // X-AXIS
  const years = dataset.data.map(d => new Date(d[0]));

  const xScale = d3
    .scaleTime()
    .domain([d3.min(years), d3.max(years)])
    .range([svgPadding, svgWidth - svgPadding]);

  const xAxis = d3.axisBottom().scale(xScale);

  svg
    .append('g')
    .attr('transform', `translate(0,${svgHeight - svgPadding})`)
    .attr('id', 'x-axis')
    .call(xAxis);

  // Y-AXIS
  const GDP = dataset.data.map(d => d[1]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(GDP)])
    .range([svgHeight - svgPadding, svgPaddingTop]);

  const yAxis = d3.axisLeft().scale(yScale);

  svg
    .append('g')
    .attr('transform', `translate(${svgPadding}, 0)`)
    .attr('id', 'y-axis')
    .call(yAxis);

  // Tooltip
  const tooltip = d3.select('#tooltip').style('left', `${svgWidth / 2}px`);

  const yearsQ = dataset.data.map(d => {
    const q = d[0].substring(5, 7);
    const year = q == '01' ? 'Q1' : q == '04' ? 'Q2' : q == '07' ? 'Q3' : 'Q4';
    return `${d[0].substring(0, 4)} ${year}`;
  });

  const selector = d3
    .select('#selector')
    .style('width', `${(svgWidth - svgPadding * 2) / dataset.data.length}px`);

  // Bars
  const GDPScaler = d3
    .scaleLinear()
    .domain([0, d3.max(GDP)])
    .range([0, svgHeight - svgPadding - svgPaddingTop]);

  const GDPHeight = GDP.map(d => GDPScaler(d));

  svg
    .selectAll('rect')
    .data(GDPHeight)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('data-date', (d, i) => dataset.data[i][0])
    .attr('data-gdp', (d, i) => dataset.data[i][1])
    .attr('x', (d, i) => xScale(years[i]))
    .attr('y', (d, i) => svgHeight - svgPadding - d)
    .attr('width', (svgWidth - svgPadding * 2) / dataset.data.length)
    .attr('height', d => d)
    .attr('fill', '#339911')
    .on('mouseover', (d, i) => {
      tooltip
        .html(`${yearsQ[i]}<br/>$${dataset.data[i][1].toFixed(2)} Billion`)
        .style('visibility', 'visible')
        .attr('data-date', dataset.data[i][0]);

      selector
        .style('left', `${xScale(years[i])}px`)
        .style('height', `${d}px`)
        .style('top', `${svgHeight - svgPadding - d}px`)
        .style('visibility', 'visible');
    })
    .on('mouseout', () => {
      tooltip.style('visibility', 'hidden');
      selector.style('visibility', 'hidden');
    });
};
