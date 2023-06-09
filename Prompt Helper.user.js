// ==UserScript==
// @name         Prompt Helper
// @namespace    http://tampermonkey.net/
// @version      0.4.2
// @description  Use pre-defined prompts in ChatGPT
// @author       geoffyli
// @match        https://chat.openai.com/*
// @icon         https://chat.openai.com/favicon.ico
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_listValues
// @grant GM.setValue
// @grant GM.getValue
// ==/UserScript==

var promptTextarea = null;
var paramTextarea = null
var templateName = "Default"

function getSelectedValue() {
    var element = document.getElementsByTagName("select")[0]
    var selectedValue = element.options[element.selectedIndex].value
    return selectedValue
}

function getTemplateObject(templateName) {
    let templates = GM_getValue(templateName.substring(0, templateName.indexOf(":")))
    for (const template of templates) {
        if (template.name == templateName.substring(templateName.indexOf(":") + 2)) {
            return template
        }
    }
    // Return null or undefined if the template is not found
    return null
}

function assemblePrompt() {
    let templateText = getTemplateObject(templateName).text
    let param_text = paramTextarea.value
    let params = param_text.split('|').map(str => str.trim())
    params.forEach((item) => {
        templateText = templateText.replace("$", item)
    })
    promptTextarea.value = templateText
}

function createListeners(templateSelector, paramTextarea) {
    // template selector listener
    templateSelector.addEventListener('change', function() {
        templateName = getSelectedValue()
        if (templateName != "Default") {
            paramTextarea.disabled = false
            let buttons = document.getElementsByTagName('button')
            let button = buttons[buttons.length - 1]
            button.removeAttribute('disabled')
                // Set prompt text area value.
            promptTextarea.value = getTemplateObject(templateName).text
                // Set parameter text area place holder.
            let placeholders = getTemplateObject(templateName).placeholders
            let placeholderStr = ""
            placeholders.forEach((item) => {
                placeholderStr = placeholderStr.concat("[", item, "]", " | ")
            });
            paramTextarea.placeholder = placeholderStr.slice(0, -2)
                // Make parameter text area focused
            paramTextarea.focus()
        } else {
            paramTextarea.disabled = true
            promptTextarea.value = ""
            paramTextarea.placeholder = "Please select a template."
                // Make prompt text area focused
            promptTextarea.placeholder = "Send a message with prompt helper."
            promptTextarea.focus()
        }

    })

    // parameter text area listener
    paramTextarea.addEventListener('input', function() {
        assemblePrompt()
    })
    paramTextarea.addEventListener('keydown', function(event) {
        if (event.keyCode === 13 && !event.shiftKey) {
            event.preventDefault()
                // Enter key was pressed and shift key was not held down
            let buttons = document.getElementsByTagName('button')
            let button = buttons[buttons.length - 1]
                // Get the button coordination
            let rect = button.getBoundingClientRect()
            let x = rect.left + (rect.width / 2)
            let y = rect.top + (rect.height / 2)
                // Dispatch click event
            button.dispatchEvent(new MouseEvent('click', { clientX: x, clientY: y }))
                // Clear the parameter textarea content and the template selector.
            paramTextarea.blur()
            paramTextarea.value = ""
            paramTextarea.placeholder = "Please select a template."
            paramTextarea.disabled = true
                // Set the submit button disabled.
            button.disabled = true
            templateSelector.selectedIndex = 0
                // Set up prompt text area.
            promptTextarea.placeholder = "Send a message with prompt helper."
            promptTextarea.focus()
        }
    })

    // submit button listener
    let buttons = document.getElementsByTagName('button')
    let button = buttons[buttons.length - 1]
    button.addEventListener('click', function(event) {
        // Clear the parameter textarea content and the template selector.
        paramTextarea.blur()
        paramTextarea.value = ""
        paramTextarea.placeholder = "Please select a template."
        paramTextarea.disabled = true
        templateSelector.selectedIndex = 0
            // Set up prompt area
        promptTextarea.placeholder = "Send a message with prompt helper."
        promptTextarea.focus()
    })

    // document key down listener
    document.addEventListener("keydown", function(event) {
        if (event.ctrlKey && event.key === "/") {
            templateSelector.focus()
        }
    });
}

function createHTMLComponents(jNode) {
    // Get prompt text area and the parent div.
    promptTextarea = document.getElementsByTagName("textarea")[0]
    promptTextarea.placeholder = "Send a message with prompt helper."
    let parentDiv = promptTextarea.parentNode

    // Create the divier.
    let divider = document.createElement("hr")
    divider.setAttribute("class", "rounded")
    divider.style.marginRight = "10px"
    divider.style.marginBottom = "13px"

    parentDiv.insertBefore(divider, parentDiv.childNodes[0])

    // Create Prompt Helper Div
    let helperDiv = document.createElement("div")
    helperDiv.setAttribute("class", "h-full flex ml-1 md:w-full md:m-auto md:mb-2 gap-0 md:gap-2 justify-center")
    parentDiv.insertBefore(helperDiv, parentDiv.childNodes[0])

    // Parameter text area
    paramTextarea = document.createElement("textarea")
    paramTextarea.setAttribute("class", "h-full flex ml-1 md:w-full md:m-auto md:mb-2 dark:text-white dark:bg-gray-700 p-3 rounded-md")
    paramTextarea.style.marginRight = "10px"
    paramTextarea.style.marginBottom = "5px"
    paramTextarea.style.height = "50px"
    paramTextarea.style.display = "inline-block"
    paramTextarea.placeholder = "Please select a template."
    paramTextarea.disabled = true
    helperDiv.insertBefore(paramTextarea, helperDiv.childNodes[0])

    // Template selector
    let templateSelector = document.createElement("select")
    templateSelector.innerHTML = concatSelectorHTML()
    templateSelector.setAttribute("class", "h-full flex w-full bg-white dark:text-white dark:bg-gray-700 p-3 rounded-md dark:hover:bg-gray-700")
    templateSelector.style.marginRight = "10px"
    templateSelector.style.marginBottom = "5px"
    templateSelector.style.height = "50px"
    templateSelector.style.display = "inline-block"
    helperDiv.insertBefore(templateSelector, helperDiv.childNodes[0])

    // Create listeners
    createListeners(templateSelector, paramTextarea)
}

function concatSelectorHTML() {
    let selectorHTML = '<option value="Default">Default</option>'
    let groups = GM_listValues()
    for (let group of groups) {
        selectorHTML = selectorHTML.concat('<optgroup label="', group, '">')
        for (let template of GM_getValue(group)) {
            selectorHTML = selectorHTML.concat('<option value="', group, ': ', template.name, '\">', template.name, '</option>')
        }
    }
    return selectorHTML
}

(function() {
    'use strict';
    window.addEventListener('load', function() {
        waitForKeyElements("#prompt-textarea", createHTMLComponents);
    })
})()

// util functions

/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.
*/
function waitForKeyElements(
    selectorTxt,
    actionFunction,
    bWaitOnce,
    iframeSelector
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes = $(selectorTxt);
    else
        targetNodes = $(iframeSelector).contents()
        .find(selectorTxt);

    if (targetNodes && targetNodes.length > 0) {
        btargetsFound = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each(function() {
            var jThis = $(this);
            var alreadyFound = jThis.data('alreadyFound') || false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound = actionFunction(jThis);
                if (cancelFound)
                    btargetsFound = false;
                else
                    jThis.data('alreadyFound', true);
            }
        });
    } else {
        btargetsFound = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj = waitForKeyElements.controlObj || {};
    var controlKey = selectorTxt.replace(/[^\w]/g, "_");
    var timeControl = controlObj[controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound && bWaitOnce && timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval(timeControl);
        delete controlObj[controlKey]
    } else {
        //--- Set a timer, if needed.
        if (!timeControl) {
            timeControl = setInterval(function() {
                    waitForKeyElements(selectorTxt,
                        actionFunction,
                        bWaitOnce,
                        iframeSelector
                    );
                },
                300
            );
            controlObj[controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj = controlObj;
}