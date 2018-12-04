import { Context } from '@appfibre/jst';


if (document.head) {
    var jstContext = new Context({supportsAsync: false, requireAsync: false});
    jstContext.load(location.search.substr(1), true, false).then(value => {
        jstContext.run(value).then(output => {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.text = output;
            if (document.head)
                document.head.appendChild(script);
        }, reason => {
            var pre = document.createElement('pre');
            pre.style.color = 'red';
            pre.innerText = reason;
            document.body.appendChild(pre);
        });

    }, reason => {
        var pre = document.createElement('pre');
            pre.style.color = 'red';
            pre.innerText = reason;
            document.body.appendChild(pre);
    });
}

/*
var script = document.createElement('script');
script.src = location.search.substr(1);
script.type = 'text/javascript';
if (document.head) document.head.appendChild(script);
*/