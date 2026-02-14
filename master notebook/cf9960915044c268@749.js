function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Master Dashboard Template</h1></div>

# Master Dashboard Template`
)}

function _2(md){return(
md`# Data Setup`
)}

function _core(FileAttachment){return(
FileAttachment("core_data@3.csv").csv({ typed: true })
)}

function _industry(FileAttachment){return(
FileAttachment("industry_data.csv").csv({typed: true})
)}

function _impact(FileAttachment){return(
FileAttachment("QuarterlyRevenue_data@1.csv").csv({ typed: true })
)}

function _scenario(FileAttachment){return(
FileAttachment("scenario_data@1.csv").csv({ typed: true })
)}

function _7(md){return(
md`#  The Core Problem
`
)}

function _8(md){return(
md`**Chart 1The Core Problem:** A high-level view of the issue that the prospect has articulated, basically repeating back to show that they have been understood and restating in a way to lead them to our initial hypothesis. This requires great flexibility, since we never know what to expect, and tailored to their level of data literacy. I’m starting with a line chart as the clearest way to visualize trends over time which will probably adapt to a majority of problems we receive, and with more complex initial data can be expanded to _area_ or _stacked area_ charts.`
)}

function _Chart1_coreProblem(Plot,core){return(
Plot.plot({
  title: "Sales by Category",
  width: 800,
  height: 400,
  y: {
    label: "Sales ($)",
    tickFormat: "$,.0f",
    grid: true
  },
  x: {
    label: "Date",
    type: "utc"
  },
  color: {
    legend: true,
    domain: ["Greek", "Low Fat", "Traditional"],
    range: ["#4e79a7", "#f28e2c", "#e15759"]
  },
  marks: [
    Plot.ruleY([0]),
    Plot.lineY(core, {
      x: "date",
      y: "sales",
      stroke: "category",
      strokeWidth: 2,
      tip: true
    })
  ]
})
)}

function _10(core){return(
core.slice(0, 5)
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
  title: "Financial Impact Over Time",
  width: 800,
  height: 400,
  x: {
    label: "Date",
    type: "utc"
  },
  y: {
    label: "Revenue ($ Millions)",
    tickFormat: (d) => `$${d.toLocaleString()}M`,
    grid: true
  },
  marks: [
    Plot.rectY(impact, {
      x: "date",
      y: "revenue_millions",
      fill: "steelblue",
      interval: "year",
      tip: true
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
  title: "Industry Benchmark by Segment",
  width: 800,
  height: 400,
  x: {
    label: "Date",
    type: "utc"
  },
  y: {
    label: "Revenue ($)",
    tickFormat: "$,.0f",
    grid: true
  },
  color: {
    legend: true,
    domain: [
      "Technical Apparel",
      "Luxury Fashion",
      "Mainstream Mass",
      "Accessible Trend",
      "Affordable Luxury",
      "Ultra‑Value"
    ],
    scheme: "tableau10"
  },
  marks: [
    Plot.dot(industry, {
      x: "quarter",
      y: "revenue",
      stroke: "segment",
      fill: "segment",
      fillOpacity: 0.7,
      r: 4,
      tip: true
    })
  ]
})
)}

function _17(md){return(
md`# Root Cause Exploration`
)}

function _18(md){return(
md`**Chart 4 Root Cause Exploration:** Now we come to the closer, our key hypotheses (one but maybe two, three only in the rarest of cases). This must communicate our big, intangible Value Add and the tendency may be to pull out all the stops and flex our data viz chops, but this must be resisted. Our goal in this initial contact point  is twofold; create trust by keeping our claims modest, the first part of “under-commit and over-deliver”, and qualify the lead, if they are unable or unwilling to see our value proposition, then we probably don’t want to work with them. I’m putting kind of a placeholder here, my first attempt at combining a line and bar graph, because its the closest thing I could come to a _Pareto chart_, which can effectively showcase the key contributing factors to a particular outcome and highlight problems based on their impact. Perhaps you can help me accomplish this or another way to achieve the same result. An additional option might be a _Tree Map_, to break the core problem into manageable parts.`
)}

function _19(md){return(
md`md\`# Pareto Chart (Observable version)

Automatically loads \\\`Pareto_data@2.csv\\\`. Requires columns: \\\`Pain Points\\\` and impact metrics.\``
)}

function _paretoData(require,FileAttachment){return(
(async () => {
  const d3 = await require("d3@7");
  try {
    const file = await FileAttachment("Pareto_data2@1.csv").text();
    return d3.csvParse(file);
  } catch (e) {
    console.warn("CSV not found via FileAttachment:", e.message);
    return [];
  }
})()
)}

function _paretoChart(require,html,paretoData){return(
(async () => {
  const Plotly = await require("https://cdn.plot.ly/plotly-2.20.0.min.js");

  const container = html`<div style="width:100%;height:600px"></div>`;
  if (!paretoData || paretoData.length === 0) {
    container.append(
      "\n",
      html`<div style="color:#666">No data loaded — attach Pareto_data@2.csv via FileAttachment.</div>`
    );
    return container;
  }

  // Columns expected (from original notebook)
  const impactCols = [
    "Revenue impact",
    "Margin impact",
    "Cash impact",
    "Customer impact",
    "Strategic impact"
  ];

  // Aggregate by Pain Points (mean), then sort descending
  const byPain = {};
  paretoData.forEach((d) => {
    const key = d["Pain Points"];
    if (!byPain[key]) byPain[key] = { count: 0 };
    byPain[key].count++;
    impactCols.forEach((c) => {
      const v = parseFloat(d[c]);
      byPain[key][c] = (byPain[key][c] || 0) + (isNaN(v) ? 0 : v);
    });
  });

  const agg = Object.keys(byPain).map((k) => {
    const obj = { "Pain Points": k };
    impactCols.forEach((c) => {
      obj[c] = (byPain[k][c] || 0) / byPain[k].count;
    });
    return obj;
  });

  function prepareTraces(col) {
    const sorted = agg.slice().sort((a, b) => (b[col] || 0) - (a[col] || 0));
    const vals = sorted.map((d) => +d[col] || 0);
    const y = sorted.map((d) => d["Pain Points"]);
    const cum = vals.reduce((acc, v, i, arr) => {
      if (i === 0) acc.push(v);
      else acc.push(acc[i - 1] + v);
      return acc;
    }, []);
    const total = cum.length ? cum[cum.length - 1] : 0;
    const pct = total ? cum.map((v) => (v / total) * 100) : cum.map(() => 0);

    const bar = {
      type: "bar",
      x: vals,
      y: y,
      orientation: "h",
      name: col,
      marker: { color: "steelblue" },
      xaxis: "x1"
    };

    const line = {
      type: "scatter",
      x: pct,
      y: y,
      mode: "lines+markers",
      name: "Cumulative % of " + col,
      marker: { color: "firebrick" },
      xaxis: "x2"
    };

    const cutoff = {
      type: "scatter",
      x: [80, 80],
      y: [y[0], y[y.length - 1]],
      mode: "lines",
      line: { color: "green", dash: "dash" },
      name: "80% cutoff for " + col,
      showlegend: false,
      xaxis: "x2"
    };

    return [bar, line, cutoff];
  }

  // Build initial traces for default column
  const defaultCol = impactCols[0];
  const traces = [];
  impactCols.forEach((col, i) => {
    const t = prepareTraces(col);
    // set visibility only for default
    t.forEach((trace) => (trace.visible = col === defaultCol));
    traces.push(...t);
  });

  const buttons = impactCols.map((col, i) => {
    const visibility = impactCols
      .map((_, j) => [j === i, j === i, j === i])
      .flat();
    return {
      label: col,
      method: "update",
      args: [
        { visible: visibility },
        {
          xaxis: { title: col + " (score)" },
          xaxis2: {
            title: "Cumulative % of total " + col,
            overlaying: "x",
            side: "top",
            range: [0, 110]
          },
          title: "Pareto Chart (Horizontal) – " + col + " by Pain Point"
        }
      ]
    };
  });

  const layout = {
    margin: { l: 250 },
    updatemenus: [
      {
        type: "dropdown",
        direction: "down",
        buttons: buttons,
        x: 0.0,
        y: 1.15,
        xanchor: "left",
        yanchor: "top"
      }
    ],
    title: "Pareto Chart (Horizontal) – " + defaultCol + " by Pain Point",
    yaxis: { title: "Pain Points" },
    xaxis: { title: defaultCol + " (score)", side: "bottom" },
    xaxis2: {
      title: "Cumulative % of total " + defaultCol,
      overlaying: "x",
      side: "top",
      range: [0, 110]
    },
    hovermode: "y unified",
    legend: {
      orientation: "h",
      yanchor: "bottom",
      y: 1.02,
      xanchor: "right",
      x: 1.0
    }
  };

  Plotly.newPlot(container, traces, layout, { responsive: true });
  return container;
})()
)}

function _22(md){return(
md`# (Interactive) Scenario Modeler`
)}

function _23(md){return(
md`**Chart 5 (Interactive) Scenario Modeler:** If they get this far the hook is set, time to give them some line to play with, using Observable Inputs.slider or Inputs.select to allow the user to change a variable and see the outcome.A good idea might be to use **Chart 2 Financial Impact** to make it dynamic.`
)}

function _24(Plot,scenario){return(
Plot.plot({
  marks: [
    Plot.frame(),
    Plot.ruleY([0]),
    Plot.lineY(scenario, { x: "Quarter", y: "Gross_Revenue" })
  ]
})
)}

function _25(Plot,scenario){return(
Plot.plot({
  marks: [
    Plot.frame(),
    Plot.ruleY([0]),
    Plot.lineY(scenario, { x: "Quarter", y: "Net_Margins" })
  ]
})
)}

function _26(Plot,scenario){return(
Plot.plot({
  marks: [
    Plot.frame(),
    Plot.ruleY([0]),
    Plot.lineY(scenario, { x: "Quarter", y: "NRR" })
  ]
})
)}

function _27(Plot,scenario){return(
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
    ["scenario_data@1.csv", {url: new URL("./files/9476a600746343cf25a2027574b555c12760e373a04c20c9bad523d243971d5bce634e5b7f4e385e8136782c11c5e6d135df0bce54942e7cf865e64958a18963.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("core")).define("core", ["FileAttachment"], _core);
  main.variable(observer("industry")).define("industry", ["FileAttachment"], _industry);
  main.variable(observer("impact")).define("impact", ["FileAttachment"], _impact);
  main.variable(observer("scenario")).define("scenario", ["FileAttachment"], _scenario);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer("Chart1_coreProblem")).define("Chart1_coreProblem", ["Plot","core"], _Chart1_coreProblem);
  main.variable(observer()).define(["core"], _10);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer("Chart2_finImpact")).define("Chart2_finImpact", ["Plot","impact"], _Chart2_finImpact);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer()).define(["md"], _15);
  main.variable(observer("Chart3_industryBench")).define("Chart3_industryBench", ["Plot","industry"], _Chart3_industryBench);
  main.variable(observer()).define(["md"], _17);
  main.variable(observer()).define(["md"], _18);
  main.variable(observer()).define(["md"], _19);
  main.variable(observer("paretoData")).define("paretoData", ["require","FileAttachment"], _paretoData);
  main.variable(observer("paretoChart")).define("paretoChart", ["require","html","paretoData"], _paretoChart);
  main.variable(observer()).define(["md"], _22);
  main.variable(observer()).define(["md"], _23);
  main.variable(observer()).define(["Plot","scenario"], _24);
  main.variable(observer()).define(["Plot","scenario"], _25);
  main.variable(observer()).define(["Plot","scenario"], _26);
  main.variable(observer()).define(["Plot","scenario"], _27);
  return main;
}
