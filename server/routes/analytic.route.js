import express from 'express';
import analyticCtrl from '../controllers/analytic.controller';

const router = express.Router();

router.post('/', analyticCtrl.search);

export default router;
