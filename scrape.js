var page = require('webpage').create();
//delete this
var fs = require('fs');
//
var url = 'http://www.kimmelonestop.nyu.edu/VirtualEMS/BrowseEvents.aspx';
var events = [];

page.open(url, function(status) {
console.log('Status:' + status);
if(status === 'success') {
  console.log('Waiting for page load...');
  window.setTimeout(function(){
    page.evaluate(function(){
      document.getElementById("tab2-tab").click();
  });
    console.log('Waiting for page load..');
    setTimeout(function() {

        //delete this
        page.render('output.png');
        //
        parse(page.content);
        exit();
    }, 15000);
  }, 5000);
}
else {
  exit();
}
});

function parse(html){
  var temp;
  var table = html.slice(
    html.indexOf('summary="A table of events"'),
    html.indexOf('</table>',html.indexOf('summary="A table of events"')));
  var ev = table.split('data-tipid');
  for(var i = 1; i < ev.length; i++){
    ev[i] = ev[i].split('<td');

    var obj = {
      start: '',
      end: '',
      name: '',
      location: '',
      customer: '',
      print: function() {
        return this.start + ' ' + this.end + ' ' + this.name + ' ' + this.location + ' ' + this.customer;
      }
    };

    obj.start = ev[i][0].slice(ev[i][0].indexOf('>') + 1, ev[i][0].indexOf('</td'));
    obj.end = ev[i][1].slice(ev[i][1].indexOf('>') + 1, ev[i][1].indexOf('</td'));
    obj.name = ev[i][2].slice(ev[i][2].indexOf('>') + 1, ev[i][2].indexOf('</td'));

    temp = ev[i][3].slice(ev[i][3].indexOf('>') + 1, ev[i][3].indexOf('</td'));
    obj.location = temp.slice(temp.indexOf('>') + 1, temp.indexOf('</a>'));

    temp = ev[i][4].slice(ev[i][4].indexOf('>') + 1, ev[i][4].indexOf('</td'));
    obj.customer = temp.slice(temp.indexOf('>') + 1, temp.indexOf('</a>'));
    events.push(obj);
  }
  //delete this
  fs.write('table.txt', events, 'w');
  //
};

function exit() {
  console.log('Done');
  phantom.exit();
};


