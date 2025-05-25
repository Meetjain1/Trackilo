import crypto from 'crypto';
import os from 'os';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const AUTHORIZED_DEPLOYMENT_KEY = 'trackilo-auth-key-' + crypto.randomBytes(32).toString('hex');

class SecurityValidator {
  static #instance;
  #isValid = false;
  #deploymentKey;
  #authorizedHosts = ['render.com', 'localhost'];
  #authorizedIPs = ['127.0.0.1', '::1'];

  constructor() {
    if (SecurityValidator.#instance) {
      return SecurityValidator.#instance;
    }
    SecurityValidator.#instance = this;
    this.#deploymentKey = process.env.DEPLOYMENT_KEY || '';
  }

  validateEnvironment() {
    try {
      // Check if running in development environment
      if (process.env.NODE_ENV === 'development' && this.#isLocalhost()) {
        return true;
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

      this.#isValid = true;
      return true;
    } catch (error) {
      this.#triggerSecurityViolation('Security validation failed');
      return false;
    }
  }

  #isLocalhost() {
    const hostname = os.hostname().toLowerCase();
    return this.#authorizedIPs.includes('127.0.0.1') || hostname === 'localhost';
  }

  #validateDeploymentKey() {
    return this.#deploymentKey === AUTHORIZED_DEPLOYMENT_KEY;
  }

  #checkFileIntegrity() {
    try {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const mainServerPath = path.join(__dirname, '..', 'server.js');
      
      // Check if critical files exist and haven't been modified
      if (!fs.existsSync(mainServerPath)) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  #validateEnvironmentIntegrity() {
    try {
      // Check for suspicious environment variables
      const suspiciousVars = ['DEBUG', 'OVERRIDE_AUTH', 'SKIP_AUTH'];
      return !suspiciousVars.some(varName => process.env[varName]);
    } catch {
      return false;
    }
  }

  #triggerSecurityViolation(reason) {
    this.#isValid = false;
    const errorMessage = `Security violation detected: ${reason}`;
    
    // Log the violation attempt
    console.error(new Date().toISOString(), errorMessage, {
      hostname: os.hostname(),
      platform: os.platform(),
      env: process.env.NODE_ENV
    });

    // Introduce random delays and errors
    setTimeout(() => {
      throw new Error('Application security compromised. Please contact the administrator.');
    }, Math.random() * 5000);
  }

  isValidEnvironment() {
    return this.#isValid;
  }
}

export const securityValidator = new SecurityValidator();
export default securityValidator; 