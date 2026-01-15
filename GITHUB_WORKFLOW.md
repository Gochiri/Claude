# 🚀 Cómo Trabajar desde GitHub

Este documento explica cómo colaborar en el proyecto GHL UI Skin usando GitHub.

---

## 📦 **1. Clonar el Proyecto**

### Primera vez:

```bash
# Clonar el repositorio
git clone https://github.com/Gochiri/Claude.git
cd Claude

# Cambiar al branch del proyecto
git checkout claude/ghl-ui-skin-mvp-wwZY6

# Verificar que estás en el branch correcto
git branch
# Debe mostrar: * claude/ghl-ui-skin-mvp-wwZY6
```

---

## 🔄 **2. Workflow de Desarrollo**

### Antes de empezar a trabajar:

```bash
# Asegurarte de tener la última versión
git pull origin claude/ghl-ui-skin-mvp-wwZY6
```

### Trabajar en una nueva feature:

```bash
# Crear un branch desde el MVP
git checkout -b feature/nombre-de-tu-feature

# Ejemplo:
git checkout -b feature/login-screen-customization
```

### Hacer cambios:

```bash
# Ver archivos modificados
git status

# Agregar archivos al staging
git add .

# Commit con mensaje descriptivo
git commit -m "Agregar customización de login screen

- Nuevo endpoint /api/v1/login-config
- Campos en agency_styles para login
- Script inject-login.js
"

# Push al repositorio
git push origin feature/nombre-de-tu-feature
```

### Crear Pull Request:

1. Ve a GitHub: https://github.com/Gochiri/Claude
2. Click en "Compare & pull request"
3. Base branch: `claude/ghl-ui-skin-mvp-wwZY6`
4. Compare branch: `feature/nombre-de-tu-feature`
5. Describe los cambios
6. Click "Create pull request"

---

## 🔀 **3. Mantener tu Branch Actualizado**

Si alguien más hizo cambios en el MVP:

```bash
# Cambiar al branch MVP
git checkout claude/ghl-ui-skin-mvp-wwZY6

# Traer los últimos cambios
git pull origin claude/ghl-ui-skin-mvp-wwZY6

# Volver a tu branch de feature
git checkout feature/nombre-de-tu-feature

# Mergear los cambios del MVP a tu branch
git merge claude/ghl-ui-skin-mvp-wwZY6

# Si hay conflictos, resolverlos y luego:
git add .
git commit -m "Merge cambios del MVP"
git push origin feature/nombre-de-tu-feature
```

---

## 📂 **4. Estructura de Branches**

```
main (o master)
│
└── claude/ghl-ui-skin-mvp-wwZY6  ← Branch principal del MVP
    │
    ├── feature/login-customization
    ├── feature/temas-preconfigurados
    ├── feature/webhook-automation
    └── bugfix/cache-invalidation
```

**Regla:** Nunca hacer commits directos a `claude/ghl-ui-skin-mvp-wwZY6`. Siempre usar feature branches.

---

## 🛠️ **5. Comandos Útiles**

### Ver historial de commits:

```bash
git log --oneline --graph --all
```

### Ver diferencias antes de commitear:

```bash
git diff
```

### Deshacer cambios no commiteados:

```bash
# Deshacer cambios en un archivo específico
git checkout -- archivo.py

# Deshacer TODOS los cambios
git reset --hard
```

### Ver archivos ignorados por .gitignore:

```bash
git status --ignored
```

### Limpiar archivos no trackeados:

```bash
git clean -fd
```

---

## 🔐 **6. Buenas Prácticas**

### ✅ **DO (Hacer):**

- Commits pequeños y frecuentes
- Mensajes de commit descriptivos
- Pull antes de push
- Crear branches para cada feature
- Revisar cambios antes de commitear (`git diff`)

### ❌ **DON'T (No hacer):**

- Commitear archivos sensibles (.env, secrets)
- Commits gigantes con múltiples features
- Push directo al branch principal
- Ignorar conflictos de merge

---

## 📝 **7. Convención de Nombres**

### Branches:

```
feature/nombre-corto-descriptivo
bugfix/descripcion-del-bug
hotfix/arreglo-urgente
docs/actualizacion-readme
refactor/mejora-codigo
```

### Commits:

```
feat: Agregar nueva funcionalidad
fix: Corregir bug
docs: Actualizar documentación
style: Cambios de formato (no afectan código)
refactor: Refactorización de código
test: Agregar tests
chore: Tareas de mantenimiento
```

**Ejemplo:**
```bash
git commit -m "feat: Agregar temas pre-configurados

- 8 temas prediseñados (Dark, Light, Purple, etc.)
- Endpoint GET /api/v1/themes
- UI selector en StyleEditor
"
```

---

## 🚨 **8. Resolver Conflictos**

Si al hacer merge aparece un conflicto:

```bash
# Git te mostrará los archivos en conflicto
git status

# Abrir el archivo y buscar:
<<<<<<< HEAD
Tu código
=======
Código del otro branch
>>>>>>> branch-name

# Editar manualmente para quedarte con lo correcto
# Luego:
git add archivo-resuelto.py
git commit -m "Resolver conflicto en archivo-resuelto.py"
```

---

## 📊 **9. Ver el Estado del Proyecto**

### Branches activos:

```bash
git branch -a
```

### Último commit de cada branch:

```bash
git branch -v
```

### Ver cambios entre branches:

```bash
git diff claude/ghl-ui-skin-mvp-wwZY6..feature/tu-branch
```

---

## 🔄 **10. Sincronizar con GitHub**

### Subir tu branch nuevo:

```bash
git push -u origin feature/tu-branch
```

### Actualizar branch existente:

```bash
git push origin feature/tu-branch
```

### Borrar branch remoto (después de merge):

```bash
git push origin --delete feature/branch-a-borrar
```

---

## 💡 **11. Tips Avanzados**

### Stash (guardar cambios temporalmente):

```bash
# Guardar cambios sin commitear
git stash

# Ver stash guardados
git stash list

# Recuperar el último stash
git stash pop

# Recuperar un stash específico
git stash apply stash@{0}
```

### Cherry-pick (copiar commit específico):

```bash
# Copiar un commit de otro branch
git cherry-pick <commit-hash>
```

### Rebase (reescribir historial):

```bash
# Actualizar tu branch con cambios del MVP (alternativa a merge)
git checkout feature/tu-branch
git rebase claude/ghl-ui-skin-mvp-wwZY6
```

---

## 📞 **12. Ayuda**

Si algo sale mal:

```bash
# Ver ayuda de un comando
git help <comando>

# Ejemplo:
git help merge
git help rebase
```

**Regla de oro:** Si no estás seguro, NO hagas `git push --force`

---

## 🎯 **Ejemplo Completo de Workflow**

```bash
# 1. Actualizar MVP
git checkout claude/ghl-ui-skin-mvp-wwZY6
git pull origin claude/ghl-ui-skin-mvp-wwZY6

# 2. Crear branch de feature
git checkout -b feature/temas-preconfigurados

# 3. Hacer cambios
# ... editar archivos ...

# 4. Ver cambios
git status
git diff

# 5. Commitear
git add .
git commit -m "feat: Agregar 8 temas pre-configurados"

# 6. Push
git push -u origin feature/temas-preconfigurados

# 7. Crear Pull Request en GitHub

# 8. Después de merge, limpiar
git checkout claude/ghl-ui-skin-mvp-wwZY6
git pull origin claude/ghl-ui-skin-mvp-wwZY6
git branch -d feature/temas-preconfigurados
```

---

**¡Listo para colaborar!** 🚀
