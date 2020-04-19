//export {default} from "./8a71475084ce6c0c@43.js";
// https://observablehq.com/d/8a71475084ce6c0c@43
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["IBEX-Spain.csv",new URL("files/IBEX-Spain",import.meta.url)],["NASDAQ-US.csv",new URL("files/NASDAQ-US",import.meta.url)],["DAX-Germany.csv",new URL("files/DAX-Germany",import.meta.url)],["CAC-France.csv",new URL("files/CAC-France",import.meta.url)],["SSE-China.csv",new URL("files/SSE-China",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# DV Assignment 3`
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5", "d3-array@2")
)});
  main.variable(observer("data")).define("data", ["d3","FileAttachment","parseDate"], async function(d3,FileAttachment,parseDate){return(
d3.merge(await Promise.all([FileAttachment("SSE-China.csv"), FileAttachment("NASDAQ-US.csv"), FileAttachment("DAX-Germany.csv"), FileAttachment("IBEX-Spain.csv"), FileAttachment("CAC-France.csv")].map(async file => d3.csvParse(await file.text(), d => {
  const date = parseDate(d["Date"]);
  return {name: file.name.slice(0, -4), date, value: +d["Close"]};
}))))
)});
  main.variable(observer("viewof date")).define("viewof date", ["d3","DOM","width","height","xAxis","yAxis","series","z","line","x","y","bisect"], function(d3,DOM,width,height,xAxis,yAxis,series,z,line,x,y,bisect)
{
  const svg = d3.select(DOM.svg(width, height))
      .style("-webkit-tap-highlight-color", "transparent")
      .on("mousemove touchmove", moved);

  svg.append("g")
//      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
//  svg.append("text")
//      .attr("transform",
//            "translate(" + (width/2) + " ," +
//                           (height + margin.top + 20) + ")")
//      .style("text-anchor", "middle")
//      .text("Date");

  svg.append("g")
      .call(yAxis);

//   svg.append("text")
//      .attr("transform", "rotate(-90)")
//      .attr("y", 0 - margin.left)
//      .attr("x",0 - (height / 2))
//      .attr("dy", "1em")
//      .style("text-anchor", "middle")
//      .text("Normalized Closing Prices");


  const rule = svg.append("g")
    .append("line")
      .attr("y1", height)
      .attr("y2", 0)
      .attr("stroke", "black");

  const serie = svg.append("g")
      .style("font", "bold 10px sans-serif")
    .selectAll("g")
    .data(series)
    .join("g");

  serie.append("path")
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke", d => z(d.key))
      .attr("d", d => line(d.values));

  serie.append("text")
      .datum(d => ({key: d.key, value: d.values[d.values.length - 1].value}))
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 3)
      .attr("x", x.range()[1] + 3)
      .attr("y", d => y(d.value))
      .attr("dy", "0.35em")
      .text(d => d.key)

    .clone(true)
      .attr("fill", d => z(d.key))
      .attr("stroke", null);

  d3.transition()
      .ease(d3.easeCubicOut)
      .duration(1500)
      .tween("date", () => {
        const i = d3.interpolateDate(x.domain()[1], x.domain()[0]);
        return t => update(i(t));
      });

  function update(date) {
    date = d3.utcDay.round(date);
    rule.attr("transform", `translate(${x(date) + 0.5},0)`);
    serie.attr("transform", ({values}) => {
      const i = bisect(values, date, 0, values.length - 1);
      return `translate(0,${y(1) - y(values[i].value / values[0].value)})`;
    });
    svg.property("value", date).dispatch("input");
  }

  function moved() {
    update(x.invert(d3.mouse(this)[0]));
    d3.event.preventDefault();
  }

  update(x.domain()[0]);

  return svg.node();
}
);
  main.variable(observer("date")).define("date", ["Generators", "viewof date"], (G, _) => G.input(_));
  main.variable(observer("height")).define("height", function(){return(
600
)});
  main.variable(observer("margin")).define("margin", function(){return(
{top: 100, right: 400, bottom: 80, left: 40}
)});
  main.variable(observer("x")).define("x", ["d3","data","margin","width"], function(d3,data,margin,width){return(
d3.scaleUtc()
    .domain(d3.extent(data, d => d.date))
    .range([margin.left, width - margin.right])
    .clamp(true)
)});
  main.variable(observer("y")).define("y", ["d3","k","height","margin"], function(d3,k,height,margin){return(
d3.scaleLog()
    .domain([1 / k, k])
    .rangeRound([height - margin.bottom, margin.top])
)});
  main.variable(observer("k")).define("k", ["d3","data"], function(d3,data){return(
d3.max(d3.group(data, d => d.name), ([, group]) => d3.max(group, d => d.value) / d3.min(group, d => d.value))
)});
  main.variable(observer("z")).define("z", ["d3","data"], function(d3,data){return(
d3.scaleOrdinal(d3.schemeCategory10).domain(data.map(d => d.name))
)});
  main.variable(observer("xAxis")).define("xAxis", ["height","margin","d3","x","width"], function(height,margin,d3,x,width){return(
g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
    .call(g => g.select(".domain").remove())
)});
  main.variable(observer("yAxis")).define("yAxis", ["margin","d3","y","width"], function(margin,d3,y,width){return(
g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y)
        .ticks(null, x => +x.toFixed(6) + "×"))
    .call(g => g.selectAll(".tick line").clone()
        .attr("stroke-opacity", d => d === 1 ? null : 0.2)
        .attr("x2", width - margin.left - margin.right))
    .call(g => g.select(".domain").remove())
)});
  main.variable(observer("parseDate")).define("parseDate", ["d3"], function(d3){return(
d3.utcParse("%Y-%m-%d")
)});
  main.variable(observer("formatDate")).define("formatDate", ["d3"], function(d3){return(
d3.utcFormat("%B, %Y")
)});
  main.variable(observer("line")).define("line", ["d3","x","y"], function(d3,x,y){return(
d3.line()
    .x(d => x(d.date))
    .y(d => y(d.value))
)});
  main.variable(observer("bisect")).define("bisect", ["d3"], function(d3){return(
d3.bisector(d => d.date).left
)});
  main.variable(observer("series")).define("series", ["d3","data"], function(d3,data){return(
d3.groups(data, d => d.name).map(([key, values]) => {
  const v = values[0].value;
  return {key, values: values.map(({date, value}) => ({date, value: value / v}))};
})
)});
  return main;
}
