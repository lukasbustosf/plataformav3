const express = require('express');
const router = express.Router();
const { createDemoGames } = require('../scripts/create-demo-games');
const { authenticateToken } = require('../middleware/auth');
const { setupLocalDevelopment } = require('../database/local-config');
const { mockGameData } = require('../services/mockGameData');
const logger = require('../utils/logger');

// POST /api/demo/create-games - Create all 24 demo games
router.post('/create-games', authenticateToken, async (req, res) => {
  try {
    logger.info('Creating demo games requested by user:', req.user.user_id);
    
    await createDemoGames();
    
    res.json({
      success: true,
      message: 'All 24 demo games created successfully!',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Error creating demo games:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating demo games',
      error: error.message
    });
  }
});

// POST /api/demo/force-sync - Force sync of demo data
router.post('/force-sync', async (req, res) => {
  try {
    logger.info('🔄 Force sync demo data requested');
    
    // 1. Ejecutar setup local development
    const localData = setupLocalDevelopment();
    
    if (!localData) {
      return res.status(500).json({
        success: false,
        message: 'Failed to setup local development data'
      });
    }
    
    // 2. Forzar sincronización con mockGameData
    mockGameData.syncWithLocalDemoData();
    
    // 3. Verificar que funcionó
    const testSession = mockGameData.getGameSessionById('game-demo-001', '550e8400-e29b-41d4-a716-446655440001');
    
    logger.info('✅ Demo data sync completed');
    
    res.json({
      success: true,
      message: 'Demo data synchronized successfully!',
      details: {
        games_loaded: localData.games.length,
        users_loaded: localData.users.length,
        test_session_found: !!testSession.data,
        mock_sessions_count: mockGameData.gameSessions.length,
        demo_sessions_count: mockGameData.gameSessions.filter(s => s.settings_json?.demo).length
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('❌ Error in force sync:', error);
    res.status(500).json({
      success: false,
      message: 'Error synchronizing demo data',
      error: error.message
    });
  }
});

module.exports = router; 
