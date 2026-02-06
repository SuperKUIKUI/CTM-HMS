var createError = require('http-errors');
var express = require('express');
var path = require('path');
//Logger that was used for debugging, commented later
// var logger = require('morgan');
var mysql = require('mysql');
var cors = require('cors');
var port = 3001

//Connection Info
var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'HMS',
  multipleStatements: true,
  charset: 'utf8mb4' // --- 添加字符集支持中文 ---
});

//Connecting To Database
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected to MySQL");
});

//Variables to keep state info about who is logged in
var email_in_use = "";
var password_in_use = "";
var who = "";

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

//Signup, Login, Password Reset Related Queries

//Checks if patient exists in database
app.get('/checkIfPatientExists', (req, res) => {
  let params = req.query;
  let email = params.email;
  let statement = `SELECT * FROM Patient WHERE email = "${email}"`;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});

//Creates User Account
app.get('/makeAccount', (req, res) => {
  let query = req.query;
  // --- 修改点：病人使用中文姓名格式（姓+名），去掉空格 ---
  let name = query.name;
  let email = query.email;
  let password = query.password;
  let address = query.address;
  let gender = query.gender;
  //增加身高年龄体重
  let age = query.age;
  let height = query.height;
  let weight = query.weight;
  //
  let medications = query.medications;
  let conditions = query.conditions;
  let surgeries = query.surgeries;
  if (medications === undefined) {
    medications = "无"
  }
  if (conditions === undefined) {
    conditions = "无"
  }
  if (!surgeries === undefined) {
    surgeries = "无"
  }
  // --- 修改 SQL 语句，加入 age, height, weight ---
  let sql_statement = `INSERT INTO Patient (email, password, name, address, gender, age, height, weight) 
                       VALUES ("${email}", "${password}", "${name}", "${address}", "${gender}", ${age}, "${height}", "${weight}")`;

  console.log(sql_statement);
  con.query(sql_statement, function (error, results, fields) {
    if (error) throw error;
    else {
      email_in_use = email;
      password_in_use = password;
      who = "pat";
      return res.json({
        data: results
      })
    };
  });
  sql_statement = 'SELECT id FROM MedicalHistory ORDER BY id DESC LIMIT 1;';
  console.log(sql_statement)
  con.query(sql_statement, function (error, results, fields) {
    if (error) throw error;
    else {
      let generated_id = results[0].id + 1;
      let sql_statement = `INSERT INTO MedicalHistory (id, date, conditions, surgeries, medication) 
      VALUES ` + `("${generated_id}", curdate(), "${conditions}", "${surgeries}", "${medications}")`;
      console.log(sql_statement);
      con.query(sql_statement, function (error, results, fields) {
        if (error) throw error;
        else {
          let sql_statement = `INSERT INTO PatientsFillHistory (patient, history) 
          VALUES ` + `("${email}",${generated_id})`;
          console.log(sql_statement);
          con.query(sql_statement, function (error, results, fields) {
            if (error) throw error;
            else { };
          });
        };
      });
    };
  });
});

//Checks If Doctor Exists
app.get('/checkIfDocExists', (req, res) => {
  let params = req.query;
  let email = params.email;
  let statement = `SELECT * FROM Doctor WHERE email = "${email}"`;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});

//Makes Doctor Account
app.get('/makeDocAccount', (req, res) => {
  let params = req.query;
  let name = params.name + " " + params.lastname;
  let email = params.email;
  let password = params.password;
  let gender = params.gender;
  let schedule = params.schedule;
  let sql_statement = `INSERT INTO Doctor (email, gender, password, name) 
                       VALUES ` + `("${email}", "${gender}", "${password}", "${name}")`;
  console.log(sql_statement);
  con.query(sql_statement, function (error, results, fields) {
    if (error) throw error;
    else {
      let sql_statement = `INSERT INTO DocsHaveSchedules (sched, doctor) 
                       VALUES ` + `(${schedule}, "${email}")`;
      console.log(sql_statement);
      con.query(sql_statement, function (error) {
        if (error) throw error;
      })
      email_in_use = email;
      password_in_use = password;
      who = 'doc';
      return res.json({
        data: results
      })
    };
  });
});

// 获取医生统计数据
app.get('/doctorStatistics', (req, res) => {
  const doctorEmail = email_in_use; // 当前登录的医生邮箱

  console.log("=== DEBUG: Statistics Request ===");
  console.log("Current doctor email:", doctorEmail);
  console.log("Current session - email_in_use:", email_in_use);
  console.log("Current session - who:", who);

  if (!doctorEmail) {
    console.log("ERROR: No doctor logged in");
    return res.status(401).json({ 
      error: "No doctor logged in",
      details: "Please login as a doctor first"
    });
  }

  // 查询月度预约统计数据
  const monthlyApptQuery = `SELECT 
  DATE_FORMAT(a.date, '%b') as month,
  COUNT(a.id) as count,
  COUNT(DISTINCT 
    CASE WHEN 
      NOT EXISTS (
        SELECT 1
        FROM PatientsAttendAppointments AS old_psa
        INNER JOIN Diagnose AS old_d ON old_psa.appt = old_d.appt
        WHERE 
          old_psa.patient = psa.patient
          AND old_d.doctor = d.doctor
          AND old_psa.appt < a.id
      ) 
    THEN psa.patient END
  ) as newPatients
  FROM Appointment a
  INNER JOIN PatientsAttendAppointments psa ON a.id = psa.appt
  INNER JOIN Diagnose d ON a.id = d.appt
  WHERE d.doctor = ?
  AND a.date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
  GROUP BY YEAR(a.date), MONTH(a.date), DATE_FORMAT(a.date, '%b')
  ORDER BY YEAR(a.date), MONTH(a.date)`;

  // 查询患者性别分布
  const genderStatsQuery = `SELECT 
  p.gender,
  COUNT(DISTINCT psa.patient) as value
  FROM Patient p
  INNER JOIN PatientsAttendAppointments psa ON p.email = psa.patient
  INNER JOIN Diagnose d ON psa.appt = d.appt
  WHERE d.doctor = ?
  AND p.gender IN ('Male', 'Female', '男', '女') 
  GROUP BY p.gender`;

  console.log("Executing queries for doctor:", doctorEmail);

  con.query(monthlyApptQuery, [doctorEmail], function (error, apptResults, fields) {
    if (error) {
      console.error("Error fetching appointment stats:", error);
      return res.status(500).json({ error: "Database error" });
    }

    console.log("Appointment results:", apptResults);

    // 执行性别分布查询
    con.query(genderStatsQuery, [doctorEmail], function (error, genderResults, fields) {
      if (error) {
        console.error("Error fetching gender stats:", error);
        return res.status(500).json({ error: "Database error" });
      }

      console.log("Gender results:", genderResults);

      // 格式化返回数据以匹配前端期望的结构
      const formattedApptStats = apptResults.map(item => ({
        month: item.month,
        count: item.count,
        newPatients: item.newPatients
      }));

      const formattedGenderStats = genderResults.map(item => ({
        gender: item.gender,
        value: item.value
      }));

      console.log("Final response data:", {
        apptStats: formattedApptStats,
        genderStats: formattedGenderStats
      });

      return res.json({
        apptStats: formattedApptStats,
        genderStats: formattedGenderStats
      });
    });
  });
});

//Checks if patient is logged in
app.get('/checklogin', (req, res) => {
  let params = req.query;
  let email = params.email;
  let password = params.password;
  let sql_statement = `SELECT * FROM Patient 
                       WHERE email="${email}" 
                       AND password="${password}"`;
  console.log(sql_statement);
  con.query(sql_statement, function (error, results, fields) {
    if (error) {
      console.log("error");
      return res.status(500).json({ failed: 'error ocurred' })
    }
    else {
      if (results.length === 0) {
      } else {
        var string = JSON.stringify(results);
        var json = JSON.parse(string);
        email_in_use = email;
        password_in_use = password;
        who = "pat";
      }
      return res.json({
        data: results
      })
    };
  });
});

//Checks if doctor is logged in
app.get('/checkDoclogin', (req, res) => {
  let params = req.query;
  let email = params.email;
  let password = params.password;
  let sql_statement = `SELECT * FROM Doctor
                       WHERE email="${email}" AND password="${password}"`;
  console.log(sql_statement);
  con.query(sql_statement, function (error, results, fields) {
    if (error) {
      console.log("eror");
      return res.status(500).json({ failed: 'error ocurred' })
    }
    else {
      if (results.length === 0) {
      } else {
        var string = JSON.stringify(results);
        var json = JSON.parse(string);
        email_in_use = json[0].email;
        password_in_use = json[0].password;
        who = "doc";
        console.log(email_in_use);
        console.log(password_in_use);
      }
      return res.json({
        data: results
      })
    };
  });
});

//Resets Patient Password
app.post('/resetPasswordPatient', (req, res) => {
  let something = req.query;
  let email = something.email;
  let oldPassword = "" + something.oldPassword;
  let newPassword = "" + something.newPassword;
  let statement = `UPDATE Patient 
                   SET password = "${newPassword}" 
                   WHERE email = "${email}" 
                   AND password = "${oldPassword}";`;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});

//Resets Doctor Password
app.post('/resetPasswordDoctor', (req, res) => {
  let something = req.query;
  let email = something.email;
  let oldPassword = "" + something.oldPassword;
  let newPassword = "" + something.newPassword;
  let statement = `UPDATE Doctor
                   SET password = "${newPassword}" 
                   WHERE email = "${email}" 
                   AND password = "${oldPassword}";`;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});

app.post("/updateDoctorEmail", async (req, res) => {
  const oldEmail = req.query.oldEmail;
  const newEmail = req.query.newEmail;

  try {
    // 检查新邮箱是否被占用
    const [exists] = await db.promise().query(
      "SELECT * FROM Doctor WHERE email = ?",
      [newEmail]
    );
    if (exists.length > 0) {
      return res.json({ success: false, message: "Email already in use." });
    }

    // 更新邮箱
    const [result] = await db.promise().query(
      "UPDATE Doctor SET email = ? WHERE email = ?",
      [newEmail, oldEmail]
    );

    if (result.affectedRows === 0) {
      return res.json({ success: false, message: "Doctor not found." });
    }

    res.json({ success: true, message: "Email updated successfully." });
  } catch (err) {
    console.error("Error updating doctor email:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// Resets Patient Email
app.post('/resetEmailPatient', (req, res) => {
  let something = req.query;
  let oldEmail = something.oldEmail;
  let newEmail = something.newEmail;
  let password = something.password; // 确认身份

  let statement = `UPDATE Patient 
                   SET email = "${newEmail}" 
                   WHERE email = "${oldEmail}" 
                   AND password = "${password}";`;

  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      if (results.affectedRows > 0) {
        email_in_use = newEmail;
      }
      return res.json({
        data: results
      })
    };
  });
});

// Resets Doctor Email
app.post('/resetEmailDoctor', (req, res) => {
  let something = req.query;
  let oldEmail = something.oldEmail;
  let newEmail = something.newEmail;
  let password = something.password;

  let statement = `UPDATE Doctor
                   SET email = "${newEmail}" 
                   WHERE email = "${oldEmail}" 
                   AND password = "${password}";`;

  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      if (results.affectedRows > 0) {
        email_in_use = newEmail;
      }
      return res.json({
        data: results
      })
    };
  });
});


//Returns Who is Logged in
app.get('/userInSession', (req, res) => {
  return res.json({ email: `${email_in_use}`, who: `${who}` });
});

//Logs the person out
app.get('/endSession', (req, res) => {
  console.log("Ending session");
  email_in_use = "";
  password_in_use = "";
});

//Appointment Related

app.get('/getDocScheduleOnDate', (req, res) => {
  const params = req.query;
  const docEmail = params.email;
  const dateStr = params.date;

  // 1. 先查詢當天預約情況
  const apptQuery = `
    SELECT a.starttime 
    FROM Appointment a
    JOIN Diagnose d ON a.id = d.appt
    WHERE d.doctor = "${docEmail}"
    AND a.date = '${dateStr}'
    AND a.status = 'NotDone'
  `;

  con.query(apptQuery, (err, apptRes) => {
    const busySlots = apptRes ? apptRes.map(item => item.starttime) : [];

    // 2. 查詢排班規則
    const sql_date_check = `DAYNAME('${dateStr}')`;
    const scheduleQuery = `
      SELECT s.starttime, s.endtime, s.breaktime, s.is_off 
      FROM DocsHaveSchedules dhs
      JOIN Schedule s ON dhs.sched = s.id
      WHERE dhs.doctor = "${docEmail}" 
      AND s.day = ${sql_date_check}
    `;

    con.query(scheduleQuery, (err, scheduleRes) => {
      // 預設值物件
      let finalSchedule = {
        working: true,     // 預設為上班
        isRestDay: false,  // 預設不是休息日
        start: "09:00:00",
        end: "17:00:00",
        break: "12:00:00",
        busy: busySlots
      };

      if (err) {
        console.error("Query error, using defaults.");
      } else if (scheduleRes.length > 0) {
        // 如果資料庫有設定
        if (scheduleRes[0].is_off === 1) {
          // --- 重點：如果標記為休息，設定為休診 ---
          finalSchedule.working = false;
          finalSchedule.isRestDay = true;
        } else {
          // 如果沒休息，則使用資料庫設定的時間
          finalSchedule.start = scheduleRes[0].starttime;
          finalSchedule.end = scheduleRes[0].endtime;
          finalSchedule.break = scheduleRes[0].breaktime;
        }
      } else {
        // --- 重點：資料庫完全沒資料，執行你的要求「預設 9-17」 ---
        console.log("No DB record, using system defaults 09:00-17:00");
      }

      return res.json(finalSchedule);
    });
  });
});

//Checks If a similar appointment exists to avoid a clash
app.get('/checkIfApptExists', (req, res) => {
  const params = req.query;
  const email = params.email;
  const doc_email = params.docEmail;
  const startTime = params.startTime;
  const date = params.date;

  // 格式化日期
  const dateObj = new Date(date);
  const day = String(dateObj.getDate()).padStart(2, '0'); // 补0为2位（如 6→06）
  const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需+1（如 10→11）
  const year = dateObj.getFullYear();
  const ndate = `${day}/${month}/${year}`; // 最终格式：dd/mm/yyyy

  // 保持 SQL 格式符不变（依然是 %d/%m/%Y）
  const sql_date = `STR_TO_DATE('${ndate}', '%d/%m/%Y')`;
  const sql_start = `CONVERT('${startTime}', TIME)`;

  console.log("🩺 Checking appointment clash for:");
  console.log({
    email,
    doc_email,
    startTime,
    date,
    sql_date,
    sql_start
  });

  let cond1 = [], cond2 = [], cond3 = [];

  // ① 检查用户自己是否已有同时间的预约
  let statement1 = `
    SELECT * FROM PatientsAttendAppointments pa
    INNER JOIN Appointment a ON pa.appt = a.id
    WHERE pa.patient = "${email}"
    AND a.date = ${sql_date}
    AND a.starttime = ${sql_start};
  `;
  console.log("SQL#1:", statement1);

  con.query(statement1, function (error, results1) {
    if (error) {
      console.error("❌ SQL#1 Error:", error);
      return res.status(500).json({ error: "Database error 1" });
    }
    cond1 = results1;

    // ② 检查该医生在同时间是否已有未完成预约
    let statement2 = `
      SELECT * FROM Diagnose d
      INNER JOIN Appointment a ON d.appt = a.id
      WHERE d.doctor = "${doc_email}"
      AND a.date = ${sql_date}
      AND a.status = "NotDone"
      AND ${sql_start} >= a.starttime
      AND ${sql_start} < a.endtime;
    `;
    console.log("SQL#2:", statement2);

    con.query(statement2, function (error, results2) {
      if (error) {
        console.error("❌ SQL#2 Error:", error);
        return res.status(500).json({ error: "Database error 2" });
      }
      cond2 = results2;

      // ③ 检查医生是否在该时间不在排班表（休息或非工作时段）
      let statement3 = `
  SELECT s.id FROM DocsHaveSchedules dhs
  INNER JOIN Schedule s ON dhs.sched = s.id
  WHERE dhs.doctor = "${doc_email}"
  AND s.day = DAYNAME(${sql_date})
  AND (
    ${sql_start} < s.starttime 
    OR ${sql_start} >= s.endtime
    OR (${sql_start} >= s.breaktime AND ${sql_start} < DATE_ADD(s.breaktime, INTERVAL 1 HOUR))
  );
`;
      console.log("SQL#3 (Check Inaccessibility):", statement3);

      con.query(statement3, function (error, results3) {
        if (error) {
          console.error("❌ SQL#3 Error:", error);
          return res.status(500).json({ error: "Database error 3" });
        }
        if (results3.length) {
          cond3 = [1]; // 医生不在班
        } else {
          cond3 = []; // 医生在班
        }

        const all = cond1.concat(cond2, cond3);

        console.log("✅ cond1:", cond1.length, "cond2:", cond2.length, "cond3:", cond3.length);
        console.log("Final merged length:", all.length);

        return res.json({ data: all });
      });
    });
  });
});

//Returns Date/Time of Appointment
app.get('/getDateTimeOfAppt', (req, res) => {
  let tmp = req.query;
  let id = tmp.id;
  let statement = `SELECT starttime as start, 
                          endtime as end, 
                          date as theDate 
                   FROM Appointment 
                   WHERE id = "${id}"`;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      console.log(JSON.stringify(results));
      return res.json({
        data: results
      })
    };
  });
});

//Patient Info Related

//to get all doctor names
app.get('/docInfo', (req, res) => {
  let statement = 'SELECT * FROM Doctor';
  // console.log(statement); // 注释掉，避免刷屏
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});

//To return a particular patient history
app.get('/OneHistory', (req, res) => {
  let params = req.query;
  let email = params.patientEmail;
  let statement = `SELECT gender,name,email,address,conditions,surgeries,medication
                    FROM PatientsFillHistory,Patient,MedicalHistory
                    WHERE PatientsFillHistory.history=id
                    AND patient=email AND email = ` + email;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    }
  })
});

//To show all patients whose medical history can be accessed
app.get('/MedHistView', (req, res) => {
  let params = req.query;
  let patientName = "'%" + params.name + "%'";
  let secondParamTest = "" + params.variable;
  let statement = `SELECT name AS 'Name',
                    PatientsFillHistory.history AS 'ID',
                    email FROM Patient,PatientsFillHistory
                    WHERE Patient.email = PatientsFillHistory.patient
                    AND Patient.email IN (SELECT patient from PatientsAttendAppointments 
                    NATURAL JOIN Diagnose WHERE doctor="${email_in_use}")`;
  if (patientName != "''")
    statement += " AND Patient.name LIKE " + patientName
  console.log(statement)
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});

//Returns Appointment Info To patient logged In
app.get('/patientViewAppt', (req, res) => {
  let tmp = req.query;
  let email = tmp.email;
  let statement = `SELECT PatientsAttendAppointments.appt as ID,
                  PatientsAttendAppointments.patient as user, 
                  PatientsAttendAppointments.concerns as theConcerns, 
                  PatientsAttendAppointments.symptoms as theSymptoms, 
                  Appointment.date as theDate,
                  Appointment.starttime as theStart,
                  Appointment.endtime as theEnd,
                  Appointment.status as status
                  FROM PatientsAttendAppointments, Appointment
                  WHERE PatientsAttendAppointments.patient = "${email}" AND
                  PatientsAttendAppointments.appt = Appointment.id`;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});

//Checks if history exists
app.get('/checkIfHistory', (req, res) => {
  let params = req.query;
  let email = params.email;
  let statement = "SELECT patient FROM PatientsFillHistory WHERE patient = " + email;
  console.log(statement)
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});

//Adds to PatientsAttendAppointment Table
app.get('/addToPatientSeeAppt', (req, res) => {
  let params = req.query;
  let email = params.email;
  let appt_id = params.id;
  let concerns = params.concerns;
  let symptoms = params.symptoms;
  let sql_try = `INSERT INTO PatientsAttendAppointments (patient, appt, concerns, symptoms) 
                 VALUES ("${email}", ${appt_id}, "${concerns}", "${symptoms}")`;
  console.log(sql_try);
  con.query(sql_try, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    }
  });

});

//Schedules Appointment
app.get('/schedule', (req, res) => {
  let params = req.query;
  let time = params.time;
  let date = params.date;
  let id = params.id;
  let endtime = params.endTime;
  let concerns = params.concerns;
  let symptoms = params.symptoms;
  let doctor = params.doc;
  const dateObj = new Date(date);
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  const ndate = `${day}/${month}/${year}`; // 最终格式：dd/mm/yyyy

  let sql_date = `STR_TO_DATE('${ndate}', '%d/%m/%Y')`;
  //sql to turn string to sql time obj
  let sql_start = `CONVERT('${time}', TIME)`;
  //sql to turn string to sql time obj
  let sql_end = `CONVERT('${endtime}', TIME)`;
  let sql_try = `INSERT INTO Appointment (id, date, starttime, endtime, status) 
                 VALUES (${id}, ${sql_date}, ${sql_start}, ${sql_end}, "NotDone")`;
  console.log(sql_try);
  con.query(sql_try, function (error, results, fields) {
    if (error) throw error;
    else {
      let sql_try = `INSERT INTO Diagnose (appt, doctor, diagnosis, prescription) 
                 VALUES (${id}, "${doctor}", "Not Yet Diagnosed" , "Not Yet Diagnosed")`;
      console.log(sql_try);
      con.query(sql_try, function (error, results, fields) {
        if (error) throw error;
        else {
          return res.json({
            data: results
          })
        }
      });
    }
  });
});

//Generates ID for appointment
app.get('/genApptUID', (req, res) => {
  let statement = 'SELECT id FROM Appointment ORDER BY id DESC LIMIT 1;'
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      let generated_id = results[0].id + 1;
      return res.json({ id: `${generated_id}` });
    };
  });
});

//To fill diagnoses
app.get('/diagnose', (req, res) => {
  let params = req.query;
  let id = params.id;
  let diagnosis = params.diagnosis;
  let prescription = params.prescription;
  let statement = `UPDATE Diagnose SET diagnosis="${diagnosis}", prescription="${prescription}" WHERE appt=${id};`;
  console.log(statement)
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      let statement = `UPDATE Appointment SET status="Done" WHERE id=${id};`;
      console.log(statement)
      con.query(statement, function (error, results, fields) {
        if (error) throw error;
        res.send({ success: true });
      })
    };
  });
});

//To show diagnoses
app.get('/showDiagnoses', (req, res) => {
  let id = req.query.id;
  let statement = `SELECT * FROM Diagnose WHERE appt=${id}`;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});

//To show appointments to doctor
app.get('/doctorViewAppt', (req, res) => {
  let a = req.query;
  let email = a.email;
  let statement = `SELECT a.id,a.date, a.starttime, a.status, p.name, psa.concerns, psa.symptoms
  FROM Appointment a, PatientsAttendAppointments psa, Patient p
  WHERE a.id = psa.appt AND psa.patient = p.email
  AND a.id IN (SELECT appt FROM Diagnose WHERE doctor="${email_in_use}")`;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});

//To show diagnoses to patient
app.get('/showDiagnoses', (req, res) => {
  let id = req.query.id;
  let statement = `SELECT * FROM Diagnose WHERE appt=${id}`;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});

//To Show all diagnosed appointments till now(对于一天历史的查询)
app.get('/allDiagnoses', (req, res) => {
  let params = req.query;
  let email = params.patientEmail;
  let statement = `SELECT A.date, D.name AS doctor, B.concerns, B.symptoms, B.diagnosis, B.prescription FROM 
Appointment A 
INNER JOIN (SELECT * from PatientsAttendAppointments NATURAL JOIN Diagnose WHERE patient=${email}) AS B 
ON A.id = B.appt
INNER JOIN Doctor D ON B.doctor = D.email;`
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});


app.get('/allDrugs', (req, res) => {
    console.log("--- [DEBUG] 收到前端请求，尝试查询 ---");

    // 增加一个简易的超时保护，防止请求永远挂起
    const timeout = setTimeout(() => {
        console.error("❌ 数据库查询超时（10秒未响应）");
        if (!res.headersSent) res.status(504).json({ error: "数据库响应超时" });
    }, 10000);

    const sql = "SELECT * FROM medications";
    
    con.query(sql, (err, results) => {
        clearTimeout(timeout); // 得到结果后清除超时定时器

        if (err) {
            console.error("❌ SQL报错内容:", err);
            return res.status(500).json({ error: err.message });
        }

        console.log("✅ 查询成功，数据行数:", results.length);
        //console.log("数据详情:", results); 

        res.json({ data: results });
    });
});



//To delete appointment
app.get('/deleteAppt', (req, res) => {
  let a = req.query;
  let uid = a.uid;
  let statement = `SELECT status FROM Appointment WHERE id=${uid};`;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      results = results[0].status
      if (results == "NotDone") {
        statement = `DELETE FROM Appointment WHERE id=${uid};`;
        console.log(statement);
        con.query(statement, function (error, results, fields) {
          if (error) throw error;
        });
      }
      else {
        console.log("Attempt to delete completed appointment blocked.");
      }
    };
  });
  return;
});

// If 404, forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {
  console.log(`Listening on port ${port} `);
});

module.exports = app;