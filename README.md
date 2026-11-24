# 🧊 Liquid Cube Timer

**Um cronômetro de Speedcubing com precisão, desempenho e uma interface inspirada na estética Liquid Glass.**

O Liquid Cube Timer é uma aplicação móvel desenvolvida em React Native, projetada para praticantes de Speedcubing que desejam acompanhar suas resoluções, analisar seu desempenho e gerenciar suas sessões de treinamento em uma interface moderna e intuitiva.

O projeto combina funcionalidades essenciais de um cronômetro de cubo mágico com uma experiência visual baseada em transparências, desfoques, reflexos e elementos translúcidos.

---

## ✨ Funcionalidades

### ⏱️ Cronômetro
- Cronometragem com precisão de centésimos de segundo.
- Interface de interação por toque e pressão prolongada.
- Início e encerramento de resoluções.
- Atualização precisa utilizando timestamps.
- Experiência otimizada para sessões de treinamento.

### 🔍 Inspeção
- Tempo de inspeção de 15 segundos.
- Contagem regressiva visual.
- Início automático do cronômetro ao atingir o limite.
- Penalidade de +2 segundos entre 15 e 17 segundos.
- DNF para inspeções superiores a 17 segundos.
- Opção para ativar ou desativar a inspeção.

### 📝 Gerenciamento de resoluções
- Salvamento automático das resoluções.
- Exclusão individual de tempos.
- Aplicação e remoção de penalidade +2.
- Marcação de resoluções como DNF.
- Histórico com data e horário de cada resolução.

### 📊 Estatísticas
Acompanhe seu desempenho por meio de métricas utilizadas no Speedcubing:

| Estatística | Descrição |
|---|---|
| **Single PB** | Melhor resolução individual |
| **Ao3** | Média das últimas 3 resoluções |
| **Ao5** | Média das últimas 5 resoluções, descartando o melhor e o pior tempo |
| **Média geral** | Média de todas as resoluções registradas |
| **Total de resoluções** | Quantidade de tempos registrados |

As médias seguem as regras de cálculo do Speedcubing, incluindo o tratamento de penalidades e DNF.

### 💾 Armazenamento local
- Persistência de dados utilizando AsyncStorage.
- Histórico preservado após fechar o aplicativo.
- Armazenamento das configurações e preferências.
- Gerenciamento local das resoluções, sem necessidade de conta.

---

## 🎨 Identidade visual

O Liquid Cube Timer utiliza a estética **Liquid Glass**, explorando elementos visuais que proporcionam profundidade e leveza à interface.

Principais características:

- Glassmorphism.
- Superfícies translúcidas.
- Efeitos de desfoque (Blur).
- Reflexos e bordas luminosas.
- Gradientes suaves.
- Animações e microinterações.
- Interface minimalista com foco no cronômetro.

---

## 🛠️ Tecnologias utilizadas

| Tecnologia | Aplicação |
|---|---|
| React Native | Desenvolvimento mobile |
| Expo | Ambiente de desenvolvimento |
| TypeScript | Tipagem e organização do código |
| Expo Router | Navegação entre telas |
| AsyncStorage | Persistência local |
| React Native Reanimated | Animações |
| Expo Blur | Efeitos de desfoque |
| React Native Gesture Handler | Interações por gestos |

---

## 📱 Estrutura da aplicação

O aplicativo é organizado em três áreas principais:

**1. Timer**
- Cronômetro principal.
- Sistema de inspeção.
- Última resolução.
- Médias Ao3, Ao5 e geral.

**2. Histórico**
- Listagem das resoluções.
- Gerenciamento de penalidades.
- Edição e exclusão de tempos.

**3. Estatísticas**
- Melhor Single.
- Melhor Ao3.
- Melhor Ao5.
- Média geral.
- Total de resoluções.
- Evolução do desempenho.

---

## 🚀 Como executar o projeto

### Pré-requisitos

- Node.js instalado.
- npm ou outro gerenciador de pacotes.
- Expo CLI / Expo.
- Aplicativo Expo Go ou ambiente Android configurado.

### Instalação

Clone o repositório:

```bash
git clone https://github.com/SEU-USUARIO/liquid-cube-timer.git
```

Entre na pasta:

```bash
cd liquid-cube-timer
```

Instale as dependências:

```bash
npm install
```

Inicie o projeto:

```bash
npx expo start
```

Para executar diretamente no Android:

```bash
npx expo start --android
```

---

## 🎯 Objetivo

O objetivo do Liquid Cube Timer é oferecer uma ferramenta prática e visualmente agradável para a comunidade de Speedcubing, reunindo cronometragem, gerenciamento de resoluções e análise de desempenho em um único aplicativo.

Mais do que registrar tempos, a proposta é proporcionar uma experiência agradável durante cada sessão de treinamento.

---

## 👨‍💻 Desenvolvimento

Projeto desenvolvido como iniciativa de estudo e desenvolvimento mobile, explorando React Native, TypeScript, arquitetura de aplicações e design de interfaces.

---

**Liquid Cube Timer**  
*Time. Improve. Repeat.* 🧊
