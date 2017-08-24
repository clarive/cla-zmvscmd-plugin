(function(params) {

    var commandComboBox = Cla.ui.comboBox({
        name: 'command',
        fieldLabel: _('Type of command'),
        data: [
            ['NewCopy', _('Cics Newcopy')],
            ['Zcommand', _('Console Command')],
        ],
        value: params.data.command || 'NewCopy',
        allowBlank: false,
        anchor: '100%',
        singleMode: true
    });


    var serverCombo = Cla.ui.ciCombo({
        name: 'server',
        class: 'generic_server',
        fieldLabel: _('Server'),        
        filter: '{"os":"mvs"}',
        value: params.data.server || '',
        width: 400,
        allowBlank: false,
        with_vars: 1,
    });

    var commandTextField = Cla.ui.textField({
        name: 'commandText',
        fieldLabel: _('Command'),
        value: params.data.commandText,
        allowBlank: true,
        enforceMaxLength: true,
        maxLength: 80,
        hidden: (params.data.command != 'Zcommand')
    });

    var programNameTextField = Cla.ui.textField({
        name: 'programName',
        fieldLabel: _('Program name'),
        value: params.data.programName,
        allowBlank: true,
        enforceMaxLength: true,
        maxLength: 30,
        hidden: (params.data.command != 'NewCopy')
    });

    var cicsNameTextField = Cla.ui.textField({
        name: 'cicsName',
        fieldLabel: _('CICS name'),
        value: params.data.cicsName,
        allowBlank: true,
        enforceMaxLength: true,
        maxLength: 30,
        hidden: (params.data.command != 'NewCopy')
    });

    commandComboBox.on('addItem', function() {
        var v = commandComboBox.getValue();
        if (v == 'Zcommand') {
            commandTextField.show();
            programNameTextField.hide();
            commandTextField.allowBlank = false;
            programNameTextField.allowBlank = true;
            cicsNameTextField.allowBlank = true;
            cicsNameTextField.hide();
         } else if (v == 'NewCopy') {
            commandTextField.hide();
            programNameTextField.show();
            programNameTextField.allowBlank = false;
            cicsNameTextField.allowBlank = false;
            commandTextField.allowBlank = true;
            cicsNameTextField.show();
        } 
    });


    var errorBox = Cla.ui.errorManagementBox({
        errorTypeName: 'errors',
        errorTypeValue: params.data.errors || 'fail',
        rcOkName: 'rcOk',
        rcOkValue: params.data.rcOk,
        rcWarnName: 'rcWarn',
        rcWarnValue: params.data.rcWarn,
        rcErrorName: 'rcError',
        rcErrorValue: params.data.rcError,
        errorTabsValue: params.data
    })

    var panel = Cla.ui.panel({
        layout: 'form',
        items: [
            commandComboBox,
            serverCombo,
            programNameTextField,
            cicsNameTextField,
            commandTextField,
            errorBox
        ]
    });

    return panel;
})