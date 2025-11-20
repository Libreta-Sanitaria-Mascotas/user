### 👤 `user`
- Almacena el perfil de los usuarios (nombre, dirección, teléfono, etc.)
- No guarda contraseñas (las maneja `auth`)
- Integrado con JWT para proteger rutas privadas
- Comando RMQ `find_user_by_credential_id` usado por el gateway (cacheable).

#### Arranque rápido
```bash
npm install
npm run start:dev
```

#### CI sugerido
- `npm ci`
- `npm test`
