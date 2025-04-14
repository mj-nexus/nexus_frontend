import axios from "axios";

export const getBoards = async () => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/board`);
        return response.data;
    }
    catch (err) {
        throw err;
    }
}

export const getBoard = async (boardId) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/board/${boardId}`);
        return response.data;
    }
    catch (err) {
        throw err;
    }
}

export const createBoard = async (board) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/board/`, board);
        return response.data;
    }
    catch (err) {
        throw err;
    }
}