import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'

@WebSocketGateway(8082, { cors: '*' })
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server: Server;

  connections = {};

  handleDisconnect(client: Socket) {
    // console.log({ clientInHandleDisconnect: client });
    console.log('handleDisconnect: ' + client.id);

  }

  handleConnection(client: Socket, ..._args: any[]) {
    // console.log({ clientInHandleConnection: client });
    this.connections[client.id] = client.id;

    console.log('handleConnection: ' + client.id);
  }

  afterInit(server: Server) {
    // console.log({ serverInAfterInit: server });
    console.log('afterInit');

  }

  @SubscribeMessage('events')
  handleEvent(client: Socket, data: string): string {
    // client.emit('game-state', this.connections);
    console.log('events');
    this.server.emit('game-state', this.connections);
    return data;
  }
}

