import json
from channels.generic.websocket import AsyncWebsocketConsumer


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        if self.user.is_anonymous:
            await self.close()
        else:
            self.group_name = f"notifications_{self.user.id}"
            await self.channel_layer.group_add(self.group_name, self.channel)
            await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(self.group_name, self.channel)

    async def receive(self, text_data):
        pass

    async def send_notification(self, event):
        await self.send(text_data=json.dumps({
            "type": "notification",
            "title": event["title"],
            "message": event["message"],
            "notification_type": event.get("notification_type", ""),
            "link": event.get("link", ""),
        }))
