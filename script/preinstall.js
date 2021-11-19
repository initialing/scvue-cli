if(!/pnpm/.test(process.env.npm_execpath || '')){
    console.warn("please use pnpm to install packages");
    process.exit(1);
}