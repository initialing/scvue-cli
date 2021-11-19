const uid = require("uid");
const download = require("download-github-repo");
const path = require("path");
const Khaos = require("khaos");
const condParse = require("parse-condition-string");
const rm = require('rimraf').sync



const create = function(name){
    
    let to = path.resolve(name);
    let template = "initialing/scvue-template#main";
    let tmp = `/tmp/scvue-template-${uid.uid()}`;
    download(template, tmp, function(err){
        if(err) logErr(err);
        generate(tmp, to, function (err) {
            if(err) logErr(err);
            rm(tmp)
            console.log()
            console.log('Generated "%s".', name)
          })
    })
}

let generate = function(src, dest, fn){
    let template = path.join(src, "template");
    let khaos = new Khaos(template);
    let schema = require(path.join(src, "schema.json"));
    let filters = schema.filters;
    khaos.schema(schema.prompt);
    khaos.read(function(err, files){
        if(err) logErr(err);
        khaos.parse(files, function(err, schema){
            if(err) logErr(err);
            khaos.prompt(schema, function(err, answers){
                if(err) logErr(err);
                Object.keys(files).forEach((key)=>{
                    if(filterKey(key,filters,answers)){
                        delete files[key];
                    }
                })
                khaos.write(dest, files, answers, function(err){
                    if(err) logErr(err);
                    fn();
                });
            })
        })
    })
}

let logErr = function(err){
    if(err instanceof Error){
        console.log("\n" + err.message + "\n");
    }
    process.exit(1)
}

let filterKey = function(key, filters, answers){
    for(let k in filters){
        let filter = k.split(/(?<=\/)\*\*(?=\/)|(?<=\/)\*(?=\.)|(?<=\/)\*(?!.)/);
        let rex = filter.reduce((pre,curr)=>{
            if(curr && curr != "/"){
                return pre? pre + curr:curr;
            }
            return pre
        },0)
        let re = new RegExp(rex);
        if(re.test(key)){
            return !condParse(filters[k],answers)
        }
    }
    return false;
}

module.exports = create;