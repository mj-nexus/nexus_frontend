import React from "react";
import styles from "./TimeTable.module.scss";

const TimeTable = ({ onClassSelect }) => {
  // 요일 및 시간 데이터 - 1시간 단위로 수정
  const days = ["월", "화", "수", "목", "금"];
  const timeSlots = [
    "09:00~10:00", 
    "10:00~11:00", 
    "11:00~12:00", 
    "12:00~13:00", 
    "13:00~14:00", 
    "14:00~15:00", 
    "15:00~16:00", 
    "16:00~17:00"
  ];
  
  // 강의 데이터 - 과목명 간략화
  const classes = [
    {
      id: 1,
      name: "캡스톤",
      shortName: "캡스톤",
      fullName: "캡스톤디자인Ⅰ",
      professor: "김성진",
      days: ["월"],
      startTime: "09:00~10:00",
      endTime: "11:00~12:00",
      location: "공학관 815호",
      code: "101반",
      color: "#E8F4FD",
      credits: 3,
      email: "tonyksj@naver.com",
      description: "학과의 특성화 분야 등의 전공 관련 프로젝트를 팀별로 수행하도록 하며, 프로젝트 수행 전반의 과정을 지도하여 학생들이 경험하고 목표를 달성할 수 있도록 한다."
    },
    {
      id: 2,
      name: "컴비전",
      shortName: "컴비전",
      fullName: "컴퓨터비전",
      professor: "백재순",
      days: ["화"],
      startTime: "09:00~10:00",
      endTime: "11:00~12:00",
      location: "사회교육관 1층",
      code: "101반",
      color: "#EDF9F1",
      credits: 3,
      email: "taijimind@gmail.com",
      description: "본 교과는 학과 전공 수업을 통하여 익힌 전공지식과 기술을 활용하며 본 교과는 2학기까지 운영하는 1년 과정으로써 프로젝트 개발의 전 과정을 팀 다위로 수행한다. 캡스톤디자인 과제와 병행하여 학생들의 작품 제작 및 유연한 사고를 기르는 과목이다."
    },
    {
      id: 3,
      name: "C언어",
      shortName: "C언어",
      fullName: "C언어Ⅰ",
      professor: "윤영현",
      days: ["수"],
      startTime: "09:00~10:00",
      endTime: "11:00~12:00",
      location: "사회교육관 1층",
      code: "101반",
      color: "#F5EFFD",
      credits: 3,
      email: "yhyoon2@hotmail.com",
      description: "컴퓨터 프로그래밍 언어 기본과 C언어 기본 문법을 활용하여 심화된 C언어 프로그래밍 능력을 배양하기 위해 포인터, 구조체 등을 활용하여 자료구조를 구현할 수 있도록 학습한다."
    },
    {
      id: 4,
      name: "파이썬",
      shortName: "파이썬",
      fullName: "파이썬프로그래밍",
      professor: "백재순",
      days: ["목"],
      startTime: "09:00~10:00",
      endTime: "11:00~12:00",
      location: "사회교육관 1층",
      code: "101반",
      color: "#FDEEEF",
      credits: 3,
      email: "taijimind@gmail.com",
      description: "개인별 Presentation과 인공지능 시스템개발환경을 이해하고 인공지능 개발언어인 Python 실습을 심도있게 병행하고, 담당 교수의 보충 설명 및 강의를 통해 인공지능 로직에 대한 이해도를 높여 해당 AI Theme에 대해 명확하게 설명할 수 있는 능력을 갖추도록 지도한다."
    },
    {
      id: 5,
      name: "자연어",
      shortName: "자연어",
      fullName: "자연어처리",
      professor: "백재순",
      days: ["금"],
      startTime: "09:00~10:00",
      endTime: "11:00~12:00",
      location: "공학관 815호",
      code: "101반",
      color: "#FFF5E6",
      credits: 3,
      email: "taijimind@gmail.com",
      description: "자연어처리 분야에서 중요한 주제 및 모델들을 대한 이해를 갖추어 다양한 자연어처리 모델의 작동 원리를 이해하고 주요 이론들을 활용하여 자연어 데이터를 처리하는 기술을 습득한다."
    },
    {
      id: 6,
      name: "알고리즘",
      shortName: "알고리즘",
      fullName: "알고리즘",
      professor: "김대진",
      days: ["월"],
      startTime: "13:00~14:00",
      endTime: "15:00~16:00",
      location: "공815",
      code: "101반",
      color: "#E8F4FD",
      credits: 3,
      email: "algorithm@cyber.ac.kr",
      phone: "02-1234-5683",
      office: "공학관 606호",
      description: "알고리즘의 설계와 분석 방법을 배웁니다. 시간 및 공간 복잡도, 다양한 알고리즘 패러다임을 학습합니다."
    },
    {
      id: 7,
      name: "DB",
      shortName: "DB",
      fullName: "데이터베이스",
      professor: "오경조",
      days: ["화"],
      startTime: "13:00~14:00",
      endTime: "15:00~16:00",
      location: "공학관 815호",
      code: "101반",
      color: "#EDF9F1",
      credits: 3,
      description: "응용소프트웨어 개발의 현황과 최신 기술 트렌드를 반영한 교육을 실시함으로써 데이터베이스 분야에 이론과 실무를 겸비한 전문화된 소프트웨어 개발 인력 양성을 목표로 한다."
    },
    {
      id: 8,
      name: "협상",
      shortName: "협상",
      fullName: "문제해결(협력기반의성과협력)",
      professor: "서장석",
      days: ["목"],
      startTime: "13:00~14:00",
      endTime: "14:00~15:00",
      location: "사회교육관 401호",
      code: "101반",
      color: "#FDEEEF",
      credits: 3,
      email: "raels72@gmail.com",
      description: "문제해결’은 현상과 목표를 분석하고, 이 분석 결과를 토대로 최적의 해결책을 찾아 실행, 평가해 가는 활동을 의미한다. 학습자의 일상 및 직장생활에서 직면할 수 있는 많은 문제와 이를 해결하는 과정에서 창의적, 논리적, 비판적 사고에 기반한 협상 능력을 발휘할 수 있는 훈련을 한다."
    },
    {
      id: 9,
      name: "채플",
      shortName: "채플",
      fullName: "인성채플",
      professor: "이수광",
      days: ["금"],
      startTime: "13:00~14:00",
      endTime: "13:00~14:00",
      location: "컨퍼런스홀",
      code: "108반",
      color: "#FFF5E6",
      credits: 3,
      email: "narrowgate@mjc.ac.kr",
      description: "본 교과목은 기독교적 인격과 교양을 갖추도록 하는 대학교육목표에 부응하도록 운영한다. 21세기 전문분야의 리더가 될 학생들에게 시대가 요청하는 자신과 자신의 관계, 자신과 이웃의 관계, 자신과 자연의 관계, 자신과 하나님의 관계를 토대로 의사소통 및 대인관계 능력과 문제해결 및 자기개발능력을 향상하는 데 수업의 목적이 있다. 이를 위해 본 수업의 목표는 학생들로 하여금 각자의 리더십의 상을 발굴하고 참된 인성 함양과 이 시대의 대학생들에게 요청되는 직업기초 및 기초학습능력 향상을 도모하고 지적 소양과 창의력을 증대시킬 수 있도록 기독교의 핵심 진리와 보편적인 삶의 지식을 다양한 방식(설교, 시청각 자료를 포함한 설교 등)으로 소개하여 실천할 수 있도록 돕는 데 그 목표가 있다."
    }
  ];
  
  // 특정 시간과 요일에 해당하는 수업 찾기
  const getClassForTimeAndDay = (time, day) => {
    return classes.find(cls => {
      const timeIndex = timeSlots.indexOf(time);
      const startTimeIndex = timeSlots.indexOf(cls.startTime);
      const endTimeIndex = timeSlots.indexOf(cls.endTime);
      
      // 시작 또는 종료 시간이 timeSlots에 없는 경우 처리
      if (startTimeIndex === -1 || endTimeIndex === -1) {
        console.error(`Invalid time range for class: ${cls.name}`, cls.startTime, cls.endTime);
        return false;
      }
      
      return cls.days.includes(day) && 
             timeIndex >= startTimeIndex && 
             timeIndex <= endTimeIndex;
    });
  };
  
  // 수업 셀의 범위 확인 (병합된 셀의 시작인지)
  const isClassStart = (time, day) => {
    const classItem = getClassForTimeAndDay(time, day);
    return classItem && classItem.startTime === time;
  };
  
  // 수업 셀의 범위 계산 (rowspan)
  const getClassRowSpan = (classItem) => {
    if (!classItem) return 1;
    const startIndex = timeSlots.indexOf(classItem.startTime);
    const endIndex = timeSlots.indexOf(classItem.endTime);
    
    if (startIndex === -1 || endIndex === -1) {
      console.error("Invalid time range for rowspan calculation", classItem.startTime, classItem.endTime);
      return 1;
    }
    
    return endIndex - startIndex + 1;
  };
  
  // 수업 클릭 핸들러
  const handleClassClick = (classItem) => {
    if (classItem && onClassSelect) {
      onClassSelect({
        ...classItem,
        name: classItem.fullName, // 모달에는 전체 이름 표시
        schedule: `${classItem.startTime.split('~')[0]} - ${classItem.endTime.split('~')[1]} (${classItem.days.join(', ')}요일)`
      });
    }
  };
  
  // 디버깅 정보 출력
  console.log("Time slots:", timeSlots);
  classes.forEach(cls => {
    console.log(`Class: ${cls.name}, Start: ${cls.startTime} (index: ${timeSlots.indexOf(cls.startTime)}), End: ${cls.endTime} (index: ${timeSlots.indexOf(cls.endTime)})`);
  });
  
  return (
    <div className={styles.timetableContainer}>
      <div className={styles.semesterHeader}>
        <h3>학과: AI빅데이터학과 1학년</h3>
        <span className={styles.credits}>24학점</span>
      </div>
      
      <table className={styles.timetable}>
        <thead>
          <tr>
            <th className={styles.timeHeader}></th>
            {days.map(day => (
              <th key={day} className={styles.dayHeader}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((time, timeIndex) => (
            <tr key={time} className={styles.timeRow}>
              <td className={styles.timeCell}>{time}</td>
              {days.map(day => {
                const classItem = getClassForTimeAndDay(time, day);
                
                // 이 셀이 수업의 시작인 경우만 렌더링
                if (isClassStart(time, day)) {
                  const rowSpan = getClassRowSpan(classItem);
                  
                  return (
                    <td 
                      key={`${day}-${time}`}
                      className={`${styles.classCell} ${classItem ? styles.hasClass : ''}`}
                      rowSpan={rowSpan}
                      style={{ backgroundColor: classItem ? classItem.color : 'transparent' }}
                      onClick={() => handleClassClick(classItem)}
                    >
                      {classItem && (
                        <div className={styles.classContent}>
                          <div className={styles.className}>{classItem.name}</div>
                        </div>
                      )}
                    </td>
                  );
                } else if (!getClassForTimeAndDay(time, day)) {
                  // 수업이 없는 경우에만 빈 셀 렌더링
                  return <td key={`${day}-${time}`} className={styles.emptyCell}></td>;
                }
                
                // 이미 다른 rowspan에 포함된 셀은 렌더링하지 않음
                return null;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimeTable; 