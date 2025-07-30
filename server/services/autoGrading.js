const { supabase } = require('../database/supabase');
const logger = require('../utils/logger');

/**
 * AutoGrading Service for EDU21
 * Handles automatic grading and evaluation processing
 * 
 * 🚨 TEMPORARILY DISABLED - Database connection issues
 */

class AutoGradingService {
  
  /**
   * Main function to process all pending evaluations
   * 🚨 TEMPORARILY DISABLED
   */
  static async processAllPendingGrades() {
    logger.info('🤖 Starting auto-grading process...');
    
    // 🚨 TEMPORARILY DISABLED - Database connection issues
    logger.info('⚠️ Auto-grading temporarily disabled for database stability');
    return {
      processed: 0,
      errors: 0,
      message: 'Auto-grading disabled for stability'
    };
    
    /*
    try {
      // Get all pending evaluation attempts
      const { data: attempts, error } = await supabase
        .from('evaluation_attempts')
        .select(`
          *,
          evaluations!inner(
            evaluation_id,
            title,
            type,
            total_points
          )
        `)
        .eq('status', 'completed')
        .is('score_10', null);

      if (error) {
        logger.error('Error fetching pending attempts:', error);
        throw error;
      }

      let processed = 0;
      let errors = 0;

      for (const attempt of attempts) {
        try {
          await this.processSingleAttempt(attempt);
          processed++;
        } catch (error) {
          logger.error(`Error processing attempt ${attempt.attempt_id}:`, error);
          errors++;
        }
      }

      logger.info(`✅ Auto-grading completed: ${processed} processed, ${errors} errors`);
      return { processed, errors };

    } catch (error) {
      logger.error('❌ Auto-grading process failed:', error);
      throw error;
    }
    */
  }

  /**
   * Process a single evaluation attempt into gradebook entry
   */
  static async processAttemptToGradebook(attempt) {
    const evaluation = attempt.evaluations;
    
    // Calculate Chilean grade (1-7) from raw score
    const percentage = (attempt.score_raw / evaluation.total_points) * 100;
    const nota10 = this.calculateChileanGrade(percentage, evaluation.grading_scale);

    // Check if gradebook entry already exists
    const { data: existingEntry } = await supabase
      .from('gradebook_entries')
      .select('entry_id')
      .eq('student_id', attempt.student_id)
      .eq('eval_id', attempt.eval_id)
      .single();

    if (existingEntry) {
      // Update existing entry
      const { error: updateError } = await supabase
        .from('gradebook_entries')
        .update({
          nota_10: nota10,
          score_raw: attempt.score_raw,
          percentage: percentage,
          recorded_at: new Date().toISOString(),
          notes: 'Auto-graded'
        })
        .eq('entry_id', existingEntry.entry_id);

      if (updateError) throw updateError;

    } else {
      // Create new gradebook entry
      const { error: insertError } = await supabase
        .from('gradebook_entries')
        .insert({
          school_id: evaluation.school_id,
          class_id: evaluation.class_id,
          student_id: attempt.student_id,
          eval_id: attempt.eval_id,
          nota_10: nota10,
          score_raw: attempt.score_raw,
          percentage: percentage,
          recorded_by: null, // Auto-graded
          notes: 'Auto-graded'
        });

      if (insertError) throw insertError;
    }

    // Mark attempt as processed
    const { error: markError } = await supabase
      .from('evaluation_attempts')
      .update({
        processed_to_gradebook: true
      })
      .eq('attempt_id', attempt.attempt_id);

    if (markError) throw markError;

    logger.info(`✅ Processed attempt ${attempt.attempt_id}: ${attempt.score_raw}/${evaluation.total_points} = ${nota10}`);
  }

  /**
   * Calculate Chilean grade (1-7) from percentage using grading scale
   * This is the core algorithm specified in MODULO II
   */
  static calculateChileanGrade(percentage, gradingScale) {
    // Default Chilean grading scale if not provided
    const scale = gradingScale || {
      "1": 0, "2": 20, "3": 40, "4": 55, 
      "5": 70, "6": 85, "7": 100
    };

    // Find the appropriate grade based on percentage
    for (let grade = 7; grade >= 1; grade--) {
      const threshold = scale[grade.toString()];
      if (percentage >= threshold) {
        // Linear interpolation for more precise grading
        if (grade < 7) {
          const nextGrade = grade + 1;
          const nextThreshold = scale[nextGrade.toString()];
          const ratio = (percentage - threshold) / (nextThreshold - threshold);
          return Math.round((grade + ratio) * 10) / 10; // Round to 1 decimal
        }
        return parseFloat(grade.toFixed(1));
      }
    }
    
    return 1.0; // Minimum grade
  }

  /**
   * Process overdue evaluations
   * 🚨 TEMPORARILY DISABLED
   */
  static async processOverdueEvaluations() {
    logger.info('⏰ Processing overdue evaluations...');
    
    // 🚨 TEMPORARILY DISABLED - Database connection issues
    logger.info('⚠️ Overdue evaluations processing temporarily disabled');
    return;
    
    /*
    try {
      // Get evaluations that are past due date
      const { data: overdueEvaluations, error } = await supabase
        .from('evaluations')
        .select('*')
        .lt('due_date', new Date().toISOString())
        .eq('status', 'active');

      if (error) throw error;

      for (const evaluation of overdueEvaluations) {
        await this.closeOverdueEvaluation(evaluation.evaluation_id);
      }

      logger.info(`✅ Processed ${overdueEvaluations.length} overdue evaluations`);
    } catch (error) {
      logger.error('❌ Error processing overdue evaluations:', error);
      throw error;
    }
    */
  }

  /**
   * Process a single overdue evaluation
   */
  static async processOverdueEvaluation(evaluation) {
    // Get enrolled students for the class
    const { data: students, error: studentsError } = await supabase
      .from('enrollments')
      .select('student_id')
      .eq('class_id', evaluation.class_id)
      .eq('active', true);

    if (studentsError) throw studentsError;

    for (const student of students) {
      // Check if student has any attempt
      const { data: attempts } = await supabase
        .from('evaluation_attempts')
        .select('attempt_id, status')
        .eq('eval_id', evaluation.eval_id)
        .eq('student_id', student.student_id);

      if (!attempts || attempts.length === 0) {
        // Student never started - create 0 grade
        await this.createZeroGrade(student.student_id, evaluation);
      } else {
        // Check for in-progress attempts and mark as overdue
        const inProgressAttempts = attempts.filter(a => a.status === 'in_progress');
        for (const attempt of inProgressAttempts) {
          await supabase
            .from('evaluation_attempts')
            .update({
              status: 'overdue',
              finished_at: new Date().toISOString()
            })
            .eq('attempt_id', attempt.attempt_id);

          // Create zero grade for overdue attempt
          await this.createZeroGrade(student.student_id, evaluation);
        }
      }
    }
  }

  /**
   * Create a zero grade for student who didn't submit
   */
  static async createZeroGrade(studentId, evaluation) {
    // Check if grade already exists
    const { data: existingGrade } = await supabase
      .from('gradebook_entries')
      .select('entry_id')
      .eq('student_id', studentId)
      .eq('eval_id', evaluation.eval_id)
      .single();

    if (existingGrade) return; // Grade already exists

    // Create zero grade
    const { error } = await supabase
      .from('gradebook_entries')
      .insert({
        school_id: evaluation.school_id,
        class_id: evaluation.class_id,
        student_id: studentId,
        eval_id: evaluation.eval_id,
        nota_10: 1.0, // Minimum grade
        score_raw: 0,
        percentage: 0,
        recorded_by: null, // Auto-graded
        notes: 'No submission - auto-graded to minimum'
      });

    if (error) throw error;
  }

  /**
   * Generate evaluation statistics and reports
   */
  static async generateEvaluationStats(evalId) {
    try {
      const { data: grades, error } = await supabase
        .from('gradebook_entries')
        .select('nota_10, percentage')
        .eq('eval_id', evalId);

      if (error) throw error;

      if (grades.length === 0) {
        return {
          total_students: 0,
          average_grade: 0,
          distribution: {}
        };
      }

      const stats = {
        total_students: grades.length,
        average_grade: grades.reduce((sum, g) => sum + g.nota_10, 0) / grades.length,
        average_percentage: grades.reduce((sum, g) => sum + g.percentage, 0) / grades.length,
        distribution: this.calculateGradeDistribution(grades),
        pass_rate: grades.filter(g => g.nota_10 >= 4.0).length / grades.length * 100
      };

      return stats;

    } catch (error) {
      logger.error('Error generating evaluation stats:', error);
      throw error;
    }
  }

  /**
   * Calculate grade distribution
   */
  static calculateGradeDistribution(grades) {
    const distribution = {
      "1": 0, "2": 0, "3": 0, "4": 0, 
      "5": 0, "6": 0, "7": 0
    };

    grades.forEach(grade => {
      const roundedGrade = Math.floor(grade.nota_10).toString();
      if (distribution[roundedGrade] !== undefined) {
        distribution[roundedGrade]++;
      }
    });

    return distribution;
  }

  /**
   * Remedial recommendations based on low performance
   */
  static async generateRemedialRecommendations(classId, minGrade = 4.0) {
    try {
      const { data: lowPerformers, error } = await supabase
        .from('gradebook_entries')
        .select(`
          student_id,
          nota_10,
          evaluations!inner(
            title,
            type,
            eval_id
          ),
          users!gradebook_entries_student_id_fkey(
            first_name,
            last_name,
            email
          )
        `)
        .eq('evaluations.class_id', classId)
        .lt('nota_10', minGrade);

      if (error) throw error;

      // Group by student
      const studentRemedials = {};
      lowPerformers.forEach(entry => {
        const studentId = entry.student_id;
        if (!studentRemedials[studentId]) {
          studentRemedials[studentId] = {
            student: entry.users,
            failedEvaluations: []
          };
        }
        studentRemedials[studentId].failedEvaluations.push({
          evaluation: entry.evaluations,
          grade: entry.nota_10
        });
      });

      return Object.values(studentRemedials);

    } catch (error) {
      logger.error('Error generating remedial recommendations:', error);
      throw error;
    }
  }
}

module.exports = AutoGradingService; 
