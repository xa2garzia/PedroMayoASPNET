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

function strip(html) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
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

function markDirty() {
    setDirty("1");
    g_isSubmit = false;
    g_isMenuChange = false;
    return true;
}

function setDirty(dirty) {
    if (typeof (exitConfirmationConfig) === 'undefined') { return; }
    var hidDirty = document.getElementById(exitConfirmationConfig.idHidDirty);
    if (hidDirty) {
        hidDirty.value = dirty;
    }
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