# Roteiro do pitch: Gestão das Competições do CJR (Desafio 02)

**Duração-alvo: 4 min 35 s.** O limite é 5 min, então sobram 25 s de folga para respirar, para uma troca de apresentador ou para um clique lento.

**Arquivo dos slides:** `docs/pitch/CJR-Gestao-Competicoes-pitch.pdf`. São 15 slides de apresentação e 12 de apêndice, este último só para as perguntas.

**Frase que a banca deve lembrar:** *"Quem lança não homologa. Só o homologado é publicado."*

---

## 1. Divisão da equipe

| Quem | Slides | Tempo |
| --- | --- | --- |
| [Apresentador 1] | 1 a 5: abertura, dor, proposta, fluxo, acessos | 1:40 |
| [Apresentador 2] | 6 a 12: telas do sistema (ou demo ao vivo) | 2:00 |
| [Apresentador 3] | 13 a 15: arquitetura, impacto e fechamento | 0:55 |
| [Integrante 4] | Passa os slides e opera a demo; segura o cronômetro | — |

Na troca de apresentador, quem sai diz a primeira palavra do próximo bloco, por exemplo: "...e agora a [Nome] mostra o sistema funcionando." Assim não sobra silêncio.

---

## 2. Roteiro slide a slide

| # | Tempo | Slide | O que falar | Na tela |
| --- | --- | --- | --- | --- |
| 1 | 0:00–0:10 | Capa | "Boa tarde. Somos a equipe [nome] e trabalhamos no Desafio 02, a Gestão das Competições do Campeonato Joinvilense de Robótica." | — |
| 2 | 0:10–0:40 | A dor | "Em 2021 o campeonato tinha 28 alunos e 7 equipes. Na 6ª edição foram 69 equipes de 35 escolas, em 7 categorias. A apuração continua predominantemente manual, e o próprio briefing pergunta: quem homologa um resultado? Qual regra valeu em cada edição? O que foi publicado é o oficial?" | Apontar os três quadros amarelos |
| 3 | 0:40–1:00 | Proposta | Pausa curta. Depois, devagar: "Quem lança não homologa. Só o homologado é publicado." Então: "O juiz lança, a coordenação homologa, toda regra e toda correção viram versão, e o placar e o Histórico usam uma única fonte." | Olhar para a banca, não para o telão |
| 4 | 1:00–1:20 | Fluxo | "Todo resultado faz este caminho. O passo 4, a homologação, é o único portão de saída. Nota errada antes de publicar volta ao juiz. Erro depois de publicar vira nova versão, com motivo." | Apontar o quadro azul "Homologa" |
| 5 | 1:20–1:40 | Acessos | "As escolas já vêm cadastradas pela Secretaria. A cada edital, a coordenação convida um responsável por escola e os juízes, cada um com o seu escopo. O acesso é da pessoa, não da escola: a auditoria sabe quem fez cada ação. E sem senha: o link chega no e-mail." | — |
| 6 | 1:40–1:50 | Entrada | "Cada conta mostra o seu escopo. Vou entrar como a coordenação." | — |
| 7 | 1:50–2:10 | Inscrições | "O professor inscreve a equipe e o sistema valida na hora: este aluno do 5º ano não pode jogar Seguidor de Linha, que é do 6º ao 9º. Ele vê o motivo e quantos integrantes faltam, antes do dia do evento." | Apontar a mensagem em vermelho |
| 8 | 2:10–2:30 | Juiz | "O juiz está na arena, com o celular. No Estoura Balão, ele marca os balões de cada round com botões grandes e o vencedor é calculado. Enviar não é publicar: a nota fica aguardando homologação." | Apontar o celular |
| 9 | 2:30–2:50 | Homologação | "Aqui a coordenação vê quem lançou, quando e com qual regra. Quem lançou não consegue homologar. Só ao homologar o resultado vai para o placar e para o Histórico Público." | Pausa de 2 s depois de "Só ao homologar" |
| 10 | 2:50–3:05 | Correção | "Resultado publicado não é editado. A correção mostra o valor anterior, exige motivo e vira a versão 2. A versão 1 fica na auditoria." | — |
| 11 | 3:05–3:30 | Placar | "O placar público mostra só homologados, com selo quando houve correção. E o contador mostra quanto falta para a próxima categoria começar: no ginásio, todo mundo sabe o que vem a seguir." | O contador à direita está rodando ao vivo |
| 12 | 3:30–3:40 | Responsivo | "Funciona no computador, no tablet e no celular, com tema claro ou escuro e um botão para aumentar o texto." | — |
| 13 | 3:40–4:00 | Arquitetura | "Não cadastramos escolas: são dado do Desafio 01, e duplicar criaria a divergência que queremos evitar. Quando um resultado é homologado, sai um evento com versão para o Histórico Público, do Desafio 03. Cada desafio é dono do seu dado." | — |
| 14 | 4:00–4:20 | Impacto | "O estudante vê o resultado oficial na hora. O professor inscreve sem surpresa. A Secretaria ganha histórico confiável e auditoria para qualquer contestação. O campeonato passou de 28 para mais de 300 estudantes: nesse tamanho, confiança é saber de onde veio cada ponto." | — |
| 15 | 4:20–4:35 | Próximos passos | "Os próximos passos são o back-end real e o login único com os outros desafios. Usamos o Claude como apoio, e a equipe revisou tudo e responde pelas entregas. Obrigado, ficamos à disposição." | Deixar este slide durante as perguntas |

---

## 3. Demo ao vivo ou só slides?

**Recomendado: só slides.** Os slides 6 a 12 já mostram o sistema real, em alta resolução, e cabem nos 5 minutos sem risco de rede ou de clique errado.

**Demo ao vivo** só se a equipe fizer os slides 6 a 12 em **até 2:00** em três ensaios seguidos. Nesse caso, siga esta ordem:

1. Entrada → Ana → "Enviar link de acesso" → "Abrir link de acesso".
2. Inscrições → "Nova inscrição" → mostrar o bloqueio do 5º ano → trocar para 6º → "Confirmar inscrição".
3. Chaveamento → "Sortear chave".
4. "Trocar de conta" → Carlos → primeiro duelo → marcar balões → "Enviar para homologação".
5. "Trocar de conta" → Ana → Homologação → "Homologar e publicar" no duelo.
6. Placar público → Estoura Balão: o vencedor avança na chave.

Se algo travar, diga *"vou mostrar pelo slide"* e avance. Não tente consertar na frente da banca.

---

## 4. Antes de subir ao palco

- [ ] PDF dos slides aberto em tela cheia e uma cópia em pen drive (funciona sem internet).
- [ ] Protótipo aberto em outra aba, na tela de entrada, com **tema claro**. Clicar no ↺ para reiniciar os dados.
- [ ] Zoom do navegador em 125% se o telão for muito grande (o botão **A+** também ajuda).
- [ ] Notificações do computador desligadas e carregador conectado.
- [ ] Cronômetro visível para quem passa os slides, com sinais combinados: **2:00** = início das telas, **3:40** = arquitetura, **4:30** = encerrar.
- [ ] Nome da equipe e integrantes preenchidos na capa e no último slide.

---

## 5. Perguntas prováveis da banca

| Pergunta | Resposta curta | Slide de apoio |
| --- | --- | --- |
| E se o juiz errar a nota? | Antes da homologação, a coordenação devolve com motivo. Depois, só por correção, que vira nova versão. | Fluxo · Correção |
| E se uma escola contestar? | A auditoria mostra quem lançou, quem homologou, quem corrigiu e o motivo. Nada é apagado. | Apêndice · Auditoria |
| Por que não cadastrar as escolas? | A escola é dado mestre do Desafio 01. Duplicar gera divergência, que é o problema que resolvemos. | Arquitetura |
| Por que não um login por escola? | Senha compartilhada apaga da auditoria quem fez cada ação. O acesso é por pessoa, com escopo da escola. | Acessos · Apêndice · Acessos |
| E os dados dos alunos (LGPD)? | Guardamos só iniciais e ano escolar. O placar nunca mostra nome de aluno. A demo usa só dados fictícios. | Apêndice · Viabilidade |
| E se a internet cair no ginásio? | O envio da nota é idempotente. O modo offline do celular do juiz é o próximo passo do backlog. | Próximos passos |
| Escala para mais escolas? | API REST e placar em cache. Cada edição convive no mesmo banco com regras próprias. | Apêndice · Viabilidade |
| Os pesos são os oficiais? | Ainda não: são provisórios, editáveis e versionados. Entram os do edital assim que for publicado. | Apêndice · Configuração |
| Como o sorteio é justo? | A coordenação sorteia com uma semente registrada; com a mesma semente, qualquer pessoa refaz a chave. | Apêndice · Chaveamento |
| Usaram IA? | Sim, o Claude, como apoio na análise, no código e no roteiro. A equipe revisou e entende cada parte. | Próximos passos |

Regra de ouro: responda em uma frase, mostre o slide do apêndice e pare. Se não souber, diga: "não testamos isso ainda; entraria no backlog."

---

## 6. Plano de ensaio

| Ensaio | Foco | Meta |
| --- | --- | --- |
| 1 | Ler o roteiro em voz alta, com cronômetro | Saber onde estoura o tempo |
| 2 | Falar sem ler, só olhando os slides | ≤ 5:00 |
| 3 | Trocas entre apresentadores e sinais do cronômetro | ≤ 4:45 |
| 4 | Ensaio completo com 3 perguntas surpresa de colegas | ≤ 4:40 e respostas em até 20 s |
| 5 | No dia, no telão ou em uma TV grande, se possível | Conferir se a última fileira consegue ler |

**Como a banca avalia** (Regulamento, seção 8) e onde cada critério aparece:

| Critério | Peso | Onde mostramos |
| --- | --- | --- |
| Compreensão do problema | 20% | Slides 2 e 3 |
| Impacto | 20% | Slide 14 |
| Viabilidade técnica | 15% | Slide 13 e apêndice |
| Qualidade e coerência da solução | 15% | Slides 4, 9 e 10 |
| UX e acessibilidade | 10% | Slides 7, 8 e 12 |
| Engenharia, documentação e interoperabilidade | 10% | Slide 13, README e este roteiro |
| Pitch e demonstração | 10% | Tempo, clareza e o momento da homologação |

A leitura dos pesos foi feita a partir de uma foto desalinhada do regulamento. Confirmem os valores com a organização.
