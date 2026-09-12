# Nivel 100 · Empezar — hoja de trabajo

**Escenario:** el chatbot cuya promesa obligó a la aerolínea (FailFest **VH-001, Air Canada**).
**Tiempo:** 45 minutos. **Instalación:** ninguna. **Habilidades necesarias:** ninguna — elige el camino en
palabras llanas o el camino en código en el paso 3; los dos terminan en el mismo recibo.
**Tren:** otoño 2026 · los pasos marcados **hoy** funcionan ya; los marcados **otoño** llegan con el lanzamiento.

> **Wren dice:** necesitas un navegador y 45 minutos. Si no tienes ninguno de los dos, salta a *Nadie se queda atrás* al final — todavía hay un camino a un recibo hoy. El jueves es el regreso.

| Paso | Minutos | Estado |
|---|---|---|
| 1 Lee el caso | 5 | hoy |
| 2 Nombra la acción con consecuencias | 5 | hoy |
| 3 Declara la compuerta | 10 | hoy |
| 4 Decide | 5 | hoy (en la tabla) → otoño (en la página) |
| 5 Prueba — consigue un recibo real y firmado | 10 | hoy |
| 6 Léelo desde una lente que no es la tuya | 5 | hoy |
| 7 Devuelve | 5 | hoy |

---

### 1 · Lee el caso (5 min) — hoy

Abre [los 100 casos](https://www.aigovops-foundation.com/f-ai-friday.html?id=VH-001) (públicos, sin cuenta) o FailFest en la Biblioteca y busca
**VH-001**. En 2022, el chatbot del sitio web de Air Canada le dijo a un pasajero en duelo que podía
solicitar una tarifa por fallecimiento *después* de viajar. La política decía lo contrario. Él confió en
la respuesta; la aerolínea se negó; el tribunal obligó a la aerolínea a cumplir la palabra de su chatbot
(*Moffatt v. Air Canada*, 2024 BCCRT 149).

Escribe, en una línea, qué **hizo** la IA que importó:

> ______________________________________________________________

### 2 · Nombra la acción con consecuencias (5 min) — hoy

A la compuerta solo le importan las acciones con consecuencias. Marca el nivel al que pertenece esta acción:

- [ ] C0 solo lectura, sin efecto fuera del sistema
- [ ] C1 escritura interna, totalmente reversible
- [ ] **C2 efecto externo sobre una persona, reversible** ← una promesa a un cliente está aquí
- [ ] C3 irreversible, financiera o que afecta derechos
- [ ] C4 prohibida

Nombra la acción como lo haría un sistema: `customer.reply` con una **afirmación sobre la política**.

### 3 · Declara la compuerta (10 min) — hoy

**Camino en palabras llanas.** El corpus ya escribió esta compuerta: *"La empresa responde por cada
afirmación que su IA hace a un cliente y verifica las respuestas sobre políticas contra la fuente de la
verdad."* Reescríbela con tus propias palabras, como una regla que un colega pudiera hacer cumplir:

> ______________________________________________________________
> ______________________________________________________________

**Camino en código.** La misma regla en tres líneas (es el `policy.yaml` junto a esta hoja):

```yaml
policy: begin-v1
controls:
  - action: customer.reply
    tier: C2
    decision: constrain      # permitida solo con una fuente verificada de la política adjunta
```

Los dos caminos son la misma compuerta. Si escribiste la frase, lee el YAML y comprueba que dice lo que
dijiste. Si escribiste el YAML, dilo en voz alta como una frase.

### 4 · Decide (5 min) — hoy en la tabla · otoño en la página

Propón la acción: *el bot está a punto de decirle a un cliente que puede reclamar una tarifa por
fallecimiento después de viajar.* Decide contra tu regla y rodea una opción:

| permitir | **acotar** | retener | denegar |
|---|---|---|---|
| adelante | adelante solo hasta aquí — con la fuente verificada adjunta | espera a una persona | no |

Escribe la restricción que aplicaste: _______________________________________

*Otoño:* la página del Gate Check gana una caja para la regla y otra para la acción, y este paso se
ejecuta sobre tu regla con un recibo de decisión real. Hoy la decisión es tuya sobre el papel; el recibo
del paso 5 es real.

### 5 · Prueba — consigue un recibo real y firmado (10 min) — hoy

Abre **[Beacon en modo hoja de trabajo](https://aigovops-foundation.github.io/aigovops-beacon/?worksheet=100)**. Un
botón: genera una clave Ed25519 en tu navegador, firma cada recibo con JCS canónico, arma un paquete de
evidencia descargable y muestra en pantalla los tres valores de abajo con un botón para copiar. Nada se
envía a ninguna parte. (El `VERIFY.md` del paquete lleva los mismos valores.)

Copia:

- Huella de la clave: __________________________
- Hash del paquete: __________________________
- Número de recibos: ______

### 6 · Léelo desde una lente que no es la tuya (5 min) — hoy

Elige la lente **más lejana** a tu trabajo y responde su pregunta a partir de `VERIFY.md`:

- [ ] **Ingeniería** — ¿qué rompería la cadena si se quitara un recibo?
- [ ] **Cumplimiento** — ¿a qué regla, por su nombre, respondió cada recibo?
- [ ] **Auditoría** — ¿quién firmó, cuándo, y puedo comprobarlo sin Beacon?
- [ ] **Regulación** — ¿qué demuestra este paquete que ocurrió, y qué no?

Respuesta: ______________________________________________________________

### 7 · Devuelve (5 min) — hoy

Pon el hash del paquete en tu Gate Card (haz el Gate Check de diez minutos en el sitio de la comunidad
si aún no lo hiciste). Luego: **tráelo el jueves a las 09:00 (hora del Pacífico)** — los primeros cinco minutos son para los
recibos. Muéstraselo a una persona y di la regla que escribiste.

Eso es el nivel 100. Un anfitrión lo marca. Un paquete que nadie ha visto todavía no es un 100.

## Nadie se queda atrás

| Si tú… | Entonces… |
|---|---|
| no tienes computadora | Haz los pasos 1–4 en la hoja impresa. El jueves un anfitrión te presta una laptop para el paso 5 — el recibo sigue siendo tuyo, firmado con una clave creada delante de ti. |
| solo tienes teléfono | La página pública de casos y la demo de Beacon funcionan en un teléfono. El paquete se descarga a tu teléfono; `VERIFY.md` se abre en cualquier visor de texto. |
| tienes diez minutos, no 45 | Haz los pasos 1, 3 (una frase, en palabras llanas) y 5. Eso es un recibo. Los pasos 2, 4, 6 y 7 caben el jueves. |
| no puedes los jueves | Escribe el hash del paquete y tu frase en tu Wren Card y [envíalo a una persona](https://community.aigovops-foundation.com/help.html). Un anfitrión marca de forma asíncrona; pregúntale a Wren por el próximo jueves de segunda hora (propuesto para quienes no pueden a las 09:00 (hora del Pacífico)). |
| no sabes qué es un nivel de consecuencia | Pasa el cursor por el nivel en la hoja publicada, o pregúntale a Wren: una frase por cada uno. C2 es "una promesa a una persona". |

---

**Para llevar:** `bundle-<hash>.zip` con `VERIFY.md`; tu regla en dos formas; una respuesta desde una lente.
**Siguiente:** [Nivel 200 — Adaptar](../../../../levels/200-retrofit/WORKSHEET.md) (en inglés por ahora), cuando tengas un agente propio.
