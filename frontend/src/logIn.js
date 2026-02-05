import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Box,
  Button,
  Heading,
  Grommet,
  FormField,
  Form,
  CheckBox,
  TextInput,
  Text,
} from 'grommet';

import './App.css';

const theme = {
  global: {
    colors: {
      brand: '#000000',
      background: '#ffffff',
      focus: 'transparent',
      text: '#000000',
      control: '#000000',
    },
    font: {
      family: '"Lato", "Helvetica Neue", "Microsoft JhengHei", sans-serif',
      size: '15px',
    },
    input: {
      weight: 700,
      extend: `
        padding: 12px;
        background: #ffffff;
      `
    }
  },
  button: {
    border: { radius: '0px', width: '2px' },
    primary: { color: '#ffffff', background: '#000000' },
    extend: `
      font-weight: bold;
      letter-spacing: 1px;
    `
  },
  formField: {
    border: { side: 'all', color: 'black', size: '2px' }, // 加粗邊框更具工業感
    label: { 
        margin: { bottom: 'xsmall', left: 'xsmall', top: 'small' }, 
        weight: 'bold', 
        size: 'small' 
    },
    margin: { bottom: 'medium' },
    round: '0px',
  },
  checkBox: {
    border: { color: 'black', width: '2px' },
    check: { thickness: '4px' },
    size: '20px',
    gap: 'small'
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
    style={{ zIndex: '10' }}
    {...props}
  />
);

class LogIn extends Component {
  constructor(props) {
    super(props);
    this.state = { isDoctor: false };
  }

  render() {
    const { isDoctor } = this.state;

    return (
      <Grommet theme={theme} full>
        <Box fill background="#f0f0f0" overflow="auto">
          <AppBar>
            <a style={{ color: 'inherit', textDecoration: 'none' }} href="/">
              <Heading level='3' margin='none' color='white' style={{ fontWeight: '800', letterSpacing: '2px' }}>
                HOSPITAL SYSTEM / 醫院管理系統
              </Heading>
            </a>
          </AppBar>

          {/* 登錄主區域 */}
          <Box fill align="center" justify="center" pad="large">
            
            {/* 登錄卡片容器：將 width 從 medium 改為 large */}
            <Box
              width="large" // 關鍵修改：拉寬方框
              background="white"
              pad={{ horizontal: "xlarge", vertical: "xlarge" }} // 調整內距比例
              border={{ color: 'black', size: '3px' }}
              flex={false}
              style={{ 
                boxShadow: '16px 16px 0px 0px rgba(0,0,0,1)', // 加強陰影立體感
                minHeight: 'min-content',
                maxWidth: '90vw' // 確保在手機上不會溢出
              }}
            >
              {/* 標題區塊 */}
              <Box 
                margin={{ bottom: 'large' }} 
                border={{ side: 'bottom', size: '6px', color: 'black' }} 
                pad={{ bottom: 'medium' }}
                flex={false}
              >
                <Heading level='1' margin="none" style={{ fontWeight: '900', letterSpacing: '-1px' }}>LOGIN</Heading>
                <Text size="medium" weight="bold">身份驗證 / USER AUTHENTICATION</Text>
              </Box>

              <Form
                onSubmit={({ value }) => {
                  const endpoint = value.isDoc ? "checkDoclogin" : "checklogin";
                  const redirect = value.isDoc ? "DocHome" : "/Home";
                  
                  fetch(`http://localhost:3001/${endpoint}?email=${value.email}&password=${value.password}`)
                    .then(res => res.json())
                    .then(res => {
                      if (!res.data || res.data.length === 0) {
                        window.alert("登錄信息有誤 / INVALID CREDENTIALS");
                      } else {
                        window.location = redirect;
                      }
                    });
                }}
              >
                <Box flex={false} gap="small">
                    <FormField label="EMAIL / 電子郵件地址" name="email" required>
                      <TextInput 
                        name="email" 
                        type="email" 
                        placeholder="doctor@hospital.com" 
                        plain 
                      />
                    </FormField>

                    <FormField label="PASSWORD / 安全密碼" name="password" required>
                      <TextInput 
                        name="password" 
                        type="password" 
                        placeholder="••••••••" 
                        plain 
                      />
                    </FormField>
                </Box>

                <Box margin={{ vertical: 'medium' }} pad={{ left: 'xsmall' }} flex={false}>
                  <CheckBox
                    checked={isDoctor}
                    label={<Text weight="bold" size="medium">IDENTIFY AS DOCTOR / 以醫生身份登錄</Text>}
                    name="isDoc"
                    onChange={(event) => this.setState({ isDoctor: event.target.checked })}
                  />
                </Box>

                {/* 按鈕區域 */}
                <Box direction="row-responsive" gap="medium" margin={{ top: 'large' }} flex={false}>
                  <Button 
                    type="submit" 
                    label="SIGN IN / 登錄系統" 
                    primary 
                    flex // 按鈕平分寬度
                    style={{ padding: '16px' }}
                  />
                  <Button 
                    label="REGISTER / 註冊" 
                    href="/createAcc" 
                    flex // 按鈕平分寬度
                    style={{ padding: '16px' }}
                  />
                </Box>
              </Form>
            </Box>
            
            {/* 底部裝飾 */}
            <Box margin={{ top: 'xlarge' }} flex={false}>
                <Text size="xsmall" color="dark-2" weight="bold" style={{ letterSpacing: '1px' }}>
                OFFICIAL ACCESS ONLY — SECURITY LEVEL 4 © 2026 HOSPITAL MANAGEMENT SYSTEM
                </Text>
            </Box>
          </Box>
        </Box>
      </Grommet>
    );
  }
}

export default withRouter(LogIn);