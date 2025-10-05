const onlineClients = new Map(); // userId -> socketId
const onlineDoctors=new Map();

const activeSessions = new Map();  

module.exports = {onlineClients,onlineDoctors,activeSessions}
