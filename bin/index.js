#!/usr/bin/env node

const programer = require("commander");
const create = require("../lib/init.js");

programer
    .version(require("../package.json").version)
    .usage("<command> [options]")


programer
    .command("init <name>")
    .description("initial a simple project")
    .action((env, options)=>{
        // console.log(env, options);
        create(env);
    })

programer.parse(process.argv);