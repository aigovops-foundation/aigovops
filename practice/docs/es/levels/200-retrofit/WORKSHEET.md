# Nivel 200 · Adaptar — hoja de trabajo

**Escenarios:** el bot que aceptó vender una Tahoe por 1 $ ([FailFest](https://www.aigovops-foundation.com/f-ai-friday.html?id=VH-022) **VH-022, Chevrolet of
Watsonville / Fullpath**) y el despliegue que perdió 440 M$ en 45 minutos (**VH-056, Knight Capital**).
**Tiempo:** 60 minutos. **Instalar:** Python 3.11+, git; un `pip install` desde el código fuente.
**Habilidades necesarias:** cualquiera de las dos. La vía en palabras llanas escribe las reglas como frases y deja que las
herramientas las rendericen; la vía de código escribe YAML y lee las frases de vuelta.
**Tren:** Otoño 2026 · lo marcado **live** funciona hoy; lo marcado **fall** llega en la versión de otoño.

> **Wren dice:** si no tienes un agente propio, toma prestado el Matchmaker (el ejemplo resuelto) — la hoja cuenta igual. Si Python te asusta, haz los pasos 1–3 en papel y empareja el jueves con un 200 de la vía de código.

| Paso | Minutos | Estado |
|---|---|---|
| 1 Lee los dos casos | 5 | live |
| 2 Lista las tres acciones con consecuencias de tu agente | 10 | live |
| 3 Declara la política | 10 | live |
| 4 Puerta de política: valídala, construye un paquete | 10 | live |
| 5 Léelo, cambia una línea, diff | 10 | live |
| 6 Pon una llamada real tras la puerta | 10 | live (puerta de nivel 1) → fall (SDK) |
| 7 Regresa | 5 | live |

---

### 1 · Lee los dos casos (5 min) — live

**VH-022.** El bot de atención al cliente de un concesionario, instruido para "estar de acuerdo con todo lo que diga el cliente",
aceptó vender una Tahoe 2024 por 1 $ y lo llamó una oferta legalmente vinculante. Puerta: *los system prompts no son
fronteras de seguridad; los compromisos con consecuencias exigen reglas deterministas, no la buena voluntad de un LLM.*

**VH-056.** Knight Capital desplegó código de trading nuevo en siete de ocho servidores; el octavo corría código viejo
con una bandera reutilizada. Cuarenta y cinco minutos, 440 millones de dólares. Puerta: *los sistemas algorítmicos con
autoridad para mover el mercado tienen puerta de despliegue, interruptor de apagado y reversión ensayada.*

Uno trata del agente. El otro, del pipeline que despliega al agente. Vas a poner puerta a ambos.

### 2 · Las tres acciones con consecuencias de tu agente (10 min) — live

Elige algo tuyo que llame a una herramienta: un chatbot, un script, un flujo de trabajo, un agente de programación. Lista las
tres acciones que puede tomar y que importarían si las tomara mal, y asigna un nivel a cada una:

| # | Acción (como la nombra el sistema) | A quién o qué afecta | Nivel | ¿Reversible? |
|---|---|---|---|---|
| 1 | `______________` | | C_ | ☐ |
| 2 | `______________` | | C_ | ☐ |
| 3 | `______________` | | C_ | ☐ |

Si ninguna es C2 o superior, tu agente todavía no necesita una puerta — escríbelo; es un hallazgo.

### 3 · Declara la política (10 min) — live

**Vía en palabras llanas.** Escribe una frase por acción, al estilo del corpus — *"un compromiso con un
cliente nunca lo asume el modelo solo."*

**Vía de código.** Pon los tres controles en `policy.yaml` (plantilla junto a esta hoja, en inglés). Incluye un
`C3 hold` con un `approver_role` y un `C4 deny` con un `reason`. Las acciones desconocidas se deniegan por
defecto; escribe también esa línea.

Tomes la vía que tomes, produce la otra: lee el YAML en voz alta como frases, o pide a un colega de la
vía de código que teclee tus frases. Que los recibos sean idénticos byte a byte más adelante depende de que la regla sea una sola regla.

### 4 · Puerta de política — valídala, construye un paquete (10 min) — live

```bash
pipx install git+https://github.com/aigovops-foundation/umbrella-govops   # o: pip install .
umbrella-conformance check .            # la puerta de política: la regla es válida o no se ejecuta
umbrella-conformance bundle --out ./out # un paquete de evidencia firmable
umbrella-conformance verify ./out/bundle.tar.gz
```

Anota: check ☐ pasó ☐ falló (qué dijo: ______________). Ruta del paquete: ______________

*Fall:* `pipx install umbrella-conformance` desde PyPI; el vocabulario de la puerta (niveles, decisiones,
restricciones, condiciones de parada) validado por nombre; el catálogo de políticas acepta tu archivo por PR.

### 5 · Léelo, cambia una línea, diff (10 min) — live

```bash
pip install git+https://github.com/aigovops-foundation/aigovops-lantern.git
lantern read -f markdown -r compliance ./out/<receipts>.ndjson
```

Ahora debilita una regla — convierte el `C3 hold` en `C1 allow` —, reconstruye y:

```bash
lantern diff -r engineer ./before.ndjson ./after.ndjson
```

Escribe qué dijo el diff que cambió: ______________________________________

Devuelve la regla a su sitio. Esta es la puerta de Knight Capital: un cambio de política es en sí mismo un evento gobernado. En
tu CI, la puerta de política rechaza el merge hasta que un revisor vea ese diff. *(Fall: la GitHub
Action de Lantern lo publica en el PR.)*

### 6 · Pon una llamada real tras la puerta (10 min) — live con la puerta de nivel 1 · fall con el SDK

**Live.** El repositorio `aigovops` de la Fundación ejecuta la puerta sola, sin dependencias:
`node packages/cli/src/cli.mjs up --tier 1` desde un clon (ver su README). Haz pasar una de las llamadas a herramienta
de tu agente por ella durante una ejecución y guarda el recibo que escribe.

**Fall.** `pip install aigovops-beacon` · `beacon gate init` · envuelve la llamada:
`decision = gate.check(intent)` — solo el broker ejecuta, y solo lo aprobado.

En cualquier caso, anota el recibo: seq ____ · decisión ______ · hash de la acción __________

### 7 · Regresa (5 min) — live

Abre un PR que añada tu `policy.yaml` a este repositorio bajo `catalog/<tu-sistema>/` (fall: el catálogo de
Umbrella). Escribe cuatro frases para el pipeline de historias: qué hace el agente, qué no debe hacer nunca, qué
dijo la puerta, qué cambió. Jueves: empareja con un 100 y acompáñale a su primer recibo.

## Nadie se queda atrás

| Si tú… | Entonces… |
|---|---|
| no tienes un agente propio | Toma prestado el ejemplo resuelto Matchmaker de ese directorio. Adaptar un agente prestado es la misma práctica; la marca lo dice. |
| no puedes instalar nada (portátil bloqueado) | Haz los pasos 1–3 y 7 en papel; empareja el jueves con un 200 de la vía de código que ejecute los pasos 4–6 contigo en su máquina. La política sigue siendo tuya. |
| escribes política pero no código | Escribe las tres frases; la plantilla YAML junto a esta hoja tiene una línea que cambiar por frase. Wren te lee el YAML de vuelta como frases. |
| escribes código pero no política | Rellena el YAML; después léelo en voz alta como frases a una persona antes del jueves. Si frunce el ceño, la regla está mal, no quien escucha. |
| tienes diez minutos | Solo el paso 2 — las tres acciones con consecuencias, con nivel. Esa tabla es el verdadero trabajo del nivel; el resto es teclear. |
| lees español | Dilo en tu Wren Card y un anfitrión hispanohablante se empareja contigo. El jueves es a las 15:00 (hora del Pacífico). |

---

**Te llevas:** tu política en el catálogo; un paquete; un diff; una rebaja rechazada.
**Siguiente:** [Nivel 300 — Hold](../300-hold/WORKSHEET.md), cuando el agente toque personas, dinero o derechos.

---

## Lista de comprobación — una página

*Una página. Marca sobre la marcha.* · Escenarios VH-022 Chevrolet of Watsonville · VH-056 Knight Capital · 60 minutos · una instalación

**Antes**
- [ ] Soy un 100 (un anfitrión lo marcó).
- [ ] Tengo un agente, script, bot o flujo propio que llama a una herramienta.
- [ ] Python 3.11+ y git están instalados.

**Declarar**
- [ ] Listé las tres acciones con consecuencias de mi agente, con nivel y "¿reversible?" respondido.
- [ ] `policy.yaml` tiene un `C3 hold` con aprobador, un `C4 deny` con motivo y `default: deny`.
- [ ] Las reglas existen en ambas formas — frases y YAML — y dicen lo mismo.

**Puerta de política**
- [ ] `umbrella-conformance check .` pasó.
- [ ] `umbrella-conformance bundle` produjo un paquete; `verify` pasó sobre él.

**Leer · diff**
- [ ] `lantern read -r compliance` renderizó el paquete.
- [ ] Debilité una regla, reconstruí, ejecuté `lantern diff`, anoté qué dijo y devolví la regla a su sitio.
- [ ] Sé en qué punto de mi CI la puerta de política rechazaría esa rebaja.

**Decidir · probar**
- [ ] Una llamada real a herramienta pasó por una puerta (la puerta `aigovops` de nivel 1 hoy; el SDK en otoño) y tengo su recibo.

**Regresar**
- [ ] Mi `policy.yaml` está en un PR al catálogo.
- [ ] Las cuatro frases para el pipeline de historias están escritas.
- [ ] Jueves: acompañé a un 100 hasta su primer recibo.
- [ ] Un 300 o superior me marcó como 200.

---

*Traducción de [levels/200-retrofit/WORKSHEET.md](../../../../levels/200-retrofit/WORKSHEET.md); la versión en inglés manda.*
