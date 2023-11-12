from fastapi import WebSocket


class ConnectionManager:
    def __init__(self) -> None:
        self.active_connections: list[WebSocket] = []
        self.rooms = {}
        self.records = {}

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    async def disconnect(self, websocket):
        self.active_connections.remove(websocket)
        record = self.records.get(websocket)
        if not record:
            return
        room = record.get("roomId")
        if not room:
            return
        userId = ""
        index = None
        for i in range(len(self.rooms[room])):
            user = self.rooms[room][i]
            if user["socket"] == websocket:
                userId = user["userId"]
                index = i
                break
        del self.rooms[room][index]
        del self.records[websocket]
        await self.broadcast(
            room, None, {"event": "leave-room", "data": {"userId": userId}}
        )
        print("disconnected froom", self.rooms)

    async def send_json_message(self, websocket: WebSocket, message):
        await websocket.send_json(message)

    async def broadcast(self, roomId, curUser, message):
        for k, v in self.rooms.items():
            if k == roomId:
                for user in v:
                    if user["userId"] != curUser:
                        await user["socket"].send_json(message)
                break

    async def join_room(self, roomId, userId, websocket):
        if not self.rooms.get(roomId):
            self.rooms[roomId] = [{"userId": userId, "socket": websocket}]
        else:
            self.rooms[roomId].append({"userId": userId, "socket": websocket})
        self.records[websocket] = {"roomId": roomId, "userId": userId}
        print(f"user {userId} has joined {self.rooms[roomId]}")
        await self.broadcast(
            roomId, userId, {"event": "join-room", "data": {"userId": userId}}
        )
