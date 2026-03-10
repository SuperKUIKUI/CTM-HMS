import React, { useState, useEffect, useRef } from 'react';
import {
  Grommet, Box, Button, Heading, TextArea, Text
} from 'grommet';

/* =========================
   黑白极简主题 + 绿色状态色
========================= */
const theme = {
  global: {
    colors: {
      brand: '#000000',
      background: '#ffffff',
      focus: 'transparent',
      control: '#000000',
      text: '#000000',
      'accent-1': '#333333',
      'status-ok': '#00C781',
      'light-1': '#f8f8f8',
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
    default: {
      color: 'text',
      border: { color: 'black', width: '1px' },
      background: { color: 'white' }
    },
    primary: {
      color: '#ffffff',
      border: { color: 'transparent' },
    }
  },
  textArea: {
    extend: 'border-radius: 0px;'
  }
};

const patientInfo = {
  age: 32,
  gender: "女",
  pregnant: false,
  pregnant_weeks: 0
};

const Diagnose = (props) => {
  const id = props.match?.params?.id;

  const[diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const[showDrugs, setShowDrugs] = useState(false);
  const [dbDrugs, setDbDrugs] = useState([]);
  const [loadingDrugs, setLoadingDrugs] = useState(false);
  
  const[auditLoading, setAuditLoading] = useState(false);
  const [auditResult, setAuditResult] = useState(null);

  // 模式状态：'online', 'offline', 'auto'
  const [mode, setMode] = useState("auto");
  // 当前实际运行模式（从后端返回）
  const[currentMode, setCurrentMode] = useState("WAITING");
  // 上次审计使用的模式，用于检测切换
  const [lastAuditMode, setLastAuditMode] = useState(null);

  /* --- OCR 相关状态和引用 --- */
  const fileInputRef = useRef(null);
  const [ocrLoading, setOcrLoading] = useState(false);

  const fetchDrugs = () => {
    setLoadingDrugs(true);
    fetch("http://localhost:3001/allDrugs")
      .then(res => res.json())
      .then(res => {
        if (res.data && Array.isArray(res.data)) setDbDrugs(res.data);
        setLoadingDrugs(false);
      })
      .catch(err => setLoadingDrugs(false));
  };

  useEffect(() => {
    fetchDrugs();
  },[]);

 /* =========================
     OCR 图片上传与智能分发逻辑
  ========================= */
  const handleImageUpload = async (e) => {

  const file = e.target.files[0];
  if (!file) return;

  setOcrLoading(true);

  const formData = new FormData();
  formData.append("file", file);

  try {

    /* =========================
       Step1：OCR识别
    ========================= */

    const response = await fetch("http://localhost:8000/ocr", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (!data.text) {
      alert("⚠️ 未识别到文字");
      return;
    }

    const ocrText = data.text;

    /* =========================
       Step2：DeepSeek整理处方
    ========================= */

    const parseResponse = await fetch("http://localhost:8000/ocr_parse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: ocrText
      })
    });

    const parseData = await parseResponse.json();

    const finalText = parseData.prescription || ocrText;

    /* =========================
       自动填入处方
    ========================= */

    setPrescription(prev =>
      prev ? prev + "\n" + finalText : finalText
    );

    alert(
      `✅ OCR识别完成\n\n置信度: ${data.confidence}%`
    );

  } catch (error) {

    console.error("OCR流程失败:", error);

    alert("❌ OCR处理失败，请检查FastAPI服务");

  } finally {

    setOcrLoading(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  }
};


  /* =========================
     AI 审计逻辑
  ========================= */
  const runAudit = () => {
    if (!prescription.trim()) {
      alert("请先填写处方内容");
      return;
    }

    setAuditLoading(true);
    setAuditResult(null);
    setLastAuditMode(mode);

    fetch("http://localhost:8000/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patient: patientInfo,
        diagnosis: diagnosis,
        prescription: prescription,
        mode: mode
      })
    })
      .then(res => res.json())
      .then(data => {
        setAuditResult(data.result || "未发现明显异常");
        if (data.backend_source) {
          setCurrentMode(data.backend_source.toUpperCase());
        }
        setAuditLoading(false);
      })
      .catch(() => {
        setAuditResult("❌ 审计服务未连接");
        setCurrentMode("OFFLINE");
        setAuditLoading(false);
      });
  };

  const handleSubmit = () => {
    if (!diagnosis.trim() || !prescription.trim()) {
      alert("请填写完整后再提交！");
      return;
    }
    const url = `http://localhost:3001/diagnose?id=${id}&diagnosis=${encodeURIComponent(diagnosis)}&prescription=${encodeURIComponent(prescription)}`;
    fetch(url).then(res => res.ok ? res.json() : Promise.reject())
      .then(() => { window.location.href = "/DocViewAppt"; })
      .catch(() => alert("提交失败。"));
  };

  const switchToOnline = () => { setMode("auto"); setCurrentMode("WAITING"); setAuditResult(null); };
  const switchToOffline = () => { setMode("offline"); setCurrentMode("OFFLINE"); setAuditResult(null); };

  const isOnline = currentMode === "ONLINE";
  const isOffline = currentMode === "OFFLINE";
  const isWaiting = currentMode === "WAITING";
  
  const getMainColor = () => {
    if (isOnline) return "status-ok";
    if (isOffline) return "black";
    return "#999999"; 
  };
  
  const mainColor = getMainColor();
  const getModeDisplayText = () => {
    if (isOnline) return "AI AUDIT (ONLINE / DEEPSEEK)";
    if (isOffline) return "AI AUDIT (OFFLINE / QWEN3)";
    return "AI AUDIT (WAITING FOR CONNECTION)";
  };
  const getModeIndicator = () => {
    if (isOnline) return "● ONLINE";
    if (isOffline) return "○ OFFLINE";
    return "◐ WAITING";
  };

  return (
    <Grommet theme={theme} full>
      <Box fill background="white" style={{ height: '100vh', overflow: 'hidden' }}>

        <Box flex={false} align="center" border={{ side: 'bottom', size: '1px', color: 'light-3' }}>
          <Box width="xlarge" pad={{ horizontal: 'large', vertical: 'medium' }}>
            <Box direction="row" justify="between" align="center">
              <Box direction="row" align="baseline" gap="small">
                <Heading level="2" margin="none" style={{ letterSpacing: '-1px' }}>PATIENT DIAGNOSIS</Heading>
                <Text size="small" color="dark-4">/ 患者診斷系統</Text>
              </Box>
              <Button label="BACK TO LIST" onClick={() => props.history.push("/ApptList")} plain style={{ fontSize: '12px', fontWeight: 'bold' }} />
            </Box>
          </Box>
        </Box>

        <Box flex overflow={{ vertical: 'auto' }} align="center">
          <Box width="xlarge" pad="large" gap="large">

            {/* --- 添加一个带边框的操作工具栏（用于放置 OCR 按钮） --- */}
            <Box 
              border={{ color: 'black', size: '1px', style: 'solid' }}
              pad={{ horizontal: 'medium', vertical: 'small' }}
              background="light-1"
            >
              <Box direction="row" justify="between" align="center">
                <Text weight="bold" size="medium">📄 輸入或上傳醫療文本</Text>
                
                <Box direction="row" align="center" gap="small">
                  {/* 隐藏的文件输入框 */}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                  />
                  
                  {/* 触发上传的按钮 */}
                  <Button
                    label={ocrLoading ? "📷 RECOGNIZING..." : "📷 SMART OCR UPLOAD"}
                    onClick={() => fileInputRef.current.click()}
                    disabled={ocrLoading}
                    style={{ 
                      border: '1px solid black', 
                      padding: '8px 20px', 
                      fontSize: '12px', 
                      fontWeight: 'bold',
                      backgroundColor: ocrLoading ? '#eeeeee' : 'white',
                      cursor: ocrLoading ? 'wait' : 'pointer'
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {/* 输入区域 */}
            <Box direction="row" gap="xlarge">
              <Box flex="1" gap="small">
                <Text weight="bold" size="small">【 臨床診斷 / CLINICAL DIAGNOSIS 】</Text>
                <Box border={{ color: 'black', size: '1px' }} height="300px" background="light-2">
                  <TextArea placeholder="在此輸入診斷或通過右上角OCR識別圖片..." value={diagnosis} onChange={e => setDiagnosis(e.target.value)} fill plain style={{ padding: '20px', lineHeight: '1.8' }} />
                </Box>
              </Box>
              <Box flex="1" gap="small">
                <Box direction="row" justify="between" align="end">
                  <Text weight="bold" size="small">【 處方方案 / PRESCRIPTION 】</Text>
                  <Button label="+ DRUG BANK" onClick={() => { fetchDrugs(); setShowDrugs(true); }} size="small" plain style={{ textDecoration: 'underline', fontSize: '12px' }} />
                </Box>
                <Box border={{ color: 'black', size: '1px' }} height="300px">
                  <TextArea placeholder="在此輸入處方或通過右上角OCR識別圖片..." value={prescription} onChange={e => setPrescription(e.target.value)} fill plain style={{ padding: '20px', lineHeight: '1.8' }} />
                </Box>
              </Box>
            </Box>

            {/* AI 审计模块 (原封不动) */}
            <Box border={{ color: mainColor, size: '3px' }} background={auditResult ? "white" : "light-1"} pad="medium" style={{ position: 'relative', transition: 'all 0.3s ease', opacity: isWaiting && !auditResult ? 0.8 : 1 }}>
              <Box background={mainColor} pad={{ horizontal: 'small', vertical: 'xsmall' }} style={{ position: 'absolute', top: '-12px', left: '20px', transition: 'background 0.3s', zIndex: 1 }}>
                <Text color="white" size="xsmall" weight="bold">{getModeDisplayText()}</Text>
              </Box>
              <Box direction="row" justify="between" align="center" margin={{ top: 'small', bottom: 'small' }}>
                <Box direction="row" gap="small" align="center">
                  <Button label="ONLINE" size="small" primary={isOnline} color={isOnline ? "status-ok" : "white"} style={!isOnline ? { border: '1px solid #ddd', color: '#999', backgroundColor: 'white'} : {}} onClick={switchToOnline} />
                  <Button label="OFFLINE" size="small" primary={isOffline} color={isOffline ? "status-ok" : "white"} style={!isOffline ? { border: '1px solid #ddd', color: '#999', backgroundColor: 'white'} : {}} onClick={switchToOffline} />
                  <Box pad={{ horizontal: 'small', vertical: 'xsmall' }} background="light-3" style={{ marginLeft: '10px' }}>
                    <Text size="xsmall" weight="bold" color={mainColor}>{getModeIndicator()}</Text>
                  </Box>
                </Box>
                <Button label={auditLoading ? "ANALYZING..." : "RUN AUDIT / 執行審計"} onClick={runAudit} disabled={auditLoading} plain={false} style={{ backgroundColor: 'black', border: '2px solid black', color: 'white', fontWeight: 'bold', padding: '10px 30px', opacity: auditLoading ? 0.5 : 1, cursor: auditLoading ? 'not-allowed' : 'pointer' }} />
              </Box>
              {auditResult && (
                <Box margin={{ top: "medium" }} pad="medium" background="light-2" border={{ side: 'left', color: mainColor, size: 'medium' }} height="200px" overflow="auto">
                  <Box direction="row" justify="between" align="center" margin={{ bottom: 'small' }}>
                    <Text weight="bold">審計報告詳細內容：</Text>
                    <Box background={mainColor} pad={{ horizontal: 'xsmall', vertical: 'xxsmall' }}>
                      <Text size="xsmall" color="white">{lastAuditMode === 'auto' ? 'AUTO MODE' : 'FORCED OFFLINE'} → {currentMode}</Text>
                    </Box>
                  </Box>
                  <Text size="medium" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', fontFamily: 'monospace' }}>{auditResult}</Text>
                </Box>
              )}
              {isWaiting && !auditResult && (
                <Box margin={{ top: "medium" }} pad="medium" background="light-2" align="center">
                  <Text color="#999">點擊 RUN AUDIT 開始審計，系統將會根據網絡狀態自動選擇模式</Text>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        <Box flex={false} align="center" background="white" border={{ side: 'top', color: 'black', size: '1px' }} pad={{ vertical: 'medium' }}>
          <Box width="xlarge" direction="row" justify="end" pad={{ horizontal: 'large' }}>
            <Button label="CONFIRM & SUBMIT REPORT / 提交報告" primary onClick={handleSubmit} style={{ padding: '15px 50px', fontSize: '16px', fontWeight: 'bold' }} />
          </Box>
        </Box>

      </Box>
    </Grommet>
  );
}

export default Diagnose;