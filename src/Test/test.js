const axios = require("axios");

const test = async () => {
    const res = await axios.patch(`localhost:5001/api/messages/room-info/2`,{"nick_name":"ttest"});
    console.log(res);
}

test();