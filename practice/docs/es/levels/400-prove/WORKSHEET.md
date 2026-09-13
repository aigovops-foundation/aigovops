# Nivel 400 · Demuéstralo a un desconocido — hoja de trabajo

**Escenarios:** 470.000 deudas ilegales generadas con una fórmula de promedios que nadie había validado ([FailFest](https://www.aigovops-foundation.com/f-ai-friday.html?id=VH-013)
**VH-013, Robodebt**); entre 26.000 y 35.000 familias señaladas como defraudadoras y un gobierno caído
(**VH-003, el toeslagenaffaire**); veinte años de encargados de oficinas de correos procesados por la salida de un software que nadie
podía verificar de forma independiente (**VH-088, Post Office Horizon**).
**Tiempo:** 60 minutos para la hoja; el jueves que anfitrionas es su propia hora.
**Habilidades necesarias:** cualquiera de las dos vías — la puerta de auditoría va de independencia, no de herramientas.
**Tren:** Otoño 2026 · lo marcado **live** funciona hoy; lo marcado **fall** llega en P2.

> **Wren dice:** la puerta de auditoría va de independencia, no de destreza. Cualquier 300 puede verificar el paquete de un desconocido con su propio VERIFY.md en un teléfono en modo avión. Anfitrionar es la parte difícil; el guion del jueves está escrito para ti.

| Paso | Minutos | Estado |
|---|---|---|
| 1 Lee los tres casos | 8 | live |
| 2 Verifica el paquete de un desconocido, sin conexión | 15 | live (con `VERIFY.md`) → fall (un comando) |
| 3 La puerta de la premisa (Robodebt) | 12 | live |
| 4 Evidencia al regulador, completa | 8 | live (política) → fall (exportación del paquete con crosswalk) |
| 5 Aguas arriba: un issue, un caso | 7 | live |
| 6 Anfitriona | 5 para planificar; 60 para dirigir | live |
| 7 Regresa | 5 | live |

---

### 1 · Lee los tres casos (8 min) — live

**Robodebt.** El promedio de ingresos como premisa legal para generar deudas; una Comisión Real concluyó que el programa
era ilegal desde el principio. Puerta: *la premisa matemática de un sistema de decisión automatizada se
valida de forma independiente como legal y sólida antes de emitir una sola notificación.*

**Toeslagenaffaire.** Nacionalidad y renta baja como indicadores de riesgo de fraude; devoluciones forzadas; niños retirados;
un gabinete dimitió. Puerta: *los atributos protegidos y sus proxies quedan vetados como indicadores de riesgo; toda
decisión adversa tiene una revisión humana real.*

**Horizon.** La salida de un software de contabilidad se trató como prueba de robo durante dos décadas. Puerta:
*las salidas de software que acusan a personas de delitos son verificables de forma independiente; las salidas del sistema no son
prueba legal por sí solas.*

Los tres duraron años porque nadie de fuera podía comprobarlos. Para eso existe la puerta de auditoría.

### 2 · Verifica el paquete de un desconocido, sin conexión (15 min) — live → fall

Toma un paquete que no hiciste tú — del catálogo, de un 300 que lo pidió, o de la demo de Beacon ejecutada por
otra persona. Cópialo a una máquina **sin red** (el modo avión cuenta). Abre su `VERIFY.md` y
síguelo paso a paso, sin Beacon, sin cuenta, sin nosotros.

- Firma verificada: ☐ sí ☐ no
- Cadena continua (sin huecos en `seq` / `prev_hash`): ☐ sí ☐ no
- ¿Algún contenido de carga dentro (prompt, salida, datos personales)? ☐ ninguno ☐ encontrado → falla
- Declaración, en una frase, con tu nombre: *"Yo, ______________, verifiqué el paquete __________ sin conexión el
  ____________ y encontré ______________."*

*Fall:* `beacon verify --offline <bundle>` hace la mecánica en un comando; la frase sigue siendo tuya.

### 3 · La puerta de la premisa (12 min) — live

La regla de decisión de Robodebt era una fórmula. Escribe la puerta de política que exige que la **premisa** esté
validada y con recibo antes de la primera notificación:

```yaml
  - action: decision.rule.publish          # la fórmula, el umbral, la lista de indicadores de riesgo
    tier: C3
    decision: hold
    approver_role: independent_validator   # no el equipo que escribió la regla
    constraints:
      evidence_required: [legal_basis, statistical_validation, equity_test_by_cohort]
      expiry: 30d
  - action: notice.issue
    tier: C3
    decision: deny
    unless: receipt_exists(decision.rule.publish)   # sin premisa validada, no hay notificación — nunca
```

Vía en palabras llanas — escribe las mismas dos reglas como dos frases que un ministro pudiera leer:
> ______________________________________________________________
> ______________________________________________________________

Nombra el proxy de tu propio sistema que podría ser una *nacionalidad* o una *renta baja* disfrazada:
______________

### 4 · Evidencia al regulador, completa (8 min) — live política · fall exportación

Cuando sale mal, ¿qué sale del edificio? Escribe la regla: *la evidencia del incidente llega al regulador
completa y sin editar* (la puerta VH-008 del corpus). Después lista lo que tu exportación del paquete debe contener para
un revisor que nunca ha visto tu sistema:

☐ la cadena ☐ la política y su hash ☐ el crosswalk UCID al marco que le importa
(categoría del Anexo III de la Ley de IA de la UE / función del NIST AI RMF / cláusula de ISO 42001) ☐ `VERIFY.md` ☐ sin carga

*Fall:* `umbrella-conformance bundle` con el crosswalk adjunto; la lente del regulador en Lantern.

### 5 · Aguas arriba — un issue, un caso (7 min) — live

Elige el caso de los pasos 1–3 que expuso algo que el estándar o los registros todavía no dicen.
Presenta **uno** de estos: un issue contra los seis dominios de la especificación OVERT (cita el número de caso y la
puerta en palabras llanas); una nueva fila UCID o de crosswalk a Umbrella por PR; un envío a AIID o al Monitor de
Incidentes de IA de la OCDE. Enlace: ______________________________

### 6 · Anfitriona (5 min para planificar) — live

Reclama un jueves en la rotación. El guion es fijo: los primeros cinco minutos son recibos (los 100 muestran
los suyos); después el diff de un 200; después el número de cobertura de un 300; después tu declaración de verificación del
paso 2; después las marcas. Tu jueves: ____________ (fecha).

### 7 · Regresa (5 min) — live

Marca el paso de un 300 — tú eres el aprobador; la marca es un recibo con tu clave. Fusiona el
PR de un contribuidor. Escribe la historia de cuatro frases: qué verificaste, qué encontraste, qué presentaste aguas arriba, a quién
marcaste.

## Nadie se queda atrás

| Si tú… | Entonces… |
|---|---|
| no tienes el paquete de un desconocido | Pide uno del catálogo en tu Wren Card, o toma el paquete de demo de Beacon que un 100 hizo el jueves. La independencia va de quién lo hizo, no de a qué distancia está. |
| no puedes anfitrionar en persona | Anfitriona el jueves asíncrono (la franja de la segunda hora): lee los recibos en el hilo, marca y escribe las cuatro frases. Cuenta. |
| no te sientes cómodo presentando aguas arriba | Presenta el caso del corpus a AIID o al monitor de la OCDE en vez de a la especificación; un anfitrión puede cofirmar contigo un issue de la especificación. |
| eres de política, no ingeniero | La puerta de la premisa (paso 3) es el corazón del nivel y son dos frases que un ministro podría leer. Escríbelas; un 400 de la vía de código las teclea. |
| lees español | Dilo en tu Wren Card y un anfitrión hispanohablante se empareja contigo. El jueves es a las 15:00 (hora del Pacífico). |

---

**Te llevas:** una declaración pública de verificación con tu nombre; la puerta de la premisa en dos formas;
un enlace aguas arriba; un jueves anfitrionado.
**Estás en la rotación de anfitriones.** El próximo jueves es tuyo.

---

## Lista de comprobación — una página

*Una página. Marca sobre la marcha.* · Escenarios VH-013 Robodebt · VH-003 Toeslagenaffaire · VH-088 Horizon · 60 minutos + el jueves que anfitrionas

**Antes**
- [ ] Soy un 300 y quiero custodiar.

**Verificar a un desconocido, sin conexión**
- [ ] Llevé un paquete que no hice a una máquina sin red.
- [ ] Firma ☐ continuidad de la cadena ☐ sin contenido de carga — comprobado con `VERIFY.md`, sin Beacon.
- [ ] Mi declaración de verificación de una frase lleva mi nombre y la fecha.

**La puerta de la premisa (Robodebt)**
- [ ] `decision.rule.publish` es un hold C3 para un validador independiente con evidencia legal, estadística y de equidad.
- [ ] `notice.issue` se deniega salvo que exista el recibo de la premisa.
- [ ] Nombré el proxy de mi propio sistema que podría ser una nacionalidad o una renta baja disfrazada.

**Evidencia al regulador**
- [ ] La lista de exportación está completa: cadena · política + hash · crosswalk UCID · `VERIFY.md` · sin carga.

**Aguas arriba**
- [ ] Un issue, una fila UCID o un envío de incidente está presentado, con el número de caso y la puerta.

**Anfitrionar**
- [ ] Mi jueves está en la rotación; el guion es recibos → diff → cobertura → verificación → marcas.

**Regresar**
- [ ] Marqué a un 300 (mi clave es la del aprobador). ☐ Fusioné el PR de un contribuidor. ☐ La historia de cuatro frases está escrita.
- [ ] Dos 400 o un fundador me marcaron como 400.

**Nunca:** ☐ No he reclamado ningún nivel para ningún *sistema*. Los sistemas obtienen un AAL de OVERT y un número de cobertura a partir de su propia evidencia.

---

*Traducción de [levels/400-prove/WORKSHEET.md](../../../../levels/400-prove/WORKSHEET.md); la versión en inglés manda.*
