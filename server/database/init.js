const fs = require('fs').promises;
const path = require('path');
const { supabaseAdmin } = require('./supabase');
const logger = require('../utils/logger');

async function initializeDatabase() {
  try {
    logger.info('Initializing database schema...');
    
    // Check if we have real Supabase credentials
    const hasRealDatabase = process.env.SUPABASE_URL && 
                           process.env.SUPABASE_URL !== 'https://placeholder.supabase.co';
    
    if (!hasRealDatabase) {
      logger.info('Using mock database mode for development');
      logger.info('Database initialization skipped - using mock authentication');
      return;
    }
    
    // Read the SQL schema file
    const schemaPath = path.join(__dirname, 'init.sql');
    const schemaSQL = await fs.readFile(schemaPath, 'utf8');
    
    if (supabaseAdmin) {
      // Split the SQL into individual statements
      const statements = schemaSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
      
      logger.info(`Executing ${statements.length} SQL statements...`);
      
      // Execute each statement
      for (const statement of statements) {
        try {
          if (statement.trim()) {
            const { error } = await supabaseAdmin.rpc('exec_sql', { 
              sql: statement + ';' 
            });
            
            if (error) {
              logger.warn(`SQL execution warning: ${error.message}`);
            }
          }
        } catch (err) {
          logger.warn(`SQL statement warning: ${err.message}`);
        }
      }
      
      logger.info('Database schema initialization completed');
      
      // Only verify tables if we have real database
      await verifyTables();
    } else {
      logger.warn('Supabase admin client not available. Using mock mode.');
    }
    
  } catch (error) {
    logger.warn('Database initialization failed, continuing with mock mode:', error.message);
  }
}

async function verifyTables() {
  try {
    // Check if we have real Supabase credentials
    const hasRealDatabase = process.env.SUPABASE_URL && 
                           process.env.SUPABASE_URL !== 'https://placeholder.supabase.co';
    
    if (!hasRealDatabase) {
      logger.info('Table verification skipped - using mock database mode');
      return;
    }
    
    const criticalTables = [
      'schools',
      'users', 
      'grade_levels',
      'subjects',
      'classes',
      'quizzes',
      'questions',
      'game_sessions'
    ];
    
    for (const table of criticalTables) {
      const { data, error } = await supabaseAdmin
        .from(table)
        .select('*')
        .limit(1);
        
      if (error) {
        logger.warn(`Table ${table} verification failed: ${error.message}`);
      } else {
        logger.info(`✓ Table ${table} verified`);
      }
    }
    
  } catch (error) {
    logger.warn('Table verification failed:', error.message);
  }
}

// Function to seed demo data
async function seedDemoData() {
  try {
    // Check if we have real Supabase credentials
    const hasRealDatabase = process.env.SUPABASE_URL && 
                           process.env.SUPABASE_URL !== 'https://placeholder.supabase.co';
    
    if (!hasRealDatabase) {
      logger.info('Demo data seeding skipped - using mock authentication mode');
      return;
    }
    
    logger.info('Loading comprehensive demo data with ready-to-play games...');
    
    // Use the comprehensive demo data loader
    const { loadDemoData } = require('./demo-data');
    await loadDemoData();
    
    logger.info('Demo data seeded successfully');
    
  } catch (error) {
    logger.error('Demo data seeding failed:', error);
  }
}

module.exports = {
  initializeDatabase,
  seedDemoData,
  verifyTables
}; 
