# Liquid Cube Timer

Cronômetro de speedcubing em React Native (Expo SDK 58) com estética Liquid Glass.

## Executar

```bash
npm install
npx expo install --fix      # alinha as versões ao SDK do Expo
npx expo start
```

Abra com o Expo Go (QR code) ou use `a` (Android) / `i` (iOS) no terminal.
Verificações: `npm run typecheck` e `npm run verify` (testa médias, penalidades e formatação).

## Estrutura

```
App.tsx                     providers, fundo, abas
src/components/             GlassSurface, GlassCard, GlassButton, TimerPad, TimerDisplay,
                            ActionPanel, SolveItem, StatisticsCard, ProgressChart, modais...
src/screens/                TimerScreen, HistoryScreen, StatisticsScreen
src/hooks/                  useTimer, useInspection, useSolves, useSettings, useHaptics
src/services/               storage (AsyncStorage), statistics
src/utils/                  averageCalculator, timeFormatter, inspection, solve, stateVisual
src/types/                  Solve, Settings, Timer
scripts/verify-averages.ts  testes dos cálculos
```

## Como testar

1. **Inspeção**: na aba Timer, segure o pad e solte. A contagem de 15 s começa. Segure de novo (fica verde) e solte para iniciar.
2. **Penalidades**: espere passar de 15 s e inicie antes de 17 s → +2 automático. Passando de 17 s → DNF automático.
3. **Parar**: toque em qualquer ponto do pad. O tempo para no instante do toque.
4. **Painel**: +2 e DNF alternam (tocar de novo remove); Excluir apaga; Salvar libera a próxima resolução.
5. **Histórico**: toque numa linha para ver detalhes e editar a penalidade; lixeira da linha exclui; lixeira do topo apaga tudo (com confirmação).
6. **Persistência**: feche o app completamente e abra de novo; resoluções e configurações continuam lá.
7. **Médias**: faça 5 resoluções e confira Ao3/Ao5/Média na aba Timer e na aba Estatísticas.
