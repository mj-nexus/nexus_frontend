const writerCheck = (id) => {
    const userId = localStorage.getItem('userId');
    return String(id) === userId;
}

export default writerCheck;
