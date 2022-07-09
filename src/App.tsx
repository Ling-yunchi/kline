import {Layout, Menu, Message} from "@arco-design/web-react";
import Content from "@arco-design/web-react/es/Layout/content";
import Header from "@arco-design/web-react/es/Layout/header";
import Sider from "@arco-design/web-react/es/Layout/sider";
import {useState} from "react";
import EChartsReact from "echarts-for-react";
import exampleData from "./assets/example.json";

function App() {
  const [list, setList] = useState([
    {
      id: "1",
      title: "哔哩哔哩 BILI",
    },
    {
      id: "2",
      title: "阿里巴巴 BABA",
    },
    {
      id: "3",
      title: "京东 JD",
    },
  ]);
  const [selected, setSelected] = useState({
    id: "1",
    title: "哔哩哔哩 BILI",
  });
  const upColor = '#00da3c';
  const downColor = '#ec0000';
  const [data, setData] = useState(splitData(exampleData as number[][]));
  const options = {
    animation: false,
    legend: {
      bottom: 10,
      left: 'center',
      data: ['Dow-Jones index', 'MA5', 'MA10', 'MA20', 'MA30']
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      textStyle: {
        color: '#000'
      },
      position: function (pos: number[], params: any, el: any, elRect: any, size: { viewSize: number[]; }) {
        const obj: Record<string, number> = {
          top: 10
        };
        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
        return obj;
      }
      // extraCssText: 'width: 170px'
    },
    axisPointer: {
      link: [
        {
          xAxisIndex: 'all'
        }
      ],
      label: {
        backgroundColor: '#777'
      }
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: false
        },
        brush: {
          type: ['lineX', 'clear']
        }
      }
    },
    brush: {
      xAxisIndex: 'all',
      brushLink: 'all',
      outOfBrush: {
        colorAlpha: 0.1
      }
    },
    visualMap: {
      show: false,
      seriesIndex: 5,
      dimension: 2,
      pieces: [
        {
          value: 1,
          color: downColor
        },
        {
          value: -1,
          color: upColor
        }
      ]
    },
    grid: [
      {
        left: '10%',
        right: '8%',
        height: '50%'
      },
      {
        left: '10%',
        right: '8%',
        top: '63%',
        height: '16%'
      }
    ],
    xAxis: [
      {
        type: 'category',
        data: data.categoryData,
        boundaryGap: false,
        axisLine: { onZero: false },
        splitLine: { show: false },
        min: 'dataMin',
        max: 'dataMax',
        axisPointer: {
          z: 100
        }
      },
      {
        type: 'category',
        gridIndex: 1,
        data: data.categoryData,
        boundaryGap: false,
        axisLine: { onZero: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        min: 'dataMin',
        max: 'dataMax'
      }
    ],
    yAxis: [
      {
        scale: true,
        splitArea: {
          show: true
        }
      },
      {
        scale: true,
        gridIndex: 1,
        splitNumber: 2,
        axisLabel: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false }
      }
    ],
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0, 1],
        start: 98,
        end: 100
      },
      {
        show: true,
        xAxisIndex: [0, 1],
        type: 'slider',
        top: '85%',
        start: 98,
        end: 100
      }
    ],
    series: [
      {
        name: 'Dow-Jones index',
        type: 'candlestick',
        data: data.values,
        itemStyle: {
          color: upColor,
          color0: downColor,
          borderColor: undefined,
          borderColor0: undefined
        },
        tooltip: {
          formatter: function (param: any) {
            param = param[0];
            return [
              'Date: ' + param.name + '<hr size=1 style="margin: 3px 0">',
              'Open: ' + param.data[0] + '<br/>',
              'Close: ' + param.data[1] + '<br/>',
              'Lowest: ' + param.data[2] + '<br/>',
              'Highest: ' + param.data[3] + '<br/>'
            ].join('');
          }
        }
      },
      {
        name: 'MA5',
        type: 'line',
        data: calculateMA(5, data),
        smooth: true,
        lineStyle: {
          opacity: 0.5
        }
      },
      {
        name: 'MA10',
        type: 'line',
        data: calculateMA(10, data),
        smooth: true,
        lineStyle: {
          opacity: 0.5
        }
      },
      {
        name: 'MA20',
        type: 'line',
        data: calculateMA(20, data),
        smooth: true,
        lineStyle: {
          opacity: 0.5
        }
      },
      {
        name: 'MA30',
        type: 'line',
        data: calculateMA(30, data),
        smooth: true,
        lineStyle: {
          opacity: 0.5
        }
      },
      {
        name: 'Volume',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: data.volumes
      }
    ]
  };
  return (
    <Layout style={{height: '100%'}}>
      <Header style={{
        height: '60px',
        display: 'flex',
        alignItems: 'center',
      }}>
        <div className="text-3xl font-bold accent-gray-500 m-4">
          KLine - {selected.title}
        </div>
      </Header>
      <Layout>
        <Sider className="w-1/5">
          <Menu
            onClickMenuItem={key => {
              let item: any = list.find(i => i.id === key);
              if (item) {
                setSelected(item);
              } else {
                Message.error('未找到该股票');
              }
            }}>
            {list.map(item => (
              <Menu.Item key={item.id}>{item.title}</Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Content className="flex items-center align-middle" style={{padding: '20px'}}>
          <EChartsReact
            style={{
              height: '300px',
              width: '500px',
            }}
            option={options}
          />
        </Content>
      </Layout>
    </Layout>
  )
}

function splitData(rawData: number[][]) {
  let categoryData = [];
  let values = [];
  let volumes = [];
  for (let i = 0; i < rawData.length; i++) {
    categoryData.push(rawData[i].splice(0, 1)[0]);
    values.push(rawData[i]);
    volumes.push([i, rawData[i][4], rawData[i][0] > rawData[i][1] ? 1 : -1]);
  }

  return {
    categoryData: categoryData,
    values: values,
    volumes: volumes
  };
}

function calculateMA(dayCount: number, data: { values: number[][] }) {
  var result = [];
  for (var i = 0, len = data.values.length; i < len; i++) {
    if (i < dayCount) {
      result.push('-');
      continue;
    }
    var sum = 0;
    for (var j = 0; j < dayCount; j++) {
      sum += data.values[i - j][1];
    }
    result.push(+(sum / dayCount).toFixed(3));
  }
  return result;
}

export default App
