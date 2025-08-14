# Resistor Codes (IEC 60062)

App web para calcular e visualizar o valor de resistores pelas faixas de cores e também sugerir faixas a partir de um valor alvo. Suporta 4/5/6 bandas (dígitos, multiplicador, tolerância, TCR), SVG realista, i18n pt-BR/en e acessibilidade de teclado.

## Rodar

```bash
npm i
npm run dev
```

## Testar

```bash
npm test
```

## Referência rápida de cores (IEC 60062)

| Cor     | Dígito | Multiplicador | Tolerância | TCR ppm/°C |
| ------- | ------ | ------------- | ---------- | ---------- |
| Preto   | 0      | ×1            | —          | —          |
| Marrom  | 1      | ×10           | ±1%        | 100        |
| Vermel. | 2      | ×100          | ±2%        | 50         |
| Laranja | 3      | ×1k           | —          | 15         |
| Amarelo | 4      | ×10k          | —          | 25         |
| Verde   | 5      | ×100k         | ±0.5%      | —          |
| Azul    | 6      | ×1M           | ±0.25%     | 10         |
| Violeta | 7      | ×10M          | ±0.1%      | 5          |
| Cinza   | 8      | ×100M         | ±0.05%     | —          |
| Branco  | 9      | ×1G           | —          | —          |
| Ouro    | —      | ×0.1          | ±5%        | —          |
| Prata   | —      | ×0.01         | ±10%       | —          |
| (Sem)   | —      | —             | ±20%       | —          |

> Notas: Séries E (E12/E24) **não** são exigidas — o app trabalha por bandas, não por séries comerciais.
