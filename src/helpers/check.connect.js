import mongoose from "mongoose";
// count connect
const countConnect = async () => {
    const connections = mongoose.connections.length
    console.log(`Number of mongoose connections: ${connections}`);
};  
// check overload

export default countConnect;
