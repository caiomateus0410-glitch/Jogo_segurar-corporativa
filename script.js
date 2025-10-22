


































































































const questions = [
            {
                question: "Em que ano a Segurar Corporativa foi fundada?",
                options: ["2010", "2015", "2018", "2020"],
                correct: 1,
                category: "História"
            },
            {
                question: "Qual é a principal missão da Segurar Corporativa?",
                options: [
                    "Maximizar lucros a qualquer custo",
                    "Proteger patrimônios e pessoas com soluções inovadoras em seguros",
                    "Ser a maior seguradora do país",
                    "Oferecer apenas seguros automotivos"
                ],
                correct: 1,
                category: "Missão"
            },
            {
                question: "Qual dos seguintes NÃO é um valor da Segurar Corporativa?",
                options: ["Transparência", "Inovação", "Competição Desleal", "Compromisso com o Cliente"],
                correct: 2,
                category: "Valores"
            },
            {
                question: "Qual é a visão da Segurar Corporativa para 2030?",
                options: [
                    "Ser líder apenas no mercado nacional",
                    "Ser reconhecida como a seguradora mais inovadora e confiável do mercado",
                    "Focar apenas em seguros empresariais",
                    "Expandir apenas para países vizinhos"
                ],
                correct: 1,
                category: "Visão"
            },
            {
                question: "Em quantos estados do Brasil a Segurar Corporativa atua?",
                options: ["15 estados", "20 estados", "Todos os 26 estados + DF", "Apenas região Sudeste"],
                correct: 2,
                category: "Área de Atuação"
            },
            {
                question: "Qual setor NÃO faz parte do portfólio da Segurar Corporativa?",
                options: ["Seguros Automotivos", "Seguros Residenciais", "Seguros de Vida", "Seguros Espaciais"],
                correct: 3,
                category: "Setores"
            },
            {
                question: "Quantos colaboradores a Segurar Corporativa possui atualmente?",
                options: ["15", "22", "29", "35"],
                correct: 2,
                category: "História"
            },
            {
                question: "Qual é o diferencial competitivo da Segurar Corporativa?",
                options: [
                    "Preços mais baixos do mercado",
                    "Atendimento 24/7 e tecnologia de ponta",
                    "Apenas produtos tradicionais",
                    "Foco exclusivo em grandes empresas"
                ],
                correct: 1,
                category: "Valores"
            },
            {
                question: "A Segurar Corporativa oferece seguros para qual tipo de cliente?",
                options: [
                    "Apenas pessoas físicas",
                    "Apenas empresas",
                    "Pessoas físicas e jurídicas",
                    "Apenas multinacionais"
                ],
                correct: 2,
                category: "Área de Atuação"
            },
            {
                question: "Qual iniciativa sustentável a Segurar Corporativa implementou recentemente?",
                options: [
                    "Programa de neutralização de carbono",
                    "Uso exclusivo de papel",
                    "Eliminação de tecnologia digital",
                    "Foco apenas em lucros"
                ],
                correct: 0,
                category: "Valores"
            }
        ];

        let currentQuestion = 0;
        let score = 0;
        let selectedAnswer = null;
        let correctAnswers = 0;
        let incorrectAnswers = 0;
        let gameMode = 'classic';
        let difficulty = 'easy';
        let timeLeft = 0;
        let timer = null;
        let currentGame = '';

        // Sistema de Pontuação
        let totalPoints = 0;
        let achievements = [];
        const availableAchievements = [
            { id: 'first_game', name: 'Primeiro Passo', description: 'Complete seu primeiro jogo', points: 10, unlocked: false },
            { id: 'quiz_master', name: 'Mestre do Quiz', description: 'Complete o Quiz Corporativo', points: 20, unlocked: false },
            { id: 'memory_expert', name: 'Especialista em Memória', description: 'Complete o Jogo da Memória', points: 20, unlocked: false },
            { id: 'crossword_champion', name: 'Campeão das Palavras', description: 'Complete as Palavras Cruzadas', points: 20, unlocked: false },
            { id: 'word_hunter', name: 'Caçador de Palavras', description: 'Complete o Caça-Palavras', points: 20, unlocked: false },
            { id: 'soft_skills_star', name: 'Estrela das Soft Skills', description: 'Complete o Quiz de Soft Skills', points: 20, unlocked: false },
            { id: 'point_collector', name: 'Colecionador de Pontos', description: 'Alcance 100 pontos', points: 50, unlocked: false },
            { id: 'all_games', name: 'Mestre Completo', description: 'Complete todos os jogos', points: 100, unlocked: false }
        ];

        // Funções do Sistema de Pontuação
        function loadPlayerData() {
            const data = localStorage.getItem('segurarPlayerData');
            if (data) {
                const playerData = JSON.parse(data);
                totalPoints = playerData.totalPoints || 0;
                achievements = playerData.achievements || [];
                // Atualizar availableAchievements com status unlocked
                availableAchievements.forEach(ach => {
                    const unlockedAch = achievements.find(a => a.id === ach.id);
                    if (unlockedAch) {
                        ach.unlocked = true;
                    }
                });
            }
        }

        function savePlayerData() {
            const data = localStorage.getItem('segurarPlayerData');
            if (data) {
                const playerData = JSON.parse(data);
                playerData.totalPoints = totalPoints;
                playerData.achievements = achievements;
                localStorage.setItem('segurarPlayerData', JSON.stringify(playerData));
            }
        }

        function awardPoints(points, gameType) {
            totalPoints += points;
            checkAchievements(gameType);
            savePlayerData();
            updatePointsDisplay();
        }

        function checkAchievements(gameType) {
            // Primeiro jogo
            if (!achievements.find(a => a.id === 'first_game')) {
                achievements.push({ id: 'first_game', unlockedAt: new Date().toISOString() });
                availableAchievements.find(a => a.id === 'first_game').unlocked = true;
            }

            // Jogo específico
            const gameAchievements = {
                'quiz': 'quiz_master',
                'memory': 'memory_expert',
                'crossword': 'crossword_champion',
                'wordSearch': 'word_hunter',
                'softSkillsQuiz': 'soft_skills_star'
            };

            if (gameAchievements[gameType] && !achievements.find(a => a.id === gameAchievements[gameType])) {
                achievements.push({ id: gameAchievements[gameType], unlockedAt: new Date().toISOString() });
                availableAchievements.find(a => a.id === gameAchievements[gameType]).unlocked = true;
            }

            // Colecionador de pontos
            if (totalPoints >= 100 && !achievements.find(a => a.id === 'point_collector')) {
                achievements.push({ id: 'point_collector', unlockedAt: new Date().toISOString() });
                availableAchievements.find(a => a.id === 'point_collector').unlocked = true;
            }

            // Todos os jogos
            const gameTypes = ['quiz', 'memory', 'crossword', 'wordSearch', 'softSkillsQuiz'];
            const completedGames = achievements.filter(a => gameTypes.includes(a.id.replace('_master', '').replace('_expert', '').replace('_champion', '').replace('_hunter', '').replace('_star', ''))).length;
            if (completedGames >= 5 && !achievements.find(a => a.id === 'all_games')) {
                achievements.push({ id: 'all_games', unlockedAt: new Date().toISOString() });
                availableAchievements.find(a => a.id === 'all_games').unlocked = true;
            }
        }

        function updatePointsDisplay() {
            const pointsElement = document.getElementById('totalPoints');
            const achievementsElement = document.getElementById('achievementsList');
            const pointsProgress = document.getElementById('pointsProgress');
            const nextAchievementElement = document.getElementById('nextAchievement');

            if (pointsElement) {
                pointsElement.textContent = totalPoints;
            }

            // Calcular próxima conquista
            let nextAchievement = null;
            let progressPercent = 0;

            if (totalPoints < 10) {
                nextAchievement = 'Primeiro Passo';
                progressPercent = (totalPoints / 10) * 100;
            } else if (totalPoints < 20) {
                nextAchievement = 'Mestre do Quiz';
                progressPercent = ((totalPoints - 10) / 10) * 100;
            } else if (totalPoints < 40) {
                nextAchievement = 'Especialista em Memória';
                progressPercent = ((totalPoints - 20) / 20) * 100;
            } else if (totalPoints < 60) {
                nextAchievement = 'Campeão das Palavras';
                progressPercent = ((totalPoints - 40) / 20) * 100;
            } else if (totalPoints < 80) {
                nextAchievement = 'Caçador de Palavras';
                progressPercent = ((totalPoints - 60) / 20) * 100;
            } else if (totalPoints < 100) {
                nextAchievement = 'Estrela das Soft Skills';
                progressPercent = ((totalPoints - 80) / 20) * 100;
            } else if (totalPoints < 150) {
                nextAchievement = 'Colecionador de Pontos';
                progressPercent = ((totalPoints - 100) / 50) * 100;
            } else {
                nextAchievement = 'Mestre Completo';
                progressPercent = 100;
            }

            if (nextAchievementElement) {
                nextAchievementElement.textContent = nextAchievement;
            }

            if (pointsProgress) {
                pointsProgress.style.width = progressPercent + '%';
            }

            if (achievementsElement) {
                achievementsElement.innerHTML = '';
                availableAchievements.forEach(ach => {
                    const achElement = document.createElement('div');
                    achElement.className = `achievement-item ${ach.unlocked ? 'unlocked' : ''}`;
                    achElement.innerHTML = `
                        <div class="achievement-icon">${ach.unlocked ? '🏆' : '🔒'}</div>
                        <div class="achievement-info">
                            <div class="achievement-name">${ach.name}</div>
                            <div class="achievement-desc">${ach.description}</div>
                        </div>
                    `;
                    achievementsElement.appendChild(achElement);
                });
            }
        }

        // Dados dos jogos
        const memoryCards = [
            { id: 1, content: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=100&h=100&fit=crop', pair: 2, type: 'image' }, // RH
            { id: 2, content: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=100&h=100&fit=crop', pair: 1, type: 'image' },
            { id: 3, content: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=100&h=100&fit=crop', pair: 4, type: 'image' }, // Financeiro
            { id: 4, content: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=100&h=100&fit=crop', pair: 3, type: 'image' },
            { id: 5, content: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=100&h=100&fit=crop', pair: 6, type: 'image' }, // Jurídico
            { id: 6, content: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=100&h=100&fit=crop', pair: 5, type: 'image' },
            { id: 7, content: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=100&h=100&fit=crop', pair: 8, type: 'image' }, // TI
            { id: 8, content: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=100&h=100&fit=crop', pair: 7, type: 'image' },
            { id: 9, content: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&h=100&fit=crop', pair: 10, type: 'image' }, // Marketing
            { id: 10, content: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&h=100&fit=crop', pair: 9, type: 'image' },
            { id: 11, content: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop', pair: 12, type: 'image' }, // Operações
            { id: 12, content: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop', pair: 11, type: 'image' },
            { id: 13, content: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=100&h=100&fit=crop', pair: 14, type: 'image' }, // Vendas
            { id: 14, content: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=100&h=100&fit=crop', pair: 13, type: 'image' },
            { id: 15, content: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=100&h=100&fit=crop', pair: 16, type: 'image' }, // Administrativo
            { id: 16, content: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=100&h=100&fit=crop', pair: 15, type: 'image' }
        ];

        const wordSearchWords = [
            'SEGURAR', 'CORPORATIVA', 'SEGURO', 'CONFIANCA',
            'INOVACAO', 'QUALIDADE', 'TRANSPARENCIA', 'COMPROMISSO',
            'MISSAO', 'VALORES', 'VISAO', 'CRESCIMENTO', 'TECNOLOGIA'
        ];



        // Estados dos jogos
        let memoryState = {
            flippedCards: [],
            matchedPairs: 0,
            moves: 0,
            cards: []
        };

        let wordSearchState = {
            grid: [],
            foundWords: [],
            selectedCells: [],
            isSelecting: false,
            startCell: null,
            wordPositions: []
        };

        // Dados da linha do tempo da história da empresa
        const timelineEvents = [
            { year: "2015", event: "Fundação da Segurar Corporativa" },
            { year: "2016", event: "Primeira expansão para 5 estados brasileiros" },
            { year: "2017", event: "Lançamento do primeiro produto de seguro digital" },
            { year: "2018", event: "Certificação ISO 9001 obtida" },
            { year: "2019", event: "Expansão para todos os 27 estados (26 + DF)" },
            { year: "2020", event: "Implementação de programa de sustentabilidade" },
            { year: "2021", event: "Lançamento do aplicativo móvel" },
            { year: "2022", event: "Consolidação da equipe com 29 colaboradores especializados" },
            { year: "2023", event: "Reconhecimento como empresa mais inovadora do setor" },
            { year: "2024", event: "Implementação de inteligência artificial para monitoramento avançado" },
            { year: "2025", event: "Celebração dos 10 anos de sucesso e compromisso com a segurança" }
        ];

        // Renderizar linha do tempo na tela de história da empresa
        function renderHistoryTimeline() {
            const container = document.getElementById('historyTimeline');
            if (!container) return;

            container.innerHTML = '';

            timelineEvents.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.className = 'history-timeline-event';

                const yearElement = document.createElement('h4');
                yearElement.textContent = event.year;

                const descElement = document.createElement('p');
                descElement.textContent = event.event;

                eventElement.appendChild(yearElement);
                eventElement.appendChild(descElement);

                container.appendChild(eventElement);
            });
        }



        // Soft Skills Quiz - Formato Desafio
        const softSkillsQuestions = [
            {
                question: "📌 Desafio: Um cliente estrangeiro chega para falar com o setor administrativo. Ele fala pouco português e parece nervoso. Como você deve agir?",
                options: [
                    "Falar rápido, sem se preocupar se ele entende.",
                    "Usar frases simples, falar devagar, ser cordial e, se necessário, buscar apoio de alguém que fale outra língua.",
                    "Pedir para ele escrever em português e esperar sozinho.",
                    "Ignorar o nervosismo dele, tratando como qualquer pessoa."
                ],
                correct: 1,
                category: "Comunicação"
            },
            {
                question: "📌 Desafio: Você encontra documentos importantes misturados com papéis de rascunho em uma mesa. O gerente precisa desses documentos em 20 minutos. O que fazer?",
                options: [
                    "Guardar tudo junto em uma pasta para não perder tempo.",
                    "Separar rapidamente os documentos oficiais dos rascunhos e organizar de forma lógica (por cliente/data).",
                    "Entregar tudo bagunçado e avisar que não houve tempo.",
                    "Jogar fora o que parece irrelevante."
                ],
                correct: 1,
                category: "Organização"
            },
            {
                question: "📌 Desafio: Sua equipe tem que finalizar um relatório, mas um colega não está colaborando, atrapalhando o andamento. O prazo é hoje. O que você faz?",
                options: [
                    "Reclamar do colega diretamente para o gestor.",
                    "Conversar com ele de forma respeitosa, entender a dificuldade e redistribuir tarefas com o grupo.",
                    "Fazer sozinho a parte dele e não comentar nada.",
                    "Ignorar a situação e esperar o prazo acabar."
                ],
                correct: 1,
                category: "Trabalho em Equipe"
            },
            {
                question: "📌 Desafio: Você percebe que o sistema de cadastro de visitantes está instável e pode travar durante um evento importante. O gestor ainda não percebeu. O que você faz?",
                options: [
                    "Espera alguém reclamar para tomar providência.",
                    "Comunica imediatamente o problema e sugere usar uma lista manual como plano B.",
                    "Desliga o computador e não fala nada.",
                    "Apenas anota que o sistema está ruim, mas não compartilha com ninguém."
                ],
                correct: 1,
                category: "Proatividade"
            },
            {
                question: "📌 Desafio: Um visitante chega irritado porque foi marcado para falar com um gestor que não está na empresa no dia combinado. Ele insiste em ser atendido. O que você faz?",
                options: [
                    "Diz que não pode fazer nada e manda ele voltar outro dia.",
                    "Mantém a calma, pede desculpas, oferece anotar recado e tenta encaminhar para outro responsável disponível.",
                    "Mente e diz que o gestor chegará em alguns minutos.",
                    "Evita contato, deixando o visitante esperando indefinidamente."
                ],
                correct: 1,
                category: "Resolução de Problemas"
            },
            {
                question: "📌 Desafio: Um fornecedor tenta te oferecer um presente caro para agilizar um processo de pagamento. Como você deve reagir?",
                options: [
                    "Aceitar o presente para manter um 'bom relacionamento'.",
                    "Recusar educadamente, explicar que não é permitido e avisar o gestor.",
                    "Guardar o presente sem contar a ninguém.",
                    "Brincar que aceitaria se fosse 'um valor maior'."
                ],
                correct: 1,
                category: "Ética"
            },
            {
                question: "📌 Desafio: Você recebe uma ligação de um cliente reclamando de forma agressiva sobre um erro que não foi seu. O que fazer?",
                options: [
                    "Responder no mesmo tom, defendendo-se imediatamente.",
                    "Ouvir com calma, demonstrar empatia, pedir desculpas em nome da empresa e anotar a demanda para resolver.",
                    "Desligar a ligação para não se estressar.",
                    "Passar a ligação para outro colega sem explicar a situação."
                ],
                correct: 1,
                category: "Inteligência Emocional"
            },
            {
                question: "📌 Desafio: Dois gestores dão instruções diferentes para a mesma tarefa. Um pede que seja feito de forma rápida, outro que seja feito de forma detalhada. Como agir?",
                options: [
                    "Escolher uma das ordens e ignorar a outra.",
                    "Analisar os prós e contras, conversar com ambos para alinhar a prioridade antes de executar.",
                    "Fazer do jeito que você achar melhor, sem consultar ninguém.",
                    "Não fazer nada até que alguém perceba o erro."
                ],
                correct: 1,
                category: "Pensamento Crítico"
            },
            {
                question: "📌 Desafio: O processo de atendimento ao público está gerando filas. O que você pode propor?",
                options: [
                    "Criar um sistema de senhas ou fichas digitais para organizar a ordem de atendimento.",
                    "Deixar como está, afinal as filas 'são normais'.",
                    "Reclamar da demora sem apresentar soluções.",
                    "Pedir para os clientes se organizarem sozinhos."
                ],
                correct: 0,
                category: "Inovação e Criatividade"
            },
            {
                question: "📌 Desafio: Hoje você foi chamado para apoiar no setor administrativo, mas amanhã terá que ajudar no RH em uma entrevista de candidatos. O que fazer?",
                options: [
                    "Recusar, dizendo que não sabe nada sobre RH.",
                    "Aceitar, se preparar e acompanhar as entrevistas como aprendizado.",
                    "Fazer apenas presença e não se envolver.",
                    "Reclamar com os colegas sobre a mudança."
                ],
                correct: 1,
                category: "Adaptabilidade"
            },
            {
                question: "📌 Desafio: Você e outros aprendizes precisam organizar uma apresentação para os gestores, mas o grupo está desmotivado e confuso. Qual a melhor atitude?",
                options: [
                    "Tomar todas as decisões sozinho e ignorar opiniões.",
                    "Assumir a frente, dividir as tarefas, motivar o grupo e ouvir sugestões.",
                    "Deixar tudo para o último minuto e culpar a equipe depois.",
                    "Sair da atividade porque 'ninguém quer colaborar'."
                ],
                correct: 1,
                category: "Liderança"
            },
            {
                question: "📌 Desafio: Um colega está sobrecarregado com tarefas e você tem um pouco de tempo livre. Como você pode ajudar?",
                options: [
                    "Ignorar porque não é problema seu.",
                    "Oferecer ajuda voluntariamente e compartilhar a carga de trabalho.",
                    "Esperar ele pedir ajuda primeiro.",
                    "Fazer comentários sobre ele estar lento."
                ],
                correct: 1,
                category: "Empatia"
            },
            {
                question: "📌 Desafio: Você identifica uma oportunidade de melhoria no processo de atendimento, mas ninguém pediu sua opinião. O que fazer?",
                options: [
                    "Não falar nada para não parecer intrometido.",
                    "Compartilhar a ideia de forma construtiva com o responsável.",
                    "Impor a mudança sem consultar ninguém.",
                    "Esperar um problema maior acontecer."
                ],
                correct: 1,
                category: "Iniciativa"
            },
            {
                question: "📌 Desafio: Durante uma reunião, surge um conflito de opiniões entre colegas. Como você contribui?",
                options: [
                    "Fica em silêncio para não se envolver.",
                    "Ajuda a mediar, focando em pontos em comum e soluções.",
                    "Toma partido de um lado sem ouvir o outro.",
                    "Deixa a reunião para não presenciar o conflito."
                ],
                correct: 1,
                category: "Resolução de Conflitos"
            },
            {
                question: "📌 Desafio: Você recebe feedback negativo sobre seu trabalho. Como você reage?",
                options: [
                    "Fica defensivo e explica por que está certo.",
                    "Ouve atentamente, agradece e usa como aprendizado.",
                    "Ignora o feedback completamente.",
                    "Culpa fatores externos pelo problema."
                ],
                correct: 1,
                category: "Receptividade"
            },
            {
                question: "📌 Desafio: Um projeto importante está atrasado por causa de imprevistos. Como você ajuda?",
                options: [
                    "Desiste porque 'não era para ser'.",
                    "Se adapta, encontra alternativas e mantém o foco no resultado.",
                    "Culpa os imprevistos e abandona o projeto.",
                    "Espera tudo se resolver sozinho."
                ],
                correct: 1,
                category: "Resiliência"
            },
            {
                question: "📌 Desafio: Você precisa trabalhar com uma equipe diversificada com diferentes culturas. Como agir?",
                options: [
                    "Ignora as diferenças culturais.",
                    "Respeita e valoriza as diferentes perspectivas.",
                    "Força todos a seguirem apenas sua cultura.",
                    "Evita interações com pessoas diferentes."
                ],
                correct: 1,
                category: "Diversidade e Inclusão"
            },
            {
                question: "📌 Desafio: Você está exausto após uma semana intensa de trabalho. Como mantém o equilíbrio?",
                options: [
                    "Continua trabalhando sem pausas.",
                    "Define limites, descansa e volta renovado.",
                    "Ignora sinais de cansaço até adoecer.",
                    "Transfere responsabilidades para colegas."
                ],
                correct: 1,
                category: "Equilíbrio Vida-Trabalho"
            },
            {
                question: "📌 Desafio: Uma nova tecnologia é implementada na empresa. Como você se posiciona?",
                options: [
                    "Resiste porque prefere o jeito antigo.",
                    "Busca aprender e contribuir com ideias.",
                    "Espera os outros aprenderem primeiro.",
                    "Ignora completamente a mudança."
                ],
                correct: 1,
                category: "Aprendizado Contínuo"
            },
            {
                question: "📌 Desafio: Você precisa apresentar um relatório para a diretoria. Como se prepara?",
                options: [
                    "Faz tudo na última hora.",
                    "Planeja, organiza informações e ensaia a apresentação.",
                    "Copia de apresentações antigas.",
                    "Pede para alguém fazer por você."
                ],
                correct: 1,
                category: "Orientação a Resultados"
            },
            {
                question: "📌 Desafio: Um colega novo na empresa parece perdido. Como você ajuda?",
                options: [
                    "Ignora porque ele deveria saber sozinho.",
                    "Oferece orientação e integra ele ao time.",
                    "Faz piadas sobre a inexperiência dele.",
                    "Deixa ele descobrir tudo por tentativa e erro."
                ],
                correct: 1,
                category: "Mentoria"
            }
        ];

        let softSkillsState = {
            currentQuestion: 0,
            score: 0,
            selectedAnswer: null,
            correctAnswers: 0,
            incorrectAnswers: 0,
            questions: []
        };

        // Frases motivacionais do dia
        const dailyQuotes = [
            { text: "O sucesso é a soma de pequenos esforços repetidos dia após dia.", author: "Robert Collier" },
            { text: "A excelência não é um ato, mas um hábito.", author: "Aristóteles" },
            { text: "O futuro pertence àqueles que acreditam na beleza de seus sonhos.", author: "Eleanor Roosevelt" },
            { text: "Inovação distingue um líder de um seguidor.", author: "Steve Jobs" },
            { text: "A qualidade nunca é um acidente; é sempre o resultado de um esforço inteligente.", author: "John Ruskin" },
            { text: "Juntos somos mais fortes, juntos construímos o futuro.", author: "Segurar Corporativa" }
        ];

        // Perguntas por dificuldade
        const questionsByDifficulty = {
            easy: [0, 1, 4, 5, 8], // índices das perguntas fáceis
            medium: [2, 3, 6, 7, 9], // índices das perguntas médias
            hard: [1, 2, 3, 6, 7, 9] // índices das perguntas difíceis (repetindo algumas médias)
        };

        // Inicializar frase do dia
        function initializeDailyQuote() {
            const today = new Date().getDate();
            const quote = dailyQuotes[today % dailyQuotes.length];
            document.getElementById('dailyQuoteText').textContent = `"${quote.text}"`;
            document.querySelector('.quote-author').textContent = `- ${quote.author}`;
        }

        // Navegação entre jogos
        function selectGame(game) {
            currentGame = game;
            document.querySelector('.start-screen').classList.remove('active');

            switch(game) {
                case 'quiz':
                    document.querySelector('.quiz-selection-screen').classList.add('active');
                    break;
                case 'softSkillsQuiz':
                    document.querySelector('.soft-skills-quiz-screen').classList.add('active');
                    initSoftSkillsQuiz();
                    break;
                case 'memory':
                    document.querySelector('.memory-game-screen').classList.add('active');
                    initMemoryGame();
                    break;
                case 'crossword':
                    document.querySelector('.crossword-screen').classList.add('active');
                    initCrossword();
                    break;
                case 'wordSearch':
                    document.querySelector('.word-search-screen').classList.add('active');
                    initWordSearch();
                    break;
                case 'history':
                    document.querySelector('.history-screen').classList.add('active');
                    break;
            }
        }

        function backToMenu() {
            // Esconder todas as telas
            document.querySelectorAll('.quiz-container > div').forEach(screen => {
                screen.classList.remove('active');
            });
            // Mostrar menu principal
            document.querySelector('.start-screen').classList.add('active');
            currentGame = '';
        }

        // Função para voltar da tela de história para a tela de missão, visão e valores
        function backToMissionVision() {
            document.querySelectorAll('.quiz-container > div').forEach(screen => {
                screen.classList.remove('active');
            });
            document.querySelector('.mission-vision-screen').classList.add('active');
            currentGame = '';
        }

        function restartCurrentGame() {
            if (currentGame === 'quiz') {
                document.querySelector('.result-screen').classList.remove('active');
                document.querySelector('.quiz-selection-screen').classList.add('active');
            } else {
                selectGame(currentGame);
            }
        }

        // Selecionar modo de jogo do quiz
        function selectGameMode(mode) {
            gameMode = mode;
            const modeCards = document.querySelectorAll('.quiz-selection-screen .mode-card');
            modeCards.forEach(card => card.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))');
            
            event.target.closest('.mode-card').style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            event.target.closest('.mode-card').style.color = 'white';
            
            const btnText = {
                'classic': 'Iniciar Quiz Clássico',
                'speed': 'Iniciar Quiz Velocidade ⚡',
                'expert': 'Iniciar Quiz Expert 🧠'
            };
            
            document.getElementById('startQuizBtn').textContent = btnText[mode];
        }

        // JOGO DA MEMÓRIA
        function initMemoryGame() {
            memoryState = {
                flippedCards: [],
                matchedPairs: 0,
                moves: 0,
                cards: [...memoryCards].slice(0, 16).sort(() => Math.random() - 0.5)
            };
            
            const grid = document.getElementById('memoryGrid');
            grid.innerHTML = '';
            
            memoryState.cards.forEach((card, index) => {
                const cardElement = document.createElement('div');
                cardElement.className = 'memory-card';
                cardElement.textContent = '?';
                cardElement.onclick = () => flipCard(index);
                grid.appendChild(cardElement);
            });
            
            updateMemoryScore();
        }

        function flipCard(index) {
            if (memoryState.flippedCards.length >= 2 || 
                memoryState.flippedCards.includes(index) ||
                document.querySelectorAll('.memory-card')[index].classList.contains('matched')) {
                return;
            }
            
            const cardElement = document.querySelectorAll('.memory-card')[index];
            cardElement.classList.add('flipped');
            
            const card = memoryState.cards[index];
            if (card.type === 'image') {
                const img = document.createElement('img');
                img.src = card.content;
                img.alt = 'Departamento';
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '12px';
                cardElement.innerHTML = '';
                cardElement.appendChild(img);
            } else {
                cardElement.textContent = card.content;
            }
            
            memoryState.flippedCards.push(index);
            
            if (memoryState.flippedCards.length === 2) {
                memoryState.moves++;
                updateMemoryScore();
                
                setTimeout(() => {
                    checkMemoryMatch();
                }, 1000);
            }
        }

        function checkMemoryMatch() {
            const [first, second] = memoryState.flippedCards;
            const firstCard = memoryState.cards[first];
            const secondCard = memoryState.cards[second];
            const cardElements = document.querySelectorAll('.memory-card');
            
            if (firstCard.pair === secondCard.id || secondCard.pair === firstCard.id) {
                cardElements[first].classList.add('matched');
                cardElements[second].classList.add('matched');
                memoryState.matchedPairs++;
                
                if (memoryState.matchedPairs === 8) {
                    setTimeout(() => {
                        alert(`🎉 Parabéns! Você completou o jogo em ${memoryState.moves} movimentos!`);
                        awardPoints(20, 'memory');
                    }, 500);
                }
            } else {
                cardElements[first].classList.remove('flipped');
                cardElements[second].classList.remove('flipped');
                cardElements[first].textContent = '?';
                cardElements[second].textContent = '?';
            }
            
            memoryState.flippedCards = [];
            updateMemoryScore();
        }

        function updateMemoryScore() {
            document.getElementById('memoryMoves').textContent = memoryState.moves;
            document.getElementById('memoryPairs').textContent = memoryState.matchedPairs;
        }

        function resetMemoryGame() {
            initMemoryGame();
        }

        // PALAVRAS CRUZADAS MELHORADAS
        const crosswordData = {
            grid: [
                ['', '', '', '', '', '', '', '', '', ''],
                ['', 'S', 'E', 'G', 'U', 'R', 'A', 'R', '', ''],
                ['', '', '', '', '', '', '', 'E', '', ''],
                ['', '', '', '', '', '', '', 'A', '', ''],
                ['', '', '', '', '', '', '', 'L', '', ''],
                ['C', 'O', 'N', 'F', 'I', 'A', 'N', 'Ç', 'A', ''],
                ['', 'I', 'N', 'O', 'V', 'A', 'Ç', 'Ã', 'O', ''],
                ['', '', '', '', 'I', '', '', '', '', ''],
                ['', '', '', '', 'D', '', '', '', '', ''],
                ['', '', '', '', 'A', '', '', '', '', '']
            ],
            numbers: [
                { row: 1, col: 1, number: 1 },
                { row: 1, col: 7, number: 2 },
                { row: 5, col: 0, number: 3 },
                { row: 6, col: 1, number: 4 },
                { row: 6, col: 4, number: 5 }
            ],
            words: [
                { number: 1, direction: 'horizontal', answer: 'SEGURAR', clue: 'Nome da empresa de seguros' },
                { number: 2, direction: 'vertical', answer: 'REAL', clue: 'Moeda brasileira' },
                { number: 3, direction: 'horizontal', answer: 'CONFIANÇA', clue: 'Valor fundamental baseado na credibilidade' },
                { number: 4, direction: 'horizontal', answer: 'INOVAÇÃO', clue: 'Busca constante por soluções modernas' },
                { number: 5, direction: 'vertical', answer: 'VIDA', clue: 'Tipo de seguro para proteção pessoal' }
            ]
        };

        let crosswordState = {
            completed: [],
            currentFocus: null
        };

        function initCrossword() {
            crosswordState = {
                completed: [],
                currentFocus: null
            };
            
            const grid = document.getElementById('crosswordGrid');
            grid.innerHTML = '';
            
            // Criar grid 10x10
            for (let row = 0; row < 10; row++) {
                for (let col = 0; col < 10; col++) {
                    const cell = document.createElement('div');
                    cell.className = 'crossword-cell';
                    cell.dataset.row = row;
                    cell.dataset.col = col;
                    
                    const gridValue = crosswordData.grid[row][col];
                    
                    if (gridValue === '') {
                        // Célula preta
                        cell.classList.add('black');
                    } else {
                        // Célula branca com input
                        const input = document.createElement('input');
                        input.type = 'text';
                        input.maxLength = 1;
                        input.dataset.answer = gridValue;
                        
                        input.oninput = (e) => {
                            e.target.value = e.target.value.toUpperCase();
                            checkCrosswordProgress();
                        };
                        
                        input.onfocus = () => {
                            crosswordState.currentFocus = { row, col };
                            highlightWord(row, col);
                        };
                        
                        input.onkeydown = (e) => {
                            handleCrosswordNavigation(e, row, col);
                        };
                        
                        cell.appendChild(input);
                        
                        // Adicionar número se necessário
                        const numberData = crosswordData.numbers.find(n => n.row === row && n.col === col);
                        if (numberData) {
                            const numberSpan = document.createElement('span');
                            numberSpan.className = 'cell-number';
                            numberSpan.textContent = numberData.number;
                            cell.appendChild(numberSpan);
                        }
                    }
                    
                    grid.appendChild(cell);
                }
            }
            
            renderCrosswordClues();
        }

        function renderCrosswordClues() {
            const horizontalClues = crosswordData.words.filter(w => w.direction === 'horizontal');
            const verticalClues = crosswordData.words.filter(w => w.direction === 'vertical');
            
            document.getElementById('crosswordClues').innerHTML = `
                <div class="clues-section">
                    <div class="clues-column">
                        <h4 style="color: #667eea; margin-bottom: 15px;">🔄 HORIZONTAIS</h4>
                        ${horizontalClues.map(word => `
                            <div class="clue-item" onclick="focusWord(${word.number}, 'horizontal')">
                                <span class="clue-number">${word.number}.</span>
                                <span class="clue-text">${word.clue} (${word.answer.length} letras)</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="clues-column">
                        <h4 style="color: #667eea; margin-bottom: 15px;">⬇️ VERTICAIS</h4>
                        ${verticalClues.map(word => `
                            <div class="clue-item" onclick="focusWord(${word.number}, 'vertical')">
                                <span class="clue-number">${word.number}.</span>
                                <span class="clue-text">${word.clue} (${word.answer.length} letras)</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        function focusWord(number, direction) {
            // Encontrar a posição inicial da palavra
            const numberPos = crosswordData.numbers.find(n => n.number === number);
            if (!numberPos) return;
            
            // Focar no primeiro input da palavra
            const cell = document.querySelector(`[data-row="${numberPos.row}"][data-col="${numberPos.col}"] input`);
            if (cell) {
                cell.focus();
                highlightWord(numberPos.row, numberPos.col, direction);
            }
        }

        function highlightWord(row, col, forceDirection = null) {
            // Limpar highlights anteriores
            document.querySelectorAll('.crossword-cell').forEach(cell => {
                cell.classList.remove('highlighted', 'word-start');
            });
            
            // Encontrar qual palavra está sendo editada
            const numberData = crosswordData.numbers.find(n => n.row === row && n.col === col);
            let wordData = null;
            
            if (numberData) {
                // Se é o início de uma palavra
                wordData = crosswordData.words.find(w => w.number === numberData.number && 
                    (forceDirection ? w.direction === forceDirection : true));
            } else {
                // Procurar em qual palavra esta célula está
                for (let word of crosswordData.words) {
                    const startPos = crosswordData.numbers.find(n => n.number === word.number);
                    if (!startPos) continue;
                    
                    for (let i = 0; i < word.answer.length; i++) {
                        let checkRow = startPos.row;
                        let checkCol = startPos.col;
                        
                        if (word.direction === 'horizontal') {
                            checkCol += i;
                        } else {
                            checkRow += i;
                        }
                        
                        if (checkRow === row && checkCol === col) {
                            wordData = word;
                            break;
                        }
                    }
                    if (wordData) break;
                }
            }
            
            if (!wordData) return;
            
            // Destacar a palavra inteira
            const startPos = crosswordData.numbers.find(n => n.number === wordData.number);
            for (let i = 0; i < wordData.answer.length; i++) {
                let highlightRow = startPos.row;
                let highlightCol = startPos.col;
                
                if (wordData.direction === 'horizontal') {
                    highlightCol += i;
                } else {
                    highlightRow += i;
                }
                
                const cellToHighlight = document.querySelector(`[data-row="${highlightRow}"][data-col="${highlightCol}"]`);
                if (cellToHighlight) {
                    cellToHighlight.classList.add('highlighted');
                    if (i === 0) {
                        cellToHighlight.classList.add('word-start');
                    }
                }
            }
        }

        function handleCrosswordNavigation(e, row, col) {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                
                let newRow = row;
                let newCol = col;
                
                switch (e.key) {
                    case 'ArrowUp': newRow--; break;
                    case 'ArrowDown': newRow++; break;
                    case 'ArrowLeft': newCol--; break;
                    case 'ArrowRight': newCol++; break;
                }
                
                // Verificar limites e se a célula é válida
                if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 10) {
                    const targetCell = document.querySelector(`[data-row="${newRow}"][data-col="${newCol}"] input`);
                    if (targetCell) {
                        targetCell.focus();
                    }
                }
            }
        }

        function checkCrosswordProgress() {
            let correctWords = 0;
            let totalWords = crosswordData.words.length;
            
            crosswordData.words.forEach(word => {
                const startPos = crosswordData.numbers.find(n => n.number === word.number);
                let isCorrect = true;
                
                for (let i = 0; i < word.answer.length; i++) {
                    let checkRow = startPos.row;
                    let checkCol = startPos.col;
                    
                    if (word.direction === 'horizontal') {
                        checkCol += i;
                    } else {
                        checkRow += i;
                    }
                    
                    const input = document.querySelector(`[data-row="${checkRow}"][data-col="${checkCol}"] input`);
                    if (!input || input.value !== word.answer[i]) {
                        isCorrect = false;
                        break;
                    }
                }
                
                if (isCorrect) {
                    correctWords++;
                    // Marcar palavra como completa
                    for (let i = 0; i < word.answer.length; i++) {
                        let checkRow = startPos.row;
                        let checkCol = startPos.col;
                        
                        if (word.direction === 'horizontal') {
                            checkCol += i;
                        } else {
                            checkRow += i;
                        }
                        
                        const cell = document.querySelector(`[data-row="${checkRow}"][data-col="${checkCol}"]`);
                        if (cell) {
                            cell.classList.add('completed');
                        }
                    }
                }
            });
            
            // Verificar se completou tudo
            if (correctWords === totalWords) {
                setTimeout(() => {
                    alert('🎉 Parabéns! Você completou todas as palavras cruzadas!');
                    awardPoints(20, 'crossword');
                }, 500);
            }
        }

        function checkCrossword() {
            checkCrosswordProgress();
            
            // Mostrar dicas para palavras incorretas
            crosswordData.words.forEach(word => {
                const startPos = crosswordData.numbers.find(n => n.number === word.number);
                let isCorrect = true;
                
                for (let i = 0; i < word.answer.length; i++) {
                    let checkRow = startPos.row;
                    let checkCol = startPos.col;
                    
                    if (word.direction === 'horizontal') {
                        checkCol += i;
                    } else {
                        checkRow += i;
                    }
                    
                    const input = document.querySelector(`[data-row="${checkRow}"][data-col="${checkCol}"] input`);
                    if (!input || input.value !== word.answer[i]) {
                        isCorrect = false;
                        break;
                    }
                }
                
                if (!isCorrect) {
                    // Destacar palavra incorreta
                    for (let i = 0; i < word.answer.length; i++) {
                        let checkRow = startPos.row;
                        let checkCol = startPos.col;
                        
                        if (word.direction === 'horizontal') {
                            checkCol += i;
                        } else {
                            checkRow += i;
                        }
                        
                        const cell = document.querySelector(`[data-row="${checkRow}"][data-col="${checkCol}"]`);
                        if (cell) {
                            cell.classList.add('incorrect');
                            setTimeout(() => cell.classList.remove('incorrect'), 2000);
                        }
                    }
                }
            });
        }

        function resetCrossword() {
            initCrossword();
        }

        // CAÇA-PALAVRAS MELHORADO
        function initWordSearch() {
            wordSearchState = {
                grid: generateWordSearchGrid(),
                foundWords: [],
                selectedCells: [],
                isSelecting: false,
                startCell: null,
                wordPositions: []
            };
            
            renderWordSearch();
        }

        function generateWordSearchGrid() {
            const grid = Array(14).fill().map(() => Array(14).fill(''));
            wordSearchState.wordPositions = [];

            // Definir direções possíveis (adicionadas mais direções para maior randomização)
            const directions = [
                { name: 'horizontal', deltaRow: 0, deltaCol: 1 },
                { name: 'vertical', deltaRow: 1, deltaCol: 0 },
                { name: 'diagonal-down-right', deltaRow: 1, deltaCol: 1 },
                { name: 'diagonal-up-right', deltaRow: -1, deltaCol: 1 },
                { name: 'diagonal-down-left', deltaRow: 1, deltaCol: -1 },
                { name: 'diagonal-up-left', deltaRow: -1, deltaCol: -1 }
            ];

            // Palavras para colocar (embaralhadas para randomização)
            const wordsToPlace = [
                'SEGURAR', 'CORPORATIVA', 'SEGURO', 'CONFIANCA',
                'INOVACAO', 'QUALIDADE', 'TRANSPARENCIA', 'COMPROMISSO',
                'MISSAO', 'VALORES', 'VISAO', 'CRESCIMENTO', 'TECNOLOGIA'
            ].sort(() => Math.random() - 0.5); // Embaralhar ordem das palavras

            // Função para verificar se uma posição é válida para uma palavra
            function canPlaceWord(word, startRow, startCol, direction) {
                for (let i = 0; i < word.length; i++) {
                    const currentRow = startRow + i * direction.deltaRow;
                    const currentCol = startCol + i * direction.deltaCol;

                    // Verificar limites do grid
                    if (currentRow < 0 || currentRow >= 14 || currentCol < 0 || currentCol >= 14) {
                        return false;
                    }

                    // Verificar se a célula já está ocupada por outra palavra
                    // (permitir sobreposição apenas se for a mesma letra)
                    const existingLetter = grid[currentRow][currentCol];
                    if (existingLetter !== word[i] && existingLetter !== '') {
                        // Verificar se já foi colocada por uma palavra anterior
                        const isOccupied = wordSearchState.wordPositions.some(wordPos => {
                            return wordPos.positions.some(pos =>
                                pos.row === currentRow && pos.col === currentCol
                            );
                        });
                        if (isOccupied) {
                            return false;
                        }
                    }
                }
                return true;
            }

            // Tentar colocar cada palavra
            wordsToPlace.forEach(word => {
                let placed = false;
                let attempts = 0;
                const maxAttempts = 100; // Evitar loop infinito

                while (!placed && attempts < maxAttempts) {
                    // Escolher direção aleatória
                    const direction = directions[Math.floor(Math.random() * directions.length)];

                    // Escolher posição inicial aleatória
                    const startRow = Math.floor(Math.random() * 14);
                    const startCol = Math.floor(Math.random() * 14);

                    // Verificar se a palavra pode ser colocada nesta posição
                    if (canPlaceWord(word, startRow, startCol, direction)) {
                        // Colocar a palavra
                        const positions = [];
                        for (let i = 0; i < word.length; i++) {
                            const currentRow = startRow + i * direction.deltaRow;
                            const currentCol = startCol + i * direction.deltaCol;

                            grid[currentRow][currentCol] = word[i];
                            positions.push({ row: currentRow, col: currentCol });
                        }

                        wordSearchState.wordPositions.push({
                            word: word,
                            positions: positions
                        });

                        placed = true;
                    }

                    attempts++;
                }

                // Se não conseguiu colocar após várias tentativas, colocar em posição fallback
                if (!placed) {
                    console.warn(`Não foi possível posicionar aleatoriamente a palavra: ${word}. Usando posição fallback.`);
                    // Fallback: tentar colocar horizontalmente a partir de uma posição aleatória
                    const fallbackRow = Math.floor(Math.random() * 14);
                    const fallbackCol = Math.floor(Math.random() * (14 - word.length));

                    if (fallbackCol >= 0) {
                        const positions = [];
                        for (let i = 0; i < word.length; i++) {
                            const currentCol = fallbackCol + i;
                            grid[fallbackRow][currentCol] = word[i];
                            positions.push({ row: fallbackRow, col: currentCol });
                        }

                        wordSearchState.wordPositions.push({
                            word: word,
                            positions: positions
                        });
                    }
                }
            });

            // Preencher células vazias com letras aleatórias para aumentar dificuldade
            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            for (let row = 0; row < 14; row++) {
                for (let col = 0; col < 14; col++) {
                    if (grid[row][col] === '') {
                        grid[row][col] = alphabet[Math.floor(Math.random() * alphabet.length)];
                    }
                }
            }

            return grid;
        }

        function renderWordSearch() {
            const grid = document.getElementById('wordSearchGrid');
            grid.innerHTML = '';
            
            wordSearchState.grid.forEach((row, i) => {
                row.forEach((cell, j) => {
                    const cellElement = document.createElement('div');
                    cellElement.className = 'word-search-cell';
                    cellElement.textContent = cell;
                    cellElement.dataset.row = i;
                    cellElement.dataset.col = j;
                    
                    // Verificar se a célula faz parte de uma palavra encontrada
                    const isPartOfFoundWord = wordSearchState.wordPositions.some(wordPos => {
                        return wordSearchState.foundWords.includes(wordPos.word) &&
                               wordPos.positions.some(pos => pos.row === i && pos.col === j);
                    });
                    
                    if (isPartOfFoundWord) {
                        cellElement.classList.add('found');
                    }
                    
                    // Eventos de mouse para seleção
                    cellElement.addEventListener('mousedown', (e) => startSelection(i, j, e));
                    cellElement.addEventListener('mouseenter', (e) => continueSelection(i, j, e));
                    cellElement.addEventListener('mouseup', (e) => endSelection(i, j, e));
                    
                    grid.appendChild(cellElement);
                });
            });
            
            // Renderizar lista de palavras
            const wordsList = document.getElementById('wordsList');
            wordsList.innerHTML = '';
            
            wordSearchWords.forEach(word => {
                const wordElement = document.createElement('div');
                wordElement.className = 'word-item';
                wordElement.textContent = word;
                if (wordSearchState.foundWords.includes(word)) {
                    wordElement.classList.add('found');
                }
                wordsList.appendChild(wordElement);
            });
            
            document.getElementById('wordsFound').textContent = wordSearchState.foundWords.length;
            
            // Adicionar eventos globais
            document.addEventListener('mouseup', () => {
                if (wordSearchState.isSelecting) {
                    endSelection();
                }
            });
        }

        function startSelection(row, col, event) {
            event.preventDefault();
            wordSearchState.isSelecting = true;
            wordSearchState.startCell = { row, col };
            wordSearchState.selectedCells = [{ row, col }];
            
            updateSelectedCells();
        }

        function continueSelection(row, col, event) {
            if (!wordSearchState.isSelecting || !wordSearchState.startCell) return;
            
            event.preventDefault();
            
            // Calcular células entre início e posição atual
            const cells = getCellsBetween(wordSearchState.startCell, { row, col });
            wordSearchState.selectedCells = cells;
            
            updateSelectedCells();
        }

        function endSelection(row, col, event) {
            if (!wordSearchState.isSelecting) return;
            
            event?.preventDefault();
            wordSearchState.isSelecting = false;
            
            // Verificar se a seleção forma uma palavra válida
            const selectedWord = getSelectedWord();
            const reverseWord = selectedWord.split('').reverse().join('');
            
            if ((wordSearchWords.includes(selectedWord) || wordSearchWords.includes(reverseWord)) && 
                !wordSearchState.foundWords.includes(selectedWord) && 
                !wordSearchState.foundWords.includes(reverseWord)) {
                
                // Palavra encontrada!
                const foundWord = wordSearchWords.includes(selectedWord) ? selectedWord : reverseWord;
                wordSearchState.foundWords.push(foundWord);
                
                // Marcar células como encontradas permanentemente
                wordSearchState.selectedCells.forEach(cell => {
                    const cellElement = document.querySelector(`[data-row="${cell.row}"][data-col="${cell.col}"]`);
                    if (cellElement) {
                        cellElement.classList.add('found');
                    }
                });
                
                // Verificar se todas as palavras foram encontradas
                if (wordSearchState.foundWords.length === wordSearchWords.length) {
                    setTimeout(() => {
                        alert('🎉 Parabéns! Você encontrou todas as palavras!');
                        awardPoints(20, 'wordSearch');
                    }, 500);
                }
            }
            
            // Limpar seleção atual
            clearSelection();
            renderWordSearch();
        }

        function getCellsBetween(start, end) {
            const cells = [];
            const rowDiff = end.row - start.row;
            const colDiff = end.col - start.col;

            // Determinar direção (horizontal, vertical ou diagonal)
            let stepRow = 0, stepCol = 0;

            if (rowDiff === 0) {
                // Horizontal
                stepCol = colDiff > 0 ? 1 : -1;
            } else if (colDiff === 0) {
                // Vertical
                stepRow = rowDiff > 0 ? 1 : -1;
            } else if (Math.abs(rowDiff) === Math.abs(colDiff)) {
                // Diagonal
                stepRow = rowDiff > 0 ? 1 : -1;
                stepCol = colDiff > 0 ? 1 : -1;
            } else {
                // Linha não válida, retornar apenas célula inicial
                return [start];
            }

            let currentRow = start.row;
            let currentCol = start.col;

            while (true) {
                cells.push({ row: currentRow, col: currentCol });

                if (currentRow === end.row && currentCol === end.col) break;

                currentRow += stepRow;
                currentCol += stepCol;

                // Verificar limites (grid 14x14)
                if (currentRow < 0 || currentRow >= 14 || currentCol < 0 || currentCol >= 14) break;
            }

            return cells;
        }

        function getSelectedWord() {
            return wordSearchState.selectedCells
                .map(cell => wordSearchState.grid[cell.row][cell.col])
                .join('');
        }

        function updateSelectedCells() {
            // Limpar seleções anteriores
            document.querySelectorAll('.word-search-cell.selected').forEach(cell => {
                cell.classList.remove('selected');
            });
            
            // Aplicar nova seleção
            wordSearchState.selectedCells.forEach(cell => {
                const cellElement = document.querySelector(`[data-row="${cell.row}"][data-col="${cell.col}"]`);
                if (cellElement && !cellElement.classList.contains('found')) {
                    cellElement.classList.add('selected');
                }
            });
        }

        function clearSelection() {
            document.querySelectorAll('.word-search-cell.selected').forEach(cell => {
                cell.classList.remove('selected');
            });
            wordSearchState.selectedCells = [];
            wordSearchState.startCell = null;
        }

        function resetWordSearch() {
            initWordSearch();
        }



        // Selecionar dificuldade
        function selectDifficulty(level) {
            difficulty = level;
            const difficultyBtns = document.querySelectorAll('.difficulty-btn');
            difficultyBtns.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
        }

        function startQuiz() {
            document.querySelector('.quiz-selection-screen').classList.remove('active');
            document.querySelector('.question-screen').classList.add('active');
            currentQuestion = 0;
            score = 0;
            correctAnswers = 0;
            incorrectAnswers = 0;
            currentGame = 'quiz';
            
            // Configurar perguntas baseado na dificuldade
            if (difficulty !== 'easy') {
                // Embaralhar perguntas para dificuldades médias e difíceis
                const availableQuestions = questionsByDifficulty[difficulty];
                questions.sort(() => Math.random() - 0.5);
            }
            
            showQuestion();
        }

        function showQuestion() {
            const question = questions[currentQuestion];
            
            document.getElementById('questionCounter').textContent = `Pergunta ${currentQuestion + 1} de ${questions.length} • ${gameMode.toUpperCase()}`;
            document.getElementById('questionText').textContent = question.question;
            
            const progressPercent = ((currentQuestion) / questions.length) * 100;
            document.getElementById('progressFill').style.width = progressPercent + '%';
            
            const optionsContainer = document.getElementById('optionsContainer');
            optionsContainer.innerHTML = '';
            
            question.options.forEach((option, index) => {
                const optionElement = document.createElement('div');
                optionElement.className = 'option';
                optionElement.textContent = option;
                optionElement.onclick = () => selectAnswer(index);
                optionsContainer.appendChild(optionElement);
            });
            
            selectedAnswer = null;
            document.getElementById('nextBtn').disabled = true;
            
            // Iniciar timer para modo velocidade
            if (gameMode === 'speed') {
                startTimer();
            }
        }

        // Timer para modo velocidade
        function startTimer() {
            timeLeft = 15;
            updateTimerDisplay();
            
            timer = setInterval(() => {
                timeLeft--;
                updateTimerDisplay();
                
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    // Auto-selecionar resposta aleatória se tempo acabar
                    if (selectedAnswer === null) {
                        const randomAnswer = Math.floor(Math.random() * 4);
                        selectAnswer(randomAnswer);
                        setTimeout(() => nextQuestion(), 1000);
                    }
                }
            }, 1000);
        }

        function updateTimerDisplay() {
            const counterElement = document.getElementById('questionCounter');
            if (gameMode === 'speed') {
                counterElement.innerHTML = `Pergunta ${currentQuestion + 1} de ${questions.length} • VELOCIDADE • ⏰ ${timeLeft}s`;
                
                if (timeLeft <= 5) {
                    counterElement.style.color = '#f44336';
                    counterElement.style.fontWeight = 'bold';
                } else {
                    counterElement.style.color = '#666';
                    counterElement.style.fontWeight = '500';
                }
            }
        }

        function selectAnswer(index) {
            selectedAnswer = index;
            const options = document.querySelectorAll('.option');
            
            options.forEach((option, i) => {
                option.classList.remove('selected', 'correct', 'incorrect');
                if (i === index) {
                    option.classList.add('selected');
                }
            });
            
            document.getElementById('nextBtn').disabled = false;
        }

        function nextQuestion() {
            // Parar timer se estiver rodando
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
            
            const question = questions[currentQuestion];
            const options = document.querySelectorAll('.option');
            
            // Mostrar resposta correta
            options.forEach((option, i) => {
                if (i === question.correct) {
                    option.classList.add('correct');
                } else if (i === selectedAnswer && i !== question.correct) {
                    option.classList.add('incorrect');
                }
            });
            
            // Calcular pontuação baseada no modo de jogo
            let points = 10;
            if (gameMode === 'speed' && timeLeft > 10) {
                points = 15; // Bonus por velocidade
            } else if (gameMode === 'expert') {
                points = 15; // Mais pontos no modo expert
            }
            
            if (selectedAnswer === question.correct) {
                score += points;
                correctAnswers++;
            } else {
                incorrectAnswers++;
            }
            
            setTimeout(() => {
                currentQuestion++;
                
                if (currentQuestion < questions.length) {
                    showQuestion();
                } else {
                    showResults();
                }
            }, 1500);
        }

        function showResults() {
            document.querySelector('.question-screen').classList.remove('active');
            document.querySelector('.result-screen').classList.add('active');
            
            const percentage = (correctAnswers / questions.length) * 100;
            const maxScore = gameMode === 'expert' ? questions.length * 15 : questions.length * 10;
            
            document.getElementById('finalScore').textContent = `${score}/${maxScore}`;
            document.getElementById('correctAnswers').textContent = correctAnswers;
            document.getElementById('incorrectAnswers').textContent = incorrectAnswers;
            document.getElementById('percentage').textContent = `${percentage.toFixed(1)}%`;
            
            let emoji, message;
            
            // Mensagens personalizadas por modo de jogo
            if (gameMode === 'speed') {
                if (percentage >= 90) {
                    emoji = '⚡';
                    message = 'Incrível! Velocidade e precisão perfeitas!';
                } else if (percentage >= 70) {
                    emoji = '🚀';
                    message = 'Excelente reflexos! Você é rápido e certeiro!';
                } else {
                    emoji = '⏰';
                    message = 'Boa tentativa! A velocidade vem com a prática!';
                }
            } else if (gameMode === 'expert') {
                if (percentage >= 90) {
                    emoji = '🧠';
                    message = 'Genial! Você domina todos os aspectos da empresa!';
                } else if (percentage >= 70) {
                    emoji = '🎓';
                    message = 'Impressionante conhecimento corporativo!';
                } else {
                    emoji = '📖';
                    message = 'Continue estudando para se tornar um expert!';
                }
            } else {
                if (percentage >= 90) {
                    emoji = '🏆';
                    message = 'Excelente! Você é um expert na Segurar Corporativa!';
                } else if (percentage >= 70) {
                    emoji = '🎉';
                    message = 'Muito bem! Você conhece bem nossa empresa!';
                } else if (percentage >= 50) {
                    emoji = '👍';
                    message = 'Bom trabalho! Continue aprendendo sobre nós!';
                } else {
                    emoji = '📚';
                    message = 'Que tal conhecer mais sobre a Segurar Corporativa?';
                }
            }
            
            document.getElementById('resultEmoji').textContent = emoji;
            document.getElementById('scoreMessage').textContent = message;

            awardPoints(20, 'quiz');
        }

        function restartQuiz() {
            document.querySelector('.result-screen').classList.remove('active');
            document.querySelector('.start-screen').classList.add('active');

            // Resetar seleções visuais
            const modeCards = document.querySelectorAll('.mode-card');
            modeCards.forEach(card => {
                card.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))';
                card.style.color = '';
            });

            gameMode = 'classic';
            difficulty = 'easy';
            document.getElementById('startQuizBtn').textContent = 'Iniciar Quiz Clássico';

            // Resetar dificuldade
            const difficultyBtns = document.querySelectorAll('.difficulty-btn');
            difficultyBtns.forEach(btn => btn.classList.remove('active'));
            difficultyBtns[0].classList.add('active');
        }

        // SOFT SKILLS QUIZ
        function initSoftSkillsQuiz() {
            softSkillsState = {
                currentQuestion: 0,
                score: 0,
                selectedAnswer: null,
                correctAnswers: 0,
                incorrectAnswers: 0,
                questions: [...softSkillsQuestions].sort(() => Math.random() - 0.5)
            };

            // Embaralhar opções de cada pergunta para evitar padrão fixo
            softSkillsState.questions.forEach(question => {
                shuffleQuestionOptions(question);
            });

            showSoftSkillsQuestion();
        }

        // Função para embaralhar opções e ajustar índice correto
        function shuffleQuestionOptions(question) {
            const originalCorrectIndex = question.correct;
            const originalOptions = [...question.options];

            // Criar array de índices e embaralhar
            const indices = [0, 1, 2, 3];
            for (let i = indices.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [indices[i], indices[j]] = [indices[j], indices[i]];
            }

            // Reordenar opções baseado nos índices embaralhados
            const shuffledOptions = indices.map(index => originalOptions[index]);

            // Encontrar novo índice da resposta correta
            const newCorrectIndex = indices.indexOf(originalCorrectIndex);

            // Atualizar pergunta com opções embaralhadas e novo índice correto
            question.options = shuffledOptions;
            question.correct = newCorrectIndex;
        }

        function showSoftSkillsQuestion() {
            const question = softSkillsState.questions[softSkillsState.currentQuestion];

            document.getElementById('softSkillsQuestionCounter').textContent = `Pergunta ${softSkillsState.currentQuestion + 1} de ${softSkillsState.questions.length}`;
            document.getElementById('softSkillsQuestionText').textContent = question.question;
            document.getElementById('softSkillsCategory').textContent = question.category;

            const progressPercent = ((softSkillsState.currentQuestion) / softSkillsState.questions.length) * 100;
            document.getElementById('softSkillsProgressFill').style.width = progressPercent + '%';

            const optionsContainer = document.getElementById('softSkillsOptionsContainer');
            optionsContainer.innerHTML = '';

            question.options.forEach((option, index) => {
                const optionElement = document.createElement('div');
                optionElement.className = 'soft-skills-option';
                optionElement.textContent = option;
                optionElement.onclick = () => selectSoftSkillsAnswer(index);
                optionsContainer.appendChild(optionElement);
            });

            softSkillsState.selectedAnswer = null;
            document.getElementById('softSkillsNextBtn').disabled = true;
        }

        function selectSoftSkillsAnswer(index) {
            softSkillsState.selectedAnswer = index;
            const options = document.querySelectorAll('.soft-skills-option');
            const question = softSkillsState.questions[softSkillsState.currentQuestion];

            options.forEach((option, i) => {
                option.classList.remove('selected', 'correct', 'incorrect');
                if (i === question.correct) {
                    option.classList.add('correct');
                } else if (i === index && i !== question.correct) {
                    option.classList.add('incorrect');
                }
                if (i === index) {
                    option.classList.add('selected');
                }
            });

            // Enable next button after showing feedback
            setTimeout(() => {
                document.getElementById('softSkillsNextBtn').disabled = false;
            }, 500);
        }

        function nextSoftSkillsQuestion() {
            const question = softSkillsState.questions[softSkillsState.currentQuestion];

            if (softSkillsState.selectedAnswer === question.correct) {
                softSkillsState.score += 10;
                softSkillsState.correctAnswers++;
            } else {
                softSkillsState.incorrectAnswers++;
            }

            setTimeout(() => {
                softSkillsState.currentQuestion++;

                if (softSkillsState.currentQuestion < softSkillsState.questions.length) {
                    showSoftSkillsQuestion();
                } else {
                    showSoftSkillsResults();
                }
            }, 1500);
        }

        function showSoftSkillsResults() {
            document.querySelector('.soft-skills-quiz-screen').classList.remove('active');
            document.querySelector('.soft-skills-result-screen').classList.add('active');

            const percentage = (softSkillsState.correctAnswers / softSkillsState.questions.length) * 100;

            document.getElementById('softSkillsFinalScore').textContent = `${softSkillsState.score}/${softSkillsState.questions.length * 10}`;
            document.getElementById('softSkillsCorrectAnswers').textContent = softSkillsState.correctAnswers;
            document.getElementById('softSkillsIncorrectAnswers').textContent = softSkillsState.incorrectAnswers;
            document.getElementById('softSkillsPercentage').textContent = `${percentage.toFixed(1)}%`;

            let emoji, message;

            if (percentage >= 90) {
                emoji = '🌟';
                message = 'Excelente! Você tem habilidades interpessoais excepcionais!';
            } else if (percentage >= 70) {
                emoji = '🎯';
                message = 'Muito bem! Suas soft skills estão bem desenvolvidas!';
            } else if (percentage >= 50) {
                emoji = '📈';
                message = 'Bom trabalho! Há espaço para desenvolvimento!';
            } else {
                emoji = '📚';
                message = 'Que tal trabalhar mais nas suas habilidades interpessoais?';
            }

            document.getElementById('softSkillsResultEmoji').textContent = emoji;
            document.getElementById('softSkillsScoreMessage').textContent = message;

            awardPoints(20, 'softSkillsQuiz');
        }

        function restartSoftSkillsQuiz() {
            document.querySelector('.soft-skills-result-screen').classList.remove('active');
            document.querySelector('.start-screen').classList.add('active');
            currentGame = '';
        }

        // Validação em tempo real do formulário de cadastro
        function validateField(field, value) {
            const errorElement = field.parentElement.querySelector('.field-error');

            switch(field.id) {
                case 'playerName':
                    if (!value.trim()) {
                        showError(errorElement, 'Nome é obrigatório');
                        return false;
                    }
                    if (value.trim().length < 2) {
                        showError(errorElement, 'Nome deve ter pelo menos 2 caracteres');
                        return false;
                    }
                    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value.trim())) {
                        showError(errorElement, 'Nome deve conter apenas letras');
                        return false;
                    }
                    break;

                case 'playerEmail':
                    if (!value.trim()) {
                        showError(errorElement, 'E-mail é obrigatório');
                        return false;
                    }
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value.trim())) {
                        showError(errorElement, 'Digite um e-mail válido');
                        return false;
                    }
                    break;

                case 'playerState':
                    if (!value) {
                        showError(errorElement, 'Selecione um estado');
                        return false;
                    }
                    break;
            }

            hideError(errorElement);
            return true;
        }

        function showError(errorElement, message) {
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.classList.add('show');
            }
        }

        function hideError(errorElement) {
            if (errorElement) {
                errorElement.classList.remove('show');
            }
        }

        function validateForm() {
            const nameField = document.getElementById('playerName');
            const emailField = document.getElementById('playerEmail');
            const stateField = document.getElementById('playerState');

            const isNameValid = validateField(nameField, nameField.value);
            const isEmailValid = validateField(emailField, emailField.value);
            const isStateValid = validateField(stateField, stateField.value);

            return isNameValid && isEmailValid && isStateValid;
        }

        // Inicializar quando a página carregar
        window.onload = function() {
            initializeDailyQuote();
            loadPlayerData();
            updatePointsDisplay();

            // Adicionar validação em tempo real aos campos do formulário
            const formFields = ['playerName', 'playerEmail', 'playerState'];

            formFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.addEventListener('input', function() {
                        validateField(this, this.value);
                    });

                    field.addEventListener('blur', function() {
                        validateField(this, this.value);
                    });
                }
            });

            // Adicionar listener para o formulário de cadastro
            const registrationForm = document.getElementById('registrationForm');
            registrationForm.addEventListener('submit', function(event) {
                event.preventDefault();

                // Validar todos os campos
                if (!validateForm()) {
                    // Encontrar primeiro campo com erro e focar nele
                    const firstErrorField = document.querySelector('.field-error.show');
                    if (firstErrorField) {
                        const inputField = firstErrorField.parentElement.querySelector('input, select');
                        if (inputField) {
                            inputField.focus();
                        }
                    }
                    return;
                }

                // Obter valores validados
                const name = document.getElementById('playerName').value.trim();
                const email = document.getElementById('playerEmail').value.trim();
                const state = document.getElementById('playerState').value;

                // Salvar dados do jogador (localStorage para persistência)
                const playerData = { name, email, state };
                localStorage.setItem('segurarPlayerData', JSON.stringify(playerData));
                window.playerData = playerData;

                // Mostrar pop-up de boas-vindas
                const welcomePopup = document.getElementById('welcomePopup');
                const welcomeMessage = document.getElementById('welcomeMessage');
                welcomeMessage.textContent = `Bem-vindo, ${name}! Cadastro concluído com sucesso!`;
                welcomePopup.classList.add('active');

                // Função para fechar o pop-up e navegar para a próxima tela
                window.closeWelcomePopup = function() {
                    welcomePopup.classList.remove('active');
                    document.querySelector('.registration-screen').classList.remove('active');
                    document.querySelector('.mission-vision-screen').classList.add('active');
                };
            });

        // Função para ir da tela de missão, visão e valores para o menu principal
        window.goToMenu = function() {
            document.querySelector('.mission-vision-screen').classList.remove('active');
            document.querySelector('.start-screen').classList.add('active');
        };

        // Função para ir da tela de missão, visão e valores para a história da empresa
        window.goToHistory = function() {
            document.querySelector('.mission-vision-screen').classList.remove('active');
            document.querySelector('.history-screen').classList.add('active');
            renderHistoryTimeline();
        };

        // Função para ir da tela de missão, visão e valores para os setores da empresa
        window.goToSectors = function() {
            document.querySelector('.mission-vision-screen').classList.remove('active');
            document.querySelector('.sectors-screen').classList.add('active');
        };

        // Função para ir da tela de missão, visão e valores para as atividades do jovem aprendiz
        window.goToApprentice = function() {
            document.querySelector('.mission-vision-screen').classList.remove('active');
            document.querySelector('.apprentice-screen').classList.add('active');
        };

        // Função para mostrar explicação detalhada da atividade
        window.showActivityExplanation = function(title, icon, description) {
            document.getElementById('activityIcon').textContent = icon;
            document.getElementById('activityTitle').textContent = title;
            document.getElementById('activityDescription').textContent = description;
            document.getElementById('activityPopup').classList.add('active');
        };

        // Função para fechar o pop-up de atividade
        window.closeActivityPopup = function() {
            document.getElementById('activityPopup').classList.remove('active');
        };
    };
