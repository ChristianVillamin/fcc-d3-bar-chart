d3.json(
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
).then(dataset => {
  const svgWidth = 800;
  const svgHeight = 600;
  const svgPadding = 60;
  const svgPaddingTop = 120;
  const barWidth = (svgWidth - svgPadding * 2) / dataset.data.length;

  // CONTAINER
  d3.select('body')
    .append('div')
    .attr('id', 'container')
    .style('position', 'absolute')
    .style('width', `${svgWidth}px`)
    .style('height', `${svgHeight}px`)
    .style('top', '50%')
    .style('left', '50%')
    .style('transform', 'translate(-50%, -50%)')
    .style('box-shadow', '0 0 5px gray');

  // SVG
  const svg = d3
    .select('#container')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .attr('class', 'svg-container')
    .style('background-color', 'pink');

  // TITLE
  d3.select('#container')
    .append('h1')
    .text('United States GDP')
    .attr('id', 'title')
    .style('position', 'absolute')
    .style('left', `${svgWidth / 2}px`)
    .style('top', '10px')
    .style('transform', `translateX(-50%)`);

  // X-AXIS
  const years = dataset.data.map(d => new Date(d[0]));

  const xScale = d3
    .scaleTime()
    .domain([d3.min(years), d3.max(years)])
    .range([svgPadding, svgWidth - svgPadding]);

  const xAxis = d3.axisBottom().scale(xScale);

  svg
    .append('g')
    .attr('transform', 'translate(0,' + (svgHeight - svgPadding) + ')')
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

  // THE BARS
  const yearsQ = dataset.data.map(d => {
    const q = d[0].substring(5, 7);
    const year = q == '01' ? 'Q1' : q == '04' ? 'Q2' : q == '07' ? 'Q3' : 'Q4';
    return `${d[0].substring(0, 4)} ${year}`;
  });

  const GDPScaler = d3
    .scaleLinear()
    .domain([0, d3.max(GDP)])
    .range([0, svgHeight - svgPadding - svgPaddingTop]);

  const GDPHeight = GDP.map(d => GDPScaler(d));

  const tooltip = d3
    .select('#container')
    .append('h2')
    .text('')
    .attr('id', 'tooltip')
    .style('position', 'absolute')
    .style('left', `${svgWidth / 2}px`)
    .style('top', '50px')
    .style('transform', `translateX(-50%)`);

  const selector = d3
    .select('#container')
    .append('div')
    .style('position', 'absolute')
    .style('width', `${barWidth}px`)
    .style('background-color', 'black')
    .style('opacity', '0.5');

  d3.select('svg')
    .selectAll('rect')
    .data(GDPHeight)
    .enter()
    .append('rect')
    .attr('fill', '#33adff')
    .attr('width', barWidth)
    .attr('height', d => d)
    // .attr('x', (d, i) => svgPadding + i * barWidth)
    .attr('x', (d, i) => xScale(years[i]))
    .attr('y', (d, i) => svgHeight - svgPadding - d)
    .attr('class', 'bar')
    .attr('data-date', (d, i) => dataset.data[i][0])
    .attr('data-gdp', (d, i) => dataset.data[i][1])
    .on('mouseover', (d, i) => {
      tooltip
        .text(`${yearsQ[i]} | $ ${dataset.data[i][1]} Billion`)
        .style('visibility', 'visible')
        .attr('data-date', dataset.data[i][0]);

      selector
        .style('left', `${xScale(years[i])}px`)
        .style('height', `${d}px`)
        .style('top', `${svgHeight - svgPadding - d}px`)
        .style('visibility', 'visible');
    })
    .on('mouseout', d => {
      tooltip.style('visibility', 'hidden');
      selector.style('visibility', 'hidden');
    });
});
