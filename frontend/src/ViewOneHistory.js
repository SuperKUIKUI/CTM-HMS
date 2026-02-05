import React, { Component } from 'react';
import {
  Box,
  Heading,
  Grommet,
  Text,
  Main,
  Grid,
} from 'grommet';
import { FormPreviousLink } from 'grommet-icons';
import { Link } from 'react-router-dom';

// 1. 外部定义 InfoItem
const InfoItem = ({ label, value }) => (
  <Box direction="column" margin={{ bottom: 'small' }} flex={false}>
    <Text size="xsmall" weight="bold" color="dark-4" style={{ letterSpacing: '1px', textTransform: 'uppercase' }}>
      {label}
    </Text>
    <Text size="medium" margin={{ top: 'xsmall' }}>
      {value || '—'}
    </Text>
  </Box>
);

// 专业黑白主题配置
const theme = {
  global: {
    colors: {
      brand: '#000000',
      background: '#ffffff',
      border: '#000000',
      text: {
        light: '#000000',
      },
    },
    font: {
      family: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      size: '14px',
    },
  },
  heading: {
    weight: 700,
  }
};

export default class ViewOneHistory extends Component {
  state = {
    medhiststate: [],
    medhiststate2: [],
    who: "" // 新增：用于识别是 doc 还是 pat
  };

  componentDidMount() {
    // 1. 获取当前登录用户的身份
    fetch("http://localhost:3001/userInSession")
      .then(res => res.json())
      .then(res => {
        this.setState({ who: res.who });
      })
      .catch(err => console.error('获取登录状态失败:', err));

    // 2. 获取路由参数中的 email 并加载数据
    const { email } = this.props.match?.params || { email: 'test@test.com' };
    this.getHistory(email);
    this.allDiagnoses(email);
  }

  getHistory(value) {
    fetch(`http://localhost:3001/OneHistory?patientEmail='${value}'`)
      .then(res => res.json())
      .then(res => this.setState({ medhiststate: res.data || [] }))
      .catch(err => console.error('获取患者信息失败:', err));
  }

  allDiagnoses(value) {
    fetch(`http://localhost:3001/allDiagnoses?patientEmail='${value}'`)
      .then(res => res.json())
      .then(res => this.setState({ medhiststate2: res.data || [] }))
      .catch(err => console.error('获取就诊记录失败:', err));
  }

  render() {
    const { medhiststate, medhiststate2, who } = this.state;

    // --- 动态逻辑点 ---
    // 根据身份决定返回路径：医生回 MedHistView，病人回 PatientHome
    const backPath = who === "doc" ? "/MedHistView" : "/PatientHome";
    const backLabel = who === "doc" ? "返回列表 / BACK" : "返回首页 / HOME";

    return (
      <Grommet theme={theme} full>
        <Box fill background="background" overflow="auto">
          
          {/* 顶部页眉 */}
          <Box
            background="black"
            pad={{ horizontal: 'large', vertical: 'medium' }}
            direction="row"
            align="center"
            justify="between"
            flex={false}
          >
            <Box direction="row" align="center" gap="medium">
              {/* 返回按钮 - 动态路径 */}
              <Link to={backPath} style={{ textDecoration: 'none' }}>
                <Box 
                  direction="row" 
                  align="center" 
                  gap="xsmall" 
                  pad={{ horizontal: 'small', vertical: 'xsmall' }}
                  border={{ color: 'white', size: 'xsmall' }}
                  round="xsmall"
                >
                  <FormPreviousLink color="white" size="small" />
                  <Text color="white" size="small" weight="bold">{backLabel}</Text>
                </Box>
              </Link>

              <Box>
                <Heading level={2} margin="none" color="white" style={{ letterSpacing: '2px' }}>
                  MEDICAL RECORD
                </Heading>
                <Text color="white" size="small">
                  档案编号: {medhiststate[0]?.email?.split('@')[0].toUpperCase() || 'N/A'}
                </Text>
              </Box>
            </Box>
            
            <Box border={{ color: 'white', size: 'small' }} pad={{ horizontal: 'medium', vertical: 'xsmall' }}>
              <Text color="white" weight="bold">机密档案 / CONFIDENTIAL</Text>
            </Box>
          </Box>

          <Main pad={{ vertical: 'xlarge', horizontal: 'medium' }} align="center" flex={false}>
            <Box width="large" direction="column"> 
              
              {/* 患者基本信息区 */}
              {medhiststate.map((patient, index) => (
                <Box key={index} margin={{ bottom: 'xlarge' }} flex={false} direction="column">
                  <Heading level={3} border="bottom" pad={{ bottom: 'small' }} margin={{ bottom: 'medium' }}>
                    PATIENT PROFILE / 患者基本信息
                  </Heading>
                  
                  <Grid columns={['1/2', '1/2']} gap="small">
                    <InfoItem label="姓名 / Name" value={patient.name} />
                    <InfoItem label="性别 / Gender" value={patient.gender} />
                    <InfoItem label="电子邮箱 / Email" value={patient.email} />
                    <InfoItem label="联系地址 / Address" value={patient.address} />
                  </Grid>

                  <Box 
                    margin={{ top: 'medium' }} 
                    pad="medium" 
                    border={{ side: 'all', color: 'black', size: 'small' }}
                    flex={false}
                    direction="column"
                  >
                    <Heading level={4} margin={{ bottom: 'medium', top: 'none' }}>MEDICAL HISTORY / 既往史</Heading>
                    <Grid columns={['1/3', '1/3', '1/3']} gap="medium">
                      <InfoItem label="既往症" value={patient.conditions} />
                      <InfoItem label="手术史" value={patient.surgeries} />
                      <InfoItem label="当前用药" value={patient.medication} />
                    </Grid>
                  </Box>
                </Box>
              ))}

              {/* 历史记录区 */}
              <Box direction="column" flex={false}>
                <Heading level={3} border="bottom" pad={{ bottom: 'small' }} margin={{ bottom: 'medium' }}>
                  CONSULTATION LOGS / 历史就诊记录 ({medhiststate2.length})
                </Heading>

                {medhiststate2.length === 0 ? (
                  <Box pad="large" align="center" border={{ style: 'dashed' }} flex={false}>
                    <Text color="dark-4">暂无历史诊疗数据</Text>
                  </Box>
                ) : (
                  medhiststate2.map((item, index) => (
                    <Box 
                      key={index} 
                      margin={{ bottom: 'large' }}
                      pad={{ bottom: 'medium' }}
                      border={{ side: 'bottom', color: 'light-4' }}
                      direction="column"
                      flex={false}
                    >
                      <Box direction="row" justify="between" align="center" margin={{ bottom: 'medium' }}>
                        <Text weight="bold" size="large">
                          日期: {item.date?.split('T')[0] || 'YYYY-MM-DD'}
                        </Text>
                        <Box background="black" pad={{ horizontal: 'small' }}>
                          <Text size="small" color="white">
                            医生: {item.doctor}
                          </Text>
                        </Box>
                      </Box>

                      <Grid columns={['1/2', '1/2']} gap="medium">
                        <Box direction="column">
                          <InfoItem label="主诉 / Concerns" value={item.concerns} />
                          <InfoItem label="症状 / Symptoms" value={item.symptoms} />
                        </Box>
                        <Box border={{ side: 'left', color: 'black', size: 'small' }} pad={{ left: 'medium' }}>
                          <InfoItem label="诊断结果 / Diagnosis" value={item.diagnosis} />
                          <InfoItem label="治疗处方 / Prescription" value={item.prescription} />
                        </Box>
                      </Grid>
                    </Box>
                  ))
                )}
              </Box>

              {/* 页脚 */}
              <Box margin={{ top: 'xlarge' }} align="center" border={{ side: 'top', color: 'black' }} pad="medium" flex={false}>
                <Text size="xsmall">--- 档案记录结束 / END OF RECORD ---</Text>
                <Text size="xsmall" margin={{ top: 'xsmall' }}>打印日期: {new Date().toLocaleDateString()}</Text>
              </Box>

            </Box>
          </Main>
        </Box>
      </Grommet>
    );
  }
}