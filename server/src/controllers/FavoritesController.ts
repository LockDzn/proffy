import { Response, Request } from 'express';
import db from '../database/connection';

export default class FavoritesController {
    async index (req: Request, res: Response) {
        const { id } = req.params;

        if(!id){
            return res.status(400).json({
                error: 'Missing user id to search favorites'
            });
        }

        const user = await db('users').where('id', id).first();
        
        return res.json({ favorites: user.favorites });
    }

    async create (req: Request, res: Response) {
        const { id } = req.params;

        if(!id){
            return res.status(400).json({
                error: 'Missing user id to add favorites'
            });
        }

        const user = await db('users')
            .where('id', id)
            .first();

        const favorites = user.favorites + 1;

        await db('users')
            .where('id', id)
            .update({ favorites });
        
        return res.status(201).json();
    }

    async delete (req: Request, res: Response) {
        const { id } = req.params;

        if(!id){
            return res.status(400).json({
                error: 'Missing user id to remove favorites'
            });
        }

        const user = await db('users')
            .where('id', id)
            .first();

        const favorites = user.favorites - 1;

        await db('users')
            .where('id', id)
            .select('*')
            .update({ favorites });
        
        return res.status(201).json();
    }
}