import React, { Component } from 'react';
import {
  Box,
  Button,
  Heading,
  Grommet,
  FormField,
  Form,
  Text,
  TextInput,
  Select,
  Main
} from 'grommet';

import './App.css';

// 1. 統一工業風主題配置 (與登錄、註冊頁面一致)
const theme = {
  global: {
    colors: {
      brand: '#000000',
      background: '#ffffff',
      focus: 'transparent',
      text: '#000000',
      control: '#000000',
      'light-1': '#f8f8f8',
    },
    font: {
      family: 'sans-serif',
      size: '14px',
    },
    input: {
      weight: 700,
    }
  },
  button: {
    border: { radius: '0px', width: '2px' },
    primary: { color: '#ffffff', background: '#000000' }
  },
  formField: {
    border: { side: 'all', color: 'black', size: '1px' },
    label: { 
      margin: { bottom: 'xsmall', left: 'none', top: 'xsmall' }, 
      weight: 'bold', 
      size: 'xsmall' 
    },
    margin: { bottom: 'small' },
    round: '0px',
    container: { flex: false } // 防止 FormField 內部塌陷
  },
  select: {
    control: { extend: 'border-radius: 0px;' },
    icons: { color: 'black' }
  }
};

const AppBar = (props) => (
  <Box
    tag='header'
    direction='row'
    align='center'
    justify='between'
    background='black'
    pad={{ horizontal: 'xlarge', vertical: 'medium' }}
    flex={false}
    style={{ zIndex: '1' }}
    {...props}
  />
);

export class MakeDoc extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Grommet theme={theme} full>
        <Box fill background="#fafafa" overflow="auto">
          {/* 頂欄 */}
          <AppBar>
            <a style={{ color: 'inherit', textDecoration: 'none' }} href="/">
              <Heading level='3' margin='none' color='white' style={{ fontWeight: '800', letterSpacing: '1px' }}>
                HOSPITAL SYSTEM / 醫院管理系統
              </Heading>
            </a>
          </AppBar>

          {/* 註冊內容區 */}
          <Main pad={{ vertical: 'xlarge', horizontal: 'medium' }} align="center">
            <Box
              width="large"
              background="white"
              pad="xlarge"
              border={{ color: 'black', size: '2px' }}
              flex={false}
              style={{ boxShadow: '16px 16px 0px 0px rgba(0,0,0,1)' }}
            >
              {/* 標題與裝飾線 */}
              <Box 
                margin={{ bottom: 'large' }} 
                border={{ side: 'bottom', size: '4px', color: 'black' }} 
                pad={{ bottom: 'small' }}
                flex={false}
              >
                <Heading level='2' margin="none" style={{ fontWeight: '900' }}>DOCTOR REGISTRATION</Heading>
                <Text size="small" weight="bold">醫生賬戶註冊 / MEDICAL PROFESSIONAL ENROLLMENT</Text>
              </Box>

              <Form
                onReset={event => console.log(event)}
                onSubmit={({ value }) => {
                  fetch(`http://localhost:3001/checkIfDocExists?email=${value.email}`)
                    .then(res => res.json())
                    .then(res => {
                      if (res.data[0]) {
                        window.alert("該電子郵件已關聯醫生賬戶 / EMAIL ALREADY REGISTERED.");
                      } else {
                        fetch(`http://localhost:3001/makeDocAccount?name=${value.firstName}&lastname=${value.lastName}&email=${value.email}&password=${value.password}&gender=${value.gender}&schedule=${value.schedule}`)
                          .then(() => {
                            window.location = "/DocHome";
                          });
                      }
                    });
                }}
              >
                {/* 姓名分組 */}
                <Box direction="row-responsive" gap="medium" flex={false}>
                  <FormField label="FIRST NAME / 名字" name="firstName" required flex>
                    <TextInput 
                      name="firstName" 
                      placeholder="e.g. John" 
                      validate={{ regexp: /^[a-zA-Z\u4e00-\u9fa5]/i, message: "請輸入有效的姓名" }}
                      plain 
                    />
                  </FormField>
                  <FormField label="LAST NAME / 姓氏" name="lastName" required flex>
                    <TextInput 
                      name="lastName" 
                      placeholder="e.g. Doe" 
                      validate={{ regexp: /^[a-zA-Z\u4e00-\u9fa5]/i, message: "請輸入有效的姓氏" }}
                      plain 
                    />
                  </FormField>
                </Box>

                {/* 職業與性別分組 */}
                <Box direction="row-responsive" gap="medium" flex={false}>
                  <Box flex>
                    <FormField label="SCHEDULE ID / 排班編號" name="schedule" required>
                      <TextInput name="schedule" placeholder="e.g. SCH-001" plain />
                    </FormField>
                  </Box>
                  <Box width="small">
                    <FormField label="GENDER / 性別" name="gender" required>
                      <Select 
                        name="gender"
                        options={['男性', '女性']} 
                        placeholder="選擇" 
                      />
                    </FormField>
                  </Box>
                </Box>

                {/* 賬號資料分組 */}
                <Box margin={{ top: 'medium' }} flex={false}>
                  <FormField label="EMAIL ADDRESS / 電子郵箱" name="email" required>
                    <TextInput name="email" type="email" placeholder="doctor@hospital.com" plain />
                  </FormField>
                  
                  <FormField 
                    label="PASSWORD / 密碼" 
                    name="password" 
                    required 
                    validate={{ 
                      regexp: /^(?=.{8,})(?=.*[0-9]{2})/, 
                      message: "密碼長度至少8位字符，且包含至少2位數字" 
                    }}
                  >
                    <TextInput name="password" type="password" placeholder="Min. 8 characters, 2 numbers" plain />
                  </FormField>
                </Box>

                {/* 按鈕區域 */}
                <Box direction="row" gap="medium" margin={{ top: 'xlarge' }} flex={false}>
                  <Button
                    label="CANCEL / 返回"
                    fill="horizontal"
                    href="/"
                    style={{ padding: '12px' }}
                  />
                  <Button
                    label="CREATE DOCTOR ACCOUNT / 提交註冊"
                    fill="horizontal"
                    type="submit"
                    primary
                    style={{ padding: '12px' }}
                  />
                </Box>
              </Form>

              {/* 提示區塊 */}
              <Box 
                margin={{ top: 'xlarge' }} 
                pad="medium" 
                background="light-1" 
                border={{ color: 'black', style: 'dashed' }}
                flex={false}
              >
                <Text size="xsmall" weight="bold">
                  NOTICE: 您正在申請醫生專業權限。提交後請確保您的排班編號與醫院人力資源系統匹配。
                </Text>
              </Box>
            </Box>
          </Main>
        </Box>
      </Grommet>
    );
  }
}

export default MakeDoc;