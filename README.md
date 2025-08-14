# 📟 calculadoraResistor

> Calculadora e visualizador interativo de resistores conforme **IEC 60062**:
> - **Direto** (cores → valor, faixa min/máx, tolerância e TCR)
> - **Inverso** (valor alvo → **Top-3** sugestões de faixas por 4/5/6 bandas)
>
> Stack: **Vite + React + TypeScript**, **TailwindCSS** (tema claro/escuro), **Vitest + React Testing Library**, **ESLint + Prettier**.  
> i18n (pt-BR/en) via **Context API** (sem libs externas). Acessível por teclado e ARIA.

---

## 🧭 Índice
- [Demonstração](#-demonstração)
- [Recursos principais](#-recursos-principais)
- [Arquitetura e pastas](#-arquitetura-e-pastas)
- [Instalação e execução](#-instalação-e-execução)
- [Scripts disponíveis](#-scripts-disponíveis)
- [Uso rápido](#-uso-rápido)
- [Cálculo e regras de negócio](#-cálculo-e-regras-de-negócio)
- [Acessibilidade](#-acessibilidade)
- [i18n (pt-BR/en)](#-i18n-ptbren)
- [Testes](#-testes)
- [Tabela de referência IEC 60062](#-tabela-de-referência-iec-60062)
- [Roadmap](#-roadmap)
- [Contribuição](#-contribuição)
- [Licença e autor](#-licença-e-autor)

---

## 🚀 Demonstração
- Rode localmente com `npm run dev`.  
- (Opcional) Deploy sugerido: Vercel/Netlify.

---

## ✨ Recursos principais
- **Visual**: resistor **SVG realista** com gradientes/sombra, leads metálicos e até **6 anéis** atualizados em tempo real.
- **Cálculo direto**: concatena dígitos (2/3), aplica **multiplicador** e **tolerância**, exibe valor formatado (3 sig. com sufixos SI), **mín/máx** e **TCR** (quando 6 bandas).
- **Cálculo inverso**: usuário informa `valor alvo` (ex.: `4.7k`, `2.2M`) e tolerância desejada → app ranqueia combinações válidas e mostra **Top-3** por 4/5/6 bandas; um clique **aplica** na visualização.
- **Alternância 4/5/6**: **ModeToggle** preserva escolhas compatíveis ao trocar o número de bandas.
- **Acessibilidade**: navegação por teclado (setas trocam banda/cor), foco visível, rótulos ARIA, contraste ok.
- **i18n**: pt-BR/en com **Context API**, persistência no `localStorage`.
- **Qualidade**: ESLint + Prettier; testes (Vitest + RTL) cobrindo cálculo, formatação SI, SVG e casos clássicos.

---

## 🧱 Arquitetura e pastas

```
calculadoraResistor/
├─ index.html
├─ tailwind.config.js
├─ postcss.config.js
├─ tsconfig.json
├─ .eslintrc.cjs
├─ .prettierrc
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx
│  ├─ components/
│  │  ├─ ResistorRealistic.tsx        # SVG realista com gradientes/sombra
│  │  ├─ BandPicker.tsx               # seletor acessível de bandas/cores
│  │  ├─ ModeToggle.tsx               # alterna 4/5/6 mantendo estado compatível
│  │  └─ InverseMode.tsx              # valor alvo + tolerância → Top-3 sugestões
│  │  └─ OutputPanel.tsx              # valor formatado, tolerância, min/máx, TCR
│  ├─ i18n/
│  │  ├─ i18n.tsx                     # I18nProvider + hook useT() + persistência
│  │  ├─ pt.ts                        # dicionário pt-BR
│  │  └─ en.ts                        # dicionário en
│  ├─ lib/
│  │  ├─ colorCode.ts                 # IEC 60062 + paleta COLOR_HEX
│  │  ├─ compute.ts                   # direto e inverso, Top-3, critérios desempate
│  │  ├─ format.ts                    # SI (Ω, kΩ, MΩ, GΩ) e 3 significativos
│  │  └─ validate.ts                  # regras por posição (dígito, mult, tol, TCR)
│  └─ __tests__/
│     ├─ compute.test.tsx
│     ├─ format.test.ts
│     └─ svg-bands.test.tsx
└─ README.md
```

---

## 🛠 Instalação e execução

```bash
# Node 18+ recomendado
npm i
npm run dev
```

(abrirá em algo como http://localhost:5173)

### Configuração inicial do projeto (caso esteja começando do zero)
```bash
# 1) Vite + React + TS
npm create vite@latest calculadoraResistor -- --template react-ts
cd calculadoraResistor
npm i

# 2) TailwindCSS
npm i -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 3) Vitest + RTL
npm i -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom

# 4) ESLint + Prettier
npm i -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier prettier

# 5) Ajustar tailwind.config.js e index.css com as diretivas @tailwind base; components; utilities
```

---

## 📜 Scripts disponíveis

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest --environment jsdom",
    "test:ui": "vitest --ui --environment jsdom",
    "lint": "eslint \"src/**/*.{ts,tsx}\"",
    "format": "prettier --write ."
  }
}
```

---

## 🧪 Uso rápido

- **BandPicker**: selecione cores válidas por posição.  
  Atalhos: `←/→` muda a banda ativa; `↑/↓` troca a cor dentro da banda.  
  Botões: **Reset** (valores padrão), **Copiar valor** (clipboard).
- **ModeToggle**: alterna **4/5/6 bandas** (mantém escolhas compatíveis).
- **InverseMode**: digite `valor alvo` (ex.: `330`, `4.7k`, `2.2M`), escolha tolerância (opcional) e clique **Sugerir cores** → veja **Top-3** por 4/5/6; clique numa sugestão para aplicar.
- **OutputPanel**: mostra valor nominal (3 sig.), **tolerância**, **mín/máx** e **TCR** (quando 6 bandas).

---

## 🧮 Cálculo e regras de negócio

- **Direto (cores → valor)**  
  - 4 bandas: `dígito1`, `dígito2`, `multiplicador`, `tolerância`  
  - 5 bandas: `dígito1`, `dígito2`, `dígito3`, `multiplicador`, `tolerância`  
  - 6 bandas: idem 5 + `TCR` (ppm/°C)  
  - Número base `N` = concatenação de 2 ou 3 dígitos (sem zeros à esquerda; **black não é 1º dígito** por padrão).  
  - Valor em ohms: `valorΩ = N × multiplicador`.  
  - Faixa: `mín = valor*(1 - tol)`; `máx = valor*(1 + tol)`.  
  - **Formatação**: 3 algarismos significativos + sufixo SI (`Ω`, `kΩ`, `MΩ`, `GΩ`).

- **Inverso (valor → faixas)**  
  - Entrada: `valor alvo` + `nº de bandas` (4/5/6) + `tolerância preferida` (opcional).  
  - Estratégia: enumerar combinações válidas segundo **validate.ts**, calcular `valorΩ` e erro relativo `|valorΩ - alvo|/alvo`.  
  - Saída: **Top-3** por modo (4/5/6) com sequência de cores, valor formatado, erro %, tolerância e TCR (se 6 bandas).  
  - **Desempate**: menor erro → menor tolerância → multiplicador “mais limpo”.

---

## ♿ Acessibilidade

- **Teclado**: setas `←/→/↑/↓` para navegar bandas/cores; `Tab` percorre elementos; foco sempre visível.  
- **ARIA**: labels descritivos em controles; `aria-label` no SVG do resistor descrevendo **cores atuais** e **valor calculado**.  
- **Contraste/tema**: suporte a **claro/escuro**; tokens Tailwind pensados para contrastes mínimos recomendados.

---

## 🌐 i18n (pt-BR/en)

- Implementação com **Context API** (`I18nProvider`, `useT()`), dicionários `pt.ts` e `en.ts`.  
- Persistência da escolha no `localStorage`.  
- Botão de troca de idioma disponível no cabeçalho.  
- Chaves típicas: `"title"`, `"bands"`, `"tolerance"`, `"tcr"`, `"targetValue"`, `"suggest"`, `"copy"`, `"reset"`, `"min"`, `"max"`, `"error"`, `"bestMatches"`, `"apply"` etc.

---

## ✅ Testes

- **Vitest + RTL** cobrindo:
  - Cálculos clássicos:  
    - 4 bandas: `brown-black-red-gold` → **1.0 kΩ ±5%**  
    - 5 bandas: `brown-black-black-red-brown` → **10 kΩ ±1%**  
    - 6 bandas: caso com TCR (ppm/°C) verificado
  - **Formatação** SI: `<1k`, `≥1k`, `≥1M` e `≥1G`.  
  - **InverseMode**: entrada `4.7kΩ` retorna **yellow-violet-red-(tol)** entre Top-3.  
  - **SVG**: troca de cor no `BandPicker` reflete `fill` dos anéis.

Execute:
```bash
npm test
# modo UI opcional:
npm run test:ui
```

---

## 📚 Tabela de referência IEC 60062

**Dígitos (0–9):**
`black 0, brown 1, red 2, orange 3, yellow 4, green 5, blue 6, violet 7, grey 8, white 9`

**Multiplicador:**
`silver ×0.01, gold ×0.1, black ×1, brown ×10, red ×100, orange ×1k, yellow ×10k, green ×100k, blue ×1M, violet ×10M, grey ×100M, white ×1G`

**Tolerância:**
`brown ±1%, red ±2%, green ±0.5%, blue ±0.25%, violet ±0.1%, grey ±0.05%, gold ±5%, silver ±10%, none ±20%`

**TCR (ppm/°C, 6ª banda):**
`brown 100, red 50, orange 15, yellow 25, blue 10, violet 5`

**Paleta (hex):**
`black #000000, brown #8B4513, red #FF0000, orange #FFA500, yellow #FFD700, green #008000, blue #0000FF, violet #8A2BE2, grey #808080, white #FFFFFF, gold #D4AF37, silver #C0C0C0, none transparent`

> Estes mapeamentos constam em `src/lib/colorCode.ts` como **TypeScript `as const`**.

---

## 🗺️ Roadmap
- Preferências avançadas: permitir **black** como 1º dígito (desligado por padrão).
- E-series (E12/E24) como **filtro opcional** no inverso.
- **Dockerfile** de dev e workflow CI/CD (Vercel/Netlify).  
- **Efeitos visuais**: ruído sutil e brilho nos anéis do SVG.

---

## 🤝 Contribuição

1. Faça um **fork**  
2. Crie uma branch: `git checkout -b feat/minha-feature`  
3. Commit: `git commit -m "feat: minha feature"`  
4. Push: `git push origin feat/minha-feature`  
5. Abra um **Pull Request**

---

## 📜 Licença e autor

Distribuído sob **MIT** — veja `LICENSE`.

**Autor:** Gustavo Carvalho  
GitHub: [@gustavocarvalhodeek](https://github.com/gustavocarvalhodeek) • Email: gustavoadmcontato@gmail.com
