import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import ReportIcon from '@mui/icons-material/Report';
import { toast } from 'react-toastify';
import api from '../../api/axiosInstance';

export const ReportButton = ({ boardType, postId }) => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleReport = async () => {
        try {
            const response = await api.post('/report/post', {
                boardType,
                postId: Number(postId)
            });
            
            setOpen(false);

            if (response.data.isHarmful) {
                // 유해 컨텐츠로 판별된 경우
                toast.error(response.data.message);
                // 게시물 리스트로 이동하고 새로고침
                navigate('/board', { state: { refresh: true } });
            } else {
                // 정상적인 신고 접수
                toast.info(response.data.message, {
                    position: "bottom-center",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    style: {
                        background: '#f8f9fa',
                        color: '#495057',
                        fontSize: '0.9rem',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        minHeight: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }
                });
            }
        } catch (error) {
            console.error('신고 처리 중 오류 발생:', error);
            if (error.response) {
                // 서버에서 응답이 왔지만 에러인 경우
                toast.error(error.response.data.message || '신고 처리 중 오류가 발생했습니다.');
            } else if (error.request) {
                // 요청은 보냈지만 응답을 받지 못한 경우
                toast.error('서버와의 통신에 실패했습니다.');
            } else {
                // 요청 자체를 보내지 못한 경우
                toast.error('신고 처리 중 오류가 발생했습니다.');
            }
            setOpen(false);
        }
    };

    return (
        <>
            <IconButton
                onClick={() => setOpen(true)}
                size="small"
                color="error"
                sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
            >
                <ReportIcon fontSize="small" />
            </IconButton>

            <Dialog 
                open={open} 
                onClose={() => setOpen(false)}
                PaperProps={{
                    style: {
                        borderRadius: '12px',
                        padding: '8px'
                    }
                }}
            >
                <DialogTitle>게시글 신고</DialogTitle>
                <DialogContent>
                    <Typography>
                        이 게시글을 신고하시겠습니까?
                        <br />
                        허위 신고는 제재 대상이 될 수 있습니다.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>취소</Button>
                    <Button onClick={handleReport} color="error" variant="contained">
                        신고하기
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}; 