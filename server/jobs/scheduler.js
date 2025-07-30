const cron = require('node-cron');
const AutoGradingService = require('../services/autoGrading');
const logger = require('../utils/logger');

/**
 * Job Scheduler for EDU21
 * Implements cron jobs from MODULO II specifications
 * 
 * 🚨 TEMPORARILY DISABLED - Database connection issues
 */

class JobScheduler {
  
  static init() {
    logger.info('🕐 Initializing job scheduler...');
    
    // 🚨 TEMPORARILY DISABLED - All cron jobs disabled for stability
    logger.info('⚠️ All cron jobs temporarily disabled for database stability');
    
    /*
    // Nightly auto-grading job (2:00 AM daily) - DISABLED
    // "Cron Gradebook: nightly job convierte score_raw en nota_10"
    cron.schedule('0 2 * * *', async () => {
      logger.info('🌙 Starting nightly auto-grading job...');
      try {
        const results = await AutoGradingService.processAllPendingGrades();
        logger.info(`✅ Nightly auto-grading completed: ${results.processed} processed, ${results.errors} errors`);
      } catch (error) {
        logger.error('❌ Nightly auto-grading failed:', error);
      }
    }, {
      scheduled: true,
      timezone: "America/Santiago" // Chilean timezone
    });

    // Overdue evaluations check (every hour during school hours) - DISABLED
    cron.schedule('0 8-18 * * 1-5', async () => {
      logger.info('⏰ Checking for overdue evaluations...');
      try {
        await AutoGradingService.processOverdueEvaluations();
        logger.info('✅ Overdue evaluations processed');
      } catch (error) {
        logger.error('❌ Overdue evaluations check failed:', error);
      }
    }, {
      scheduled: true,
      timezone: "America/Santiago"
    });

    // Weekly grade statistics update (Sundays at 6:00 AM) - DISABLED
    cron.schedule('0 6 * * 0', async () => {
      logger.info('📊 Generating weekly statistics...');
      try {
        await this.generateWeeklyStats();
        logger.info('✅ Weekly statistics generated');
      } catch (error) {
        logger.error('❌ Weekly statistics generation failed:', error);
      }
    }, {
      scheduled: true,
      timezone: "America/Santiago"
    });

    // Database cleanup (monthly on 1st at 3:00 AM) - DISABLED
    cron.schedule('0 3 1 * *', async () => {
      logger.info('🧹 Running monthly database cleanup...');
      try {
        await this.cleanupOldData();
        logger.info('✅ Database cleanup completed');
      } catch (error) {
        logger.error('❌ Database cleanup failed:', error);
      }
    }, {
      scheduled: true,
      timezone: "America/Santiago"
    });
    */

    logger.info('✅ Job scheduler initialized - All jobs disabled for stability');
  }

  /**
   * Generate weekly statistics for all schools
   */
  static async generateWeeklyStats() {
    const { supabase } = require('../database/supabase');
    
    try {
      // Get all active schools
      const { data: schools, error } = await supabase
        .from('schools')
        .select('school_id, school_name')
        .eq('active', true);

      if (error) throw error;

      for (const school of schools) {
        await this.generateSchoolWeeklyStats(school.school_id);
      }

    } catch (error) {
      logger.error('Error generating weekly stats:', error);
      throw error;
    }
  }

  /**
   * Generate weekly statistics for a specific school
   */
  static async generateSchoolWeeklyStats(schoolId) {
    const { supabase } = require('../database/supabase');

    try {
      // Get evaluations from the past week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const { data: evaluations, error } = await supabase
        .from('evaluations')
        .select('eval_id, title, type, class_id')
        .eq('school_id', schoolId)
        .gte('created_at', oneWeekAgo.toISOString());

      if (error) throw error;

      // Generate stats for each evaluation
      for (const evaluation of evaluations) {
        const stats = await AutoGradingService.generateEvaluationStats(evaluation.eval_id);
        
        // Store stats (you could save to a stats table here)
        logger.info(`📈 ${evaluation.title}: avg ${stats.average_grade?.toFixed(1)}, pass rate ${stats.pass_rate?.toFixed(1)}%`);
      }

    } catch (error) {
      logger.error(`Error generating stats for school ${schoolId}:`, error);
    }
  }

  /**
   * Clean up old data to maintain performance
   */
  static async cleanupOldData() {
    const { supabase } = require('../database/supabase');

    try {
      // Clean up old game sessions (older than 6 months)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const { error: gameCleanupError } = await supabase
        .from('game_sessions')
        .delete()
        .eq('status', 'finished')
        .lt('created_at', sixMonthsAgo.toISOString());

      if (gameCleanupError) throw gameCleanupError;

      // Clean up old evaluation attempts (keep for 2 years for audit)
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

      const { error: attemptCleanupError } = await supabase
        .from('evaluation_attempts')
        .delete()
        .in('status', ['submitted', 'graded'])
        .lt('created_at', twoYearsAgo.toISOString());

      if (attemptCleanupError) throw attemptCleanupError;

      logger.info('🗑️ Database cleanup completed');

    } catch (error) {
      logger.error('Error during database cleanup:', error);
      throw error;
    }
  }

  /**
   * Manual trigger for auto-grading (for testing/admin use)
   */
  static async runManualAutoGrading() {
    logger.info('🔧 Running manual auto-grading...');
    try {
      const results = await AutoGradingService.processAllPendingGrades();
      logger.info(`✅ Manual auto-grading completed: ${results.processed} processed, ${results.errors} errors`);
      return results;
    } catch (error) {
      logger.error('❌ Manual auto-grading failed:', error);
      throw error;
    }
  }

  /**
   * Get scheduler status
   */
  static getStatus() {
    return {
      active: true,
      jobs: [
        {
          name: 'Nightly Auto-Grading',
          schedule: '0 2 * * *',
          timezone: 'America/Santiago',
          description: 'Convert raw scores to Chilean grades (1-7)'
        },
        {
          name: 'Overdue Evaluations Check',
          schedule: '0 8-18 * * 1-5',
          timezone: 'America/Santiago',
          description: 'Mark overdue evaluations and create zero grades'
        },
        {
          name: 'Weekly Statistics',
          schedule: '0 6 * * 0',
          timezone: 'America/Santiago',
          description: 'Generate evaluation statistics and reports'
        },
        {
          name: 'Monthly Cleanup',
          schedule: '0 3 1 * *',
          timezone: 'America/Santiago',
          description: 'Clean up old data to maintain performance'
        }
      ]
    };
  }
}

module.exports = JobScheduler; 
