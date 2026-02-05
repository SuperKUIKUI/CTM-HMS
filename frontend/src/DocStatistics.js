import React, { Component } from "react";
import {
  Box,
  Heading,
  Grommet,
  Card,
  CardBody,
  CardHeader,
  Text,
  Button,
  ResponsiveContext
} from "grommet";
import { FormPreviousLink } from 'grommet-icons';

// ==========================================
// 1. 全域工業風黑白主題
// ==========================================
const theme = {
  global: {
    colors: {
      brand: '#000000',
      control: '#000000',
      focus: 'transparent',
      "neutral-gray": "#cccccc",
      background: "#ffffff",
      text: "#000000",
    },
    font: {
      family: '"Lato", "Helvetica Neue", "Microsoft JhengHei", sans-serif',
    },
  },
  card: {
    container: {
      round: "none",
      elevation: "none"
    }
  }
};

const CHART_COLORS = {
  primary: "#000000",
  secondary: "#666666",
  tertiary: "#999999",
  grid: "#eeeeee"
};

// CSS 動畫與全局樣式
const AnimationStyles = () => (
  <style>{`
    @keyframes growBar { from { transform: scaleY(0); } to { transform: scaleY(1); } }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes drawLine { from { stroke-dashoffset: 1000; } to { stroke-dashoffset: 0; } }

    .chart-bar { 
      transform-origin: bottom; 
      animation: growBar 0.8s cubic-bezier(0.17, 0.67, 0.83, 0.67) forwards;
    }
    .chart-line-path { 
      stroke-dasharray: 1000; 
      stroke-dashoffset: 1000; 
      animation: drawLine 1.5s ease-out forwards; 
    }
    .fade-in-up { animation: fadeIn 0.6s ease-out forwards; }
    
    /* 禁止圖表標籤換行 */
    .no-wrap { white-space: nowrap; }
  `}</style>
);

// ==========================================
// 2. 數據統計子組件
// ==========================================

// 統計卡片
const StatCard = ({ title, value, subtitle }) => (
  <Box 
    flex={false}
    background="white" 
    pad="medium" 
    border={{ color: 'black', size: 'medium' }} 
    className="fade-in-up"
    style={{ minWidth: '180px' }}
  >
    <Text size="small" weight="bold" color="dark-4">{title}</Text>
    <Heading level="1" margin={{ vertical: "xsmall" }} style={{ fontWeight: 900, fontSize: '2.5rem' }}>
      {value}
    </Heading>
    <Text size="xsmall" color="dark-4" weight="bold">{subtitle}</Text>
  </Box>
);

// 修復後的柱狀圖
const BarChart = ({ data, labels, height = 220 }) => {
  if (!data || data.length === 0) return <Box pad="medium" align="center"><Text>暫無數據</Text></Box>;
  
  const numericData = data.map(v => Number(v) || 0);
  const maxValue = Math.max(...numericData, 1) * 1.2;

  return (
    <Box height={`${height}px`} flex={false} justify="end">
      <Box 
        direction="row" 
        align="end" 
        justify="between" 
        height="180px"  // 固定繪圖區高度
        border={{ side: 'bottom', color: 'black', size: 'small' }}
      >
        {numericData.map((value, index) => {
          // 強制計算高度像素值，防止塌陷
          const calculatedHeight = (value / maxValue) * 180;
          return (
            <Box key={index} align="center" justify="end" flex="grow" style={{ height: '100%' }}>
              <Text size="xsmall" weight="bold" margin={{ bottom: "xsmall" }}>{value}</Text>
              <Box 
                className="chart-bar" 
                background={index % 2 === 0 ? "black" : "#666"}
                width="70%" 
                maxWidth="40px"
                style={{ 
                  height: `${calculatedHeight}px`, 
                  animationDelay: `${index * 0.05}s` 
                }}
              />
            </Box>
          );
        })}
      </Box>
      <Box direction="row" justify="between" margin={{ top: "xsmall" }}>
        {labels.map((label, i) => (
          <Box key={i} align="center" flex="grow">
            <Text size="xsmall" weight="bold" className="no-wrap">{label}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// 趨勢折線圖
const LineChart = ({ data, labels, height = 240 }) => {
  if (!data || data.length === 0) return null;
  const svgWidth = 800;
  const svgHeight = height;
  const padding = { left: 40, right: 40, top: 30, bottom: 40 };
  const maxValue = Math.max(...data, 1) * 1.2;

  const getX = (i) => padding.left + (i / (data.length - 1)) * (svgWidth - padding.left - padding.right);
  const getY = (v) => svgHeight - padding.bottom - (v / maxValue) * (svgHeight - padding.top - padding.bottom);
  
  const points = data.map((v, i) => ({ x: getX(i), y: getY(v) }));
  const d = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;

  return (
    <Box height={`${height}px`} flex={false}>
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        <path d={d} fill="none" stroke="black" strokeWidth="4" className="chart-line-path" />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="5" fill="black" />
            <text x={p.x} y={p.y - 15} textAnchor="middle" fontSize="14" fontWeight="bold">{data[i]}</text>
            <text x={p.x} y={svgHeight - 10} textAnchor="middle" fontSize="12" fontWeight="bold">{labels[i]}</text>
          </g>
        ))}
        <line x1={padding.left} y1={svgHeight - padding.bottom} x2={svgWidth - padding.right} y2={svgHeight - padding.bottom} stroke="black" strokeWidth="2" />
      </svg>
    </Box>
  );
};

// 性別分佈餅圖
const PieChart = ({ data, labels }) => {
  const total = data.reduce((sum, v) => sum + v, 0) || 1;
  const colors = ["#000000", "#666666", "#cccccc"];
  let currentAngle = 0;

  return (
    <Box direction="row-responsive" align="center" justify="center" gap="xlarge" flex={false}>
      <svg viewBox="0 0 100 100" style={{ width: '160px', height: '160px', transform: 'rotate(-90deg)' }}>
        {data.map((value, i) => {
          const angle = (value / total) * 360;
          const x1 = 50 + 45 * Math.cos(currentAngle * Math.PI / 180);
          const y1 = 50 + 45 * Math.sin(currentAngle * Math.PI / 180);
          currentAngle += angle;
          const x2 = 50 + 45 * Math.cos(currentAngle * Math.PI / 180);
          const y2 = 50 + 45 * Math.sin(currentAngle * Math.PI / 180);
          const pathData = `M 50 50 L ${x1} ${y1} A 45 45 0 ${angle > 180 ? 1 : 0} 1 ${x2} ${y2} Z`;
          return <path key={i} d={pathData} fill={colors[i % 3]} stroke="white" strokeWidth="1" />;
        })}
      </svg>
      <Box gap="small">
        {labels.map((l, i) => (
          <Box key={i} direction="row" align="center" gap="small">
            <Box width="14px" height="14px" background={colors[i % 3]} border={{ color: 'black' }} />
            <Text weight="bold" size="medium">{l}: {data[i]} 人 ({((data[i]/total)*100).toFixed(1)}%)</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// ==========================================
// 3. 主頁面組件
// ==========================================
export default class DocStatistics extends Component {
  state = {
    loading: true,
    apptStats: [],
    genderStats: []
  };

  componentDidMount() {
    this.fetchStatistics();
  }

  fetchStatistics = () => {
    fetch('http://localhost:3001/doctorStatistics')
      .then(res => res.json())
      .then(res => {
        this.setState({ 
          apptStats: res.apptStats || [], 
          genderStats: res.genderStats || [],
          loading: false 
        });
      })
      .catch(err => {
        console.error("Fetch Error:", err);
        this.setState({ loading: false });
      });
  }

  render() {
    const { loading, apptStats, genderStats } = this.state;
    
    // 預算邏輯
    const totalAppts = apptStats.reduce((s, i) => s + i.count, 0);
    const totalNew = apptStats.reduce((s, i) => s + i.newPatients, 0);
    const avgLoad = apptStats.length > 0 ? Math.round(totalAppts / apptStats.length) : 0;

    return (
      <Grommet theme={theme} full>
        <AnimationStyles />
        <Box fill background="#f7f7f7" overflow={{ vertical: 'auto' }}>
          
          {/* 頂部欄 */}
          <Box 
            tag='header' flex={false} direction='row' align='center' 
            background='black' pad={{ horizontal: 'medium', vertical: 'small' }}
            elevation="none"
          >
            <Button icon={<FormPreviousLink color="white" />} href="/DocHome" plain />
            <Heading level='3' margin='none' color="white" style={{ fontWeight: 800, letterSpacing: '1px' }}>
              數據統計中心 / STATISTICS CENTER
            </Heading>
          </Box>

          {/* 內容容器 */}
          <Box flex={false} align="center" pad={{ vertical: 'large', horizontal: 'medium' }}>
            <Box width="xlarge" direction="column" gap="medium">
              
              {/* 報表標題 */}
              <Box flex={false} border={{ side: 'bottom', color: 'black', size: 'medium' }} pad={{ bottom: 'small' }}>
                <Heading level="2" margin="none" style={{ fontWeight: 900 }}>醫院營運數據概覽</Heading>
                <Text weight="bold" size="small" color="dark-4">HOSPITAL OPERATIONAL PERFORMANCE REPORT</Text>
              </Box>

              {/* 核心指標卡片 */}
              <Box direction="row-responsive" gap="medium" flex={false}>
                <Box flex><StatCard title="總預約次數" value={totalAppts} subtitle="過去 12 個月累計數據" /></Box>
                <Box flex><StatCard title="新增病患人數" value={totalNew} subtitle="系統新建立檔案總數" /></Box>
                <Box flex><StatCard title="月均接診量" value={avgLoad} subtitle="預計醫師平均工作負荷" /></Box>
              </Box>

              {loading ? (
                <Box align="center" pad="large" flex={false}><Text weight="bold">數據加載中，請稍候...</Text></Box>
              ) : (
                <Box gap="medium" flex={false} direction="column">
                  
                  {/* 折線圖卡片 */}
                  <Card background="white" border={{ color: 'black', size: 'medium' }} flex={false}>
                    <CardHeader pad="medium" border={{ side: 'bottom', color: 'black', size: 'small' }} background="#fafafa">
                      <Text weight="bold">每月預約趨勢分析 (單位：人次)</Text>
                    </CardHeader>
                    <CardBody pad="xlarge" background="white">
                      <LineChart data={apptStats.map(i => i.count)} labels={apptStats.map(i => i.month)} />
                    </CardBody>
                  </Card>

                  {/* 下方分欄圖表 */}
                  <Box direction="row-responsive" gap="medium" flex={false}>
                    
                    {/* 柱狀圖：新增病患 */}
                    <Card flex background="white" border={{ color: 'black', size: 'medium' }}>
                      <CardHeader pad="medium" border={{ side: 'bottom', color: 'black', size: 'small' }} background="#fafafa">
                        <Text weight="bold">新增病患月度統計</Text>
                      </CardHeader>
                      <CardBody pad="medium" justify="center" height="300px">
                        <BarChart 
                          data={apptStats.map(i => i.newPatients)} 
                          labels={apptStats.map(i => i.month)} 
                        />
                      </CardBody>
                    </Card>

                    {/* 餅圖：性別分佈 */}
                    <Card flex background="white" border={{ color: 'black', size: 'medium' }}>
                      <CardHeader pad="medium" border={{ side: 'bottom', color: 'black', size: 'small' }} background="#fafafa">
                        <Text weight="bold">病患性別分佈比例</Text>
                      </CardHeader>
                      <CardBody pad="medium" justify="center" height="300px">
                        <PieChart 
                          data={genderStats.map(i => i.value)} 
                          labels={genderStats.map(i => i.gender)}
                        />
                      </CardBody>
                    </Card>

                  </Box>
                </Box>
              )}

              {/* 頁腳 */}
              <Box align="center" margin={{ top: 'xlarge' }} flex={false}>
                <Box border={{ side: 'top', color: 'black', size: 'small' }} width="small" margin={{ bottom: 'small' }} />
                <Text size="small" weight="bold" color="dark-3">
                  © HOSPITAL MANAGEMENT SYSTEM | AUTHORIZED DATA ACCESS ONLY
                </Text>
              </Box>
              
            </Box>
          </Box>
        </Box>
      </Grommet>
    );
  }
}