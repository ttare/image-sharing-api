import express from 'express';
import albumCtrl from '../controllers/album.controller';
import validate from '../middlewares/validation.middleware';
import albumValidation from '../validations/album.validation';

const router = express.Router();

router.post('/create', validate(albumValidation.create), albumCtrl.create);
router.get('/list', albumCtrl.list);
router.get('/:id', validate(albumValidation.get), albumCtrl.get);

export default router;
