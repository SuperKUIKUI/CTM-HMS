import React, { Component } from 'react';
import {
  Box,
  Button,
  Heading,
  Grommet,
  Form,
  Text,
  TextInput,
  Main,
} from 'grommet';
import { Search, View, FormPreviousLink } from 'grommet-icons';

// --- 專業黑白風格 InfoItem ---
const InfoItem = ({ label, value }) => (
  <Box direction="column" flex={false}>
    <Text size="xsmall" weight="bold" color="dark-4" style={{ letterSpacing: '1px' }}>
      {label}
    </Text>
    <Text size="medium" margin={{ top: '1px' }} weight={500}>
      {value || '—'}
    </Text>
  </Box>
);

const theme = {
  global: {
    colors: {
      brand: '#000000',
      background: '#ffffff',
      border: '#000000',
      focus: 'transparent', // 移除點選時的藍色邊框
      text: { light: '#000000' },
    },
    font: {
      family: 'sans-serif',
      size: '14px',
    },
  },
  button: { 
    border: { radius: "0px" },
    primary: {
      color: "#ffffff",
      background: "#000000"
    }
  }
};

export class ViewMedHist extends Component {
  state = { medhiststate: [], loading: false };

  componentDidMount() {
    this.getNames("");
  }

  getNames(value) {
    this.setState({ loading: true });
    const patName = (value === undefined || value === "") ? " " : value;
    fetch('http://localhost:3001/MedHistView?name=' + encodeURIComponent(patName) + '&variable=words')
      .then(res => res.json())
      .then(res => this.setState({ medhiststate: res.data || [], loading: false }))
      .catch(error => {
        console.error("Error:", error);
        this.setState({ loading: false });
      });
  }

  render() {
    const { medhiststate, loading } = this.state;

    return (
      <Grommet full theme={theme}>
        <Box fill background="background" overflow="auto">
          
          {/* --- 頂部頁首：增加返回按鈕 --- */}
          <Box
            background="black"
            pad={{ horizontal: 'xlarge', vertical: 'medium' }}
            direction="row"
            align="center"
            justify="between"
            flex={false} 
          >
            <Box direction="row" align="center" gap="medium">
              {/* 返回按鈕：直角反色設計 */}
              <Button 
                icon={<FormPreviousLink color="white" />}
                label={<Text color="white" weight="bold" size="small">返回主頁 / BACK</Text>}
                href="/DocHome"
                plain
                style={{
                  border: '1px solid white',
                  padding: '5px 15px'
                }}
              />
              <Box direction="column">
                <Heading level={2} margin="none" color="white" style={{ letterSpacing: '2px', fontWeight: '800' }}>
                  PATIENT DIRECTORY
                </Heading>
                <Text color="white" size="small">醫院管理系統 / ADMINISTRATION SYSTEM</Text>
              </Box>
            </Box>
            <Box>
                <Text color="white" weight="bold">DOCTOR PORTAL / 醫生入口</Text>
            </Box>
          </Box>

          <Main pad={{ vertical: 'large', horizontal: 'xlarge' }} align="center" flex={false}>
            <Box width="100%" style={{ maxWidth: '1600px' }} direction="column">
              
              {/* --- 優化後的搜尋欄 --- */}
              <Box 
                direction="row" 
                align="center" 
                border={{ side: 'all', color: 'black', size: '2px' }} 
                margin={{ bottom: 'xlarge' }}
                background="white"
                flex={false}
              >
                <Form 
                  onSubmit={({ value }) => this.getNames(value.searchName)} 
                  style={{ width: '100%' }}
                >
                  <Box direction="row" align="center">
                    <Box pad={{ horizontal: 'medium' }} border={{ side: 'right', color: 'black', size: '1px' }}>
                      <Search color="black" size="medium" />
                    </Box>
                    <Box flex pad={{ horizontal: 'medium' }}>
                      <TextInput
                        name="searchName"
                        placeholder="ENTER PATIENT NAME TO FILTER... / 輸入患者姓名檢索"
                        plain 
                        style={{ 
                          fontSize: '18px', 
                          fontWeight: 'bold', 
                          letterSpacing: '1px'
                        }}
                      />
                    </Box>
                    <Button 
                      type="submit" 
                      fill="vertical" 
                      primary 
                      label={
                        <Box pad={{ horizontal: 'xlarge', vertical: 'medium' }}>
                          <Text weight="bold" size="medium">RUN QUERY / 執行檢索</Text>
                        </Box>
                      }
                      style={{ border: 'none', padding: '0px' }}
                    />
                  </Box>
                </Form>
              </Box>

              {/* --- 結果列表 --- */}
              <Box direction="column" flex={false}>
                <Box direction="row" justify="between" align="end" border="bottom" pad={{ bottom: 'small' }} margin={{ bottom: 'medium' }}>
                  <Heading level={3} margin="none">
                    SEARCH RESULTS / 搜尋結果
                  </Heading>
                  <Text size="small" weight="bold">TOTAL RECORDS: {medhiststate.length}</Text>
                </Box>

                {medhiststate.length === 0 ? (
                  <Box pad="xlarge" align="center" border={{ style: 'dashed', color: 'light-4' }} flex={false} margin={{ top: 'medium' }}>
                    <Text color="dark-4">{loading ? "正在讀取數據庫..." : "未找到匹配患者記錄"}</Text>
                  </Box>
                ) : (
                  medhiststate.map((patient, index) => (
                    <Box 
                      key={patient.email || index} 
                      direction="row"
                      justify="between"
                      align="center"
                      pad={{ vertical: 'medium', horizontal: 'small' }}
                      border={{ side: 'bottom', color: 'black', size: 'xsmall' }}
                      flex={false}
                      hoverIndicator={{ color: 'light-1' }}
                    >
                      <Box direction="row" gap="xlarge" flex>
                        <Box width="25%">
                           <InfoItem label="姓名 / NAME" value={patient.Name} />
                        </Box>
                        <Box width="35%">
                           <InfoItem label="電子郵件 / EMAIL" value={patient.email} />
                        </Box>
                        <Box width="20%">
                           <InfoItem label="系統編號 / ID" value={`PAT-${(index + 1000).toString()}`} />
                        </Box>
                        <Box width="20%">
                           <InfoItem label="檔案狀態 / STATUS" value="ACTIVE / 已建檔" />
                        </Box>
                      </Box>
                      
                      <Box flex={false} margin={{ left: 'medium' }}>
                        <Button 
                          href={'/ViewOneHistory/' + patient.email}
                          label="查看詳細檔案 / VIEW DOSSIER"
                          icon={<View size="small"/>}
                          primary
                          style={{
                            padding: '10px 20px',
                            fontWeight: 'bold',
                            fontSize: '12px'
                          }}
                        />
                      </Box>
                    </Box>
                  ))
                )}
              </Box>

              {/* --- 頁尾 --- */}
              <Box margin={{ top: 'xlarge' }} align="between" direction="row" border={{ side: 'top', color: 'black' }} pad={{ vertical: 'medium' }} flex={false}>
                <Text size="xsmall" color="dark-4">DATA SOURCE: INTERNAL MEDICAL DATABASE / 內部醫療數據庫</Text>
                <Text size="xsmall" color="dark-4">GENERATED ON / 生成時間: {new Date().toLocaleString()}</Text>
              </Box>

            </Box>
          </Main>
        </Box>
      </Grommet>
    );
  }
}

export default ViewMedHist;