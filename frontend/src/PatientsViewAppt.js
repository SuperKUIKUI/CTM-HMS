import React, { Component } from 'react';
import {
    Box,
    Heading,
    Grommet,
    Button,
    Text,
    Table,
    TableHeader,
    TableRow,
    TableCell,
    TableBody,
    Main
} from 'grommet';
import { FormPreviousLink, CircleInformation, Trash } from 'grommet-icons';

// 統一硬核黑白主題
const theme = {
    global: {
        colors: {
            brand: '#000000',
            background: '#ffffff',
            border: '#000000',
            focus: 'transparent',
            text: { light: '#000000' },
            "status-critical": "#FF4040",
        },
        font: {
            family: 'sans-serif',
            size: '14px'
        }
    },
    button: {
        border: { radius: '0px', width: '2px' },
        primary: { color: '#ffffff', background: '#000000' }
    }
};

export class PatientsViewAppointments extends Component {
    state = { appointmentsState: [] }

    componentDidMount() {
        this.getNames();
    }

    getNames() {
        fetch("http://localhost:3001/userInSession")
            .then(res => res.json())
            .then(res => {
                let email_in_use = res.email;
                fetch('http://localhost:3001/patientViewAppt?email=' + email_in_use)
                    .then(res => res.json())
                    .then(res => {
                        this.setState({ appointmentsState: res.data || [] });
                    });
            });
    }

    render() {
        const { appointmentsState } = this.state;

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
                                label={<Text color="white" weight="bold">返回 / BACK</Text>}
                                onClick={() => window.location.href = "/"}
                                plain
                                style={{ border: '2px solid white', padding: '8px 20px' }}
                            />
                            <Box>
                                <Heading level={2} margin="none" color="white" style={{ letterSpacing: '2px', fontWeight: '800' }}>
                                    MY APPOINTMENTS
                                </Heading>
                                <Text color="white" size="xsmall">預約歷史查詢 / APPOINTMENT HISTORY</Text>
                            </Box>
                        </Box>
                    </Box>

                    {/* --- 主體內容 --- */}
                    <Main pad={{ vertical: 'large', horizontal: 'xlarge' }} align="center">
                        <Box width="100%" style={{ maxWidth: '1200px' }}>
                            
                            {/* 標題與裝飾線 */}
                            <Box direction="row" justify="between" align="end" border={{ side: 'bottom', color: 'black', size: '3px' }} pad={{ bottom: 'small' }} margin={{ bottom: 'large' }}>
                                <Heading level={3} margin="none" style={{ fontWeight: '800' }}>
                                    SCHEDULED VISITS / 預約清單
                                </Heading>
                                <Text weight="bold">TOTAL: {appointmentsState.length}</Text>
                            </Box>

                            {/* 工業風表格容器 */}
                            <Box border={{ color: 'black', size: '2px' }} overflow="auto">
                                <Table style={{ borderCollapse: 'collapse', width: '100%' }}>
                                    <TableHeader>
                                        <TableRow background="black">
                                            <TableCell pad="medium" border={{ side: 'right', color: 'black' }}>
                                                <Text color="black" weight="bold" size="small">日期 / DATE</Text>
                                            </TableCell>
                                            <TableCell pad="medium" border={{ side: 'right', color: 'black' }}>
                                                <Text color="black" weight="bold" size="small">時間 / TIME</Text>
                                            </TableCell>
                                            <TableCell pad="medium" border={{ side: 'right', color: 'black' }}>
                                                <Text color="black" weight="bold" size="small">門診原因 / CONCERNS</Text>
                                            </TableCell>
                                            <TableCell pad="medium" border={{ side: 'right', color: 'black' }}>
                                                <Text color="black" weight="bold" size="small">狀態 / STATUS</Text>
                                            </TableCell>
                                            <TableCell pad="medium" textAlign="center">
                                                <Text color="black" weight="bold" size="small">管理 / ACTION</Text>
                                            </TableCell>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {appointmentsState.length > 0 ? appointmentsState.map((appt, index) => (
                                            <TableRow key={appt.ID} background={index % 2 === 0 ? 'white' : 'light-1'}>
                                                <TableCell pad="medium" border={{ side: 'all', color: 'black' }}>
                                                    <Text weight="900" size="small">{new Date(appt.theDate).toLocaleDateString()}</Text>
                                                </TableCell>
                                                <TableCell pad="medium" border={{ side: 'all', color: 'black' }}>
                                                    <Text size="small" weight="bold">{appt.theStart.substring(0, 5)} - {appt.theEnd.substring(0, 5)}</Text>
                                                </TableCell>
                                                <TableCell pad="medium" border={{ side: 'all', color: 'black' }}>
                                                    <Text size="small" style={{ lineHeight: '1.4' }}>{appt.theConcerns || "N/A"}</Text>
                                                </TableCell>
                                                <TableCell pad="medium" border={{ side: 'all', color: 'black' }}>
                                                    <Box 
                                                        background={appt.status === 'NotDone' ? 'white' : 'black'} 
                                                        border={{ color: 'black', size: '2px' }}
                                                        pad={{ horizontal: 'small', vertical: 'xsmall' }}
                                                        align="center"
                                                    >
                                                        <Text size="xsmall" weight="black" color={appt.status === 'NotDone' ? 'black' : 'white'}>
                                                            {appt.status === 'NotDone' ? 'PENDING' : 'COMPLETED'}
                                                        </Text>
                                                    </Box>
                                                </TableCell>
                                                <TableCell pad="medium" border={{ side: 'all', color: 'black' }}>
                                                    <Box direction="row" gap="small" justify="center">
                                                        <Button
                                                            icon={<CircleInformation size="small" />}
                                                            label={<Text size="xsmall" weight="bold">VIEW</Text>}
                                                            primary
                                                            href={`/showDiagnoses/${appt.ID}`}
                                                            style={{ padding: '6px 12px' }}
                                                        />
                                                        {appt.status === "NotDone" && (
                                                            <Button
                                                                icon={<Trash size="small" />}
                                                                label={<Text size="xsmall" weight="bold">CANCEL</Text>}
                                                                onClick={() => {
                                                                    if (window.confirm("確定要取消此預約？此操作不可撤銷。")) {
                                                                        fetch('http://localhost:3001/deleteAppt?uid=' + appt.ID)
                                                                            .then(() => window.location.reload());
                                                                    }
                                                                }}
                                                                color="status-critical"
                                                                style={{ padding: '6px 12px', border: '2px solid #FF4040' }}
                                                            />
                                                        )}
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow>
                                                <TableCell colSpan={5} pad="xlarge" textAlign="center" border={{ side: 'all', color: 'black' }}>
                                                    <Text weight="bold" color="dark-4">無預約數據 / NO APPOINTMENT RECORDS FOUND</Text>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </Box>

                            {/* 底部數據標籤 */}
                            <Box margin={{ top: 'xlarge' }} direction="row" justify="between" border={{ side: 'top', color: 'black' }} pad={{ vertical: 'medium' }}>
                                <Text size="xsmall" weight="bold">PATIENT_ID: {this.state.appointmentsState[0]?.ID || 'NULL'}</Text>
                                <Text size="xsmall" weight="bold">STRICTLY CONFIDENTIAL / 嚴格保密</Text>
                            </Box>
                        </Box>
                    </Main>
                </Box>
            </Grommet>
        );
    }
}

export default PatientsViewAppointments;