/**
 * Rotas de Healthcheck
 */

const express = require('express');
const router = express.Router();
const healthController = require('../controllers/health.controller');

// Healthcheck básico (para load balancers)
router.get('/', healthController.basic);

// Healthcheck detalhado (para monitoramento)
router.get('/detailed', healthController.detailed);

// Kubernetes/Docker readiness probe
router.get('/ready', healthController.readiness);

// Kubernetes/Docker liveness probe
router.get('/live', healthController.liveness);

module.exports = router;
