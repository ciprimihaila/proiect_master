function authorize(a,b,c,d){var e=a.installed.client_secret,f=a.installed.client_id,g=a.installed.redirect_uris[0],h=new googleAuth,i=new h.OAuth2(f,e,g);fs.readFile(TOKEN_PATH,function(a,e){a?getNewToken(i,b):(i.credentials=JSON.parse(e),b(i,c,d))})}function getNewToken(a,b){var c=a.generateAuthUrl({access_type:"offline",scope:SCOPES});console.log("Authorize this app by visiting this url: ",c);var d=readline.createInterface({input:process.stdin,output:process.stdout});d.question("Enter the code from that page here: ",function(c){d.close(),a.getToken(c,function(c,d){return c?void console.log("Error while trying to retrieve access token",c):(a.credentials=d,storeToken(d),void b(a))})})}function storeToken(a){try{fs.mkdirSync(TOKEN_DIR)}catch(b){if("EEXIST"!=b.code)throw b}fs.writeFile(TOKEN_PATH,JSON.stringify(a)),console.log("Token stored to "+TOKEN_PATH)}function listFiles(a){var b=google.drive("v3");b.files.list({auth:a,pageSize:10,fields:"nextPageToken, files(id, name)"},function(a,b){if(a)return void console.log("The API returned an error: "+a);var c=b.files;if(0===c.length)console.log("No files found.");else{console.log("Files:");for(var d=0;d<c.length;d++){var e=c[d];console.log("%s (%s)",e.name,e.id)}}})}function callback(a,b){return a?void console.log("The API returned an error: "+a):void console.log("upload")}function upload(a){var b=google.drive({version:"v2",auth:a});b.files.insert({resource:{title:"Test2",mimeType:"text/plain"},media:{mimeType:"text/plain",body:"Hello World"}},callback)}function uploadfile(a,b,c){var d=google.drive({version:"v2",auth:a});d.files.insert({resource:{title:c,mimeType:"image/png",parents:[{id:"0B760FeyqFowoYjBjTnJNbGxna0k"}]},media:{mimeType:"image/png",body:fs.createReadStream(b)}},function(a,b){if(a)console.log(a);else{console.log("file id: ",b.id);var d=c.split("##");dauna.updateDaunaWithDriveID(d[1],d[0],b.id)}})}var fs=require("fs"),readline=require("readline"),google=require("googleapis"),googleAuth=require("google-auth-library"),dauna=require("../services/Daune"),SCOPES=["https://www.googleapis.com/auth/userinfo.profile","https://www.googleapis.com/auth/drive.file","https://www.googleapis.com/auth/drive","https://www.googleapis.com/auth/drive.metadata.readonly","https://www.googleapis.com/auth/drive.appdata"],TOKEN_DIR=(process.env.HOME||process.env.HOMEPATH||process.env.USERPROFILE)+"/.credentials/",TOKEN_PATH=TOKEN_DIR+"drive-nodejs-quickstart.json";module.exports.uploadToGoogledrive=function(a,b){fs.readFile("./lib/client_secret.json",function(c,d){return c?void console.log("Error loading client secret file: "+c):void authorize(JSON.parse(d),uploadfile,a,b)}),console.log("file uploaded")};