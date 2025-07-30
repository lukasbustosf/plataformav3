const { supabase } = require('../database/supabase');
const logger = require('../utils/logger');

// Store active sessions and participants
const activeSessions = new Map();
const gameTimers = new Map();

function gameSocketHandler(socket, io) {
  
  // Handle joining a game session
  socket.on('game:join', async (data) => {
    try {
      const { session_id, user_id } = data;
      
      if (!session_id || !user_id) {
        socket.emit('game:error', { message: 'Session ID and User ID are required' });
        return;
      }
      
      logger.info(`User ${user_id} joining game session: ${session_id}`);

      // Get session details
      const { data: session, error } = await supabase
        .from('game_sessions')
        .select(`
          session_id, 
          status, 
          format, 
          host_id, 
          settings_json,
          quizzes (
            quiz_id,
            title,
            questions (
              question_id,
              stem_md,
              options_json,
              correct_answer,
              tts_url,
              asset_url,
              explanation
            )
          )
        `)
        .eq('session_id', session_id)
        .single();

      if (error || !session) {
        socket.emit('game:error', { message: 'Game session not found' });
        return;
      }

      // Join socket room
      socket.join(session_id);
      socket.gameSessionId = session_id;
      socket.userId = user_id;
      
      // Initialize session in memory if not exists
      if (!activeSessions.has(session_id)) {
        activeSessions.set(session_id, {
          participants: new Map(),
          status: session.status,
          format: session.format,
          currentQuestion: 0,
          settings: session.settings_json || {},
          questions: session.quizzes?.questions || [],
          gameState: initializeGameSpecificState(session.format),
          startTime: null,
          lastActivity: new Date(),
          reconnectAttempts: new Map()
        });
      }

      const activeSession = activeSessions.get(session_id);
      
      // Handle reconnection
      const existingParticipant = activeSession.participants.get(user_id);
      if (existingParticipant) {
        existingParticipant.socket_id = socket.id;
        existingParticipant.isConnected = true;
        existingParticipant.reconnectedAt = new Date().toISOString();
        
        // Reset reconnect attempts
        activeSession.reconnectAttempts.delete(user_id);
        
        socket.emit('game:reconnected', {
          session_id,
          participant: existingParticipant,
          gameState: activeSession.gameState
        });
      } else {
        // Add new participant
        activeSession.participants.set(user_id, {
          user_id,
          socket_id: socket.id,
          score: 0,
          accuracy: 0,
          time_ms: 0,
          answers: [],
          isConnected: true,
          joinedAt: new Date().toISOString(),
          gameSpecificData: initializeParticipantGameData(session.format)
        });
      }

      // Notify user they joined
      socket.emit('game:joined', {
        session_id,
        format: session.format,
        status: session.status,
        participant_count: activeSession.participants.size,
        settings: activeSession.settings,
        isHost: session.host_id === user_id,
        gameState: activeSession.gameState
      });

      // Notify others about participant status
      socket.to(session_id).emit('game:participant_updated', {
        user_id,
        participant_count: activeSession.participants.size,
        action: existingParticipant ? 'reconnected' : 'joined'
      });

      // Send current game state if game is in progress
      if (activeSession.status === 'active') {
        socket.emit('game:state_sync', {
          currentQuestion: activeSession.currentQuestion,
          gameState: activeSession.gameState,
          timeRemaining: getTimeRemaining(session_id),
          participants: getParticipantSummary(activeSession)
        });
      }

    } catch (error) {
      logger.error('Join game error:', error);
      socket.emit('game:error', { message: 'Failed to join game', error: error.message });
    }
  });

  // Handle leaving a game session
  socket.on('game:leave', async (data) => {
    try {
      const { session_id, user_id } = data;
      
      if (activeSessions.has(session_id)) {
        const activeSession = activeSessions.get(session_id);
        const participant = activeSession.participants.get(user_id);
        
        if (participant) {
          participant.isConnected = false;
          participant.leftAt = new Date().toISOString();
        }
        
        socket.leave(session_id);
        
        // Notify others
        socket.to(session_id).emit('game:participant_left', {
          user_id,
          participant_count: Array.from(activeSession.participants.values())
            .filter(p => p.isConnected).length
        });
      }
      
      logger.info(`User ${user_id} left game session: ${session_id}`);
    } catch (error) {
      logger.error('Leave game error:', error);
    }
  });

  // Handle starting a game
  socket.on('game:start', async (data) => {
    try {
      const { session_id } = data;

      if (!activeSessions.has(session_id)) {
        socket.emit('game:error', { message: 'Session not found' });
        return;
      }

      const activeSession = activeSessions.get(session_id);
      
      // Validate minimum participants based on game format
      const connectedParticipants = Array.from(activeSession.participants.values())
        .filter(p => p.isConnected);
        
      if (connectedParticipants.length === 0) {
        socket.emit('game:error', { message: 'No connected participants' });
        return;
      }
      
      // Update session status
      await supabase
        .from('game_sessions')
        .update({ 
          status: 'active', 
          started_at: new Date().toISOString() 
        })
        .eq('session_id', session_id);

      // Update local session
      activeSession.status = 'active';
      activeSession.startTime = new Date().toISOString();
      activeSession.currentQuestion = 0;
      activeSession.gameState = {
        ...activeSession.gameState,
        phase: 'playing',
        startedAt: activeSession.startTime
      };

      // Notify all participants
      io.to(session_id).emit('game:started', {
        session_id,
        started_at: activeSession.startTime,
        format: activeSession.format,
        total_questions: activeSession.questions.length,
        settings: activeSession.settings,
        gameState: activeSession.gameState
      });

      // Start first question or game loop
      setTimeout(() => {
        startNextQuestion(session_id, io);
      }, 3000); // Give time for clients to prepare

      logger.info(`Game session ${session_id} started with ${connectedParticipants.length} participants`);

    } catch (error) {
      logger.error('Start game error:', error);
      socket.emit('game:error', { message: 'Failed to start game', error: error.message });
    }
  });

  // Handle answer submission
  socket.on('game:answer', async (data) => {
    try {
      const { session_id, question_id, answer, time_taken, additional_data } = data;
      const user_id = socket.userId;

      if (!activeSessions.has(session_id)) {
        socket.emit('game:error', { message: 'Session not found' });
        return;
      }

      const activeSession = activeSessions.get(session_id);
      const participant = activeSession.participants.get(user_id);
      
      if (!participant) {
        socket.emit('game:error', { message: 'Participant not found' });
        return;
      }

      // Find the question
      const question = activeSession.questions.find(q => q.question_id === question_id);
      if (!question) {
        socket.emit('game:error', { message: 'Question not found' });
        return;
      }

      // Check if already answered this question
      const existingAnswer = participant.answers.find(a => a.question_id === question_id);
      if (existingAnswer) {
        socket.emit('game:warning', { message: 'Answer already submitted for this question' });
        return;
      }

      // Validate and score answer
      const answerResult = checkAnswer(question, answer);
      const points = calculatePoints(answerResult.isCorrect, time_taken, activeSession.format);
      
      // Update participant data
      participant.answers.push({
        question_id,
        answer,
        is_correct: answerResult.isCorrect,
        time_taken,
        points,
        submitted_at: new Date().toISOString(),
        additional_data
      });
      
      participant.score += points;
      participant.time_ms += time_taken * 1000;
      participant.accuracy = participant.answers.filter(a => a.is_correct).length / participant.answers.length;

      // Update game-specific state
      updateGameSpecificState(activeSession, user_id, answerResult, additional_data);

      // Confirm answer recorded
      socket.emit('game:answer_recorded', {
        question_id,
        is_correct: answerResult.isCorrect,
        points,
        total_score: participant.score,
        correct_answer: question.correct_answer,
        explanation: question.explanation
      });

      // Notify other participants (for competitive games)
      if (shouldBroadcastAnswer(activeSession.format)) {
        socket.to(session_id).emit('game:participant_answered', {
          user_id,
          is_correct: answerResult.isCorrect,
          points,
          time_taken
        });
      }

      // Check if all participants have answered
      const allAnswered = checkAllParticipantsAnswered(activeSession, question_id);
      if (allAnswered || isTimeBasedGame(activeSession.format)) {
        setTimeout(() => {
          sendLeaderboard(session_id, io);
          
          // Auto-advance or wait for host
          if (shouldAutoAdvance(activeSession.format)) {
            setTimeout(() => {
              startNextQuestion(session_id, io);
            }, 3000);
          }
        }, 1000);
      }

      // Save to database
      await supabase
        .from('game_answers')
        .insert({
          session_id,
          user_id,
          question_id,
          answer,
          is_correct: answerResult.isCorrect,
          time_taken,
          points,
          additional_data
        });

    } catch (error) {
      logger.error('Answer submission error:', error);
      socket.emit('game:error', { message: 'Failed to submit answer', error: error.message });
    }
  });

  // Handle game actions (pause, resume, skip, etc.)
  socket.on('game:action', async (data) => {
    try {
      const { session_id, action, payload } = data;
      const user_id = socket.userId;

      if (!activeSessions.has(session_id)) {
        socket.emit('game:error', { message: 'Session not found' });
        return;
      }

      const activeSession = activeSessions.get(session_id);
      
      // Check if user is host for certain actions
      const { data: session } = await supabase
        .from('game_sessions')
        .select('host_id')
        .eq('session_id', session_id)
        .single();

      const isHost = session?.host_id === user_id;

      switch (action) {
        case 'pause':
          if (isHost) {
            pauseGame(session_id, io);
          }
          break;
          
        case 'resume':
          if (isHost) {
            resumeGame(session_id, io);
          }
          break;
          
        case 'skip_question':
          if (isHost) {
            startNextQuestion(session_id, io);
          }
          break;
          
        case 'end_game':
          if (isHost) {
            await endGame(session_id, io);
          }
          break;
          
        case 'hint_request':
          handleHintRequest(session_id, user_id, payload, io);
          break;
          
        case 'game_specific':
          handleGameSpecificAction(activeSession, user_id, payload, io);
          break;
          
        default:
          socket.emit('game:error', { message: 'Unknown action' });
      }

    } catch (error) {
      logger.error('Game action error:', error);
      socket.emit('game:error', { message: 'Failed to execute action', error: error.message });
    }
  });

  // Handle real-time game events (for multiplayer features)
  socket.on('game:realtime', (data) => {
    try {
      const { session_id, event_type, event_data } = data;
      const user_id = socket.userId;

      if (!activeSessions.has(session_id)) return;

      const activeSession = activeSessions.get(session_id);
      
      // Broadcast real-time events to other participants
      socket.to(session_id).emit('game:realtime_event', {
        user_id,
        event_type,
        event_data,
        timestamp: new Date().toISOString()
      });

      // Update activity timestamp
      activeSession.lastActivity = new Date();

    } catch (error) {
      logger.error('Real-time event error:', error);
    }
  });

  // Handle disconnection
  socket.on('disconnect', async (reason) => {
    try {
      const session_id = socket.gameSessionId;
      const user_id = socket.userId;

      if (session_id && user_id && activeSessions.has(session_id)) {
        const activeSession = activeSessions.get(session_id);
        const participant = activeSession.participants.get(user_id);
        
        if (participant) {
          participant.isConnected = false;
          participant.disconnectedAt = new Date().toISOString();
          
          // Track reconnection attempts
          const attempts = activeSession.reconnectAttempts.get(user_id) || 0;
          activeSession.reconnectAttempts.set(user_id, attempts + 1);
          
          // Notify others
          socket.to(session_id).emit('game:participant_disconnected', {
            user_id,
            reason,
            can_reconnect: attempts < 3
          });
        }
      }

      logger.info(`Socket disconnected: ${socket.id}, reason: ${reason}`);
    } catch (error) {
      logger.error('Disconnect handling error:', error);
    }
  });
}

// Helper Functions

function initializeGameSpecificState(format) {
  const baseState = {
    phase: 'waiting',
    currentRound: 1,
    totalRounds: 1,
    timeStarted: null,
    settings: {}
  };

  switch (format) {
    case 'board_race':
      return {
        ...baseState,
        boardSize: 30,
        playerPositions: new Map(),
        diceRolls: []
      };
      
    case 'escape_room_mini':
    case 'advanced_escape_room':
      return {
        ...baseState,
        currentRoom: 'entry',
        unlockedRooms: ['entry'],
        puzzlesSolved: [],
        hintsUsed: 0
      };
      
    case 'story_path':
      return {
        ...baseState,
        currentChapter: 'start',
        visitedChapters: [],
        storyChoices: []
      };
      
    case 'debate_cards':
      return {
        ...baseState,
        totalRounds: 6,
        currentSpeaker: null,
        teamA: [],
        teamB: [],
        usedCards: []
      };
      
    case 'simulation_tycoon':
      return {
        ...baseState,
        marketConditions: generateMarketConditions(),
        playerBusinesses: new Map()
      };
      
    case 'crossword':
      return {
        ...baseState,
        gridState: {},
        completedWords: []
      };
      
    default:
      return baseState;
  }
}

function initializeParticipantGameData(format) {
  switch (format) {
    case 'board_race':
      return { position: 0, rolls: 0 };
      
    case 'memory_flip':
      return { cardsFlipped: 0, matches: 0 };
      
    case 'word_search':
      return { wordsFound: [], timeSpent: 0 };
      
    case 'simulation_tycoon':
      return { 
        business: { 
          money: 10000, 
          reputation: 50, 
          decisions: [] 
        } 
      };
      
    default:
      return {};
  }
}

function updateGameSpecificState(activeSession, userId, answerResult, additionalData) {
  const { format, gameState } = activeSession;
  
  switch (format) {
    case 'board_race':
      if (answerResult.isCorrect && additionalData?.diceRoll) {
        const participant = activeSession.participants.get(userId);
        participant.gameSpecificData.position += additionalData.diceRoll;
        participant.gameSpecificData.rolls++;
        
        gameState.playerPositions.set(userId, participant.gameSpecificData.position);
        gameState.diceRolls.push({
          userId,
          roll: additionalData.diceRoll,
          newPosition: participant.gameSpecificData.position,
          timestamp: new Date().toISOString()
        });
      }
      break;
      
    case 'memory_flip':
      if (additionalData?.cardsFlipped) {
        const participant = activeSession.participants.get(userId);
        participant.gameSpecificData.cardsFlipped += additionalData.cardsFlipped;
        if (answerResult.isCorrect) {
          participant.gameSpecificData.matches++;
        }
      }
      break;
      
    case 'word_search':
      if (answerResult.isCorrect && additionalData?.wordsFound) {
        const participant = activeSession.participants.get(userId);
        participant.gameSpecificData.wordsFound.push(...additionalData.wordsFound);
        participant.gameSpecificData.timeSpent = additionalData.timeSpent || 0;
      }
      break;
      
    case 'escape_room_mini':
    case 'advanced_escape_room':
      if (answerResult.isCorrect && additionalData?.puzzleSolved) {
        gameState.puzzlesSolved.push(additionalData.puzzleSolved);
        if (additionalData.roomUnlocked) {
          gameState.unlockedRooms.push(additionalData.roomUnlocked);
        }
      }
      if (additionalData?.hintUsed) {
        gameState.hintsUsed++;
      }
      break;
      
    case 'story_path':
      if (additionalData?.chapterChoice) {
        gameState.visitedChapters.push(gameState.currentChapter);
        gameState.currentChapter = additionalData.chapterChoice;
        gameState.storyChoices.push({
          from: gameState.visitedChapters[gameState.visitedChapters.length - 1],
          to: additionalData.chapterChoice,
          userId,
          timestamp: new Date().toISOString()
        });
      }
      break;
      
    case 'crossword':
      if (answerResult.isCorrect && additionalData?.wordCompleted) {
        gameState.completedWords.push(additionalData.wordCompleted);
        if (additionalData.gridUpdates) {
          Object.assign(gameState.gridState, additionalData.gridUpdates);
        }
      }
      break;
      
    default:
      // Store additional data for other games
      if (additionalData) {
        if (!gameState.customData) gameState.customData = {};
        if (!gameState.customData[userId]) gameState.customData[userId] = [];
        gameState.customData[userId].push({
          timestamp: new Date().toISOString(),
          data: additionalData
        });
      }
  }
  
  // Update last activity
  activeSession.lastActivity = new Date();
}

function shouldBroadcastAnswer(format) {
  const broadcastFormats = [
    'trivia_lightning',
    'board_race',
    'word_search_duel',
    'timed_equation_duel',
    'debate_cards'
  ];
  return broadcastFormats.includes(format);
}

function checkAllParticipantsAnswered(activeSession, questionId) {
  const connectedParticipants = Array.from(activeSession.participants.values())
    .filter(p => p.isConnected);
    
  return connectedParticipants.every(participant => 
    participant.answers.some(answer => answer.question_id === questionId)
  );
}

function isTimeBasedGame(format) {
  const timeBasedFormats = [
    'trivia_lightning',
    'timed_equation_duel',
    'escape_room_mini',
    'advanced_escape_room'
  ];
  return timeBasedFormats.includes(format);
}

function shouldAutoAdvance(format) {
  const autoAdvanceFormats = [
    'trivia_lightning',
    'color_match',
    'memory_flip',
    'number_line_race'
  ];
  return autoAdvanceFormats.includes(format);
}

function handleHintRequest(sessionId, userId, payload, io) {
  if (!activeSessions.has(sessionId)) return;
  
  const activeSession = activeSessions.get(sessionId);
  const participant = activeSession.participants.get(userId);
  
  if (!participant) return;
  
  // Deduct points for hint (game-specific logic)
  const hintCost = getHintCost(activeSession.format);
  participant.score = Math.max(0, participant.score - hintCost);
  
  // Track hint usage
  if (!participant.hintsUsed) participant.hintsUsed = 0;
  participant.hintsUsed++;
  
  // Send hint to user
  io.to(sessionId).emit('game:hint_provided', {
    userId,
    hint: generateHint(activeSession, payload),
    cost: hintCost,
    timestamp: new Date().toISOString()
  });
}

function getHintCost(format) {
  const hintCosts = {
    'escape_room_mini': 25,
    'advanced_escape_room': 50,
    'crossword': 10,
    'coding_puzzle': 30,
    'default': 15
  };
  return hintCosts[format] || hintCosts.default;
}

function generateHint(activeSession, payload) {
  // Generate contextual hint based on game format and current state
  const { format, currentQuestion, questions } = activeSession;
  
  if (currentQuestion < questions.length) {
    const question = questions[currentQuestion];
    
    switch (format) {
      case 'crossword':
        return `Esta palabra tiene ${payload?.wordLength || '?'} letras`;
      case 'hangman_visual':
        return `La palabra contiene la vocal más común`;
      case 'escape_room_mini':
        return `Busca pistas en el texto de la pregunta`;
      default:
        return question.explanation ? 
          `Pista: ${question.explanation.substring(0, 50)}...` : 
          'Piensa en las opciones más lógicas';
    }
  }
  
  return 'No hay pistas disponibles en este momento';
}

function handleGameSpecificAction(activeSession, userId, payload, io) {
  const { format } = activeSession;
  const { action, data } = payload;
  
  switch (format) {
    case 'debate_cards':
      if (action === 'select_card') {
        handleDebateCardSelection(activeSession, userId, data, io);
      }
      break;
      
    case 'simulation_tycoon':
      if (action === 'business_decision') {
        handleBusinessDecision(activeSession, userId, data, io);
      }
      break;
      
    case 'board_race':
      if (action === 'roll_dice') {
        handleDiceRoll(activeSession, userId, io);
      }
      break;
      
    default:
      // Broadcast generic game action
      io.to(activeSession.session_id).emit('game:action_performed', {
        userId,
        action,
        data,
        timestamp: new Date().toISOString()
      });
  }
}

function handleDebateCardSelection(activeSession, userId, cardData, io) {
  // Add card to used cards
  activeSession.gameState.usedCards.push(cardData.cardId);
  
  // Assign speaker if none
  if (!activeSession.gameState.currentSpeaker) {
    activeSession.gameState.currentSpeaker = userId;
  }
  
  io.to(activeSession.session_id).emit('game:card_selected', {
    userId,
    card: cardData,
    currentSpeaker: activeSession.gameState.currentSpeaker,
    timestamp: new Date().toISOString()
  });
}

function handleBusinessDecision(activeSession, userId, decisionData, io) {
  const participant = activeSession.participants.get(userId);
  if (!participant) return;
  
  // Update business state
  const business = participant.gameSpecificData.business;
  business.decisions.push(decisionData);
  
  // Apply decision effects based on market conditions
  const effect = calculateBusinessEffect(decisionData, activeSession.gameState.marketConditions);
  business.money += effect.moneyChange;
  business.reputation += effect.reputationChange;
  
  io.to(activeSession.session_id).emit('game:business_updated', {
    userId,
    business,
    effect,
    timestamp: new Date().toISOString()
  });
}

function calculateBusinessEffect(decision, marketConditions) {
  // Simplified business simulation logic
  let moneyChange = 0;
  let reputationChange = 0;
  
  switch (decision.type) {
    case 'marketing':
      moneyChange = -decision.investment;
      reputationChange = Math.floor(decision.investment / 100);
      break;
    case 'product_development':
      moneyChange = -decision.investment;
      if (marketConditions.innovation_trend > 0.5) {
        moneyChange += decision.investment * 1.5;
      }
      break;
    case 'expansion':
      moneyChange = -decision.investment;
      if (marketConditions.economic_growth > 0.6) {
        moneyChange += decision.investment * 2;
      }
      break;
  }
  
  return { moneyChange, reputationChange };
}

function handleDiceRoll(activeSession, userId, io) {
  const roll = Math.floor(Math.random() * 6) + 1;
  const participant = activeSession.participants.get(userId);
  
  if (participant) {
    participant.gameSpecificData.position += roll;
    participant.gameSpecificData.rolls++;
  }
  
  io.to(activeSession.session_id).emit('game:dice_rolled', {
    userId,
    roll,
    newPosition: participant?.gameSpecificData.position,
    timestamp: new Date().toISOString()
  });
}

function getParticipantSummary(activeSession) {
  const participants = [];
  
  for (const [userId, participant] of activeSession.participants.entries()) {
    participants.push({
      userId: participant.user_id,
      score: participant.score,
      isConnected: participant.isConnected,
      accuracy: participant.accuracy,
      answers: participant.answers.length,
      gameSpecificData: participant.gameSpecificData
    });
  }
  
  return participants;
}

function startNextQuestion(sessionId, io) {
  if (!activeSessions.has(sessionId)) return;
  
  const activeSession = activeSessions.get(sessionId);
  const nextQuestionIndex = activeSession.currentQuestion + 1;
  
  if (nextQuestionIndex >= activeSession.questions.length) {
    // Game completed
    setTimeout(() => {
      endGame(sessionId, io);
    }, 2000);
    return;
  }
  
  // Move to next question
  activeSession.currentQuestion = nextQuestionIndex;
  const nextQuestion = activeSession.questions[nextQuestionIndex];
  
  // Reset any question-specific state
  resetQuestionState(activeSession);
  
  // Send next question to all participants
  io.to(sessionId).emit('game:question', {
    question: nextQuestion,
    questionNumber: nextQuestionIndex + 1,
    totalQuestions: activeSession.questions.length,
    timeLimit: getQuestionTimeLimit(activeSession.format),
    gameState: activeSession.gameState
  });
  
  // Start question timer
  startQuestionTimer(sessionId, io);
  
  logger.info(`Next question started for session ${sessionId}: ${nextQuestionIndex + 1}/${activeSession.questions.length}`);
}

function resetQuestionState(activeSession) {
  // Reset any temporary state that shouldn't persist between questions
  activeSession.gameState.currentQuestionAnswers = new Map();
}

function getQuestionTimeLimit(format) {
  const timeLimits = {
    'trivia_lightning': 30,
    'timed_equation_duel': 45,
    'word_search_duel': 60,
    'escape_room_mini': 180,
    'advanced_escape_room': 300,
    'default': 60
  };
  return timeLimits[format] || timeLimits.default;
}

function startQuestionTimer(sessionId, io) {
  if (gameTimers.has(sessionId)) {
    clearTimeout(gameTimers.get(sessionId));
  }
  
  const activeSession = activeSessions.get(sessionId);
  if (!activeSession) return;
  
  const timeLimit = getQuestionTimeLimit(activeSession.format);
  
  const timer = setTimeout(() => {
    // Time's up for this question
    io.to(sessionId).emit('game:time_up', {
      questionNumber: activeSession.currentQuestion + 1
    });
    
    // Auto-advance if it's a time-based game
    if (isTimeBasedGame(activeSession.format)) {
      setTimeout(() => {
        startNextQuestion(sessionId, io);
      }, 3000);
    }
  }, timeLimit * 1000);
  
  gameTimers.set(sessionId, timer);
}

function sendLeaderboard(sessionId, io) {
  if (!activeSessions.has(sessionId)) return;
  
  const activeSession = activeSessions.get(sessionId);
  const participants = Array.from(activeSession.participants.values())
    .filter(p => p.isConnected)
    .sort((a, b) => {
      // Sort by score, then by accuracy, then by time
      if (b.score !== a.score) return b.score - a.score;
      if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
      return a.time_ms - b.time_ms;
    })
    .map((p, index) => ({
      rank: index + 1,
      userId: p.user_id,
      score: p.score,
      accuracy: Math.round(p.accuracy * 100),
      answersCount: p.answers.length,
      timeMs: p.time_ms
    }));
  
  io.to(sessionId).emit('game:leaderboard', {
    participants,
    timestamp: new Date().toISOString(),
    questionNumber: activeSession.currentQuestion + 1,
    totalQuestions: activeSession.questions.length
  });
}

async function endGame(sessionId, io) {
  if (!activeSessions.has(sessionId)) return;
  
  const activeSession = activeSessions.get(sessionId);
  
  // Calculate final results
  const finalResults = calculateFinalResults(activeSession);
  
  // Update database
  try {
    await supabase
      .from('game_sessions')
      .update({
        status: 'completed',
        ended_at: new Date().toISOString(),
        final_results: finalResults
      })
      .eq('session_id', sessionId);
    
    // Save final participant scores
    for (const [userId, participant] of activeSession.participants.entries()) {
      await supabase
        .from('game_participants')
        .upsert({
          session_id: sessionId,
          user_id: userId,
          final_score: participant.score,
          final_accuracy: participant.accuracy,
          total_time_ms: participant.time_ms,
          answers_json: participant.answers,
          game_specific_data: participant.gameSpecificData
        });
    }
  } catch (error) {
    logger.error('Error saving game results:', error);
  }
  
  // Notify all participants
  io.to(sessionId).emit('game:ended', {
    finalResults,
    sessionId,
    timestamp: new Date().toISOString()
  });
  
  // Clean up
  cleanup(sessionId);
  
  logger.info(`Game session ${sessionId} ended with ${finalResults.participants.length} participants`);
}

function calculateFinalResults(activeSession) {
  const participants = Array.from(activeSession.participants.values())
    .map(p => ({
      userId: p.user_id,
      finalScore: p.score,
      accuracy: p.accuracy,
      totalTime: p.time_ms,
      answersCount: p.answers.length,
      gameSpecificData: p.gameSpecificData
    }))
    .sort((a, b) => b.finalScore - a.finalScore);
  
  return {
    winner: participants[0],
    participants,
    gameStats: {
      totalQuestions: activeSession.questions.length,
      questionsCompleted: activeSession.currentQuestion + 1,
      duration: Date.now() - new Date(activeSession.startTime).getTime(),
      format: activeSession.format
    },
    gameState: activeSession.gameState
  };
}

function checkAnswer(question, answer) {
  if (!question || answer === undefined || answer === null) {
    return { isCorrect: false, explanation: 'Invalid answer' };
  }
  
  let isCorrect = false;
  
  // Handle different answer types
  if (Array.isArray(answer)) {
    // Multiple answers (for games like crossword, sorting)
    isCorrect = Array.isArray(question.correct_answer) ? 
      JSON.stringify(answer.sort()) === JSON.stringify(question.correct_answer.sort()) :
      answer.includes(question.correct_answer);
  } else {
    // Single answer
    const normalizedAnswer = String(answer).toLowerCase().trim();
    const normalizedCorrect = String(question.correct_answer).toLowerCase().trim();
    isCorrect = normalizedAnswer === normalizedCorrect;
  }
  
  return {
    isCorrect,
    explanation: question.explanation || '',
    correctAnswer: question.correct_answer
  };
}

function calculatePoints(isCorrect, timeTaken, format) {
  if (!isCorrect) return 0;
  
  const basePoints = getBasePoints(format);
  const timeBonus = calculateTimeBonus(timeTaken, format);
  
  return Math.round(basePoints + timeBonus);
}

function getBasePoints(format) {
  const basePointsMap = {
    'trivia_lightning': 100,
    'color_match': 50,
    'memory_flip': 75,
    'board_race': 100,
    'escape_room_mini': 200,
    'advanced_escape_room': 300,
    'coding_puzzle': 250,
    'debate_cards': 150,
    'default': 100
  };
  return basePointsMap[format] || basePointsMap.default;
}

function calculateTimeBonus(timeTaken, format) {
  const maxTimeBonus = getBasePoints(format) * 0.5; // 50% of base points
  const optimalTime = getOptimalTime(format);
  
  if (timeTaken <= optimalTime) {
    return maxTimeBonus;
  }
  
  const timeDecay = Math.max(0, 1 - (timeTaken - optimalTime) / optimalTime);
  return Math.round(maxTimeBonus * timeDecay);
}

function getOptimalTime(format) {
  const optimalTimes = {
    'trivia_lightning': 10,
    'color_match': 5,
    'timed_equation_duel': 15,
    'default': 20
  };
  return optimalTimes[format] || optimalTimes.default;
}

function pauseGame(sessionId, io) {
  if (!activeSessions.has(sessionId)) return;
  
  const activeSession = activeSessions.get(sessionId);
  activeSession.status = 'paused';
  
  // Pause any active timers
  if (gameTimers.has(sessionId)) {
    clearTimeout(gameTimers.get(sessionId));
  }
  
  io.to(sessionId).emit('game:paused', {
    timestamp: new Date().toISOString()
  });
  
  logger.info(`Game session ${sessionId} paused`);
}

function resumeGame(sessionId, io) {
  if (!activeSessions.has(sessionId)) return;
  
  const activeSession = activeSessions.get(sessionId);
  activeSession.status = 'active';
  
  // Resume question timer if in middle of question
  startQuestionTimer(sessionId, io);
  
  io.to(sessionId).emit('game:resumed', {
    timestamp: new Date().toISOString()
  });
  
  logger.info(`Game session ${sessionId} resumed`);
}

function getTimeRemaining(sessionId) {
  if (!gameTimers.has(sessionId)) return 0;
  
  const activeSession = activeSessions.get(sessionId);
  if (!activeSession) return 0;
  
  const timeLimit = getQuestionTimeLimit(activeSession.format);
  const elapsed = Date.now() - new Date(activeSession.startTime).getTime();
  
  return Math.max(0, timeLimit - Math.floor(elapsed / 1000));
}

function generateMarketConditions() {
  return {
    economic_growth: Math.random(),
    innovation_trend: Math.random(),
    competition_level: Math.random(),
    consumer_confidence: Math.random(),
    regulation_impact: Math.random(),
    timestamp: new Date().toISOString()
  };
}

function cleanup(sessionId) {
  // Clear timers
  if (gameTimers.has(sessionId)) {
    clearTimeout(gameTimers.get(sessionId));
    gameTimers.delete(sessionId);
  }
  
  // Remove session after delay to allow reconnections
  setTimeout(() => {
    activeSessions.delete(sessionId);
    logger.info(`Cleaned up session ${sessionId}`);
  }, 300000); // 5 minutes
}

module.exports = gameSocketHandler; 
