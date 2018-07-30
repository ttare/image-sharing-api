import express from 'express';
import imageCtrl from '../controllers/image.controller';
import validate from '../middlewares/validation.middleware';
import upload from '../middlewares/upload.middleware';
import imageValidation from '../validations/image.validation';

const router = express.Router();

router.get('/search', validate(imageValidation.search), imageCtrl.search);
router.post('/create', upload('image'), validate(imageValidation.create, {allowUnknown: true}), imageCtrl.create);


export default router;
