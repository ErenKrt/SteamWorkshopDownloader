import { GetPathsRequest } from './types'
import { getFolders } from './utils'
import Schemes from './schemes'
import express from 'express'
import path from 'path';

const operator = express.Router();

operator.route('/').get((req, res, next) => {
    res.json({a:5});
})

operator.route('/getSchemes').get((req, res, next)=>{
    res.json(Schemes);
});

operator.route('/getPaths').post((req, res, next)=>{
    const params : GetPathsRequest= req.body;
    res.json(getFolders(path.resolve(params.path)));
});

export default operator