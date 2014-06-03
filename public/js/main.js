window.addEventListener("load", function () {
    var editor = ace.edit("editor");
    var session = editor.getSession();

    var responseEditor = ace.edit("response-editor");
    var responseEditorSession = responseEditor.getSession();

    /**
     * runCode
     * The function that sends the code to the server side and waits for the response.
     *
     * @name runCode
     * @function
     * @param {String} code The code that is passed on the server side via HTTP request.
     * @param {Function} callback The callback function that is called after the response comes.
     * @return {XMLHttpRequest} The XHR that is made.
     */
    function runCode (code, callback) {
        var xhr = new XMLHttpRequest();
        var url = "/api/run_code";

        xhr.open("post", url);
        xhr.setRequestHeader("content-type", "text/json; charset=utf-8");
        xhr.onreadystatechange = function() {
            if (xhr.readyState !== 4) { return; }
            var err = xhr.status < 400 ? null : (xhr.responseText || "ERR");
            callback(err, xhr.responseText);
        };

        // send data
        xhr.send(code);
    }

    //setup editor
    editor.setTheme("ace/theme/textmate");
    editor.setFontSize(13);
    session.setMode("ace/mode/javascript");

    // response editor
    responseEditor.setTheme("ace/theme/textmate");
    responseEditor.setFontSize(13);
    responseEditorSession.setMode("ace/mode/json");

    // auto-complete
    ace.require("ace/ext/language_tools");
    editor.setOptions({
        enableBasicAutocompletion: true,
    });

    editor.commands.on("afterExec", function(e){
        console.log(e.args);
         if (e.command.name == "insertstring"&& e.args === ".") {
             editor.execCommand("startAutocomplete")
         }
    });

    // click handler
    document.querySelectorAll(".run-code-btn")[0].addEventListener("click", function () {
        runCode(editor.getValue(), function(err, data) {
            responseEditor.setValue(err || data, -1);
        });
    });
});
