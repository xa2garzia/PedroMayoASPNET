// ----------------------------------------------------------------------
// Utilities

/////////////////
// AddEvent
// Sets an event handler to an DOM element.
//  elem: DOM element
//  event: Event name
//  fn: Handler function
function AddEvent(elem, event, fn, useCapture) {
    if (elem.addEventListener) {
        elem.addEventListener(event, function (e) {
            if (fn(e) === false) {
                e.stopPropagation();
                e.preventDefault();
            }
        }, useCapture === true);
    } else {
        event = "on" + event;
        if (typeof elem[event] === "function") {
            fn = (function (fnOld, fnNew) {
                return function () {
                    fnOld.apply(this, arguments);
                    fnNew.apply(this, arguments);
                };
            })(elem[event], fn);
        }
        elem[event] = fn;
    }
}

/////////////////
// IdElementGeometry
// Queries the geometry of a DOM element.
//  id: Identifier of the element to query it's geometry
function IdElementGeometry(id) {
    var info = { x: 0, y: 0, width: 0, height: 0, viewX: 0, viewY: 0 };
    var elem = document.getElementById(id);
    if (!elem) { return info; }

    // Get absolute position
    var elemAux = elem;
    do {
        info.x += elemAux.offsetLeft;
        info.y += elemAux.offsetTop;
        elemAux = elemAux.offsetParent;
    } while (elemAux != null);

    // Get element viewport position
    var viewportOffset = elem.getBoundingClientRect();
    info.viewY = viewportOffset.top;
    info.viewX = viewportOffset.left;

    // Get Size
    info.width = elem.offsetWidth;
    info.height = elem.offsetHeight;

    return info;
}

function IdElementFocus(id) {
    var elem = document.getElementById(id);
    if (!elem) { return; }
    elem.focus();
}

/////////////////
// WindowHeight
//  Gets the height of the browser window.
function WindowHeight() {
    var height = 0;
    if (typeof (window.innerHeight) == 'number') {
        height = window.innerHeight;
    } else if (document.documentElement && document.documentElement.clientHeight) {
        height = document.documentElement.clientHeight;
    } else if (document.body && document.body.clientHeight) {
        height = document.body.clientHeight;
    }
    return height;
}

/////////////////
// WindowWidth
//  Gets the width of the browser window.
function WindowWidth() {
    var width = 0;
    if (typeof (window.innerWidth) == 'number') {
        width = window.innerWidth;
    } else if (document.documentElement && document.documentElement.clientWidth) {
        width = document.documentElement.clientWidth;
    } else if (document.body && document.body.clientWidth) {
        width = document.body.clientWidth;
    }
    return width;
}

/////////////////
// WindowScroll
//  Gets the browser window scroll position.
function WindowScroll() {
    var scroll = { x: 0, y: 0 };
    var doc = document.documentElement;
    scroll.x = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    scroll.y = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    return scroll;
}

/////////////////
// WindowScrollTop
//  Gets the browser window scroll top position.
function WindowScrollTop() {
    var doc = document.documentElement;
    var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    return top;
}

/////////////////
// WindowScrollLeft
//  Gets the browser window scroll left position.
function WindowScrollLeft() {
    var doc = document.documentElement;
    var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    return left;
}

/////////////////
// ElementAddClass
//  Adds a classname to the element.
function ElementAddClass(element, className) {
    if (!element) { return; }
    if (element.classList)
        element.classList.add(className);
    else
        element.className += ' ' + className;
}

/////////////////
// ElementHasClass
//  Determines if the element has some classname assigned.
function ElementHasClass(element, className) {
    if (!element) { return false; }
    return ((" " + element.className + " ").replace(/[\n\t]/g, " ").indexOf(" " + className + " ") > -1);
}

/////////////////
// ElementDelClass
//  Deletes a classname to the element.
function ElementDelClass(element, className) {
    if (!element) { return; }
    if (element.classList)
        element.classList.remove(className);
    else
        element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}

/////////////////
// ElementToggleClass
function ElementToggleClass(element, className) {
    if (ElementHasClass(element, className)) {
        ElementDelClass(element, className);
    } else {
        ElementAddClass(element, className);
    }
}

function IdElementDelClass(idElement, className) {
    var element = document.getElementById(idElement);
    ElementDelClass(element, className);
}

function IdElementAddClass(idElement, className) {
    var element = document.getElementById(idElement);
    ElementAddClass(element, className);
}

function IdElementToggleClass(idElement, className) {
    var element = document.getElementById(idElement);
    ElementToggleClass(element, className)
}

function FadeIn(idElement, fadeTime) {
    if (!fadeTime) { fadeTime = 150; }

    var el = document.getElementById(idElement);
    if (el.style.display !== "none") {
        return;
    }

    el.style.opacity = 0;
    el.style.display = "block";

    var first = +new Date();
    var tick = function () {
        var opacity = (new Date() - first) / fadeTime;
        if (opacity > 1) {
            opacity = 1;
        }
        el.style.opacity = opacity;
        if (opacity < 1) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
        } else {
            el.style.display = "block";
            el.style.opacity = "";
            el.style.filter = "";
        }
    };

    tick();
}

function FadeOut(idElement, fadeTime) {
    if (!fadeTime) { fadeTime = 150; }

    var el = document.getElementById(idElement);

    if (el.style.display === "none") {
        return;
    }

    el.style.opacity = 1;
    el.style.display = "block";

    var first = +new Date();
    var tick = function () {
        var opacity = 1.0 - (new Date() - first) / fadeTime;
        if (opacity < 0) {
            opacity = 0;
        }
        el.style.opacity = opacity;
        if (opacity > 0.01) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
        } else {
            el.style.display = "none";
            el.style.opacity = "";
            el.style.filter = "";
        }
    };

    tick();
}

function ToggleFade(idElement) {
    var el = document.getElementById(idElement);

    if (!(el.style.display === 'none')) {
        FadeOut(idElement);
    } else {
        FadeIn(idElement);
    }
}

function Show(idElement) {
    var element = document.getElementById(idElement);
    element.style.display = "block";
}

function EquateHeight(idElementOrig, idElementDest) {
    var elementOrig = document.getElementById(idElementOrig);
    var elementDest = document.getElementById(idElementDest);
    elementDest.style.height = elementOrig.offsetHeight + "px";
}

function strip(html) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}

/////////////////
// GetParentByTagName
//  Gets the container of an element by tagname
function GetParentByTagName(parentTagName, childElementObj) {
    var parent = childElementObj.parentNode;
    while (parent.tagName.toLowerCase() != parentTagName.toLowerCase()) {
        parent = parent.parentNode;
    }
    return parent;
}

/////////////////
// AllCheckboxChecked
//  Determines if all the checkboxs inside a element are checked.
function AllCheckboxChecked(elPanel) {
    var inputs = elPanel.getElementsByTagName('INPUT');
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].type.toLowerCase() == 'checkbox') {
            if (!inputs[i].checked) {
                return false;
            }
        }
    }
    return true;
}

/////////////////
// ElementRemove
//  Removes an element.
function ElementRemove(element) {
    if (element && element.offsetParent) {
        element.parentNode.removeChild(element);
    }
}

function CheckKey(event, checkKey) {
    var key = event.charCode || event.keyCode || 0;
    return (key === checkKey);
}

// Utilities
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
// "focus-within" polyfill
(function (window, document) {
    'use strict';
    var slice = [].slice;
    var removeClass = function (elem) {
        elem.classList.remove('focus-within');
    };
    var update = (function () {
        var running, last;
        var action = function () {
            var element = document.activeElement;
            running = false;
            if (last !== element) {
                last = element;
                slice.call(document.getElementsByClassName('focus-within')).forEach(removeClass);
                while (element && element.classList) {
                    element.classList.add('focus-within');
                    element = element.parentNode;
                }
            }
        };
        return function () {
            if (!running) {
                requestAnimationFrame(action);
                running = true;
            }
        };
    })();
    document.addEventListener('focus', update, true);
    document.addEventListener('blur', update, true);
    update();
})(window, document);
// "focus-within" polyfill
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
// label focuses referenced object 
var Label_FocusForElement = function (event) {
    var key = event.charCode || event.keyCode || 0;
    var forValue = event.target.getAttribute("for");
    if (!forValue) { return; }

    var elemReferenced = document.getElementById(forValue);
    if (!elemReferenced) { return; }
    if (elemReferenced.tagName == "input") { return; }

    elemReferenced.focus();
};
AddEvent(window, "click", Label_FocusForElement);
// label focuses referenced object 
// ----------------------------------------------------------------------

/////////////////
// AddLoadingOverlay
//  Adds a loading overlay on any coverable element
function AddLoadingOverlay(idDivCoverable, transparent) {
    if (!transparent) { transparent = false; }
    var idDivLoading = idDivCoverable + "_divLoadingOverlay";
    var divLoading = document.getElementById(idDivLoading);
    var divCoverable = document.getElementById(idDivCoverable);
    if (!divLoading && divCoverable) {
        divLoading = document.createElement("DIV");
        divLoading.id = idDivLoading;
        if (transparent) {
            divLoading.className = "divLoadingOverlayTrans";
        } else {
            divLoading.className = "divLoadingOverlay";
        }
        divCoverable.appendChild(divLoading);

        divLoadingObject = document.createElement("DIV");
        divLoadingObject.className = "divLoadingObject";
        divLoadingObject.angle = 0;
        divLoading.appendChild(divLoadingObject);

        var animationFrame = function () {
            if (!divLoading.offsetParent) { return; }
            divLoadingObject.style.transform = 'rotate(' + divLoadingObject.angle + 'deg)';
            divLoadingObject.angle += 5;
            if (divLoadingObject.angle > 360) {
                divLoadingObject.angle -= 360;
            }
            setTimeout(animationFrame, 16);
        };

        setTimeout(function () {
            animationFrame();
        }, 16)
    }
}

/////////////////
// DelLoadingOverlay
//  Deletes a loading overlay on any coverable element, or all loading overlays if none specified
function DelLoadingOverlay(idDivCoverable) {
    var idDivLoading = null;
    if (idDivCoverable) {
        var idDivLoading = idDivCoverable + "_divLoadingOverlay";
        var divLoading = document.getElementById(idDivLoading);
        ElementRemove(divLoading);
        return;
    }

    var listDivLoading = document.querySelectorAll(".divLoadingOverlay");
    for (var i = 0, n = listDivLoading.length; i < n; i++) {
        ElementRemove(listDivLoading[i]);
    }

    var listDivLoading = document.querySelectorAll(".divLoadingOverlayTrans");
    for (var i = 0, n = listDivLoading.length; i < n; i++) {
        ElementRemove(listDivLoading[i]);
    }
}

// ----------------------------------------------------------------------
// Global Error Handler
window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
    // Handle JS errors
    try {
        debugger;
        // Build URL with the information
        var errorUrl = "ClientSideError.aspx?";
        errorUrl += "&errorMsg=" + encodeURIComponent(errorMsg);
        errorUrl += "&lineNumber=" + encodeURIComponent(lineNumber);
        errorUrl += "&url=" + encodeURIComponent(url);
        if (column) {
            errorUrl += "&column=" + encodeURIComponent(column);
        }
        if (errorObj) {
            var errorObj2 = {};
            Object.getOwnPropertyNames(errorObj).forEach(function (key) {
                errorObj2[key] = errorObj[key];
            });
            if (errorObj.stack) {
                errorObj2["stack"] = errorObj["stack"];
            }
            errorUrl += "&errorObj=" + encodeURIComponent(JSON.stringify(errorObj2));
        }

        // Call error reporting URL
        xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", errorUrl, true);
        xmlhttp.onreadystatechange = function () {
            try {
                if (xmlhttp.readyState == 4) {
                    // Re-submit form to force a full reset of page
                    document.getElementById("aspnetForm").submit();
                }
            } catch (e) { /* Ignore Handling errors */ }
        }
        xmlhttp.send(null);
    } catch (e) { /* Ignore Handling errors */ }
    return true;
};
function CheckUpdatePanelError(sender, args) {
    // Gestor de errores dentro de los UpdatePanels
    if (args.get_error() != undefined) {
        // Ignorar "Sys.WebForms.PageRequestManagerServerErrorException" desconocidos
        if (args.get_response().get_statusCode() == 0) {
            args.set_errorHandled(true);
            return;
        }

        var errorMessage = args.get_error().message;
        var urlError = masterConfig.urlError;
        if (errorMessage != "") {
            urlError += "?Message=" + encodeURIComponent(errorMessage);
        }
        args.set_errorHandled(true);
        window.onbeforeunload = null;
        window.location = urlError;
        return;
    }
}
AddEvent(window, "load", function () {
    if (typeof (Sys) === 'undefined') { return; }
    var pgRegMgr = Sys.WebForms.PageRequestManager.getInstance();
    if (pgRegMgr) {
        pgRegMgr.add_endRequest(CheckUpdatePanelError);
    }
});
// Global Error Handler
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
// Filtrado de teclado global
var FilterKeys = function (event) {
    var key = event.charCode || event.keyCode || 0;

    // Pulsado enter
    if (key === 13) {
        var ele = window.event != window.undefined ? window.event.srcElement : event.target;

        // Desactivar Enter en textboxes y passwords
        if (ele.tagName == "INPUT" &&
            (
                ele.type == "text" ||
                ele.type == "password" ||
                false
            )
        )
        {
            if (event.returnValue) event.returnValue = false;
            if (event.keyCode) event.keyCode = 0;
            event.preventDefault();
            // FIXME: click btnvalidate buttons
            return false;
        }

        // Activarlo para submits, buttons, imageinputs, links, labels y textareas
        if (
                ele.tagName == "INPUT" &&
                (
                    ele.type == "submit" ||
                    ele.type == "button" ||
                    ele.type == "image" ||
                    false
                ) &&
                true) {
            return true;
        }
        if (
                ele.tagName == "A" ||
                ele.tagName == "LABEL" ||
                ele.tagName == "TEXTAREA" ||
                ele.contentEditable == "true" ||
                ele.tagName == "DIV" ||
                ele.tagName == "SPAN") {
            return true;
        }

        // Por defecto nada
        return false;
    }

    // Desactivar F5
    if (key === 116) {
        if (event.returnValue) event.returnValue = false;
        if (event.keyCode) event.keyCode = 0;
        return false;
    }
};
AddEvent(window, "keydown", FilterKeys);
// Filtrado de teclado global
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
// ExitConfirmation

// Vandera que se marca cuando se esta enviando el formulario
var g_isSubmit = false;
var g_isMenuChange = false;

// Gestion de eventos carga y envio
function frmMaster_OnSubmit() {
    g_isSubmit = true;
    return true;
}
function ExitConfirmation_Load() {
    if (typeof (Sys) === 'undefined') { return; }
    g_isSubmit = false;
    g_isMenuChange = false;
    var pgRegMgr = Sys.WebForms.PageRequestManager.getInstance();
    if (pgRegMgr) {
        pgRegMgr.add_beginRequest(frmMaster_OnSubmit);
        pgRegMgr.add_endRequest(ExitConfirmation_Load);
    }
}
AddEvent(window, "load", function () {
    ExitConfirmation_Load();
});

// Funciones de ayuda para la gestion de la vandera de cambios
function isDirty() {
    if (typeof (exitConfirmationConfig) === 'undefined') { return false; }
    var hidDirty = document.getElementById(exitConfirmationConfig.idHidDirty);
    if (hidDirty) {
        return hidDirty.value === "1";
    }
    return false;
}
function setDirty(dirty) {
    if (typeof (exitConfirmationConfig) === 'undefined') { return; }
    var hidDirty = document.getElementById(exitConfirmationConfig.idHidDirty);
    if (hidDirty) {
        hidDirty.value = dirty;
    }
}
function markDirty() {
    setDirty("1");
    g_isSubmit = false;
    g_isMenuChange = false;
    return true;
}
function cleanDirty() {
    setDirty("");
    g_isSubmit = false;
    g_isMenuChange = false;
    return true;
}
function markMenuChange() {
    g_isMenuChange = true;
}

function messageExitConfirmation() {
    var message = "ExitConfirmation";
    if (typeof (exitConfirmationConfig) === 'undefined') { return message; }
    message = exitConfirmationConfig.messageValidation;

    // Fix: Timeout para quitar animacion de carga en caso de no aceptar el cambio de pagina.
    g_loadingTimeout = setTimeout(function () {
        DelLoadingOverlay();
    }, 5000);

    return message;
}

function hasExitConfirmation() {
    // Comprobar si hay algún "btnvalidate"
    var listElements = document.getElementsByClassName("btnvalidate");
    if (listElements.length <= 0) {
        return false;
    }

    return true;
}

window.onbeforeunload = function (e) {
    if (g_isSubmit && !g_isMenuChange) {
        g_isSubmit = false;
        g_isMenuChange = false;
        return;
    }
    g_isMenuChange = false;

    if (!hasExitConfirmation()) {
        return;
    }

    // Condiciones para el mensage de confirmacion de salida
    if (isDirty()) {
        return messageExitConfirmation();
    }
};

function confirmLogout(msg) {
    var response = confirm(msg);
    if (response) {
        cleanDirty();
    }
    return response;
}

function ExitConfirmation_LinkClick() {
    if (hasExitConfirmation() && isDirty()) {
        var response = confirm(messageExitConfirmation());
        if (response) {
            cleanDirty();
        }
        return response;
    }

    return true;
}

// ExitConfirmation
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
// CtrMenu

function CtrMenu_FocusFirstActivity(idPanel) {
    var divPanel = document.getElementById(idPanel);
    var listNavItemActive = divPanel.getElementsByClassName("subnavActive");
    if (listNavItemActive.length > 0) {
        listNavItemActive[0].focus();
    } else {
        var listNavItemUnactive = divPanel.getElementsByClassName("subnavUnactive");
        if (listNavItemUnactive.length > 0) {
            listNavItemUnactive[0].focus();
        }
    }
}

function CtrMenu_ToggleItem(idPanel, idLink) {
    if (!menuConfig) { return; }

    if (idPanel == menuConfig.idPanelSelected) {
        // Hide menu

        // Panel
        FadeOut(menuConfig.idPanelContainer, menuConfig.fadeTime);
        FadeOut(menuConfig.idPanelSelected, menuConfig.fadeTime);
        menuConfig.idPanelSelected = "";

        // Link
        if (menuConfig.idLinkSelected !== "") {
            IdElementDelClass(menuConfig.idLinkSelected, "navActiveMod");
        }
        menuConfig.idLinkSelected = "";
        if (menuConfig.idLinkActual !== '') {
            IdElementAddClass(menuConfig.idLinkActual, "navActiveMod");
        }
    } else {
        // Show menu

        // Panel
        if (menuConfig.idPanelSelected === "") {
            Show(idPanel);
            FadeIn(menuConfig.idPanelContainer, menuConfig.fadeTime);
        } else {
            FadeIn(idPanel, menuConfig.fadeTime);
            FadeOut(menuConfig.idPanelSelected, menuConfig.fadeTime);
        }
        menuConfig.idPanelSelected = idPanel;
        EquateHeight(idPanel, menuConfig.idPanelContainer);

        // Link
        IdElementDelClass(menuConfig.idLinkActual, "navActiveMod");
        if (menuConfig.idLinkSelected !== "") {
            IdElementDelClass(menuConfig.idLinkSelected, "navActiveMod");
        }
        menuConfig.idLinkSelected = idLink;
        IdElementAddClass(menuConfig.idLinkSelected, "navActiveMod");
        if (menuConfig.idLinkActual != idLink && menuConfig.idLinkActual !== '') {
            IdElementAddClass(menuConfig.idLinkActual, "selectMod");
        } else {
            IdElementDelClass(menuConfig.idLinkActual, "selectMod");
        }

        CtrMenu_FocusFirstActivity(idPanel);
    }
}
var CM_TI = CtrMenu_ToggleItem;

function CtrMenu_KeyPress(event, idPanel, idLink) {
    var key = event.charCode || event.keyCode || 0;

    // Pulsado enter
    if (key === 13) {
        CtrMenu_ToggleItem(idPanel, idLink);
    }
}
var CM_KP = CtrMenu_KeyPress;


// ----------------------------------------------------------------------
// CtrSessionKeepAlive
function SessionKeepAlive_Init(idImg, url, period) {
    var img = document.getElementById(idImg);
    var tick = function(){
        img.src = url + "?t=" + Math.floor((+new Date()) / 1000);
    };
    setTimeout(tick, period);
}

// ----------------------------------------------------------------------
// TextBox

// Gestiona el evento de KeyPress para asegurarse que el elemento no supera el maximo establecido
// @evt = El evento que ha producido el keypress
// @element = Elemento DOM, en este caso un textarea
// @maxLength = Tamaño máximo asginado a tal elemento
function TextBox_KeyPressMaxLenght(evt, element, maxLength) {
    evt = evt || window.event // IE support
    var ctrlDown = evt.ctrlKey || evt.metaKey // Mac support

    if (!ctrlDown || !evt.altKey) {
        if (ctrlDown && evt.key === 'c') return true; // Ctrl+C
        if (ctrlDown && evt.key === 'x') return true;  // Ctrl+X
        if (ctrlDown && evt.key === 'z') return true; // Ctrl+Z
    }

    // Backspace ASCII
    var keyCode = evt.keyCode || evt.charCode;
    if (keyCode == 8 || keyCode == 46)
        return true;

    // Limit length
    if (element.value.length == maxLength) {
        return false;
    } else if (element.value.length > maxLength) {
        element.value = element.value.substring(0, maxLength);
        return false;
    }
}

function TextBox_PasteMaxLenght(evt, element, maxLength) {
    setTimeout(function () {
        if (element.value.length > maxLength) {
            element.value = element.value.substring(0, maxLength);
            return false;
        }
    }, 10);
}

function TextBox_GetValue(clientID) {
    var textBox = document.getElementById(clientID);
    if (!textBox) { return null; }
    return textBox.value;
}

function TextBox_SetValue(clientID, value) {
    var textBox = document.getElementById(clientID);
    if (!textBox) { return; }
    textBox.value = value;
}

function TextBox_SetEnabled(clientID, enabled) {
    var textBox = document.getElementById(clientID);
    if (textBox) {
        textBox.disabled = (!enabled) ? "true" : "false";
    }
}

function TextBox_BindOnChange(clientID, onChangeFunc) {
    var textBox = document.getElementById(clientID);
    if (textBox) {
        textBox.onchange = onChangeFunc;
        textBox.onblur = onChangeFunc;
    }
}

// ----------------------------------------------------------------------
// CustomGridView

function GridView_ClickRow(row_index, hid_elementID, id_grid) {
    var hidValue = document.getElementById(hid_elementID);
    var rowSelected = parseInt(hidValue.value);
    GridView_DeselectRow(id_grid, rowSelected);
    GridView_SelectRow(id_grid, parseInt(row_index));
    hidValue.value = row_index;
}

function GridView_GetRowId(id_grid, rowNumber) {
    return id_grid + '_ctl0' + (rowNumber + 3);
}

function GridView_SelectRow(id_grid, rowNumber) {
    if (rowNumber == -1) {
        rowNumber = 0;
    }
    var rowid = GridView_GetRowId(id_grid, rowNumber);
    IdElementAddClass(rowid, "gridview_rowstyle_selected");
}

function GridView_DeselectRow(id_grid, rowNumber) {
    if (rowNumber == -1) return
    var rowid = GridView_GetRowId(id_grid, rowNumber);
    IdElementDelClass(rowid, "gridview_rowstyle_selected");
}

function GridView_OnkeyDown(event, hid_elementID, id_grid, funcPagerPrevious, funcPagerNext) {
    var hidValue = document.getElementById(hid_elementID);
    var rowSelected = parseInt(hidValue.value);

    var key = event.charCode || event.keyCode || 0;
    if ((key == 38)) // Up
    {
        var oldSelectedRow = rowSelected;
        rowSelected = rowSelected - 1;
        var rowID = GridView_GetRowId(id_grid, rowSelected);
        if (document.getElementById(rowID)) {
            GridView_DeselectRow(id_grid, oldSelectedRow);
            GridView_SelectRow(id_grid, rowSelected);
            document.getElementById(hid_elementID).value = rowSelected;
        }
        event.preventDefault();
    }
    if (key == 40) //Down
    {
        var oldSelectedRow = rowSelected;
        rowSelected = rowSelected + 1;
        var rowID = GridView_GetRowId(id_grid, rowSelected);
        if (document.getElementById(rowID)) {
            GridView_DeselectRow(id_grid, oldSelectedRow);
            GridView_SelectRow(id_grid, rowSelected);
            document.getElementById(hid_elementID).value = rowSelected;
        }
        event.preventDefault();
    }
    if (key == 37) //Left
    {
        if (funcPagerPrevious) {
            funcPagerPrevious();
        }
        event.preventDefault();
    }
    if (key == 39) //Right
    {
        if (funcPagerNext) {
            funcPagerNext();
        }
        event.preventDefault();
    }
}


// ----------------------------------------------------------------------
// CalendarInputField

function CalendarInputField_HideCalendar(calID) {
    var elemCal = $find(calID);
    if (elemCal != null) {
        elemCal.hide();
    }
}

function CalendarInputField_OnKeyDown(event) {
    var key = event.charCode || event.keyCode || 0;
    if (
        (key >= 37 && key <= 40) || // Left, Up, Right and Down
        key == 8 || // Backspace ASCII
        key == 9 || // Tab ASCII
        key == 16 || // Shift
        key == 17 || // Control
        key == 35 || // End
        key == 36 || // Home
        key == 46 // delete ASCII
    ) {
        return true;
    }
    if (key == 47 || key == 111 || key == 191) {
        // Slash
        return true;
    }
    if ((key >= 48 && key <= 57) ||
            (key >= 96 && key <= 105)) {
        // Numeros
        return true;
    }
    return false;
}

function CalendarInputField_Clean(txtID, calID, dirtable) {
    var txt = document.getElementById(txtID);
    txt.value = '';
    try {
        if (dirtable) { markDirty(); }
        if (txt.onchange) { txt.onchange(ev); }
    } catch (e) { }
    CalendarInputField_HideCalendar(calID);
}

// ----------------------------------------------------------------------
// DropDownPanel

function DropDownPanel_Toggle(cfg) {
    var elemDropDown = document.getElementById(cfg.divContentWrapper);
    var elemHidStatus = document.getElementById(cfg.hidStatus);
    var elemDivBackground = document.getElementById(cfg.divTransBackground);
    if (!elemDropDown || !elemHidStatus || !elemDivBackground) { return; }

    if (!(elemDropDown.style.display == 'none')) {
        if (cfg.postbackOnHide && elemHidStatus.value.indexOf('changed') >= 0) {
            elemHidStatus.value = 'hidden';
            document.getElementById(cfg.fieldControl).disabled = true;
            document.getElementById(cfg.divTransControls).onclick = null;
            cfg.funcChanged();
        } else {
            elemHidStatus.value = 'hidden';
        }
        FadeOut(cfg.divContentWrapper);
        elemDivBackground.style.display = 'none';
    } else {
        FadeIn(cfg.divContentWrapper);
        elemHidStatus.value = 'visible';
        elemDivBackground.style.display = 'block';

        // Determinar si hay que convertirlo en "DropUp" y/o "DropLeft"
        var windowScrollTop = WindowScrollTop();
        var windowScrollLeft = WindowScrollLeft();
        var windowVisibleHeight = WindowHeight() + windowScrollTop;
        var windowVisibleWidth = WindowWidth() + windowScrollLeft;
        elemDropDown.style.top = "100%";
        elemDropDown.style.bottom = "auto";
        elemDropDown.style.left = "0";
        elemDropDown.style.right = "auto";
        var dropdownGeometry = IdElementGeometry(cfg.divContentWrapper);
        var wrapperGeometry = IdElementGeometry(cfg.divWrapper);
        var elemContent = document.getElementById(cfg.divContent);
        var maxHeight = 0;
        if (windowVisibleHeight < (dropdownGeometry.y + dropdownGeometry.height) &&
            (dropdownGeometry.y - windowScrollTop) > dropdownGeometry.height) {
            elemDropDown.style.bottom = "100%";
            elemDropDown.style.top = "auto";
            maxHeight = dropdownGeometry.viewY - wrapperGeometry.height;
        } else {
            maxHeight = WindowHeight() - dropdownGeometry.viewY;
        }
        if (maxHeight > cfg.maxHeight) {
            maxHeight = cfg.maxHeight;
        }
        elemContent.style.maxHeight = maxHeight + "px";
        if (windowVisibleWidth < (dropdownGeometry.x + dropdownGeometry.width) &&
            ((dropdownGeometry.x + wrapperGeometry.width) - windowScrollLeft) > dropdownGeometry.width) {
            elemDropDown.style.left = "auto";
            elemDropDown.style.right = "0";
        }
    }
}

function DropDownPanel_Hide(cfg) {
    var elemDropDown = document.getElementById(cfg.divContentWrapper);
    var elemHidStatus = document.getElementById(cfg.hidStatus);
    var elemDivBackground = document.getElementById(cfg.divTransBackground);
    if (!elemDropDown || !elemHidStatus || !elemDivBackground) { return; }

    var hidding = !(elemDropDown.style.display == 'none');
    if (cfg.postbackOnHide && elemHidStatus.value.indexOf('changed') >= 0) {
        elemHidStatus.value = 'hidden';
        document.getElementById(cfg.fieldControl).disabled = true;
        document.getElementById(cfg.divTransControls).onclick = null;
        cfg.funcChanged();
    } else {
        elemHidStatus.value = 'hidden';
    }
    FadeOut(cfg.divContentWrapper);
    elemDivBackground.style.display = 'none';
    return hidding;
}

function DropDownPanel_SetText(cfg, text) {
    var elemHidStatus = document.getElementById(cfg.hidStatus);
    var elemCapturer = document.getElementById(cfg.divTransControls);
    if (!elemHidStatus || !elemCapturer) { return; };
    elemHidStatus.value = 'changed';
    var elemDDL = document.getElementById(cfg.fieldControl);
    text = strip(text);
    if (text !== "") {
        elemDDL.innerText = text;
        elemCapturer.title = text.split(', ').join("\r\n");
    } else {
        elemCapturer.title = '';
        elemDDL.innerText = cfg.defaultText;
    }
}

function DropDownPanel_SetCssClassText(cfg, cssClass) {
    var elemDDL = document.getElementById(cfg.fieldControl);
    elemDDL.className = cfg.baseCssClassText + cssClass;
}

function DropDownPanel_OnBlur(cfg) {
    requestAnimationFrame(function () {
        var divWrapper = document.getElementById(cfg.divWrapper);
        var element = document.activeElement;
        if (!element) {
            DropDownPanel_Hide(cfg);
            return;
        }
        while (element) {
            if (element == divWrapper) {
                return;
            }
            element = element.parentNode;
        }
        DropDownPanel_Hide(cfg);
    });
}

// ----------------------------------------------------------------------
// DropDownList

function DropDownList_GetItems(clientID) {
    var hidItems = document.getElementById(clientID + "_hidItems");
    if (!hidItems) { return []; }
    var items = JSON.parse(hidItems.value);
    return items;
}

function DropDownList_GetSelection(clientID) {
    var hidSelectedData = document.getElementById(clientID + "_hidSelectedData");
    if (!hidSelectedData) {
        return { "selectedIndex": -1, "selectedValue": "", "selectedText": "", "selectedValues": "" };
    }
    var selectedData = JSON.parse(hidSelectedData.value);
    return selectedData;
}

function DropDownList_SetSelection(clientID, selectionData) {
    var hidSelectedData = document.getElementById(clientID + "_hidSelectedData");
    if (!hidSelectedData) { return; }
    hidSelectedData.value = JSON.stringify(selectionData);
    if (hidSelectedData.onchange) {
        hidSelectedData.onchange();
    }
}

function DropDownList_Click(clientID, idx, isDirtable) {
    var ddpCfg = window[clientID + "_cfg"];
    var divList = document.getElementById(clientID + "_divList");
    if (!divList) { return; }
    var items = DropDownList_GetItems(clientID);
    var selectedData = DropDownList_GetSelection(clientID);

    // Deseleccionar elemento
    var selectedElements = divList.getElementsByClassName("dropDownItemSelected");
    for (var i = 0, n = selectedElements.length; i < n; i++) {
        ElementDelClass(selectedElements[i], "dropDownItemSelected");
    }

    // Seleccionar nuevo item
    var selectedItem = items[idx];
    IdElementAddClass(selectedItem.IDElement, "dropDownItemSelected");
    selectedData = { "selectedIndex": idx, "selectedValue": selectedItem.Value, "selectedText": selectedItem.Text };
    if (isDirtable) { markDirty(); }
    DropDownList_SetSelection(clientID, selectedData);
    DropDownPanel_SetText(ddpCfg, selectedItem.Text);
    DropDownPanel_Hide(ddpCfg);
    DropDownPanel_SetCssClassText(ddpCfg, selectedItem.CSSClass);
}
var DDL_C = DropDownList_Click;

function DropDownList_Multiselection_BuildSelection(clientID) {
    var items = DropDownList_GetItems(clientID);
    var divList = document.getElementById(clientID + "_divList");
    if (!divList) { return; }
    var chkItems = divList.getElementsByTagName("input");
    var j = 0;
    var text = "";
    var value = "";
    for (var i = 0, n = chkItems.length; i < n; i++) {
        var item = items[i];
        if (chkItems[i].checked) {
            if (j > 0) {
                text += ", ";
                value += ":";
            }
            text += item.Text;
            value += item.Value;
            j++;
        }
    }
    var selectedData = DropDownList_GetSelection(clientID);
    selectedData.selectedValues = value;
    DropDownList_SetSelection(clientID, selectedData);
    DropDownPanel_SetText(window[clientID + "_cfg"], text);
}

function DropDownList_Multiselection_CheckItem(clientID, idx, isDirtable) {
    if (isDirtable) { markDirty(); }
    DropDownList_Multiselection_BuildSelection(clientID);
}
var DDL_M_CI = DropDownList_Multiselection_CheckItem;

function DropDownList_GetValue(clientID) {
    var selectedData = DropDownList_GetSelection(clientID);
    return selectedData.selectedValue;
}

function DropDownList_GetText(clientID) {
    var selectedData = DropDownList_GetSelection(clientID);
    return selectedData.selectedText;
}

function DropDownList_BindOnchange(clientID, onChangeFunc) {
    var hidSelectedData = document.getElementById(clientID + "_hidSelectedData");
    if (hidSelectedData) {
        hidSelectedData.onchange = onChangeFunc;
    }
}

// ----------------------------------------------------------------------
// BaseDropDown

function BaseDropDown_GetValue(clientID) {
    return DropDownList_GetValue(clientID + "_ddl");
}

function BaseDropDown_GetText(clientID) {
    return DropDownList_GetText(clientID + "_ddl");
}

function BaseDropDown_BindOnchange(clientID, onChangeFunc) {
    return DropDownList_BindOnchange(clientID + "_ddl", onChangeFunc);
}

// ----------------------------------------------------------------------
// DropDownTreeView

function DropDownTreeView_ProcessCheckbox(cfg, elCheckbox) {
    if (elCheckbox.type.toLowerCase() !== 'checkbox') {
        return;
    }

    // Obtener el panel que contiene los nodos hijos
    var lastIndex = elCheckbox.id.lastIndexOf('CheckBox');
    var idChildsPanel = elCheckbox.id.substring(0, lastIndex) + 'Nodes';
    var elemChildsPanel = document.getElementById(idChildsPanel);
    if (elemChildsPanel) {
        // Procesar los checkboxes
        var inputs = elemChildsPanel.getElementsByTagName('INPUT');
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type.toLowerCase() == 'checkbox') {
                inputs[i].checked = elCheckbox.checked;
            }
        }
    }

    // Procesar nodos padre
    var elTreeView = document.getElementById(cfg.treeView);
    var elParent = GetParentByTagName('div', elCheckbox);
    while (elTreeView !== elParent) {
        var checkStatus = AllCheckboxChecked(elParent);
        var elPrev = elParent.previousSibling;

        var inputsParent = elPrev.getElementsByTagName("input");
        if (inputsParent.length > 0) {
            inputsParent[0].checked = checkStatus;
        }

        elParent = GetParentByTagName('div', elParent);
    }
}

// ----------------------------------------------------------------------
// CtrCheckYesNo

function CtrCheckYesNo_GetValue(clientID) {
    var rbYes = document.getElementById(clientID + "_rbYes");
    if (!rbYes.checked) {
        var rbNo = document.getElementById(clientID + "_rbNo");
        if (!rbNo.checked) {
            return null;
        }
        return false;
    }
    return true;
}

function CtrCheckYesNo_BindOnChange(clientID, onChangeFunc) {
    var rbYes = document.getElementById(clientID + "_rbYes");
    if (rbYes) {
        rbYes.onchange = onChangeFunc;
    }
}

// ----------------------------------------------------------------------
// NumericTextBox

// Inicializar algunas constantes de teclado
if (typeof KeyEvent === 'undefined') {
    KeyEvent = {};
}
if (!KeyEvent.DOM_VK_SUBTRACT) {
    KeyEvent.DOM_VK_SUBTRACT = 109;
}
if (!KeyEvent.DOM_VK_HYPHEN_MINUS) {
    KeyEvent.DOM_VK_HYPHEN_MINUS = 173;
}
if (!KeyEvent.DOM_VK_DASH) {
    KeyEvent.DOM_VK_DASH = 189;
}
if (!KeyEvent.DOM_VK_COMMA) {
    KeyEvent.DOM_VK_COMMA = 188;
}
if (!KeyEvent.DOM_VK_PERIOD) {
    KeyEvent.DOM_VK_PERIOD = 190;
}

function IsDash(keyCode) {
    return (keyCode === KeyEvent.DOM_VK_DASH ||
        keyCode === KeyEvent.DOM_VK_SUBTRACT ||
        keyCode === KeyEvent.DOM_VK_HYPHEN_MINUS);
}

function NumericTextBox_CheckInteger(event, sender, allowNegative) {
    event = event || window.event // IE support
    var ctrlDown = event.ctrlKey || event.metaKey // Mac support
    var key = event.charCode || event.keyCode || 0;

    if (!ctrlDown || !event.altKey) {
        if (ctrlDown && event.key === 'c') return true; // Ctrl+C
        if (ctrlDown && event.key === 'x') return true; // Ctrl+X
        if (ctrlDown && event.key === 'v') return true; // Ctrl+V
        if (ctrlDown && event.key === 'z') return true; // Ctrl+Z
    }

    if ((key >= 48 && key <= 57 && event.shiftKey == false) ||
        // 0-9 numbers
        (event.keyCode >= 96 && event.keyCode <= 105 && event.shiftKey == false) ||
        // 0-9 numbers (the numeric keys at the right of the keyboard)
        (key >= 37 && key <= 40) || // Left, Up, Right and Down
        key == 8 || // backspace ASCII
        key == 9 || // tab ASCII
        key == 16 || // shift
        key == 17 || // control
        key == 35 || // End
        key == 36 || // Home
        key == 46) // delete ASCII
        return true;
    else if (IsDash(key)) {
        if (allowNegative == false || sender.value.indexOf('-', 0) > -1)
            return false;
        else
            return true;
    } else
        return false;
}
function NumericTextBox_FilterInteger(event, sender) {
    var text = sender.value.replace(/[^\d-]/g, '');

    // Corregir el signo
    if (text.indexOf('-', 0) > 0) {
        text = text.split("-").join("");
    } else {
        var n = text.indexOf("-");
        text = text.substring(0, n + 1) + text.substring(n + 1).split("-").join("");
    }

    if (sender.value !== text) {
        sender.value = text;
        return false;
    }
    return true;
}

function NumericTextBox_CheckDecimal(event, sender, numberOfInteger, numberOfFrac, decimalSeparator, allowNegative) {
    event = event || window.event // IE support
    var ctrlDown = event.ctrlKey || event.metaKey // Mac support
    var key = event.charCode || event.keyCode || 0;
    var valueArr;

    if (!ctrlDown || !event.altKey) {
        if (ctrlDown && event.key === 'c') return true; // Ctrl+C
        if (ctrlDown && event.key === 'x') return true; // Ctrl+X
        if (ctrlDown && event.key === 'v') return true; // Ctrl+V
        if (ctrlDown && event.key === 'z') return true; // Ctrl+Z
    }

    if ((key >= 37 && key <= 40) || // Left, Up, Right and Down
        key == 8 || // backspace ASCII
        key == 9 || // tab ASCII
        key == 16 || // shift
        key == 17 || // control
        key == 35 || // End
        key == 36 || // Home
        key == 46) // delete ASCII
        return true;
    else if (IsDash(key)) {
        if (allowNegative == false || sender.value.indexOf('-', 0) > -1)
            return false;
        else
            return true;
    }

    valueArr = sender.value.split(decimalSeparator);
    var decimalSeparatorKeyCode = decimalSeparator === ',' ? 188 : 190;
    if (key == decimalSeparatorKeyCode) { // decimal separator
        if (valueArr[0] != null && valueArr[1] == null)
            return true;
        else
            return false;
    }

    if ((key >= 48 && key <= 57 && event.shiftKey == false) ||
        // 0-9 numbers
        (key >= 96 && key <= 105 && event.shiftKey == false)) {
        // 0-9 numbers (the numeric keys at the right of the keyboard)
        if (valueArr[1] == null) {
            if (valueArr[0].indexOf('-', 0) > -1)
                numberOfInteger++;

            if (valueArr[0].length <= numberOfInteger)
                return true;
        } else {
            if (valueArr[1].length <= numberOfFrac)
                return true;
        }
    }

    return false;
}
function NumericTextBox_FilterDecimal(event, sender, decimalSeparator) {
    var text = sender.value;
    if (decimalSeparator !== ".") {
        text = text.split(decimalSeparator).join(".");
    }
    text = text.replace(/[^\d.-]/g, '');

    // Eliminar todos los puntos, excepto el primero
    var n = text.indexOf(".");
    text = text.substring(0, n + 1) + text.substring(n + 1).split(".").join("");

    // Corregir el signo
    if (text.indexOf('-', 0) > 0) {
        text = text.split("-").join("");
    } else {
        var n = text.indexOf("-");
        text = text.substring(0, n + 1) + text.substring(n + 1).split("-").join("");
    }

    if (sender.value !== text) {
        if (decimalSeparator !== ".") {
            text = text.split(".").join(decimalSeparator);
        }
        sender.value = text;
        return false;
    }
    return true;
}

function NumericTextBox_CheckNegative(event, sender) {
    var key = event.charCode || event.keyCode || 0;
    if (IsDash(key)) {
        if (sender.value.indexOf('-', 0) > 0)
            sender.value = sender.value.replace('-', '');
    }
}

function NumericTextBox_GetValue(clientID) {
    var value = 0;
    var textBox = document.getElementById(clientID);
    if (textBox) {
        value = parseFloat(Number(textBox.value.split(',').join('.')));
    }
    return value;
}

// ----------------------------------------------------------------------
// CommonFindControl

function CommonFindControl_GetInfo(idInfo) {
    var elemInfo = document.getElementById(idInfo);
    if (!elemInfo) { return null; }
    var infoArray = elemInfo.value.split(":");
    return {
        Idx: parseInt(infoArray[0]),
        Max: parseInt(infoArray[1]),
        Visible: parseInt(infoArray[2])
    };
}

function CommonFindControl_SetInfo(idInfo, info) {
    var elemInfo = document.getElementById(idInfo);
    if (!elemInfo) { return; }
    elemInfo.value = info.Idx + ":" + info.Max + ":" + info.Visible;
}

function CommonFindControl_Hide(cfg, disable) {
    var info = CommonFindControl_GetInfo(cfg.hidInfo);
    var elemDropDown = document.getElementById(cfg.divDropDown);
    if (!elemDropDown || !info) { return; }
    info.Visible = 0;
    CommonFindControl_SetInfo(cfg.hidInfo, info);
    if (elemDropDown.style.display !== "none") {
        FadeOut(cfg.divDropDown);
        var elemText = document.getElementById(cfg.txtFind);
        if (elemText && disable) {
            elemText.disabled = true;
        }
        return true;
    }
    return false;
}

function CommonFindControl_Show(cfg) {
    var info = CommonFindControl_GetInfo(cfg.hidInfo);
    var elemDropDown = document.getElementById(cfg.divDropDown);
    if (!elemDropDown || !info) { return; }
    info.Visible = 1;
    CommonFindControl_SetInfo(cfg.hidInfo, info);
    if (elemDropDown.style.display == "none") {
        FadeIn(cfg.divDropDown);

        // Determinar si hay que convertirlo en "DropUp"
        elemDropDown.style.top = "auto";
        var windowVisibleHeight = WindowHeight() + WindowScrollTop();
        var dropdownGeometry = IdElementGeometry(cfg.divDropDown);
        if (windowVisibleHeight < (dropdownGeometry.y + dropdownGeometry.height)) {
            elemDropDown.style.top = -dropdownGeometry.height + "px";
        }
        return true;
    }
    return false;
}

function CommonFindControl_CanAccept() {
    return ExitConfirmation_LinkClick();
}

function CommonFindControl_SetTextFromItem(cfg) {
    var info = CommonFindControl_GetInfo(cfg.hidInfo);
    var elemDropDown = document.getElementById(cfg.divDropDown);
    var elemText = document.getElementById(cfg.txtFind);
    if (!info || !elemDropDown) { return; }
    var listItems = elemDropDown.getElementsByClassName("dropDownItem");

    try {
        var el = listItems[info.Idx];
        if (el.textContent) {
            elemText.value = el.textContent;
        } else {
            elemText.value = el.innerText;
        }
    } catch (e) { }
}

function CommonFindControl_KeyUp(event, cfg) {
    var key = event.charCode || event.keyCode || 0;
    var info = CommonFindControl_GetInfo(cfg.hidInfo);
    if (!info) { return; }

    var elemDropDown = document.getElementById(cfg.divDropDown);
    var listItems = elemDropDown.getElementsByClassName("dropDownItem");

    if (key === 13) {
        // Return
        if (cfg.funcAccept) {
            if (cfg.isDirtable || CommonFindControl_CanAccept()) {
                CommonFindControl_SetTextFromItem(cfg);
                try { event.target.blur(); } catch (e) { }
                CommonFindControl_Hide(cfg, true);
                cfg.funcAccept();
            }
        }
        return;
    }

    if (key === 38 || key === 40) {
        // Up or Down
        if (info.Max > 0) {
            if (key === 38) {
                // Up
                info.Idx--;
                if (info.Idx < 0) { info.Idx = info.Max - 1; }
            }
            if (key === 40) {
                // Down
                info.Idx++;
                if (info.Idx >= info.Max) { info.Idx = 0; }
            }
            CommonFindControl_SetInfo(cfg.hidInfo, info);

            // Cambiar el estilo de la lista para indicar el seleccionado
            var classNameSelected = "dropDownItemSelected";
            for (var i = 0, len = listItems.length; i < len; i++) {
                var item = listItems[i];
                ElementDelClass(item, classNameSelected);
            }
            var el = listItems[info.Idx];
            ElementAddClass(el, classNameSelected);
        }
        return;
    }

    if (cfg.funcKeyUp) {
        CommonFindControl_Show(cfg);
        AddLoadingOverlay(cfg.divDropDown);
        cfg.funcKeyUp();
    }
}

function CommonFindControl_Focus(event, cfg) {
    var elemText = document.getElementById(cfg.txtFind);
    if (ElementHasClass(elemText, "textBoxPlaceholder")) {
        elemText.value = "";
        ElementDelClass(elemText, "textBoxPlaceholder");
    }
}

function CommonFindControl_Blur(event, cfg) {
    CommonFindControl_Hide(cfg, false);
    CommonFindControl_Reset(cfg);
}

function CommonFindControl_TemporalLoading(event, idPanel) {
    AddLoadingOverlay(idPanel);
}

function CommonFindControl_AutoCompleteClick(cfg, idx) {
    if (cfg.isDirtable || CommonFindControl_CanAccept()) {
        var info = CommonFindControl_GetInfo(cfg.hidInfo);
        info.Idx = idx;
        CommonFindControl_SetInfo(cfg.hidInfo, info);
        CommonFindControl_SetTextFromItem(cfg);
        CommonFindControl_Hide(cfg, true);
        cfg.funcAccept();
    }
}
var CFC_ACC = CommonFindControl_AutoCompleteClick;

function CommonFindControl_AutoHide(event, cfg) {
    var divSearch = document.getElementById(cfg.divSearch);
    var spanButtons = document.getElementById(cfg.spanButtons);
    if (divSearch.contains(event.target) === false ||
            spanButtons.contains(event.target)) {
        var hidding = CommonFindControl_Hide(cfg);
        if (hidding) {
            event.stopPropagation(); event.preventDefault();
            CommonFindControl_Reset(cfg)
        }
    }
}

function CommonFindControl_Reset(cfg) {
    var elemText = document.getElementById(cfg.txtFind);
    var elemOriginText = document.getElementById(cfg.hidOriginalTxtFind);
    elemText.value = elemOriginText.value;
    if (elemText.value === "") {
        elemText.value = cfg.placeholder;
        ElementAddClass(elemText, "textBoxPlaceholder");
    }
}

function CommonFIndControl_GetValue(clientID) {
    var hidValue = document.getElementById(clientID + "_hidValue");
    if (!hidValue) { return null; }
    return hidValue.value;
}

// ----------------------------------------------------------------------
// CustomFileUpload

function CustomFileUpload_ChangeText(fuDocumentElement, txtFilenameElement) {
    var fuDocument = document.getElementById(fuDocumentElement);
    var txtFilename = document.getElementById(txtFilenameElement);
    if (!fuDocument || !txtFilename) { return; }
    txtFilename.value = fuDocument.value;
}

function CustomFileUpload_Submit(loadingOverlayElement) {
    AddLoadingOverlay(loadingOverlayElement);
    //document.getElementById("aspnetForm").submit();
    window.setTimeout(function () {
        __doPostBack("", "");
    }, 20);
}

// ----------------------------------------------------------------------
// RichTextEditor

var RichTextEditor = (function () {
    var GetNodeIndex = function (n) { var i = 0; while (n = n.previousSibling) i++; return i }

    var GetRangePosition = function (element) {
        var range = window.getSelection().getRangeAt(0);
        var startContainer = range.startContainer, endContainer = range.endContainer;

        startContainers = [];
        while (startContainer !== element) {
            startContainers.push(GetNodeIndex(startContainer));
            startContainer = startContainer.parentNode;
        }

        endContainers = [];
        while (endContainer !== element) {
            endContainers.push(GetNodeIndex(endContainer));
            endContainer = endContainer.parentNode;
        }

        return {
            startContainer: startContainers,
            startOffset: range.startOffset,
            endContainer: endContainers,
            endOffset: range.endOffset
        };
    };

    var SetRangePosition = function (element, position) {
        var len, startContainer = element, endContainer = element;

        len = position.startContainer.length;
        while (len--) {
            startContainer = startContainer.childNodes[position.startContainer[len]];
        }

        len = position.endContainer.length;
        while (len--) {
            endContainer = endContainer.childNodes[position.endContainer[len]];
        }

        element.focus();
        try {
            var sel = window.getSelection();
            var range = sel.getRangeAt(0);
            range.setStart(startContainer, position.startOffset);
            range.setEnd(endContainer, position.endOffset);
            sel.removeAllRanges();
            sel.addRange(range);
        } catch (e) { }
    };

    var InsertHtmlOnCaret = function (html) {
        var sel, range;
        if (window.getSelection) {
            // IE9 and non-IE
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();

                // Range.createContextualFragment() would be useful here but is
                // only relatively recently standardized and is not supported in
                // some browsers (IE9, for one)
                var el = document.createElement("div");
                el.innerHTML = html;
                var frag = document.createDocumentFragment(), node, lastNode;
                while ((node = el.firstChild)) {
                    lastNode = frag.appendChild(node);
                }
                var firstNode = frag.firstChild;
                range.insertNode(frag);

                // Preserve the selection
                if (lastNode) {
                    range = range.cloneRange();
                    range.setStartAfter(lastNode);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        } else if ((sel = document.selection) && sel.type != "Control") {
            // IE < 9
            var originalRange = sel.createRange();
            originalRange.collapse(true);
            sel.createRange().pasteHTML(html);
        }
    };

    var RemoveElement = function (element) {
        if (element.parentNode) {
            element.parentNode.removeChild(element);
        }
    };

    var UpdateContent = function (element) {
        CleanDOM(element.RichTextEditor.pnlEditor, element.RichTextEditor.AllowedWhiteList);
        element.value = element.RichTextEditor.pnlEditor.innerHTML;
        if (element.RichTextEditor.CaretPositionDestination) {
            element.RichTextEditor.CaretPositionDestination.value =
                JSON.stringify(GetRangePosition(element.RichTextEditor.pnlEditor));
        }
    };

    var btnTool_Click = function (event) {
        if (this.command) {
            // https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
            document.execCommand(this.command, false, this.commandArgs);
            if (this.parent) {
                UpdateContent(this.parent);
            }
        }
        event.preventDefault();
        return false;
    };

    var CleanElement = function (element, allow) {
        var parent = element.parentNode;

        // Eliminar tags no permitidos
        var tag = element.nodeName.toLowerCase();
        if (allow.tags.indexOf(tag) === -1) {
            while (element.childNodes.length > 0) {
                parent.insertBefore(element.childNodes[0], element);
            }
            parent.removeChild(element);
            return;
        };

        // Eliminar atributos no permitidos
        var attrs = allow.attr[tag] || [];
        attrs = attrs.concat(allow.attr['*'] || [])
        for (var x = element.attributes.length - 1; x >= 0; x--) {
            var attr = element.attributes[x].name.toLowerCase();
            if (attr == 'style') {
                // Eliminar estilos no permitidos
                var allowed = allow.style[tag] || [];
                allowed = allowed.concat(allow.style['*'] || [])
                if (allowed.length == 0)
                    element.removeAttribute('style');
                else {
                    var cssText = '';
                    for (var i = 0; i < allowed.length; i++) {
                        var defined = element.style[allowed[i]];
                        if (defined)
                            cssText += allowed[i] + ':' + defined + ';';
                    }
                    if (cssText)
                        element.style.cssText = cssText;
                    else
                        element.removeAttribute('style');
                };
            } else if (attr == 'class') {
                // Eliminar clases no permitidas
                var allowed = allow.classNames[tag] || [];
                allowed = allowed.concat(allow.classNames['*'] || [])
                if (allowed.length == 0)
                    element.removeAttribute('class');
                else {
                    var classText = '';
                    var classes = element.className.split(" ");
                    for (var j = 0; j < classes.length; j++) {
                        for (var i = 0; i < allowed.length; i++) {
                            if (allowed[i] == classes[j]) {
                                if (classText) { classText += ' '; }
                                classText += allowed[i];
                            }
                        }
                    }
                    if (classText)
                        element.className = classText;
                    else
                        element.removeAttribute('class');
                };
            } else if (attrs.indexOf(attr) === -1) {
                element.removeAttribute(element.attributes[x].name);
            }
        }
    };

    var CleanDOM = function (element, allowed) {
        for (var i = 0; i < element.childNodes.length; i++) {
            var child = element.childNodes[i];
            if (child.nodeType == 1) {
                CleanElement(child, allowed);
            }
            if (child.nodeType != 1 && child.nodeType != 3) {
                var parent = child.parentNode;
                parent.removeChild(child);
            }
            CleanDOM(child, allowed);
        }
    };

    var AddToolbarButton = function (button, config) {
        var btn = document.createElement('div');
        btn.style['display'] = 'inline-block';
        btn.style['width'] = config.ButtonSize + 'px';
        btn.style['height'] = config.ButtonSize + 'px';
        btn.style['backgroundImage'] = 'url(' + config.Image + ')';
        btn.style['backgroundPosition'] = '-' + (config.ButtonSize * button.IconIdx) + 'px 0';
        btn.title = button.Tooltip;
        btn.command = button.Command;
        btn.commandArgs = button.CommandArgs;
        btn.parent = this;
        btn.onmousedown = btnTool_Click.bind(btn);
        btn.onmtouchstart = btnTool_Click.bind(btn);
        this.RichTextEditor.pnlToolbar.appendChild(btn);
        return btn;
    }

    var MergeObjects = function (objOrig, objAdd) {
        var objDest = {};
        for (var attrname in objOrig) {
            if (objOrig.hasOwnProperty(attrname)) {
                objDest[attrname] = objOrig[attrname];
            }
        }
        for (var attrname in objAdd) {
            if (objAdd.hasOwnProperty(attrname)) {
                objDest[attrname] = objAdd[attrname];
            }
        }
        return objDest;
    };

    var defaultConfig = {
        CssClass: "RichTextEditor",
        CssClassToolbar: "RichTextEditorToolbar",
        CssClassContent: "RichTextEditorContent",
        Toolbar: {
            Image: "RichTextEditor.png",
            ButtonSize: 18
        },
        ToolButtons: [
				{ IconIdx: 0, Tooltip: "Bold", Command: "Bold", CommandArgs: null },
				{ IconIdx: 1, Tooltip: "Italic", Command: "Italic", CommandArgs: null },
				{ IconIdx: 2, Tooltip: "Underline", Command: "Underline", CommandArgs: null },
				{ IconIdx: 3, Tooltip: "Strike through", Command: "strikeThrough", CommandArgs: null },
				{ IconIdx: 4, Tooltip: "Clean", Command: "removeFormat", CommandArgs: null },

				{ IconIdx: 5, Tooltip: "Justify left", Command: "justifyLeft", CommandArgs: null },
				{ IconIdx: 6, Tooltip: "Justify center", Command: "justifyCenter", CommandArgs: null },
				{ IconIdx: 7, Tooltip: "Justify right", Command: "justifyRight", CommandArgs: null },
				{ IconIdx: 8, Tooltip: "Justify full", Command: "justifyFull", CommandArgs: null },

				{ IconIdx: 9, Tooltip: "Ordered list", Command: "insertOrderedList", CommandArgs: null },
				{ IconIdx: 10, Tooltip: "Unordered list", Command: "insertUnorderedList", CommandArgs: null },
				{ IconIdx: 11, Tooltip: "Outdent", Command: "outdent", CommandArgs: null },
				{ IconIdx: 12, Tooltip: "Indent", Command: "indent", CommandArgs: null },

				{ IconIdx: 13, Tooltip: "Paragraph", Command: "formatBlock", CommandArgs: "<p>" },
				{ IconIdx: 14, Tooltip: "Header 1", Command: "formatBlock", CommandArgs: "<h1>" },
				{ IconIdx: 15, Tooltip: "Header 2", Command: "formatBlock", CommandArgs: "<h2>" },
				{ IconIdx: 16, Tooltip: "Header 3", Command: "formatBlock", CommandArgs: "<h3>" },

				{}
        ],
        AllowedWhiteList: {
            tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'ol', 'ul', 'li', 'p', 'br', 'b', 'strong', 'em', 'i', 'u', 'strike', 'span', 'a', 'div', 'img'],
            attr: {
                'a': ['href', 'target', 'name'],
                'img': ['src', 'alt', 'width', 'height'],
                '*': ['contenteditable', 'align']
            },
            style: {
                'img': ['width', 'height'],
                '*': ['text-decoration', 'text-align']
            },
            classNames: {}
        },
        OnFocus: null,
        Enabled: true,
        CanGrow: false
    };

    var OnResize = function () {
        this.RichTextEditor.pnlToolbar.display = "none";
        this.RichTextEditor.pnlEditor.display = "none";
        this.style.display = "";
        this.RichTextEditor.width = this.offsetWidth;
        this.RichTextEditor.height = this.offsetHeight;
        this.style.display = "none";

        this.RichTextEditor.pnlToolbar.display = "";
        this.RichTextEditor.pnlToolbar.style["width"] = (this.RichTextEditor.width + 'px');

        this.RichTextEditor.pnlEditor.display = "";
        this.RichTextEditor.pnlEditor.style["width"] = (this.RichTextEditor.width + 'px');
        if (this.RichTextEditor.CanGrow == false) {
            this.RichTextEditor.pnlEditor.style["height"] = (this.RichTextEditor.height + 'px');
        }
    }

    var FindElement = function (element) {
        if (typeof element == 'string' || element instanceof String) {
            element = document.getElementById(element);
        }
        return element;
    }

    var CreateFromTextArea = function (element, config) {
        element = FindElement(element);
        if (element.RichTextEditor) { return; }

        config || (config = defaultConfig);
        config.CssClass = config.CssClass || defaultConfig.CssClass;
        config.CssClassToolbar = config.CssClassToolbar || defaultConfig.CssClassToolbar;
        config.CssClassContent = config.CssClassContent || defaultConfig.CssClassContent;
        config.Toolbar = config.Toolbar || defaultConfig.Toolbar;
        config.ToolButtons = config.ToolButtons || defaultConfig.ToolButtons;
        if (typeof config.OnFocus === 'undefined') {
            config.OnFocus = defaultConfig.OnFocus;
        }
        if (!config.AllowedWhiteList) {
            config.AllowedWhiteList = defaultConfig.AllowedWhiteList;
        } else {
            config.AllowedWhiteList.tags = config.AllowedWhiteList.tags || defaultConfig.AllowedWhiteList.tags;
            config.AllowedWhiteList.attr = MergeObjects(defaultConfig.AllowedWhiteList.attr, config.AllowedWhiteList.attr);
            config.AllowedWhiteList.style = MergeObjects(defaultConfig.AllowedWhiteList.style, config.AllowedWhiteList.style);
            config.AllowedWhiteList.classNames = MergeObjects(defaultConfig.AllowedWhiteList.classNames, config.AllowedWhiteList.classNames);
        }
        if (typeof config.Enabled === 'undefined') {
            config.Enabled = defaultConfig.Enabled;
        }
        if (typeof config.CanGrow === 'undefined') {
            config.CanGrow = defaultConfig.CanGrow;
        }

        element.RichTextEditor = {};
        element.RichTextEditor.width = element.offsetWidth;
        element.RichTextEditor.height = element.offsetHeight;
        element.RichTextEditor.CanGrow = config.CanGrow;
        element.RichTextEditor.AllowedWhiteList = config.AllowedWhiteList;
        element.RichTextEditor.OnFocus = config.OnFocus;
        element.style.display = "none";

        if (config.CaretPositionDestination) {
            element.RichTextEditor.CaretPositionDestination =
                document.getElementById(config.CaretPositionDestination);
        }

        // Crear contenedor
        var pnlContainer = document.createElement('DIV');
        pnlContainer.className = config.CssClass;
        element.parentNode.insertBefore(pnlContainer, element);
        element.RichTextEditor.pnlContainer = pnlContainer;

        // Crear la barra de herramientas
        var pnlToolbar = document.createElement('DIV');
        pnlToolbar.className = config.CssClassToolbar;
        pnlToolbar.style["width"] = (element.RichTextEditor.width + 'px');
        pnlContainer.appendChild(pnlToolbar);
        element.RichTextEditor.pnlToolbar = pnlToolbar;
        if (config.Enabled) {
            for (var i = 0; i < config.ToolButtons.length; i++) {
                var button = config.ToolButtons[i];
                if (button.Command) {
                    AddToolbarButton.call(element, button, config.Toolbar);
                }
            }
        }

        // Crear el panel principal
        var pnlEditor = document.createElement('DIV');
        pnlEditor.className = config.CssClassContent;
        pnlEditor.style["width"] = (element.RichTextEditor.width + 'px');
        if (config.CanGrow == false) {
            pnlEditor.style["height"] = (element.RichTextEditor.height + 'px');
        }
        pnlEditor.style["overflow"] = "auto";
        pnlContainer.appendChild(pnlEditor);
        element.RichTextEditor.pnlEditor = pnlEditor;
        pnlEditor.innerHTML = element.value;
        if (config.Enabled) {
            pnlEditor.contentEditable = true;
            try { document.execCommand("setCSSCreation", false, "false"); } catch (e) { }
            var upEvent = (function () {
                UpdateContent(this);
            }).bind(element);
            pnlEditor.onkeyup = upEvent;
            pnlEditor.onmouseup = upEvent;
            pnlEditor.ontouchend = upEvent;
            pnlEditor.onpaste = (function () {
                var that = this;
                window.setTimeout(function () {
                    UpdateContent(that);
                }, 0);
            }).bind(element);
        }
        pnlEditor.onfocus = (function () {
            if (this.RichTextEditor.OnFocus) {
                this.RichTextEditor.OnFocus.call(this);
            }
        }).bind(element);

        element.RichTextEditor.Focus = Focus.bind(element);
        element.RichTextEditor.Insert = Insert.bind(element);

        window.addEventListener("resize", OnResize.bind(element), false);
    };

    var RemoveFromTextArea = function (element) {
        element = FindElement(element);
        if (!element.RichTextEditor) { return; }

        element.value = element.RichTextEditor.pnlEditor.innerHTML;
        element.style.display = "";

        RemoveElement(element.RichTextEditor.pnlContainer);

        element.RichTextEditor = null;
    };

    var ToggleFromTextArea = function (element) {
        element = FindElement(element);
        if (element.RichTextEditor) {
            RemoveFromTextArea(element);
        } else {
            CreateFromTextArea(element);
        }
    };

    var Focus = function (element) {
        if (this && this.RichTextEditor) {
            element = this;
        } else {
            element = FindElement(element);
            if (!element.RichTextEditor) { return; }
        }

        if (element.RichTextEditor.CaretPositionDestination) {
            try {
                SetRangePosition(element.RichTextEditor.pnlEditor,
                    JSON.parse(element.RichTextEditor.CaretPositionDestination.value));
            } catch (e) { }
        } else {
            element.RichTextEditor.pnlEditor.focus();
        }
    };

    var Insert = function (element, text) {
        if (this && this.RichTextEditor) {
            element = this;
            text = element;
        } else {
            element = FindElement(element);
            if (!element.RichTextEditor) { return; }
        }

        try {
            element.RichTextEditor.Focus();
            InsertHtmlOnCaret(text);
            UpdateContent(element);
        } catch (e) { }
    };

    // Exportar metodos publicos
    return {
        CreateFromTextArea: CreateFromTextArea,
        RemoveFromTextArea: RemoveFromTextArea,
        ToggleFromTextArea: ToggleFromTextArea,
        Focus: Focus,
        Insert: Insert
    };
})();

// ----------------------------------------------------------------------
// CustomTextBox

var CustomTextBox = (function () {
    var GetCaretPosition = function (element) {
        if ('selectionStart' in element) {
            // Standard-compliant browsers
            return element.selectionStart;
        } else if (document.selection) {
            // IE
            element.focus();
            var sel = document.selection.createRange();
            var selLen = document.selection.createRange().text.length;
            sel.moveStart('character', -element.value.length);
            return sel.text.length - selLen;
        }
    };

    var SetCaretPosition = function (element, position) {
        element.focus();
        if (element.setSelectionRange) {
            element.setSelectionRange(position, position);
        } else {
            var range = element.createTextRange();
            range.moveEnd('character', position);
            range.moveStart('character', position);
            range.select();
        }
    };

    var FindElement = function (element) {
        if (typeof element == 'string' || element instanceof String) {
            element = document.getElementById(element);
        }
        return element;
    };

    var Update = function (element) {
        if (element.CustomTextBox.CaretPositionDestination) {
            element.CustomTextBox.CaretPositionDestination.value =
                GetCaretPosition(element).toString();
        }
    };

    var defaultConfig = {
        OnFocus: null,
        OnKeyUp: null,
        OnClientChange: null,
        OnChange: null,
        OnlyDeleteKeysFunc: false
    };

    var InitializeInput = function (element, config) {
        element = FindElement(element);
        if (element.CustomTextBox) { return; }

        config || (config = defaultConfig);
        if (typeof config.OnFocus === 'undefined') {
            config.OnFocus = defaultConfig.OnFocus;
        }
        if (typeof config.OnClientChange === 'undefined') {
            config.OnClientChange = defaultConfig.OnClientChange;
        }

        element.CustomTextBox = {};
        element.CustomTextBox.OnFocus = config.OnFocus;
        element.CustomTextBox.OnKeyUp = config.OnKeyUp;
        element.CustomTextBox.OnClientChange = config.OnClientChange;
        element.CustomTextBox.OnChange = config.OnChange;

        if (config.CaretPositionDestination) {
            element.CustomTextBox.CaretPositionDestination =
                document.getElementById(config.CaretPositionDestination);
        }

        if (config.OnlyDeleteKeys) {
            element.CustomTextBox.OnlyDeleteKeysFunc = function (event) {
                var key = event.charCode || event.keyCode || 0;
                // Desactivar todo menos retroceso y suprimir
                if (key === 8 || key === 46) {
                    return true;
                }
                if (event.returnValue) event.returnValue = false;
                if (event.keyCode) event.keyCode = 0;

                return false;
            };
        }

        element.onchange = (function (event) {
            if (this.CustomTextBox.OnClientChange) {
                this.CustomTextBox.OnClientChange.call(this);
            }
            if (this.CustomTextBox.OnChange) {
                this.CustomTextBox.OnChange.call(this);
            }
            markDirty();
            return true;
        }).bind(element);
        element.onkeyup = (function (event) {
            Update(this);
            if (this.CustomTextBox.OnlyDeleteKeysFunc) {
                return this.CustomTextBox.OnlyDeleteKeysFunc.call(this, event);
            }
            if (this.CustomTextBox.OnKeyUp) {
                this.CustomTextBox.OnKeyUp.call(this);
            }
            return true;
        }).bind(element);
        element.onkeydown = (function (event) {
            if (this.CustomTextBox.OnlyDeleteKeysFunc) {
                return this.CustomTextBox.OnlyDeleteKeysFunc.call(this, event);
            }
            return true;
        }).bind(element);
        var updateEvent = (function () {
            Update(this);
        }).bind(element);
        element.onmouseup = updateEvent;
        element.ontouchend = updateEvent;
        element.onpaste = (function () {
            var that = this;
            window.setTimeout(function () {
                Update(that);
            }, 0);
        }).bind(element);
        element.onfocus = (function () {
            if (this.CustomTextBox.OnFocus) {
                this.CustomTextBox.OnFocus.call(this);
            }
        }).bind(element);

        element.CustomTextBox.Focus = Focus.bind(element);
        element.CustomTextBox.Insert = Insert.bind(element);
    };

    var Focus = function (element) {
        if (this && this.CustomTextBox) {
            element = this;
        } else {
            element = FindElement(element);
            if (!element.CustomTextBox) { return; }
        }

        if (element.CustomTextBox.CaretPositionDestination) {
            try {
                SetCaretPosition(element, parseInt(element.CustomTextBox.CaretPositionDestination.value));
            } catch (e) { }
        } else {
            element.focus();
        }
    };

    var Insert = function (element, text) {
        if (this && this.CustomTextBox) {
            element = this;
            text = element;
        } else {
            element = FindElement(element);
            if (!element.CustomTextBox) { return; }
        }

        try {
            element.CustomTextBox.Focus();
            var position = GetCaretPosition(element);
            element.value = (element.value.slice(0, position) + text + element.value.slice(position));
            SetCaretPosition(element, position + text.length);
            Update(element);
        } catch (e) { }
    };

    // Exportar metodos publicos
    return {
        InitializeInput: InitializeInput,
        Focus: Focus,
        Insert: Insert
    };
})();

// ----------------------------------------------------------------------
// CustomLocalReportViewer

function CustomLocalReportViewer_FixCollapsedImages() {
    var listImages = Array.prototype.slice.call(document.getElementsByTagName("img"));
    var listColapsedImages = listImages.filter(
		function (img) {
		    if (img.width == 1 && img.naturalWidth > 1) {
		        return img;
		    }
		});
    listColapsedImages.forEach(
		function (img) {
		    var scale = img.height / img.naturalHeight;
		    img.width = img.naturalWidth * scale;
		});
}