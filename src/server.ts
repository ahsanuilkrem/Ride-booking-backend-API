
import { Server} from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./config/env";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
let server : Server;



const startServer = async () => {
   try {
  
     await mongoose.connect(envVars.DB_URL)

          console.log("Connected to Db Ride Booking api");
    server = app.listen(envVars.PORT, ()=>{
        console.log(`server is lisstening to prot ${envVars.PORT}`);
    });
   } catch (error) {
    console.log(error)
   }


}

 startServer()
   
