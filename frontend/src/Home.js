import React, { Component } from 'react';
import {
    Box,
    Heading,
    Grommet,
    Button,
    Card,
    CardBody,
    CardFooter,
    Text,
    Collapsible
} from 'grommet';
import { 
    History, 
    ScheduleNew, 
    Clipboard, 
    SettingsOption, 
    Logout, 
    User,
    Home as HomeIcon
} from 'grommet-icons';

// 引入圖片
import maleIcon from './male.png';
import femaleIcon from './female.png';

import './App.css';

const theme = {
    global: {
        colors: {
            brand: '#000000',
            control: '#000000',
            focus: '#000000',
            "neutral-gray": "#cccccc",
            background: {
                light: '#ffffff',
            },
            text: {
                dark: '#ffffff',
                light: '#000000',
            }
        },
        font: {
            family: '"Lato", "Helvetica Neue", "Microsoft JhengHei", sans-serif',
        },
    },
    button: {
        border: {
            radius: '4px',
        },
        primary: {
            color: '#000000',
        }
    }
};

const AppBar = (props) => (
    <Box
        tag='header'
        direction='row'
        align='center'
        justify='between'
        background='brand'
        pad={{ left: 'medium', right: 'small', vertical: 'small' }}
        style={{ zIndex: '10' }}
        {...props} />
);

const MenuButton = ({ label, icon, href, onClick }) => (
    <Button 
        hoverIndicator={{ color: "#333333" }} 
        plain 
        href={href} 
        onClick={onClick}
    >
        <Box direction="row" pad="medium" gap="medium" align="center">
            {React.cloneElement(icon, { color: "white", size: "medium" })}
            <Text color="white" weight={400} size="medium">{label}</Text>
        </Box>
    </Button>
);

export class Home extends Component {
    
    state = { 
        patientInfo: {
            name: "載入中...",
            email: "載入中...",
            gender: "",
            address: "",
            age: "",      
            height: "",   
            weight: ""    
        }, 
        showSidebar: true 
    }

    componentDidMount() {
        fetch("http://localhost:3001/userInSession")
            .then(res => res.json())
            .then(res => {
                var email_json = JSON.parse(JSON.stringify(res));
                let email_in_use = email_json.email;
                
                fetch('http://localhost:3001/checkIfPatientExists?email=' + email_in_use)
                    .then(res => res.json())
                    .then(res => {
                        if (res.data && res.data.length > 0) {
                            this.setState({ patientInfo: res.data[0] });
                        } else {
                            this.setState({ 
                                patientInfo: { 
                                    name: "未找到用戶", 
                                    email: email_in_use,
                                    gender: "未知", 
                                    address: "未知",
                                    age: "未知",
                                    height: "未知",
                                    weight: "未知"
                                } 
                            });
                        }
                    })
                    .catch(err => console.error("Fetch error:", err));
            });
    }

    render() {
        const { patientInfo, showSidebar } = this.state;

        let rawGender = (patientInfo.gender || "").toString();
        const genderStr = rawGender.toLowerCase().trim(); 

        // 頭像組件：無框圓形設計
        const AvatarDisplay = () => {
            const isMale = ["male", "man", "boy", "m", "男"].includes(genderStr);
            const isFemale = ["female", "woman", "girl", "f", "女"].includes(genderStr);
            
            const imgStyle = {
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                objectFit: 'cover'
            };

            if (isMale || isFemale) {
                return (
                    <Box margin={{ bottom: 'medium' }}>
                        <img src={isMale ? maleIcon : femaleIcon} alt="Avatar" style={imgStyle} />
                    </Box>
                );
            }
            return (
                <Box 
                    width="180px" 
                    height="180px" 
                    background="light-2" 
                    round="full" 
                    align="center" 
                    justify="center" 
                    margin={{ bottom: 'medium' }}
                >
                    <User size="xlarge" color="dark-4" />
                </Box>
            );
        };

        // 資訊行：標籤寬度固定，防止擠壓
        const InfoRow = ({ label, value }) => (
            <Box 
                direction="row" 
                align="center"
                border={{ side: 'bottom', color: 'light-4' }} 
                pad={{ vertical: 'medium' }}
            >
                <Box width="small">
                    <Text weight={700} color="black" size="medium">{label}</Text>
                </Box>
                <Box flex>
                    <Text color="dark-2" size="medium">{value || "---"}</Text>
                </Box>
            </Box>
        );

        return (
            <Grommet theme={theme} full>
                <Box fill background="white">
                    {/* 頂部導航 */}
                    <AppBar>
                        <Box direction="row" align="center" gap="small">
                            <Button 
                                icon={<HomeIcon color="white" />} 
                                onClick={() => this.setState({ showSidebar: !showSidebar })} 
                            />
                            <Heading level='3' margin='none' color="white" style={{ fontWeight: '800' }}>
                                醫院管理系統
                            </Heading>
                        </Box>
                        <Heading level='4' margin='none' color="white">病人工作台</Heading>
                    </AppBar>

                    <Box direction='row' flex overflow={{ horizontal: 'hidden' }}>
                        {/* 側邊導航 */}
                        <Collapsible direction="horizontal" open={showSidebar}>
                            <Box flex width='medium' background='brand' align='start' justify='start'>
                                <Box fill pad={{ vertical: 'small' }}>
                                    <MenuButton 
                                       label="查看個人病歷" 
                                       icon={<History />} 
                                       onClick={() => {
                                         const email = this.state.patientInfo.email;
                                         if (email && email !== "載入中..." && email !== "未找到用戶") {
                                           window.location.href = "/ViewOneHistory/" + email;
                                         } else {
                                            window.alert("正在載入用戶資訊，請稍後再試...");
                                         }
                                      }}
                                    />
                                    <MenuButton label="線上預約掛號" icon={<ScheduleNew />} href="/scheduleAppt" />
                                    <MenuButton label="我的預約清單" icon={<Clipboard />} href="/PatientsViewAppt" />
                                    <MenuButton label="個人帳號設定" icon={<SettingsOption />} href="/Settings" />
                                    <Box border={{ side: 'top', color: 'rgba(255,255,255,0.1)' }} margin={{ top: 'medium' }} pad={{ top: 'small' }}>
                                        <MenuButton label="登出系統" icon={<Logout />} onClick={() => {
                                                fetch('http://localhost:3001/endSession');
                                                window.location.href = "/";
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Collapsible>

                        {/* 主內容區域：xlarge 寬度 */}
                        <Box flex align="center" justify="center" background="#f4f4f4" pad="large">
                            <Card 
                                width="xlarge" 
                                background="white" 
                                border={{ color: 'black', size: 'medium' }}
                                elevation="none"
                            >
                                <CardBody 
                                    direction="row-responsive" 
                                    gap="xxlarge" 
                                    pad={{ horizontal: "xlarge", vertical: "xlarge" }}
                                >
                                    
                                    {/* 左側：頭像與名稱 */}
                                    <Box width="medium" align="center" justify="center">
                                        <AvatarDisplay />
                                        <Heading level="1" margin={{ top: 'small', bottom: 'none' }} style={{ fontWeight: '900' }}>
                                            {patientInfo.name}
                                        </Heading>
                                        <Box background="black" pad={{ horizontal: 'small', vertical: 'xsmall' }} margin={{ top: 'small' }}>
                                            <Text size="xsmall" color="white" weight="bold">
                                                個人健康檔案
                                            </Text>
                                        </Box>
                                    </Box>

                                    {/* 右側：詳細數據 */}
                                    <Box flex justify="center">
                                        <InfoRow label="電子郵件" value={patientInfo.email} />
                                        <InfoRow label="性別" value={patientInfo.gender} />
                                        <InfoRow label="目前年齡" value={patientInfo.age ? `${patientInfo.age} 歲` : ""} />
                                        <InfoRow label="身高 (cm)" value={patientInfo.height} />
                                        <InfoRow label="體重 (kg)" value={patientInfo.weight} />
                                        <InfoRow label="聯絡地址" value={patientInfo.address} />
                                    </Box>

                                </CardBody>

                                <CardFooter 
                                    background="black" 
                                    pad={{ horizontal: "xlarge", vertical: "medium" }} 
                                    justify="end"
                                >
                                    <Button 
                                        label={<Text weight="bold" color="white" size="medium">查看詳細預約記錄</Text>}
                                        plain
                                        href="/PatientsViewAppt"
                                        hoverIndicator={{ color: "#333" }}
                                    />
                                </CardFooter>
                            </Card>

                            <Box margin={{ top: 'large' }}>
                                <Text size="small" color="dark-5" style={{ letterSpacing: '2px' }}>
                                    © HOSPITAL MANAGEMENT SYSTEM | PATIENT PORTAL
                                </Text>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Grommet>
        );
    }
}

export default Home;