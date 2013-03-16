var socket = io.connect('http://localhost:64755/');
socket.on('news', function (data) {
    var html = '<p>' + data.news + '</p>';
    document.getElementById('output').innerHTML += html;
    
    if (data.news == 'world')
    {
        socket.emit('echo', { back: 'reply' });
    }
});