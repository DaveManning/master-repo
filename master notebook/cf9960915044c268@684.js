function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Master Dashboard Template</h1></div>

# Master Dashboard Template`
)}

function _2(md){return(
md`# Data Setup`
)}

function _core(FileAttachment){return(
FileAttachment("core_data@3.csv").csv()
)}

function _industry(FileAttachment){return(
FileAttachment("industry_data.csv").csv()
)}

function _impact(FileAttachment){return(
FileAttachment("QuarterlyRevenue_data@1.csv").csv()
)}

function _scenario(FileAttachment){return(
FileAttachment("scenario_data@1.csv").csv()
)}

function _pareto(FileAttachment){return(
FileAttachment("Pareto_data@2.csv").csv()
)}

function _8(md){return(
md`#  The Core Problem
`
)}

function _9(md){return(
md`**Chart 1The Core Problem:** A high-level view of the issue that the prospect has articulated, basically repeating back to show that they have been understood and restating in a way to lead them to our initial hypothesis. This requires great flexibility, since we never know what to expect, and tailored to their level of data literacy. I’m starting with a line chart as the clearest way to visualize trends over time which will probably adapt to a majority of problems we receive, and with more complex initial data can be expanded to _area_ or _stacked area_ charts.`
)}

function _Chart1_coreProblem(Plot,core){return(
Plot.plot({
  marks: [
    Plot.ruleY([0]),
    Plot.lineY(core, { x: "date", y: "sales", stroke: "category" })
  ]
})
)}

function _11(md){return(
md`# Financial Impact
`
)}

function _12(md){return(
md`**Chart 2 Financial Impact:** A projection of the problem's cost and articulating to the prospect, as forcefully as possible, their own pain point. I’ve chosen a basic column chart because you can easily start adding stacked data points if the story calls for it and the x-axis can be time based to dovetail from **Chart 1**.`
)}

function _Chart2_finImpact(Plot,impact){return(
Plot.plot({
  marks: [
    Plot.barY(impact, {
      x: "date",
      y: "revenue_millions",
      sort: { x: "y", reverse: true }
    }),
    Plot.ruleY([0])
  ]
})
)}

function _14(md){return(
md`# Industry Benchmark`
)}

function _15(md){return(
md`**Chart 3 Industry Benchmark:** Compares the client's metric to the market and brings the first part of our presentation to a close. We have agreed on the problem, shown why its a serious problem, and now put it in environmental perspective. I’m going with a scatter plot to compare different variables, highlight patterns, clusters, and outliers, then start layering additional data with colors, grid backgrounds and slide shows, moving on to _bubble charts_, a _2x2 matrix_, or even linear regression analysis. Observable’s mouse-over tips will be a great tool here. Very versitile.`
)}

function _Chart3_industryBench(Plot,industry){return(
Plot.plot({
  marks: [Plot.dot(industry, { x: "quarter", y: "revenue", stroke: "segment" })]
})
)}

function _17(md){return(
md`# Root Cause Exploration`
)}

function _18(md){return(
md`**Chart 4 Root Cause Exploration:** Now we come to the closer, our key hypotheses (one but maybe two, three only in the rarest of cases). This must communicate our big, intangible Value Add and the tendency may be to pull out all the stops and flex our data viz chops, but this must be resisted. Our goal in this initial contact point  is twofold; create trust by keeping our claims modest, the first part of “under-commit and over-deliver”, and qualify the lead, if they are unable or unwilling to see our value proposition, then we probably don’t want to work with them. I’m putting kind of a placeholder here, my first attempt at combining a line and bar graph, because its the closest thing I could come to a _Pareto chart_, which can effectively showcase the key contributing factors to a particular outcome and highlight problems based on their impact. Perhaps you can help me accomplish this or another way to achieve the same result. An additional option might be a _Tree Map_, to break the core problem into manageable parts.`
)}

async function _pareto_rows(FileAttachment){return(
await FileAttachment("Pareto_data@2.csv").csv({ typed: false })
)}

function _clean_pareto(pareto_rows){return(
pareto_rows
  .flatMap((d) => [
    {
      hypothesis: d["Pain Points"],
      dimension: "Revenue",
      impact: +d["Revenue impact (w=25%)"] || 0
    },
    {
      hypothesis: d["Pain Points"],
      dimension: "Margin",
      impact: +d["Margin impact (w=35%)"] || 0
    },
    {
      hypothesis: d["Pain Points"],
      dimension: "Cash",
      impact: +d["Cash impact (w=15%)"] || 0
    },
    {
      hypothesis: d["Pain Points"],
      dimension: "Customer",
      impact: +d["Customer impact (w=15%)"] || 0
    },
    {
      hypothesis: d["Pain Points"],
      dimension: "Strategic",
      impact: +d["Strategic impact (w=10%)"] || 0
    }
  ])
  .filter((d) => d.hypothesis && d.impact > 0)
)}

function _impact_dimension(Inputs,clean_pareto){return(
Inputs.select(
  [...new Set(clean_pareto.map((d) => d.dimension))],
  { label: "Impact dimension" }
)
)}

function _pareto_filtered(clean_pareto,impact_dimension){return(
clean_pareto.filter((d) => d.dimension === impact_dimension)
)}

function _pareto_sorted(pareto_filtered,d3){return(
pareto_filtered
  .slice()
  .sort((a, b) => d3.descending(a.impact, b.impact))
)}

function _pareto_total(d3,pareto_sorted){return(
d3.sum(pareto_sorted, (d) => d.impact)
)}

function _pareto_data(pareto_sorted,d3,pareto_total){return(
pareto_sorted.map((d, i) => {
  const cum = d3.sum(pareto_sorted.slice(0, i + 1), (x) => x.impact);
  return { ...d, cumShare: cum / pareto_total };
})
)}

function _26(pareto_filtered){return(
pareto_filtered[0]
)}

function _27(pareto_total){return(
pareto_total
)}

function _28(pareto_data){return(
pareto_data[0]
)}

function _29(clean_pareto){return(
clean_pareto[0]
)}

function _pareto_chart(Plot,impact_dimension,pareto_data,pareto_total){return(
Plot.plot({
  marginLeft: 220,
  x: { label: `${impact_dimension} impact`, grid: true },
  y: { label: null },
  marks: [
    Plot.barX(pareto_data, {
      x: "impact",
      y: "hypothesis",
      fill: "steelblue"
    }),
    Plot.lineX(pareto_data, {
      x: (d) => d.cumShare * pareto_total,
      y: (_, i) => i,
      stroke: "firebrick",
      strokeWidth: 2
    }),
    Plot.ruleX([0.8 * pareto_total], {
      stroke: "orange",
      strokeDasharray: "4,2"
    })
  ]
})
)}

function _31(md){return(
md`# (Interactive) Scenario Modeler`
)}

function _32(md){return(
md`**Chart 5 (Interactive) Scenario Modeler:** If they get this far the hook is set, time to give them some line to play with, using Observable Inputs.slider or Inputs.select to allow the user to change a variable and see the outcome.A good idea might be to use **Chart 2 Financial Impact** to make it dynamic.`
)}

function _33(Plot,scenario){return(
Plot.plot({
  marks: [
    Plot.frame(),
    Plot.ruleY([0]),
    Plot.lineY(scenario, { x: "Quarter", y: "Gross_Revenue" })
  ]
})
)}

function _34(Plot,scenario){return(
Plot.plot({
  marks: [
    Plot.frame(),
    Plot.ruleY([0]),
    Plot.lineY(scenario, { x: "Quarter", y: "Net_Margins" })
  ]
})
)}

function _35(Plot,scenario){return(
Plot.plot({
  marks: [
    Plot.frame(),
    Plot.ruleY([0]),
    Plot.lineY(scenario, { x: "Quarter", y: "NRR" })
  ]
})
)}

function _36(Plot,scenario){return(
Plot.plot({
  marks: [
    Plot.frame(),
    Plot.ruleY([0]),
    Plot.lineY(scenario, { x: "Quarter", y: "CAC_Payback" })
  ]
})
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["core_data@3.csv", {url: new URL("./files/21bc1af3bd310e7edf09ea5bb56375f7f9b8bd98706c7d458612951044eddbaaf8a4d9bfadb0001da8f7db073b097b1c91da7a5bb508c09ad04ddfb685236739.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["industry_data.csv", {url: new URL("./files/3f5073ccebf0379482595e37ffb58e4b991d4516f24ec4eda8f603cf197d66dcf1ae9a37cc890916d3c8412fbcff04d9bdc18049fabc1220d0ca1a67ca4b5668.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["QuarterlyRevenue_data@1.csv", {url: new URL("./files/b0f97259a36807295eed6a4812756d368c0711d941fac13d9c173c1ca274d6078c6f834516b29c2c56368900ed7bdbf7b5a9da8160a77045ace9529431fa9569.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["scenario_data@1.csv", {url: new URL("./files/9476a600746343cf25a2027574b555c12760e373a04c20c9bad523d243971d5bce634e5b7f4e385e8136782c11c5e6d135df0bce54942e7cf865e64958a18963.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["Pareto_data@2.csv", {url: new URL("./files/99f7033e8cf22610d0a1810e0b4412a9cf35f38b59d5db25da60e5ebf8a0931cfd7756f3f1db61417e032bc7a749416bb78044aed26d718ef337dbc3d06c9006.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("core")).define("core", ["FileAttachment"], _core);
  main.variable(observer("industry")).define("industry", ["FileAttachment"], _industry);
  main.variable(observer("impact")).define("impact", ["FileAttachment"], _impact);
  main.variable(observer("scenario")).define("scenario", ["FileAttachment"], _scenario);
  main.variable(observer("pareto")).define("pareto", ["FileAttachment"], _pareto);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer("Chart1_coreProblem")).define("Chart1_coreProblem", ["Plot","core"], _Chart1_coreProblem);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer("Chart2_finImpact")).define("Chart2_finImpact", ["Plot","impact"], _Chart2_finImpact);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer()).define(["md"], _15);
  main.variable(observer("Chart3_industryBench")).define("Chart3_industryBench", ["Plot","industry"], _Chart3_industryBench);
  main.variable(observer()).define(["md"], _17);
  main.variable(observer()).define(["md"], _18);
  main.variable(observer("pareto_rows")).define("pareto_rows", ["FileAttachment"], _pareto_rows);
  main.variable(observer("clean_pareto")).define("clean_pareto", ["pareto_rows"], _clean_pareto);
  main.variable(observer("viewof impact_dimension")).define("viewof impact_dimension", ["Inputs","clean_pareto"], _impact_dimension);
  main.variable(observer("impact_dimension")).define("impact_dimension", ["Generators", "viewof impact_dimension"], (G, _) => G.input(_));
  main.variable(observer("pareto_filtered")).define("pareto_filtered", ["clean_pareto","impact_dimension"], _pareto_filtered);
  main.variable(observer("pareto_sorted")).define("pareto_sorted", ["pareto_filtered","d3"], _pareto_sorted);
  main.variable(observer("pareto_total")).define("pareto_total", ["d3","pareto_sorted"], _pareto_total);
  main.variable(observer("pareto_data")).define("pareto_data", ["pareto_sorted","d3","pareto_total"], _pareto_data);
  main.variable(observer()).define(["pareto_filtered"], _26);
  main.variable(observer()).define(["pareto_total"], _27);
  main.variable(observer()).define(["pareto_data"], _28);
  main.variable(observer()).define(["clean_pareto"], _29);
  main.variable(observer("pareto_chart")).define("pareto_chart", ["Plot","impact_dimension","pareto_data","pareto_total"], _pareto_chart);
  main.variable(observer()).define(["md"], _31);
  main.variable(observer()).define(["md"], _32);
  main.variable(observer()).define(["Plot","scenario"], _33);
  main.variable(observer()).define(["Plot","scenario"], _34);
  main.variable(observer()).define(["Plot","scenario"], _35);
  main.variable(observer()).define(["Plot","scenario"], _36);
  return main;
}
