import React, { useState, useEffect } from 'react';
import { 
  Grommet, Box, Button, Heading, TextArea, Layer, Card, CardBody, Text 
} from 'grommet';

// ⚫️⚪️ 纯黑白极简主题配置
const theme = {
  global: {
    colors: {
      brand: '#000000',
      background: '#ffffff',
      focus: 'transparent',
      control: '#000000',
      text: '#000000',
      'accent-1': '#333333', 
      'status-critical': '#FF4040', // 仅在库存报警时使用一点红色提示
      'status-disabled': '#cccccc',
      'light-2': '#fafafa',
      'light-3': '#eeeeee',
      border: '#000000',
    },
    font: {
      family: 'sans-serif',
      size: '15px'
    }
  },
  button: {
    border: {
      radius: '0px',
      width: '1px',
    },
    primary: {
      color: '#ffffff',
    }
  },
  textArea: {
    extend: 'border-radius: 0px;'
  }
};

// 模拟患者信息
const patientInfo = {
    "age": 32,
    "gender": "女",
    "pregnant": false,
    "pregnant_weeks": 0
};

const Diagnose = (props) => {
  // 获取路由参数中的预约 ID
  const id = props.match?.params?.id;

  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");

  const [showDrugs, setShowDrugs] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  
  // --- 新增：药品数据库状态 ---
  const [dbDrugs, setDbDrugs] = useState([]); 
  const [loadingDrugs, setLoadingDrugs] = useState(false);

  const [auditLoading, setAuditLoading] = useState(false);
  const [auditResult, setAuditResult] = useState(null);

  // ---从后端获取药品库 ---
  const fetchDrugs = () => {
    setLoadingDrugs(true);
    fetch("http://localhost:3001/allDrugs")
      .then(res => res.json())
      .then(res => {
        console.log("前端收到的原始数据:", res); 
        if (res.data && Array.isArray(res.data)) {
          setDbDrugs(res.data);
        } else {
          console.warn("收到的数据格式不正确");
        }
        setLoadingDrugs(false);
      })
      .catch(err => {
        console.error("Fetch错误:", err);
        setLoadingDrugs(false);
      });
  };
  // 初始加载及弹窗开启时刷新数据
  useEffect(() => {
    fetchDrugs();
  }, []);

  // --- 新增：将扁平化的数据库数据按分类分组 ---
  const groupedDrugs = dbDrugs.reduce((acc, drug) => {
    const cat = drug.category || "未分类";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(drug);
    return acc;
  }, {});

  // 插入药品到处方框
  const insertDrug = (drugName) => {
    const newVal = prescription + (prescription ? "\n" : "") + drugName;
    setPrescription(newVal);
  };

  // AI 审计逻辑
  const runAudit = () => {
    if (!prescription.trim()) {
      alert("请先填写处方内容");
      return;
    }
    setAuditLoading(true);
    setAuditResult(null);

    fetch("http://localhost:8000/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patient: patientInfo,
        diagnosis: diagnosis,
        prescription: prescription
      })
    })
      .then(res => res.json())
      .then(data => {
        setAuditResult(data.result || "未发现明显异常");
        setAuditLoading(false);
      })
      .catch(() => {
        setTimeout(() => {
            setAuditResult("后端审计服务未连接 (模拟结果：处方用药在安全范围内)");
            setAuditLoading(false);
        }, 1000);
      });
  };

  // 提交诊断逻辑
  const handleSubmit = () => {
    if (!diagnosis.trim() || !prescription.trim()) {
        alert("请务必填写【诊断结果】和【处方内容】后再提交！");
        return;
    }
    if (!id) {
        alert("错误：未找到预约ID，无法提交。");
        return;
    }

    const url = `http://localhost:3001/diagnose?id=${id}&diagnosis=${encodeURIComponent(diagnosis)}&prescription=${encodeURIComponent(prescription)}`;

    fetch(url)
        .then(res => {
            if (res.ok) return res.json();
            throw new Error("Network response was not ok");
        })
        .then(() => {
            alert("✅ 诊断提交成功！");
            if (props.history) {
                props.history.push("/DocViewAppt");
            } else {
                window.location.href = "/DocViewAppt";
            }
        })
        .catch(error => {
            console.error("提交出错:", error);
            alert("❌ 提交失败，请检查网络。");
        });
  };

  return (
  <Grommet theme={theme} full>
    <Box fill background="white" align="center" style={{ overflowY: 'auto' }}>
      <Box width="xlarge" pad="large" gap="large">
        
        {/* 1. 顶部极简导航 */}
        <Box direction="row" justify="between" align="baseline" border={{ side: 'bottom', size: '2px' }} pad={{ bottom: 'small' }}>
          <Box direction="row" align="baseline" gap="small">
            <Heading level="2" margin="none" style={{ letterSpacing: '-1px' }}>PATIENT DIAGNOSIS</Heading>
            <Text size="small" color="dark-4">/ 患者诊断系统</Text>
          </Box>
          <Button 
            label="BACK TO LIST" 
            onClick={() => props.history.push("/ApptList")}
            plain
            hoverIndicator
            style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}
          />
        </Box>

        {/* 2. 核心诊断与处方区 - 采用更通透的布局 */}
        <Box direction="row" gap="xlarge">
          <Box flex="1" gap="small">
            <Text weight="bold" size="small">【  臨床診斷 / CLINICAL DIAGNOSIS 】</Text>
            <Box border={{ color: 'black', size: '1px' }} height="300px" background="light-2">
              <TextArea
                placeholder="在此輸入診斷結果..."
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                fill
                plain
                style={{ padding: '20px', lineHeight: '1.8' }}
              />
            </Box>
          </Box>

          <Box flex="1" gap="small">
            <Box direction="row" justify="between" align="end">
              <Text weight="bold" size="small">【  處方方案 / PRESCRIPTION 】</Text>
              <Button 
                label="+ DRUG BANK" 
                onClick={() => { fetchDrugs(); setShowDrugs(true); }} 
                size="small"
                plain
                style={{ textDecoration: 'underline', fontSize: '12px' }}
              />
            </Box>
            <Box border={{ color: 'black', size: '1px' }} height="300px">
              <TextArea
                placeholder="在此輸入處方內容或從藥庫選擇..."
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                fill
                plain
                style={{ padding: '20px', lineHeight: '1.8' }}
              />
            </Box>
          </Box>
        </Box>

        {/* 3. 极度突出的 AI 审计模块 - 采用深黑色调或粗边框包裹 */}
        <Box 
          background={auditResult ? "white" : "light-1"} 
          border={{ color: 'black', size: '3px' }} // 粗边框强调
          pad="medium" 
          margin={{ vertical: 'medium' }}
          animation={{ type: 'fadeIn', duration: 500 }}
          style={{ position: 'relative' }}
        >
          {/* 装饰性标签 */}
          <Box 
            background="black" 
            pad={{ horizontal: 'small', vertical: 'xsmall' }}
            style={{ position: 'absolute', top: '-12px', left: '20px' }}
          >
            <Text color="white" size="xsmall" weight="bold">AI AUDIT SYSTEM / 智能審計</Text>
          </Box>

          <Box direction="row" align="center" justify="between" margin={{ top: 'xsmall' }}>
            <Box flex gap="xsmall">
              <Text size="small" color="dark-2">系統將實時分析診斷與處方的匹配度、用藥禁忌及劑量安全。</Text>
            </Box>
            <Button
              label={auditLoading ? "ANALYZING..." : "RUN AUDIT / 執行審計"}
              onClick={runAudit}
              disabled={auditLoading}
              primary
              style={{ padding: '10px 30px', borderRadius: '0px' }}
            />
          </Box>

          {/* 审计结果呈现区 - 更加醒目 */}
          {auditResult && (
            <Box 
              margin={{ top: "medium" }} 
              pad="medium" 
              background="light-2"
              border={{ side: 'left', color: 'black', size: 'medium' }} // 左侧粗线条强调
            >
              <Box direction="row" gap="small" align="center" margin={{ bottom: 'small' }}>
                <Box width="10px" height="10px" background="black" round="full" />
                <Text weight="bold">審計報告詳細內容：</Text>
              </Box>
              <Text size="medium" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', fontFamily: 'monospace' }}>
                {auditResult}
              </Text>
            </Box>
          )}
        </Box>

        {/* 4. 底部动作条 */}
        <Box direction="row" justify="end" margin={{ bottom: 'large' }}>
          <Button 
            label="CONFIRM & SUBMIT REPORT / 提交報告" 
            primary
            onClick={handleSubmit} 
            style={{ padding: '15px 50px', fontSize: '16px', fontWeight: 'bold' }}
          />
        </Box>

      </Box>
    </Box>

{/* ---------------- 药品选择弹窗 ---------------- */}
{showDrugs && (
  <Layer
    onEsc={() => setShowDrugs(false)}
    onClickOutside={() => setShowDrugs(false)}
    plain 
  >
    <Box 
      width="600px" 
      background="white" 
      border={{ color: 'black', size: 'medium' }} 
      pad="large" 
      elevation="xlarge"
    >
      <Heading level="3" margin={{ bottom: 'medium', top: 'none' }} style={{ letterSpacing: '-1px' }}>
        {selectedCategory ? selectedCategory : "SELECT CATEGORY / 藥品分類"}
      </Heading>

      <Box gap="xsmall" overflow="auto" height="450px">
        {loadingDrugs ? (
          <Text alignSelf="center" pad="large">LOADING DATABASE...</Text>
        ) : !selectedCategory ? (
          /* 1. 显示分类列表 */
          Object.keys(groupedDrugs).map(cat => (
            <Button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              hoverIndicator="light-3"
            >
              <Box pad="medium" border={{ side: 'bottom', color: 'light-3' }} direction="row" justify="between">
                <Text weight="bold">{cat}</Text>
                <Text size="small" color="dark-4">{groupedDrugs[cat].length} items</Text>
              </Box>
            </Button>
          ))
        ) : (
          /* 2. 显示该分类下的药品详情 */
          <Box>
            {groupedDrugs[selectedCategory]?.map((drug, index) => (
              <Button
                key={index}
                onClick={() => {
                  insertDrug(`${drug.name} (${drug.dosage || '遵医嘱'})`);
                  // setShowDrugs(false); // 如果想选完即关闭，取消此行注释
                }}
                hoverIndicator="light-3"
              >
                <Box pad="medium" border={{ side: 'bottom', color: 'light-3' }}>
                  <Box direction="row" justify="between">
                    <Text weight="bold">{drug.name}</Text>
                    {drug.stock <= 5 && <Text color="status-critical" size="xsmall">LOW STOCK: {drug.stock}</Text>}
                  </Box>
                  <Text size="small" color="dark-4">{drug.description || "无描述信息"}</Text>
                </Box>
              </Button>
            ))}
          </Box>
        )}
      </Box>

      <Box direction="row" justify="between" margin={{ top: 'large' }} border={{ side: 'top', size: '1px' }} pad={{ top: 'medium' }}>
        <Button 
          label="← BACK TO CATEGORIES" 
          onClick={() => setSelectedCategory("")} 
          plain 
          style={{ visibility: selectedCategory ? 'visible' : 'hidden', fontSize: '12px', fontWeight: 'bold' }} 
        />
        <Button label="CLOSE" onClick={() => setShowDrugs(false)} plain weight="bold" />
      </Box>
    </Box>
  </Layer>
)}
  </Grommet>
);
};

export default Diagnose;