var Module = {
        'noInitialRun' : true,
 //       'noFSInit' : true
};

importScripts('qpdf.js');

var line = '';
/*
Module.preRun = function() {
        FS.init(function() {
                return null;
        }, function(data) {
                if(data == 10) {
                        postMessage({
                                'type' : 'stdout',
                                'line' : line
                        });

                        line = '';
                } else {
                        line += String.fromCharCode(data);
                }
        });
};*/

function getFileData(fileName) {
        var data = FS.root.contents[fileName].contents;

        return new Uint8Array(data).buffer;
};

onmessage = function(event) {
        var message = event.data;

        switch(message.type) {
                case "file":
                        FS.createDataFile('/', 'input.pdf', message.data, true, false);

                        break;

                case "command":
                        if(message.command == "go") {
                                postMessage({'type' : 'start'});
                                console.log("do command");
                                Module['callMain'](['--decrypt', 'input.pdf', 'output.pdf']);

                                postMessage({
                                        'type' : 'done',
                                        'data' : getFileData('output.pdf')
                                });
                        }

                        break;
        };
};

postMessage({
        'type' : 'ready'
});
