import json
from channels.generic.websocket import AsyncWebsocketConsumer

class MesaConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.mesa_id = self.scope['url_route']['kwargs']['mesa_id']
        self.group_name = f'mesa_{self.mesa_id}'

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()
        print(f"[WS] Cliente conectado a {self.group_name}")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )
        print(f"[WS] Cliente desconectado de {self.group_name}")

    async def receive(self, text_data):
        print(f"[WS] Mensaje recibido del cliente: {text_data}")
        data = json.loads(text_data)
        tipo = data.get("type")

        if tipo == "habilitar_papeleta":
            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "papeleta_habilitada",
                    "message": data.get("message", ""),
                }
            )
        elif tipo == "voto_emitido":
            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "voto_emitido",
                    "message": data.get("message", ""),
                }
            )

    async def papeleta_habilitada(self, event):
        message = event["message"]
        print(f"[WS] Enviando habilitación: {message}")
        await self.send(text_data=json.dumps({
            "event": "habilitar",
            "message": message,
        }))

    async def voto_emitido(self, event):
        message = event["message"]
        print(f"[WS] Enviando voto emitido: {message}")
        await self.send(text_data=json.dumps({
            "event": "voto_emitido",
            "message": message,
        }))
