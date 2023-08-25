import json

from channels.generic.websocket import AsyncWebsocketConsumer


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        await self.send(text_data="connected")
        room_name = self.scope["url_route"]["kwargs"]["room_name"]
        await self.channel_layer.group_add(
            f"user_notifications_{room_name}", self.channel_name  # User-specific group
        )

    async def disconnect(self, close_code):
        # Remove the user from the user-specific group
        room_name = self.scope["url_route"]["kwargs"]["room_name"]
        await self.channel_layer.group_discard(
            f"user_notifications_{room_name}", self.channel_name  # User-specific group
        )

    async def notify(self, event):
        await self.send(text_data=json.dumps(event))
