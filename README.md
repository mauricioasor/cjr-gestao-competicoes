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
| `src/components/` | Componentes de UI e a chave eliminatória |

## Roteiro da demo (cerca de 2 min)

1. **Coordenação → Configuração:** em Robótica Lego, mude um peso, escreva o motivo e publique a v2.
2. **Inscrições → Nova inscrição:** o aluno do 5º ano é bloqueado em Seguidor de Linha (que exige do 6º ao 9º). Troque para 6º e confirme.
3. **Chaveamento:** sorteie a chave do Estoura Balão.
4. **Ver como Juiz:** lance os balões de um duelo e envie. Lance também a NeuroBlocos, em Robótica Lego.
5. **Ver como Coordenação → Homologação:** homologue. O placar e a chave mudam, e o evento aparece em Integrações.
6. **Corrigir** um resultado homologado: o motivo é obrigatório e a v2 aparece na Auditoria com o valor antes e depois.
7. **Placar público → Modo telão.**

O botão ↺ no topo reinicia a demo.

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

- Não há persistência nem autenticação real. O perfil é trocado pela barra superior, só para a demo.
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
