import express from 'express';
import ClassesControllers from './controllers/ClassesControllers';
import ConnectionsController from './controllers/ConnectionsController';
import FavoritesController from './controllers/FavoritesController';

const routes = express.Router();

const classesController = new ClassesControllers();
const connectionsController = new ConnectionsController();
const favoritesController = new FavoritesController();

routes.post('/classes', classesController.crate);
routes.get('/classes', classesController.index);

routes.get('/connections', connectionsController.index);
routes.post('/connections', connectionsController.create);

routes.get('/favorites/:id', favoritesController.index);
routes.post('/favorites/:id', favoritesController.create);
routes.delete('/favorites/:id', favoritesController.delete);

export default routes;