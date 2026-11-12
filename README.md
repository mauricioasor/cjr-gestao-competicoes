# CJR · Gestão das Competições (Desafio 02)

Protótipo do módulo de **Gestão das Competições** do Campeonato Joinvilense de Robótica (CJR), feito para o Hackathon ADS UNISENAI × Secretaria de Educação de Joinville.

**Princípio:** quem lança a nota não a homologa, e só o resultado homologado é publicado. Toda correção gera uma nova versão com motivo e fica na trilha de auditoria.

## Como executar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/index.html em arquivo único (abre direto no navegador)
```

Requisitos: Node 18 ou superior.

## Stack

React 18, Tailwind CSS 3, ícones Lucide e Vite 5 (com `vite-plugin-singlefile`). Não há back-end: o estado fica em memória (`src/state/store.js`), e as integrações são simuladas.

## Estrutura

| Caminho | Conteúdo |
| --- | --- |
| `src/data/seed.js` | Edição, escolas, 7 categorias, equipes e avaliações **fictícias** |
| `src/state/store.js` | Regras de negócio: elegibilidade, sorteio com semente, chave derivada, ranking, homologação, correção, auditoria e eventos |
| `src/views/` | Telas: Visão geral, Configuração, Inscrições, Chaveamento, Painel do juiz, Homologação, Auditoria, Integrações e Placar público |
| `src/components/` | Componentes de UI, chave eliminatória, contador da próxima categoria e preferências (tema e texto grande) |
| `docs/` | Slides do pitch em PDF, roteiro de apresentação e principais telas |

## Roteiro da demo (cerca de 2 min)

0. **Tela de entrada:** escolha uma conta de demonstração e clique em "Enviar link de acesso" e depois em "Abrir link de acesso". Não há senha: o acesso é um link enviado ao e-mail convidado (simulado).
1. **Ana (Coordenação) → Configuração:** em Robótica Lego, mude um peso, escreva o motivo e publique a v2.
2. **Acessos:** veja as escolas convidadas para a edição e convide um juiz só para as categorias que ele vai avaliar.
3. **Inscrições → Nova inscrição:** o aluno do 5º ano é bloqueado em Seguidor de Linha (que exige do 6º ao 9º). Troque para 6º e confirme.
4. **Chaveamento:** sorteie a chave do Estoura Balão.
5. **Trocar de conta → Carlos (Juiz):** ele só vê as 3 categorias do convite. Lance os balões de um duelo e envie.
6. **Trocar de conta → Ana → Homologação:** homologue. O placar e a chave mudam, e o evento aparece em Integrações.
7. **Corrigir** um resultado homologado: o motivo é obrigatório e a v2 aparece na Auditoria.
8. **Placar público:** confira o contador da próxima categoria e abra o Modo telão.

O botão ↺ no topo reinicia os dados da demo.

## Apresentação

- **Slides:** [`docs/pitch/CJR-Gestao-Competicoes-pitch.pdf`](docs/pitch/CJR-Gestao-Competicoes-pitch.pdf). São 15 slides para 5 minutos e um apêndice para as perguntas.
- **Roteiro de treino:** [`docs/ROTEIRO-PITCH.md`](docs/ROTEIRO-PITCH.md), com fala e tempo de cada slide, plano da demo, perguntas da banca e plano de ensaio.
- **Principais telas:** [`docs/telas/`](docs/telas/).

## Acessibilidade e responsividade

- O layout se adapta a celular, tablet, computador e telão. No celular, o ranking mostra a escola abaixo do nome da equipe.
- Os botões **Claro/Escuro** e **A+** (texto 15% maior) ficam no topo e na tela de entrada. A escolha fica salva no navegador.
- Alvos de toque têm 44 px. Há link "Pular para o conteúdo", foco visível, navegação por teclado e rótulos em todos os campos.
- Todo status aparece com texto e ícone, nunca só por cor.

## Contador do placar

O placar público e o modo telão mostram a categoria em disputa, a próxima categoria e uma contagem regressiva até o início dela, com barra de progresso. No último minuto, o contador muda para âmbar. A agenda do dia é fictícia e fica em `src/state/store.js`.

## Modelo de acesso

| Perfil | Quem cria o acesso | Escopo | Validade |
| --- | --- | --- | --- |
| Super Admin (Secretaria) | Implantação | Todas as edições | Permanente |
| Coordenação | Super Admin | A edição | Por edição |
| Professor responsável | Coordenação, um convite por escola | Só a própria escola | Encerra com a edição |
| Juiz | Coordenação | Só as categorias do convite | Dias do evento |
| Público | — | Placar, sem login | — |

O acesso é **por pessoa, não por escola**, para que a auditoria registre quem fez cada ação. Em produção, a entrada é sem senha (link ou código de uso único por e-mail), num provedor de identidade comum aos 3 módulos (ex.: Keycloak). Cada módulo guarda as próprias permissões numa tabela de vínculos (usuário, papel, edição, escola ou categorias, validade).

## Regras implementadas

| Regra | Onde |
| --- | --- |
| RN01: quem lança não homologa | `HOMOLOGATE` em `store.js`; o juiz não tem acesso à tela de homologação |
| RN02: o placar lê só homologados | `ranking()` e `montarChave()` |
| RN03: um resultado homologado é imutável e a correção gera versão | `CORRECT` |
| RN04: regras versionadas por edição e categoria | `PUBLISH_RULES`; cada avaliação guarda `regraVersao` |
| RN05: elegibilidade por ano escolar ou EJA e por tamanho de equipe | `elegibilidade()` |
| Sorteio reproduzível | `sortear()` com PRNG `mulberry32` e semente registrada |

## Limitações

- Não há persistência nem autenticação real: a entrada e os convites são simulados.
- Pesos das subcategorias, critérios do Seguidor de Linha e tamanho de equipe do Estoura Balão, dos ArtBots e da Tecnologia Educacional são **suposições** marcadas na tela como “a confirmar no edital”.
- A regra de desempate não está definida: no empate, o juiz indica o vencedor e justifica.

## Backlog de continuidade

1. API REST com PostgreSQL e contrato OpenAPI `/v1`.
2. Login por convite e SSO do ecossistema, com permissões por categoria.
3. Integração real com o Desafio 01 (edição e escolas) e webhooks para o Desafio 03.
4. Modo offline no painel do juiz, com fila de reenvio idempotente.
5. Regras reais do edital e desempate configurável.
6. Relatórios por escola, regional e edição.

## Dados e LGPD

Todos os dados são fictícios. O placar mostra equipe e escola, nunca nomes de estudantes. O módulo guarda só as iniciais e o ano escolar.

## Uso de IA

Claude (Anthropic) apoiou a análise dos documentos, a arquitetura, este protótipo e o roteiro do pitch. A equipe revisou o material e responde pelas entregas.
