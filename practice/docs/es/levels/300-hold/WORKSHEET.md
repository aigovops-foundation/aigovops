# Nivel 300 · Hold — hoja de trabajo

**Escenarios:** 200 M HK$ transferidos tras una videollamada llena de colegas deepfake ([FailFest](https://www.aigovops-foundation.com/f-ai-friday.html?id=VH-015) **VH-015,
Arup**); 300.000 reclamaciones denegadas en dos meses a 1,2 segundos cada una (**VH-035, Cigna PXDX**); un
algoritmo que anula el criterio clínico sobre la cobertura (**VH-011, UnitedHealth nH Predict**).
**Tiempo:** 60 minutos hoy (mesa + política + autoauditoría); después una semana de tráfico real cuando
llegue la puerta de operación. **Habilidades necesarias:** cualquiera de las dos vías. Este nivel es sobre todo criterio; las herramientas
hacen cumplir lo que decidas aquí.
**Tren:** Otoño 2026 · lo marcado **live** funciona hoy; lo marcado **fall** llega en P1.

> **Wren dice:** este nivel es criterio, no herramientas. Todo hasta *Fall* es papel y bolígrafo. Haz la aritmética de Cigna en voz alta — *¿de cuántos?* — y trae el número, o el honesto "todavía no puedo contar".

| Paso | Minutos | Estado |
|---|---|---|
| 1 Lee los tres casos | 8 | live |
| 2 El hold: nombra a la persona, el canal, la caducidad | 10 | live (política) → fall (cola) |
| 3 Agregación: haz la aritmética de Cigna | 10 | live (a mano) → fall (aplicada) |
| 4 Identidad: quién es este agente, bajo qué autoridad | 7 | live (política) → fall (vinculada por el broker) |
| 5 Condiciones de parada y fallo cerrado | 5 | live |
| 6 Autoauditoría con recibo | 10 | live |
| 7 Cobertura: di el número, o di que no puedes | 5 | live → fall (`beacon coverage`) |
| 8 Regresa | 5 | live |

---

### 1 · Lee los tres casos (8 min) — live

**Arup, 2024.** Un empleado de finanzas se unió a una videollamada con el director financiero y varios colegas — todos deepfakes —
e hizo quince transferencias. Puerta: *una cara en una videollamada no es verificación de identidad; las
transferencias de alto valor exigen confirmación por un canal independiente.*

**Cigna PXDX, 2023.** Los médicos "revisaban" y denegaban reclamaciones por lotes sin abrir los expedientes:
300.000 en dos meses, una media de 1,2 segundos cada una. Puerta: *un revisor médico humano revisa de verdad
antes de denegar cualquier reclamación.*

**nH Predict, 2023.** La duración de estancia predicha por un modelo se usó para cortar cuidados posagudos por encima del
criterio de los clínicos. Puerta: *un modelo puede informar pero nunca sustituir el criterio clínico en decisiones de cobertura.*

¿Cuál de las acciones de tu agente es la de Arup (irreversible, alto valor)? ______________
¿Cuál es la de Cigna (pequeña, rápida y peligrosa en volumen)? ______________

### 2 · El hold (10 min) — live política · fall cola

Para tu acción C3, completa el control. Cada hueco es obligatorio; un hold sin caducidad es un
hold que nadie libera.

```yaml
  - action: ______________
    tier: C3
    decision: hold
    approver_role: ______________         # un rol, y una persona con nombre el jueves
    constraints:
      out_of_band: ______________         # el canal que NO es aquel por el que llegó la petición
      expiry: ____h                       # un hold no liberado decae a deny — la regla de la Biblioteca
```

¿Quién lo libera a las 02:00 de un domingo? ______________ Si nadie, la respuesta es *deny*, y es
correcta. *Fall:* `beacon hold list` / `beacon hold release`, recibos del hold y de la liberación.

### 3 · Agregación — haz la aritmética de Cigna (10 min) — live a mano · fall aplicada

Cada denegación de Cigna era un acto pequeño y reversible. Juntas eran un C3. **La agregación es un nivel.**

- Tu acción con forma de Cigna: ______________ Nivel por sí sola: C1
- ¿Cuántas de ellas, en una hora, equivaldrían a un daño irreversible? ______
- Así que: `budget: { per_hour: ______ }`, y por encima el nivel escala a C3 y **retiene**.

Comprueba la cuenta contra el caso: 300.000 ÷ 60 días ÷ 8 horas ≈ 625 por hora. ¿Lo habría
atrapado tu presupuesto a las 09:15 del primer día? ☐ sí ☐ no → bájalo.

### 4 · Identidad — quién es este agente, bajo qué autoridad (7 min) — live política · fall vinculada

*No More Anonymous Ghosts*, de Ken: ¿qué agente hizo esto, bajo qué autoridad? Rellena, para cada agente
de `applies_to`:

| Agente | `agent_id` (una clave, no un nombre) | `authority` (la persona o el rol por quien actúa) |
|---|---|---|
| | | |

Una acción sin `agent_id` es una **condición de parada** — añade `identity_unbound` a tus
`stop_conditions`. *Fall:* el broker rechaza las acciones no vinculadas y escribe el recibo que lo dice.

### 5 · Condiciones de parada y fallo cerrado (5 min) — live

Marca cada una que nombre tu política: ☐ unknown_action ☐ policy_unavailable ☐ hash_mismatch
☐ budget_exhausted ☐ key_unavailable ☐ identity_unbound. Después escribe la frase:
*"Por encima de C1 este sistema nunca falla abierto."* Fírmala: ______________

### 6 · Autoauditoría con recibo (10 min) — live

Abre la **herramienta de formación en auditoría** del asesor Vendor RFI. Ejecuta la autoauditoría contra tu sistema tal
como está hoy. Exporta el recibo. Anota su hash: __________________ — se une a tu cadena.

### 7 · Cobertura — el número honesto (5 min) — live → fall

La cobertura de puerta es la proporción de acciones C2+ que decidió una puerta y dejaron recibo. Hoy, en
papel: de las acciones C2+ de tu agente la semana pasada, ¿cuántas pasaron por una puerta? ______ / ______ =
______ %. Si no puedes contarlas, escribe **"todavía no puedo contar"** — es un hallazgo, no un fracaso.
*Fall:* `beacon coverage` lo calcula desde la cadena; las acciones sin puerta simplemente no cuentan.

### 8 · Regresa (5 min) — live

Toma del catálogo un paquete que no hiciste tú. Antes del jueves, léelo con la lente del auditor y
verifícalo con su `VERIFY.md`. Di el jueves qué encontraste. Acompaña a un 200 en el paso 4 de su
hoja.

## Nadie se queda atrás

| Si tú… | Entonces… |
|---|---|
| todavía no tienes tráfico | Todo lo de esta hoja antes de *Fall* es de mesa. Hazlo sobre los registros del mes pasado, o sobre los números de Cigna del caso. |
| no tienes a quién nombrar como aprobador | Ese es el hallazgo. Escribe "nadie a las 02:00 de un domingo — así que deniega" y tráelo; un 300 sin aprobador es un sistema que falla cerrado correctamente. |
| no puedes contar la cobertura | Escribe "todavía no puedo contar". Es la respuesta honesta más común en el 300 y se marca igual. |
| no eres técnico | Los pasos 2, 3, 4 y 7 no necesitan ninguna herramienta; necesitan que nombres personas, horas y números. Salta el 5 y el 6 hasta el jueves. |
| los casos te resultan duros | Lo son. Elige uno de los tres, no todos; la marca pide el hold y la aritmética, no leer cada caso. |
| lees español | Dilo en tu Wren Card y un anfitrión hispanohablante se empareja contigo. El jueves es a las 09:00 (hora del Pacífico). |

---

**Te llevas hoy:** un control C3 con una persona con nombre, un canal independiente y una caducidad; un presupuesto
que habría atrapado a Cigna a las 09:15; una tabla de identidad; un recibo de autoauditoría; un número de cobertura o
un honesto "todavía no puedo contar".
**Te llevas tras una semana de tráfico (fall):** *cobertura de puerta 9x % en 30 días*, con un hold, una
liberación, una caducidad y una escalada por agregación en la cadena.
**Siguiente:** [Nivel 400 — Demuéstralo a un desconocido](../400-prove/WORKSHEET.md).

---

## Lista de comprobación — una página

*Una página. Marca sobre la marcha.* · Escenarios VH-015 Arup · VH-035 Cigna PXDX · VH-011 nH Predict · 60 minutos hoy, una semana de tráfico en otoño

**Antes**
- [ ] Soy un 200; mi agente toca personas, dinero o derechos (C2+).

**El hold (Arup)**
- [ ] Mi acción C3 tiene `approver_role`, un canal independiente y una caducidad.
- [ ] Puedo nombrar quién libera un hold a las 02:00 de un domingo — o acepto que decae a deny.

**Agregación (Cigna)**
- [ ] Nombré mi acción pequeña-rápida-peligrosa y fijé `budget.per_hour`.
- [ ] Mi presupuesto habría atrapado el ritmo de Cigna (≈625/hora) a las 09:15 del primer día.

**Identidad (Ghosts)**
- [ ] Cada agente tiene un `agent_id` (una clave) y una `authority` (una persona o un rol).
- [ ] `identity_unbound` es una condición de parada.

**Fallo cerrado**
- [ ] Las seis condiciones de parada están nombradas. ☐ "Por encima de C1 este sistema nunca falla abierto" — firmado.

**Autoauditoría**
- [ ] La autoauditoría de formación del Vendor RFI está ejecutada; el hash de su recibo está en mi cadena.

**Cobertura**
- [ ] Escribí un número de cobertura de la semana pasada — o "todavía no puedo contar".

**Regresar**
- [ ] Verifiqué el paquete de otra persona con su `VERIFY.md` y dije el jueves qué encontré.
- [ ] Acompañé a un 200 en su paso de identidad.
- [ ] Un 400 me marcó como 300.

**Otoño (una semana de tráfico):** ☐ hold ☐ liberación ☐ caducidad ☐ escalada por agregación — los cuatro en la cadena; ☐ `beacon coverage` ≥ ___ %.

---

*Traducción de [levels/300-hold/WORKSHEET.md](../../../../levels/300-hold/WORKSHEET.md); la versión en inglés manda.*
