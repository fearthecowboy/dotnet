const fs =require('fs');
const cp =require('child_process');
for( let e of fs.readFileSync(`${__dirname}/go.shjs`,'utf8').split('\n') ) { 
  if( e && e.length > 1 ) {
    try {
      if( e.indexOf("${") > -1 ) {
        e = eval(`\`${e}\``);
        console.log(e);
      }
      if( e.startsWith("#") ) {
        continue;
      }
      cp.execSync(`${__dirname}/../node_modules/.bin/shx ${e}`,{stdio :"inherit"} );
    } catch( xx ) {
      console.log(xx);
      process.exit(-1);
    }
  }
}