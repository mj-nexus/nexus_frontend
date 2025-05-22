import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BoardContainer,
    Note,
    GridNote,
    LinedNote,
    TornNote,
    PostcardNote
} from '../../components/Memo/styles';
import { seniorBoardService } from '../../services/seniorBoardService';
import api from '../../api/axiosInstance';

const NOTE_TYPE_MAP = {
    Note,
    GridNote,
    LinedNote,
    TornNote,
    PostcardNote
};

export const SeniorBoard = () => {
    const navigate = useNavigate();
    const [memos, setMemos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [canWrite, setCanWrite] = useState(false);

    // 현재 사용자 정보 가져오기
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) return;
                
                const response = await api.get(`/api/user/getUserById/${userId}`);
                setUserInfo(response.data);
                
                // 사용자의 학번에서 년도 부분 추출
                const studentId = response.data.student_id;
                if (studentId && studentId.length >= 4) {
                    const yearPart = studentId.slice(2, 4); // 학번에서 년도 부분(2자리) 추출
                    const currentYear = new Date().getFullYear() % 100; // 현재 년도의 뒤 2자리
                    
                    // 현재 년도와 학번의 년도가 다를 경우에만 글 작성 가능
                    setCanWrite(Number(yearPart) !== currentYear);
                }
            } catch (error) {
                console.error('사용자 정보를 가져오는 중 오류 발생:', error);
            }
        };
        
        fetchUserInfo();
    }, []);

    useEffect(() => {
        const fetchMemos = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await seniorBoardService.getBoards();
                setMemos(res.data.data || res.data); // data 구조에 따라 조정
            } catch (err) {
                setError('메모를 불러오지 못했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchMemos();
    }, []);

    const handleWriteClick = () => {
        if (!canWrite) {
            alert('현재 학번 년도의 학생은 선배게시판에 글을 작성할 수 없습니다.');
            return;
        }
        navigate('/board/senior/write');
    };

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '16px 0' }}>
                <button
                    style={{
                        padding: '10px 24px',
                        background: canWrite 
                            ? 'linear-gradient(45deg, #0ea300, #7ed321)' 
                            : '#ccc',
                        color: 'white',
                        border: 'none',
                        borderRadius: 12,
                        cursor: canWrite ? 'pointer' : 'not-allowed',
                        fontWeight: 600,
                        fontSize: 16,
                        boxShadow: canWrite ? '0 4px 12px rgba(14, 163, 0, 0.15)' : 'none'
                    }}
                    onClick={handleWriteClick}
                >
                    글쓰기
                </button>
            </div>
            {loading ? (
                <div style={{ textAlign: 'center', padding: 40 }}>로딩 중...</div>
            ) : error ? (
                <div style={{ textAlign: 'center', color: 'red', padding: 40 }}>{error}</div>
            ) : (
                <BoardContainer>
                    {memos.length === 0 ? (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888' }}>게시글이 없습니다.</div>
                    ) : (
                        memos.map(memo => {
                            const MemoComponent = NOTE_TYPE_MAP[memo.note_type] || Note;
                            return (
                                <MemoComponent
                                    key={memo.id}
                                    bgColor={memo.note_color}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/board/senior/${memo.id}`)}
                                >
                                    <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{memo.title}</div>
                                    <div style={{ fontSize: 15, color: '#222', whiteSpace: 'pre-line', overflow: 'hidden', textOverflow: 'ellipsis', maxHeight: 90 }}>{memo.content}</div>
                                    <div style={{ fontSize: 13, color: '#888', marginTop: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {(() => {
                                            const studentId = memo.User?.student_id;
                                            const year = studentId && studentId.length >= 4 ? studentId.slice(2, 4) : null;
                                            const company = memo.User?.Profile?.company || '-';
                                            return (
                                                <span>
                                                    {year ? `${year}학번` : '-'} {memo.writer} {company}
                                                </span>
                                            );
                                        })()}
                                    </div>
                                </MemoComponent>
                            );
                        })
                    )}
                </BoardContainer>
            )}
        </div>
    );
};