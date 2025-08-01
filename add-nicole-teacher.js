const { supabase } = require('./server/database/supabase');
const bcrypt = require('bcryptjs');
const logger = require('./server/utils/logger');

// Datos de la nueva usuaria profesora
const userData = {
  email: 'Nicolefranchescaolivares@gmail.com',
  password: 'Sara190110#',
  first_name: 'Nicole',
  last_name: 'olivares morales',
  role: 'TEACHER',
  phone: '‪+56934310191‬',
  rut: '17.905.001-3'
};

async function addNicoleTeacher() {
  try {
    logger.info('🚀 Iniciando proceso de agregar usuaria profesora Nicole...');

    // 1. Buscar el colegio existente donde está lbustos@edu21.cl
    logger.info('🔍 Buscando colegio existente donde está lbustos@edu21.cl...');
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select(`
        user_id,
        school_id,
        email,
        schools (
          school_id,
          school_name,
          school_code,
          active
        )
      `)
      .eq('email', 'lbustos@edu21.cl')
      .single();

    if (userError || !existingUser) {
      logger.error('❌ Error: No se encontró el usuario lbustos@edu21.cl');
      console.log('❌ Error:', userError?.message || 'Usuario lbustos@edu21.cl no encontrado');
      console.log('💡 Esto significa que el colegio edu21 aún no existe en la base de datos');
      return;
    }

    const existingSchool = existingUser.schools;
    logger.info(`✅ Colegio encontrado: ${existingSchool.school_name} (${existingSchool.school_code})`);

    // 2. Verificar si el email de Nicole ya existe
    logger.info('📧 Verificando si el email de Nicole ya está registrado...');
    const { data: existingNicole, error: nicoleError } = await supabase
      .from('users')
      .select('user_id, email')
      .eq('email', userData.email)
      .single();

    if (existingNicole) {
      logger.error('❌ Error: El email de Nicole ya está registrado');
      console.log('❌ Error: El email ya está registrado en el sistema');
      return;
    }

    logger.info('✅ Email de Nicole disponible para registro');

    // 3. Hashear la contraseña
    logger.info('🔐 Hasheando contraseña...');
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(userData.password, saltRounds);

    // 4. Crear el usuario Nicole en el mismo colegio
    logger.info('👤 Creando nuevo usuario Nicole...');
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        school_id: existingSchool.school_id,
        email: userData.email,
        password_hash: password_hash,
        first_name: userData.first_name,
        last_name: userData.last_name,
        role: userData.role,
        phone: userData.phone,
        rut: userData.rut,
        active: true
      })
      .select(`
        user_id,
        school_id,
        email,
        first_name,
        last_name,
        role,
        phone,
        rut,
        active,
        created_at
      `)
      .single();

    if (createError) {
      logger.error('❌ Error creando usuario:', createError);
      console.log('❌ Error creando usuario:', createError.message);
      return;
    }

    logger.info('✅ Usuario Nicole creado exitosamente');
    console.log('\n🎉 ¡Usuario Nicole creado exitosamente!');
    console.log('📋 Detalles del usuario:');
    console.log(`   👤 Nombre: ${newUser.first_name} ${newUser.last_name}`);
    console.log(`   📧 Email: ${newUser.email}`);
    console.log(`   🏫 Colegio: ${existingSchool.school_name} (${existingSchool.school_code})`);
    console.log(`   👨‍🏫 Rol: ${newUser.role}`);
    console.log(`   📱 Teléfono: ${newUser.phone}`);
    console.log(`   🆔 RUT: ${newUser.rut}`);
    console.log(`   🆔 User ID: ${newUser.user_id}`);
    console.log(`   📅 Creado: ${newUser.created_at}`);

    // 5. Verificar que el usuario se puede autenticar
    logger.info('🔍 Verificando autenticación...');
    const { data: verifyUser, error: verifyError } = await supabase
      .from('users')
      .select(`
        user_id,
        email,
        first_name,
        last_name,
        role,
        active,
        schools (
          school_id,
          school_name,
          school_code
        )
      `)
      .eq('email', userData.email)
      .eq('active', true)
      .single();

    if (verifyError || !verifyUser) {
      logger.error('❌ Error verificando usuario:', verifyError);
      console.log('❌ Error verificando usuario:', verifyError?.message);
      return;
    }

    logger.info('✅ Usuario Nicole verificado correctamente');
    console.log('\n✅ Verificación exitosa:');
    console.log(`   🏫 Asignado al colegio: ${verifyUser.schools.school_name}`);
    console.log(`   ✅ Estado: ${verifyUser.active ? 'Activo' : 'Inactivo'}`);

    console.log('\n🎯 Usuario profesora Nicole agregada exitosamente al colegio edu21!');
    console.log('📝 Puede iniciar sesión con su email y contraseña.');
    console.log(`📧 Email: ${userData.email}`);
    console.log(`🔑 Contraseña: ${userData.password}`);

  } catch (error) {
    logger.error('❌ Error general:', error);
    console.log('❌ Error general:', error.message);
  }
}

// Ejecutar el script
if (require.main === module) {
  addNicoleTeacher()
    .then(() => {
      console.log('\n✅ Proceso completado');
      process.exit(0);
    })
    .catch((error) => {
      console.log('❌ Error en el proceso:', error.message);
      process.exit(1);
    });
}

module.exports = { addNicoleTeacher }; 