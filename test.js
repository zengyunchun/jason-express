function render(obj) {
    let tpl = ``;
    with (obj) {
        tpl += ``;
        if (user) {
            tpl += `hello ${user.name}`;
        } else {
            tpl += `hello guest`;
        }
        tpl += ``;
    }
    return tpl;
}