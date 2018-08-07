import express from 'express';
import tagCtrl from '../controllers/tag.controller';

const router = express.Router();

router.get('/search', tagCtrl.search);

export default router;
