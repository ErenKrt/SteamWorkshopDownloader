import { GetPathsRequest, GetItemRequest } from './types'
import { getFolders, getAllDepIDS } from './utils'
import Schemes from './schemes'
import express from 'express'
import path from 'path';
import { wdClient } from './index'
const operator = express.Router();

operator.route('/').get((req, res, next) => {
    res.json({a:5});
})

operator.route('/getSchemes').get((req, res, next)=>{
    res.json({success:true,data:Schemes});
});


operator.route('/getPaths').post((req, res, next)=>{
    try {
        const params : GetPathsRequest= req.body;
        res.json({success:false,data: getFolders(path.resolve(params.path))});
    } catch (error) {
        res.json({success:false,data:null,message: error});
    }
});

operator.route("/getItem").post(async (req, res, next)=>{
    try {
        const params : GetItemRequest= req.body;
        var getItem= await wdClient.getItems([params.itemID]);

        if(getItem.success==false || getItem.data.length<=0){
            res.json(getItem); 
            return;
        }

        var item= getItem.data[0];

        var fetchedItems=[];

        if(item.file_type!=2){
            fetchedItems.push(item);
        }

        var lookIDS= item.children?.map(x=>x.publishedfileid);
        if(lookIDS!=null && lookIDS.length > 0){
            var getDeps= await getAllDepIDS(wdClient,lookIDS);
            fetchedItems= fetchedItems.concat(getDeps.Items);
        }

        res.json({success:true,data:fetchedItems});
    } catch (error) {
        res.json({success:false,data:null,message: error});
    }

});

export default operator