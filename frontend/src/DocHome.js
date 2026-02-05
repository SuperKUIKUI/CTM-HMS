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
    Calendar,
    User,
    SettingsOption,
    Logout,
    Home,
    DocumentText,
    BarChart
} from 'grommet-icons';

// 頭像圖片
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

export class DocHome extends Component {

    state = {
        doctorInfo: {
            name: "載入中...",
            email: "載入中...",
            gender: "",
            age: "",
            address: ""
        },
        showSidebar: true
    }

    componentDidMount() {
        fetch("http://localhost:3001/userInSession")
            .then(res => res.json())
            .then(res => {
                const email_json = JSON.parse(JSON.stringify(res));
                let email_in_use = email_json.email;

                fetch('http://localhost:3001/checkIfDocExists?email=' + email_in_use)
                    .then(res => res.json())
                    .then(res => {
                        if (res.data && res.data.length > 0) {
                            this.setState({ doctorInfo: res.data[0] });
                        } else {
                            this.setState({
                                doctorInfo: {
                                    name: "未找到資料",
                                    email: email_in_use,
                                    gender: "未知",
                                    age: "未知",
                                    address: "未知"
                                }
                            });
                        }
                    })
                    .catch(err => console.error("Fetch error:", err));
            });
    }

    render() {
        const { doctorInfo, showSidebar } = this.state;

        let rawGender = (doctorInfo.gender || "").toString();
        const genderStr = rawGender.toLowerCase().trim();

        // 頭像組件：移除外層方框
        const AvatarDisplay = () => {
            const isMale = ["male", "man", "boy", "m", "男"].includes(genderStr);
            const isFemale = ["female", "woman", "girl", "f", "女"].includes(genderStr);
            
            const imgStyle = {
                width: '180px', // 稍微調大一點，視覺更平衡
                height: '180px',
                objectFit: 'cover',
                borderRadius: '50%' // 改成圓形頭像通常在無框設計中更好看，若要方形可刪除此行
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
                    round="full" // 改成圓形佔位
                    align="center" 
                    justify="center" 
                    margin={{ bottom: 'medium' }}
                >
                    <User size="xlarge" color="dark-4" />
                </Box>
            );
        };

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
                    <AppBar>
                        <Box direction="row" align="center" gap="small">
                            <Button 
                                icon={<Home color="white" />} 
                                onClick={() => this.setState({ showSidebar: !showSidebar })} 
                            />
                            <Heading level='3' margin='none' color="white" style={{ fontWeight: '800' }}>
                                醫院管理系統
                            </Heading>
                        </Box>
                        <Heading level='4' margin='none' color="white">醫師工作台</Heading>
                    </AppBar>

                    <Box direction='row' flex overflow={{ horizontal: 'hidden' }}>
                        {/* 側邊導航 */}
                        <Collapsible direction="horizontal" open={showSidebar}>
                            <Box 
                                flex 
                                width='medium' 
                                background='brand' 
                                align='start' 
                                justify='start'
                            >
                                <Box fill pad={{ vertical: 'small' }}>
                                    <MenuButton label="預約排程管理" icon={<Calendar />} href="/ApptList" />
                                    <MenuButton label="病患資料查詢" icon={<DocumentText />} href="/MedHistView" />
                                    <MenuButton label="門診數據統計" icon={<BarChart />} href="/DocStatistics" />
                                    <MenuButton label="個人帳戶設定" icon={<SettingsOption />} href="/DocSettings" />
                                    <Box border={{ side: 'top', color: 'rgba(255,255,255,0.1)' }} margin={{ top: 'medium' }} pad={{ top: 'small' }}>
                                        <MenuButton label="登出系統" icon={<Logout />} onClick={() => {
                                            fetch('http://localhost:3001/endSession');
                                            window.location.href = "/";
                                        }} />
                                    </Box>
                                </Box>
                            </Box>
                        </Collapsible>

                        {/* 主內容區 */}
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
                                    
                                    {/* 左側資訊：移除頭像外框 */}
                                    <Box width="medium" align="center" justify="center">
                                        <AvatarDisplay />
                                        <Heading level="1" margin={{ top: 'small', bottom: 'none' }} style={{ fontWeight: '900' }}>
                                            {doctorInfo.name}
                                        </Heading>
                                        <Box background="black" pad={{ horizontal: 'small', vertical: 'xsmall' }} margin={{ top: 'small' }}>
                                            <Text size="xsmall" color="white" weight="bold">
                                                專業執業醫師
                                            </Text>
                                        </Box>
                                    </Box>

                                    {/* 右側資訊 */}
                                    <Box flex justify="center">
                                        <InfoRow label="電子郵件" value={doctorInfo.email} />
                                        <InfoRow label="性別" value={doctorInfo.gender} />
                                        <InfoRow label="醫師年齡" value={doctorInfo.age ? `${doctorInfo.age} 歲` : ""} />
                                        <InfoRow label="聯絡地址" value={doctorInfo.address} />
                                    </Box>

                                </CardBody>
                                
                                <CardFooter 
                                    background="black" 
                                    pad={{ horizontal: "xlarge", vertical: "medium" }} 
                                    justify="end"
                                >
                                    <Button 
                                        label={<Text weight="bold" color="white" size="medium">進入預約管理系統</Text>}
                                        plain
                                        href="/ApptList"
                                        hoverIndicator={{ color: "#333" }}
                                    />
                                </CardFooter>
                            </Card>
                            
                            <Box margin={{ top: 'large' }}>
                                <Text size="small" color="dark-5" style={{ letterSpacing: '2px' }}>
                                    © HOSPITAL MANAGEMENT SYSTEM | PROFESSIONAL EDITION
                                </Text>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Grommet>
        );
    }
}

export default DocHome;