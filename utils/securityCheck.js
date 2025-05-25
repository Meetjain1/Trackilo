/**
 * ⚠️ PROTECTED CODE - DO NOT COPY ⚠️
 * 
 * @author: Meet Jain
 * @github: https://github.com/Meetjain1
 * @project: Trackilo - Job Application Tracking System
 * @copyright: Copyright (c) 2024 Meet Jain. All rights reserved.
 */

import crypto from 'crypto';
import os from 'os';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

/* ⚠️ Protected code by Meet Jain - Unauthorized use prohibited ⚠️ */
const AUTHORIZED_DEPLOYMENT_KEY = 'trackilo-auth-key-' + crypto.randomBytes(32).toString('hex');
const SECURITY_SALT = crypto.randomBytes(32).toString('hex');

class SecurityValidator {
  static #instance;
  #isValid = false;
  #deploymentKey;
  #authorizedHosts = ['render.com', 'localhost', 'onrender.com'];
  #authorizedIPs = ['127.0.0.1', '::1'];
  #lastCheckTime = Date.now();
  #checksPerMinute = 0;
  #maxChecksPerMinute = 100;
  #securityHash = '';

  constructor() {
    if (SecurityValidator.#instance) {
      return SecurityValidator.#instance;
    }
    SecurityValidator.#instance = this;
    this.#deploymentKey = process.env.DEPLOYMENT_KEY || '';
    this.#initializeSecurityHash();
    this.#startSecurityMonitoring();
  }

  /* ⚠️ Protected code by Meet Jain - Unauthorized use prohibited ⚠️ */
  #initializeSecurityHash() {
    const systemInfo = this.#getSystemInfo();
    this.#securityHash = this.#generateHash(systemInfo + SECURITY_SALT);
  }

  #getSystemInfo() {
    return JSON.stringify({
      platform: os.platform(),
      release: os.release(),
      arch: os.arch(),
      cpus: os.cpus().length,
      hostname: os.hostname(),
      userInfo: os.userInfo().username,
    });
  }

  #generateHash(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  #startSecurityMonitoring() {
    setInterval(() => {
      this.#checksPerMinute = 0;
      this.#validateSystemIntegrity();
    }, 60000);
  }

  /* ⚠️ Protected code by Meet Jain - Unauthorized use prohibited ⚠️ */
  #validateSystemIntegrity() {
    const currentHash = this.#generateHash(this.#getSystemInfo() + SECURITY_SALT);
    if (currentHash !== this.#securityHash) {
      this.#triggerSecurityViolation('System integrity compromised');
    }
  }

  validateEnvironment() {
    try {
      this.#checksPerMinute++;
      if (this.#checksPerMinute > this.#maxChecksPerMinute) {
        this.#triggerSecurityViolation('Too many security checks');
        return false;
      }

      // Time-based validation
      const currentTime = Date.now();
      if (currentTime - this.#lastCheckTime > 300000) { // 5 minutes
        this.#triggerSecurityViolation('Security check timeout');
        return false;
      }
      this.#lastCheckTime = currentTime;

      // Allow Render.com deployment
      if (this.#isRenderEnvironment()) {
        this.#isValid = true;
        return true;
      }

      // Allow development environment
      if (process.env.NODE_ENV === 'development' && this.#isLocalhost()) {
        this.#isValid = true;
        return true;
      }

      // Check for suspicious environment
      if (this.#isUnauthorizedEnvironment()) {
        this.#triggerSecurityViolation('Unauthorized environment detected');
        return false;
      }

      // Deployment validation
      if (!this.#validateDeploymentKey()) {
        this.#triggerSecurityViolation('Invalid deployment environment');
        return false;
      }

      // File integrity check
      if (!this.#checkFileIntegrity()) {
        this.#triggerSecurityViolation('File integrity compromised');
        return false;
      }

      // Environment check
      if (!this.#validateEnvironmentIntegrity()) {
        this.#triggerSecurityViolation('Environment integrity check failed');
        return false;
      }

      // System integrity check
      if (!this.#validateSystemResources()) {
        this.#triggerSecurityViolation('System resource validation failed');
        return false;
      }

      this.#isValid = true;
      return true;
    } catch (error) {
      this.#triggerSecurityViolation('Security validation failed');
      return false;
    }
  }

  /* ⚠️ Protected code by Meet Jain - Unauthorized use prohibited ⚠️ */
  #validateSystemResources() {
    try {
      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();
      const memoryUsage = process.memoryUsage();
      
      // Check for suspicious memory patterns
      if (freeMemory / totalMemory > 0.9 || memoryUsage.heapUsed / memoryUsage.heapTotal < 0.1) {
        return false;
      }

      // Check for virtual machine indicators
      const cpuInfo = os.cpus();
      if (cpuInfo.length < 2 || cpuInfo[0].model.toLowerCase().includes('virtual')) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  #isRenderEnvironment() {
    const hostname = os.hostname().toLowerCase();
    return (
      hostname.includes('render') ||
      process.env.RENDER === 'true' ||
      process.env.RENDER_EXTERNAL_URL?.includes('onrender.com')
    );
  }

  #isLocalhost() {
    const hostname = os.hostname().toLowerCase();
    return this.#authorizedIPs.includes('127.0.0.1') || 
           hostname === 'localhost' ||
           hostname.includes('local');
  }

  #isUnauthorizedEnvironment() {
    try {
      // Check for suspicious environment variables
      const suspiciousVars = ['DEBUG', 'OVERRIDE_AUTH', 'SKIP_AUTH'];
      if (suspiciousVars.some(varName => process.env[varName])) {
        return true;
      }

      // Check for debugger
      if (process.execArgv.some(arg => 
        arg.includes('--inspect') || 
        arg.includes('--debug')
      )) {
        return true;
      }

      return false;
    } catch {
      return true;
    }
  }

  #validateDeploymentKey() {
    return this.#deploymentKey === AUTHORIZED_DEPLOYMENT_KEY;
  }

  /* ⚠️ Protected code by Meet Jain - Unauthorized use prohibited ⚠️ */
  #checkFileIntegrity() {
    try {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const criticalFiles = [
        'server.js',
        'package.json',
        'utils/securityCheck.js',
        'middleware/auth.js'
      ];

      for (const file of criticalFiles) {
        const filePath = path.join(__dirname, '..', file);
        if (!fs.existsSync(filePath)) {
          return false;
        }

        // Check file permissions
        const stats = fs.statSync(filePath);
        if (stats.mode.toString(8) !== '100644') {
          return false;
        }
      }

      return true;
    } catch {
      return false;
    }
  }

  #validateEnvironmentIntegrity() {
    try {
      const suspiciousVars = [
        'DEBUG', 'OVERRIDE_AUTH', 'SKIP_AUTH', 'NODE_OPTIONS',
        'NODE_DEBUG', 'NODE_DEBUG_NATIVE', 'NODE_INSPECT'
      ];
      
      // Check for suspicious environment variables
      if (suspiciousVars.some(varName => process.env[varName])) {
        return false;
      }

      // Check for debugger
      if (process.execArgv.some(arg => arg.includes('--inspect') || arg.includes('--debug'))) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  /* ⚠️ Protected code by Meet Jain - Unauthorized use prohibited ⚠️ */
  #triggerSecurityViolation(reason) {
    this.#isValid = false;
    const errorMessage = `Security violation detected: ${reason}`;
    
    // Log the violation attempt
    console.error(new Date().toISOString(), errorMessage, {
      hostname: os.hostname(),
      platform: os.platform(),
      env: process.env.NODE_ENV,
      memory: process.memoryUsage(),
      uptime: process.uptime()
    });

    // For unauthorized environments, introduce random errors
    if (!this.#isRenderEnvironment() && !this.#isLocalhost()) {
      setTimeout(() => {
        const errors = [
          'Critical system error',
          'Security violation detected',
          'Invalid system configuration',
          'Access denied',
          'System integrity compromised'
        ];
        throw new Error(errors[Math.floor(Math.random() * errors.length)]);
      }, Math.random() * 5000);
    }
  }

  isValidEnvironment() {
    return this.#isValid;
  }
}

/* ⚠️ Protected code by Meet Jain - Unauthorized use prohibited ⚠️ */
export const securityValidator = new SecurityValidator();
export default securityValidator;

/**
 * ⚠️ END OF PROTECTED CODE ⚠️
 * Copyright (c) 2024 Meet Jain
 * All rights reserved.
 */ 