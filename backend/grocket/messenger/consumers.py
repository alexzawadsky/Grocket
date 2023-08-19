from channels.generic.websocket import AsyncWebsocketConsumer
import json
from asgiref.sync import async_to_sync
from .notifications import send_notification

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Authenticate the user
        await self.accept()
        await self.send(text_data="connected")
        # Add the user to a user-specific group
        # user_id = self.scope['user'].id
        user_id = 2
        await self.channel_layer.group_add(
            f"user_notifications_{user_id}",  # User-specific group
            self.channel_name
        )
        await send_notification(2, "test notification")


    async def disconnect(self, close_code):
        # Remove the user from the user-specific group
        user_id = self.scope['user'].id
        await self.channel_layer.group_discard(
            f"user_notifications_{user_id}",  # User-specific group
            self.channel_name
        )

    async def notify(self, event):
        # Send a notification to the user
        await self.send(text_data=json.dumps(event))

