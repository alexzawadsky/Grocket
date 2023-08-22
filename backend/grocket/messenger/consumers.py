import json
from datetime import datetime

from channels.generic.websocket import AsyncWebsocketConsumer


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"
        print("connected to", self.room_name, self.room_group_name)
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)

        await self.channel_layer.group_send(
            self.room_group_name, {"type": "chat_message", "data": data}
        )

    async def chat_message(self, event):
        data = event["data"]
        print(data)

        # вот тут надо создавать сообщение!!!

        await self.send(
            text_data=json.dumps(
                {
                    "message": data["message"],
                    "time": datetime.now().isoformat(),
                    "user_id": data["userId"],
                }
            )
        )
