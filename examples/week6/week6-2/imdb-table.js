
function visualize(data) {
  data = data.filter(d => d.IMDB_Rating > 0 & d.Rotten_Tomatoes_Rating> 0);
  let scales = make_scales(data)
  initialize(data, scales);
}

function initialize(data, scales) {
  d3.select("#circles")
    .selectAll("circle")
    .data(data, d => d.Title).enter()
    .append("circle")
    .attrs({
      class: "plain",
      cx: d => scales.x(d.IMDB_Rating),
      cy: d => scales.y(d.Rotten_Tomatoes_Rating),
      fill: d => scales.fill(d.Genre_Group)
    })
    .on("mouseover", (ev, d) => mouseover(ev, d))
    .on("mouseout", (ev) => mouseout(ev))

  d3.select("#tooltip").append("text")
  annotations(scales)
}

function mouseover(ev, d) {
  d3.select("#title").text(d.Title)
  d3.select("#genre").text(d.Genre_Group)
  d3.select("#year").text(d.Release_Date)
  d3.select("#gross").text(d.Worldwide_Gross)
  d3.select(ev.target).attr("class", "highlighted")
}

function mouseout(ev, d) {
  d3.select(ev.target).attr("class", "plain")
}

function annotations(scales) {
  let x_axis = d3.select("#axes").append("g")
      y_axis = d3.select("#axes").append("g"),
      x_title = d3.select("#axes").append("text"),
      y_title = d3.select("#axes").append("text");

  x_axis.attr("transform", `translate(0, ${height - margins.bottom})`)
    .call(d3.axisBottom(scales.x).ticks(4))
  y_axis.attr("transform", `translate(${margins.left}, 0)`)
    .call(d3.axisLeft(scales.y).ticks(4))

  x_title.text("IMDB")
    .attrs({
      class: "label_title",
      transform: `translate(${0.5 * width}, ${height - 0.25 * margins.bottom})`,
    })
  y_title.text("Rotten Tomatoes")
    .attrs({
      class: "label_title",
      transform: `translate(${0.25 * margins.left}, ${0.5 * height})rotate(-90)`
    });
}

function make_scales(data) {
  return {
    x: d3.scaleLinear()
         .domain(d3.extent(data.map(d => d.IMDB_Rating)))
         .range([margins.left, width - margins.right]),
    y: d3.scaleLinear()
         .domain(d3.extent(data.map(d => d.Rotten_Tomatoes_Rating)))
         .range([height - margins.bottom, margins.top]),
    fill: d3.scaleOrdinal()
      .domain([... new Set(data.map(d => d.Genre_Group))])
      .range(d3.schemeSet2)
  }
}

let width = 700,
  height = 500,
  genres = ["Drama"]
  margins = {left: 60, right: 60, top: 60, bottom: 60};
d3.csv("movies.csv", d3.autoType)
  .then(visualize);
