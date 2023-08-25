from channels.layers import get_channel_layer

channel_layer = get_channel_layer()


async def send_notification(user_id: int, notification_data: dict, action: str):
    await channel_layer.group_send(
        f"user_notifications_{user_id}",
        {
            "action": action,
            "type": "notify",
            "data": notification_data,
        },
    )
