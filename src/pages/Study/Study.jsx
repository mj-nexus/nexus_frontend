import React, { useState } from "react";
import styles from "./Study.module.scss";
import { FaEnvelope, FaBuilding, FaPhone, FaRegTimesCircle, FaPlus, FaTrash, FaCheck } from "react-icons/fa";
import TimeTable from "../../components/TimeTable/TimeTable";

// ToDoList 컴포넌트 (localStorage 연동)
const StudyTodoList = () => {
  const STORAGE_KEY = 'study_todolist';
  const [todos, setTodos] = React.useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = React.useState("");

  // 저장
  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!input.trim()) return;
    // 중복 추가 방지: 직전 입력값과 동일하면 추가하지 않음
    setTodos(prev => {
      if (prev.length > 0 && prev[0].text === input.trim()) return prev;
      return [{ text: input.trim(), done: false, id: Date.now() }, ...prev];
    });
    setInput("");
  };
  const toggleTodo = (id) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, done: !todo.done } : todo));
  };
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div style={{ marginTop: 32, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 24, maxWidth: 500 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>오늘의 할 일</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="할 일을 입력하세요"
          style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #eee' }}
          onKeyDown={e => {
            // 한글 조합 중 엔터 입력은 무시
            if (e.nativeEvent.isComposing) return;
            if (e.key === 'Enter' && input.trim()) {
              e.preventDefault();
              addTodo();
            }
          }}
        />
        <button onClick={addTodo} style={{ background: '#0ea300', color: '#fff', border: 'none', borderRadius: 6, padding: '0 16px', fontSize: 16, cursor: 'pointer' }}>
          <FaPlus />
        </button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {todos.length === 0 && <li style={{ color: '#aaa', fontSize: 15 }}>할 일이 없습니다.</li>}
        {todos.map(todo => (
          <li key={todo.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #f3f3f3' }}>
            <button onClick={() => toggleTodo(todo.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: todo.done ? '#0ea300' : '#bbb', fontSize: 18 }}>
              <FaCheck />
            </button>
            <span style={{ flex: 1, textDecoration: todo.done ? 'line-through' : 'none', color: todo.done ? '#aaa' : '#222', fontSize: 16 }}>{todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)} style={{ background: 'none', border: 'none', color: '#e74c3c', fontSize: 16, cursor: 'pointer' }}>
              <FaTrash />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Study = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  
  // 강의 상세 정보를 닫는 함수
  const closeClassDetails = () => {
    setSelectedClass(null);
  };

  // TimeTable 컴포넌트에서 강의 선택 시 호출될 함수
  const handleClassSelect = (classInfo) => {
    setSelectedClass(classInfo);
  };

  return (
    <div className={styles.studyContainer}>
      <div className={styles.pageHeader}>
        <h1>학습 관리</h1>
        <p>시간표와 수업 정보를 확인하세요.</p>
      </div>
      
      <div className={styles.studyContent}>
        <div className={styles.timetableSection}>
          <div className={styles.timetableCard}>
            <div className={styles.cardHeader}>
              <h2>내 시간표</h2>
            </div>
            <div className={styles.timetableWrapper}>
              <TimeTable onClassSelect={handleClassSelect} />
            </div>
          </div>
          {/* 시간표 아래에 ToDoList 추가 */}
          <StudyTodoList />
        </div>
      </div>
      
      {/* 강의 상세 정보 모달 */}
      {selectedClass && (
        <div className={styles.classDetailsModal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>{selectedClass.name}</h3>
              <button className={styles.closeButton} onClick={closeClassDetails}>
                <FaRegTimesCircle />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.classInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>교수명:</span>
                  <span className={styles.infoValue}>{selectedClass.professor}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>강의실:</span>
                  <span className={styles.infoValue}>{selectedClass.location}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>학점:</span>
                  <span className={styles.infoValue}>{selectedClass.credits}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>강의 시간:</span>
                  <span className={styles.infoValue}>{selectedClass.schedule}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>강의 번호:</span>
                  <span className={styles.infoValue}>{selectedClass.code}</span>
                </div>
              </div>
              
              <div className={styles.professorContact}>
                <h4>교수 연락처</h4>
                <div className={styles.contactItem}>
                  <FaEnvelope className={styles.contactIcon} />
                  <span>{selectedClass.email || 'professor@example.ac.kr'}</span>
                </div>
                <div className={styles.contactItem}>
                  <FaPhone className={styles.contactIcon} />
                  <span>{selectedClass.phone || '미제공'}</span>
                </div>
                <div className={styles.contactItem}>
                  <FaBuilding className={styles.contactIcon} />
                  <span>{selectedClass.office || '미제공'}</span>
                </div>
              </div>
              
              <div className={styles.classSyllabus}>
                <h4>강의 계획</h4>
                <p>{selectedClass.description || '강의 계획서가 아직 업로드되지 않았습니다.'}</p>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.syllabusButton}>강의계획서 다운로드</button>
              <button className={styles.contactButton}>교수님께 이메일 보내기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Study; 