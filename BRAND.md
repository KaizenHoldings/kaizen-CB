# Brand Guidelines — Kaizen Casa de Bolsa

## 1. Propósito

Este documento define exclusivamente la identidad visual y verbal de **Kaizen Casa de Bolsa** para su nueva web.

Esta es una marca diferente a KFG Sociedad de Inversión. No se deben reutilizar colores, logos, reglas, textos ni tokens del proyecto anterior. La fuente visual inicial de este documento es `kcb_reference.html`.

La arquitectura, estructura del código y funcionamiento de componentes no forman parte de este archivo.

---

## 2. Esencia de marca

Kaizen Casa de Bolsa debe proyectarse como una institución financiera:

- **Confiable:** transmite respaldo, cuidado y manejo responsable.
- **Íntegra:** comunica honestidad, transparencia y cumplimiento.
- **Experta:** demuestra conocimiento del mercado de valores y capacidad técnica.
- **Contemporánea:** utiliza un lenguaje digital actual sin depender de modas efímeras.
- **Cercana:** acompaña a personas y empresas con explicaciones claras.
- **Progresiva:** conecta la idea Kaizen con evolución continua y creación de valor.
- **Venezolana:** reconoce su contexto y su contribución al ecosistema empresarial del país.

### Conceptos centrales

**Visión · Confianza · Integridad · Crecimiento · Rigor · Acompañamiento**

La marca debe equilibrar dinamismo y estabilidad. No debe sentirse como una plataforma de especulación, criptomonedas o trading agresivo, ni como una institución distante y anticuada.

---

## 3. Nombre

El nombre oficial es:

**Kaizen Casa de Bolsa**

Reglas:

- Usar el nombre completo en la primera aparición y en contextos institucionales.
- Se puede utilizar **Kaizen** en menciones posteriores cuando el contexto sea inequívoco.
- No utilizar **KFG**, **KCB** u otras abreviaturas públicamente sin aprobación previa.
- No modificar el descriptor “Casa de Bolsa”.
- Respetar mayúsculas y escritura del nombre oficial.

---

## 4. Logo e isotipo

El HTML de referencia incluye tres recursos visuales oficiales sobre fondo transparente:

- Isotipo oscuro, proporción vertical aproximada `119 × 130`.
- Logo horizontal oscuro, proporción aproximada `482 × 130`.
- Logo horizontal claro, proporción aproximada `482 × 130`.

### Nota técnica sobre el archivo recibido

Aunque el recurso fue descrito como SVG, `kcb_reference.html` inserta actualmente estas versiones como imágenes PNG codificadas en `data:image/png;base64`. El bloque `<svg>` del HTML corresponde a la biblioteca de iconos, no al logo.

Si el proyecto contiene el logo oficial como archivo SVG independiente, esa versión debe ser la preferida. Si no existe, se debe extraer y utilizar la imagen oficial incorporada en el HTML sin redibujarla ni vectorizarla automáticamente.

### Uso por fondo

- **Fondos blancos o claros:** usar el logo horizontal oscuro.
- **Fondos Navy o Blue:** usar el logo horizontal claro.
- **Espacios reducidos, favicon o identificadores compactos:** usar el isotipo.
- No colocar la versión oscura sobre fondos con poco contraste.
- No colocar la versión clara sobre fondos blancos o muy claros.

### Reglas de protección

- Mantener proporción, orientación y composición.
- No recolorear el logo.
- No redibujarlo con CSS ni tipografía aproximada.
- No modificar la relación entre símbolo y nombre.
- No deformar, inclinar, recortar o rotar.
- No añadir contornos, gradientes, sombras, brillos o efectos 3D.
- No animar las partes del logo por separado.
- No usarlo como patrón decorativo.
- Mantener un área de aire generosa alrededor.
- Evitar fotografías o fondos complejos detrás del logo.

Como referencia digital inicial, el logo horizontal puede mostrarse alrededor de `34 px` de alto en móvil y `40–46 px` en desktop, siempre conservando su proporción y ajustándose al espacio real.

---

## 5. Paleta principal

| Token conceptual | Valor | Función principal |
|---|---:|---|
| Navy | `#0E3048` | Color institucional principal, footer, superficies oscuras, encabezados y datos sólidos |
| Blue | `#205890` | Acciones, enlaces, énfasis, gráficos y gradientes institucionales |
| Blue 2 | `#3E7CB0` | Acento azul secundario, visualizaciones y estados complementarios |
| Tint | `#EAF1F8` | Fondos de secciones, chips y superficies suaves |
| Tint 2 | `#DBE8F4` | Hover suave, filas alternas y separación tonal |
| Pearl | `#F5F7FA` | Fondo neutral secundario |
| White | `#FFFFFF` | Fondo principal, texto sobre superficies oscuras y respiración visual |
| Ink | `#1B2A3A` | Texto principal de lectura |
| Muted | `#5B6B7E` | Texto secundario y metadatos |
| Line | `rgba(14, 48, 72, 0.10)` | Bordes y divisores discretos |
| Emerald | `#0E9F6E` | Iconos, indicador en vivo y acentos puntuales |

### Jerarquía de uso

- Navy y White deben dominar la experiencia.
- Blue introduce acción, dirección y énfasis.
- Tint y Pearl crean profundidad sin oscurecer la interfaz.
- Emerald es un acento controlado; no debe competir con Blue ni convertirse en el color dominante.
- Ink y Muted deben utilizarse para lectura sobre fondos claros.

---

## 6. Paleta semántica

Los colores semánticos no sustituyen la paleta principal.

| Uso | Color |
|---|---:|
| Variación positiva | `#1B8A5A` |
| Variación negativa | `#C0392B` |
| Positivo sobre Navy | `#5FE0A6` |
| Negativo sobre Navy | `#FF9C8E` |
| Línea clara de gráfico | `#9DC2E6` |
| Emerald hover | `#0B855C` |

Reglas:

- Verde y rojo se reservan para datos positivos/negativos, validación y errores.
- Nunca comunicar una variación únicamente mediante color: acompañar con símbolo, texto o porcentaje.
- No utilizar rojo como decoración.
- El Emerald institucional puede usarse en iconos y señalización “en vivo”, pero no debe confundirse con el verde de rentabilidad.

### Etiquetas de contenido

El HTML define una paleta secundaria para categorías editoriales:

| Categoría | Fondo | Texto |
|---|---:|---:|
| Normativa Venezuela | `#E5F0F8` | `#205890` |
| Mercado internacional | `#E8F4F0` | `#1A6B4A` |
| Circular | `#FFF4E5` | `#B87020` |
| Normativa institucional | `#EDF5EF` | `#2E6B45` |

Estos colores solo deben aparecer como pequeñas etiquetas informativas. No deben emplearse como fondos completos de secciones ni como colores de CTA.

---

## 7. Gradientes

Los gradientes permitidos combinan exclusivamente los azules institucionales:

```css
background: linear-gradient(160deg, #205890 0%, #0E3048 100%);
```

Usos adecuados:

- Secciones institucionales oscuras.
- Información financiera.
- Registro.
- Newsletter.
- Recursos gráficos controlados.

Evitar:

- Gradientes multicolor.
- Neón.
- Brillos especulativos.
- Fondos que reduzcan la legibilidad.
- Aplicar gradiente a todos los componentes.

---

## 8. Tipografía

### Sora

Familia de display e interfaz.

Pesos autorizados: `400`, `500`, `600`, `700`, `800`.

Usar en:

- H1–H4.
- Navegación.
- Botones.
- Eyebrows y etiquetas.
- Cifras destacadas.
- Encabezados de tablas.
- Títulos de tarjetas.

Sora comunica precisión, estructura y contemporaneidad. Los títulos deben mantener un interlineado compacto y una jerarquía clara.

### Inter

Familia de lectura.

Pesos autorizados: `400`, `500`, `600`, `700`.

Usar en:

- Párrafos.
- Descripciones.
- Formularios.
- Metadatos.
- Texto de tablas.
- Información de contacto.
- Avisos legales.

Inter debe preservar legibilidad y claridad, especialmente en contenido financiero y regulatorio.

### Reglas tipográficas

- No introducir otras familias tipográficas.
- No usar mayúsculas sostenidas en párrafos.
- Reservar el tracking amplio para eyebrows, categorías y pequeños indicadores.
- Evitar bloques centrados extensos.
- Mantener longitudes de línea cómodas para lectura.
- Usar números tabulares cuando ayuden a comparar precios o porcentajes.

---

## 9. Lenguaje visual

La web debe sentirse limpia, institucional y dinámica.

### Composición

- Amplio espacio en blanco.
- Jerarquía evidente entre título, explicación y acción.
- Secciones con ritmo alternado entre fondos blancos, tintes claros y bloques Navy/Blue.
- Contenedores alineados y grillas consistentes.
- Información financiera presentada con orden y precisión.

### Formas

- Radios suaves y contemporáneos.
- Tarjetas principales alrededor de `12–24 px`, según jerarquía.
- Botones y etiquetas pueden usar formas pill.
- Icon chips compactos con fondo Tint.
- Bordes discretos, nunca pesados.

### Sombras

Las sombras deben ser azuladas, suaves y difusas:

```css
--shadow: 0 20px 50px -22px rgba(14, 48, 72, 0.28);
--shadow-sm: 0 10px 28px -16px rgba(14, 48, 72, 0.26);
```

No usar sombras negras duras, múltiples contornos o elevación exagerada.

### Superficies

- White para contenido principal.
- Tint y Pearl para separar bloques sin ruido.
- Navy para autoridad y cierre visual.
- Gradiente Blue–Navy para secciones destacadas.
- Transparencias blancas discretas únicamente sobre fondos institucionales.

Evitar glassmorphism excesivo, transparencias difíciles de leer y superficies que parezcan una plantilla tecnológica genérica.

---

## 10. Iconografía

El HTML de referencia utiliza iconos lineales y geométricos.

Reglas:

- Trazos simples, redondeados y consistentes.
- Tamaño base aproximado de `20–24 px`.
- Stroke visual cercano a `1.7`.
- Emerald para iconos destacados sobre fondos claros.
- White o Emerald sobre fondos Navy/Blue, según contraste.
- Los iconos deben acompañar y no sustituir etiquetas importantes.
- Evitar iconos 3D, emojis, ilustraciones caricaturescas y símbolos asociados a criptomonedas.
- No mezclar familias con estilos incompatibles.

---

## 11. Gráficos y datos financieros

- Usar Navy y Blue como base de tablas y gráficos.
- Blue 2 y `#9DC2E6` pueden representar series secundarias.
- Verde y rojo se reservan para evolución positiva y negativa.
- Acompañar valores con unidad, fecha y fuente.
- Mostrar la hora o periodo de actualización.
- No decorar cifras con efectos que sugieran rentabilidad garantizada.
- Mantener tablas legibles en móvil mediante una solución responsive clara.

La cinta superior debe sentirse informativa e institucional, no como una plataforma de trading de alta frecuencia.

---

## 12. Fotografía e imagen

Si se incorporan fotografías, deben comunicar:

- Asesoría y acompañamiento profesional.
- Empresas y personas tomando decisiones informadas.
- Contexto empresarial venezolano contemporáneo.
- Tecnología, mercado y crecimiento con sobriedad.
- Ambientes reales, luminosos y confiables.

Evitar:

- Monedas flotantes, cohetes, criptomonedas o pantallas saturadas de trading.
- Apretones de manos genéricos como recurso principal.
- Imágenes excesivamente posadas o artificiales.
- Rascacielos internacionales que no representen el contexto.
- Efectos de IA visibles, piel plástica o elementos financieros irreales.

Los recursos abstractos pueden inspirarse en trayectorias, conexiones, evolución y gráficos ascendentes, siempre de forma contenida.

---

## 13. Tono de voz

La comunicación debe ser:

- Clara.
- Profesional.
- Segura, sin arrogancia.
- Cercana.
- Educativa.
- Transparente.
- Orientada a decisiones informadas.

El HTML de referencia utiliza el tratamiento de **tú**: “tu patrimonio”, “te acompaña”, “abre tu cuenta”. La web debe mantenerlo de forma consistente. No mezclar “tú” y “usted” dentro de una misma experiencia.

### Preferencias de redacción

- Frases directas y relativamente breves.
- Explicar términos financieros cuando el público pueda no conocerlos.
- Priorizar verbos concretos: invertir, estructurar, acompañar, consultar, descargar.
- Hablar de oportunidades, objetivos y acompañamiento.
- Diferenciar claramente información institucional, educativa y promocional.

### Evitar

- “Rentabilidad garantizada”.
- “Inversión sin riesgo”.
- “Ganancias aseguradas”.
- Urgencia artificial o miedo a perder una oportunidad.
- Jerga técnica innecesaria.
- Afirmaciones regulatorias o tributarias no verificadas.

---

## 14. Contenido financiero y cumplimiento

- Toda cifra debe indicar fuente y periodo.
- Los datos de ejemplo del HTML no deben publicarse como información real.
- La frase sobre beneficios fiscales aparece marcada como “VERIFICAR” en la referencia y no debe publicarse sin validación legal o tributaria.
- Las referencias a SUNAVAL, normativa, regulación y requisitos deben validarse antes de producción.
- Diferenciar contenido vigente, histórico y de referencia.
- Los avisos de riesgo o limitaciones deben ser claros y legibles, no ocultos visualmente.
- No insinuar que el diseño sustituye asesoría profesional o evaluación del perfil de riesgo.

---

## 15. Accesibilidad de marca

- Mantener contraste WCAG AA en texto y controles.
- No utilizar Muted en tamaños pequeños sobre Tint sin verificar contraste.
- No depender del color para comunicar ganancias, pérdidas, categorías o estados.
- Conservar foco visible y coherente con Blue/Emerald.
- El logo debe incluir un texto alternativo adecuado cuando funcione como contenido o enlace.
- Los iconos decorativos deben ocultarse de tecnologías asistivas.
- Las animaciones deben respetar movimiento reducido.

---

## 16. Usos prohibidos

- Reutilizar la paleta, logo o isotipo de KFG.
- Recolorear o reconstruir el logo.
- Introducir dorado, neón, morado cripto o colores no aprobados como dominantes.
- Usar Emerald en exceso.
- Usar verde como promesa implícita de crecimiento.
- Saturar la interfaz con gráficas, números o movimiento continuo.
- Combinar múltiples familias tipográficas.
- Aplicar glassmorphism como lenguaje principal.
- Presentar placeholders, cifras simuladas o publicaciones ficticias como contenido real.
- Mezclar el tratamiento de tú y usted.
- Usar imágenes genéricas que reduzcan la credibilidad institucional.

