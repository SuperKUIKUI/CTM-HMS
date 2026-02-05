import React, { Component } from 'react';
import {
  Box,
  Button,
  Heading,
  Grommet,
  FormField,
  Form,
  Grid,
  Text,
  TextInput,
  Main,
} from 'grommet';
import { FormPreviousLink, ShieldSecurity, MailOption } from 'grommet-icons';

const theme = {
  global: {
    colors: {
      brand: '#000000',
      background: '#ffffff',
      border: '#000000',
      focus: 'transparent',
      "status-ok": "#10B981",
      "status-error": "#FF4040",
      text: { light: '#000000' },
    },
    font: {
      family: 'sans-serif',
      size: '16px',
    },
  },
  button: { 
    border: { radius: "0px" },
    primary: {
      color: "#ffffff",
      background: "#000000"
    }
  },
  formField: {
    border: { side: 'all', color: 'black', size: '1px' },
    label: { weight: 700, margin: { bottom: 'xsmall', left: 'none' }, size: 'small' },
    round: '0px',
  }
};

export class DocSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      passwordMessage: '',
      emailMessage: '',
    };
  }

  showMessage(type, message) {
    if (type === 'password') {
      this.setState({ passwordMessage: message });
      setTimeout(() => this.setState({ passwordMessage: '' }), 3000);
    } else if (type === 'email') {
      this.setState({ emailMessage: message });
      setTimeout(() => this.setState({ emailMessage: '' }), 3000);
    }
  }

  render() {
    const { passwordMessage, emailMessage } = this.state;
    return (
      <Grommet theme={theme} full>
        <Box fill background="background" overflow="auto">
          
          {/* --- 頂部頁首 --- */}
          <Box
            background="black"
            pad={{ horizontal: 'xlarge', vertical: 'medium' }}
            direction="row"
            align="center"
            justify="between"
            flex={false}
          >
            <Box direction="row" align="center" gap="medium">
              <Button 
                icon={<FormPreviousLink color="white" />} 
                label={<Text color="white" weight="bold">返回主頁 / BACK</Text>}
                href="/DocHome" 
                plain
                style={{ border: '2px solid white', padding: '8px 20px' }}
              />
              <Box>
                <Heading level={2} margin="none" color="white" style={{ letterSpacing: '2px', fontWeight: '800' }}>
                  DOCTOR SETTINGS
                </Heading>
                <Text color="white" size="small">帳戶安全與偏好設定 / ACCOUNT SECURITY</Text>
              </Box>
            </Box>
          </Box>

          <Main pad={{ vertical: 'large', horizontal: 'xlarge' }} align="center">
            <Box width="100%" style={{ maxWidth: '1200px' }}>
              
              <Box direction="row" justify="between" align="end" border={{ side: 'bottom', color: 'black', size: '3px' }} pad={{ bottom: 'small' }} margin={{ bottom: 'xlarge' }}>
                <Heading level={3} margin="none" style={{ fontWeight: '800' }}>
                  PREFERENCES / 醫生設定
                </Heading>
              </Box>

              <Grid
                columns={{ count: 'fit', size: 'medium' }}
                gap="xlarge"
                responsive
              >
                {/* --- 修改密碼區塊 --- */}
                <Box border={{ color: 'black', size: '2px' }} pad="large" background="white">
                  <Box direction="row" align="center" gap="small" margin={{ bottom: 'medium' }}>
                    <ShieldSecurity size="medium" color="black" />
                    <Heading level={4} margin="none">修改密碼 / PASSWORD</Heading>
                  </Box>
                  
                  <Form
                    onSubmit={({ value }) => {
                      fetch('http://localhost:3001/userInSession')
                        .then(res => res.json())
                        .then(res => {
                          const email_in_use = res.email;
                          fetch(
                            `http://localhost:3001/resetPasswordDoctor?email=${email_in_use}&oldPassword=${value.oldPassword}&newPassword=${value.newPassword}`,
                            { method: 'POST' }
                          )
                            .then(res => res.json())
                            .then(res => {
                              let didUpdate = res.data.affectedRows;
                              if (didUpdate === 0) {
                                this.showMessage('password', '舊密碼不正確。');
                              } else {
                                this.showMessage('password', '密碼重置成功！');
                              }
                            });
                        });
                    }}
                  >
                    <FormField label="舊密碼 / OLD PASSWORD" name="oldPassword" required>
                      <TextInput name="oldPassword" type="password" plain style={{ fontWeight: 'bold' }} />
                    </FormField>

                    <FormField label="新密碼 / NEW PASSWORD" name="newPassword" required>
                      <TextInput name="newPassword" type="password" plain style={{ fontWeight: 'bold' }} />
                    </FormField>

                    {passwordMessage && (
                      <Box background={passwordMessage.includes('成功') ? 'status-ok' : 'status-error'} pad="xsmall" margin={{ vertical: 'small' }}>
                        <Text size="small" color="white" weight="bold" textAlign="center">{passwordMessage}</Text>
                      </Box>
                    )}

                    <Button 
                      type="submit" 
                      label={<Text weight="bold">更新密碼 / UPDATE PASSWORD</Text>} 
                      primary 
                      fill="horizontal" 
                      margin={{ top: 'medium' }}
                      style={{ padding: '12px' }}
                    />
                  </Form>
                </Box>

                {/* --- 修改郵箱區塊 --- */}
                <Box border={{ color: 'black', size: '2px' }} pad="large" background="white">
                  <Box direction="row" align="center" gap="small" margin={{ bottom: 'medium' }}>
                    <MailOption size="medium" color="black" />
                    <Heading level={4} margin="none">電子郵件 / EMAIL</Heading>
                  </Box>

                  <Form
                    onSubmit={({ value }) => {
                      fetch('http://localhost:3001/userInSession')
                        .then(res => res.json())
                        .then(res => {
                          const oldEmail = res.email;
                          fetch(
                            `http://localhost:3001/resetEmailDoctor?oldEmail=${oldEmail}&newEmail=${value.newEmail}&password=${value.password}`,
                            { method: 'POST' }
                          )
                            .then(res => res.json())
                            .then(res => {
                              let didUpdate = res.data.affectedRows;
                              if (didUpdate === 0) {
                                this.showMessage('email', '密碼不正確或新郵箱已被註冊。');
                              } else {
                                this.showMessage('email', '電子郵件重置成功！');
                              }
                            });
                        });
                    }}
                  >
                    <FormField label="驗證密碼 / VERIFY PASSWORD" name="password" required>
                      <TextInput name="password" type="password" plain style={{ fontWeight: 'bold' }} />
                    </FormField>

                    <FormField label="新電子郵件 / NEW EMAIL" name="newEmail" required>
                      <TextInput name="newEmail" type="email" plain style={{ fontWeight: 'bold' }} />
                    </FormField>

                    {emailMessage && (
                      <Box background={emailMessage.includes('成功') ? 'status-ok' : 'status-error'} pad="xsmall" margin={{ vertical: 'small' }}>
                        <Text size="small" color="white" weight="bold" textAlign="center">{emailMessage}</Text>
                      </Box>
                    )}

                    <Button 
                      type="submit" 
                      label={<Text weight="bold">更新郵件 / UPDATE EMAIL</Text>} 
                      primary 
                      fill="horizontal" 
                      margin={{ top: 'medium' }}
                      style={{ padding: '12px' }}
                    />
                  </Form>
                </Box>
              </Grid>

              {/* 頁尾 */}
              <Box margin={{ top: 'xlarge' }} direction="row" justify="between" border={{ side: 'top', color: 'black' }} pad={{ vertical: 'medium' }}>
                <Text size="xsmall" color="dark-4" weight="bold">SECURE SETTINGS PANEL</Text>
                <Text size="xsmall" color="dark-4" weight="bold">LAST ACCESS: {new Date().toLocaleString()}</Text>
              </Box>

            </Box>
          </Main>
        </Box>
      </Grommet>
    );
  }
}

export default DocSettings;