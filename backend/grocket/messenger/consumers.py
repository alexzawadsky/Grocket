import json
from channels.generic.websocket import AsyncWebsocketConsumer


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Authenticate the user
        await self.accept()
        await self.send(text_data="connected")
        # Add the user to a user-specific group
        print("before")
        user_id = self.scope["user"].id
        print("after")
        await self.channel_layer.group_add(
            f"user_notifications_{user_id}", self.channel_name  # User-specific group
        )

    async def disconnect(self, close_code):
        # Remove the user from the user-specific group
        user_id = self.scope["user"].id
        await self.channel_layer.group_discard(
            f"user_notifications_{user_id}", self.channel_name  # User-specific group
        )

    async def notify(self, event):
        # Send a notification to the user
        await self.send(text_data=json.dumps(event))
