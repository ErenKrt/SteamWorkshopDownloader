import { Server, Socket }  from 'socket.io';

export class WebSocket{
    private server: Server;
    // SessionHOLDER
    private sessions: any[];

    constructor(srv){

        this.server= new Server(srv,{
            cors:{
                origin: "*"
            }
        });
        
        this.server.on("connection",this.connection)
    }

    connection(client : Socket){
        console.log("Connected: "+client.id);

        client.on("disconnect",()=>{
            console.log("Disconnect: "+ client.id);
        });

    }
}