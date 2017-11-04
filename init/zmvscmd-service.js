var reg = require("cla/reg");
reg.register("service.zmvscmd.start", {
    name: "Execute Zconsole command",
    icon: "/plugin/cla-zmvscmd-plugin/icon/zmvscmd-service.svg",
    form: "/plugin/cla-zmvscmd-plugin/form/zmvscmd-service-form.js",
    rulebook: {
        moniker: 'zconsole_command',
        description: _('Executes Zconsole command'),
        required: [ 'server', 'type'],
        allow: ['server', 'type', 'command_text', 'program_name', 'cics_name', 'errors'],
        mapper: {
            'type': 'command',
            'command_text':'commandText',
            'program_name':'programName',
            'cics_name':'cicsName'
        },
        examples: [{
            zconsole_command: {
                server: 'zconsole_server',
                type: 'Zcommand',
                command_text: 'D A,L'
            }
        }]
    },
    handler: function(ctx, params) {

        var ci = require("cla/ci");
        var file = require("cla/fs");
        var regRemote = require("cla/reg");
        var log = require("cla/log");
        var path = require("cla/path");
        var proc = require("cla/process");

        var parsedResponse;
        var server = params.server;
        var commandOption = params.command || "";
        var programName = params.programName || "";
        var cicsName    = params.cicsName || "";
        var commandText = params.commandText || "";
        var errors = params.errors || "fail";
        var claBase = proc.env("CLARIVE_BASE");
        var source  = "comando";

        var remotePath = "/u/clax/";
        var remoteFile = remotePath + source ;
        var localFile  = claBase + "/plugins/cla-zmvscmd-plugin/rexx/" + source;
        var tempFile   = claBase + "/tmp/" + source;
        var mod755     = "/bin/chmod 755 " + remotePath + source;
        var delrexx    = "/bin/rm " + remotePath + source;


        if (!server) {
            log.fatal(_("Server CI doesn't exist"));
        }
        var hostServer = ci.findOne({
            mid: server + ""
        });

        if (hostServer.os != "mvs") {
            log.fatal(_("Server CI is not MVS type."));
        }
         if (!programName && commandOption == "NewCopy" )  {
           log.fatal(_("Program not informed."));
         }        

         if (!commandText && commandOption == "Zcommand" )  {
             log.fatal(_("Command not informed."));
          }     

       if (commandOption == "NewCopy") {
          commandText = "F " + cicsName + ",CEMT SET PROG(" + programName + ") NE"
        }  
        
        var rexxsource = file.slurp(localFile).replace(/\$\$\$/,commandText);
        
        regRemote.launch("service.fileman.write", {
            name: "Write translated file",
            config: {
                job: "",
                body: rexxsource,
                filepath: tempFile,
                file_encoding: "cp1047",
                body_encoding: "cp1047",
                templating: "none",
                line_endings: "LF",
                log_body: "no"
            }
        });


        regRemote.launch("service.fileman.ship", {
            name: "Send rexx file",
            config: {
                server: server,
                recursive: "0",
                local_mode: "local_files",
                local_path: tempFile,
                exist_mode_local: "skip",
                rel_path: "file_only",
                remote_path: remotePath,
                exist_mode: "reship",
                backup_mode: "none",
                rollback_mode: "none",
                track_mode: "track",
                audit_tracked: "none",
                chown: "",
                chmod: "",
                max_transfer_chunk_size: "",
                copy_attrs: ""
            }
        });


        function remoteCommand(params, command, server, errors) {
            var output = regRemote.launch("service.scripting.remote", {
                name: "console task",
                config: {
                    errors: errors,
                    server: server,
                    path: command,
                    output_error: params.output_error,
                    output_warn: params.output_warn,
                    output_capture: params.output_capture,
                    output_ok: params.output_ok,
                    meta: params.meta,
                    rc_ok: params.rcOk,
                    rc_error: params.rcError,
                    rc_warn: params.rcWarn
                }
            });
            return output;
        }
        var commandLaunch;        
        commandLaunch = remoteCommand(params, mod755, server, errors);
        commandLaunch = remoteCommand(params, remoteFile, server, errors);
        var response = commandLaunch.output; 
        commandLaunch = remoteCommand(params, delrexx, server, errors);
      
        return response;


    }
});