var activeButton = 1;
var c = 10;

const label = document.getElementById("value_c");
const cInput = document.getElementById("cvalue");
const marginValue = document.getElementById('margin-value');
const errorValue = document.getElementById('error-value');

cInput.onchange =  function () {
  c = Math.pow(10, cInput.value);
  label.innerHTML = Math.pow(10, cInput.value);
  updateChart();
};

async function findHypothesis(dataset) {
  try {
    const response = await fetch("/train-svm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataset),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
}

function buildLine(w1, w2, b) {
  const m = -w1 / w2;
  const c = -b / w2;
  xValues = [];
  for (let x = 0; x <= 1; x += 0.1) {
    xValues.push(x);
  }
  yValues = [];
  yValues = xValues.map((x) => m * x + c);
  return { xValues, yValues };
}

var data = {
  labels: ["feature 1", "feature 2"],
  datasets: [
    {
      label: "Dateset 1",
      data: [],
      backgroundColor: "#9BD0F5",
    },
    {
      label: "Dateset 2",
      data: [],
      backgroundColor: "#FFB1C1",
    },
    {
      label: "hyperplane",
      data: [],
      pointRadius: 0,
      borderColor: "green",
      borderWidth: 2,
      showLine: true,
      fill: false,
    },
    {
      label: "+",
      data: [],
      pointRadius: 0,
      borderColor: "red",
      borderWidth: 2,
      showLine: true,
      fill: false,
    },
    {
      label: "-",
      data: [],
      pointRadius: 0,
      borderColor: "red",
      borderWidth: 2,
      showLine: true,
      fill: false,
    },
  ],
};

async function updateChart() {
  const createdDataset = createDataset(
    data.datasets[0].data,
    data.datasets[1].data
  );
  dataset = createdDataset["dataset"];
  flag = createdDataset["flag"];

  if (flag) {
    let hypothesis = await findHypothesis(dataset);
    const w1 = hypothesis["weights"][0];
    const w2 = hypothesis["weights"][1];
    const b = hypothesis["bias"];
    const margin = hypothesis["margin"];
    const error = hypothesis["error"];

    marginValue.innerHTML = margin;
    errorValue.innerHTML = error;

    const line = buildLine(w1, w2, b);
    const xValues = line["xValues"];
    const yValues = line["yValues"];

    data.datasets[2].data = xValues.map((x, i) => ({
      x: x,
      y: yValues[i],
    }));
    data.datasets[3].data = xValues.map((x, i) => ({
      x: x,
      y: yValues[i] - 1 / w2,
    }));
    data.datasets[4].data = xValues.map((x, i) => ({
      x: x,
      y: yValues[i] + 1 / w2,
    }));
  }
  myChart.update();
}

function createDataset(data1, data2) {
  let features = new Array();
  let labels = new Array();

  for (let i = 0; i < data1.length; i++) {
    features.push([data1[i].x, data1[i].y]);
    labels.push(0);
  }
  for (let i = 0; i < data2.length; i++) {
    features.push([data2[i].x, data2[i].y]);
    labels.push(1);
  }
  const dataset = {
    features: features,
    labels: labels,
    c: c,
  };

  let flag = true;
  if (data1.length === 0 || data2.length === 0) {
    flag = false;
  }
  return { dataset, flag };
}

var config = {
  type: "scatter",
  data: data,
  options: {
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        suggestedMin: 0,
        suggestedMax: 1,
      },
      y: {
        type: "linear",
        position: "left",
        suggestedMin: 0,
        suggestedMax: 1,
      },
    },
    onClick: async (e) => {
      const canvasPosition = Chart.helpers.getRelativePosition(e, myChart);
      const dataX = myChart.scales.x.getValueForPixel(canvasPosition.x);
      const dataY = myChart.scales.y.getValueForPixel(canvasPosition.y);
      if (activeButton === 1) {
        data.datasets[0].data.push({ x: dataX, y: dataY });
      } else if (activeButton === 2) {
        data.datasets[1].data.push({ x: dataX, y: dataY });
      }

      await updateChart();
    },
    layout: {
      padding: {
        top: 10,
        right: 380,
        left: 380,
        bottom: 40,
      },
    },
  },
};

const button_1 = document.getElementById("b1");
const button_2 = document.getElementById("b2");

button_1.onclick = function () {
  activeButton = 1;
  button_1.classList.add("selected");
  button_2.classList.remove("selected");
};
button_2.onclick = function () {
  activeButton = 2;
  button_2.classList.add("selected");
  button_1.classList.remove("selected");
};

const canvas = document.getElementById("myChart");
const ctx = canvas.getContext("2d");

const myChart = new Chart(ctx, config);
