import fs from "fs"
import { exec } from "child_process"

async function convertFile(file) {
    return new Promise(function(resolve, reject){
        if(!fs.existsSync(file)) {
            console.error("File doesnt exists")
            reject(false)
            return
        }
        var date = new Date()
        let name = `${date.getTime()}_${date.getUTCDate()}_cutted.mp4`

        const ls = exec(`ffmpeg -i ${file} -ss 00:00:03 -to 00:00:07 -c copy temp/file/${name}`, async function(error, stdout, stdeer) {
            if(error) {
                console.error(error)
                console.error("Code: "+error.code)
                return
            }
            
            exec(`ffmpeg -i temp/file/${name} -f gif temp/file/${date.getTime()}-${date.getDay()}.gif`)

            setTimeout(() => {
                fs.rmSync(`temp/file/${name}`)
            }, 2500) 
            
            console.log("Process: "+ stdout)
        }) 

        ls.on('exit', function (code) {
            if (code != 0) {
                reject(false);
            } else {
                resolve(`${file}.gif`);
            }
        });
    })
}

async function run()
{
    var gifLocation = await convertFile("temp/file/video.mp4").catch((err) => { console.error("[Error]", err); })
    if (gifLocation) console.log("Location:", gifLocation);
}

run()