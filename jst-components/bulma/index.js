function _extend(obj, props) {
    if (obj == undefined) obj = {};
    for (var i in props) 
        obj[i] = typeof obj[i] == "object" && typeof props[i] == "object" ? _extend(obj[i], props[i]) : obj[i] || props[i];
    return obj;
}

var Navbar = function transform(obj) {
    obj[1] = obj[1] || {};
    return  [ "div"
            , _extend({"className": "navbar "+(obj[1].className||""), role: "navigation", "area-label": "main navigation"},obj[1])
            , obj[2]];
}

var NavbarBurger = function transform(obj) {
    obj[1] = obj[1] || {};
    return   [ "a"
             , _extend({ "className": "navbar-burger "+(obj[1].className||""), "role": "button", "aria-label": "menu", "aria-expanded":"true"}, obj[1])
             , [ ["span", {"areahidden": "true"}], ["span", {"areahidden": "true"}], ["span", {"areahidden": "true"}] ] 
             ];
}

var NavbarMenu = function transform(obj) {
    obj[1] = obj[1] || {};
    return   [ "div"
             , _extend({ "className": "navbar-menu "+(obj[1].className||"")}, obj[1])
             , obj[2] 
             ];
}

var NavbarStart = function transform(obj) {
    obj[1] = obj[1] || {};
    return   [ "div"
             , _extend({ "className": "navbar-start "+(obj[1].className||"")}, obj[1])
             , obj[2] 
             ];
}

var NavbarEnd = function transform(obj) {
    obj[1] = obj[1] || {};
    return   [ "div"
             , _extend({ "className": "navbar-end "+(obj[1].className||"")}, obj[1])
             , obj[2] 
             ];
}

var NavbarItem = function transform(obj) {
    obj[1] = obj[1] || {};
    return   [ "div"
             , _extend({ "className": "navbar-item has-dropdown is-hoverable "+(obj[1].className||"")}, obj[1])
             , obj[2] 
             ];
}

var NavbarItemLink = function transform(obj) {
    obj[1] = obj[1] || {};
    return   [ "a"
             , _extend({ "className": "navbar-item has-dropdown is-hoverable "(obj[1].className||"")}, obj[1])
             , obj[2] 
             ];
}

var NavbarLink = function transform(obj) {
    obj[1] = obj[1] || {};
    return   [ "div"
             , _extend({ "className": "navbar-link "+(obj[1].className||"")}, obj[1])
             , obj[2] 
             ];
}

var NavbarDropdown = function transform(obj) {
    obj[1] = obj[1] || {};
    return   [ "div"
             , _extend({ "className": "navbar-dropdown "+(obj[1].className||"")}, obj[1])
             , obj[2] 
             ];
}

export { Navbar, NavbarBurger, NavbarMenu, NavbarStart, NavbarEnd, NavbarItem, NavbarItemLink, NavbarDropdown, NavbarLink };