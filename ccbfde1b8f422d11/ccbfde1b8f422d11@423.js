function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Master Dashboard Template</h1></div>

# Master Dashboard Template`
)}

function _2(md){return(
md`# Data Setup`
)}

function _core(FileAttachment){return(
FileAttachment("core_data@1.csv").csv()
)}

function _industry(FileAttachment){return(
FileAttachment("MarketTrends_data@3.csv").csv()
)}

function _impact(FileAttachment){return(
FileAttachment("QuarterlyRevenue_data@1.csv").csv()
)}

function _6(md){return(
md`#  The Core Problem
`
)}

function _7(md){return(
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

function _9(md){return(
md`# Financial Impact
`
)}

function _10(md){return(
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

function _12(md){return(
md`# Industry Benchmark`
)}

function _13(md){return(
md`**Chart 3 Industry Benchmark:** Compares the client's metric to the market and brings the first part of our presentation to a close. We have agreed on the problem, shown why its a serious problem, and now put it in environmental perspective. I’m going with a scatter plot to compare different variables, highlight patterns, clusters, and outliers, then start layering additional data with colors, grid backgrounds and slide shows, moving on to _bubble charts_, a _2x2 matrix_, or even linear regression analysis. Observable’s mouse-over tips will be a great tool here. Very versitile.`
)}

function _Chart3_industryBench(Plot,industry){return(
Plot.plot({
  marks: [Plot.dot(industry, { x: "date", y: "value", stroke: "category" })]
})
)}

function _15(md){return(
md`# Root Cause Exploration`
)}

function _16(md){return(
md`**Chart 4 Root Cause Exploration:** Now we come to the closer, our key hypotheses (one but maybe two, three only in the rarest of cases). This must communicate our big, intangible Value Add and the tendency may be to pull out all the stops and flex our data viz chops, but this must be resisted. Our goal in this initial contact point  is twofold; create trust by keeping our claims modest, the first part of “under-commit and over-deliver”, and qualify the lead, if they are unable or unwilling to see our value proposition, then we probably don’t want to work with them. I’m putting kind of a placeholder here, my first attempt at combining a line and bar graph, because its the closest thing I could come to a _Pareto chart_, which can effectively showcase the key contributing factors to a particular outcome and highlight problems based on their impact. Perhaps you can help me accomplish this or another way to achieve the same result. An additional option might be a _Tree Map_, to break the core problem into manageable parts.`
)}

function _17(md){return(
md`md\`# Pareto Chart (Observable version)

Automatically loads \\\`Pareto_data@2.csv\\\`. Requires columns: \\\`Pain Points\\\` and impact metrics.\``
)}

function _paretoData(require,FileAttachment){return(
(async () => {
  const d3 = await require('d3@7');
  try {
    const file = await FileAttachment("Pareto_data@2.csv").text();
    return d3.csvParse(file);
  } catch(e) {
    console.warn("CSV not found via FileAttachment:", e.message);
    return [];
  }
})()
)}

async function _19(require,html,paretoData)
{
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
}


function _20(md){return(
md`# (Interactive) Scenario Modeler`
)}

function _21(md){return(
md`**Chart 5 (Interactive) Scenario Modeler:** If they get this far the hook is set, time to give them some line to play with, using Observable Inputs.slider or Inputs.select to allow the user to change a variable and see the outcome.A good idea might be to use **Chart 2 Financial Impact** to make it dynamic.`
)}

function _22(md){return(
md`md\`# Scenario Dashboard (Observable)

Select a scenario to view financial metrics over quarters.\``
)}

function _scenarioData(require,FileAttachment){return(
(async () => {
  const d3 = await require('d3@7');
  try {
    const text = await FileAttachment("QuarterlyPnL_data@4.csv").text();
    const rows = d3.csvParse(text);

    // helper to convert quarter strings like '2024-Q1' -> Date (start of quarter)
    function quarterToDate(q) {
      if (!q) return null;
      const s = q.replace(' ', '').replace('q', 'Q');
      const m = s.match(/(\d{4})[- ]?Q(\d)/i);
      if (!m) return new Date(q);
      const year = +m[1];
      const qnum = +m[2];
      const month = (qnum - 1) * 3;
      return new Date(Date.UTC(year, month, 1));
    }

    // Parse numeric metrics and Quarter dates
    const metrics = ['Gross Revenue', 'Net Margins', 'Net Revenue Retention', 'CAC Payback'];
    rows.forEach(r => {
      r.QuarterDate = quarterToDate(r.Quarter || r.Quarters || r['Quarter']);
      metrics.forEach(m => {
        const v = r[m];
        r[m] = v == null || v === '' ? NaN : +String(v).replace(/[,$%]/g, '');
      });
    });

    // Auto-detect and scale percentage-like metrics to percent (0-100)
    metrics.forEach(m => {
      const vals = rows.map(r => r[m]).filter(v => !isNaN(v));
      if (vals.length === 0) return;
      const max = Math.max(...vals);
      if ((m === 'Net Margins' || m === 'Net Revenue Retention') && max <= 5) {
        rows.forEach(r => { if (!isNaN(r[m])) r[m] = r[m] * 100; });
      }
    });

    return rows;
  } catch (e) {
    console.warn('CSV not found via FileAttachment:', e.message);
    return [];
  }
})()
)}

function _scenario(scenarioData,Inputs)
{
  const scenarios = Array.from(new Set(scenarioData.map(d => d.Scenario).filter(Boolean)));
  const opts = scenarios.length ? scenarios : ['Base','Optimistic','Pessimistic'];
  const defaultVal = opts.includes('Base') ? 'Base' : opts[0];
  return Inputs.select({label: 'Scenario', options: opts, value: defaultVal});
}


async function _25(require,html,scenarioData,scenario)
{
  const vegaEmbed = await require("https://cdn.jsdelivr.net/npm/vega-embed@6");

  const container = html`<div style="display:flex;flex-direction:column;gap:18px;width:100%"></div>`;
  if (!scenarioData || scenarioData.length === 0) {
    container.append(
      html`<div style="color:#666">No data loaded — attach QuarterlyPnL_data@4.csv via FileAttachment.</div>`
    );
    return container;
  }

  const metrics = [
    "Gross Revenue",
    "Net Margins",
    "Net Revenue Retention",
    "CAC Payback"
  ];

  // Filter and sort by QuarterDate
  const filtered = scenarioData
    .filter((d) => d.Scenario === scenario)
    .slice()
    .sort((a, b) => (a.QuarterDate || 0) - (b.QuarterDate || 0));

  if (filtered.length === 0) {
    container.append(
      html`<div style="color:#999">No rows for scenario ${scenario}. Showing nothing.</div>`
    );
    return container;
  }

  // Arrange charts in a 2x2 CSS grid (small multiples)
  const grid = html`<div style="display:grid;grid-template-columns: repeat(2, 1fr);gap:18px;width:100%"></div>`;

  for (const metric of metrics) {
    const div = html`<div style="width:100%;height:260px"></div>`;
    const values = filtered.map((d) => ({
      Quarter: d.QuarterDate
        ? d.QuarterDate.toISOString()
        : d.Quarter || d.Quarters,
      value: isNaN(d[metric]) ? null : d[metric]
    }));

    // Per-metric y-axis formatting
    let yAxis = { title: metric };
    if (metric === "Gross Revenue") {
      yAxis.format = "$,.0f";
    } else if (metric === "Net Margins" || metric === "Net Revenue Retention") {
      // Show as percent with one decimal
      yAxis.labelExpr = "format(datum.value, '.1f') + '%'";
    } else if (metric === "CAC Payback") {
      yAxis.format = ".1f";
    }

    const spec = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      description: metric + " — " + scenario,
      data: { values },
      mark: { type: "line", point: true },
      encoding: {
        x: { field: "Quarter", type: "temporal", axis: { title: "Quarter" } },
        y: { field: "value", type: "quantitative", axis: yAxis }
      },
      width: 380,
      height: 260
    };

    try {
      await vegaEmbed(div, spec, { actions: false });
    } catch (err) {
      console.error("vega-embed error", err);
    }
    grid.append(div);
  }

  container.append(grid);

  return container;
}


function _26(Inputs,scenarioData){return(
Inputs.table(scenarioData)
)}

function _27(scenarioData){return(
Object.keys(scenarioData[0])
)}

async function _raw_pareto_text(FileAttachment){return(
await FileAttachment("Pareto_data@2.csv").text()
)}

function _29(raw_pareto_text){return(
raw_pareto_text.slice(0, 400)
)}

async function _rows_debug(FileAttachment){return(
await FileAttachment("Pareto_data@2.csv").csv({ typed: false })
)}

function _31(rows_debug){return(
rows_debug[0]
)}

function _32(rows_debug){return(
Object.keys(rows_debug[0] ?? {})
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["core_data@1.csv", {url: new URL("./files/cd332de7ce82e52355f343d0fb41ce36807c75ddd812c26f71052a186e99c8be46c4b0f65281aa3090ad40544dc8221ffaabf2a2dd9680d71d44a7ba623e30ed.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["MarketTrends_data@3.csv", {url: new URL("./files/2d2971bce31a4325ae6ea9109a6ad9df5929eed7553ba7be2e4fdf98aa292d96ef50cb5ecdfad87f70e64b1a4462ea1730d5893b69d9cd57d21dc62859ac2026.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["QuarterlyRevenue_data@1.csv", {url: new URL("./files/b0f97259a36807295eed6a4812756d368c0711d941fac13d9c173c1ca274d6078c6f834516b29c2c56368900ed7bdbf7b5a9da8160a77045ace9529431fa9569.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["Pareto_data@2.csv", {url: new URL("./files/99f7033e8cf22610d0a1810e0b4412a9cf35f38b59d5db25da60e5ebf8a0931cfd7756f3f1db61417e032bc7a749416bb78044aed26d718ef337dbc3d06c9006.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["QuarterlyPnL_data@4.csv", {url: new URL("./files/b8c4c332b7b1661e916bdc7a1309e7c6dceda3efa594d1913e1a4b421c7889576f33523f31348abaee6efb264da2beab457017f9f2d5c7e65dc28520eb4f9878.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("core")).define("core", ["FileAttachment"], _core);
  main.variable(observer("industry")).define("industry", ["FileAttachment"], _industry);
  main.variable(observer("impact")).define("impact", ["FileAttachment"], _impact);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer("Chart1_coreProblem")).define("Chart1_coreProblem", ["Plot","core"], _Chart1_coreProblem);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer("Chart2_finImpact")).define("Chart2_finImpact", ["Plot","impact"], _Chart2_finImpact);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer()).define(["md"], _13);
  main.variable(observer("Chart3_industryBench")).define("Chart3_industryBench", ["Plot","industry"], _Chart3_industryBench);
  main.variable(observer()).define(["md"], _15);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer()).define(["md"], _17);
  main.variable(observer("paretoData")).define("paretoData", ["require","FileAttachment"], _paretoData);
  main.variable(observer()).define(["require","html","paretoData"], _19);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer()).define(["md"], _21);
  main.variable(observer()).define(["md"], _22);
  main.variable(observer("scenarioData")).define("scenarioData", ["require","FileAttachment"], _scenarioData);
  main.variable(observer("viewof scenario")).define("viewof scenario", ["scenarioData","Inputs"], _scenario);
  main.variable(observer("scenario")).define("scenario", ["Generators", "viewof scenario"], (G, _) => G.input(_));
  main.variable(observer()).define(["require","html","scenarioData","scenario"], _25);
  main.variable(observer()).define(["Inputs","scenarioData"], _26);
  main.variable(observer()).define(["scenarioData"], _27);
  main.variable(observer("raw_pareto_text")).define("raw_pareto_text", ["FileAttachment"], _raw_pareto_text);
  main.variable(observer()).define(["raw_pareto_text"], _29);
  main.variable(observer("rows_debug")).define("rows_debug", ["FileAttachment"], _rows_debug);
  main.variable(observer()).define(["rows_debug"], _31);
  main.variable(observer()).define(["rows_debug"], _32);
  return main;
}
