# z/OS plugin

<img src="https://cdn.rawgit.com/clarive/cla-zmvscmd-plugin/master/public/icon/zmvscmd-service.svg?sanitize=true" alt="z/OS Plugin" title="z/OS Plugin" width="120" height="120">

This plugin will allow you to execute z/OS commands into your Mainframe server from Clarive instance.

## Requirements

At least one server running z/OS.

## Installation

To install this plugin, place the `cla-zmvscmd-plugin` folder inside the `$CLARIVE_BASE/plugins` directory in a Clarive
instance.

Configure a "Generic-Server" instance with the IP address or URL of your z/OS server and  the parameter
`type = mvs`.

NOTE: If you are using Clax, you have to grant permissions to the agent user to execute console commands in z/OS.

### Execute Zconsole command

The various parameters are:

- **Type (variable name: type)** - Via this parameter you can select the type of z/OS command you wish to launch. Depending on the selected
  option, you will have different fields to fill out. The various options to choose from are:
    - Zcommand ("Zcommand"): The command can be written as desired.  
    - NewCopy ("NewCopy"):  Run a console command to perform a NewCopy of a program on CICS.
- **Server (server)** -  This option lets you choose the server where you wish to execute the command.
- **Program Name (program_name)** - Enter the name of the CICS program you wish to refresh. This option will appear with "NewCopy"
  option.
- **CICS name (cics_name)** - Enter the name of the CICS region in the host. This option will appear with "NewCopy" option.
- **Command (command_text)** - Enter the z/OS command you wish to execute. This option will appear with the "Zcommand" option.

**Only Clarive EE**

- **Errors and Output** - These two fields concern management of control errors. Their options are:
   - **Fail and Output Error** - Search for the configured error pattern in script output. If found, an error message is
     displayed in the monitor showing the match.
   - **Warn and Output Warn** - Search for the configured warning pattern in the script output. If found, an error
     message is displayed in the monitor showing the match.
   - **Custom** - Where combo errors is set to custom, a new form is displayed for defining using the following fields:
      - **OK** - Range of return code values for the script to have succeeded. No message will be displayed in the
        monitor.
      - **Warn** - Range of return code values to warn the user. A warning message will be displayed in the monitor.
      - **Error** - Range of return code values for the script to have failed. An error message will be displayed in the
        monitor.
   - **Silent** - Silence all errors found.

## How to use

### In Clarive EE

Once the plugin is placed in its folder, you can find this service in the palette in the section of generic service and can be used like any other palette op.

Op Name: **Execute Zconsole command**

Example:

```yaml
    Type  : Zcommand
    Server: zconsole_server
    Command : D A,L
``` 

This example will list all the tasks (STC, TSO, JOBS) running in the zconsole_server.

### In Clarive SE

#### Rulebook

If you want to use the plugin through the Rulebook, in any `do` block, use this ops as examples to configure the different parameters:

```yaml
rule: ZConsole demo
do:
   - zconsole_command:
       type: Zcommand			# Required.
       server: 'zconsole_server'	# Required. Use the mid set to the resource you created
       command_text: "D A,L"  
```

##### Outputs

###### Success

The service will return the console output for the command.

###### Possible configuration failures

**Task failed**

You will get the error output from the console.

**Variable required**

```yaml
Error in rulebook (compile): Required argument(s) missing for op "zconsole_command": "command"
```

Make sure you have all required variables defined.

**Not allowed variable**

```yaml
Error in rulebook (compile): Argument `Command` not available for op "zconsole_command"
```

Make sure you are using the correct paramaters (make sure you are writing the variable names correctly).

## More questions?

Feel free to join **[Clarive Community](https://community.clarive.com/)** to resolve any of your doubts.