const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Game Session Persistence Service
 * Handles saving and loading game sessions from database
 */
class GameSessionPersistenceService {
  
  /**
   * Save a game session to the database
   */
  async saveGameSession(gameSession) {
    try {
      console.log(`💾 Saving game session to database: ${gameSession.session_id}`);
      
      const { data, error } = await supabase
        .from('game_sessions')
        .upsert([{
          session_id: gameSession.session_id,
          school_id: gameSession.school_id,
          quiz_id: gameSession.quiz_id,
          host_id: gameSession.host_id,
          class_id: gameSession.class_id || null,
          title: gameSession.title,
          format: gameSession.format,
          status: gameSession.status,
          settings_json: gameSession.settings_json,
          engine_id: gameSession.engine_id,
          engine_name: gameSession.engine_name,
          started_at: gameSession.started_at,
          finished_at: gameSession.finished_at,
          created_at: gameSession.created_at,
          updated_at: new Date().toISOString(),
          // Store quiz questions as JSON if available
          quiz_data: gameSession.quizzes ? {
            quiz_id: gameSession.quizzes.quiz_id,
            title: gameSession.quizzes.title,
            description: gameSession.quizzes.description,
            questions: gameSession.quizzes.questions
          } : null,
          // Store applied skin information
          skin_data: gameSession.applied_skin || null
        }], {
          onConflict: 'session_id'
        });

      if (error) {
        console.error('❌ Error saving game session:', error);
        return { success: false, error: error.message };
      }

      console.log(`✅ Game session saved successfully: ${gameSession.session_id}`);
      return { success: true, data };

    } catch (error) {
      console.error('❌ Exception saving game session:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Load all game sessions from database for a school
   */
  async loadGameSessionsForSchool(schoolId) {
    try {
      console.log(`📂 Loading game sessions for school: ${schoolId}`);
      
      const { data, error } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('school_id', schoolId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error loading game sessions:', error);
        return { success: false, error: error.message, sessions: [] };
      }

      console.log(`✅ Loaded ${data.length} game sessions for school ${schoolId}`);
      
      // Convert database format back to game session format
      const sessions = data.map(dbSession => this._convertDbToGameSession(dbSession));
      
      return { success: true, sessions };

    } catch (error) {
      console.error('❌ Exception loading game sessions:', error);
      return { success: false, error: error.message, sessions: [] };
    }
  }

  /**
   * Load a specific game session by ID
   */
  async loadGameSession(sessionId) {
    try {
      console.log(`📂 Loading game session: ${sessionId}`);
      
      const { data, error } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log(`📂 Game session not found in database: ${sessionId}`);
          return { success: false, error: 'Session not found', session: null };
        }
        console.error('❌ Error loading game session:', error);
        return { success: false, error: error.message, session: null };
      }

      console.log(`✅ Loaded game session: ${sessionId}`);
      
      const session = this._convertDbToGameSession(data);
      return { success: true, session };

    } catch (error) {
      console.error('❌ Exception loading game session:', error);
      return { success: false, error: error.message, session: null };
    }
  }

  /**
   * Convert database record to game session format
   */
  _convertDbToGameSession(dbSession) {
    const gameSession = {
      session_id: dbSession.session_id,
      school_id: dbSession.school_id,
      quiz_id: dbSession.quiz_id,
      host_id: dbSession.host_id,
      class_id: dbSession.class_id,
      title: dbSession.title,
      format: dbSession.format,
      status: dbSession.status,
      settings_json: dbSession.settings_json || {},
      engine_id: dbSession.engine_id,
      engine_name: dbSession.engine_name,
      started_at: dbSession.started_at,
      finished_at: dbSession.finished_at,
      created_at: dbSession.created_at,
      participants: [] // Will be loaded separately if needed
    };

    // Add quiz data if available
    if (dbSession.quiz_data) {
      gameSession.quizzes = dbSession.quiz_data;
    }

    // Add applied skin if available
    if (dbSession.skin_data) {
      gameSession.applied_skin = dbSession.skin_data;
    }

    return gameSession;
  }

  /**
   * Clean up old completed sessions
   */
  async cleanupOldSessions(daysOld = 7) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      const { error } = await supabase
        .from('game_sessions')
        .delete()
        .eq('status', 'finished')
        .lt('finished_at', cutoffDate.toISOString());

      if (error) {
        console.error('❌ Error cleaning up old sessions:', error);
        return { success: false, error: error.message };
      }

      console.log(`🧹 Cleaned up old game sessions older than ${daysOld} days`);
      return { success: true };

    } catch (error) {
      console.error('❌ Exception cleaning up old sessions:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Initialize persistence service - ensure tables exist
   */
  async initialize() {
    try {
      console.log('🚀 Initializing GameSessionPersistenceService...');
      
      // Test connection by checking if game_sessions table exists
      const { data, error } = await supabase
        .from('game_sessions')
        .select('session_id')
        .limit(1);

      if (error && error.code === '42P01') {
        console.log('⚠️ game_sessions table does not exist - persistence will be disabled');
        return { success: false, error: 'Table does not exist' };
      }

      console.log('✅ GameSessionPersistenceService initialized successfully');
      return { success: true };

    } catch (error) {
      console.error('❌ Error initializing persistence service:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
const gameSessionPersistence = new GameSessionPersistenceService();

module.exports = {
  gameSessionPersistence,
  GameSessionPersistenceService
}; 
