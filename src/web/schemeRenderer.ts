import path from "path";
import { isRelative, writeParams} from './utils'
import defaultSchemes from './schemes';

export const execute= (basePath, schemes, params)=>{
    let executeAll= (scheme,myscheme)=>{
        if(myscheme.childs && myscheme.childs.length > 0){
            if(scheme.execute(myscheme.params.map((x)=>{
                let rpath= x.value;
                if(!path.isAbsolute(x.value)){
                    rpath= path.join(basePath,rpath);
                }
                if(myscheme.id==0){
                    if(!isRelative(basePath,rpath)){
                        throw 'You can just delete sub folder of main workshop folder';
                    }
                }
                return writeParams(rpath,params);
            }))===true){
                (myscheme.childs).forEach(singleChild => {
                    var bul= defaultSchemes.find(x=>x.id==singleChild.id);
                    if(bul!=null) executeAll(bul,singleChild);
                });
            }
        }else{
            scheme.execute(myscheme.params.map((x)=>{
                let rpath= x.value;
                if(!path.isAbsolute(x.value)){
                    rpath= path.join(basePath,rpath);
                }

                if(myscheme.id==0){
                    if(!isRelative(basePath,rpath)){
                        throw 'You can just delete sub folder of main workshop folder';
                    }
                }
                
                return writeParams(rpath,params);
            }));
        }
    }

    schemes.forEach(SingleScheme => {
        var find= defaultSchemes.find(x=>x.id==SingleScheme.id);
        if(find)
            executeAll(find,SingleScheme);
    });
}