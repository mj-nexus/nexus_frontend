const axios = require('axios');

const test = async () => {
    const updateData = {
        "nick_name": "ttest",
    }
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHVkZW50X2lkIjoiMjAyNTUwNTYwMCIsImlhdCI6MTc0NzkwODY5MiwiZXhwIjoxNzQ3OTEyMjkyfQ.btrxgpSm8CorSMMa5V4F8EjqMLEKw-F9kw2BlAh2DRU'
    
    try {
        const res = await axios.patch(`http://localhost:5001/api/user/updateUser/2`, updateData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        console.log(res.data);
    } catch (err) {
        console.error('에러 발생:', err.response ? err.response.data : err.message);
    }
}

test(); 