
# z/OS COMMAND plugin

The ZMVSCMD plugin will allow you to execute z/OS commands into your Mainframe from Clarive.


## Requirements

At least one server running z/OS.

A Clax agent installed and configured on that machine.


## Installation

To install this plugin, place the `cla-zmvscmd-plugin` folder inside the `CLARIVE_BASE/plugins` directory in a Clarive
instance.  Configure a "Generic-Server" instance with the IP address or URL of your z/OS server and  the parameter
"type" = "mvs".

In z/OS you have to grant permissions to the CLAX agent user to execute console commands. 


## How to Use

Once the plugin is correctly installed, you are ready to use a new palette service called 'Zmvscmd'.


### Execute ZCONSOLE COMMAND

This palette service will let you execute a console command on your z/OS server. The various parameters from the
palette service are:

- ** Type ** - Via this parameter you can select the type of z/OS command you wish to launch. Depending on the selected
  option, you will have different fields to fill out. The various options to choose from are:
    - Zcommand : The command can be written as desired.  
    - NewCopy :  Run a console command to perform a NewCopy of a program on CICS.

    Fields to fill out:
- **Server** -  This option lets you choose the server where you wish to execute the command.
- ** Program Name ** - Enter the name of the CICS program you wish to refresh. This option will appear with "NewCopy"
  option.
- ** CICS name ** - Enter the name of the CICS region in the host. This option will appear with "NewCopy" option.
- ** Command ** - Enter the z/OS command you wish to execute. This option will appear with the "Zcommand" option.


Configuration example:

    Type  : Zcommand
    Server: HOST
    Command : D A,L    
    Output: 

This example will list all the tasks (STC, TSO, JOBS) running in the host.

