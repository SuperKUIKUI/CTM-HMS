import React, { Component, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Heading,
  Form,
  Grommet,
  Calendar,
  Select,
  Grid,
  Text,
  TextArea,
  Card,
  CardBody,
  CardHeader
} from 'grommet';
import { Schedule, Clock, UserExpert, FormCheckmark, Home } from 'grommet-icons';
import './App.css';

const theme = {
  global: {
    colors: {
      brand: '#000000',
      focus: "transparent",
      active: "#000000",
      "status-ok": "#000000",
      "status-disabled": "#CCCCCC",
      "light-gray": "#F4F4F4"
    },
    font: {
      family: '"Lato", "Helvetica Neue", "Microsoft JhengHei", sans-serif',
    },
  },
  button: {
    border: { radius: '4px' },
    primary: { color: '#ffffff', background: '#000000' }
  },
  card: {
    container: { round: 'none', elevation: 'none' }
  }
};

// 全域變數用於表單提交（維持原邏輯）
var theDate;
var theTime;
var endTime;
var theConcerns;
var theSymptoms;
var theDoc;

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

function DoctorsDropdown({ onDocSelect }) {
  const [value, setValue] = useState();
  const [doctorsList, setList] = useState([]);
  
  useEffect(() => {    
    fetch("http://localhost:3001/docInfo")
    .then(res => res.json())
    .then(res => {
      let arr = []
      res.data.forEach(i => {
        let tmp = `${i.name} 醫師 (${i.email})`;
        arr.push(tmp);
      });
      setList(arr);
    });
  }, []);

  const onChange = event => {
    setValue(event.value);
    let docEmail = event.value.match(/\((.*)\)/)[1];
    theDoc = docEmail; 
    onDocSelect(docEmail); 
  };

  return (
    <Select
      options={doctorsList}
      value={value}
      placeholder="請點擊選擇醫生..."
      icon={<UserExpert />}
      onChange={onChange}
      required
      style={{ border: '1px solid black' }}
    />
  );
}

const TimeSlotPicker = ({ selectedDoc, selectedDate, onTimeSelect }) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTime, setActiveTime] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    if (!selectedDoc || !selectedDate) {
      setSlots([]);
      return;
    }

    const dateObj = new Date(selectedDate);
    const dateStr = new Date(dateObj.getTime() - (dateObj.getTimezoneOffset() * 60000))
                    .toISOString()
                    .split('T')[0];

    setLoading(true);
    setStatusMsg("");
    setSlots([]);

    fetch(`http://localhost:3001/getDocScheduleOnDate?email=${selectedDoc}&date=${dateStr}`)
      .then(res => {
          if (!res.ok) throw new Error("Network response was not ok");
          return res.json();
      })
      .then(data => {
            setLoading(false);
            
            const startHour = parseInt(data.start.split(':')[0]);
            const endHour = parseInt(data.end.split(':')[0]);
            const breakHour = parseInt(data.break.split(':')[0]);
            const busyList = data.busy || []; 
    
            let generatedSlots = [];
            
            for (let h = startHour; h < endHour; h++) {
              const timeLabel = `${h.toString().padStart(2, '0')}:00`;
              const fullTimeStr = `${timeLabel}:00`; 
    
              let isBooked = busyList.includes(fullTimeStr);
              let isBreak = (h === breakHour);
              
              let status = 'available'; 
              if (isBreak) status = 'break';
              else if (isBooked) status = 'booked';
    
              generatedSlots.push({
                time: timeLabel,
                status: status
              });
            }
            setSlots(generatedSlots);
      })
      .catch(err => {
          console.error(err);
          setLoading(false);
          setStatusMsg("連接伺服器失敗，請檢查系統後端。");
      });

  }, [selectedDoc, selectedDate]);

  if (loading) {
      return (
          <Box align="center" pad="large">
              <Text weight="bold">⏳ 正在載入時段表...</Text>
          </Box>
      );
  }

  if (statusMsg) {
      return (
          <Box align="center" pad="medium" background="light-gray">
              <Text color="status-critical">{statusMsg}</Text>
          </Box>
      );
  }

  return (
    <Box pad="small" width="large">
        <Grid columns="xsmall" gap="small">
          {slots.map((item, index) => {
            const isAvailable = item.status === 'available';
            const isSelected = activeTime === item.time;
            
            let bg = "white"; 
            let border = "1px solid #CCCCCC";
            let textColor = "#000000";
            let cursor = "not-allowed";
            let labelText = item.time;

            if (item.status === 'break') {
               bg = "#EEEEEE";
               labelText = "休息";
               textColor = "#999999";
            } else if (item.status === 'booked') {
               bg = "#EEEEEE";
               labelText = "已滿";
               textColor = "#CCCCCC";
            } else if (isAvailable) {
               cursor = "pointer";
               if (isSelected) {
                   bg = "black"; 
                   border = "1px solid black";
                   textColor = "white";
               } else {
                   bg = "white";
                   border = "2px solid black"; 
                   textColor = "black";
               }
            }

            return (
              <Box
                key={index}
                onClick={() => {
                  if (isAvailable) {
                      setActiveTime(item.time);
                      onTimeSelect(item.time);
                  }
                }}
                background={bg}
                align="center"
                justify="center"
                pad="small"
                style={{ 
                    border: border, 
                    cursor: cursor,
                    transition: "all 0.1s ease",
                    fontWeight: 'bold'
                }}
              >
                  <Text size="small" weight="bold" color={textColor} style={{textDecoration: item.status === 'booked' ? 'line-through' : 'none'}}>
                      {labelText}
                  </Text>
              </Box>
            );
          })}
        </Grid>
    </Box>
  );
};

// 表單組件改為繁體
const ConcernsTextArea = () => {
  const [value, setValue] = React.useState("");
  return (
    <TextArea
      placeholder="請簡單描述您的就診原因（例如：例行檢查、開藥等）..."
      value={value}
      onChange={event => {
        setValue(event.target.value);
        theConcerns = event.target.value;
      }}
      style={{ border: '1px solid black' }}
      fill
    />
  );
};

const SymptomsTextArea = () => {
  const [value, setValue] = React.useState("");
  return (
    <TextArea
      placeholder="請列出您的具體症狀（例如：頭痛、持續發燒等）..."
      value={value}
      onChange={event => {
        setValue(event.target.value);
        theSymptoms = event.target.value;
      }}
      style={{ border: '1px solid black' }}
      fill
    />
  );
};

export class SchedulingAppt extends Component {
  state = {
    selectedDoc: null,
    date: undefined, 
    time: null
  };

  onDateChange = (nextDate) => {
    this.setState({ date: nextDate, time: null }); 
    theDate = nextDate; 
    theTime = null;
  };

  onTimeSelect = (timeStr) => {
    this.setState({ time: timeStr });
    theTime = timeStr;
    let startHour = parseInt(timeStr.split(":")[0], 10);
    let endHour = startHour + 1;
    endTime = `${endHour}:00`;
  }

  render() {
    const { date, selectedDoc, time } = this.state;

    return (
      <Grommet theme={theme} full>
        <AppBar>
          <Box direction="row" align="center" gap="small">
            <Button icon={<Home color="white" />} href="/Home" />
            <Heading level='3' margin='none' color="white">醫院管理系統</Heading>
          </Box>
          <Text color="white" weight="bold">掛號預約系統</Text>
        </AppBar>
        
        <Box align="center" pad="medium" background="#F4F4F4" style={{minHeight: "100vh"}}>
          <Box width="xlarge" gap="medium">
            <Heading level="2" textAlign="center" margin={{bottom:"medium"}} style={{fontWeight: 900}}>預約掛號排程</Heading>
            
            <Form
                onSubmit={({ value }) => {
                    if (!theDoc || !theDate || !theTime) {
                        window.alert("請完整填寫所有預約資訊！");
                        return;
                    }
                    
                    fetch("http://localhost:3001/userInSession")
                    .then(res => res.json())
                    .then(res => {
                    let email_in_use = res.email;
                    
                    fetch(`http://localhost:3001/checkIfApptExists?email=${email_in_use}&startTime=${theTime}&date=${theDate}&docEmail=${theDoc}`)
                        .then(res => res.json())
                        .then(res => {
                        if (res.data[0]) {
                            window.alert("哎呀！該時段剛剛已被其他患者預約。");
                            this.setState({ time: null });
                        } else {
                            fetch("http://localhost:3001/genApptUID")
                            .then(res => res.json())
                            .then(uidRes => {
                                let gen_uid = uidRes.id;
                                fetch(`http://localhost:3001/schedule?time=${theTime}&endTime=${endTime}&date=${theDate}&concerns=${theConcerns}&symptoms=${theSymptoms}&id=${gen_uid}&doc=${theDoc}`)
                                .then(() => {
                                    fetch(`http://localhost:3001/addToPatientSeeAppt?email=${email_in_use}&id=${gen_uid}&concerns=${theConcerns}&symptoms=${theSymptoms}`)
                                    .then(() => {
                                        window.alert("🎉 預約成功！");
                                        window.location.href = "/Home";
                                    });
                                });
                            });
                        }
                        });
                    });
                }}
            >
                {/* 1. 選擇醫生 */}
                <Card background="white" margin={{bottom: "medium"}} border={{color: 'black', size: 'small'}}>
                    <CardHeader pad="medium" background="black">
                        <Box direction="row" gap="small" align="center">
                            <UserExpert color="white"/>
                            <Text weight="bold" color="white">1. 選擇醫師</Text>
                        </Box>
                    </CardHeader>
                    <CardBody pad="medium">
                        <DoctorsDropdown onDocSelect={(doc) => this.setState({ selectedDoc: doc, time: null })} />
                    </CardBody>
                </Card>

                {/* 2. 日期與時間 */}
                {selectedDoc && (
                    <Box direction="row-responsive" gap="medium" margin={{bottom: "medium"}}>
                        <Card background="white" border={{color: 'black', size: 'small'}} basis="1/2">
                            <CardHeader pad="medium" background="#EEEEEE">
                                <Box direction="row" gap="small" align="center">
                                    <Schedule color="black"/>
                                    <Text weight="bold">2. 選擇日期</Text>
                                </Box>
                            </CardHeader>
                            <CardBody pad="medium" align="center">
                                <Calendar
                                    date={date}
                                    onSelect={this.onDateChange}
                                    size="small"
                                    locale="zh-TW"
                                    bounds={[new Date().toISOString(), new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()]}
                                />
                            </CardBody>
                        </Card>

                        <Card background="white" border={{color: 'black', size: 'small'}} basis="1/2">
                            <CardHeader pad="medium" background="#EEEEEE">
                                <Box direction="row" gap="small" align="center">
                                    <Clock color="black"/>
                                    <Text weight="bold">3. 選擇時段</Text>
                                </Box>
                            </CardHeader>
                            <CardBody pad="medium" align="center" justify="center">
                                {date ? (
                                    <TimeSlotPicker 
                                        selectedDoc={selectedDoc} 
                                        selectedDate={date} 
                                        onTimeSelect={this.onTimeSelect}
                                    />
                                ) : (
                                    <Text color="dark-4" margin="medium">⬅️ 請先在左側選擇預約日期</Text>
                                )}
                            </CardBody>
                        </Card>
                    </Box>
                )}

                {/* 3. 提交 */}
                {time && (
                    <Card background="white" border={{color: 'black', size: 'small'}} animation="fadeIn">
                         <CardHeader pad="medium" background="black">
                            <Box direction="row" gap="small" align="center">
                                <FormCheckmark color="white"/>
                                <Text weight="bold" color="white">4. 填寫就診資訊</Text>
                            </Box>
                        </CardHeader>
                        <CardBody pad="medium" gap="small">
                            <Box 
                                background="light-1" 
                                pad="small" 
                                margin={{bottom:"small"}} 
                                border={{side: 'left', color: 'black', size: 'medium'}}
                            >
                                <Text size="large"><strong>已選預約：</strong> {new Date(date).toLocaleDateString()} 時段 {time}</Text>
                            </Box>
                            
                            <Text size="small" weight="bold">就診原因</Text>
                            <ConcernsTextArea />
                            <Text size="small" weight="bold" margin={{top:"small"}}>具體症狀描述</Text>
                            <SymptomsTextArea />
                            
                            <Box align="center" margin={{ top: 'medium' }}>
                                <Button
                                    label="確認並提交預約"
                                    type="submit"
                                    primary
                                    size="large"
                                    fill="horizontal"
                                    style={{ fontWeight: 'bold' }}
                                />
                            </Box>
                        </CardBody>
                    </Card>
                )}
            </Form>
          </Box>
        </Box>
      </Grommet>
    );
  }
}

export default SchedulingAppt;