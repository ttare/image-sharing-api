import express from 'express';
import userCtrl from '../controllers/user.controller';
import userValidation from '../validations/user.validation';
import validate from "../middlewares/validation.middleware";
import upload from "../middlewares/upload.middleware";

const router = express.Router();

router.post('/create', validate(userValidation.create), userCtrl.create);
router.get('/list', userCtrl.list);
router.get('/me', userCtrl.me);
router.get('/:userId', userCtrl.get);
router.post('/:userId/update', upload('./upload', 'image'), userCtrl.update);

export default router;
