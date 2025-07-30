const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // Load .env from current directory (server)

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for inserts

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedSampleQuestions() {
  console.log('🚀 Iniciando la inserción de preguntas de ejemplo en question_bank...');

  const authorId = '66e3e020-9768-49b2-8754-7ca9e06dc93e'; // superadmin@edu21.cl
  const oaId = 'MA01-OA01'; // Asumiendo que este OA existe y es de 1° Básico, Matemática

  const sampleQuestions = [
    {
      question_text: '¿Cuántos pollitos hay en la imagen?',
      question_type: 'multiple_choice',
      options_json: ['2', '3', '4', '5'],
      correct_answer: '5',
      explanation_text: 'Contaste correctamente los 5 pollitos.',
      oa_id: oaId,
      skill_tags: ['conteo', 'numeros'],
      bloom_level: 'Aplicar',
      difficulty_score: 3, // Medium
      is_validated: false,
      is_ai_generated: false, // Estas son manuales de ejemplo
      author_id: authorId
    },
    {
      question_text: 'Identifica el número de ovejas en el rebaño.',
      question_type: 'multiple_choice',
      options_json: ['6', '7', '8', '9'],
      correct_answer: '8',
      explanation_text: 'Hay 8 ovejas en el rebaño.',
      oa_id: oaId,
      skill_tags: ['identificacion', 'conteo'],
      bloom_level: 'Comprender',
      difficulty_score: 2, // Easy
      is_validated: false,
      is_ai_generated: false,
      author_id: authorId
    },
    {
      question_text: '¿Cuántas vacas ves en el campo?',
      question_type: 'multiple_choice',
      options_json: ['1', '2', '3', '4'],
      correct_answer: '3',
      explanation_text: 'Había 3 vacas en el campo.',
      oa_id: oaId,
      skill_tags: ['reconocimiento', 'conteo'],
      bloom_level: 'Recordar',
      difficulty_score: 1, // Very Easy
      is_validated: false,
      is_ai_generated: false,
      author_id: authorId
    }
  ];

  try {
    const { data, error } = await supabase
      .from('question_bank')
      .insert(sampleQuestions)
      .select();

    if (error) {
      console.error('❌ Error al insertar preguntas de ejemplo:', error.message);
      if (error.details) console.error('Detalles:', error.details);
      if (error.hint) console.error('Sugerencia:', error.hint);
    } else {
      console.log(`✅ Se insertaron ${data.length} preguntas de ejemplo exitosamente.`);
      console.log('Puedes verificarlas en tu dashboard de Supabase, tabla "question_bank".');
    }
  } catch (err) {
    console.error('💥 Error inesperado durante la inserción:', err.message);
  }
}

seedSampleQuestions();
