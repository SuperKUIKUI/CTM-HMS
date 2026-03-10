import React, { Component } from 'react';
import {
  Box,
  Button,
  Heading,
  Grommet,
  FormField,
  Form,
  Text,
  Select,
  TextInput,
  Main
} from 'grommet';

import './App.css';

// 1. 統一工業風主題配置
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
    container: { flex: false }
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

export class CreateAccount extends Component {
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
              {/* 標題與裝飾 */}
              <Box 
                margin={{ bottom: 'large' }} 
                border={{ side: 'bottom', size: '4px', color: 'black' }} 
                pad={{ bottom: 'small' }}
                flex={false}
              >
                <Heading level='2' margin="none" style={{ fontWeight: '900' }}>REGISTRATION</Heading>
                <Text size="small" weight="bold">病人註冊表單 / PATIENT ENROLLMENT FORM</Text>
              </Box>

              <Form
                onSubmit={({ value }) => {
                  fetch("http://localhost:3001/checkIfPatientExists?email=" + value.email)
                    .then(res => res.json())
                    .then(res => {
                      if (res.data[0]) {
                        window.alert("該郵箱已關聯現有賬戶 / EMAIL ALREADY EXISTS.");
                      } else {
                        fetch("http://localhost:3001/makeAccount?name=" + value.name + 
                              "&email=" + value.email + 
                              "&password=" + value.password + 
                              "&address=" + value.address + 
                              "&gender=" + value.gender + 
                              "&age=" + value.age + 
                              "&height=" + value.height + 
                              "&weight=" + value.weight + 
                              "&conditions=" + value.conditions + 
                              "&medications=" + value.medications + 
                              "&surgeries=" + value.surgeries)
                        .then(() => { window.location = "/Home"; });
                      }
                    });
                }}
              >
                {/* 基礎資料分組 */}
                <Box direction="row-responsive" gap="medium" flex={false}>
                  <Box flex fill="horizontal">
                    <FormField label="NAME / 姓名" name="name" required>
                      <TextInput name="name" placeholder="Full Name" plain />
                    </FormField>
                  </Box>
                  <Box width="small">
                    <FormField label="GENDER / 性別" name="gender" required>
                      <Select options={['Male', 'Female']} name="gender" placeholder="Select" />
                    </FormField>
                  </Box>
                </Box>

                <Box direction="row-responsive" gap="medium" flex={false}>
                  <FormField label="AGE / 年齡" name="age" required flex>
                    <TextInput name="age" placeholder="25" plain />
                  </FormField>
                  <FormField label="HEIGHT / 身高" name="height" required flex>
                    <TextInput name="height" placeholder="175cm" plain />
                  </FormField>
                  <FormField label="WEIGHT / 體重" name="weight" required flex>
                    <TextInput name="weight" placeholder="70kg" plain />
                  </FormField>
                </Box>

                {/* 醫療背景分組 */}
                <Box margin={{ top: 'medium' }} pad="medium" background="light-1" border={{ color: 'black', style: 'dashed' }} flex={false} gap="small">
                  <Text size="xsmall" weight="bold" color="dark-4">MEDICAL HISTORY / 既往病史資料</Text>
                  <FormField label="CONDITIONS / 既往症" name="conditions">
                    <TextInput name="conditions" placeholder="None" plain />
                  </FormField>
                  <FormField label="SURGERIES / 手術史" name="surgeries">
                    <TextInput name="surgeries" placeholder="None" plain />
                  </FormField>
                  <FormField label="MEDICATIONS / 藥物使用" name="medications">
                    <TextInput name="medications" placeholder="None" plain />
                  </FormField>
                </Box>

                {/* 賬戶資料分組 */}
                <Box margin={{ top: 'medium' }} flex={false}>
                  <FormField label="ADDRESS / 家庭住址" name="address" required>
                    <TextInput name="address" placeholder="Residential Address" plain />
                  </FormField>
                  <FormField label="EMAIL / 電子郵箱" name="email" required>
                    <TextInput name="email" type="email" placeholder="example@mail.com" plain />
                  </FormField>
                  <FormField 
                    label="PASSWORD / 密碼" 
                    name="password" 
                    required 
                    validate={{ regexp: /^(?=.{8,})(?=.*[0-9]{2})/, message: "至少8位且包含2個數字" }}
                  >
                    <TextInput name="password" type="password" placeholder="Min 8 chars, 2 numbers" plain />
                  </FormField>
                </Box>

                {/* 按鈕區域 */}
                <Box direction="row" gap="medium" margin={{ top: 'xlarge' }} flex={false}>
                  <Button
                    label="CANCEL / 取消"
                    fill="horizontal"
                    href="/"
                    style={{ padding: '12px' }}
                  />
                  <Button
                    label="REGISTER / 提交註冊"
                    fill="horizontal"
                    type="submit"
                    primary
                    style={{ padding: '12px' }}
                  />
                </Box>
              </Form>

              {/* 醫生入口佈告 */}
              <Box 
                margin={{ top: 'xlarge' }} 
                pad="medium" 
                border={{ color: 'black', size: '2px' }} 
                direction="row" 
                align="center" 
                justify="between"
                background="black"
              >
                <Text color="white" weight="bold" size="small">ARE YOU A MEDICAL PROFESSIONAL? / 您是醫生嗎？</Text>
                <Button
                  label={<Text size="xsmall" weight="bold">DOCTOR PORTAL</Text>}
                  href="/MakeDoc"
                  style={{ background: 'white', color: 'black', padding: '4px 12px' }}
                />
              </Box>
            </Box>
          </Main>
        </Box>
      </Grommet>
    );
  }
}

export default CreateAccount;