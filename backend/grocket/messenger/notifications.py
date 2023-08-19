from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

channel_layer = get_channel_layer()

async def send_notification(user_id, notification_data):
    await channel_layer.group_send(
        f"user_notifications_{user_id}",  # User-specific group
        {
            "type": "notify",
            "message": notification_data,
        }
    )
    
# from django.shortcuts import render
# from .notifications import send_notification

# def send_message(request, chat_id):
#     # Process and save the new message
#     # ...

#     # Notify chat members about the new message
#     notification_data = {
#         "type": "message.notification",
#         "chat_id": chat_id,
#         "sender": request.user.username,
#         "content": "New message received",
#     }
    
#     # Send notification to all chat members
#     for member_id in chat_members_ids:
#         if member_id != request.user.id:
#             async_to_sync(send_notification)(member_id, notification_data)
    
#     return render(request, "message_sent.html")
