const fs= require("fs-extra");

const path = require("path");
const glob = require("glob");

let isFile= (name)=>{
    if(name.includes('.')) return true;
    else return false;
}

let schemes= [
    {
        id:0,
        name:"delete",
        execute: (fileName)=>{
            if(fs.existsSync(fileName))
                fs.unlinkSync(fileName);
        }
    },
    {
        id:1,
        name:"create",
        execute: (fileName)=>{
            if(isFile(fileName)){
                if(fs.existsSync(fileName)) fs.unlinkSync(fileName);
                fs.openSync(fileName,'w');
            }else{
                if(fs.pathExistsSync(fileName)) fs.rmdirSync(fileName);
                fs.mkdirsSync(fileName);
            }
        }
    },
    {
        id:2,
        name:"copy",
        execute: (data)=>{
          if(!data.from || !data.to) return;
          if(!fs.existsSync(data.to)) fs.mkdirSync(data.to);

          if(isFile(data.from)){ // Files

            var files= glob.sync(data.from);
            
            if(files.length > 0)
                files.forEach(file => {
                    var fileName= path.basename(file);
                    fs.copyFileSync(file,path.join(data.to,fileName));
                });

            }else{ // Folder
                fs.copySync(data.from,data.to);
            }
            
        }
    },
    {
        id:3,
        name:"has",
        execute:(name)=>{
            if(isFile(name)){
                var files= glob.sync(name);
                return (files.length > 0);
            }else{
                return fs.pathExistsSync(path.join(name));
            }
        }
    }
]

let mySchemes= [
    /*{
        id:0,
        data:"test.txt"
    },
    {
        id:1,
        data:"test"
    },
    {
        id:2,
        data:{
            from:"original/key/*.key",
            to:"copy"
        }
    },
    {
        id:2,
        data:{
            from:"copy",
            to:"seccopy"
        }
    },
    {
        id:3,
        data:"seccopy",
        childs:[
            {
                id:2,
                data:{
                    from:"seccopy/*.key",
                    to:"thirdcopy"
                }
            },
            {
                id:1,
                data:"thirdcopy/a.txt"
            }
        ]
    }*/

    /*{
        id:3,
        data:"original",
        childs:[
            {
                id:3,
                data:"original/akey",
                childs:[
                    {
                        id:2,
                        data:{
                            from:"original/akey/*.key",
                            to:"key"
                        }
                    }
                ]
            },
            {
                id:3,
                data:"original/bkey",
                childs:[
                    {
                        id:2,
                        data:{
                            from:"original/bkey/*.key",
                            to:"key"
                        }
                    }
                ]
            }
        ]
    }*/
    {
        id:2,
        data:{
            from:"original/*/*.key",
            to:"key"
        }
    }
]

let executeAll= (scheme,myscheme)=>{
    if(myscheme.childs && myscheme.childs.length > 0){
        if(scheme.execute(myscheme.data)===true){
            if(myscheme.childs && myscheme.childs.length > 0){
                (myscheme.childs).forEach(singleChild => {
                    var bul= schemes.find(x=>x.id==singleChild.id);
                    if(bul!=null) executeAll(bul,singleChild);
                });
            }
        }
    }else{
        scheme.execute(myscheme.data);
    }
}

mySchemes.forEach(async singleMYSceheme => {
    var bul= schemes.find(x=>x.id==singleMYSceheme.id);
    if(bul!=null) executeAll(bul,singleMYSceheme);
});