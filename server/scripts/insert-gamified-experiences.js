const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function insertGamifiedExperiences() {
    try {
        console.log('🎮 Insertando experiencias gamificadas de prueba...');

        // Experiencia 1: Descubriendo la Ruta Numérica (OA1 Matemáticas)
        const experience1 = await prisma.gamified_experiences.create({
            data: {
                oa_id: 'MA01OA01', // OA1 de Matemáticas 1° básico
                experience_type: 'Discovery Learning',
                title: 'Descubriendo la Ruta Numérica',
                description: 'Experiencia gamificada para aprender conteo del 0 al 100 a través de descubrimiento de patrones numéricos',
                settings_json: {
                    numberRange: "0-100",
                    patterns: ["de 1 en 1", "de 2 en 2", "de 5 en 5", "de 10 en 10"],
                    worlds: [
                        {
                            id: "bosque_decenas",
                            name: "Bosque de las Decenas",
                            range: "0-20",
                            pattern: "de 1 en 1"
                        },
                        {
                            id: "rio_cincos", 
                            name: "Río de los Cincos",
                            range: "0-50",
                            pattern: "de 5 en 5"
                        },
                        {
                            id: "montana_cientos",
                            name: "Montaña de los Cientos", 
                            range: "0-100",
                            pattern: "de 10 en 10"
                        }
                    ],
                    tools: [
                        {
                            id: "calculadora_patrones",
                            name: "Calculadora de Patrones",
                            description: "Herramienta para descubrir reglas numéricas",
                            unlocked: false
                        },
                        {
                            id: "microscopio_numerico",
                            name: "Microscopio Numérico",
                            description: "Herramienta para analizar secuencias",
                            unlocked: false
                        }
                    ],
                    rewards: [
                        {
                            id: "gema_numerica",
                            name: "Gema Numérica",
                            description: "Coleccionable por descubrimientos",
                            type: "album_item"
                        },
                        {
                            id: "medalla_descubrimiento",
                            name: "Medalla de Descubrimiento",
                            description: "Reconocimiento por patrones encontrados",
                            type: "achievement"
                        }
                    ]
                },
                active: true
            }
        });

        console.log('✅ Experiencia 1 creada:', experience1.experience_id);

        // Experiencia 2: Aventura de Sumas (OA2 Matemáticas)
        const experience2 = await prisma.gamified_experiences.create({
            data: {
                oa_id: 'MA01OA02', // OA2 de Matemáticas 1° básico
                experience_type: 'Project-Based Learning',
                title: 'Aventura de Sumas',
                description: 'Aprende sumas básicas a través de aventuras interactivas',
                settings_json: {
                    numberRange: "0-20",
                    operations: ["suma"],
                    difficulty: "básico",
                    worlds: [
                        {
                            id: "jardin_sumas",
                            name: "Jardín de las Sumas",
                            range: "0-10",
                            operation: "suma"
                        },
                        {
                            id: "parque_sumas", 
                            name: "Parque de las Sumas",
                            range: "0-20",
                            operation: "suma"
                        }
                    ]
                },
                active: true
            }
        });

        console.log('✅ Experiencia 2 creada:', experience2.experience_id);

        // Experiencia 3: Mundo de Restas (OA3 Matemáticas)
        const experience3 = await prisma.gamified_experiences.create({
            data: {
                oa_id: 'MA01OA03', // OA3 de Matemáticas 1° básico
                experience_type: 'Multi-Device Interactive',
                title: 'Mundo de Restas',
                description: 'Explora el mundo de las restas con interactividad avanzada',
                settings_json: {
                    numberRange: "0-20",
                    operations: ["resta"],
                    difficulty: "básico",
                    worlds: [
                        {
                            id: "bosque_restas",
                            name: "Bosque de las Restas",
                            range: "0-10",
                            operation: "resta"
                        },
                        {
                            id: "montana_restas", 
                            name: "Montaña de las Restas",
                            range: "0-20",
                            operation: "resta"
                        }
                    ]
                },
                active: true
            }
        });

        console.log('✅ Experiencia 3 creada:', experience3.experience_id);

        // Experiencia 4: Explorador de Formas (OA4 Matemáticas)
        const experience4 = await prisma.gamified_experiences.create({
            data: {
                oa_id: 'MA01OA04', // OA4 de Matemáticas 1° básico
                experience_type: 'Adaptive Learning',
                title: 'Explorador de Formas',
                description: 'Descubre formas geométricas básicas de manera adaptativa',
                settings_json: {
                    shapes: ["círculo", "cuadrado", "triángulo", "rectángulo"],
                    difficulty: "básico",
                    worlds: [
                        {
                            id: "galeria_formas",
                            name: "Galería de Formas",
                            shapes: ["círculo", "cuadrado"]
                        },
                        {
                            id: "museo_formas", 
                            name: "Museo de Formas",
                            shapes: ["triángulo", "rectángulo"]
                        }
                    ]
                },
                active: true
            }
        });

        console.log('✅ Experiencia 4 creada:', experience4.experience_id);

        // Experiencia 5: Aventura de Medidas (OA5 Matemáticas)
        const experience5 = await prisma.gamified_experiences.create({
            data: {
                oa_id: 'MA01OA05', // OA5 de Matemáticas 1° básico
                experience_type: 'Inquiry-Based Learning',
                title: 'Aventura de Medidas',
                description: 'Investiga y aprende sobre medidas básicas',
                settings_json: {
                    measures: ["longitud", "peso", "capacidad"],
                    difficulty: "básico",
                    worlds: [
                        {
                            id: "laboratorio_medidas",
                            name: "Laboratorio de Medidas",
                            measures: ["longitud"]
                        },
                        {
                            id: "cocina_medidas", 
                            name: "Cocina de Medidas",
                            measures: ["peso", "capacidad"]
                        }
                    ]
                },
                active: true
            }
        });

        console.log('✅ Experiencia 5 creada:', experience5.experience_id);

        // Experiencia 6: Mundo de Datos (OA6 Matemáticas)
        const experience6 = await prisma.gamified_experiences.create({
            data: {
                oa_id: 'MA01OA06', // OA6 de Matemáticas 1° básico
                experience_type: 'Collaborative Learning',
                title: 'Mundo de Datos',
                description: 'Aprende sobre datos y estadísticas básicas de forma colaborativa',
                settings_json: {
                    dataTypes: ["conteo", "gráficos", "tablas"],
                    difficulty: "básico",
                    worlds: [
                        {
                            id: "ciudad_datos",
                            name: "Ciudad de Datos",
                            dataTypes: ["conteo"]
                        },
                        {
                            id: "parque_graficos", 
                            name: "Parque de Gráficos",
                            dataTypes: ["gráficos", "tablas"]
                        }
                    ]
                },
                active: true
            }
        });

        console.log('✅ Experiencia 6 creada:', experience6.experience_id);

        console.log('\n🎉 ¡Todas las experiencias gamificadas han sido insertadas exitosamente!');
        console.log('\n📊 Resumen:');
        console.log('- 6 experiencias gamificadas creadas');
        console.log('- Todas activas y listas para usar');
        console.log('- Configuradas para OA1-OA6 de Matemáticas 1° básico');

    } catch (error) {
        console.error('❌ Error al insertar experiencias gamificadas:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar el script
insertGamifiedExperiences(); 