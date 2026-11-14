# CloudRecall

An interactive, local-first study companion for independent courses in any subject. Includes the original bilingual AWS Certified Cloud Practitioner (CLF-C02) library. No account, API key, paid service, or backend is required.

## Run

Use Node.js 24 (see `.nvmrc`) and npm:

```sh
npm ci
npm run dev
```

Vite serves the application on port 5173. For a production build:

```sh
npm run build
npm run preview
```

## Segundo MVP: cursos y paquetes

El cambiador **Curso activo** cambia toda la biblioteca, los filtros, las sesiones FSRS, las estadísticas y los retos. Recuerda el curso seleccionado al recargar. El curso original conserva sus 114 tarjetas, IDs y la clave `cloudrecall.progress.v1`: no se migra ni elimina ningún progreso existente.

1. Pulsa **Mis cursos → Añadir curso**. Arrastra un paquete JSON o usa **Elegir archivo JSON**; también puedes abrir un ejemplo sin descargarlo.
2. Revisa la vista previa: validación, temas, cantidades y una tarjeta de muestra. Los detalles técnicos quedan en un desplegable.
3. Pulsa **Añadir y abrir curso** para comenzar directamente. Cambiar de sección o salir de la página antes de confirmar no escribe datos. Un ID existente se rechaza para conservar su contenido y progreso.

La sección Explorar ejemplos permite descargar cada JSON. **Python desde cero** incluye ocho tarjetas y ocho retos sobre tipos, funciones, archivos y errores; CLF-C02 avanzado, SAA-C03 y DevOps incluyen seis de cada uno. Son muestras, no temarios completos. Para probar la importación manual, descarga `public/packages/python-fundamentos.json` y selecciónalo en **Elegir archivo JSON**.

La preferencia de tema se aplica en el `<head>` antes de cargar React y el CSS, con un fondo inicial coherente para evitar destellos blancos al recargar en modo oscuro.

Los paquetes se guardan en `cloudrecall.packages.v2`. Cada curso nuevo usa `cloudrecall.course.<id>.progress.v1`; el objetivo diario, las sesiones, la programación, los repasos y los intentos de reto son independientes. Ajustes exporta/importa/restablece solo el progreso del curso activo. Las copias nuevas incluyen `courseId` y rechazan restauraciones en otro curso; las copias antiguas sin ese campo siguen funcionando en el curso original. Conserva también el JSON del paquete para poder restaurar un curso en otro navegador. Un catálogo ilegible se conserva y bloquea nuevas importaciones.

### Formato de paquete v1

Usa los archivos de `public/packages/` como plantillas completas. La raíz requiere `schemaVersion: 1`, `id`, `title`, `description`, `version`, `domains`, `cards` y `challenges`.

- IDs de curso, tema, tarjeta y opción: letras minúsculas ASCII, números y guiones, máximo 80 caracteres. Los IDs de tarjetas pueden repetirse entre cursos.
- `domains`: 1–20 temas con `id`, `name`, `short`, `description`, `weight` (0–100) y `color` hexadecimal de seis dígitos. Cada tema debe contener tarjetas. Para materias sin examen, usa el peso como referencia editorial.
- `cards`: 1–10 000 tarjetas con `id`, `domain`, `service` (concepto), `category`, `question`, `answer`, `explanation`, `example`, `confusion`, `mnemonic`, `keywords`, `tags` y `difficulty` (`Foundation` o `Applied`). Los campos de texto son obligatorios; las listas pueden estar vacías.
- `challenges`: exactamente uno por tarjeta, con el mismo `id` y `domain`, más `prompt`, cuatro `options` (`id`, `text`, `explanation`) y `correctId` que referencia una opción.
- Máximo 5 MB por archivo y 10 000 caracteres por texto. Se rechazan JSON inválido, versiones no admitidas, duplicados, referencias rotas y respuestas sin opción válida. El contenido se muestra como texto React, sin ejecutar HTML.

`src/lib/catalog.ts` define el contrato, el validador y el catálogo activo compartido por los motores existentes. Cambiar de curso remonta la aplicación de estudio para descartar selecciones y sesiones de UI del curso anterior. Los archivos originales de contenido permanecen intactos.

## Funciones de estudio

- Responsive dashboard with real activity, a configurable daily goal, streak, recall accuracy, upcoming reviews, and domain progress.
- **114 original bilingual flashcards**: 24 Cloud Concepts, 30 Security & Compliance, 44 Cloud Technology & Services, and 16 Billing, Pricing & Support. Exam domain weights are displayed separately from library counts.
- Learn mode introduces a concept and example before asking for recall. Flashcards hide the answer until revealed, then offer Again, Hard, Good, and Easy ratings.
- FSRS scheduling using `ts-fsrs` with 90% target retention and deterministic intervals. Due cards appear first, then new cards. Early manual reviews are not used to inflate progress.
- Domain, service/concept, difficulty, review status, and text filters in the library.
- Review analytics, weak concepts, and the next eight scheduled cards.
- LocalStorage persistence, JSON backups, strict import validation, confirmed replacement/reset, and protection against overwriting unreadable saved data.
- Light/dark themes, reduced-motion support, native modal focus handling, a skip link, mobile navigation, and keyboard controls.

In study mode, use **Space** to reveal/hide an answer and **1–4** to rate a revealed answer. Shortcuts do not intercept typing or native button keyboard behavior. Ratings persist immediately. Viewing answers in the library never changes scheduling.

“Mastered” is a learning heuristic: FSRS Review state, stability of at least 21 days, and not currently due. Recall accuracy is the percentage of self-ratings Good or Easy; it is **not** an exam score. A session is counted only after its first rating. Streaks use the browser's local calendar days and can include yesterday if you have not yet studied today.

## Reta tu conocimiento

Abre **Reta tu conocimiento** en la navegación o **Probar mi conocimiento** en el dashboard.

- **Reto corto**: 10 o 20 preguntas de opción múltiple, con explicación después de confirmar cada respuesta. Incluye un caso real, la distinción clave y explicaciones de las cuatro opciones.
- **Evaluación completa**: una pregunta por cada tarjeta del alcance elegido (114 para toda la biblioteca). Sin temporizador, sin preguntas repetidas y sin revelar respuestas hasta finalizar. Puedes evaluar también un dominio completo.
- Al terminar: número de aciertos, porcentaje sobre el total del intento, resultados por dominio y revisión de errores o de todas las preguntas.
- **Practicar mis errores** crea un reto independiente con solo las preguntas falladas, conservando el resultado original.
- Cada respuesta confirmada queda guardada. Puedes pausar, recargar y usar **Continuar reto**. Las preguntas y el orden de opciones se conservan al reanudar.
- El resumen muestra el último resultado de toda la biblioteca; no confunde el resultado de un reto corto o un repaso de errores con una evaluación global.
- Los resultados se incluyen en las copias JSON. Las copias v1 anteriores siguen siendo compatibles. Restablecer progreso también elimina los retos.

El porcentaje mide reconocimiento de respuestas de opción múltiple, no una predicción de aprobación oficial. Los retos no modifican FSRS, la precisión de recuerdo, la racha ni los repasos diarios. La biblioteca de alternativas relacionadas está en `src/data/challenges.ts`; añadir una tarjeta requiere incluir sus alternativas para habilitarla en retos.

## Validation

```sh
npm test                    # content, FSRS, analytics, and backup validation
npm run test:e2e             # Playwright functional and mobile checks
npm run build               # TypeScript and production bundle
```

Install Playwright Chromium once with `npx playwright install chromium`. To use an existing browser instead:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e
```

In this managed environment, the system Chromium was used because browser downloads were denied by network policy. If npm's default cache is not writable, use `npm --cache /tmp/cloudrecall-npm ci`. Browser screenshots are saved in ignored `test-results/`.

## Architecture

- `src/data/cards.ts`: versioned learning content, independent of UI and user progress.
- `src/data/domains.ts`: exam domain metadata and weights.
- `src/pages/Challenge.tsx`: practice, full-library assessment, persistent resume, results, and incorrect-answer review.
- `src/lib/challenge.ts`: challenge state transitions, scoring, randomization, and strict import validation.
- `src/data/challenges.ts`: per-card correct answers, related alternatives, and option explanations.
- `src/types.ts`: content, review, session, progress, and future exam interfaces.
- `src/lib/progress.ts`: FSRS adapter, analytics utilities, backup validation, storage, and export.
- `src/components/ui/button.tsx`: shadcn/ui button pattern with Radix Slot and class-variance-authority.
- `src/components/StudyWidgets.tsx`: shared statistics, charts, and accessible native dialogs.
- `src/pages/Dashboard.tsx`: learning dashboard.
- `src/App.tsx`: application navigation and study/library/progress/settings workflows.
- `src/styles.css`: Tailwind CSS integration and responsive theme styling; no external fonts or runtime assets are required.

Progress is separate from the content library under `cloudrecall.progress.v1`. JSON imports rehydrate FSRS date fields, validate known card IDs and scheduling parameters, and reject invalid data before any write. The application does not transmit progress. Storage and scheduling are isolated behind functions so a database-backed repository can replace local persistence later.

## Content references and limitations

All cards are **original practice material, not official AWS exam questions**. AWS does not endorse this application. No leaked exam content is included.

Reference sources for continued editorial review:

- [Official CLF-C02 exam guide](https://docs.aws.amazon.com/aws-certification/latest/examguides/cloud-practitioner-02.html)
- [AWS service documentation](https://docs.aws.amazon.com/)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [AWS Shared Responsibility Model](https://aws.amazon.com/compliance/shared-responsibility-model/)
- [AWS pricing](https://aws.amazon.com/pricing/)
- [AWS Support plans](https://aws.amazon.com/premiumsupport/plans/)

Official documentation retrieval returned HTTP 403 during implementation. Therefore this library has not been verified against the latest online AWS documentation. It avoids fixed price quotes and changing technical-support plan guarantees. Perform an official-source editorial review before using this as a sole certification study resource. The included tests verify content completeness and important distinctions, not authoritative validation of every AWS fact.

## Next phases

This release includes the working MVP, FSRS, data protection, and untimed knowledge challenges. The following are **not implemented** and have no placeholder navigation controls:

- Scenario-based multiple choice with per-option explanations.
- Side-by-side service comparisons with mini-quizzes.
- 10/20/65-question exam simulation, multiple responses, timer, exam analytics, and incorrect-answer export.
- Exam-date cram mode that leaves normal scheduling intact.

The exam interfaces are reserved for these later phases. This version rejects backups containing exam records rather than silently dropping unsupported data. Browser-local persistence does not sync across devices; export a backup before clearing browser data.

## Gestionar cursos

**Mis cursos** reúne dos secciones: **Mi biblioteca** y **Explorar ejemplos**, con una única acción principal **Añadir curso** para importar un JSON. La biblioteca permite buscar por título o descripción, ver tarjetas estudiadas y repasos por curso, abrir un curso y exportar su paquete de contenido JSON (el progreso se exporta desde Ajustes). La tarjeta **Curso activo** abre una lista con búsqueda, descripciones y una marca en el curso actual. Permite cambiar con Tab/Enter y cerrar con Escape o al pulsar fuera. **Mis cursos** es una página propia (`#courses`) que se conserva al recargar y funciona con Atrás/Adelante del navegador. En móvil se accede desde el menú de navegación.

Los cursos importados se pueden eliminar con confirmación. Por defecto solo se quita el paquete: su progreso se conserva y se recupera al reimportar el mismo paquete. **Deshacer** restaura el último paquete eliminado mientras siga abierta la sesión. La casilla **Eliminar también sus repasos, retos y progreso guardados** permite borrar permanentemente ese progreso; no ofrece Deshacer. Al eliminar el curso activo se abre CLF-C02. El curso incluido se mantiene protegido y su progreso se gestiona desde Ajustes.

La eliminación vuelve a leer el catálogo guardado para conservar cambios de otras pestañas. Si falla el borrado del progreso, restaura el catálogo y muestra el error; los cursos ajenos nunca se borran.

Los ejemplos que ya están instalados ofrecen **Abrir curso** en lugar de invitar a importarlos de nuevo.

### Contenido de las explicaciones

El contrato JSON valida tipos, campos y referencias, pero eso no garantiza calidad pedagógica. Los campos de apoyo de cada tarjeta se comparten con la explicación del reto que tiene el mismo ID. Cada campo tiene una función distinta:

| Campo | Uso |
| --- | --- |
| `explanation` | Explicar por qué la respuesta es correcta. |
| `example` | Mostrar una aplicación concreta con acción y resultado; se presenta como «En la vida real». Los casos hipotéticos son ilustrativos, no afirmaciones de incidentes reales. |
| `confusion` | Contrastar conceptos que se pueden confundir; se presenta como «La distinción clave». |
| `mnemonic` | Ofrecer una pista breve para recordar el concepto. |
| `challenges[].options[].explanation` | Explicar específicamente por qué esa alternativa encaja o falla. |

No se debe rellenar `example` repitiendo `question` ni copiar la explicación de un distractor en `confusion`. El paquete introductorio de DevOps incluye comprobaciones de contenido para detectar esas regresiones; no se bloquean automáticamente otros paquetes por coincidencias textuales. Las fuentes quedan como metadatos del paquete.
