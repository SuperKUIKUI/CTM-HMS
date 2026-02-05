import React, { Component } from 'react';
import {
    Box,
    Heading,
    Grommet,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Text,
    Button
} from 'grommet';

// 保持统一的硬核黑白主题
const theme = {
    global: {
        colors: {
            brand: '#000000',
            background: '#ffffff',
            focus: 'transparent',
            text: '#000000',
            'light-1': '#f5f5f5',
        },
        font: {
            family: 'sans-serif',
            size: '15px'
        }
    }
};

let id;

export class ShowDiagnoses extends Component {
    constructor(props) {
        super(props);
        id = props.match.params.id;
    }
    state = { diagnoses: [] }
    
    componentDidMount() {
        fetch('http://localhost:3001/showDiagnoses?id=' + id)
            .then(res => res.json())
            .then(res => this.setState({ diagnoses: res.data }));
    }

    render() {
        const { diagnoses } = this.state;

        return (
            <Grommet full theme={theme}>
                <Box fill background="white" overflow="auto">
                    {/* 1. 顶部导航条 (仅保留标题) */}
                    <Box
                        tag='header'
                        background='white'
                        pad={{ horizontal: 'large', vertical: 'medium' }}
                        border={{ side: 'bottom', size: '2px', color: 'black' }}
                    >
                        <a style={{ color: 'inherit', textDecoration: 'none' }} href="/">
                            <Heading level='3' margin='none' style={{ fontWeight: 'bold', letterSpacing: '-1px' }}>
                                HOSPITAL SYSTEM / 醫院管理系統
                            </Heading>
                        </a>
                    </Box>
                    
                    {/* 2. 内容主体区 */}
                    <Box pad={{ horizontal: 'large', vertical: 'medium' }} width="xlarge" alignSelf="center">
                        
                        {/* 👆 关键修改：左上角返回按钮 */}
                        <Box align="start" margin={{ bottom: 'medium' }}>
                            <Button 
                                label="← BACK TO LIST / 返回列表" 
                                onClick={() => this.props.history.push("/PatientsViewAppt")} 
                                plain 
                                style={{ fontSize: '14px', fontWeight: 'bold' }}
                                hoverIndicator
                            />
                        </Box>

                        {/* 页面主标题 */}
                        <Box direction="row" align="baseline" gap="small" margin={{ bottom: 'large' }}>
                            <Heading level="2" margin="none" style={{ letterSpacing: '-1px' }}>DIAGNOSIS REPORT</Heading>
                            <Text color="dark-4">/ 診斷報告詳情</Text>
                        </Box>

                        {/* 报告详情块 */}
                        {diagnoses.length > 0 ? diagnoses.map((diagnosis, index) => (
                            <Box 
                                key={index} 
                                border={{ color: 'black', size: '2px' }} 
                                margin={{ bottom: 'xlarge' }}
                                background="white"
                            >
                                {/* 装饰性深色条 */}
                                <Box background="black" pad="xsmall" align="center">
                                    <Text color="white" size="xsmall" weight="bold">PATIENT MEDICAL RECORD</Text>
                                </Box>

                                <Table style={{ borderCollapse: 'collapse', width: '100%' }}>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell border={{ side: 'bottom', color: 'black' }} pad="medium" width="25%" background="light-1">
                                                <Text weight="bold">預約編號</Text>
                                            </TableCell>
                                            <TableCell border={{ side: 'bottom', color: 'black' }} pad="medium">
                                                <Text>{diagnosis.appt}</Text>
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell border={{ side: 'bottom', color: 'black' }} pad="medium" background="light-1">
                                                <Text weight="bold">主治醫生</Text>
                                            </TableCell>
                                            <TableCell border={{ side: 'bottom', color: 'black' }} pad="medium">
                                                <Text>{diagnosis.doctor}</Text>
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell border={{ side: 'bottom', color: 'black' }} pad="medium" background="light-1" verticalAlign="top">
                                                <Text weight="bold">診斷結果</Text>
                                            </TableCell>
                                            <TableCell border={{ side: 'bottom', color: 'black' }} pad="medium">
                                                <Text style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
                                                    {diagnosis.diagnosis}
                                                </Text>
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell pad="medium" background="light-1" verticalAlign="top">
                                                <Text weight="bold">處方內容</Text>
                                            </TableCell>
                                            <TableCell pad="medium">
                                                <Text style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', fontFamily: 'monospace' }}>
                                                    {diagnosis.prescription}
                                                </Text>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Box>
                        )) : (
                            <Box pad="large" align="center" border={{ color: 'black', style: 'dashed' }}>
                                <Text>正在加載報告數據...</Text>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Grommet>
        );
    }
}

export default ShowDiagnoses;