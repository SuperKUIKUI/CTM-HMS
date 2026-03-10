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
                    onSubmit={({ value }) => {
                      // 步驟 1: 檢查郵箱
                      fetch(`http://localhost:3001/checkIfDocExists?email=${value.email}`)
                        .then(res => res.json())
                        .then(res => {
                          if (res.data && res.data[0]) {
                            window.alert("該電子郵件已存在。");
                          } else {
                            // 步驟 2: 執行註冊
                            const registerUrl = `http://localhost:3001/makeDocAccount?` +
                              `name=${encodeURIComponent(value.name)}&` +
                              `email=${value.email}&` +
                              `password=${value.password}&` +
                              `gender=${value.gender}&` +
                              `schedule=${value.schedule}&` + // 傳送用戶輸入的 ID
                              `address=${encodeURIComponent(value.address)}&` +
                              `age=${value.age}`;

                            fetch(registerUrl)
                              .then(async (response) => {
                                const result = await response.json();
                                if (response.ok) {
                                  window.alert("註冊成功！");
                                  window.location = "/DocHome";
                                } else {
                                  // 這裡會抓到後端傳來的 "排班 ID 不存在" 錯誤
                                  window.alert("錯誤: " + (result.error || "註冊失敗"));
                                }
                              })
                              .catch(err => {
                                window.alert("伺服器連線失敗");
                              });
                          }
                        });
                    }}
                  >
                    {/* 姓名與年齡分組 */}
                    <Box direction="row-responsive" gap="medium" flex={false}>
                      <Box flex>
                        <FormField label="FULL NAME / 姓名" name="name" required>
                          <TextInput
                            name="name"
                            placeholder="請輸入真實姓名 (例如: 王大明)" 
                                                validate={{ regexp: /^[a-zA-Z\u4e00-\u9fa5]/i, message: "請輸入有效的姓名" }}
                                                plain 
                                            />
                                        </FormField>
                                    </Box>
                                    <Box width="small">
                                        <FormField label="AGE / 年齡" name="age" required>
                                            <TextInput name="age" type="number" placeholder="年齡" plain />
                                        </FormField>
                                    </Box>
                                </Box>

                                {/* 地址欄位 */}
                                <FormField label="ADDRESS / 地址" name="address" required>
                                    <TextInput 
                                        name="address" 
                                        placeholder="例如：台北市中山區南京東路三段..." 
                                        plain 
                                    />
                                </FormField>

                                {/* 排班編號與性別分組 */}
                                <Box direction="row-responsive" gap="medium" flex={false}>
                                    <Box flex>
                                        <FormField label="SCHEDULE ID / 排班編號" name="schedule" required>
                                            <TextInput name="schedule" placeholder="請輸入資料庫中的排班 ID (例如 1)" plain />
                                        </FormField>
                                    </Box>
                                    <Box width="medium">
                                        <FormField label="GENDER / 性別" name="gender" required>
                                            <Select 
                                                name="gender"
                                                options={['Male', 'Female']} 
                                                placeholder="選擇性別" 
                                            />
                                        </FormField>
                                    </Box>
                                </Box>

                                {/* 賬號資料分組 */}
                                <Box margin={{ top: 'medium' }} flex={false}>
                                    <FormField label="EMAIL / 電子郵箱" name="email" required>
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
                                        <TextInput name="password" type="password" placeholder="至少8位字符，含2位數字" plain />
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
                                        label="REGISTER / 註冊"
                                        fill="horizontal"
                                        type="submit"
                                        primary
                                        style={{ padding: '12px' }}
                                    />
                                </Box>
                            </Form>

                            {/* 重要提示區塊 */}
                            <Box 
                                margin={{ top: 'xlarge' }} 
                                pad="medium" 
                                background="light-1" 
                                border={{ color: 'black', style: 'dashed' }}
                                flex={false}
                            >
                                <Text size="xsmall" weight="bold">
                                    注意：本系統強制執行外鍵約束。請確保您的「排班編號」對應資料庫 Schedule 表中的現有 ID。姓名欄位請勿包含特殊符號。性別僅接受 Male 或 Female。
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