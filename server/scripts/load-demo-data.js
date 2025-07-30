#!/usr/bin/env node

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { loadDemoData } = require('../database/demo-data');
const logger = require('../utils/logger');

async function main() {
  try {
    logger.info('🚀 Starting demo data loading...');
    await loadDemoData();
    logger.info('✅ Demo data loading completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Demo data loading failed:', error);
    process.exit(1);
  }
}

main(); 
