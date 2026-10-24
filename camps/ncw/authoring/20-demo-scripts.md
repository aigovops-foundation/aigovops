# NCW AI Camp — 25 Live Demo Scripts

*5 personas × 5 tools = 25 examples · English + Spanish · For Bob & Ken · Aug 11, 2026*
*Site: [aigovops-ncw-ai-camp](https://aigovops-foundation.github.io/aigovops-ncw-ai-camp/) · [Tools page](https://aigovops-foundation.github.io/aigovops-ncw-ai-camp/tools)*

Each example is a 60–120 second live demo. Every one has the same 5 fields so Ken can run it from a card, and so we can print a handout in both languages.

**How to read a card:**
- **Script** — what Bob says and types, out loud.
- **Tool** — the exact link.
- **Good outcome** — what happens when it works. This is the "wow."
- **Bad outcome** — what happens when nobody kept the receipts. This is the failure mode we're teaching against.
- **Teachable moment** — the one sentence they take home.

---

# PERSONA 1 — TEACHER (Wenatchee, Cascade, Cashmere, Eastmont districts)

## 1.1 · Perplexity — "The grants question"

**Tool:** [perplexity.ai](https://www.perplexity.ai)
**Script (EN):** "Kim teaches 6th grade in Cashmere. Kim, what's a grant you wished you had time to find last spring? …OK — [types] *What are the top 5 STEM grants under $10K a Chelan County middle-school teacher can apply for in the next 90 days, with deadlines and eligibility?*"
**Guion (ES):** "Kim enseña sexto grado en Cashmere. Kim, ¿qué subvención te hubiera gustado tener tiempo de buscar la primavera pasada? …Bien — [escribe] *¿Cuáles son las 5 mejores subvenciones STEM de menos de $10,000 a las que puede aplicar un maestro de escuela intermedia del condado de Chelan en los próximos 90 días, con fechas límite y requisitos?*"
**Good outcome (EN):** Five grants come back with live citations Bob clicks on stage — funder name, deadline, dollar amount, and eligibility, each one traceable to a real URL.
**Buen resultado (ES):** Salen cinco subvenciones con citas en vivo que Bob abre en el escenario — nombre del financiador, fecha límite, monto, y elegibilidad, cada una con una URL verificable.
**Bad outcome (EN):** A different tool without citations invents a "Chelan Rural STEM Initiative" that doesn't exist. Kim spends a Saturday chasing it.
**Mal resultado (ES):** Otra herramienta sin citas inventa una "Iniciativa Rural STEM de Chelan" que no existe. Kim pierde un sábado buscándola.
**Teachable moment (EN):** *No citation, no click. If the AI can't show you where it got it, it didn't get it.*
**Lección (ES):** *Sin cita, no hay clic. Si la IA no te muestra de dónde lo sacó, no lo sacó de ningún lado.*

## 1.2 · NotebookLM — "The AUP podcast"

**Tool:** [notebooklm.google.com](https://notebooklm.google.com)
**Script (EN):** "I dropped Kim's district AUP, the WA OSPI AI guidance, and one board memo into NotebookLM this morning. Watch — I hit *Audio Overview*. Two hosts are about to explain Kim's 40-page policy in 8 minutes, grounded only in those three files."
**Guion (ES):** "Esta mañana subí el AUP del distrito de Kim, la guía de IA de OSPI Washington, y un memo del consejo escolar a NotebookLM. Mira — presiono *Resumen de audio*. Dos presentadores van a explicar la política de 40 páginas de Kim en 8 minutos, basándose solo en esos tres archivos."
**Good outcome (EN):** A two-voice podcast plays. Every claim is anchored to a page in one of the three sources. Kim can send it to parents Monday morning.
**Buen resultado (ES):** Se reproduce un podcast de dos voces. Cada afirmación está anclada a una página de una de las tres fuentes. Kim se lo puede enviar a los padres el lunes por la mañana.
**Bad outcome (EN):** Same summary made in ChatGPT without the source files hallucinates a "parent opt-in requirement" that isn't in the district AUP. Kim tells parents something wrong and has to walk it back at the next PTA.
**Mal resultado (ES):** El mismo resumen hecho en ChatGPT sin los archivos fuente inventa un "requisito de consentimiento parental" que no está en el AUP del distrito. Kim les dice algo falso a los padres y tiene que retractarse en la próxima reunión de la PTA.
**Teachable moment (EN):** *Ground it or lose it. AI that reads your documents beats AI that guesses at them.*
**Lección (ES):** *O lo anclas en tus documentos, o lo pierdes. Una IA que lee tus documentos le gana a una IA que los adivina.*

## 1.3 · Khanmigo — "The Socratic tutor"

**Tool:** [khanacademy.org/khan-labs](https://www.khanacademy.org/khan-labs)
**Script (EN):** "Kim's 6th grader Maria is stuck on fractions. Watch what Khanmigo does — I'm going to ask it for the answer to *3/4 + 5/6*. See? It won't give it. It asks Maria what a common denominator is. Kim, that's the difference between a tutor and a cheat sheet."
**Guion (ES):** "La estudiante de sexto grado de Kim, María, está atascada con las fracciones. Mira lo que hace Khanmigo — le voy a pedir la respuesta a *3/4 + 5/6*. ¿Ves? No la da. Le pregunta a María qué es un común denominador. Kim, esa es la diferencia entre un tutor y una copia."
**Good outcome (EN):** Khanmigo refuses to answer directly, walks Maria through denominators, and Maria writes her own answer. Confidence goes up, not down.
**Buen resultado (ES):** Khanmigo se niega a responder directamente, guía a María paso a paso, y María escribe su propia respuesta. La confianza sube, no baja.
**Bad outcome (EN):** A general chatbot gives Maria the answer *19/12* in one line. She copies it, doesn't learn a thing, and next week she can't do 2/3 + 1/4. Her "ability to spot fake news" — and to think — drops the way Jake's did.
**Mal resultado (ES):** Un chatbot general le da a María la respuesta *19/12* en una línea. Ella la copia, no aprende nada, y la próxima semana no puede hacer 2/3 + 1/4. Su capacidad de pensar — y de detectar noticias falsas — baja como la de Jake.
**Teachable moment (EN):** *The tutor asks. The cheat sheet tells. Pick the one that grows the kid.*
**Lección (ES):** *El tutor pregunta. La copia dicta. Elige la que haga crecer al niño.*

## 1.4 · Gamma — "Parent night in 90 seconds"

**Tool:** [gamma.app](https://gamma.app)
**Script (EN):** "Kim has parent night Thursday. [types] *Make a 6-slide parent-night deck for a 6th-grade class on how we're using AI this year — one slide per topic: what we use, what we don't, how we protect student data, how kids show their work, how parents can help, how to reach me.*"
**Guion (ES):** "Kim tiene noche de padres el jueves. [escribe] *Haz una presentación de 6 diapositivas para noche de padres de sexto grado sobre cómo estamos usando IA este año — una diapositiva por tema: qué usamos, qué no usamos, cómo protegemos los datos del estudiante, cómo los niños muestran su trabajo, cómo pueden ayudar los padres, cómo contactarme.*"
**Good outcome (EN):** A polished 6-slide deck appears in 40 seconds. Kim edits two lines and it's done. Parents get a real deck, not a photocopied handout.
**Buen resultado (ES):** Aparece una presentación pulida de 6 diapositivas en 40 segundos. Kim edita dos líneas y está lista. Los padres reciben una presentación real, no una fotocopia.
**Bad outcome (EN):** Kim writes it herself at 11pm Wednesday, skips it, or shows up with a bulleted Word doc parents can't read from the back row. Parent night quality reflects teacher exhaustion, not teacher skill.
**Mal resultado (ES):** Kim la escribe ella misma a las 11 de la noche el miércoles, la salta, o llega con un Word con viñetas que los padres no pueden leer desde atrás. La calidad de la noche de padres refleja el cansancio del maestro, no su habilidad.
**Teachable moment (EN):** *AI does the painful part. Kim does the judgment part. That's the deal.*
**Lección (ES):** *La IA hace la parte dolorosa. Kim hace la parte del criterio. Ese es el trato.*

## 1.5 · Claude — "The AUP for a 5th grader"

**Tool:** [claude.ai](https://claude.ai)
**Script (EN):** "Kim's district AUP is 42 pages of legal English. [paste] *Rewrite this AUP as a one-page letter a 5th grader can read out loud to their family at dinner. Keep every real rule. Cut every acronym.*"
**Guion (ES):** "El AUP del distrito de Kim tiene 42 páginas en inglés legal. [pega] *Reescribe este AUP como una carta de una página que un niño de quinto grado pueda leerle a su familia en la cena. Mantén cada regla real. Elimina cada sigla.*"
**Good outcome (EN):** A one-page letter appears. Every rule from the 42 pages is still in there, but a fifth grader can read it. Kim sends it home in the Friday folder.
**Buen resultado (ES):** Aparece una carta de una página. Cada regla de las 42 páginas sigue ahí, pero un niño de quinto grado la puede leer. Kim la manda a casa en la carpeta del viernes.
**Bad outcome (EN):** Kim doesn't translate it. Families never read the AUP. Six months later a kid violates a rule nobody in the house knew existed, and the parents blame the school.
**Mal resultado (ES):** Kim no lo traduce. Las familias nunca leen el AUP. Seis meses después un niño viola una regla que nadie en la casa sabía que existía, y los padres culpan a la escuela.
**Teachable moment (EN):** *A rule nobody can read is a rule nobody follows. Translation IS enforcement.*
**Lección (ES):** *Una regla que nadie puede leer es una regla que nadie sigue. La traducción ES el cumplimiento.*

---

# PERSONA 2 — UTILITY DISTRICT (Chelan, Douglas, Grant PUDs)

## 2.1 · Granola — "The commission meeting notes"

**Tool:** [granola.ai](https://granola.ai)
**Script (EN):** "Dave runs operations at Chelan PUD. Every Tuesday there's a commission meeting. Dave takes bad notes, misses things, and writes up the minutes on Saturday. Watch — I turn Granola on, we roleplay 90 seconds of a meeting, and it hands Dave clean, timestamped minutes with action items."
**Guion (ES):** "Dave dirige operaciones en el PUD de Chelan. Cada martes hay una reunión de la comisión. Dave toma malas notas, se le olvidan cosas, y escribe las actas el sábado. Mira — enciendo Granola, hacemos un juego de 90 segundos de reunión, y le entrega a Dave actas limpias, con marcas de tiempo y elementos de acción."
**Good outcome (EN):** Real minutes at meeting-end, not Saturday. Action items with owners. Public commissioners can cite the record.
**Buen resultado (ES):** Actas reales al final de la reunión, no el sábado. Elementos de acción con responsables. Los comisionados públicos pueden citar el registro.
**Bad outcome (EN):** A different transcription tool posts full audio to a cloud without a retention policy. Six months later a public records request pulls up an off-hand comment Dave made about a customer. Now it's front page news.
**Mal resultado (ES):** Otra herramienta de transcripción sube el audio completo a la nube sin política de retención. Seis meses después una solicitud de registros públicos saca un comentario informal que Dave hizo sobre un cliente. Ahora está en primera plana.
**Teachable moment (EN):** *Where the transcript lives matters more than that it exists. Public agencies need retention rules before they need better notes.*
**Lección (ES):** *Dónde vive la transcripción importa más que el hecho de que exista. Las agencias públicas necesitan reglas de retención antes de necesitar mejores notas.*

## 2.2 · n8n — "The outage workflow"

**Tool:** [n8n.io](https://n8n.io)
**Script (EN):** "When a substation trips, Dave gets a text, then a page, then an email, then he calls three people. Watch — I built a 4-node n8n workflow: SCADA alert → Gemini classifies severity → auto-drafts the customer notice in English AND Spanish → posts to the outage map. Trigger it live."
**Guion (ES):** "Cuando una subestación se dispara, Dave recibe un texto, luego un pager, luego un email, luego llama a tres personas. Mira — construí un flujo de trabajo de 4 nodos en n8n: alerta SCADA → Gemini clasifica la severidad → redacta el aviso al cliente en inglés Y español → publica en el mapa de cortes. Actívalo en vivo."
**Good outcome (EN):** In 45 seconds after the alert, customers in both languages see a real notice on the outage page. Dave answers 80% fewer angry calls.
**Buen resultado (ES):** En 45 segundos después de la alerta, los clientes en ambos idiomas ven un aviso real en la página de cortes. Dave contesta 80% menos llamadas enojadas.
**Bad outcome (EN):** The workflow auto-posts an unreviewed message that guesses the wrong cause ("wildlife contact") when it was a planned test. Now the PUD has told the public something false, at scale, in two languages.
**Mal resultado (ES):** El flujo publica automáticamente un mensaje no revisado que adivina mal la causa ("contacto con fauna") cuando fue una prueba planeada. Ahora el PUD le dijo algo falso al público, a escala, en dos idiomas.
**Teachable moment (EN):** *Automation without a human checkpoint scales your mistakes as fast as your wins. Put a person on the "publish" button.*
**Lección (ES):** *La automatización sin un punto de control humano escala tus errores tan rápido como tus aciertos. Pon una persona en el botón de "publicar."*

## 2.3 · Perplexity — "The compliance question"

**Tool:** [perplexity.ai](https://www.perplexity.ai)
**Script (EN):** "Dave has a WAC compliance question. [types] *What does WAC 480-100 require a Washington PUD to disclose to a residential customer before a disconnect for non-payment? Cite the WAC section.*"
**Guion (ES):** "Dave tiene una pregunta de cumplimiento del WAC. [escribe] *¿Qué requiere el WAC 480-100 que un PUD de Washington le divulgue a un cliente residencial antes de una desconexión por falta de pago? Cita la sección del WAC.*"
**Good outcome (EN):** The exact WAC section, quoted, with a link. Dave verifies it in one click against apps.leg.wa.gov.
**Buen resultado (ES):** La sección exacta del WAC, citada, con un enlace. Dave la verifica en un clic contra apps.leg.wa.gov.
**Bad outcome (EN):** A no-citation AI paraphrases a California rule and calls it Washington. Dave uses it in a customer letter. The customer's attorney has a field day.
**Mal resultado (ES):** Una IA sin citas parafrasea una regla de California y la llama Washington. Dave la usa en una carta al cliente. El abogado del cliente hace fiesta.
**Teachable moment (EN):** *Regulated industries can't paraphrase. Cite the section or don't send the letter.*
**Lección (ES):** *Las industrias reguladas no pueden parafrasear. O citas la sección, o no mandas la carta.*

## 2.4 · Claude — "The 5-sentence disconnect policy"

**Tool:** [claude.ai](https://claude.ai)
**Script (EN):** "Dave's disconnect policy is 6 pages. Field crews don't read 6 pages. [paste] *Turn this into a 5-sentence field card a lineworker can read in the truck. Keep every legal requirement. Lose every adverb.*"
**Guion (ES):** "La política de desconexión de Dave tiene 6 páginas. Las cuadrillas de campo no leen 6 páginas. [pega] *Conviértelo en una tarjeta de campo de 5 oraciones que un lineworker pueda leer en la camioneta. Mantén cada requisito legal. Elimina cada adverbio.*"
**Good outcome (EN):** A 5-sentence card. Legal signs off in a day. Crews actually read it. Fewer wrongful-disconnect claims.
**Buen resultado (ES):** Una tarjeta de 5 oraciones. Legal la aprueba en un día. Las cuadrillas de verdad la leen. Menos reclamos por desconexión indebida.
**Bad outcome (EN):** Nobody translates the 6-page policy for the field. Two years later a wrongful disconnect makes the local paper and the PUD's lawyer finds out the field crew "never saw" the current version.
**Mal resultado (ES):** Nadie traduce la política de 6 páginas para el campo. Dos años después una desconexión indebida sale en el periódico y el abogado del PUD descubre que la cuadrilla "nunca vio" la versión actual.
**Teachable moment (EN):** *Compression is a safety control. If it doesn't fit on the dashboard, it doesn't get followed.*
**Lección (ES):** *La compresión es un control de seguridad. Si no cabe en el tablero, no se cumple.*

## 2.5 · Magic Patterns — "The outage map redesign"

**Tool:** [magicpatterns.com](https://magicpatterns.com)
**Script (EN):** "Dave's outage map hasn't been redesigned since 2014. [types] *Design a mobile-first outage map for a rural utility with Spanish toggle, ETA, and a 'text me when restored' button. Three variants.*"
**Guion (ES):** "El mapa de cortes de Dave no se ha rediseñado desde 2014. [escribe] *Diseña un mapa de cortes móvil-primero para una utility rural, con conmutador de español, ETA, y un botón de 'avísame cuando esté restaurado.' Tres variantes.*"
**Good outcome (EN):** Three real, clickable UI mockups on screen in under a minute. Dave takes screenshots to the next commissioner meeting. Design conversation is now concrete, not abstract.
**Buen resultado (ES):** Tres mockups reales y clickeables en pantalla en menos de un minuto. Dave lleva capturas a la próxima reunión de comisionados. La conversación de diseño ahora es concreta, no abstracta.
**Bad outcome (EN):** Dave hires a $60K consultant to produce PDFs of concepts. Six months later still no map. Rate-payers paid for slides.
**Mal resultado (ES):** Dave contrata un consultor de $60,000 que entrega PDFs de conceptos. Seis meses después todavía no hay mapa. Los ratepayers pagaron por diapositivas.
**Teachable moment (EN):** *Prototypes are cheaper than opinions. Ship a mockup on Tuesday, argue Wednesday.*
**Lección (ES):** *Los prototipos son más baratos que las opiniones. Publica un mockup el martes, discute el miércoles.*

---

# PERSONA 3 — TRIBAL COUNCIL (Colville, Yakama, Wenatchi tribal offices)

## 3.1 · Perplexity — "The treaty rights question"

**Tool:** [perplexity.ai](https://www.perplexity.ai)
**Script (EN):** "Councilwoman Rita has a question that comes up every year. [types] *What are the current legal citations for Colville-reserved fishing and hunting rights under the 1891 agreement, and what recent court decisions from 2023–2026 affect them? Cite each source.*"
**Guion (ES):** "La consejera Rita tiene una pregunta que sale cada año. [escribe] *¿Cuáles son las citas legales actuales de los derechos reservados de pesca y caza de Colville bajo el acuerdo de 1891, y qué decisiones judiciales recientes de 2023–2026 los afectan? Cita cada fuente.*"
**Good outcome (EN):** Real cases, real cites, real dates. Rita's legal team verifies in an hour instead of a week.
**Buen resultado (ES):** Casos reales, citas reales, fechas reales. El equipo legal de Rita verifica en una hora en vez de una semana.
**Bad outcome (EN):** A no-citation AI hallucinates a *United States v. Colville* case that doesn't exist. Rita cites it in a public comment. The tribe loses credibility with the state.
**Mal resultado (ES):** Una IA sin citas alucina un caso *Estados Unidos v. Colville* que no existe. Rita lo cita en un comentario público. La tribu pierde credibilidad con el estado.
**Teachable moment (EN):** *For sovereign nations, a fake citation isn't a bug — it's a treaty violation risk. Verify every source.*
**Lección (ES):** *Para naciones soberanas, una cita falsa no es un error — es un riesgo de violación de tratado. Verifica cada fuente.*

## 3.2 · NotebookLM — "The equity briefing"

**Tool:** [notebooklm.google.com](https://notebooklm.google.com)
**Script (EN):** "Rita drops the tribe's language-preservation plan, three federal AI equity memos, and the NCW pledge into NotebookLM. Ask it: *Where does the federal guidance align with our language-preservation plan, and where does it fall short? Cite pages.*"
**Guion (ES):** "Rita sube el plan de preservación del idioma de la tribu, tres memos federales de equidad de IA, y el compromiso de NCW a NotebookLM. Le pregunta: *¿Dónde se alinea la guía federal con nuestro plan de preservación del idioma, y dónde se queda corta? Cita las páginas.*"
**Good outcome (EN):** A cited gap analysis Rita can hand to her federal-relations attorney Monday. Every claim links to a specific page.
**Buen resultado (ES):** Un análisis de brechas con citas que Rita le entrega a su abogada de relaciones federales el lunes. Cada afirmación enlaza a una página específica.
**Bad outcome (EN):** Rita uses a general chatbot that "summarizes" the docs but silently omits the tribe's plan (upload size limit) and pretends to have read it. Decisions get made against a document the AI never saw.
**Mal resultado (ES):** Rita usa un chatbot general que "resume" los documentos pero omite en silencio el plan de la tribu (por el límite de tamaño) y finge haberlo leído. Se toman decisiones contra un documento que la IA nunca vio.
**Teachable moment (EN):** *If the AI won't tell you what it did and didn't read, it didn't read.*
**Lección (ES):** *Si la IA no te dice qué leyó y qué no, no leyó nada.*

## 3.3 · Gemini Deep Think + Model Council — "The disagreement is the data"

**Tool:** [gemini.google.com](https://gemini.google.com)
**Script (EN):** "I'm asking Gemini Deep Think AND Claude the same question: *Should a tribal government use a US-hosted commercial LLM for internal deliberations about sovereignty issues? What are the tradeoffs?* Watch — they disagree. That disagreement IS the briefing. Screenshot it, take it to council."
**Guion (ES):** "Le hago la misma pregunta a Gemini Deep Think Y a Claude: *¿Debería un gobierno tribal usar un LLM comercial alojado en EE.UU. para deliberaciones internas sobre asuntos de soberanía? ¿Cuáles son los compromisos?* Mira — no están de acuerdo. Ese desacuerdo ES el informe. Captura la pantalla, llévalo al consejo."
**Good outcome (EN):** Two thoughtful, contradictory analyses. Rita walks into council with the argument on both sides pre-written.
**Buen resultado (ES):** Dos análisis reflexivos y contradictorios. Rita entra al consejo con el argumento de ambos lados pre-escrito.
**Bad outcome (EN):** Rita asks only one model, gets one answer, treats it as truth, and council makes a sovereignty-affecting decision on a single vendor's worldview.
**Mal resultado (ES):** Rita le pregunta solo a un modelo, recibe una respuesta, la trata como verdad, y el consejo toma una decisión que afecta la soberanía basada en la visión de un solo proveedor.
**Teachable moment (EN):** *One model is an opinion. Two models is a decision. When the stakes are sovereignty, always ask twice.*
**Lección (ES):** *Un modelo es una opinión. Dos modelos son una decisión. Cuando lo que está en juego es la soberanía, pregunta siempre dos veces.*

## 3.4 · Wispr Flow — "The elder interview"

**Tool:** [wisprflow.ai](https://wisprflow.ai)
**Script (EN):** "Rita is documenting an elder's oral history in the tribe's language. She's typing while he talks, which is disrespectful. Watch — Wispr Flow lets Rita speak naturally in English AND get clean, formatted transcripts. Elders keep their dignity, Rita keeps the record."
**Guion (ES):** "Rita está documentando la historia oral de un anciano en el idioma de la tribu. Está escribiendo mientras él habla, lo cual es una falta de respeto. Mira — Wispr Flow le permite a Rita hablar naturalmente en inglés Y obtener transcripciones limpias y formateadas. Los ancianos conservan su dignidad, Rita conserva el registro."
**Good outcome (EN):** Rita puts her laptop away, listens with both eyes, and dictates the summary later. The elder feels heard. The archive gets richer.
**Buen resultado (ES):** Rita guarda la laptop, escucha con ambos ojos, y dicta el resumen después. El anciano se siente escuchado. El archivo se enriquece.
**Bad outcome (EN):** Rita uses a live-transcription tool that uploads audio in the tribe's language to a US company's servers with unclear terms. Sacred knowledge now sits on someone else's disk.
**Mal resultado (ES):** Rita usa una herramienta de transcripción en vivo que sube el audio en el idioma de la tribu a los servidores de una empresa de EE.UU. con términos poco claros. El conocimiento sagrado ahora vive en el disco de otro.
**Teachable moment (EN):** *Data sovereignty is tribal sovereignty. Before the tool, read the terms — especially for language and cultural data.*
**Lección (ES):** *La soberanía de datos es soberanía tribal. Antes de la herramienta, lee los términos — especialmente para datos de idioma y cultura.*

## 3.5 · Lovable — "The public comment portal"

**Tool:** [lovable.dev](https://lovable.dev)
**Script (EN):** "Rita needs a public comment form for a new tribal ordinance. Written in the tribe's language, English, AND Spanish, with an audio-comment option for elders who don't type. [types the spec] Watch it build. Ship it to a subdomain. It's live before Block 1 ends."
**Guion (ES):** "Rita necesita un formulario de comentarios públicos para una nueva ordenanza tribal. Escrito en el idioma de la tribu, inglés, Y español, con opción de comentario de audio para ancianos que no escriben. [escribe la especificación] Míralo construirse. Publícalo a un subdominio. Está en vivo antes de que termine el Bloque 1."
**Good outcome (EN):** A real, working, tri-lingual comment portal deployed in 90 seconds. Council can start collecting comments this week.
**Buen resultado (ES):** Un portal de comentarios trilingüe real, funcional, desplegado en 90 segundos. El consejo puede empezar a recolectar comentarios esta semana.
**Bad outcome (EN):** The tribe waits 8 months and $40K for a vendor to build an English-only form with a Google Translate widget slapped on top. Elders don't use it. Nobody comments. Council calls it "engagement."
**Mal resultado (ES):** La tribu espera 8 meses y $40,000 para que un proveedor construya un formulario solo en inglés con un widget de Google Translate encima. Los ancianos no lo usan. Nadie comenta. El consejo lo llama "participación."
**Teachable moment (EN):** *If the tool doesn't reach the elder, it isn't worth the electricity. From the pledge.*
**Lección (ES):** *Si la herramienta no llega al anciano, no vale la electricidad. Del compromiso.*

---

# PERSONA 4 — HEALTHCARE (Leavenworth clinic, Cascade Medical, Confluence Health)

## 4.1 · ChatGPT — "The 5-sentence front-desk policy"

**Tool:** [chatgpt.com](https://chatgpt.com)
**Script (EN):** "Dr. Mendez runs a Leavenworth clinic. Front desk uses AI tools without a policy. [types] *Draft a 5-sentence AI-use policy for a small primary care clinic front desk. Cover: what patient data can and cannot go into an LLM, when to disclose AI use to a patient, and who to call if unsure. Plain English, one page, 8th-grade reading level.*"
**Guion (ES):** "La Dra. Méndez dirige una clínica en Leavenworth. La recepción usa herramientas de IA sin política. [escribe] *Redacta una política de uso de IA de 5 oraciones para la recepción de una clínica pequeña de atención primaria. Cubre: qué datos del paciente pueden y no pueden entrar en un LLM, cuándo revelarle al paciente que se usó IA, y a quién llamar en caso de duda. Inglés sencillo, una página, nivel de octavo grado.*"
**Good outcome (EN):** A one-page policy on Dr. Mendez's desk in 30 seconds. She hand-edits two lines. Every front-desk staffer signs it Monday. HIPAA risk drops.
**Buen resultado (ES):** Una política de una página en el escritorio de la Dra. Méndez en 30 segundos. Ella edita dos líneas a mano. Cada recepcionista la firma el lunes. El riesgo HIPAA baja.
**Bad outcome (EN):** No policy. Front desk pastes patient names into a chatbot to draft appointment reminders "faster." One tool has a public training data setting turned on by default. Now that's a breach.
**Mal resultado (ES):** Sin política. La recepción pega nombres de pacientes en un chatbot para redactar recordatorios "más rápido." Una herramienta tiene la opción de entrenamiento público activada por defecto. Ahora eso es una violación.
**Teachable moment (EN):** *A 5-sentence policy beats a 50-page policy nobody reads. Short + signed > long + shelved.*
**Lección (ES):** *Una política de 5 oraciones le gana a una política de 50 páginas que nadie lee. Corta + firmada > larga + archivada.*

## 4.2 · Perplexity — "The medication interaction check"

**Tool:** [perplexity.ai](https://www.perplexity.ai)
**Script (EN):** "**IMPORTANT — DEMO ONLY, NOT CLINICAL ADVICE.** Dr. Mendez runs a lookup: *What are the current documented interactions between apixaban and amiodarone in patients over 75, with citations to primary literature from 2023–2026?* She'll verify against UpToDate before acting."
**Guion (ES):** "**IMPORTANTE — SOLO DEMO, NO ES CONSEJO CLÍNICO.** La Dra. Méndez hace una consulta: *¿Cuáles son las interacciones documentadas actuales entre apixabán y amiodarona en pacientes mayores de 75, con citas a literatura primaria de 2023–2026?* Ella lo va a verificar contra UpToDate antes de actuar."
**Good outcome (EN):** Real papers, real DOIs, real dates. Dr. Mendez has a starting point in 20 seconds instead of 20 minutes. She still cross-checks UpToDate — the AI accelerates, doesn't decide.
**Buen resultado (ES):** Papers reales, DOIs reales, fechas reales. La Dra. Méndez tiene un punto de partida en 20 segundos en vez de 20 minutos. Sigue verificando contra UpToDate — la IA acelera, no decide.
**Bad outcome (EN):** A no-citation chatbot hallucinates a 2024 NEJM paper that doesn't exist. Dr. Mendez cites it in a note. Two years later a malpractice attorney asks her to produce the paper. She can't.
**Mal resultado (ES):** Un chatbot sin citas alucina un artículo del NEJM de 2024 que no existe. La Dra. Méndez lo cita en una nota. Dos años después un abogado de mala praxis le pide que produzca el artículo. No puede.
**Teachable moment (EN):** *In clinical settings, AI accelerates the lookup. It never replaces the verification. Two-source rule, always.*
**Lección (ES):** *En entornos clínicos, la IA acelera la búsqueda. Nunca reemplaza la verificación. Regla de dos fuentes, siempre.*

## 4.3 · Granola — "The visit note draft"

**Tool:** [granola.ai](https://granola.ai)
**Script (EN):** "Dr. Mendez sees 22 patients a day and charts until 9pm. Watch — she turns Granola on for a 90-second mock visit (with the patient's consent, on the sign-in form). It hands her a draft SOAP note. She edits, she signs. She's home at 6."
**Guion (ES):** "La Dra. Méndez ve 22 pacientes al día y hace notas hasta las 9 de la noche. Mira — enciende Granola para una visita simulada de 90 segundos (con el consentimiento del paciente, en el formulario de registro). Le entrega un borrador de nota SOAP. Ella edita, firma. Está en casa a las 6."
**Good outcome (EN):** Charting time drops from 3 hours/day to 45 minutes. Dr. Mendez's burnout risk drops. Notes are more complete, not less.
**Buen resultado (ES):** El tiempo de notas baja de 3 horas al día a 45 minutos. El riesgo de burnout de la Dra. Méndez baja. Las notas son más completas, no menos.
**Bad outcome (EN):** The clinic uses ambient-scribe AI without patient consent and without a BAA (Business Associate Agreement). One patient learns after the fact and files an OCR complaint. HHS fines follow.
**Mal resultado (ES):** La clínica usa IA de escriba ambiental sin consentimiento del paciente y sin un BAA (Acuerdo de Asociado Comercial). Un paciente se entera después y presenta una queja ante OCR. Siguen las multas de HHS.
**Teachable moment (EN):** *Consent + BAA are non-negotiable in healthcare. The tool is only as safe as the paperwork behind it.*
**Lección (ES):** *El consentimiento + el BAA son innegociables en salud. La herramienta es tan segura como el papeleo que la respalda.*

## 4.4 · Bolt — "The Spanish patient intake form"

**Tool:** [bolt.new](https://bolt.new)
**Script (EN):** "Half of Dr. Mendez's patients are Spanish-first. The clinic's intake form is English-only with a paper Spanish version that's 4 versions out of date. [types] *Build a bilingual patient intake form, English + Spanish, mobile-friendly, that emails a PDF to the clinic. Include allergies, meds, and a plain-language HIPAA notice.* Ship it."
**Guion (ES):** "La mitad de los pacientes de la Dra. Méndez habla español primero. El formulario de admisión de la clínica está solo en inglés, con una versión en papel en español que tiene 4 versiones de retraso. [escribe] *Construye un formulario bilingüe de admisión de paciente, inglés + español, apto para móvil, que envíe un PDF por correo a la clínica. Incluye alergias, medicamentos, y un aviso HIPAA en lenguaje sencillo.* Publícalo."
**Good outcome (EN):** A working bilingual form deployed in 2 minutes. Spanish-first patients fill it out at home. Front desk stops re-typing.
**Buen resultado (ES):** Un formulario bilingüe funcional desplegado en 2 minutos. Los pacientes hispanohablantes lo llenan en casa. La recepción deja de re-escribir.
**Bad outcome (EN):** The clinic ships an English-only form with a Google Translate button. The Spanish version drops medication frequency fields. Dosing errors get logged in QA as "patient miscommunication."
**Mal resultado (ES):** La clínica publica un formulario solo en inglés con un botón de Google Translate. La versión en español pierde los campos de frecuencia de medicamento. Los errores de dosificación se registran en QA como "mala comunicación del paciente."
**Teachable moment (EN):** *Translation is a safety feature, not a marketing feature. Build both versions from the same spec, not with a plug-in on top.*
**Lección (ES):** *La traducción es una función de seguridad, no de marketing. Construye ambas versiones desde la misma especificación, no con un plug-in encima.*

## 4.5 · ChatPRD — "The AI-vendor questionnaire"

**Tool:** [chatprd.ai](https://www.chatprd.ai)
**Script (EN):** "Dr. Mendez is being pitched by three AI-scribe vendors. [types] *Draft a 12-question vendor questionnaire for a small clinic evaluating ambient-scribe AI. Cover BAA, training data usage, retention, audit logs, uptime, price, red-team results, and off-boarding.* Print it. Hand it to all three."
**Guion (ES):** "A la Dra. Méndez le están vendiendo tres proveedores de IA de escriba. [escribe] *Redacta un cuestionario de 12 preguntas para una clínica pequeña evaluando IA de escriba ambiental. Cubre BAA, uso de datos de entrenamiento, retención, registros de auditoría, tiempo de actividad, precio, resultados de red-team, y salida del contrato.* Imprímelo. Entrégaselo a los tres."
**Good outcome (EN):** A real questionnaire in 40 seconds. Two of the three vendors decline to answer half the questions. Now Dr. Mendez knows which vendor to pick — and which two to walk away from.
**Buen resultado (ES):** Un cuestionario real en 40 segundos. Dos de los tres proveedores se niegan a contestar la mitad de las preguntas. Ahora la Dra. Méndez sabe cuál proveedor elegir — y de cuáles dos alejarse.
**Bad outcome (EN):** Dr. Mendez picks the vendor with the nicest sales rep and cheapest month-one price. Twelve months later, her patient data is being used to train the vendor's next model. She finds out from a news article.
**Mal resultado (ES):** La Dra. Méndez elige al proveedor con el mejor vendedor y el precio más barato del primer mes. Doce meses después, los datos de sus pacientes se están usando para entrenar el próximo modelo del proveedor. Se entera por una nota de prensa.
**Teachable moment (EN):** *The vendor who won't answer your questionnaire is the vendor whose contract you don't sign. AI procurement IS AI governance.*
**Lección (ES):** *El proveedor que no contesta tu cuestionario es el proveedor cuyo contrato no firmas. La adquisición de IA ES gobernanza de IA.*

---

# PERSONA 5 — SMALL BUSINESS (Wenatchee/Leavenworth Main Street: winery, orchard, restaurant, retail, trades)

## 5.1 · Lovable — "The Sunday hours website"

**Tool:** [lovable.dev](https://lovable.dev)
**Script (EN):** "Marisol runs a taquería in Wenatchee. Her website is a Facebook page from 2019 with wrong hours. [types] *Build a 1-page website for Marisol's Taquería: hours, menu, phone, Google Maps embed, order-ahead button, mobile-first, English + Spanish.* Ship it. Point a QR code at it."
**Guion (ES):** "Marisol tiene una taquería en Wenatchee. Su sitio es una página de Facebook de 2019 con horarios equivocados. [escribe] *Construye un sitio web de una página para la Taquería de Marisol: horarios, menú, teléfono, embed de Google Maps, botón de pedido anticipado, móvil-primero, inglés + español.* Publícalo. Apunta un código QR a él."
**Good outcome (EN):** A real, live, bilingual site in under 2 minutes. Marisol changes her hours in her phone anytime. She stops paying $89/mo to a "web guy."
**Buen resultado (ES):** Un sitio real, en vivo, bilingüe en menos de 2 minutos. Marisol cambia sus horarios desde el teléfono en cualquier momento. Deja de pagar $89 al mes a un "chico de la web."
**Bad outcome (EN):** Marisol pays $3,500 to a template shop that ships in 8 weeks. It's beautiful and static. In month three, hours change and she can't update it. She goes back to Facebook.
**Mal resultado (ES):** Marisol paga $3,500 a un taller de plantillas que entrega en 8 semanas. Es bonito y estático. Al tercer mes cambian los horarios y no lo puede actualizar. Regresa a Facebook.
**Teachable moment (EN):** *The site you can change yourself beats the site somebody else owns. Ownership > polish.*
**Lección (ES):** *El sitio que tú puedes cambiar le gana al sitio que otro es dueño. Propiedad > pulido.*

## 5.2 · Gamma — "The investor one-pager"

**Tool:** [gamma.app](https://gamma.app)
**Script (EN):** "Tom is expanding his cider orchard and needs a one-pager for the bank. [types] *One-page investor summary for a cider orchard expansion: current acreage, projected revenue, capex ask, 3-year P&L, comparable operations in Chelan County. Numbers I feed you, story you shape.* He edits, prints, walks in Monday."
**Guion (ES):** "Tom está expandiendo su huerto de sidra y necesita una página para el banco. [escribe] *Resumen de una página para inversores sobre una expansión de huerto de sidra: acreaje actual, ingresos proyectados, solicitud de capex, P&L de 3 años, operaciones comparables en el condado de Chelan. Yo pongo los números, tú das forma a la historia.* Edita, imprime, entra el lunes."
**Good outcome (EN):** A tight, professional one-pager that would have cost $2K and three weeks with a consultant. Tom's banker takes him seriously.
**Buen resultado (ES):** Una página apretada y profesional que hubiera costado $2,000 y tres semanas con un consultor. El banquero de Tom lo toma en serio.
**Bad outcome (EN):** Tom fabricates a "comparable orchard" number he read in Gamma's draft without checking it. The banker Googles it. The pitch dies.
**Mal resultado (ES):** Tom inventa un número de "huerto comparable" que leyó en el borrador de Gamma sin verificarlo. El banquero lo googlea. La propuesta muere.
**Teachable moment (EN):** *Gamma writes the pitch. YOU verify the numbers. AI is the intern, not the CFO.*
**Lección (ES):** *Gamma escribe la propuesta. TÚ verificas los números. La IA es la becaria, no la directora financiera.*

## 5.3 · Replit Agent — "The reservation booker"

**Tool:** [replit.com](https://replit.com)
**Script (EN):** "Marisol turns away 30 calls a night when the taquería is slammed. [types] *Build me a Replit app: web form + SMS confirmation for reservations, capped at 6 tables/hour, English + Spanish, sends to Marisol's phone.* Ship it. Text the number from the room."
**Guion (ES):** "Marisol rechaza 30 llamadas por noche cuando la taquería está llena. [escribe] *Constrúyeme una app en Replit: formulario web + confirmación SMS para reservaciones, con tope de 6 mesas por hora, inglés + español, envía al teléfono de Marisol.* Publícala. Manda un mensaje al número desde la sala."
**Good outcome (EN):** A live booking system in 3 minutes. Marisol takes 20 more reservations a night without picking up the phone.
**Buen resultado (ES):** Un sistema de reservaciones en vivo en 3 minutos. Marisol toma 20 reservaciones más por noche sin contestar el teléfono.
**Bad outcome (EN):** She uses a free tool that double-books tables because it has no capacity logic. Saturday night is a disaster. Yelp punishes her for two weeks.
**Mal resultado (ES):** Usa una herramienta gratis que sobrerreserva mesas porque no tiene lógica de capacidad. La noche del sábado es un desastre. Yelp la castiga por dos semanas.
**Teachable moment (EN):** *"Free" without the rule you need costs more than "paid" with the rule you need. Model the constraint before you ship the tool.*
**Lección (ES):** *"Gratis" sin la regla que necesitas cuesta más que "pagado" con la regla que necesitas. Modela la restricción antes de publicar la herramienta.*

## 5.4 · n8n — "The review-to-reply workflow"

**Tool:** [n8n.io](https://n8n.io)
**Script (EN):** "Tom's cider taproom gets 8 Google reviews a week. He replies to none. [types] *Build an n8n workflow: new Google review → Claude drafts a reply in the reviewer's language → Tom approves in a Slack DM → post.* Show the Slack ping."
**Guion (ES):** "El taproom de sidra de Tom recibe 8 reseñas de Google a la semana. No contesta a ninguna. [escribe] *Construye un flujo en n8n: nueva reseña de Google → Claude redacta una respuesta en el idioma del reseñador → Tom aprueba en un DM de Slack → publica.* Muestra el ping de Slack."
**Good outcome (EN):** Every review gets a warm, timely, personalized reply. Rating goes from 4.2 to 4.6 in 90 days. Tom didn't type a single response.
**Buen resultado (ES):** Cada reseña recibe una respuesta cálida, oportuna y personalizada. La calificación sube de 4.2 a 4.6 en 90 días. Tom no escribió una sola respuesta.
**Bad outcome (EN):** He wires it to auto-post without the human approval step. It replies to a scathing 1-star review with "So glad you loved it!" His whole town screenshots it.
**Mal resultado (ES):** Lo conecta para publicar automáticamente sin el paso de aprobación humana. Le responde a una reseña furiosa de 1 estrella con "¡Qué bueno que te encantó!" Todo el pueblo lo captura.
**Teachable moment (EN):** *Automation without a human on the trigger is a machine gun aimed at your reputation.*
**Lección (ES):** *La automatización sin un humano en el gatillo es una ametralladora apuntándole a tu reputación.*

## 5.5 · ChatPRD — "The seasonal-hire training manual"

**Tool:** [chatprd.ai](https://www.chatprd.ai)
**Script (EN):** "Marisol hires 6 seasonal staff every apple-blossom weekend. She has no training doc. [types] *Write a 4-page onboarding manual for a taquería seasonal hire: opening checklist, POS quick-start, allergen protocol, tip policy, closing checklist. English + Spanish, bullet points, printable.*"
**Guion (ES):** "Marisol contrata 6 empleados de temporada cada fin de semana del festival de la flor del manzano. No tiene documento de capacitación. [escribe] *Escribe un manual de incorporación de 4 páginas para un empleado de temporada de una taquería: lista de apertura, guía rápida del POS, protocolo de alérgenos, política de propinas, lista de cierre. Inglés + español, viñetas, imprimible.*"
**Good outcome (EN):** A real manual in 45 seconds. Marisol edits her POS quirks in. New hires are useful on day one instead of day three.
**Buen resultado (ES):** Un manual real en 45 segundos. Marisol edita las particularidades de su POS. Los nuevos empleados son útiles el día uno en vez del día tres.
**Bad outcome (EN):** She copies a generic AI-written manual with a fake OSHA allergen rule in it. The health inspector reads it during a routine visit. The clinic gets flagged.
**Mal resultado (ES):** Copia un manual genérico escrito por IA que tiene una regla falsa de OSHA sobre alérgenos. El inspector de salud lo lee en una visita de rutina. La clínica queda marcada.
**Teachable moment (EN):** *AI drafts. YOU own. The signature at the bottom is yours — so the accuracy on every line has to be yours too.*
**Lección (ES):** *La IA redacta. TÚ eres dueña. La firma abajo es tuya — así que la exactitud de cada línea también tiene que ser tuya.*

---

# Master coverage grid

| Persona → | Teacher | Utility | Tribal | Healthcare | Small biz |
|---|---|---|---|---|---|
| Perplexity | 1.1 | 2.3 | 3.1 | 4.2 | — |
| NotebookLM | 1.2 | — | 3.2 | — | — |
| ChatGPT | — | — | — | 4.1 | — |
| Claude | 1.5 | 2.4 | — | — | (via n8n 5.4) |
| Gemini + Model Council | (plenary) | — | 3.3 | — | — |
| Khanmigo | 1.3 | — | — | — | — |
| Gamma | 1.4 | — | — | — | 5.2 |
| Granola | — | 2.1 | — | 4.3 | — |
| Wispr Flow | — | — | 3.4 | — | — |
| Lovable | — | — | 3.5 | — | 5.1 |
| Bolt | — | — | — | 4.4 | — |
| Replit | — | — | — | — | 5.3 |
| Magic Patterns | — | 2.5 | — | — | — |
| ChatPRD | — | — | — | 4.5 | 5.5 |
| n8n | — | 2.2 | — | — | 5.4 |
| Glean | — | — | — | — | — |

**Glean note:** Left out on purpose — it's the enterprise tool. Reserve it for the one Q&A moment if an IT director asks. Don't burn a demo card on it in front of teachers or Marisol.

---

# Three cross-cutting patterns (say these out loud in Block 3)

1. **Citation or it didn't happen.** Every good outcome above depends on the AI showing its work. Every bad outcome starts with an AI that couldn't.
2. **The human stays on the trigger.** Every good outcome has a person approving. Every bad outcome auto-posts.
3. **Translation is a safety feature.** Every good outcome reaches Spanish-first neighbors. Every bad outcome pretends English is the whole town.

Those three ARE the three-Yes framework in disguise. Yes-1: does it work? (Citation.) Yes-2: is it safe? (Human on trigger.) Yes-3: does it reach everyone? (Translation.)

---

## Print instructions for Ken

- Each card fits on a 4x6 index card, front (EN) and back (ES).
- Print 25 cards in each of 3 sets. Bob works from one set, Ken holds a set, the pickee gets a set as swag.
- Add the site QR code to the top of every card.
