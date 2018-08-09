import express from 'express';
import imageCtrl from '../controllers/image.controller';
import validate from '../middlewares/validation.middleware';
import upload from '../middlewares/upload.middleware';
import imageValidation from '../validations/image.validation';

const router = express.Router();

router.get('/search/:page/:limit', validate(imageValidation.search), imageCtrl.search);
router.post('/create', upload('./upload', 'image'), validate(imageValidation.create, {allowUnknown: true}), imageCtrl.create);
router.get('/:id', imageCtrl.details);
router.post('/:id/like', imageCtrl.like);
router.post('/:id/comment', imageCtrl.comment);


export default router;
