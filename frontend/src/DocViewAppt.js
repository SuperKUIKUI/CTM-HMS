import React, { Component } from 'react';
import {
    Box,
    Button,
    Heading,
    Grommet,
    Text,
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    Main
} from 'grommet';
import { FormPreviousLink, FormSchedule, Validate } from 'grommet-icons';

const theme = {
    global: {
        colors: {
            brand: '#000000',
            background: '#ffffff',
            border: '#000000',
            focus: 'transparent',
            "status-ok": "#10B981",    
            "status-warning": "#FFB020", 
            text: { light: '#000000' },
        },
        font: {
            family: 'sans-serif',
            size: '16px', // 提升全局基礎字號
        },
    },
    button: {
        border: { radius: "0px" },
        primary: {
            color: "#ffffff",
            background: "#000000"
        }
    },
    table: {
        header: {
            background: { color: "black" },
            extend: `
                text-transform: uppercase;
                letter-spacing: 1px;
                color: white;
                font-weight: 900;
            `
        },
        body: {
            align: "center",
            pad: { horizontal: "medium", vertical: "medium" }
        }
    }
};

export class DocViewAppt extends Component {
    state = { apptlist: [], loading: true }

    componentDidMount() {
        this.getNames();
    }

    getNames() {
        fetch('http://localhost:3001/doctorViewAppt?email=' + this.props.email)
            .then(res => res.json())
            .then(res => this.setState({ apptlist: res.data || [], loading: false }))
            .catch(error => {
                console.error("Error fetching appointments:", error);
                this.setState({ loading: false });
            });
    }

    render() {
        const { apptlist, loading } = this.state;

        const StatusBadge = ({ status }) => {
            const isDone = status !== "NotDone";
            return (
                <Box
                    background={isDone ? "status-ok" : "status-warning"}
                    pad={{ horizontal: 'small', vertical: 'xsmall' }}
                    align="center"
                    justify="center"
                    border={{ color: 'black', size: '1px' }}
                    width={{ min: "110px" }}
                >
                    <Text size="small" color="white" weight="bold">
                        {isDone ? "已完成" : "待處理"}
                    </Text>
                </Box>
            );
        };

        return (
            <Grommet full theme={theme}>
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
                                <Heading level={2} margin="none" color="white" style={{ letterSpacing: '2px' }}>
                                    APPOINTMENT LOG
                                </Heading>
                                <Text color="white" size="small">醫院預約管理系統 / ADMINISTRATION</Text>
                            </Box>
                        </Box>
                        <Box border={{ color: 'white', size: 'small' }} pad="xsmall">
                            <Text color="white" weight="bold" size="xsmall">ACCESS LEVEL: MEDICAL / 醫療權限</Text>
                        </Box>
                    </Box>

                    <Main pad={{ vertical: 'large', horizontal: 'xlarge' }} align="center">
                        <Box width="100%" style={{ maxWidth: '1600px' }}>
                            
                            <Box direction="row" justify="between" align="end" border={{ side: 'bottom', color: 'black', size: '3px' }} pad={{ bottom: 'small' }} margin={{ bottom: 'medium' }}>
                                <Heading level={3} margin="none" style={{ fontWeight: '800' }}>
                                    MY APPOINTMENTS / 我的預約清單
                                </Heading>
                                <Text weight="bold" size="large">記錄總數: {apptlist.length}</Text>
                            </Box>

                            {/* 表格主體：增加外邊框 */}
                            <Box border={{ color: 'black', size: '2px' }}>
                                <Box overflow="auto" height={{ max: "75vh" }}>
                                    {apptlist.length > 0 ? (
                                        <Table stickyHeader>
                                            <TableHeader>
                                                <TableRow>
                                                    {/* 顯式增加 Cell 邊框線 */}
                                                    <TableCell border={{ side: 'all', color: 'black' }}><Text weight="bold" size="small">編號 / ID</Text></TableCell>
                                                    <TableCell border={{ side: 'all', color: 'black' }}><Text weight="bold" size="small">患者姓名 / NAME</Text></TableCell>
                                                    <TableCell border={{ side: 'all', color: 'black' }}><Text weight="bold" size="small">預約日期 / DATE</Text></TableCell>
                                                    <TableCell border={{ side: 'all', color: 'black' }}><Text weight="bold" size="small">時段 / TIME</Text></TableCell>
                                                    <TableCell border={{ side: 'all', color: 'black' }} style={{ width: '35%' }}><Text weight="bold" size="small">主訴與症狀詳細 / CLINICAL DETAILS</Text></TableCell>
                                                    <TableCell border={{ side: 'all', color: 'black' }} align="center"><Text weight="bold" size="small">狀態 / STATUS</Text></TableCell>
                                                    <TableCell border={{ side: 'all', color: 'black' }} align="center"><Text weight="bold" size="small">操作 / ACTION</Text></TableCell>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {apptlist.map((appt, index) => (
                                                    <TableRow key={appt.id}>
                                                        <TableCell border={{ side: 'all', color: 'black' }}><Text weight="bold">{appt.id}</Text></TableCell>
                                                        <TableCell border={{ side: 'all', color: 'black' }}><Text weight="bold" size="medium">{appt.name}</Text></TableCell>
                                                        <TableCell border={{ side: 'all', color: 'black' }}><Text size="medium">{new Date(appt.date).toLocaleDateString()}</Text></TableCell>
                                                        <TableCell border={{ side: 'all', color: 'black' }}><Text size="medium" weight="bold">{appt.starttime}</Text></TableCell>
                                                        
                                                        {/* 加大的主訴區域 */}
                                                        <TableCell border={{ side: 'all', color: 'black' }} pad="medium">
                                                            <Box>
                                                                <Text size="medium" weight="bold" margin={{ bottom: 'xsmall' }}>主訴：{appt.concerns}</Text>
                                                                <Text size="small" color="dark-2">症狀描述：{appt.symptoms}</Text>
                                                            </Box>
                                                        </TableCell>

                                                        <TableCell border={{ side: 'all', color: 'black' }} align="center">
                                                            <StatusBadge status={appt.status} />
                                                        </TableCell>
                                                        <TableCell border={{ side: 'all', color: 'black' }} align="center">
                                                            <Button
                                                                label={<Text weight="bold" size="small">執行診斷 / DIAGNOSE</Text>}
                                                                icon={<Validate size="small" />}
                                                                href={`/Diagnose/${appt.id}`}
                                                                primary
                                                                style={{ padding: '10px 20px' }}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    ) : (
                                        <Box pad="xlarge" align="center">
                                            {loading ? <Text size="large">數據讀取中...</Text> : (
                                                <Text size="large" weight="bold">目前無任何預約記錄</Text>
                                            )}
                                        </Box>
                                    )}
                                </Box>
                            </Box>

                            {/* 頁尾 */}
                            <Box margin={{ top: 'medium' }} direction="row" justify="between">
                                <Text size="xsmall" color="dark-4" weight="bold">DATA SECURED: AES-256</Text>
                                <Text size="xsmall" color="dark-4" weight="bold">LOG DATE: {new Date().toLocaleString()}</Text>
                            </Box>
                        </Box>
                    </Main>
                </Box>
            </Grommet>
        );
    }
}

export default DocViewAppt;