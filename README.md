# PhoneHub
ยินดีต้อนรับสู่เอกสารโครงงาน


### System Architecture

```mermaid
graph TD
    Client[Web Browser / React] -->|HTTP/Websocket| Server[Node.js Express]
    Server -->|SQL Queries| Database[(MySQL)]